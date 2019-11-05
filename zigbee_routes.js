
const zigbee = require('./util/zigbee.js');

module.exports = (app, mirrorSocket) => {
  app.get('/api/permitJoin/:time', (req, res) => {
    let result = false;
    console.log(req.params.time)
    if (req.params.time) {
      zigbee.permitJoin(parseInt(req.params.time));
      result = true;
    }
    res.json({
      success: result,
    }); 
  });
};