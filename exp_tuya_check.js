const TuyAPI = require('tuyapi');

const device = new TuyAPI({
  id: '24468741d8f15b94491a',
  key: '45cda56426fda7a0'});
const colors = ["white", "yellow", "blue", "red", "green", "black", "brown", "azure", "ivory", "teal", "silver", "purple", "navyblue", "peagreen", "gray", "orange", "maroon", "charcoal", "aquamarine", "coral", "fuchsia", "wheat", "lime", "crimson", "khaki", "hotpink", "magenta", "olden", "plum", "olive", "cyan"];
(async () => {
  await device.find();

  await device.connect();
  let status = await device.get();
  console.log(`Current status: ${status}.`);

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
  for (let item of colors) {
    console.log(item);
    await device.set({
      multiple: true,
      data: {
        '21': 1000,
        '22': item
     }});
  //await device.set({dps:22,set:b});
  //await device.set({dps:21,set:item});
  console.log(`b: ${b}.`);
  //status = await device.get({schema: true});
  console.log(`dps22: ${status}.`);
  console.log(`dps22: ${status}.`);
  status = await device.get({dps: 21});
  console.log(`dps22: ${status}.`);
  }
}
//device.set({dps:22,set:1000});
}
  device.disconnect();
})();
