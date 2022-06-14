import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../supabase_client";

const GamePage = (props) => {
  const { roomCode, player } = props;
  const [totalPlayersHp, setTotalPlayersHp] = useState([]);
  const [attackTarget, setAttackTarget] = useState("Select a target");
  const [isPlayerOut, setIsPlayerOut] = useState(false);
  const [winCondition, setWinCondition] = useState(false);

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

  const myPlayerData = useMemo(() => {
    return totalPlayersHp.find((playerData) => playerData.name === player);
  }, [totalPlayersHp]);

  const isPlayerEliminated = myPlayerData && myPlayerData.Hitpoints === 0;

  const checkWinCondition = () => {
    let hasPlayerWon = false;
    const eliminatedPlayers = totalPlayersHp.filter(
      (playerData) => playerData.Hitpoints === 0
    );
    if (
      eliminatedPlayers.length === totalPlayersHp.length - 1 &&
      totalPlayersHp.length !== 0 &&
      isPlayerEliminated === false
    ) {
      hasPlayerWon = true;
    }
    return hasPlayerWon;
  };

  const hasWon = useMemo(checkWinCondition, [totalPlayersHp]);

  const updateHitpointValues = (currentState, payload) => {
    const changeHitpoints = currentState.map((playerData) => {
      if (payload.new.name === playerData.name) {
        if (payload.new.Hitpoints > 0) {
          return {
            name: payload.new.name,
            Hitpoints: payload.new.Hitpoints,
          };
        } else {
          return {
            name: payload.new.name,
            Hitpoints: 0,
          };
        }
      } else {
        return playerData;
      }
    });
    return changeHitpoints;
  };
  useEffect(() => {
    console.log("total hp", totalPlayersHp);
  }, [totalPlayersHp]);

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

  const filteredPlayerTargets = useMemo(
    () => totalPlayersHp.filter((playerData) => playerData.name !== player),
    [totalPlayersHp]
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
          {filteredPlayerTargets.map((element) => (
            <option value={element.name} key={element.name}>
              {element.name} HitPoints: {element.Hitpoints}
            </option>
          ))}
        </select>
        <button
          onClick={handleClick}
          disabled={attackTarget === "Select a target" || isPlayerOut === true}
        >
          Attack
        </button>
        {isPlayerEliminated === true && <h3>You are out</h3>}
        {hasWon === true && <h3>You have won!</h3>}
      </div>
    </div>
  );
};

export default GamePage;
