require('dotenv').config({silent : true})

const exec = require('child_process').exec;
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

const mirrorSocket = require('./util/mirror_socket')(expressWs);
const commandHandler = require('./speech/command_handler')(mirrorSocket);

mirrorConfigFiles();

const config = require('./config');
let speech, hotword, commands, hue = null;

if (config.modules.googleCloudSpeech === true) {
  speech = require('./speech/stream.js');
  hotword = require('./speech/hot_word.js');
  commands = require('./speech/command_classify')
} 

const messages = require('./util/messages.js');
const requestHelper = require('./util/request_helper');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('port', (process.env.PORT || 3001))

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  console.log('In production');
  app.use(express.static('client/build'))
}

require('./routes')(app, mirrorSocket);

app.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
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

if (config.modules.googleCloudSpeech === true) {
  hotword.initCallback(hotwordDetectedCallback);

  hotword.listenForHotword();
}
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



if (process.env.target ==='PI' && config.modules.tempPirSensor === true){
  const tempLogger = require('./util/temp_logger');
  const motionDetector = require('./util/motion');
  const buttonListener = require('./util/button');
  tempLogger.start();
  tempLogger.pollTemperature(1000 * 60, sendTemperatureToClient);

  motionDetector.start(() => {
    requestHelper.reportMotion();
    mirrorSocket.sendToClient('motion', {message: messages.getMessage()});
  });

  buttonListener.start(onShortButtonClicked, onLongButtonPressed, onLongLongButtonPressed, onDoubleClick, 3000);
  
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

  function onDoubleClick() {
    console.log('Double click');
    exec("sudo tvservice -p; sudo chvt 6; sudo chvt 7;");
  }
}



function sendTemperatureToClient(readTemperature){
  mirrorSocket.sendToClient('temperature', { temperature: readTemperature });
}


function mirrorConfigFiles(){
  const fs = require('fs');
  let serverConfig = __dirname + '/config.js';
  let clientConfig = __dirname + '/client/src/config.js';
  // If the client config already exists, either it has been
  // created manually or already symlinked, so skip trying
  if(!fs.existsSync(clientConfig)){
    // Symbolically link the client and server config files to avoid
    // having to maintain two copies
    fs.symlinkSync(serverConfig, clientConfig);
  }
}
