import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../supabase_client";

const GamePage = (props) => {
  const { roomCode, playerName } = props;
  const [totalPlayerData, settotalPlayerData] = useState([]);
  const [attackTarget, setAttackTarget] = useState("Select a target");

  const handleClick = async () => {
    const targetPlayer = totalPlayerData.find(
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
      settotalPlayerData(playerHp);
    };
    fetchHitpoints();
  }, []);

  const myPlayerData = useMemo(() => {
    return totalPlayerData.find((playerData) => playerData.name === playerName);
  }, [totalPlayerData]);

  const isPlayerEliminated = myPlayerData && myPlayerData.Hitpoints === 0;

  const checkWinCondition = () => {
    const eliminatedPlayers = totalPlayerData.filter(
      (playerData) => playerData.Hitpoints === 0
    );
    return (
      eliminatedPlayers.length === totalPlayerData.length - 1 &&
      totalPlayerData.length !== 0 &&
      isPlayerEliminated === false
    );
  };

  const hasWon = useMemo(checkWinCondition, [totalPlayerData]);

  const updateHitpointValues = (currentState, payload) => {
    const updateHitpoints = currentState.map((playerData) => {
      if (payload.new.name === playerData.name) {
        return {
          name: payload.new.name,
          Hitpoints: payload.new.Hitpoints > 0 ? payload.new.Hitpoints : 0,
        };
      } else {
        return playerData;
      }
    });
    return updateHitpoints;
  };

  useEffect(() => {
    let mySubscription = supabase
      .from("Players")
      .on("UPDATE", (payload) => {
        settotalPlayerData((currentState) =>
          updateHitpointValues(currentState, payload)
        );
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);

  const filteredPlayerTargets = useMemo(
    () =>
      totalPlayerData.filter((playerData) => playerData.name !== playerName),
    [totalPlayerData]
  );

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
          {filteredPlayerTargets.map((targetPlayers) => (
            <option value={targetPlayers.name} key={targetPlayers.name}>
              {targetPlayers.name} HitPoints: {targetPlayers.Hitpoints}
            </option>
          ))}
        </select>
        <button
          onClick={handleClick}
          disabled={attackTarget === "Select a target" || isPlayerEliminated}
        >
          Attack
        </button>
        {isPlayerEliminated === true && <h3>You are dead.</h3>}
        {hasWon === true && <h3>You have won!</h3>}
      </div>
    </div>
  );
};

export default GamePage;
