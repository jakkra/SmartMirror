var hue = require('node-hue-api'),
  HueApi = hue.HueApi,
  lightState = hue.lightState;

const { lights } = require('../config');
let rlights,
  groupAll,
  groups = [];

const hostname = process.env.HUE_HOSTNAME,
  username = process.env.HUE_USERNAME;

const api = new HueApi(hostname, username);

api.lights(function(err, result) {
  if (err) return;
  rlights = result.lights || [];
  rlights.map(light => {
    if (lights[light.name] && lights[light.name].autoOff) {
      initAutoOff(light, 1000 * 60 * 20);
    }
  });
});

api.groups(function(err, result) {
  if (err) throw err;
  groups = result;
  groupAll = groups.find(group => group.name === 'All');
});

function initAutoOff(light, ttl) {
  let waitingToTurnOff = false;
  let timerId;
  setInterval(() => {
    api.lightStatus(light.id, function(err, result) {
      if (err) throw err;
      if (result.state.reachable === true && result.state.on === true && waitingToTurnOff === false) {
        waitingToTurnOff = true;
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          api
            .setLightState(light.id, { on: false })
            .fail(displayError)
            .done(() => (waitingToTurnOff = false));
        }, ttl);
      } else if ((result.state.reachable === false || result.state.on === false) && waitingToTurnOff === true) {
        waitingToTurnOff = false;
        clearTimeout(timerId);
      }
    });
  }, 1000 * 30);
}

module.exports = {
  allLights: function(options) {
    const state = lightState.create(options);
    api
      .setGroupLightState(groupAll.id, state)
      .then(displayResult)
      .fail(displayError);
  },
  light: function(name, options) {
    const state = lightState.create(options);
    let chosenLight = rlights.find(light => light.name == name);
    if (!chosenLight) {
      return console.log('Light not found: ' + name);
    }
    api.setLightState(chosenLight.id, state);
  },
};

function displayResult(result) {
  console.log(JSON.stringify(result, null, 2));
}

function displayError(err) {
  console.log(err);
}
