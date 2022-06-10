import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase_client";

const GamePage = (props) => {
  const { roomCode } = props;
  const [attackTarget, setAttackTarget] = useState("No Target");
  const [totalPlayersHp, setTotalPlayersHp] = useState([]);

  const handleClick = async () => {
    const targetPlayer = totalPlayersHp.find(
      (playerData) => playerData.name === attackTarget
    );

    if (targetPlayer !== undefined) {
      const { data, error } = await supabase
        .from("Players")
        .update({ Hitpoints: targetPlayer.Hitpoints - 20 })
        .eq("name", attackTarget);
    }
  };

  useEffect(() => {
    const fetchHitpoints = async () => {
      const { data, error } = await supabase
        .from("Players")
        .select("name, Hitpoints")
        .eq("roomID", roomCode);
      const playerHp = data.map((playerData) => {
        return { name: playerData.name, Hitpoints: playerData.Hitpoints };
      });
      setTotalPlayersHp(playerHp);
    };
    fetchHitpoints();
  }, []);

  useEffect(() => {
    let mySubscription = supabase
      .from("Players")
      .on("UPDATE", (payload) => {
        setTotalPlayersHp((currentState) => {
          const changeHitpoints = currentState.map((playerData) => {
            if (payload.new.name === playerData.name) {
              return {
                name: payload.new.name,
                Hitpoints: payload.new.Hitpoints,
              };
            } else {
              return { name: playerData.name, Hitpoints: playerData.Hitpoints };
            }
          });
          return changeHitpoints;
        });
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);
  return (
    <div>
      <h1>This is the Game Page</h1>
      <div>
        <input
          type="text"
          onChange={(e) => setAttackTarget(e.target.value)}
        ></input>
        <button onClick={handleClick}>Attack</button>
      </div>
      <ol>
        {totalPlayersHp.map((element) => (
          <li key={element.name}>
            {element.name} HitPoints: {element.Hitpoints}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default GamePage;
