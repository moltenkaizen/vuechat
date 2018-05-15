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
    console.log(`${socket.username} sent ${data}`)
    io.emit('NEW_MESSAGE', {
      author: socket.username,
      body: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    console.log(`${username} ${socket.conn.id} joined!`)
    // add the client's username to the global list
    // usernames[username] = username;
    // ++numUsers;
    clients.push(socket.username)
    addedUser = true;
    socket.emit('LOGIN', {
      clients,
      numUsers: clients.length
    });
    console.log('clients:', clients)
    // echo globally (all clients) that a person has connected
    socket.emit('user joined', socket.username);
  });

  socket.on('change username', function (name) {
    let oldName = socket.username;
    socket.username = name;
    socket.emit('username changed', {
      old: oldName,
      new: socket.username
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    // console.log(socket.username, 'is typing')
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global clients list
    if (addedUser) {
      let index = clients.indexOf(socket)
        clients.splice(index, 1)
      // delete clients[socket.username];
      // --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: clients.length
      });
    }
  });
});