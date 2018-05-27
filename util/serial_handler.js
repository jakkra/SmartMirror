const SerialPort = require('serialport');
let openedPort;

SerialPort.list(function(err, ports) {
  ports.forEach(port => {
    if (port.manufacturer && port.manufacturer.includes('arduino')) {
      console.log(port);
      openedPort = new SerialPort(port.comName, err => {
        if (err) {
          return console.log('Error: ', err.message);
        }
      });
    }
  });
});

const self = (module.exports = {
  writeString: function(text) {
    if (openedPort !== null) {
      openedPort.write(text, function(err) {
        if (err) {
          return console.log('Error on write: ', err.message);
        }
      });
    }
  },

  setOutletOff: function(outletsOff) {
    outletsOff.forEach((outletId, i) => {
      setTimeout(function() {
        self.writeString(`outlet:${outletId}:0`);
      }, (i + 1) * 3000);
    });
  },

  setOutletOn: function(outletsOn) {
    outletsOn.forEach((outletId, i) => {
      setTimeout(function() {
        self.writeString(`outlet:${outletId}:1`);
      }, (i + 1) * 3000);
    });
  },

  turnOffLedstrip: function() {
    self.writeString('rgb:0:0:0');
  },

  turnOnLedstrip: function() {
    self.writeString('rgb:200:100:100');
  },
});
