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
    console.log("data: ", data);
    const playerNames = data.map((element) => {
      return element.name;
    });
    console.log("names: ", playerNames);
    setTotalPlayers(playerNames);
  };
  useEffect(() => {
    retrievePlayer();
    console.log("total player after retrieve", totalPlayers);
    let mySubscription = supabase
      .from("Players")
      .on("UPDATE", (payload) => {
        console.log("real time updates: ", payload.new.roomID);
        if (payload.new.roomID === roomCode) {
          console.log("total players in sub callback: ", totalPlayers);
          setTotalPlayers((totalPlayers) =>
            totalPlayers.concat(payload.new.name)
          );
        }
      })
      .subscribe();
  }, []);
  console.log(totalPlayers);
  return (
    <div>
      {totalPlayers.map((element) => (
        <li key={element}>{element}</li>
      ))}
    </div>
  );
};
export default PlayerList;
