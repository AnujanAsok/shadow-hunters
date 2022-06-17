import { useEffect, useMemo, useState } from "react";
import CreatePlayerButton from "./CreatePlayerButton";
import CreateRoomButton from "./CreateRoomButton";
import JoinRoomButton from "./JoinRoomButton";
import "./Home.css";

const HomePage = (props) => {
  const { playerName, setPlayerName, setPage, setRoomCode, setIsHost } = props;

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <div style={{ backgroundColor: "white", flex: 1 }}></div>
      <div className="homePageContainer">
        <h1>This is the home page.</h1>
        <div className="homePageActions">
          <CreatePlayerButton
            playerName={playerName}
            setPlayerName={setPlayerName}
            setPage={setPage}
            setRoomCode={setRoomCode}
            setIsHost={setIsHost}
          ></CreatePlayerButton>

          <JoinRoomButton
            playerName={playerName}
            setPage={setPage}
            setRoomCode={setRoomCode}
          />
          <CreateRoomButton
            playerName={playerName}
            setPage={setPage}
            setRoomCode={setRoomCode}
            setIsHost={setIsHost}
          />
        </div>
      </div>
      <div style={{ backgroundColor: "white", flex: 1 }}></div>
    </div>
  );
};

export default HomePage;
