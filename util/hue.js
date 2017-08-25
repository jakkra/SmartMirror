var hue = require("node-hue-api"),
  HueApi = hue.HueApi,
  lightState = hue.lightState;

let lights, groups = [];
let bedroom, diningTable, closet, groupAll;
let waitingToTurnOff = false;
let timeoutTimer;

const hostname = process.env.HUE_HOSTNAME,
  username = process.env.HUE_USERNAME;

const api = new HueApi(hostname, username);

api.lights(function(err, result) {
  if (err) return;
  lights = result.lights;
	bedroom = lights.find((light) => light.name === 'Bedroom');
	diningTable = lights.find((light) => light.name === 'Dining Table');
	closet = lights.find((light) => light.name === 'Closet');

	initAutoOffBathroom();
});


api.groups(function(err, result) {
  if (err) throw err;
  groups = result;
  groupAll = groups.find((group) => group.name === 'All');
});

function initAutoOffBathroom() {
	setInterval(() => {
		api.lightStatus(closet.id, function(err, result) {
	    if (err) throw err;
	    if (result.state.reachable === true && result.state.on === true && waitingToTurnOff === false) {
	    	waitingToTurnOff = true;
	    	clearTimeout(timeoutTimer);
				timeoutTimer = setTimeout(() => {
					api.setLightState(closet.id, { "on": false })
			    .fail(displayError)
			    .done(() => waitingToTurnOff = false);
				}, 60 * 20 * 1000);
	    } else if ((result.state.reachable === false || result.state.on === false) && waitingToTurnOff === true) {
	    	waitingToTurnOff = false;
	    	clearTimeout(timeoutTimer);
	    }
		});
	}, 1000 * 30);
}

module.exports = {
	allLights: function(options) {
		const state = lightState.create(options);
		api.setGroupLightState(groupAll.id, state).then(displayResult).fail(displayError);
	},
	light: function(name, options) {
		const state = lightState.create(options);
		switch (name) {
			case 'Bedroom':
				api.setLightState(bedroom.id, state);
				break;
			case 'Closet':
				api.setLightState(closet.id, state);
				break;
			case 'Dining Table':
				api.setLightState(diningTable.id, state);
				break;
			default:
				console.log('Light not found: ' + name);
		}
	},
}

function displayResult(result) {
  console.log(JSON.stringify(result, null, 2));
};

function displayError(err) {
  console.log(err);
};
