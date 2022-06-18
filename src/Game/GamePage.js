import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../supabase_client";
import "./Game.css";
import { sixSidedDice, fourSidedDice } from "../utils";

const GamePage = (props) => {
  const { roomCode, playerName } = props;
  const [totalPlayerData, setTotalPlayerData] = useState([]);
  const [attackTarget, setAttackTarget] = useState("Select a target");
  const [currentTurnPlayer, setCurrentTurnPlayer] = useState(0);

  const handleClick = async () => {
    const targetPlayer = totalPlayerData.find(
      (playerData) => playerData.name === attackTarget
    );

    const sixDice = sixSidedDice();
    const fourDice = fourSidedDice();
    const diceDifference = sixDice - fourDice;

    if (targetPlayer !== undefined) {
      if (diceDifference > 0) {
        const { data, error } = await supabase
          .from("Players")
          .update({ Hitpoints: targetPlayer.Hitpoints - diceDifference })
          .eq("name", attackTarget);
      }

      const validTurn =
        currentTurnPlayer + 1 < totalPlayerData.length ? currentTurnPlayer : -1;
      const turnUpdate = await supabase
        .from("Rooms")
        .update({ turnTracker: validTurn + 1 })
        .eq("roomID", roomCode);
    }
  };

  useEffect(() => {
    const fetchHitpoints = async () => {
      const { data, error } = await supabase
        .from("Players")
        .select("name, Hitpoints")
        .order("id", { ascending: false })
        .eq("roomID", roomCode);
      const playerHp = data.map((playerData) => {
        return { name: playerData.name, Hitpoints: playerData.Hitpoints };
      });
      setTotalPlayerData(playerHp);
    };
    fetchHitpoints();
  }, []);

  const myPlayerData = useMemo(() => {
    return totalPlayerData.find((playerData) => playerData.name === playerName);
  }, [totalPlayerData]);

  const turnPlayer = useMemo(() => {
    return totalPlayerData.find(
      (playerData, index) => index === currentTurnPlayer
    );
  }, [currentTurnPlayer, totalPlayerData]);

  const focusedPlayer = turnPlayer && turnPlayer.name === playerName;

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
      if (payload.new.name === playerData.name && payload.table === "Players") {
        return {
          name: payload.new.name,
          Hitpoints: payload.new.Hitpoints > 0 ? payload.new.Hitpoints : 0,
        };
      } else if (payload.table === "Players") {
        return playerData;
      }
    });
    return updateHitpoints;
  };

  useEffect(() => {
    let mySubscription = supabase
      .from("Players")
      .on("UPDATE", (payload) => {
        setTotalPlayerData((currentState) =>
          updateHitpointValues(currentState, payload)
        );
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);

  useEffect(() => {
    let turnSubscription = supabase
      .from("Rooms")
      .on("UPDATE", (payload) => {
        setCurrentTurnPlayer(payload.new.turnTracker);
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(turnSubscription);
    };
  }, []);

  const filteredPlayerTargets = useMemo(
    () =>
      totalPlayerData.filter((playerData) => playerData.name !== playerName),
    [totalPlayerData]
  );

  return (
    <div>
      <div className="inventoryContainer">Inventory:</div>
      <div className="gamePageContainer">
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
            disabled={
              attackTarget === "Select a target" ||
              isPlayerEliminated ||
              !focusedPlayer
            }
          >
            Attack
          </button>
          {isPlayerEliminated === true && <h3>You are dead.</h3>}
          {hasWon === true && <h3>You have won!</h3>}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
