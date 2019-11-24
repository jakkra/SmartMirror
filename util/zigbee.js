const http = require('http');
const ZHerdsman = require('zigbee-herdsman');
const { zigbeeUsb, zigbeeDbPath, sonosIp } = require('../config');
const zigbeeConfig = require('../zigbee_config');
const hue = require('./hue');

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
  deviceSetup['toggleStateIsOn'] = false;

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
      console.log('handleOnOff on');
      handleOnOff(buttons[msg.endpoints[0].device.ieeeAddr], true);
      break;
    case 'cmdOff':
      console.log('handleOnOff off');  
      handleOnOff(buttons[msg.endpoints[0].device.ieeeAddr], false);
      break;
    case 'cmdMoveWithOnOff':
      console.log('handleLongPressStart start');
      handleLongPressStart(true, buttons[msg.endpoints[0].device.ieeeAddr]);
      break;
    case 'cmdStopWithOnOff':
      console.log('handleVolumeChangeStop')
      handleVolumeChangeStop(buttons[msg.endpoints[0].device.ieeeAddr]);
      break;
    case 'cmdMove':
      console.log('handleLongPressStart down')
      handleLongPressStart(false, buttons[msg.endpoints[0].device.ieeeAddr]);
      break;
    case 'cmdStepWithOnOff':
      console.log('handleLevelButton up')
      handleLevelButton(true, buttons[msg.endpoints[0].device.ieeeAddr]);
      break;
    case 'cmdStep':
      console.log('handleLevelButton down')
      handleLevelButton(false, buttons[msg.endpoints[0].device.ieeeAddr]);
      break;
    case 'cmdStop':
      console.log('handleVolumeChangeStop');
      handleVolumeChangeStop(buttons[msg.endpoints[0].device.ieeeAddr]);
      break;
    case 'cmdTradfriArrowSingle':
      if (msg.data.data.value === 257) {
        console.log('handleArrowButton left');
        handleArrowButton(true, buttons[msg.endpoints[0].device.ieeeAddr]);
      } else if (msg.data.data.value === 256) {
        console.log('handleArrowButton right');
        handleArrowButton(false, buttons[msg.endpoints[0].device.ieeeAddr]);
      }
      break;
    case 'cmdTradfriArrowHold':
      if (msg.data.data.value === 3329) {
        console.log('handleArrowButtonLongPress left');
        handleArrowButtonLongPress(true, buttons[msg.endpoints[0].device.ieeeAddr]);
      } else if (msg.data.data.value === 3328) {
        console.log('handleArrowButtonLongPress right');
        handleArrowButtonLongPress(false, buttons[msg.endpoints[0].device.ieeeAddr]);
      }
      break;
    case 'cmdTradfriArrowRelease':
      handleArrowButtonLongPress(true, buttons[msg.endpoints[0].device.ieeeAddr]);
      break;
    case 'cmdToggle':
      handleToggle(buttons[msg.endpoints[0].device.ieeeAddr]);
      break;
    default:
      console.log('Unknown');
      console.log(msg);
      break;
  }
});

function handleActions(actions) {
  actions.forEach(action => {
    if (action.type === 'url') {
      console.log(action.url);
      http.get(action.url, (res) => {
        console.log(res.statusCode)
      }).on('error', err => {
        console.log(err);
      });
    } else if (action.type === 'hue') {
      console.log('handle Hue', action.action);
      if (action.action === 'on') {
        hue.light(action.name, { on: true })
      } else if (action.action === 'off') {
        hue.light(action.name, { on: false })
      } else if (action.action === 'briUp') {
        hue.light(action.name, { on: true, bri_inc: 100 })
      } else if (action.action === 'briDown') {
        hue.light(action.name, { on: true, bri_inc: -100 })
       } else {
        console.log('Unumplemented HUE action', action.action);
      }
    }
  });
}

function handleToggle(button) {
  button.toggleStateOn = !button.toggleStateOn;
  const endpoints = button.toggleStateOn ? button.endpointsToggleOn : button.endpointsToggleOff;
  handleActions(endpoints);
}

function handleArrowButtonLongPress(button) {
  console.log('Arrow long press started');
}

function handleArrowButton(isLeft, button) {
  const endpoints = isLeft ? button.endpointsLeft : button.endpointsRight;
  handleActions(endpoints);
}

function handleLevelButton(isUp, button) {
  const endpoints = isUp ? button.endpointsLevelUp : button.endpointsLevelDown;
  handleActions(endpoints);
}

function handleOnOff(button, isOn) {  
  const endpoints = isOn ? button.endpointsOn : button.endpointsOff;
  handleActions(endpoints);
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