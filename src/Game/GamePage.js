import { useMemo, useState, useEffect } from "react";
import "./Game.css";
import AttackButton from "./AttackButton";
import { supabase } from "../supabase_client";
import AttackTargetSelect from "./AttackTargetSelect";
import PlayerLocations from "./PlayerLocations";
import DrawCardButton from "./DrawCardButton";
import InventoryList from "./InventoryList";

const GamePage = (props) => {
  const { roomCode, playerName } = props;
  const [totalPlayerData, setTotalPlayerData] = useState([]);
  const [attackTarget, setAttackTarget] = useState("Select a target");
  const [currentTurnPlayerIndex, setCurrentTurnPlayerIndex] = useState(0);
  const [currentPlayerLocationID, setCurrentPlayerLocationID] = useState(0);
  const [hasPlayerMovedLocations, setHasPlayerMovedLocations] =
    useState("location");
  const [hasPlayerDrawnCard, setHasPlayerDrawnCard] = useState(false);
  const [locationName, setLocationName] = useState("Not at a valid location");

  useEffect(() => {
    const fetchPlayerData = async () => {
      const { data } = await supabase
        .from("Players")
        .select("playerID, name, hitpoints, locationID")
        .order("playerID", { ascending: true })
        .eq("roomID", roomCode);
      setTotalPlayerData(data);
    };
    fetchPlayerData();
  }, []);

  const myPlayerData = useMemo(() => {
    return totalPlayerData.find((playerData) => playerData.name === playerName);
  }, [totalPlayerData]);

  const isPlayerEliminated = myPlayerData && myPlayerData.hitpoints === 0;

  const checkWinCondition = () => {
    const eliminatedPlayers = totalPlayerData.filter(
      (playerData) => playerData.hitpoints === 0
    );
    return (
      eliminatedPlayers.length === totalPlayerData.length - 1 &&
      totalPlayerData.length !== 0 &&
      isPlayerEliminated === false
    );
  };

  const hasWon = useMemo(checkWinCondition, [totalPlayerData]);

  const updatePlayerData = (currentState, payload) => {
    const updateHitpoints = currentState.map((playerData) => {
      if (payload.new.name === playerData.name) {
        return {
          playerID: payload.new.playerID,
          name: payload.new.name,
          hitpoints: payload.new.hitpoints > 0 ? payload.new.hitpoints : 0,
          locationID: payload.new.locationID,
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
        setTotalPlayerData((currentState) =>
          updatePlayerData(currentState, payload)
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

  const currentTurnPlayer = useMemo(() => {
    return totalPlayerData.find(
      (playerData, index) => index === currentTurnPlayerIndex
    );
  }, [currentTurnPlayerIndex, totalPlayerData]);

  const fetchLocationName = async () => {
    const { data } = await supabase
      .from("Locations")
      .select("location")
      .eq("locationID", currentPlayerLocationID);

    setLocationName((currentValue) => {
      const validatePlayerLocation =
        data[0] === undefined ? currentValue : data[0].location;
      return validatePlayerLocation;
    });
  };

  useEffect(() => {
    fetchLocationName();
  }, [currentPlayerLocationID]);

  return (
    <div>
      <div className="inventoryContainer">Inventory:</div>
      <div className="gamePageContainer">
        <h1>This is the Game Page</h1>

        <div>
          <AttackTargetSelect
            setAttackTarget={setAttackTarget}
            totalPlayerData={totalPlayerData}
            playerName={playerName}
            currentPlayerLocationID={currentPlayerLocationID}
            currentTurnPlayerIndex={currentTurnPlayerIndex}
            currentTurnPlayer={currentTurnPlayer}
            attackTarget={attackTarget}
          />
          <PlayerLocations
            playerName={playerName}
            setCurrentPlayerLocationID={setCurrentPlayerLocationID}
            currentTurnPlayer={currentTurnPlayer}
            setHasPlayerMovedLocations={setHasPlayerMovedLocations}
            hasPlayerMovedLocations={hasPlayerMovedLocations}
            setAttackTarget={setAttackTarget}
          />
          <div> You are in location: {locationName}</div>
          <AttackButton
            totalPlayerData={totalPlayerData}
            roomCode={roomCode}
            attackTarget={attackTarget}
            playerName={playerName}
            isPlayerEliminated={isPlayerEliminated}
            currentTurnPlayerIndex={currentTurnPlayerIndex}
            currentTurnPlayer={currentTurnPlayer}
            hasPlayerMovedLocations={hasPlayerMovedLocations}
            setHasPlayerMovedLocations={setHasPlayerMovedLocations}
            setHasPlayerDrawnCard={setHasPlayerDrawnCard}
            hasPlayerDrawnCard={hasPlayerDrawnCard}
          />
          <DrawCardButton
            currentPlayerLocationID={currentPlayerLocationID}
            myPlayerData={myPlayerData}
            currentTurnPlayer={currentTurnPlayer}
            playerName={playerName}
            hasPlayerMovedLocations={hasPlayerMovedLocations}
            setHasPlayerDrawnCard={setHasPlayerDrawnCard}
            hasPlayerDrawnCard={hasPlayerDrawnCard}
          />
          <InventoryList playerName={playerName} myPlayerData={myPlayerData} />

          {isPlayerEliminated === true && <h3>You are dead.</h3>}
          {hasWon === true && <h3>You have won!</h3>}

          <ol>
            <li>Hermit Hut</li>
            <li>Underworld Gate</li>
            <li>Church</li>
            <li>Cemetery</li>
            <li>Wierd Woods</li>
            <li>Erstwhile Altar</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
