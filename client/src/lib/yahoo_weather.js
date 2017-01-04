
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


export function getForecast(callback) {
	const url = 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast ' +
          'where woeid=897819 and u=\'c\'&format=json';

	return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(res => res.query.results.channel.item.forecast)
}

const mapping = {
	0: 'wi wi-tornado',
	1: 'wi wi-day-storm-showers',
	2: 'wi wi-hurricane',
	3: 'wi wi-thunderstorm',
	4: 'wi wi-thunderstorm',
	5: 'wi wi-rain-mix',
	6: 'wi wi-rain-mix',
	7: 'wi wi-rain-mix',
	8: 'wi wi-hail',
	9: 'wi wi-showers',
	10: 'wi wi-hail',
	11: 'wi wi-showers',
	12: 'wi wi-showers',
	13: 'wi wi-snow',
	14: 'wi wi-day-snow',
	15: 'wi wi-snow-wind',
	16: 'wi wi-snow',
	17: 'wi wi-hail',
	18: 'wi wi-rain-mix',
	19: 'wi wi-dust',
	20: 'wi wi-fog',
	21: 'wi wi-windy',
	22: 'wi wi-smoke',
	23: 'wi wi-strong-wind',
	24: 'wi wi-strong-wind',
	25: 'wi wi-snowflake-cold',
	26: 'wi wi-cloudy',
	27: 'wi wi-night-cloudy',
	28: 'wi wi-day-cloudy',
	29: 'wi wi-night-cloudy',
	30: 'wi wi-day-cloudy',
	31: 'wi wi-night-clear',
	32: 'wi wi-day-sunny',
	33: 'wi wi-night-partly-cloudy',
	34: 'wi wi-day-sunny-overcast',
	35: 'wi wi-rain-mix',
	36: 'wi wi-hot',
	37: 'wi wi-day-storm-showers',
	38: 'wi wi-day-storm-showers',
	39: 'wi wi-day-storm-showers',
	40: 'wi wi-showers',
	41: 'wi wi-snow-wind',
	42: 'wi wi-snow',
	43: 'wi wi-snow-wind',
	44: 'wi wi-day-sunny-overcast',
	45: 'wi wi-day-storm-showers',
	46: 'wi wi-snow',
	47: 'wi wi-day-storm-showers',
	3200: 'wi wi-stars'
}

export function getIconClass(code){
	return mapping[code];
}
