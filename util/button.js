const Gpio = require('onoff').Gpio;
const button = new Gpio(12, 'in', 'both');
let currentValue = 0;
let waitingLong = false;
let longLongTimer;
let longTimer;

module.exports = {
	start: function(callbackShort, callbackLong, callbackLongLong, longPressTime) {
		var self = this;
		button.watch(function (err, value) {
		  if (err) {
		  	console.log('error read button from gpio', err);
		    throw err;
		  }
		  if (value === 1) {
		  	waitingLong = true;
		  	currentValue = 1;
		  	clearTimeout(longTimer);
		  	clearTimeout(longLongTimer);
		  	setTimeout(() => {
		  		if (waitingLong) {
		  			callbackLong();
		  		}
		  	}, longPressTime);
				longLongTimer = setTimeout(() => {
		  		if (waitingLong) {
		 				callbackLongLong()
		  		}
		  	}, longPressTime * 2);
		  } else {
		  	currentValue = 0;
		  	waitingLong = false;
		  	clearTimeout(longLongTimer);
		  }
		  console.log('button change', value);
		});
	},
	exit:function() {
		console.log('Exit motion and unregister');
		button.unexport();
	}
}


