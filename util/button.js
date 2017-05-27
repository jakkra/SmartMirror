const Gpio = require('onoff').Gpio;
const button = new Gpio(12, 'in', 'rising');

module.exports = {
	start: function(callback) {
		var self = this;
		button.watch(function (err, value) {
		  if (err) {
		  	console.log('error read button from gpio', err);
		    throw err;
		  }
		  callback();
		  console.log('button change', value);
		});
	},
	exit:function() {
		console.log('Exit motion and unregister');
		button.unexport();
	}
}


