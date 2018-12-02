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

//Socket setup
var io = socket(server);
io.on('connection', function(socket){
  console.log('made socket connection -server', socket.id)
});

