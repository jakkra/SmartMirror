const Gpio = require('onoff').Gpio;
const { gpioPins } = require('../config');
const pir = new Gpio(gpioPins.pirSensor, 'in', 'both');

let prevValue = 0;
module.exports = {
	start: function(callback) {
		var self = this;
		console.log('Init motion detector');
		pir.watch(function(err, value) {
		  if (err) return;
		  console.log('Motion detected ' + value);
		  if(value === 1 && prevValue === 0) {
		  	callback();
		  }
		});
	},
	exit:function() {
		console.log('Exit motion and unregister');
		pir.unexport();
	}
}


