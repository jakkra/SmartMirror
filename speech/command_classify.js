'use strict';

const SpeechCommand = require('./speech_command');
const reminderParser = require('./reminder_parser');
const synonyms = require('./synonyms');

exports.classifyCommand = function(s){
  console.log('classify command');
  if(stringContainsItemFromList(s, synonyms.remind)){
    console.log('Parse reminder');
    return reminderParser.parse(s);
  } else if (stringContainsItemFromList(s, synonyms.lamp)) {
    return parseLights(s);
  } else if (stringContainsItemFromList(s, synonyms.forecasts)) {
    return parseForecasts(s);
  } else if (stringContainsItemFromList(s, synonyms.news)) {
    return parseNews(s);
  } else if(stringContainsItemFromList(s, synonyms.article)){
    return parseArticle(s);
  } else if(stringContainsItemFromList(s, synonyms.train)){
    return parseTrain(s);
  } else if(stringContainsItemFromList(s, synonyms.bus)){
    return parseBus(s);
  }  else if (stringContainsItemFromList(s, synonyms.all) && stringContainsItemFromList(s, synonyms.off)) {
    return SpeechCommand.TURN_OFF_EVERYTHING;
  } else if (stringContainsItemFromList(s, synonyms.all) && stringContainsItemFromList(s, synonyms.on)) {
    return SpeechCommand.TURN_ON_EVERYTHING;
  } else if(stringContainsItemFromList(s, synonyms.turnOffMirror)){
    return SpeechCommand.TURN_OFF;
  } else if(stringContainsItemFromList(s, synonyms.coffeMaker)){
    return parseCoffeMaker(s);
  } else {
    console.log('it\'s unknown');
    return SpeechCommand.UNKNOWN;
  }
  console.log('returning something');
}

function stringContainsItemFromList(command, list) {
  for (let i = 0; i < list.length; i++) {
    if (command.includes(list[i])) {
      return true;
    }
  }
  return false;
}

function parseArticle(s) {
  console.log('parse article');
  if (stringContainsItemFromList(s, synonyms.show)) {
    return SpeechCommand.SHOW_ARTICLES;
  } else if (stringContainsItemFromList(s, synonyms.hide)) {
    return SpeechCommand.HIDE_ARTICLES;
  } else if(stringContainsItemFromList(s, synonyms.next)){
    return SpeechCommand.NEXT_ARTICLE;
  } else if(stringContainsItemFromList(s, synonyms.previous)){
    return SpeechCommand.PREVIOUS_ARTICLE;
  } else {
    return SpeechCommand.UNKNOWN;
  }
}

function parseBus(s) {
  console.log('parse bus');
  if (stringContainsItemFromList(s, synonyms.when)) {
    return SpeechCommand.NEXT_BUS;
  } else {
    return SpeechCommand.UNKNOWN;
  }
}

function parseTrain(s) {
  console.log('parse train');
  if (stringContainsItemFromList(s, synonyms.when)) {
    return SpeechCommand.NEXT_TRAIN;
  } else {
    return SpeechCommand.UNKNOWN;
  }
}

function parseNews(s) {
  console.log('parse news');
  if (stringContainsItemFromList(s, synonyms.show)) {
    return SpeechCommand.SHOW_NEWS;
  } else if (stringContainsItemFromList(s, synonyms.hide)) {
    return SpeechCommand.HIDE_NEWS;
  } else if(stringContainsItemFromList(s, synonyms.change)){
    return SpeechCommand.CHANGE_NEWS_SOURCE;
  } else {
    return SpeechCommand.UNKNOWN;
  }
}

function parseForecasts(s) {
  console.log('parse forecats');
  if (stringContainsItemFromList(s, synonyms.show)) {
    return SpeechCommand.SHOW_FORECASTS;
  } else if (stringContainsItemFromList(s, synonyms.hide)) {
    return SpeechCommand.HIDE_FORECASTS;
  } else {
    return SpeechCommand.UNKNOWN;
  }
}

function parseCoffeMaker(s) {
  console.log('parse coffemaker');
  const match = s.match(/\d+/g);
  let hhmm = [];
  if (match) {
    hhmm = match.map(Number);
  }
  if (hhmm && Number.isInteger(hhmm[0]) && Number.isInteger(hhmm[1])) {
    return {
      command: SpeechCommand.SET_COFFEMAKER_TIMER,
      data: {
        hour: hhmm[0],
        min: hhmm[1],
      }
    }
  } else if (hhmm && Number.isInteger(hhmm[0])) {
    return {
      command: SpeechCommand.SET_COFFEMAKER_TIMER,
      data: {
        hour: hhmm[0],
      }
    }
  } else {
    return SpeechCommand.UNKNOWN;
  }
}

function parseLights(s) {
  console.log('parse lights func', s, synonyms.on[2], stringContainsItemFromList(s, synonyms.on));
  if (stringContainsItemFromList(s, synonyms.on)) {
    return parseLightsOn(s);
  } else if (stringContainsItemFromList(s, synonyms.off)) {
    return parseLightsOff(s);
  } else {
    return SpeechCommand.UNKNOWN;
  }
}

function parseLightsOff(s) {
  console.log('parse lights off');
  switch (checkWhichRoom(s)) {
    case SpeechCommand.ALL:
      return SpeechCommand.LIGHTS_OFF_ALL;
    case SpeechCommand.BEDROOM:
      return SpeechCommand.LIGHTS_OFF_BEDROOM;
    case SpeechCommand.HALLWAY:
      return SpeechCommand.LIGHTS_OFF_HALLWAY;
    case SpeechCommand.WARDROBE:
      return SpeechCommand.LIGHTS_OFF_WARDROBE;
    case SpeechCommand.LIVING_ROOM:
      return SpeechCommand.LIGHTS_OFF_LIVING_ROOM;
    default:
      return SpeechCommand.LIGHTS_OFF;
  }
}

function parseLightsOn(s) {
  console.log('parse lights on');
  switch (checkWhichRoom(s)) {
    case SpeechCommand.ALL:
      return SpeechCommand.LIGHTS_ON_ALL;
    case SpeechCommand.BEDROOM:
      return SpeechCommand.LIGHTS_ON_BEDROOM;
    case SpeechCommand.HALLWAY:
      return SpeechCommand.LIGHTS_ON_HALLWAY;
    case SpeechCommand.WARDROBE:
      return SpeechCommand.LIGHTS_ON_WARDROBE;
    case SpeechCommand.LIVING_ROOM:
      return SpeechCommand.LIGHTS_ON_LIVING_ROOM;
    default:
      return SpeechCommand.LIGHTS_ON;
  }
}

function checkWhichRoom(s) {
  console.log('parse check which room');
  if (stringContainsItemFromList(s, synonyms.bedroom)) {
      return SpeechCommand.BEDROOM;
  } else if (stringContainsItemFromList(s, synonyms.hallway)) {
      return SpeechCommand.HALLWAY;
  } else if (stringContainsItemFromList(s, synonyms.livingRoom)) {
      return SpeechCommand.LIVING_ROOM;
  } else if (stringContainsItemFromList(s, synonyms.wardrobe)) {
      return SpeechCommand.WARDROBE;
  } else if (stringContainsItemFromList(s, synonyms.all)) {
      return SpeechCommand.ALL;
  } else {
      return SpeechCommand.UNKNOWN;
  }
}
