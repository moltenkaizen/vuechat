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

// client array which are currently connected to the chat
let clients = [];

io.on('connection', function (socket) {
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('newMessage', function (data) {
    // we tell the client to execute 'new message'
    console.log(`${socket.displayName} sent ${data}`)
    const time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    io.emit('NEW_MESSAGE', {
      author: socket.displayName,
      body: data,
      photoURL: socket.photoURL,
      time
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
    io.emit('LOGIN', clients);
    console.log('clients:', clients)
    // echo globally (all clients) that a person has connected
    io.emit('user joined', socket.displayName);
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('TYPING', function () {
    // console.log(socket.displayName, 'is typing')
    io.emit('TYPING', {
      displayName: socket.displayName
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('NOT_TYPING', function () {
    io.emit('NOT_TYPING', {
      displayName: socket.displayName
    });
  });

  socket.on('USER_LEFT', function (user) {
    console.log('user left: ', {
      displayName: socket.displayName,
      email: socket.email,
      photoURL: socket.photoURL
    })
    io.emit('USER_LEFT', user)
  })

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the displayName from global clients list
    if (addedUser) {
      let index = clients.indexOf(socket)
        clients.splice(index, 1)
      console.log('user left: ', {
        displayName: socket.displayName,
        email: socket.email,
        photoURL: socket.photoURL
      })
      // echo globally that this client has left
      io.emit('USER_LEFT', {
        displayName: socket.displayName,
        email: socket.email,
        photoURL: socket.photoURL
      })
    }
  });
});
