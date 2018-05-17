// Setup basic express server
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

const io = socketIO(server);

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/client'));

// Chatroom

// usernames which are currently connected to the chat
// let usernames = {};
let clients = [];
let numUsers = 0;

io.on('connection', function (socket) {
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('newMessage', function (data) {
    // we tell the client to execute 'new message'
    console.log(`${socket.displayName} sent ${data}`)
    io.emit('NEW_MESSAGE', {
      author: socket.displayName,
      body: data,
      photoURL: socket.photoURL
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (user) {
    // we store the username in the socket session for this client
    socket.displayName = user.displayName;
    socket.email = user.email;
    socket.photoURL = user.photoURL;
    console.log(`${socket.displayName} ${socket.conn.id} joined!`)
    // add the client's displayName to the global list
    clients.push({
      displayName: socket.displayName,
      email: socket.email,
      photoURL: socket.photoURL
    })
    addedUser = true;
    // This may need to be io.emit vs socket.emit to send to all?
    io.emit('LOGIN', {
      clients,
      numUsers: clients.length
    });
    console.log('clients:', clients)
    // echo globally (all clients) that a person has connected
    socket.emit('user joined', socket.displayName);
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    // console.log(socket.displayName, 'is typing')
    socket.broadcast.emit('typing', {
      displayName: socket.displayName
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      displayName: socket.displayName
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the displayName from global clients list
    if (addedUser) {
      let index = clients.indexOf(socket)
        clients.splice(index, 1)

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        displayName: socket.displayName,
        clients
      });
    }
  });
});