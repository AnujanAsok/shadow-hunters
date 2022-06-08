import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";

const PlayerList = (props) => {
  const { roomCode, hasGameStarted } = props;
  const [totalPlayers, setTotalPlayers] = useState([]);

  const fetchPlayerNames = async () => {
    const { data } = await supabase
      .from("Players")
      .select("name")
      .eq("roomID", roomCode);

    const playerNames = data.map((element) => {
      return element.name;
    });

    setTotalPlayers(playerNames);
  };
  useEffect(() => {
    fetchPlayerNames();

    let mySubscription = supabase
      .from("Players")
      .on("UPDATE", (payload) => {
        if (
          payload.new.gameStatus === null &&
          payload.new.roomID === roomCode
        ) {
          setTotalPlayers((totalPlayers) =>
            totalPlayers.concat(payload.new.name)
          );
        }
      })
      .subscribe();
    if (hasGameStarted === true) {
      supabase.removeSubscription(mySubscription);
    }
  }, [hasGameStarted]);

  return (
    <div>
      <ol>
        {totalPlayers.map((element) => (
          <li key={element}>{element}</li>
        ))}
      </ol>
    </div>
  );
};
export default PlayerList;
