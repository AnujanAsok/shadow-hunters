import logo from "./logo.svg";
import "./App.css";
import HomePage from "./HomePage";
import LobbyPage from "./LobbyPage";
import GamePage from "./GamePage";
import React, { useState } from "react";

function App() {
  const [page, setPage] = useState("home");
  const [player, setPlayer] = useState("");
  return (
    <div className="App">
      <div>
        {page === "home" && (
          <HomePage player={player} setPlayer={setPlayer} setPage={setPage} />
        )}
        {page === "game" && <GamePage />}
        {page === "lobby" && <LobbyPage />}
      </div>
    </div>
  );
}
export default App;
