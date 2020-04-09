const TuyAPI = require('tuyapi');

const device = new TuyAPI({
  id: '24468741d8f15b94491a',
  key: '45cda56426fda7a0'});

(async () => {
  await device.find();

  await device.connect();

  let status = await device.get();
  
  console.log(`Current status: ${status}.`);
status = await device.get({dps: 21});
while(1==1){
//console.log(`Current status: ${status}.`);
//status = await device.get({schema: true});
//device.set({dps: 20, set: false});
//device.set({dps: 20, set: true});
//device.set({dps: 21, set: "white"});
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
//device.set({dps:22,set:1000});
}
  device.disconnect();
})();
