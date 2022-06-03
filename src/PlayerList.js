import { useEffect, useState } from "react";
import { supabase } from "./supabase_client";

const PlayerList = () => {
  const [totalPlayers, setTotalPlayers] = useState();
  const retrievePlayer = async () => {
    const { data, error } = await supabase
      .from("Players")
      .select("name")
      .eq("roomID", 1234);
    const playerList = data.map((element) => (
      <li key={element.name}>{element.name}</li>
    ));
    setTotalPlayers(playerList);
  };
  retrievePlayer();
  // const array1 = [1, 4, 9, 16];
  // const playerList = array1.map((x) => x * 2);
  // console.log("mayo way", playerList);
  return (
    <div>
      <ul>{totalPlayers}</ul>
    </div>
  );
};

export default PlayerList;
