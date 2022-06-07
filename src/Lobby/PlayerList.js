import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";

const PlayerList = (props) => {
  const { roomCode } = props;
  const [totalPlayers, setTotalPlayers] = useState([]);

  const retrievePlayer = async () => {
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
    retrievePlayer();

    let mySubscription = supabase
      .from("Players")
      .on("UPDATE", (payload) => {
        if (payload.new.roomID === roomCode) {
          setTotalPlayers((totalPlayers) =>
            totalPlayers.concat(payload.new.name)
          );
        }
      })
      .subscribe();
  }, []);

  return (
    <div>
      {totalPlayers.map((element) => (
        <li key={element}>{element}</li>
      ))}
    </div>
  );
};
export default PlayerList;
