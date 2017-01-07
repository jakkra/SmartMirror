require('dotenv').config()
//process.env['GOOGLE_APPLICATION_CREDENTIALS'] = '/home/jakkra/Documents/MagicMirror-7bdbfab367e6.json';
//process.env['GCLOUD_PROJECT'] = 'hazel-aria-120722';

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
const messages = require('./util/messages.json');
const requestHelper = require('./request_helper');
const speaker = require('./speech/amazon-polly-speaker');

app.set('port', (process.env.PORT || 3001))

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

app.get('/api/test/:text', (req, res) => {
  if (req.params.text) speaker.speak(req.params.text);
  const rand = Math.floor(Math.random() * messages.length);
  const m = messages[rand];
  sendToClient('motion', {message: m});
	return;
});

app.get('/api/tasks', (req, res) => {
	requestHelper.getTasks((tasks) => {
    res.json({
      tasks: tasks
    });
	return;
  })
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

function sendToClient(event, data) {
  var aWss = expressWs.getWss('/a');
  aWss.clients.forEach(function (client) {
    client.send(JSON.stringify({event: event, data: data}));
  });
}

hotword.initCallback(() => {
  sendToClient('recording', {isRecording: true});
  speech.listen((param) => {
    console.log(param);
    if(param && param.results && param.results[0] && param.results[0].alternatives && param.results[0].alternatives[0]) {
      const result = param.results[0].alternatives[0];
      console.log(result.transcript);
      const command = commands.classifyCommand(result.transcript.toLowerCase());
      console.log(command);
      commandHandler.handle(command);

    }
  }, done)
}
);
hotword.listenForHotword();
function done(){
  console.log('________________DONE________________');
  hotword.listenForHotword();
  sendToClient('recording', {isRecording: false});
}


/*tempLogger.start();
motionDetector.start(() => {
  commandHandler.reportMotion();
  sendToClient('motion', {message: 'Motion detected'});
});
*/