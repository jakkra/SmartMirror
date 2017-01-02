
var sensor = require('ds18x20');
const request_helper = require('../request_helper');

module.exports = {
	start: function() {
		console.log("Starting module: " + this.name);
		sensor.isDriverLoaded(function (err, isLoaded) {
			console.log(isLoaded);
		  if(isLoaded === false) {
		   	sensor.loadDriver();
		  }
		  var self = this;			
			setInterval(function() {
				self.checkTemperature();
			}, this.config.updateTemperatureInterval);
		});

	}
};

function checkTemperature() {
	var listOfDeviceIds = sensor.list();
	if (listOfDeviceIds.length > 0) {
		var id = listOfDeviceIds[listOfDeviceIds.length - 1];
		var temperature = sensor.get(id);
		request_helper.logTemperature(temperature);
		console.log('Temp is: ' + temperature);
	};
}