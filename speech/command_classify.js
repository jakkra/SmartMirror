const SpeechCommand = require('./speech_command');
const reminderParser = require('./reminder_parser');

const lampSynonymsSwedish = ['lampa', 'lampan', 'lampor', 'lamporna', 'ljus', 'ljuset', 'ljusen', 'ljuset', 'lyset', 'taket', 'i taket', 'i hallen', 'tänd', 'släck', 'ljus'];
const onSynonymsSwedish = ['sätt på', 'till', 'tänd', 'tända', 'starta', 'händer'];
const offSynonymsSwedish = ['stäng av', 'stäng av', 'stänga', 'från', 'släck', 'släcka', 'stoppa', 'fläck', 'fläckt', 'fläkt'];
const allSynonymsSwedish = ['alla', 'samtliga', 'allt'];
const bedroomSynonymsSwedish = ['säng', 'sängen', 'sängens', 'sovrum', 'sovrums', 'sovrummet', 'sovrummets'];
const hallwaySynonymsSwedish = ['hall', 'hallen', 'hallens', 'dörr', 'dörren', 'Halland'];
const livingRoomSynonymsSwedish = ['vardagsrum', 'vardagsrummet', 'matbord', 'matbordet'];
const wardrobeSynonymsSwedish = ['garderob', 'garderoben', 'klädkammare', 'klädkammaren'];

const busSynonymsSwedish = ['bussen', 'buss', 'bus'];

const changeSynonymsSwedish = ['ändra', 'byt', 'ändra till'];
const showSynonymsSwedish = ['visa', 'starta', 'ta fram'];
const hideSynonymsSwedish = ['dölj', 'stäng av', 'ta bort', 'göm'];
const newsSynonymsSwedish = ['nyheter', 'nyheterna', 'nyhetskälla'];
const forecastsSynonymsSwedish = ['väder', 'vädret', 'prognos', 'prognoserna'];
const articleSynonymsSwedish = ['blog', 'bloggar', 'bloggen', 'inlägg', 'inläggen', 'inlägget', 'artiklar', 'artiklarna', 'artikel', 'artikeln'];

const whenSynonymsSwedish = ['när', 'byt', 'går'];
const nextSynonymsSwedish = ['nästa', 'efterkommande'];
const previousSynonymsSwedish = ['förra', 'föregående'];

const remindSynonymsSwedish = ['påminn'];


const turnOffMirrorSwedish = ['stäng av spegeln', 'spegel stäng av dig', 'gå och sov spegel'];

exports.classifyCommand = function(s){
  console.log('classify command');
  if (stringContainsItemFromList(s, lampSynonymsSwedish)) {
      console.log('lampssss');
      return parseLights(s);
  } else if (stringContainsItemFromList(s, forecastsSynonymsSwedish)) {
      return parseForecasts(s);
  } else if (stringContainsItemFromList(s, newsSynonymsSwedish)) {
      return parseNews(s);
  } else if(stringContainsItemFromList(s, articleSynonymsSwedish)){
      return parseArticle(s);
  } else if(stringContainsItemFromList(s, busSynonymsSwedish)){
      return parseBus(s);
  } else if(stringContainsItemFromList(s, remindSynonymsSwedish)){
      console.log('Parse reminder');
      return reminderParser.parse(s);
  } else if(stringContainsItemFromList(s, turnOffMirrorSwedish)){
      return SpeechCommand.TURN_OFF;
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
  if (stringContainsItemFromList(s, showSynonymsSwedish)) {
    return SpeechCommand.SHOW_ARTICLES;
  } else if (stringContainsItemFromList(s, hideSynonymsSwedish)) {
    return SpeechCommand.HIDE_ARTICLES;
  } else if(stringContainsItemFromList(s, nextSynonymsSwedish)){
    return SpeechCommand.NEXT_ARTICLE;
  } else if(stringContainsItemFromList(s, previousSynonymsSwedish)){
    return SpeechCommand.PREVIOUS_ARTICLE;
  } else {
    return SpeechCommand.UNKNOWN;
  }
}

function parseBus(s) {
  console.log('parse bus');
  if (stringContainsItemFromList(s, whenSynonymsSwedish)) {
    return SpeechCommand.NEXT_BUS;
  } else {
    return SpeechCommand.UNKNOWN;
  } 
}

function parseNews(s) {
  console.log('parse news');
  if (stringContainsItemFromList(s, showSynonymsSwedish)) {
    return SpeechCommand.SHOW_NEWS;
  } else if (stringContainsItemFromList(s, hideSynonymsSwedish)) {
    return SpeechCommand.HIDE_NEWS;
  } else if(stringContainsItemFromList(s, changeSynonymsSwedish)){
    return SpeechCommand.CHANGE_NEWS_SOURCE;
  } else {
    return SpeechCommand.UNKNOWN;
  }
}

function parseForecasts(s) {
  console.log('parse forecats');
  if (stringContainsItemFromList(s, showSynonymsSwedish)) {
    return SpeechCommand.SHOW_FORECASTS;
  } else if (stringContainsItemFromList(s, hideSynonymsSwedish)) {
    return SpeechCommand.HIDE_FORECASTS;
  } else {
    return SpeechCommand.UNKNOWN;
  }
}

function parseLights(s) {
  console.log('parse lights func', s, onSynonymsSwedish[2], stringContainsItemFromList(s, onSynonymsSwedish));
  if (stringContainsItemFromList(s, onSynonymsSwedish)) {
    return parseLightsOn(s);
  } else if (stringContainsItemFromList(s, offSynonymsSwedish)) {
    return parseLightsOff(s);
  } else if (stringContainsItemFromList(s, changeSynonymsSwedish)) {
    return parseLightChange(s);
  } else {
    console.log('un')
    return SpeechCommand.UNKNOWN;
  }
}

function parseLightChange(s) {
  console.log('parse light change');
  switch (checkWhichRoom(s)) {
    case SpeechCommand.ALL:
      return SpeechCommand.LIGHTS_CHANGE_ALL;
    case SpeechCommand.BEDROOM:
      return SpeechCommand.LIGHTS_CHANGE_BEDROOM;
    case SpeechCommand.HALLWAY:
      return SpeechCommand.LIGHTS_CHANGE_HALLWAY;
    case SpeechCommand.WARDROBE:
      return SpeechCommand.LIGHTS_CHANGE_WARDROBE;
    case SpeechCommand.LIVING_ROOM:
      return SpeechCommand.LIGHTS_CHANGE_LIVING_ROOM;
    default:
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
  if (stringContainsItemFromList(s, bedroomSynonymsSwedish)) {
      return SpeechCommand.BEDROOM;
  } else if (stringContainsItemFromList(s, hallwaySynonymsSwedish)) {
      return SpeechCommand.HALLWAY;
  } else if (stringContainsItemFromList(s, livingRoomSynonymsSwedish)) {
      return SpeechCommand.LIVING_ROOM;
  } else if (stringContainsItemFromList(s, wardrobeSynonymsSwedish)) {
      return SpeechCommand.WARDROBE;
  } else if (stringContainsItemFromList(s, allSynonymsSwedish)) {
      return SpeechCommand.ALL;
  } else {
      return SpeechCommand.UNKNOWN;
  }
}
