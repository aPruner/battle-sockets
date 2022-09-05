import { socket } from './socket'
import { generateCharacter, renderCharInfo } from './helpers'
import { useEffect, useState } from 'react'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [serverIsFull, setServerIsFull] = useState(false)
  const [character, setCharacter] = useState(null)
  const [enemyCharacter, setEnemyCharacter] = useState(null)
  const [characterName, setCharacterName] = useState('')
  const [hasChosenAction, setHasChosenAction] = useState(false)

  useEffect(() => {
    const handleConnection = (id) => {
      console.log('connected to server', id)
      setIsConnected(true)
    }

    const handleDisconnection = () => {
      console.log('could not connect to server, it is already full')
      setServerIsFull(true)
    }

    const startPlaying = (playerSocketsStr) => {
      const playerSockets = JSON.parse(playerSocketsStr)
      for (const id of Object.keys(playerSockets)) {
        if (id !== socket.id) {
          setEnemyCharacter(playerSockets[id].character)
        }
      }
      setIsPlaying(true)
    }

    const handlePlayingTurn = (socketIdToResultingCharsStr) => {
      console.log('Playing out the turn')
      setHasChosenAction(false)

      const socketIdToResultingChars = JSON.parse(socketIdToResultingCharsStr)
      for (const id of Object.keys(socketIdToResultingChars)) {
        if (id === socket.id) {
          setCharacter({ ...socketIdToResultingChars[id] })
        } else {
          setEnemyCharacter({ ...socketIdToResultingChars[id] })
        }
      }
    }

    socket.on('connect_client', handleConnection)
    socket.on('disconnect', handleDisconnection)
    socket.on('game_start', startPlaying)
    socket.on('playing_turn', handlePlayingTurn)

    return () => {
      socket.off('connect_client', handleConnection)
      socket.off('disconnect', handleDisconnection)
      socket.off('game_start', startPlaying)
    }
  }, [])

  const readyUp = () => {
    socket.emit('ready', JSON.stringify(character))
  }

  const generateNewCharacter = (name) => {
    const newCharacter = generateCharacter(name)
    setCharacter(newCharacter)

    // Reset the character name after generating a character
    setCharacterName('')
  }

  const chooseAction = (action) => {
    socket.emit('choose_action', action)
    setHasChosenAction(true)
  }

  return (
    <div className="App">
      <div>
        <h1>Welcome to Battle Sockets</h1>
        {isConnected ? (
          isPlaying ? (
            <div>
              <div>The game has started!</div>
              <div>
                <p>Your character info:</p>
                {renderCharInfo(character)}
                <p>Enemy character info:</p>
                {renderCharInfo(enemyCharacter)}
              </div>

              <button
                onClick={() => chooseAction('attack')}
                disabled={hasChosenAction}
              >
                Attack
              </button>
              <button
                onClick={() => chooseAction('deflect')}
                disabled={hasChosenAction}
              >
                Deflect
              </button>
              <button
                onClick={() => chooseAction('recover')}
                disabled={hasChosenAction}
              >
                Recover
              </button>
            </div>
          ) : (
            <div>
              <div>
                <label>Character Name:</label>
                <input
                  type="text"
                  onChange={(e) => setCharacterName(e.target.value)}
                ></input>
                <button
                  onClick={() => generateNewCharacter(characterName)}
                  disabled={!characterName}
                >
                  Generate new character
                </button>
                <p>Character info:</p>
                {renderCharInfo(character)}
              </div>
              <div>
                <button onClick={readyUp} disabled={!character}>
                  Ready
                </button>
              </div>
            </div>
          )
        ) : serverIsFull ? (
          <div>Tried to connect to server but it is full</div>
        ) : (
          <div>You are not yet connected to the server</div>
        )}
      </div>
    </div>
  )
}

export default App
