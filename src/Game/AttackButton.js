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
    currentTurnPlayer,
    hasPlayerMovedLocations,
    setHasPlayerMovedLocations,
    setHasPlayerDrawnCard,
    hasPlayerDrawnCard,
  } = props;

  const endTurn = async () => {
    await supabase
      .from("Rooms")
      .update({
        turnNumber: (currentTurnPlayerIndex + 1) % totalPlayerData.length,
      })
      .eq("roomID", roomCode);
    setHasPlayerMovedLocations("location");
    setHasPlayerDrawnCard(false);
  };

  const handleClick = async () => {
    const targetPlayer = totalPlayerData.find(
      (playerData) => playerData.name === attackTarget
    );

    const diceDifference = generateSixSidedDice() - generateFourSidedDice();
    if (targetPlayer !== undefined) {
      if (diceDifference > 0) {
        await supabase
          .from("Players")
          .update({ hitpoints: targetPlayer.hitpoints - diceDifference })
          .eq("name", attackTarget);
      }
      endTurn();
    }
  };

  const isMyPlayersTurn =
    currentTurnPlayer && currentTurnPlayer.name === playerName;

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={
          attackTarget === "Select a target" ||
          isPlayerEliminated ||
          !isMyPlayersTurn ||
          hasPlayerMovedLocations === "location"
        }
      >
        Attack
      </button>
      <button
        onClick={endTurn}
        disabled={!isMyPlayersTurn || hasPlayerDrawnCard === false}
      >
        Pass Turn
      </button>
    </div>
  );
};

export default AttackButton;
