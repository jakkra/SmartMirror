import moment from 'moment'

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

const getKeyName = (key) => {
	switch (key) {
	  case "msl":
	    return 'pressure'
	  case "t":
	    return 'temp'
	  case "vis":
	    return 'visability'
	  case "wd":
	    return 'windDirection'
	  case "ws":
	    return 'windVelocity'
	  case "r":
	    return 'relativeHumidity'
	  case "tstm":
	    return 'probabilityThunderstorm'
	  case "tcc_mean":
	    return 'totalCloudCover'
	  case "lcc_mean":
	    return 'lowCloudCover'
	  case "mcc_mean":
	    return 'mediumCloudCover'
	  case "hcc_mean":
	    return 'highCloudCover'
	  case "gust":
	    return 'windGust'
	  case "pmin":
	    return 'minPrecipitation'
	  case "pmax":
	    return 'maxPrecipitation'
	  case "spp":
	    return 'frozenPartOfTotalPrecipitation'
	  case "pcat":
	    return 'rainfallType'
	  case "pmean":
	    return 'rainfallMeanAmount'
	  case "pmedian":
	    return 'rainfallMedianAmount'
	  case "Wsymb":
	    return 'weatherSymbol'
	  default:
	    System.out.println('Did not find any match for valueName: ' + key);
	    break;
	 }
}

export function getCurrentWeather(callback) {
	const longitude = '13'; 
	const latitude = '55.6';
	const url = 'http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/'
	+ longitude + '/lat/' + latitude + '/data.json';

	return fetch(url)
  .then(checkStatus)
  .then(res => res.json())
  .then(extractCurrentWeather);
}

function extractCurrentWeather(forecast) {
  let now = new moment();
  const currentWeatherIndex = forecast.timeSeries.findIndex((hf) => {
  	const forecastDate = new moment(hf.validTime);
  	return forecastDate.isAfter(now);
  })
  const currentForecast = forecast.timeSeries[currentWeatherIndex - 1]

  const nowForecast = {};
  currentForecast.parameters.forEach((data) => { 
  	const value = data.values.length > 0 ? data.values[0] : 0;
  	const key = getKeyName(data.name);
  	nowForecast[key] = value;
  })
  nowForecast['heatIndex'] = getHeatIndex(nowForecast.temp, nowForecast.relativeHumidity);
  nowForecast['windChill'] = getWindChill(nowForecast.temp, nowForecast.windVelocity);

  return nowForecast;
}

// http://www.smhi.se/kunskapsbanken/meteorologi/vindens-kyleffekt-1.259
function getWindChill(tempC, ms){
	return (13.12 + 0.6215 * tempC - 13.956 * Math.pow(ms, 0.16) + 0.48669 * tempC * Math.pow(ms, 0.16)).toFixed(1);
}

//T > 26 degree celcius only
function getHeatIndex(tempC, RH){
  const T = tempC * (parseFloat(9) / parseFloat(5)) + 32;

  let feelsLikeF = -42.379 + 2.04901523 * T + 10.14333127 * RH - 0.22475541 * T * RH - 0.00683783 * T * T -
          0.05481717 * RH * RH + 0.00122874 * T * T * RH + 0.00085282 * T * RH * RH - 0.00000199 * T * T * RH * RH;
  if (RH > 13 && T >= 80 && T <= 112) {
      feelsLikeF -= ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95.)) / 17);
  } else if (RH > 85 && T >= 80 && T <= 87) {
      feelsLikeF -= ((RH - 85) / 10) * ((87 - T) / 5);
  }
  const feelsLikeC = (feelsLikeF - 32) * (parseFloat(5) / parseFloat(9));
  return feelsLikeC.toFixed(1);
}

/**
 * Maps the SMHI! Weather codes to the weather icons font characters
 * http://opendata.smhi.se/apidocs/metfcst/parameters.html#parameter-wsymb
 *
 * Icons from http://fa2png.io/r/weather-icons/
 */
export function fileFromInt(smhiCode) {
    return smhiCode + "_" + convertCodeDependingOnTime() + ".png";
}

function convertCodeDependingOnTime() {
		const hour = new moment().hours();
    if (hour >= 7 && hour < 18) { //Day
        return "day";
    } else { //Night
        return "night";
    }
}

