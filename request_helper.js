const request = require('request');

module.exports = {

	createReminder: function(date, text) {
		var self = this;
		var options = {
		  url: 'https://radiant-wave-58367.herokuapp.com/api/reminder/create',
		  headers: {
		    'x-access-token': 'eyJhbGciOiJIUzI1NiJ9.aWpha2tyYUBnbWFpbC5jb20.kukrD_C1oJizmCvBc5-UOoUJBevMKC1o0BXRChidL5E',
		  },
		  json: true,
		  body: {
		  	time: date,
		  	title: text,
		  	reminderActive: true
		  }
		};
		request.post(options, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(body)
		  }
		})
	},

	logTemperature: function(temp) {
		var self = this;
		var options = {
		  url: 'https://radiant-wave-58367.herokuapp.com/api/temperature/',
		  headers: {
		    'x-access-token': 'eyJhbGciOiJIUzI1NiJ9.aWpha2tyYUBnbWFpbC5jb20.kukrD_C1oJizmCvBc5-UOoUJBevMKC1o0BXRChidL5E',
		  },
		  json: true,
		  body: {
		  	temperature: temp
		  }
		};
		request.post(options, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(body)
		  }
		})
	}
}