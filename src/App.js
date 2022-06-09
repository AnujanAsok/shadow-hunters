import logo from "./logo.svg";
import "./App.css";
import HomePage from "./Home/HomePage";
import LobbyPage from "./Lobby/LobbyPage";
import GamePage from "./Game/GamePage";
import React, { useState } from "react";

function App() {
  const [page, setPage] = useState("home");
  const [player, setPlayer] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isHost, setIsHost] = useState(false);
  return (
    <div className="App">
      <div>
        {page === "home" && (
          <HomePage
            player={player}
            setPlayer={setPlayer}
            setPage={setPage}
            setRoomCode={setRoomCode}
            setIsHost={setIsHost}
          />
        )}
        {page === "game" && <GamePage />}
        {page === "lobby" && (
          <LobbyPage roomCode={roomCode} isHost={isHost} setPage={setPage} />
        )}
      </div>
    </div>
  );
}
export default App;
