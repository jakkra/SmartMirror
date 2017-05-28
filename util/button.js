const Gpio = require('onoff').Gpio;
const button = new Gpio(12, 'in', 'both');
let currentValue = 0;
let waitingLong = false;
let waitingLongLong = false;
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
		  	waitingLongLong = true;
		  	currentValue = 1;
		  	clearTimeout(longTimer);
		  	clearTimeout(longLongTimer);
		  	setTimeout(() => {
		  		if (waitingLong) {
		  			waitingLong = false;
		  			callbackLong();
		  		}
		  	}, longPressTime);
				longLongTimer = setTimeout(() => {
		  		if (waitingLongLong) {
		 				waitingLongLong = false;
		 				callbackLongLong();
		  		}
		  	}, longPressTime * 2);
		  } else {
		  	if (waitingLong && waitingLongLong) {
		  		waitingLong = false;
		  		callbackShort();
		  	}
		  	currentValue = 0;
		  	waitingLong = false;
		  	waitingLongLong = false;

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


