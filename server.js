const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors);
const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "*"}});

const playerSockets = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  playerSockets[socket.id] = { socket, ready: false };
  console.log('a client connected', socket.id);
  console.log('logging all clients:', Object.keys(playerSockets));
  socket.emit('welcome_client', socket.id);
  socket.on('ready', (character) => {
    console.log(`${socket.id} has readied up with character: ${character}`);
    playerSockets[socket.id].ready = true;

    for (id of Object.keys(playerSockets)) {
      if (!playerSockets[id].ready) {
        return;
      }
    }

    io.emit('game_start');
    console.log('All connected clients have readied up, the game is starting');
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});