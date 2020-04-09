const TuyAPI = require('tuyapi');

const device = new TuyAPI({
id: '24468741d8f15b94491a',
key: '45cda56426fda7a0'});

let stateHasChanged = false;

// Find device on network
device.find().then(() => {
  // Connect to device
  device.connect();
});

// set custom property
while(true)
{
device.set({dps: 22, set: 1000}).then(() => console.log('device was turned off')).catch(function(e) {
    console.log('uff');
});
}