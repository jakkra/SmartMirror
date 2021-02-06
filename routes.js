const exec = require('child_process').exec;

const speaker = require('./speech/amazon-polly-speaker');
const requestHelper = require('./util/request_helper');
const articleExtractor = require('./util/article_extractor');
const serialHandler = require('./util/serial_handler');
var skanetrafiken = require('./util/skanetrafiken');
var timelapse = require('./util/timelapse');

const moment = require('moment');
const ip = require('ip');
const hue = require('./util/hue');
var fs = require('fs');

module.exports = (app, mirrorSocket) => {
  app.get('/api/brightness/:val', (req, res) => {
    console.log(req.params.val);
    if (req.params.cmd) serialHandler.writeString('brightness:' + req.params.val);
    res.json({
      success: true,
    }); 
  });

  app.get('/api/brightnessUp', (req, res) => {
    serialHandler.writeString('brightnessUp:');
    res.json({
      success: true,
    });
  });

  app.get('/api/brightnessDown', (req, res) => {
    serialHandler.writeString('brightnessDown:');
    res.json({
      success: true,
    });
  });

  app.get('/api/serial/:command', (req, res) => {
    let serialCommand, hour, min;
    let command = req.params.command;
    if (command.includes('time')) {
      serialCommand = command.split(':time=')[0];
      const hhmm = command.split(':time=')[1];
      hour = hhmm.split(':')[0];
      min = hhmm.split(':')[1];
      let now = moment(new Date());
      let future = moment(new Date())
        .hour(hour)
        .minute(min);
      let diff = future.diff(now);
      if (diff < 0) {
        future.add(1, 'day');
      }
      diff = future.diff(now);
      setTimeout(() => {
        serialHandler.writeString(serialCommand);
      }, diff);
    } else {
      serialHandler.writeString(req.params.command);
    }
    res.json({
      success: true,
    });
  });

  app.post('/api/serial', (req, res) => {
    if (req.body.mode) {
      serialHandler.writeString('mode:' + req.body.mode + ':' + req.body.speed);
    } else {
      const side = req.body.side;
      const rgb = req.body.rgb;
      if (side === 'all') {
        serialHandler.writeString('rgb:' + rgb.r + ':' + rgb.g + ':' + rgb.b);
      } else {
        serialHandler.writeString('side:' + side + ':' + rgb.r + ':' + rgb.g + ':' + rgb.b);
      }
    }
    res.json({
      success: true,
    });
  });

  app.get('/api/speak/:text', (req, res) => {
    if (req.params.text) speaker.speak(req.params.text);
    res.json({
      success: true,
    });
  });

  app.get('/api/hide', (req, res) => {
    mirrorSocket.sendToClient('visibility', { component: 'forecasts', visible: false });
    mirrorSocket.sendToClient('visibility', { component: 'news', visible: false });
    mirrorSocket.sendToClient('visibility', { component: 'article', visible: false });
    mirrorSocket.sendToClient('visibility', { component: 'tasks', visible: false });
    mirrorSocket.sendToClient('visibility', { component: 'weather', visible: false });
    mirrorSocket.sendToClient('visibility', { component: 'clock', visible: false });
    res.json({
      success: true,
    });
  });

  app.get('/api/hide/:component', (req, res) => {
    mirrorSocket.sendToClient('visibility', { component: req.params.component, visible: false });
    res.json({
      success: true,
    });
  });

  app.get('/api/show/:component', (req, res) => {
    mirrorSocket.sendToClient('visibility', { component: req.params.component, visible: true });
    res.json({
      success: true,
    });
  });

  app.get('/api/show', (req, res) => {
    mirrorSocket.sendToClient('visibility', { component: 'forecasts', visible: true });
    mirrorSocket.sendToClient('visibility', { component: 'news', visible: true });
    mirrorSocket.sendToClient('visibility', { component: 'article', visible: false });
    mirrorSocket.sendToClient('visibility', { component: 'tasks', visible: true });
    mirrorSocket.sendToClient('visibility', { component: 'weather', visible: true });
    mirrorSocket.sendToClient('visibility', { component: 'clock', visible: true });

    res.json({
      success: true,
    });
  });

  app.get('/api/tasks', (req, res) => {
    requestHelper.getTasks(tasks => {
      res.json({
        tasks: tasks,
      });
      return;
    });
  });

  app.get('/api/demo/:action', (req, res) => {
    if (req.params.action === 'dry') {
      requestHelper.logMoistureLevel(20);
      res.json({
        success: true,
      });
    } else if (req.params.action === 'water') {
      requestHelper.logMoistureLevel(95);
      res.json({
        success: true,
      });
    } else {
      res.json({
        success: false,
      });
    }
  });

  app.get('/api/moisture/latest', (req, res) => {
    requestHelper.getLatestMoistureLevel(moisture => {
      return res.json({
        moisture: moisture,
      });
    });
  });

  app.get('/api/moisture', (req, res) => {
    console.log("get")
    requestHelper.getMoisturesLast7Days(moisture => {
      return res.json({
        moisture: moisture,
      });
    });
  });

  app.post('/api/tasks', (req, res) => {
    if (req.body.title) {
      requestHelper.createTask(req.body.title);
      res.json({
        success: true,
      });
    } else {
      res.json({
        success: false,
      });
    }
  });

  app.post('/api/reminders', (req, res) => {
    if (req.body.date && req.body.text) {
      requestHelper.createReminder(req.body.date, req.body.text);
      res.json({
        success: true,
      });
    } else {
      res.json({
        success: false,
      });
    }
  });

  app.get('/api/articles', (req, res) => {
    articleExtractor.getArticles(articles => {
      res.json({
        articles,
      });
      return;
    });
  });

  app.get('/api/temperatures7days', (req, res) => {
    requestHelper.getTemperatures(temps => {
      res.json({
        temperatures: temps,
      });
      return;
    });
  });

  app.get('/api/temperatures7days/:source', (req, res) => {
    requestHelper.getTemperaturesFromSource(req.params.source, temps => {
      res.json({
        temperatures: temps,
      });
      return;
    });
  });

  app.get('/api/temperature/latest/:source', (req, res) => {
    requestHelper.getLatestTemperature(req.params.source, temperature => {
      return res.json({
        temperature: temperature,
      });
    });
  });

  app.get('/api/shutdown', (req, res) => {
    exec('sudo shutdown -h now');
    res.json({
      success: true,
    });
  });

  app.get('/api/sleep', (req, res) => {
    exec('sudo tvservice -o');
    res.json({
      success: true,
    });
  });

  app.get('/api/wakeup', (req, res) => {
    exec('sudo tvservice -p; sudo chvt 6; sudo chvt 7;');
    res.json({
      success: true,
    });
  });

  app.get('/api/reboot', (req, res) => {
    exec('sudo reboot');
  });

  app.get('/api/next', (req, res) => {
    mirrorSocket.sendToClient('command', { component: 'article', action: 'next' });
    res.json({
      success: true,
    });
  });

  app.get('/api/spotify/current', (req, res) => {
    requestHelper.getCurrentlyPlayingSpotify(playing => {
      if (!playing) return res.status(500).send({ error: 'Token to old, queries new. Please try again.' });
      res.json({
        currentPlaying: playing,
      });
    });
  });

  app.get('/api/forecast', (req, res) => {
    requestHelper.getForecast(forecast => {
      res.json({
        forecast: forecast,
      });
      return;
    });
  });

  app.get('/api/journey', (req, res) => {
    skanetrafiken
      .getJourneysUsingConfig()
      .then(results => {
        return res.json({
          routes: results,
        });
      })
      .catch(err => {
        res.json({ error: 'Could not featch bus/trains' });
      });
  });

  app.get('/api/localip', (req, res) => {
    res.json({
      success: true,
      ip: ip.address(),
    });
  });

  app.get('/api/localip', (req, res) => {
    res.json({
      success: true,
      ip: ip.address(),
    });
  });

  app.get('/api/timelapseRender', (req, res) => {
    console.log(req.query.length);
    timelapse.createTimelapse(req.query.length, (timelapsePath) => {
      console.log("Successfully rendered new timelapse on request " + timelapsePath)
    });
    res.json({
      success: true,
      path: timelapse.getTimelapsePath()
    });
  });

  app.get('/api/timelapse', (req, res) => {
    console.log(req.query.length);
    const path = timelapse.getTimelapsePath();
    
    fs.stat(path, (err, stat) => {
      // Handle file not found
      if (err !== null && err.code === 'ENOENT') {
          res.sendStatus(404);
      }

      const fileSize = stat.size
      const range = req.headers.range

      if (range) {

          const parts = range.replace(/bytes=/, "").split("-");

          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
          if (start <= end) {
            const chunksize = (end-start)+1;
            const file = fs.createReadStream(path, {start, end});
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }
            
            res.writeHead(206, head);
            file.pipe(res);
          } else {
            res.sendStatus(404);
          }
      } else {
          const head = {
              'Content-Length': fileSize,
              'Content-Type': 'video/mp4',
          }

          res.writeHead(200, head);
          fs.createReadStream(path).pipe(res);
      }
    });
  });

  app.post('/api/hue', (req, res) => {
    if (!req.body.name || !req.body.options) {
      return res.json({
        success: false,
        message: 'Must specify hue light name and options'
      });
    }

    if (hue.light(req.body.name, req.body.options)) {
      return res.json({
        success: true,
      });
    } else {
      return res.json({
        success: false,
        message: 'Light not found. Hue bridge lights are refreshed every 10 min. Try again later or check the name.'
      });
    }
  });

};
