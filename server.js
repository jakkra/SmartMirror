require('dotenv').config()

var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

const mirrorSocket = require('./util/mirror_socket')(expressWs);
const commandHandler = require('./speech/command_handler')(mirrorSocket);

const speech = require('./speech/stream.js');
const hotword = require('./speech/hot_word.js');

const hue = require('./util/hue.js');
const commands = require('./speech/command_classify')
const messages = require('./util/messages.js');
const requestHelper = require('./util/request_helper');


app.set('port', (process.env.PORT || 3001))

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  console.log('In production');
  app.use(express.static('client/build'))
}

require('./routes')(app, mirrorSocket);

app.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
      console.log(msg);
      if(process.env.target ==='PI'){ // Send current temperature when a client connects
        const tempLogger = require('./util/temp_logger');
        const temperature = tempLogger.getTemperature();
        sendTemperatureToClient(temperature);
      }
    });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});


hotword.initCallback(() => {
  mirrorSocket.sendToClient('recording', {isRecording: true});
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
  mirrorSocket.sendToClient('recording', {isRecording: false});
}

if(process.env.target ==='PI'){
  const tempLogger = require('./util/temp_logger');
  const motionDetector = require('./util/motion');
  tempLogger.start(sendTemperatureToClient);
  motionDetector.start(() => {
    requestHelper.reportMotion();
    mirrorSocket.sendToClient('motion', {message: messages.getMessage()});
  });
}

function sendTemperatureToClient(readTemperature){
  mirrorSocket.sendToClient('temperature', { temperature: readTemperature });
}