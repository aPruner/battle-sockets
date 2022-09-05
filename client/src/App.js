import { socket } from './socket'
import { generateCharacter } from './helpers'
import { useEffect, useState } from 'react'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)

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

  const character = generateCharacter('Adam')
  const readyUp = () => {
    socket.emit('ready', JSON.stringify(character))
  }

  return (
    <div className="App">
      <div>
        <h1>Welcome to Battle Sockets</h1>

        <p>Character info:</p>

        {isPlaying ? (
          <div>The game has started!</div>
        ) : (
          <div>
            <button onClick={generateCharacter}>Generate new character</button>

            <button onClick={readyUp}>Ready</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
