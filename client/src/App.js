import { io } from "socket.io-client";

function App() {
  // Maybe put this in a use effect?
  const socket = io('localhost:3001');

  socket.on('connection', () => {
    console.log('connected to server');
  })

  return (
    <div className="App">
      <div>
        <h1>Welcome to Battle Sockets</h1>

        <p>Character info:</p>

        <div>
          <button>
            Button here
          </button>

          <button>
            Button here
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
