// For google cloud speech
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = '/home/jakkra/MagicMirror-7bdbfab367e6.json';
process.env['GCLOUD_PROJECT'] = 'hazel-aria-120722';

const fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const speech = require('./speech/stream.js');
const hotword = require('./speech/hot_word.js');
const commands = require('./speech/command_classify');
//const tempLogger = require('./util/temp_logger');
//const motionDetector = require('./util/motion');
const hue = require('./util/hue.js');

app.set('port', (process.env.PORT || 3003));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/api/on', (req, res) => {
	hue.light('Closet', {on: true, brightness: 100});
  res.json({
    message: 'Light on'
  });
	return;
});

app.get('/api/off', (req, res) => {
	hue.light('Closet', {on: false, brightness: 100});
  res.json({
    message: 'Light off'
  });
	return;
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

io.on('connection', function(socket){
  console.log('A user connected');
});

hotword.initCallback(() => speech.listen((param) => {
	if(param && param.results && param.results[0] && param.results[0].alternatives && param.results[0].alternatives[0]) {
		const result = param.results[0].alternatives[0];
		console.log(result.transcript);
		const command = commands.classifyCommand(result.transcript.toLowerCase());
		console.log(command);

	}
}))

//tempLogger.start();
//motionDetector.start();
