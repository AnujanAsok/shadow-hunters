import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase_client";

const GamePage = (props) => {
  const { roomCode } = props;
  const [totalPlayersHp, setTotalPlayersHp] = useState([]);
  const [attackTarget, setAttackTarget] = useState("Select a target");

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

  const updateHitpointValues = (currentState, payload) => {
    const changeHitpoints = currentState.map((playerData) => {
      if (payload.new.name === playerData.name) {
        return {
          name: payload.new.name,
          Hitpoints: payload.new.Hitpoints,
        };
      } else {
        return playerData;
      }
    });
    return changeHitpoints;
  };

  useEffect(() => {
    let mySubscription = supabase
      .from("Players")
      .on("UPDATE", (payload) => {
        setTotalPlayersHp((currentState) =>
          updateHitpointValues(currentState, payload)
        );
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
        <select
          name="selectingAttackTarget"
          id="selectingAttackTarget"
          defaultValue={"Select a target"}
          onChange={(e) => {
            setAttackTarget(e.target.value);
          }}
        >
          <option value={"Select a target"}>Select a target</option>
          {totalPlayersHp.map((element) => (
            <option value={element.name} key={element.name}>
              {element.name} HitPoints: {element.Hitpoints}
            </option>
          ))}
        </select>
        <button
          onClick={handleClick}
          disabled={attackTarget === "Select a target"}
        >
          Attack
        </button>
      </div>
    </div>
  );
};

export default GamePage;
