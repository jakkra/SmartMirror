const config = require('../config');

const checkStatus = res => {
  return new Promise((resolve, reject) => {
    if (res.status >= 200 || res.status === 409) {
      return resolve(res);
    } else {
      const error = new Error(`StatusCode: ${res.status}, message: ${res.statusText}`);
      return reject(error);
    }
  });
};

export function getTasks(callback) {
  const url = config.serverBaseURL + '/api/tasks';

  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => res.tasks);
}

export function getPlantMoistureLevel(callback) {
  const url = config.serverBaseURL + '/api/moisture/latest';

  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => (res.moisture.length > 0 ? res.moisture[0] : null));
}

export function getArticles(callback) {
  const url = config.serverBaseURL + '/api/articles';

  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => res.articles);
}

export function getForecast(callback) {
  const url = config.serverBaseURL + '/api/forecast';

  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => res.forecast);
}

export function getJourney(callback) {
  const url = config.serverBaseURL + '/api/journey';
  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => res.routes);
}

export function getTemperaturesSevenDays(callback) {
  const url = config.serverBaseURL + '/api/temperatures7days';

  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => res.temperatures);
}

export function getCurrentPlaying(callback) {
  const url = config.serverBaseURL + '/api/spotify/current';

  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => res.currentPlaying);
}

export function get3DPrinterState(callback) {
  const url = 'http://octopi.local/api/printer';
  const urlJob = 'http://octopi.local/api/job';

  var options = {
    method: "GET",
    headers: {
      'X-Api-Key': config.octoiApiKey,
    },
  };

  let state = null;
  return fetch(url, options)
    .then(checkStatus)
    .then(res => res.json())
    .then(json => {
      state = json;
      return fetch(urlJob, options)
    })
    .then(checkStatus)
    .then(res => res.json())
    .then(jobStatus => {
      return {
        state: state,
        job: jobStatus
      }
    });
}

