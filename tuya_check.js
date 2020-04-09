const TuyAPI = require('tuyapi');
var net = require('net');

const device = new TuyAPI({
id: '24468741d8f15b94491a',
key: '45cda56426fda7a0'});

let stateHasChanged = false;

// Find device on network
device.find().then(() => {
  // Connect to device
  device.connect();
});

var client = new net.Socket();
client.connect(12344, '127.0.0.1', function() {
	console.log('Connected to soundserver');
	//client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
  console.log('Received: ' + data);
  try {
    device.set({dps:22,set:data});
  }
  catch {
    function noop(){}
  }
	//client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Haww Connection closed');
});
client.on('error', function(e){
        console.log(e);
    });