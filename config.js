const config = {

  padding: '5%', // or something

  YAHOO_WOEID: '897819',
  SMHI_COORD: {
    longitude: '13',
    latitude: '55.6'
  },
  svtNewsUrl: 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fwww.svt.se%2Fnyheter%2Frss.xml',

  serverBaseURL: process.env.NODE_ENV === 'production' ? 'http://localhost:3001' : 'http://localhost:3000',
  wsServerBaseURL: process.env.NODE_ENV === 'production' ? 'localhost:3001/' : 'localhost:3001/',

  modules: {
    dateTime: true,
    wunderlistTasks: false,
    transfer: false,
    weather: true,
    forecast: true,
    news: true,
    tempPirSensor: false,
    googleCloudSpeech: false,
    philipsHue: false,
    temperatureGraph: false,
    articles: false,
  }

};

module.exports = config;