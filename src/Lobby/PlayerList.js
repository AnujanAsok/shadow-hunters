import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";

const PlayerList = (props) => {
  const { roomCode, totalPlayerNames, setTotalPlayerNames } = props;

  const fetchPlayerNames = async () => {
    const { data } = await supabase
      .from("Players")
      .select("name")
      .eq("roomID", roomCode);

    const playerNames = data.map((element) => {
      return element.name;
    });

    setTotalPlayerNames(playerNames);
  };
  useEffect(() => {
    fetchPlayerNames();

    let mySubscription = supabase
      .from("Players")
      .on("UPDATE", (payload) => {
        if (payload.new.roomID === roomCode) {
          setTotalPlayerNames((totalPlayerNames) =>
            totalPlayerNames.concat(payload.new.name)
          );
        }
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);

  return (
    <div>
      <ol>
        {totalPlayerNames.map((playerNames) => (
          <li key={playerNames}>{playerNames}</li>
        ))}
      </ol>
    </div>
  );
};
export default PlayerList;
