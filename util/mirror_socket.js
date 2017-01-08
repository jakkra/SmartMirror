module.exports = (expressWs) => {
  return {
    sendToClient: function(event, data) {
      const aWss = expressWs.getWss('/a');
		  aWss.clients.forEach(function (client) {
		    client.send(JSON.stringify({event: event, data: data}));
		  });
    },
  }
}
