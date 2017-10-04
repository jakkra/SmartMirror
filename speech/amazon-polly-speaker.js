'use strict';
const AWS = require('aws-sdk')
const Stream = require('stream')
const Speaker = require('speaker')

// Create an Polly client
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'eu-west-1'
})

// Create the Speaker instance
exports.speak = function(text) {
	const Player = new Speaker({
	  channels: 1,
	  bitDepth: 16,
	  sampleRate: 16000
	})

	let params = {
	    'Text': text,
	    'OutputFormat': 'pcm',
	    'VoiceId': 'Astrid'
	}

	Polly.synthesizeSpeech(params, (err, data) => {
	    if (err) {
	        console.log(err.code)
	    } else if (data) {
	        if (data.AudioStream instanceof Buffer) {
	            // Initiate the source
	            var bufferStream = new Stream.PassThrough()
	            // convert AudioStream into a readable stream
	            bufferStream.end(data.AudioStream)
	            // Pipe into Player
	            bufferStream.pipe(Player)
	        }
	    }
	})
}
