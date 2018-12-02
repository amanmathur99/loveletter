const express = require('express');
const port = process.env.PORT || 5000;
const socket = require('socket.io');

//App setup
const app = express();
var server = app.listen(port, () => console.log(`Listening on port ${port}`));



//Serve prod files
if (process.env.NODE_ENV === 'production') {

  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

//Logic
users = [];
connections = [];

//Socket setup
var io = socket(server);
io.sockets.on('connection', function(socket){
  console.log('connected to', socket.id)
  connections.push(socket);

  socket.on('disconnect', function(data) {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  //Send message
  socket.on('send message', function(data){
    console.log(data);
    io.sockets.emit('new message', {msg: data});
  });

});

