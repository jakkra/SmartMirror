'use strict';

const request = require('request');
require('dotenv').config({silent : true})
const speaker = require('../speech/amazon-polly-speaker');
const config = require('../config');


module.exports = {

	createReminder: function(date, text) {
		var self = this;
		var options = {
		  url: 'http://207.154.239.115/api/reminder/create',
		  headers: {
		    'x-access-token': process.env.RuleThemAllBackendAccessToken,
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
		    speaker.speak('Jag påminner dig att ' + text);
		  }
		})
	},

	logTemperature: function(temp) {
		var self = this;
		var options = {
		  url: 'http://207.154.239.115/api/temperature/',
		  headers: {
		    'x-access-token': process.env.RuleThemAllBackendAccessToken,
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
	},

	reportMotion: function() {
		var options = {
		  url: 'http://207.154.239.115/api/surveillance',
		  headers: {
		    'x-access-token': process.env.RuleThemAllBackendAccessToken,
		  },
		  json: true,
		  body: {time: new Date().toISOString()}
		};
  	request.post(options, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(body)
		  }
		})
	},

	// Wunderlist
	getTasks(callback){
		var options = {
		  url: 'https://a.wunderlist.com/api/v1/tasks?list_id=' + process.env.wunderlistListID,
		  headers: {
		    'X-Access-Token': process.env.wunderlistAccessToken,
		    'X-Client-ID': process.env.wunderlistClientID
		  }
		};

		request(options, function(err, resp, body){
		  if (!err && resp.statusCode === 200) {
			  const tasks = JSON.parse(body);
		    callback(tasks)
		  } else {
		    console.log('error', err);
		  }
		});
	},

	// Wunderlist
	createTask(title){
		var options = {
		  url: 'https://a.wunderlist.com/api/v1/tasks',
		  headers: {
		    'X-Access-Token': process.env.wunderlistAccessToken,
		    'X-Client-ID': process.env.wunderlistClientID,
		    'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
		  	list_id: parseInt(process.env.wunderlistListID), // Wunderlist requires it to be a number
		  	title: title
		  })
		};

		request.post(options, function(err, resp, body){
		  if (!err && resp.statusCode === 201) {
			  //const response = JSON.parse(body);
		    console.log(body);
		  } else {
		    console.log(body);
		    console.log('error', err);
		  }
		});
	},

	getForecast(callback){
		const longitude = config.SMHI_COORD.longitude;
		const lat = config.SMHI_COORD.latitude;
		console.log(longitude, lat)
		request
		.get('https://api.darksky.net/forecast/e6e170a4d778f0260cedd8d50877457d/'+ lat + ',' + longitude + '?lang=sv&units=si', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	let forecast = JSON.parse(body);
		    callback(forecast);
		  }
		})
	},

	getTemperatures(callback) {
		request
	  .get('http://207.154.239.115' + '/api/temperature/?unit=days&count=7&limit=168&token=' + process.env.RuleThemAllBackendAccessToken, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
		  	let temps = JSON.parse(body);
		    callback(temps.temperatures);
		  }
		})
	},

	/*fetchLimitedTemperatures(token, endDate, unit, count, limit) {
	  let url = 'http://207.154.239.115' + '/api/temperature/?token=' + process.env.RuleThemAllBackendAccessToken;
	  if (endDate) url = url + '&endDate=' + endDate;
	  if (unit) url = url + '&unit=' + unit;
	  if (count) url = url + '&count=' + count;
	  if (limit) url = url + '&limit=' + limit;

	  fetch(url)
	  .then(response => checkStatus(response))
	  .then(response => response.json())
	  .then(json => {
	    if (json.success === true) {
	      dispatch(fetchLimitTemperatureSuccess(json));
	    } else {
	      dispatch(fetchLimitTemperatureFailure(json));
	    }
	  })
	  .catch(error => dispatch(fetchLimitTemperatureFailure(error)));
	}
	*/
}
