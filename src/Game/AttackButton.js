import { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabase_client";
import { generateSixSidedDice, generateFourSidedDice } from "../utils";

const AttackButton = (props) => {
  const [currentTurnPlayerIndex, setCurrentTurnPlayerIndex] = useState(0);
  const {
    totalPlayerData,
    roomCode,
    attackTarget,
    playerName,
    isPlayerEliminated,
    setTotalPlayerData,
  } = props;

  useEffect(() => {
    const fetchHitpoints = async () => {
      const { data } = await supabase
        .from("Players")
        .select("name, Hitpoints")
        .order("id", { ascending: true })
        .eq("roomID", roomCode);
      const playerHp = data.map((playerData) => {
        return { name: playerData.name, Hitpoints: playerData.Hitpoints };
      });
      setTotalPlayerData(playerHp);
    };
    fetchHitpoints();
  }, []);

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
        setCurrentTurnPlayerIndex(payload.new.turnNumber);
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(turnSubscription);
    };
  }, []);

  const handleClick = async () => {
    const targetPlayer = totalPlayerData.find(
      (playerData) => playerData.name === attackTarget
    );

    const diceDifference = generateSixSidedDice() - generateFourSidedDice();
    if (targetPlayer !== undefined) {
      if (diceDifference > 0) {
        await supabase
          .from("Players")
          .update({ Hitpoints: targetPlayer.Hitpoints - diceDifference })
          .eq("name", attackTarget);
      }
      await supabase
        .from("Rooms")
        .update({
          turnNumber: (currentTurnPlayerIndex + 1) % totalPlayerData.length,
        })
        .eq("roomID", roomCode);
    }
  };

  const updateHitpointValues = (currentState, payload) => {
    const updateHitpoints = currentState.map((playerData) => {
      if (payload.new.name === playerData.name) {
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

  const currentTurnPlayer = useMemo(() => {
    return totalPlayerData.find(
      (playerData, index) => index === currentTurnPlayerIndex
    );
  }, [currentTurnPlayerIndex, totalPlayerData]);

  const isMyPlayersTurn =
    currentTurnPlayer && currentTurnPlayer.name === playerName;

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={
          attackTarget === "Select a target" ||
          isPlayerEliminated ||
          !isMyPlayersTurn
        }
      >
        Attack
      </button>
    </div>
  );
};

export default AttackButton;
