const express = require('express')
const app = express()
const morgan = require('morgan')
const http = require('http').Server(express)
const io = require('socket.io')(http, { origins: 'localhost:* http://localhost:*'})
const socketPort = 3000
const httpPort = process.env.PORT || 5000

app.use(morgan('combined'))
app.use(express.static('client'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

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

http.listen(socketPort, function(){
  console.log('socket.io server listening on *:' + socketPort)
})

app.listen(httpPort, function() {
  console.log('serving on ' + httpPort)
})
