'use strict';

var async = require('async');
var fs = require('fs');
var path = require('path');
var grpc = require('grpc');
var googleProtoFiles = require('google-proto-files');
var googleAuth = require('google-auto-auth');
var Transform = require('stream').Transform;
var record = require('node-record-lpcm16');

var PROTO_ROOT_DIR = googleProtoFiles('..');
var protoDescriptor = grpc.load({
  root: PROTO_ROOT_DIR,
  file: path.relative(PROTO_ROOT_DIR, googleProtoFiles.speech.v1beta1)
}, 'proto', {
  binaryAsBase64: true,
  convertFieldsToCamelCase: true
});
var speechProto = protoDescriptor.google.cloud.speech.v1beta1;
var isListening = false;
console.log('STARTING STREAM.js');

function getSpeechService (callback) {
  var googleAuthClient = googleAuth({
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform'
    ]
  });

  googleAuthClient.getAuthClient(function (err, authClient) {
    if (err) {
      return callback(err);
    }

    var credentials = grpc.credentials.combineChannelCredentials(
      grpc.credentials.createSsl(),
      grpc.credentials.createFromGoogleCredential(authClient)
    );

    console.log('Loading speech service...');
    var stub = new speechProto.Speech('speech.googleapis.com', credentials);
    return callback(null, stub);
  });
}
exports.listen = function(callback) {
	console.log('listen');
  if(isListening === true) return;
  async.waterfall([
    function (cb) {
      getSpeechService(cb);
    },
    function sendRequest (speechService, cb) {
      console.log('Analyzing speech...');
      var call = speechService.streamingRecognize()
        .on('error', cb)
        .on('data', function (recognizeResponse) {
          if (recognizeResponse.endpointerType == 'END_OF_AUDIO') {
            record.stop();
            isListening = false;
          }
          callback(recognizeResponse);
        })
        .on('end', cb);

      // Write the initial recognize reqeust
      call.write({
        streamingConfig: {
          config: {
            encoding: 'LINEAR16',
            sampleRate: 16000,
            languageCode: 'sv-SE'
          },
          interimResults: false,
          singleUtterance: true,
        }
      });

      var toRecognizeRequest = new Transform({ objectMode: true });
      toRecognizeRequest._transform = function (chunk, encoding, done) {
        done(null, {
          audioContent: chunk
        });
      };
      isListening = true;
      // Start recording
      var readableMicrophoneStream = record.start({
        sampleRate : 16000,
        verbose : true,
        recordProgram: 'arecord'
      });

      // Stream the microphone audio to the Speech API
      readableMicrophoneStream
        .pipe(toRecognizeRequest)
        .pipe(call);

      // In case no end of audio
      setTimeout(function () {
        record.stop()
      }, 10000)
    }
  ], function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('DONE');
  });
}