const TuyAPI = require('tuyapi');
var net = require('net');

const device = new TuyAPI({
id: '24468741d8f15b94491a',
key: '45cda56426fda7a0'});

let stateHasChanged = false;

// Find device on network
device.find().then(() => 
{
    console.log('found')
  // Connect to device
  device.connect().then(() => 
  {
    console.log('connected')
    for(i=0;i<50;i++)
    {
        if(i%2==0)
            b=10;
        else
            b=1000;

        device.set({dps:22,set:b}).then(() =>
            {
                device.get({dps: 22}).then(
                    status => console.log(status))
            });
    }
    /*
    var client = new net.Socket();
    client.connect(12344, '127.0.0.1', function() 
    {
        console.log('Connected to soundserver');
        //client.write('Hello, server! Love, Client.');   
        console.log('connected soundserver')

        client.on('data', function(data) 
        {
            console.log(`Current status: ${data}`);
            device.set({dps:22,set:data}).then(() =>
            {
                device.get({dps: 22}).then(
                    status => console.log(status))
            });

        });        
    });
    */
  });
});
