const Gpio = require('onoff').Gpio;
const pir = new Gpio(18, 'in', 'both');
const buttron = new Gpio(12, 'in', 'both');

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
		button.watch(function (err, value) {
		  if (err) {
		  	console.log('error read button from gpio', err);
		    throw err;
		  }
		  console.log('button change', value);
		});
	},
	exit:function() {
		console.log('Exit motion and unregister');
		pir.unexport();
	}
}


