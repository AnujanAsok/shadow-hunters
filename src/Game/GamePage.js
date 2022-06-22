import { useMemo, useState, useEffect } from "react";
import "./Game.css";
import AttackButton from "./AttackButton";
import { supabase } from "../supabase_client";
import AttackTargetSelect from "./AttackTargetSelect";
import PlayerLocations from "./PlayerLocations";

const GamePage = (props) => {
  const { roomCode, playerName } = props;
  const [totalPlayerData, setTotalPlayerData] = useState([]);
  const [attackTarget, setAttackTarget] = useState("Select a target");
  const [currentTurnPlayerIndex, setCurrentTurnPlayerIndex] = useState(0);
  const [currentPlayerLocationID, setCurrentPlayerLocationID] = useState(0);
  const [hasPlayerMovedLocations, setHasPlayerMovedLocations] = useState(false);

  useEffect(() => {
    const fetchHitpoints = async () => {
      const { data } = await supabase
        .from("Players")
        .select("name, Hitpoints, LocationID")
        .order("id", { ascending: true })
        .eq("roomID", roomCode);
      const playerHp = data.map((playerData) => {
        return {
          name: playerData.name,
          Hitpoints: playerData.Hitpoints,
          locationID: playerData.LocationID,
        };
      });
      setTotalPlayerData(playerHp);
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
          locationID: payload.new.LocationID,
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

  const currentTurnPlayer = useMemo(() => {
    return totalPlayerData.find(
      (playerData, index) => index === currentTurnPlayerIndex
    );
  }, [currentTurnPlayerIndex, totalPlayerData]);

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
          />
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
          />
          <PlayerLocations
            playerName={playerName}
            setCurrentPlayerLocationID={setCurrentPlayerLocationID}
            currentTurnPlayer={currentTurnPlayer}
            setHasPlayerMovedLocations={setHasPlayerMovedLocations}
            hasPlayerMovedLocations={hasPlayerMovedLocations}
          />
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
