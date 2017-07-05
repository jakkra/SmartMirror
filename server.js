require('dotenv').config()

const exec = require('child_process').exec;

var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var app = expressWs.app;


const mirrorSocket = require('./util/mirror_socket')(expressWs);
const commandHandler = require('./speech/command_handler')(mirrorSocket);

const speech = require('./speech/stream.js');
const hotword = require('./speech/hot_word.js');

const hue = require('./util/hue.js');
const commands = require('./speech/command_classify')
const messages = require('./util/messages.js');
const requestHelper = require('./util/request_helper');
const serialHandler = require('./util/serial_handler');
const bounceGame = require('./util/BounceGame')(mirrorSocket, serialHandler);

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('port', (process.env.PORT || 3001))

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  console.log('In production');
  app.use(express.static('client/build'))
}

require('./routes')(app, mirrorSocket, serialHandler);

expressWs.app.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
      const obj = JSON.parse(msg);
      if (obj.event === 'bounce'){
        bounceGame.handleBounce(obj.data);
      }

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

app.get('/api/parse/:command', (req, res) => {
  if(!req.params.command) {
    res.json({
      success: false,
      message: 'Missing param: command',
    });
  }
  const command = commands.classifyCommand(req.params.command.toLowerCase());
  console.log(command);
  commandHandler.handle(command);
  res.redirect("/app");
});

hotword.initCallback(hotwordDetectedCallback);

hotword.listenForHotword();

function done(){
  hotword.listenForHotword();
  mirrorSocket.sendToClient('recording', {isRecording: false});
}

function hotwordDetectedCallback(){
  mirrorSocket.sendToClient('recording', {isRecording: true});
  speech.listen((param) => {
    console.log("_______" + new Date() + "_______");
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

if(process.env.target ==='PI'){
  const tempLogger = require('./util/temp_logger');
  const motionDetector = require('./util/motion');
  const buttonListener = require('./util/button');
  tempLogger.start();
  tempLogger.pollTemperature(1000 * 60, sendTemperatureToClient);

  motionDetector.start(() => {
    requestHelper.reportMotion();
    mirrorSocket.sendToClient('motion', {message: messages.getMessage()});
  });

  buttonListener.start(onShortButtonClicked, onLongButtonPressed, onLongLongButtonPressed, 3000);
}

function onShortButtonClicked(){
  hotword.stopRecord();
  hotwordDetectedCallback();
}

function onLongButtonPressed(){
  console.log('Long press!');
  exec("sudo tvservice -o");
}

function onLongLongButtonPressed(){
  console.log('Long Long press!');
  exec("sudo reboot");
}

function sendTemperatureToClient(readTemperature){
  mirrorSocket.sendToClient('temperature', { temperature: readTemperature });
}
