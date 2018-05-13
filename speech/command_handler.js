module.exports = (mirrorSocket) => {
  const config = require('../config');
  const serialHandler = require('../util/serial_handler');
  const speaker = require('../speech/amazon-polly-speaker');
  const nodeSkanetraiken = require('node-skanetrafiken');

  const moment = require('moment');

  let hue = null;

  if (config.modules.philipsHue === true) {
    hue = require('../util/hue');
  }

  const SpeechCommand = require('./speech_command');
  const exec = require('child_process').exec;

  return {
    handle: function(command){
      let commandId;
      let data = null;
      if (typeof(command) === "object") {
        commandId = command.command;
        data = command.data;
      } else {
        commandId = command;
      }

      switch (commandId) {
        case SpeechCommand.LIGHTS_ON_ALL:
        console.log('all light on');
          hue.allLights({on: true, brightness: 100});
          break;
        case SpeechCommand.LIGHTS_OFF_ALL:
          hue.allLights({on: false, brightness: 100});
          break;
        case SpeechCommand.LIGHTS_ON_LIVING_ROOM:
          hue.light('Dining Table', {on: true, brightness: 100});
          break;
        case SpeechCommand.LIGHTS_OFF_LIVING_ROOM:
          hue.light('Dining Table', {on: false, brightness: 100});
          break;
        case SpeechCommand.LIGHTS_ON_WARDROBE:
          hue.light('Closet', {on: true, brightness: 100});
          break;
        case SpeechCommand.LIGHTS_OFF_WARDROBE:
          hue.light('Closet', {on: false, brightness: 100});
          break;
        case SpeechCommand.LIGHTS_ON_BEDROOM:
          hue.light('Bedroom', {on: true, brightness: 100});
          break;
        case SpeechCommand.LIGHTS_OFF_BEDROOM:
          hue.light('Bedroom', {on: false, brightness: 100});
          break;
        case SpeechCommand.LIGHTS_ON:
          break;
        case SpeechCommand.LIGHTS_OFF:
          break;
        case SpeechCommand.SHOW_NEWS:
          mirrorSocket.sendToClient('visibility', {component: 'news', visible: true});
          break;
        case SpeechCommand.HIDE_NEWS:
          mirrorSocket.sendToClient('visibility', {component: 'news', visible: false});
          break;
        case SpeechCommand.SHOW_FORECASTS:
          mirrorSocket.sendToClient('visibility', {component: 'forecasts', visible: true});
          break;
        case SpeechCommand.HIDE_FORECASTS:
          mirrorSocket.sendToClient('visibility', {component: 'news', visible: false});
          break;
        case SpeechCommand.CHANGE_NEWS_SOURCE:
          break;
        case SpeechCommand.NEXT_BUS:
         break;
        case SpeechCommand.NEXT_TRAIN:
        // TODO extract to seperate file and config
          const lundC = {
            id: '81216' ,
            name: 'Lund C' ,
            type: '0' ,
          };

          const malmoC = {
            id: '80000',
            name: 'Malmö C',
            type: '0',
          }

          nodeSkanetraiken.getJourneys({ from: lundC, to: malmoC, limit: 5, action: 'next' }, function(results, err) {
            if (!err) {
              let message = 'Kommande tåg till Malmö Central går om ';
              results.forEach((route, i, arr) => {
                const diffMs = (new Date(route.DepDateTime[0]) - new Date());
                const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                if (i < (arr.length - 1)) {
                  message += diffMins + ', ';
                } else {
                  message += 'och ' + diffMins + ' minuter';
                }
              });
              console.log(message);
              speaker.speak(message);
            }
          });
          break;
        case SpeechCommand.TURN_OFF:
          exec("sudo shutdown -h now");
        case SpeechCommand.SHOW_ARTICLES:
          mirrorSocket.sendToClient('visibility', {component: 'article', visible: true});
          break;
        case SpeechCommand.HIDE_ARTICLES:
          mirrorSocket.sendToClient('visibility', {component: 'article', visible: false});
          break;
        case SpeechCommand.NEXT_ARTICLE:
          mirrorSocket.sendToClient('command', {component: 'article', action: 'next'});
          break;
        case SpeechCommand.PREVIOUS_ARTICLE:
          mirrorSocket.sendToClient('command', {component: 'article', action: 'previous'});
          break;
        case SpeechCommand.CHANGE_ARTICLE_SOURCE:
          mirrorSocket.sendToClient('command', {component: 'article', action: 'change_source'});
          break;
        case SpeechCommand.TURN_OFF_EVERYTHING:
          hue.allLights({on: false, brightness: 100});
          exec("sudo tvservice -o");
          serialHandler.writeString('rgb:0:0:0');
          setTimeout(function() {
            serialHandler.writeString('outlet:255:0');
           }, 2000);
          break;
        case SpeechCommand.SET_COFFEMAKER_TIMER:
          console.log(data.hour, data.min)
          const now = moment(new Date());
          let future = moment(new Date()).hour(data.hour);
          if (data.min) {
            future = future.minute(data.min)
          } else {
            future.minute(0);
          }
          let diff = future.diff(now);
          if (diff < 0) {
            future.add(1, 'day');
          }
          diff = future.diff(now);
          speaker.speak('Startar kaffekokaren klockan ' + data.hour + (data.min ? ' och ' + data.min : ''));
          setTimeout(() => {
            serialHandler.writeString('outlet:4:1');
          }, diff);
          break;
        case SpeechCommand.UNKNOWN:
          console.log("Command not found: " + command);
          break;
      }
    }
  }
}
