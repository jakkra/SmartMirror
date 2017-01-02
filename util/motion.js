const request = require('request');

const Gpio = require('onoff').Gpio;
const pir = new Gpio(18, 'in', 'both');

let prevValue = 0;
module.exports = {
	start: function() {
		var self = this;
		console.log('Init motion detector');
		pir.watch(function(err, value) {
		  if (err) return;
		  console.log('Motion detected ' + value);
		  if(value === 1 && prevValue === 0) {
		  	var options = {
				  url: 'https://radiant-wave-58367.herokuapp.com/api/surveillance',
				  headers: {
				    'x-access-token': 'eyJhbGciOiJIUzI1NiJ9.aWpha2tyYUBnbWFpbC5jb20.kukrD_C1oJizmCvBc5-UOoUJBevMKC1o0BXRChidL5E',
				  },
				  json: true,
				  body: {time: new Date().toISOString()}
				};
		  	request.post(options, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				    console.log(body)
				  }
				})
		  }
		});
	},
	exit:function() {
		console.log('Exit motion and unregister');
		pir.unexport();
	}
}


