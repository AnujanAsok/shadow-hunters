import { useEffect, useState } from "react";
import { supabase } from "./supabase_client";

const PlayerList = (props) => {
  const { roomCode } = props;
  const [totalPlayers, setTotalPlayers] = useState([]);
  const retrievePlayer = async () => {
    const { data } = await supabase
      .from("Players")
      .select("name")
      .eq("roomID", roomCode);
    setTotalPlayers(data);
  };
  useEffect(() => {
    retrievePlayer();
  }, []);
  return (
    <div>
      {totalPlayers.map((element) => (
        <li key={element.name}>{element.name}</li>
      ))}
    </div>
  );
};
export default PlayerList;
