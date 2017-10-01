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


export function getLatestNews(callback) {
	const url = config.svtNewsUrl;

	return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(res => res.items)
}
