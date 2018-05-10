'use strict'

const express = require('express')
const socketIO = require('socket.io')

const PORT = process.env.PORT || 3000

const server = express()
  .use(express.static('client'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

const io = socketIO(server);

io.on('connection', function(socket){
  console.log('Someone has connected!')

  socket.on('message', function(msg){
    io.emit('message', msg)
  })

  socket.on('typing', function(user){
    io.emit('typing', user)
  })

  socket.on('notyping', function(user){
    io.emit('notyping', user)
  })

})