import { supabase } from "../supabase_client";
import { generateSixSidedDice, generateFourSidedDice } from "../utils";
import { useEffect, useMemo, useState } from "react";

const PlayerLocations = (props) => {
  const {
    playerName,
    setCurrentPlayerLocationID,
    currentTurnPlayer,
    setHasPlayerMovedLocations,
    hasPlayerMovedLocations,
  } = props;
  const [hasPlayerRolledSeven, setHasPlayerRolledSeven] = useState(false);
  const [playerLocationChoice, setPlayerLocationChoice] = useState();

  const handleChange = (e) => {
    setPlayerLocationChoice(e.target.value);
  };

  const handleClick = async () => {
    const diceSum = generateSixSidedDice() + generateFourSidedDice();
    let locationID = 0;
    let isRollSeven = false;

    if (diceSum === 1 || diceSum === 2) {
      locationID = 1;
    } else if (diceSum === 4 || diceSum === 5) {
      locationID = 2;
    } else if (diceSum === 6) {
      locationID = 3;
    } else if (diceSum === 7) {
      isRollSeven = true;
    } else if (diceSum === 8) {
      locationID = 4;
    } else if (diceSum === 9) {
      locationID = 5;
    } else if (diceSum === 10) {
      locationID = 6;
    }
    if (locationID !== 0) {
      await supabase
        .from("Players")
        .update({ LocationID: locationID })
        .match({ name: playerName });
    }

    setCurrentPlayerLocationID((currentValue) => {
      //this occurs when the player rolls a 7

      if (locationID === 0) {
        return currentValue;
      } else {
        return locationID;
      }
    });
    setHasPlayerMovedLocations(() => {
      if (locationID === 0) {
        return false;
      } else {
        return true;
      }
    });
    setHasPlayerRolledSeven(isRollSeven);
  };

  const handleLocationInput = async () => {
    await supabase
      .from("Players")
      .update({ LocationID: playerLocationChoice })
      .match({ name: playerName });
    setHasPlayerRolledSeven(false);
    setCurrentPlayerLocationID(playerLocationChoice);
    setHasPlayerMovedLocations(true);
  };

  const isMyPlayersTurn =
    currentTurnPlayer && currentTurnPlayer.name === playerName;

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={!isMyPlayersTurn || hasPlayerMovedLocations}
      >
        Roll Dice
      </button>
      <div>
        <input
          type={"text"}
          onChange={handleChange}
          placeholder="enter location number"
          disabled={!hasPlayerRolledSeven}
        />
        <button onClick={handleLocationInput} disabled={!hasPlayerRolledSeven}>
          Enter Location
        </button>
      </div>
    </div>
  );
};

export default PlayerLocations;
