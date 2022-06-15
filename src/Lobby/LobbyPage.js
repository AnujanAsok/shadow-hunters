import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";
import PlayerList from "./PlayerList";

const LobbyPage = (props) => {
  const { roomCode, isHost, setPage, totalPlayerNames, setTotalPlayerNames } =
    props;
  const [hasGameStarted, setHasGameStarted] = useState(false);

  const handleClick = async () => {
    const { data, error } = await supabase
      .from("Rooms")
      .update({ gameStatus: true })
      .match({ roomID: roomCode });
  };

  useEffect(() => {
    let gameStatusUpdate = supabase
      .from("Rooms")
      .on("UPDATE", (payload) => {
        console.log(payload);
        if (
          payload.new.gameStatus === true &&
          payload.new.roomID === roomCode
        ) {
          setHasGameStarted(payload.new.gameStatus);
        }
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(gameStatusUpdate);
    };
  }, []);

  useEffect(() => {
    const pageSelect = hasGameStarted === true ? "game" : "lobby";
    setPage(pageSelect);
  }, [hasGameStarted]);

  return (
    <div>
      <h1>This is the Lobby page.</h1>
      <h2>Room Code: {roomCode}</h2>
      <PlayerList
        roomCode={roomCode}
        hasGameStarted={hasGameStarted}
        totalPlayerNames={totalPlayerNames}
        setTotalPlayerNames={setTotalPlayerNames}
      />
      <div>
        {isHost === true && <button onClick={handleClick}>Start Game</button>}
      </div>
    </div>
  );
};

export default LobbyPage;
