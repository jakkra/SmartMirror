const http = require('http');
const ZHerdsman = require('zigbee-herdsman');
const { zigbeeUsb, zigbeeDbPath } = require('../config');
const zigbeeConfig = require('../zigbee_config');

console.log(zigbeeUsb, zigbeeDbPath, zigbeeConfig);

const zserver = new ZHerdsman(zigbeeUsb, { dbPath: zigbeeDbPath});

zserver.on('ready', function () {
  console.log('Zigbee is ready.');
});

zserver.on('permitJoining', function (joinTimeLeft) {
  console.log(joinTimeLeft);
});


zserver.start(function (err) {
  if (err)
    console.log(err);
});

zserver.on('ind', function (msg) {
  
  switch (msg.type) {
    case 'devIncoming':
      console.log('Device: ' + msg.data + ' joining the network!');
      msg.endpoints.forEach(function (ep) {
        console.log(JSON.stringify(ep.dump(), null, '\t'));
      });
      break;
    case 'devChange':
      console.log('Dev Change: ' + msg.data);
      break;
    case 'cmdOn':
      handleOnOff(msg.endpoints[0].device.ieeeAddr, true);
      break;
    case 'cmdOff':
      handleOnOff(msg.endpoints[0].device.ieeeAddr, false);
      break;
    default:
      console.log(msg);
      break;
  }
});

function handleOnOff(address, isOn) {
  console.log(address, isOn);
  zigbeeConfig.devices.forEach(device => {
    if (device.ieeeAddr == address) {
      const endpoints = isOn ? device.endpointsOn : device.endpointsOff;
      endpoints.forEach(url => {
        console.log(url);
        http.get(url, (res) => {
          console.log(res.statusCode)
        }).on('error', err => {
          console.log(err);
        });
      });
    }
  });
}

module.exports = {
  permitJoin: function(timeSeconds) {
    zserver.permitJoin(timeSeconds);
  },
  light: function(name, options) {
    
    return true;
  },
};