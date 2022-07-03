import { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabase_client";
import { generateSixSidedDice, generateFourSidedDice } from "../utils";

const AttackButton = (props) => {
  const {
    totalPlayerData,
    roomCode,
    attackTarget,
    playerName,
    isPlayerEliminated,
    currentTurnPlayerIndex,
  } = props;

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
