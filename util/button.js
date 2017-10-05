const Gpio = require('onoff').Gpio;
const { gpioPins } = require('../config');
const button = new Gpio(gpioPins.button, 'in', 'both');
let currentValue = 0;
let waitingLong = false;
let waitingLongLong = false;
let waitingDouble = false;
let longLongTimer;
let longTimer;
let doublePressTime = 1000;
let lastClick = 0;

module.exports = {
  start: function(callbackShort, callbackLong, callbackLongLong, callbackDouble, longPressTime) {
    var self = this;
    button.watch(function (err, value) {
      if (err) {
        console.log('error read button from gpio', err);
        throw err;
      }
      if (value === 1) {
        if (Date.now() - lastClick < 1000) {
          callbackDouble();
        }
        lastClick = Date.now();
        waitingLong = true;
        waitingLongLong = true;
        currentValue = 1;
        clearTimeout(longTimer);
        clearTimeout(longLongTimer);
        longTimer = setTimeout(() => {
          if (waitingLong === true) {
            waitingLong = false;
            callbackLong();
          }
        }, longPressTime);
        longLongTimer = setTimeout(() => {
          if (waitingLongLong === true) {
            waitingLongLong = false;
            callbackLongLong();
          }
        }, longPressTime * 2);
      } else {
        if (waitingLong === true && waitingLongLong === true) {
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


