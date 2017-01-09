const speaker = require('./speech/amazon-polly-speaker');
const requestHelper = require('./util/request_helper');
const articleExtractor = require('./util/article_extractor');

module.exports = (app, mirrorSocket) => {
	app.get('/api/speak/:text', (req, res) => {
	  if (req.params.text) speaker.speak(req.params.text);
		return;
	});

	app.get('/api/hide', (req, res) => {
	  mirrorSocket.sendToClient('visibility', {component: 'forecasts', visible: false});
	  mirrorSocket.sendToClient('visibility', {component: 'news', visible: false});
	  mirrorSocket.sendToClient('visibility', {component: 'article', visible: false});
	  mirrorSocket.sendToClient('visibility', {component: 'tasks', visible: false});

	  res.json({
	      success: true
	    });
	});

	app.get('/api/hide/:component', (req, res) => {
	  mirrorSocket.sendToClient('visibility', {component: req.params.component, visible: false});
	 

	  res.json({
	      success: true
	    });
	});

	app.get('/api/show/:component', (req, res) => {
	  mirrorSocket.sendToClient('visibility', {component: req.params.component, visible: true});

	  res.json({
	      success: true
	    });
	});


	app.get('/api/show', (req, res) => {
	  mirrorSocket.sendToClient('visibility', {component: 'forecasts', visible: true});
	  mirrorSocket.sendToClient('visibility', {component: 'news', visible: true});
	  mirrorSocket.sendToClient('visibility', {component: 'article', visible: true});
	  mirrorSocket.sendToClient('visibility', {component: 'tasks', visible: true});

	  res.json({
	      success: true
	    });
	});

	app.get('/api/tasks', (req, res) => {
		requestHelper.getTasks((tasks) => {
	    res.json({
	      tasks: tasks
	    });
		return;
	  })
	});

	app.get('/api/articles', (req, res) => {
		articleExtractor.getArticles((articles) => {
	    res.json({
	      articles
	    });
		return;
	  })
	});

	app.get('/api/next', (req, res) => {
	  mirrorSocket.sendToClient('command', {component: 'article', action: 'next'});
	  //mirrorSocket.sendToClient('visibility', {component: 'news', visible: true});

	  res.json({
	      success: true
	    });
	});

}