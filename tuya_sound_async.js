const TuyAPI = require('tuyapi');
var net = require('net');

const device = new TuyAPI({
  id: '24468741d8f15b94491a',
  key: '45cda56426fda7a0'});

  try {
  await initDevice();
  } catch(e)
  {
      console.log('uffconnect')
  }
  switchBright();

  async function initDevice() {
    return new Promise((resolve, reject) => {
    
    device.find();
    device.connect();
    let status = device.get();
    console.log(`Current status: ${status}.`);
    });
}

async function switchBright() {
    while(1==1) {
        var i,b;
        for (i = 0; i < 20; i++) {
          if(i%2==0)
            b=1000;
          else b=10;
          await device.set({dps:22,set:b});
          console.log(`b: ${b}.`);
          status = await device.get({dps: 22});
          console.log(`dps22: ${status}.`);
        }
    }
}
