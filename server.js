const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
app.use(cors)
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

// Game data structures
const playerSockets = {}
let allNextTurnActions = {}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const handleReady = (socket, character) => {
  console.log(`${socket.id} has readied up with character: ${character}`)
  playerSockets[socket.id].ready = true
  playerSockets[socket.id].character = { ...JSON.parse(character) }

  for (id of Object.keys(playerSockets)) {
    if (!playerSockets[id].ready || !playerSockets[id].character) {
      return
    }
  }

  const socketIdToCharsMap = { ...playerSockets }
  for (const id of Object.keys(socketIdToCharsMap)) {
    delete socketIdToCharsMap[id].socket
  }

  io.emit('game_start', JSON.stringify(socketIdToCharsMap))
  console.log(
    'All connected clients have successfully readied up, the game is starting',
  )
}

const handleChooseAction = (socket, action) => {
  allNextTurnActions[socket.id] = action

  if (Object.keys(allNextTurnActions).length === 2) {
    // TODO: Extract this out into a function called playTurn()
    console.log(
      'all players have chosen an action for this turn. Now playing out the turn',
    )

    const actionsQueue = []
    for (const id of Object.keys(allNextTurnActions)) {
      actionsQueue.push({ id, action: allNextTurnActions[id] })
    }

    for (const action of actionsQueue) {
      // Do some math and mutate the character objs inside of playerSockets map
      if (action.action === 'attack') {
        
      } else if (action.action === 'deflect') {

      } else {

      }
    }

    const socketIdToCharsMap = { ...playerSockets }
    for (const id of Object.keys(socketIdToCharsMap)) {
      delete socketIdToCharsMap[id].socket
    }

    io.emit('playing_turn', JSON.stringify(socketIdsToCharsMap))
  }
}

io.on('connection', (socket) => {
  if (Object.keys(playerSockets).length === 2) {
    console.log(
      'a client attempted to connect, but the room is already full. disconnecting said client',
    )
    socket.disconnect()
    return
  }
  playerSockets[socket.id] = { socket, ready: false, character: null }
  console.log('a client connected', socket.id)
  console.log('logging all clients:', Object.keys(playerSockets))
  socket.emit('connect_client', socket.id)
  socket.on('ready', (character) => handleReady(socket, character))
  socket.on('choose_action', (action) => handleChooseAction(socket, action))
})

server.listen(3001, () => {
  console.log('listening on *:3001')
})
