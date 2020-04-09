const TuyAPI = require('tuyapi');
var net = require('net');

const device = new TuyAPI({
id: '24468741d8f15b94491a',
key: '45cda56426fda7a0'});
var client = new net.Socket();

async function initAll()
{
    await device.find();
    await device.connect();
    console.log('device inited_in');
    await client.connect(12344, '127.0.0.1');
    console.log('socket inited-all init')
}
async function goAhead(data)
{
    data = parseInt(data,10)
    console.log('Received: ' + data);
    //await device.set({dps:22,set:data});
    status = await device.get({dps: 22});
    await device.set({dps:22,set:data});
}
initAll();
console.log('device inited_out');
console.log('go done')

client.on('data',async function(data) {
    await goAhead(data);
    client.write('next');
});

client.on('close', function() {
	console.log('Haww Connection closed');
});
client.on('error', function(e){
        console.log(e);
    });