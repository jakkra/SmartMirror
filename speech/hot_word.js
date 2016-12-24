const record = require('node-record-lpcm16');
const snowboy = require('snowboy');

const Detector = snowboy.Detector;
const Models   = snowboy.Models;

const models = new Models();

exports.initCallback = function(callback) {
  models.add({
    file: './resources/Spegel.pmdl',
    sensitivity: '0.5',
    hotwords : 'spegel'
  });

  const detector = new Detector({
    resource: "./resources/common.res",
    models: models,
    audioGain: 2.0
  });

  detector.on('silence', function () {
  });

  detector.on('sound', function () {
  });

  detector.on('error', function () {
  });

  detector.on('hotword', function (index, hotword) {
    console.log('hotword', index, hotword);
    callback();
  });

  const mic = record.start({
    threshold: 0,
    verbose: false
  });

  mic.pipe(detector);
}