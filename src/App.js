import logo from "./logo.svg";
import "./App.css";
import HomePage from "./Home/HomePage";
import LobbyPage from "./Lobby/LobbyPage";
import GamePage from "./Game/GamePage";
import React, { useState } from "react";

function App() {
  const [page, setPage] = useState("home");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [totalPlayerNames, setTotalPlayerNames] = useState([]);
  return (
    <div className="App">
      <div>
        {page === "home" && (
          <HomePage
            playerName={playerName}
            setPlayerName={setPlayerName}
            setPage={setPage}
            setRoomCode={setRoomCode}
            setIsHost={setIsHost}
            roomCode={roomCode}
          />
        )}
        {page === "game" && (
          <GamePage roomCode={roomCode} playerName={playerName} />
        )}
        {page === "lobby" && (
          <LobbyPage
            roomCode={roomCode}
            isHost={isHost}
            setPage={setPage}
            totalPlayerNames={totalPlayerNames}
            setTotalPlayerNames={setTotalPlayerNames}
            playerName={playerName}
          />
        )}
      </div>
    </div>
  );
}
export default App;
