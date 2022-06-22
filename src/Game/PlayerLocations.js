import { supabase } from "../supabase_client";
import { generateSixSidedDice, generateFourSidedDice } from "../utils";
import { useEffect } from "react";

const PlayerLocations = (props) => {
  const { playerName, setCurrentPlayerLocationID, currentTurnPlayer } = props;

  const handleClick = async () => {
    const diceSum = generateSixSidedDice() + generateFourSidedDice();
    let locationID = 0;

    if (diceSum === 1 || diceSum === 2) {
      locationID = 1;
    } else if (diceSum === 4 || diceSum === 5) {
      locationID = 2;
    } else if (diceSum === 6) {
      locationID = 3;
    } else if (diceSum === 7) {
      // let user select a location
      locationID = 7;
    } else if (diceSum === 8) {
      locationID = 4;
    } else if (diceSum === 9) {
      locationID = 5;
    } else if (diceSum === 10) {
      locationID = 6;
    }
    await supabase
      .from("Players")
      .update({ LocationID: locationID })
      .match({ name: playerName });

    setCurrentPlayerLocationID(locationID);
  };

  return (
    <div>
      <button onClick={handleClick}>Roll Dice</button>
    </div>
  );
};

export default PlayerLocations;
