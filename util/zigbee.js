const http = require('http');
const ZHerdsman = require('zigbee-herdsman');
const { zigbeeUsb, zigbeeDbPath, sonosIp } = require('../config');
const zigbeeConfig = require('../zigbee_config');

const { Sonos } = require('sonos')
const buttons = {};

const LongPressAction = {
  SONOS: 'SONOS',
  BRIGHTNESS: 'WLED_BRIGHTNESS',
};

// TODO for now only one button at a time support long pressing
let volumeTimerHandle = null;
let safetyVolumeTimerHandle = null;

console.log(buttons)

console.log(zigbeeUsb, zigbeeDbPath, zigbeeConfig);

const zserver = new ZHerdsman(zigbeeUsb, { dbPath: zigbeeDbPath});

zigbeeConfig.devices.forEach(device => {
  let ieeeAddr = device.ieeeAddr;
  const deviceSetup = device;

  switch (device.longPressFunctionality.type) {
    case 'sonos':
      deviceSetup['longPressAction'] = LongPressAction.SONOS;
      deviceSetup['sonosDevice'] = new Sonos(device.longPressFunctionality.sonosIp);
      break;
    case 'wledBrightness':
      deviceSetup['longPressAction'] = LongPressAction.WLED_BRIGHTNESS;
      deviceSetup['wledIp'] = device.longPressFunctionality.wledIp;
      break;
    default:
      console.log('Unknown device.longPressFunctionality.type ', device.longPressFunctionality);
  }

  buttons[ieeeAddr] = deviceSetup;
});

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
      handleOnOff(buttons[msg.endpoints[0].device.ieeeAddr], true);
      break;
    case 'cmdOff':
      handleOnOff(buttons[msg.endpoints[0].device.ieeeAddr], false);
      break;
    case 'cmdMoveWithOnOff':
      handleLongPressStart(true, buttons[msg.endpoints[0].device.ieeeAddr]);
      break;
    case 'cmdStopWithOnOff':
      handleVolumeChangeStop(buttons[msg.endpoints[0].device.ieeeAddr]);
      break;
    case 'cmdMove':
      handleLongPressStart(false, buttons[msg.endpoints[0].device.ieeeAddr]);
      break;
    default:
      console.log('Unknown');
      console.log(msg);
      break;
  }
});

function handleOnOff(button, isOn) {  
  const endpoints = isOn ? button.endpointsOn : button.endpointsOff;
  endpoints.forEach(url => {
    console.log(url);
    http.get(url, (res) => {
      console.log(res.statusCode)
    }).on('error', err => {
      console.log(err);
    });
  });
}

function handleLongPressStart(isUp, button) {
  try {
    switch (button.longPressAction) {
      case LongPressAction.SONOS:
        handleVolumeChangeStart(isUp, button);
        break;
      case LongPressAction.WLED_BRIGHTNESS:
        handleWledBrightness(isUp, button);
        break;
      default:
        console.error('Unknown longPressFunctionality.type ' + longPressFunctionality.type)
    }
    
  } catch (err) {
    console.log(err);
  }
}

async function handleWledBrightness(increaseBrightness, button) {
  const brightnessChange = increaseBrightness ? 25 : -25;
  const onUrl = `${button.wledIp}/win&T=1`;
  const brightnessUrl = `${button.wledIp}/win&A=~${brightnessChange}`;

  await http.get(onUrl)
  await http.get(brightnessUrl);
}


async function changeVolume(sonosDevice, percent) {
  return sonosDevice.getVolume()
    .then(volume => sonosDevice.setVolume(volume + percent < 0 ? 0 : volume + percent))
}

async function handleVolumeChangeStart(isVolumeUp, button) {
  const sonosDevice = button.sonosDevice;

  if (volumeTimerHandle != null) {
    console.log("Something is really wrong");
    clearInterval(volumeTimerHandle);
  }

  if (safetyVolumeTimerHandle != null) {
    clearTimeout(safetyVolumeTimerHandle);
  }

  if (isVolumeUp) {
    const state = await sonosDevice.getCurrentState()
    if (state != 'playing') {
      await sonosDevice.play();
    }
  }

  await changeVolume(sonosDevice, isVolumeUp ? 2 : -4);

  volumeTimerHandle = setInterval(() => {
    changeVolume(sonosDevice, isVolumeUp ? 2 : -4)
      .catch(err => console.log(err));
  }, 500);

  // Incase button release message get lost for some reason, stop change after 5s if isVolumeUp
  if (isVolumeUp) {
    safetyVolumeTimerHandle = setTimeout(() => clearInterval(volumeTimerHandle), 5000);
  }
}

function handleVolumeChangeStop(isVolumeUp) {
  clearInterval(volumeTimerHandle);
  clearTimeout(safetyVolumeTimerHandle);
  volumeTimerHandle = null;
  safetyVolumeTimerHandle = null;
}

module.exports = {
  permitJoin: function(timeSeconds) {
    zserver.permitJoin(timeSeconds);
  },
  light: function(name, options) {
    return true;
  },
};