const SpeechCommand = require('./speech_command');

const hue = require('./util/hue.js');


exports.classifyCommand = function(command){
  switch (command) {
    case SpeechCommand.LIGHTS_ON_ALL:
    	hue.lightAll({on: true, brightness: 100});
      break;
    case SpeechCommand.LIGHTS_OFF_ALL:
      hue.lightAll({on: false, brightness: 100});
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
      break;
    case SpeechCommand.HIDE_NEWS:
      break;
    case SpeechCommand.SHOW_FORECASTS:
      break;
    case SpeechCommand.HIDE_FORECASTS:
      break;
    case SpeechCommand.CHANGE_NEWS_SOURCE:
      break;
    case SpeechCommand.NEXT_BUS:
      // TTS
      break;
    case SpeechCommand.TURN_OFF:
      // Process p = Runtime.getRuntime().exec("sudo shutdown -h now");
    case SpeechCommand.UNKNOWN:
      console.log("Command not found: " + command);
      break;
  }
}