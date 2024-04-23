class Message {
    constructor(header, content) {
        this.header = header;
        this.content = content;
    }
}

var WebSocketServer = require('websocket').server;
var http = require('http');
var db = require("./index");

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try {
                var jsonData = JSON.parse(message.utf8Data);
                var header = jsonData.header;
            } catch (e) {
                console.log("Message data was not in JSON format");
                console.error(e);
                return;
            } finally {
                connection.isAlive = true;
            }

            switch (header) {
                case 'Error':
                    let content = jsonData.content;
                    console.error(content);
                    break;
                case 'Update':
                    let target = jsonData.target;
                    let data = jsonData.data;
                    
                    console.log("works?");
                    db.update();
                    break;
                case 'Post':
                    break;
                case 'Fetch':
                    break;
            }
        } else {
            let error = {header: 'Error', content: "Message not a string"};
            let jsonData = JSON.stringify(error);

            connection.send(jsonData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});