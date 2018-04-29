const config = require('../config');

const checkStatus = (res) => {
    return new Promise((resolve, reject) => {
        if (res.status >= 200 && res.status < 299) {
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
  .then(res => res.tasks)
}

export function getArticles(callback) {
  const url = config.serverBaseURL + '/api/articles';

  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(res => res.articles)
}

export function getForecast(callback) {
  const url = config.serverBaseURL + '/api/forecast';

  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(res => res.forecast)
}

export function getJourney(callback) {
  const url = config.serverBaseURL + '/api/journey';
  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(res => res.routes)
}

export function getTemperaturesSevenDays(callback) {
  const url = config.serverBaseURL + '/api/temperatures7days';

  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(res => res.temperatures)
}

export function getCurrentPlaying(callback) {
  const url = config.serverBaseURL + '/api/spotify/current';

  return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(res => res.currentPlaying)
}