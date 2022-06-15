import { useEffect, useMemo, useState } from "react";
import CreatePlayerButton from "./CreatePlayerButton";
const HomePage = (props) => {
  const { playerName, setPlayerName, setPage, setRoomCode, setIsHost } = props;

  return (
    <div>
      <h1>This is the home page.</h1>

      <CreatePlayerButton
        playerName={playerName}
        setPlayerName={setPlayerName}
        setPage={setPage}
        setRoomCode={setRoomCode}
        setIsHost={setIsHost}
      ></CreatePlayerButton>
    </div>
  );
};

export default HomePage;
