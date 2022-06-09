import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";
import PlayerList from "./PlayerList";

const LobbyPage = (props) => {
  const { roomCode, isHost, setPage, totalPlayers, setTotalPlayers, player } =
    props;
  const [hasGameStarted, setHasGameStarted] = useState(false);
  let pageSelect = "";

  const handleClick = async () => {
    const { data, error } = await supabase
      .from("Players")
      .update({ gameStatus: true })
      .match({ roomID: roomCode });
  };

  useEffect(() => {
    let gameStatusUpdate = supabase
      .from(`Players:name=eq.${player}`)
      .on("UPDATE", (payload) => {
        console.log("payload in lobby", payload);
        if (
          payload.new.gameStatus === true &&
          payload.new.roomID === roomCode
        ) {
          setHasGameStarted(payload.new.gameStatus);
        }
      })
      .subscribe();
    if (hasGameStarted === true) {
      pageSelect = "game";
    } else {
      pageSelect = "lobby";
    }
    setPage(pageSelect);
    return () => {
      supabase.removeSubscription(gameStatusUpdate);
    };
  }, [hasGameStarted]);

  return (
    <div>
      <h1>This is the Lobby page.</h1>
      <h2>Room Code: {roomCode}</h2>
      <PlayerList
        roomCode={roomCode}
        hasGameStarted={hasGameStarted}
        totalPlayers={totalPlayers}
        setTotalPlayers={setTotalPlayers}
      />
      <div>
        {isHost === true && <button onClick={handleClick}>Start Game</button>}
      </div>
    </div>
  );
};

export default LobbyPage;
