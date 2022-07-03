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

  const randomLocationSelector = () => {
    const diceSum = generateSixSidedDice() + generateFourSidedDice();
    let locationID = 0;

    if (diceSum === 1 || diceSum === 2) {
      locationID = 1;
    } else if (diceSum === 4 || diceSum === 5) {
      locationID = 2;
    } else if (diceSum === 6) {
      locationID = 3;
    } else if (diceSum === 8) {
      locationID = 4;
    } else if (diceSum === 9) {
      locationID = 5;
    } else if (diceSum === 10) {
      locationID = 6;
    }

    return locationID;
  };

  const handleClick = async () => {
    const locationID = randomLocationSelector();
    if (locationID !== 0) {
      await supabase
        .from("Players")
        .update({ locationID: locationID })
        .match({ name: playerName });
    }

    setCurrentPlayerLocationID((currentValue) => {
      //this occurs when the player rolls a 7
      const newLocationID = locationID === 0 ? currentValue : locationID;
      return newLocationID;
    });
    setHasPlayerMovedLocations(() => {
      const checkIfPlayerMoved = locationID === 0 ? "location" : "attack";
      console.log(" check if player moved ", checkIfPlayerMoved);
      return checkIfPlayerMoved;
    });
    setHasPlayerRolledSeven(() => {
      const playerRolledSeven = locationID === 0 ? true : false;
      return playerRolledSeven;
    });
  };

  const handleManualLocationClicked = async () => {
    await supabase
      .from("Players")
      .update({ locationID: playerLocationChoice })
      .match({ name: playerName });
    setHasPlayerRolledSeven(false);
    setCurrentPlayerLocationID(playerLocationChoice);
    setHasPlayerMovedLocations("attack");
  };

  const isMyPlayersTurn =
    currentTurnPlayer && currentTurnPlayer.name === playerName;

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={
          !isMyPlayersTurn ||
          hasPlayerMovedLocations === "attack" ||
          hasPlayerRolledSeven
        }
      >
        Attempt to relocate
      </button>
      {hasPlayerRolledSeven && (
        <div>
          <input
            type="text"
            onChange={handleChange}
            placeholder="enter location number"
          />
          <button onClick={handleManualLocationClicked}>Enter Location</button>
        </div>
      )}
    </div>
  );
};

export default PlayerLocations;
