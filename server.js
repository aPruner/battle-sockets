const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors);
const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "*"}});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a client connected');
  socket.emit('connection');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});