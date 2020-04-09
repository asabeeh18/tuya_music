from sys import byteorder
from array import array
from struct import pack
import time
import threading
import numpy
from Queue import Queue
import struct
import math
import socket
import sys

import pyaudio
import wave

SHORT_NORMALIZE = (1.0/32768.0)
THRESHOLD = 500
CHUNK_SIZE = 1024
FORMAT = pyaudio.paInt16
RATE = 44100

q = Queue()
lock = threading.Lock()

def is_silent(snd_data):
    "Returns 'True' if below the 'silent' threshold"
    return max(snd_data) < THRESHOLD

def normalize(snd_data):
    "Average the volume out"
    MAXIMUM = 16384
    times = float(MAXIMUM)/max(abs(i) for i in snd_data)

    r = array('h')
    for i in snd_data:
        r.append(int(i*times))
    return r

def trim(snd_data):
    "Trim the blank spots at the start and end"
    def _trim(snd_data):
        snd_started = False
        r = array('h')

        for i in snd_data:
            if not snd_started and abs(i)>THRESHOLD:
                snd_started = True
                r.append(i)

            elif snd_started:
                r.append(i)
        return r

    # Trim to the left
    snd_data = _trim(snd_data)

    # Trim to the right
    snd_data.reverse()
    snd_data = _trim(snd_data)
    snd_data.reverse()
    return snd_data

def add_silence(snd_data, seconds):
    "Add silence to the start and end of 'snd_data' of length 'seconds' (float)"
    r = array('h', [0 for i in range(int(seconds*RATE))])
    r.extend(snd_data)
    r.extend([0 for i in range(int(seconds*RATE))])
    return r

def get_rms( block ):
    # RMS amplitude is defined as the square root of the 
    # mean over time of the square of the amplitude.
    # so we need to convert this string of bytes into 
    # a string of 16-bit samples...

    # we will get one short out for each 
    # two chars in the string.
    count = len(block)/2
    format = "%dh"%(count)
    shorts = struct.unpack( format, block )

    # iterate over the block.
    sum_squares = 0.0
    for sample in shorts:
        # sample is a signed short in +/- 32768. 
        # normalize it to 1.0
        n = sample * SHORT_NORMALIZE
        sum_squares += n*n

    return math.sqrt( sum_squares / count )

def record():
    """
    Record a word or words from the microphone and 
    return the data as an array of signed shorts.

    Normalizes the audio, trims silence from the 
    start and end, and pads with 0.5 seconds of 
    blank sound to make sure VLC et al can play 
    it without getting chopped off.
    """
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT, channels=1, rate=RATE, input=True, output=True, frames_per_buffer=CHUNK_SIZE)
    #stream = p.open(format=FORMAT, channels=1, rate=RATE, input=True, output=True, frames_per_buffer=CHUNK_SIZE, input_device_index=1)

    num_silent = 0
    snd_started = False

    r = array('h')
    d= False
    count = 0
    print()
    print("break_now")
    data = stream.read(CHUNK_SIZE)
    
    #Server stuff
    # Create a TCP/IP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Bind the socket to the port
    server_address = ('localhost', 12344)
    print (sys.stderr, 'starting up on %s port %s' % server_address)
    sock.bind(server_address)
    # Listen for incoming connections
    sock.listen(1)
    
    # Wait for a connection
    print (sys.stderr, 'waiting for a connection')
    connection, client_address = sock.accept()
    print(sys.stderr, 'connection from', client_address)
    

    while True:
        data = stream.read(CHUNK_SIZE)
        linear_rms=str(int(get_rms(data)*1000))
        #blockLinearRms= numpy.sqrt(numpy.mean(data**2)) # Linear value between 0 -> 1
        #blockLogRms = 20 * math.log10(blockLinearRms) # Decibel (dB value) between 0 dB -> -inf dB   
        print(linear_rms)
        connection.sendall(linear_rms.encode())
        data = connection.recv(4)
        print(data)

    print('bahar aagye')
    sample_width = p.get_sample_size(FORMAT)
    stream.stop_stream()
    stream.close()
    p.terminate()

    r = normalize(r)
    r = trim(r)
    r = add_silence(r, 0.5)
    return sample_width, r

def record_to_file():
    with lock:
        """q.join()
        path = 'demo.wav'
        print('Filming!')"""
        sample_width, data = record()
        """
        data = pack('<' + ('h'*len(data)), *data)
        print('Saving........')

        wf = wave.open(path, 'wb')
        wf.setnchannels(1)
        wf.setsampwidth(sample_width)
        wf.setframerate(RATE)
        wf.writeframes(data)
        wf.close()
        print('Task Completing')"""
        q.task_done()

if __name__ == '__main__':
    t = threading.Thread(target=record_to_file)
    t.daemon=True
    try:
        t.start()
    except (e):
        print('exception me aagye')
        print(e)
        cleanup_stop_thread();
        sys.exit()
    print("You're live! Press Enter to finish.")
    input()
    q.put(1)
    q.join()
    print('Finished')
