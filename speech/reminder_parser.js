const moment = require('moment');
const SpeechCommand = require('./speech_command');

const time1 = new RegExp("om\\s+([^\\s]*)\\s*(.*?)\\s+att\\s+(.*)");
const time2 = new RegExp("att\\s+(.+)\\s+om\\s+([^\\s]+)\\s+([^\\s]+)");
const tomorrow = new RegExp("imorgon\\s+(?:klockan)?\\s*([0-9]+)(?:\\.)?([0-9]+)?\\s+att\\s+(.*)");
const weekday = new RegExp("på\\s+([^\\s]*)\\s+att\\s+(.*)");

exports.parse = function(s){
  const matcher1 = s.match(time1);
  const matcher2 = s.match(time2);
  const tomorrowMatcher = s.match(tomorrow);
  const weekdayMatcher = s.match(weekday);
  let date = null;
  let reminderText = '';

  if(matcher1 !== null && matcher1[1] && matcher1[2] && matcher1[3]) {
    try {
      reminderText = matcher1[3];
      date = increaseTodayDate(matcher1[1], matcher1[2]);
    } catch(err) {
      console.log(err);
      return SpeechCommand.UNKNOWN;
    }
  } else if(matcher2 !== null && matcher2[1] && matcher2[2] && matcher2[3]) {
    try {
      reminderText = matcher2[1];
      date = increaseTodayDate(matcher2[2], matcher2[3]);
    } catch(err) {
      console.log(err);
      return SpeechCommand.UNKNOWN;
    }
  } else if(tomorrowMatcher !== null && tomorrowMatcher[1] && tomorrowMatcher[2] && tomorrowMatcher[3]) {
    try {
      const hour = tomorrowMatcher[1];
      const min = tomorrowMatcher[2];
      date = getTomorrowAt(hour, min);
      reminderText = tomorrowMatcher[3];
    } catch(err) {
      console.log(err);
      return SpeechCommand.UNKNOWN;
    }
  } else if(weekdayMatcher !== null && weekdayMatcher[1] && weekdayMatcher[2]) {
    try {
      const day = weekdayMatcher[1];
      date = getFutureDay(day);
      reminderText = weekdayMatcher[2];
    } catch(err) {
      console.log(err);
      return SpeechCommand.UNKNOWN;
    }
  } else {
    console.log('No match found for: ' + s);
    return SpeechCommand.UNKNOWN;
  }

  if(date !== null && reminderText !== '') {
    console.log('Success parsing reminder!')
    console.log(date, reminderText);
    return SpeechCommand.CREATE_REMINDER;
  }
}

function increaseTodayDate(num, unit) {
  const c = moment();
  const calUnit = getCalUnit(unit);
  const numUnits = wordToInt(num);
  if (calUnit != -1 && numUnits != -1) {
    c.add(numUnits, calUnit);
    return c;
  } else {
    throw "Parse error near " + num + " " + unit;
  }
}

function getTomorrowAt(hour, minute){
  if(isNaN(hour) && isNaN(minute)) throw 'Not parseable ' + hour + ' ' + minute;
  const c = moment();
  c.add(1, 'day');
  c.set({
    'hour': hour,
    'minute': minute
  });
  return c;
}

function getFutureDay(day){
  try {
    const c = moment({hour: 12});
    const dayNum = moment().weekday();
    const goalDayNum = getCalId(day);
    if (goalDayNum - dayNum > 0) {
      c.add(goalDayNum - dayNum, 'day');
    } else {
      c.add(7 + goalDayNum - dayNum, 'day');
    }
    return c;
  } catch(err) {
    throw 'Parse error on ' + day;
  }
}


function getCalId(day) {
  switch (day) {
    case "söndag":
      return 7;
    case "måndag":
      return 1;
    case "tisdag":
      return 2;
    case "onsdag":
      return 3;
    case "torsdag":
      return 4;
    case "fredag":
      return 5;
    case "lördag":
      return 6;
    default:
      console.log('Parse error on day: ' + day);
      throw 'Parse error on day: ' + day;
  }
}

function getCalUnit(unit) {
  switch (unit) {
    case "minuter":
      return 'minute';
    case "minut":
      return 'minute';
    case "timme":
      return 'hour';
    case "timmar":
      return 'hour';
    case "dag":
      return 'day';
    case "dagar":
      return 'day';
    default:
      return -1;
  }
}

function wordToInt(s) {
  if(!isNaN(s)) return parseInt(s);

  switch (s) {
    case "en":
      return 1;
    case "två":
      return 2;
    case "tre":
      return 3;
    case "fyra":
      return 4;
    case "fem":
      return 5;
    case "sex":
      return 6;
    case "sju":
      return 7;
    case "åtta":
      return 8;
    case "nio":
      return 9;
    case "tio":
      return 10;
    case "elva":
      return 11;
    case "tolv":
      return 12;
    default:
      return -1;
  }
}
