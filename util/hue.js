var hue = require("node-hue-api"),
    HueApi = hue.HueApi,
    lightState = hue.lightState;

let lights, groups = [];
let bedroom, diningTable, closet, groupAll;

const hostname = process.env.HUE_HOSTNAME,
  username = process.env.HUE_USERNAME;

const api = new HueApi(hostname, username);

api.lights(function(err, result) {
    if (err) throw err;
    lights = result.lights;
		bedroom = lights.find((light) => light.name === 'Bedroom');
		diningTable = lights.find((light) => light.name === 'Dining Table');
		closet = lights.find((light) => light.name === 'Closet');
});

api.groups(function(err, result) {
    if (err) throw err;
    groups = result;
    groupAll = groups.find((group) => group.name === 'All');
});

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
