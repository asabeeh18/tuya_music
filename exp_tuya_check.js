const TuyAPI = require('tuyapi');
const cred = require('./creds.js');
const device = new TuyAPI({
id: cred.id,
key: cred.key});
const colors = ["brown", "azure", "ivory", "teal", "silver", "purple", "navyblue", "peagreen", "gray", "orange", "maroon", "charcoal", "aquamarine", "coral", "fuchsia", "wheat", "lime", "crimson", "khaki", "hotpink", "magenta", "olden", "plum", "olive", "cyan"];
Number.prototype.pad = function(n) {
  return new Array(n).join('0').slice((n || 2) * -1) + this;
};

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
  for (let item of colors) {
    await waiter();
    console.log(item);
/*    await device.set({
      multiple: true,
      data: {
        '21': 1000,
        '22': item
     }});
*/
  //await device.set({dps:22,set:b});
  status = await device.get({schema: true});
  console.log(`dps21: ${status}.`);
  await device.set({dps:21,set:"colour"});
  const t = setTimeout(() => {
    connection.break(reject); // is supposed to call the execute callback with an error
}, 10);
  for(j=0;j<100;j++)
  {
    await waiter();
    c=(j+10).pad(4)+"03e803e8"
    console.log(`colour: ${c}.`);
    await device.set({dps:24,set:c});
    status = await device.get({schema: true});
    console.log(`dps21: ${status}.`);
  }
  //console.log(`b: ${b}.`);
  //status = await device.get({schema: true});
  //console.log(`dps22: ${status}.`);
  //console.log(`dps22: ${status}.`);
  status = await device.get({dps: 21});
  console.log(`dps21: ${status}.`);
  
  }
}
//device.set({dps:22,set:1000});
}
  device.disconnect();
})();

async function waiter() {
  console.log("1");
  await new Promise(r => setTimeout(r, 5000));
  console.log("2");
}