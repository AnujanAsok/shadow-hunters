import { useEffect, useState } from "react";
import { supabase } from "./supabase_client";

const PlayerList = () => {
  const [totalPlayers, setTotalPlayers] = useState([]);
  const retrievePlayer = async () => {
    const { data } = await supabase
      .from("Players")
      .select("name")
      .eq("roomID", 1234);
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
