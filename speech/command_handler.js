module.exports = (mirrorSocket) => {
  const SpeechCommand = require('./speech_command');
  const hue = require('../util/hue');
  const exec = require('child_process').exec;

  return {
    handle: function(command){
      switch (command) {
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
          // TTS
          break;
        case SpeechCommand.TURN_OFF:
          exec("sudo shutdown -h now");
        case SpeechCommand.UNKNOWN:
          console.log("Command not found: " + command);
          break;
      }
    }
  }
}