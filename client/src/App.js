import { socket } from './socket'
import { generateCharacter, renderCharInfo } from './helpers'
import { useEffect, useState } from 'react'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [character, setCharacter] = useState(null)
  const [characterName, setCharacterName] = useState('')

  useEffect(() => {
    const logWelcome = (id) => {
      console.log('connected to server', id)
    }

    const startPlaying = () => setIsPlaying(true)

    socket.on('welcome_client', logWelcome)
    socket.on('game_start', startPlaying)

    return () => {
      socket.off('welcome_client', logWelcome)
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

  return (
    <div className="App">
      <div>
        <h1>Welcome to Battle Sockets</h1>

        {isPlaying ? (
          <div>The game has started!</div>
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
        )}
      </div>
    </div>
  )
}

export default App
