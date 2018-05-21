const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

const io = socketIO(server);

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/client'));

// Chatroom

io.on('connection', (socket) => {

  socket.on('new user', (user) => {
    // we store the username in the socket session for this client
    socket.displayName = user.displayName;
    socket.email = user.email;
    socket.photoURL = user.photoURL;

    io.clients((error, clients) => {
      let clientsArray = [];

      if (error) throw error;
      clients.forEach((client) => {
        clientsArray.push({
              displayName: io.sockets.clients().sockets[client].displayName,
              email: io.sockets.clients().sockets[client].email,
              photoURL: io.sockets.clients().sockets[client].photoURL,
              socketID: client
            });
      });
      // console.log(clientsArray, clientsArray.length);
      io.emit('SEND_ALL_CLIENTS', clientsArray);
    });
  });

  // Handle user typing
  socket.on('typing', () => {
    io.emit('TYPING', {
      displayName: socket.displayName
    });
  })

  // Handle user not typing
  socket.on('not typing', () => {
    io.emit('NOT_TYPING', {
      displayName: socket.displayName
    });
  })

  // Handle new messages
  socket.on('send message', (message) => {
    const time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    const messageBundle = {
      author: socket.displayName,
      photoURL: socket.photoURL,
      body: message,
      time
    }
    io.emit('NEW_MESSAGE', messageBundle);
  });

  // Handle user left
  socket.on('user left', (user) => {
    // console.log('user left', user.displayName)
    io.emit('USER_LEFT', user.displayName)
  })

  // Handle user disconnected
  socket.on('disconnect', () => {
    // console.log('socket disconnect');
  });
  io.on('disconnect', () => {
    // console.log('io disconnect');
  });
});

io.on('disconnect', () => console.log('io disconnect'));
