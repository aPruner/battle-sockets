import { socket } from "./socket";
import { generateCharacter } from "./helpers";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const logWelcome = (id) => {
      console.log('connected to server', id);
    };

    socket.on('welcome_client', logWelcome);

    return () => {
      socket.off('welcome_client', logWelcome);
    }
  }, [])

  const character = generateCharacter("Adam");
  const readyUp = () => {
    socket.emit('ready', JSON.stringify(character));
  }

  return (
    <div className="App">
      <div>
        <h1>Welcome to Battle Sockets</h1>

        <p>Character info:</p>

        <div>
          <button onClick={generateCharacter}>
            Generate new character
          </button>

          <button onClick={readyUp}>
            Ready
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
