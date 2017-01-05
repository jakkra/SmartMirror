// For google cloud speech
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = '/home/jakkra/Documents/MagicMirror-7bdbfab367e6.json';
process.env['GCLOUD_PROJECT'] = 'hazel-aria-120722';

var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
      console.log(msg);
    });
});

const speech = require('./speech/stream.js');
const hotword = require('./speech/hot_word.js');
const commands = require('./speech/command_classify');
//const tempLogger = require('./util/temp_logger');
//const motionDetector = require('./util/motion');
const hue = require('./util/hue.js');
const commandHandler = require('./speech/command_handler');

app.set('port', (process.env.PORT || 3001))


//server.listen(3000);
// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

app.get('/api/on', (req, res) => {
	hue.light('Closet', {on: true, brightness: 100});
  res.json({
    message: 'Light on'
  });
  var aWss = expressWs.getWss('/a');
  aWss.clients.forEach(function (client) {
    client.send(JSON.stringify({event: 'temperature', data: {temperature: 26.0}}));
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

hotword.initCallback(() => speech.listen((param) => {
if(param && param.results && param.results[0] && param.results[0].alternatives && param.results[0].alternatives[0]) {
	const result = param.results[0].alternatives[0];
	console.log(result.transcript);
	const command = commands.classifyCommand(result.transcript.toLowerCase());
	console.log(command);
  commandHandler.handle(command);
  hotword.listenForHotword();
}
}));
hotword.listenForHotword();

//tempLogger.start();
//motionDetector.start();
