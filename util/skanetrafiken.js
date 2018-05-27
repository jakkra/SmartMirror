const config = require('../config');

const nodeSkanetraiken = require('node-skanetrafiken');

let stationFrom = null;
let stationTo = null;

function getFromToStations(fromName, toName) {
  return new Promise(resolve => {
    if (stationFrom === null) {
      nodeSkanetraiken.findStop({ name: fromName }, (res, err) => {
        if (!err && res[0]) {
          console.log('From:', res[0]);
          stationFrom = {
            id: res[0].Id[0],
            name: res[0].Name[0],
            type: '0',
          };
          if (stationTo !== null) {
            resolve();
          }
        } else {
          throw err;
        }
      });
    }
    if (stationTo === null) {
      nodeSkanetraiken.findStop({ name: toName }, (res, err) => {
        if (!err && res[0]) {
          console.log('To:', res[0]);
          stationTo = {
            id: res[0].Id[0],
            name: res[0].Name[0],
            type: '0',
          };
          if (stationFrom !== null) {
            resolve();
          }
        } else {
          throw err;
        }
      });
    }
    if (stationFrom !== null && stationTo !== null) {
      resolve();
    }
  });
}

module.exports = {
  getJourneysUsingConfig: async function() {
    await getFromToStations(config.journeyStations.from, config.journeyStations.to);

    return new Promise(resolve => {
      nodeSkanetraiken.getJourneys({ from: stationFrom, to: stationTo, limit: 5, action: 'next' }, function(
        results,
        err
      ) {
        if (!err) {
          resolve(results);
        } else {
          throw err;
        }
      });
    });
  },
};
