'use strict'

const express = require('express')
const socketIO = require('socket.io')

const PORT = process.env.PORT || 3000

const server = express()
  .use(express.static('client'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

const io = socketIO(server);

let clients = []

io.on('connection', function(socket){

  console.log('Client connected:', socket.conn.id)
  clients.push(socket)
  console.log('Clients connected: ' + clients.length)

  socket.on('message', function(msg){
    io.emit('message', msg)
    console.log(msg)
  })

  socket.on('typing', function(user){
    io.emit('typing', user)
  })

  socket.on('notyping', function(user){
    io.emit('notyping', user)
  })

  // socket.on('disconnect', (socket) => {
  //   console.log('Client disconnected:', socket)
  //   io.emit('clientDisconnected', clients)
  //   let index = clients.indexOf(socket)
  //   clients.splice(index, 1)
  //   console.log('Clients connected: ' + clients.length)
  // })
})
