const express = require('express');
const port = process.env.PORT || 5000;
const socket = require('socket.io');
var path = require('path');

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

//Socket on connect
var io = socket(server);
io.sockets.on('connection', function(socket){
  console.log('connected to', socket.id)
  connections.push(socket);

  //Disconnect
  socket.on('disconnect', function(data) {
    if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  //Send message
  socket.on('send message', function(data){
    console.log(data);
    io.sockets.emit('new message', {msg: data});
  });

   //New user
   socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    io.sockets.emit('get users', users);
  }

});

