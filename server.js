const express = require('express');
const fs = require('fs');
const app = express();
const speech = require('./speech/stream.js');
const hotword = require('./speech/hot_word.js')
const commands = require('./speech/command_classify');

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/api/recognize', (req, res) => {
	console.log('/api/recognize');
  res.json({
    message: 'Started to recognize'
  });
	return;
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

hotword.initCallback(() => speech.listen((param) => {
	if(param && param.results && param.results[0] && param.results[0].alternatives && param.results[0].alternatives[0]) {
		const result = param.results[0].alternatives[0];
		console.log(result.transcript);
		console.log(commands.classifyCommand(result.transcript.toLowerCase()));
	}
}))
