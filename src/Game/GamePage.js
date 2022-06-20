import { useMemo, useState } from "react";
import "./Game.css";
import AttackButton from "./AttackButton";
import AttackTargetSelect from "./AttackTargetSelect";

const GamePage = (props) => {
  const { roomCode, playerName } = props;
  const [totalPlayerData, setTotalPlayerData] = useState([]);
  const [attackTarget, setAttackTarget] = useState("Select a target");

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
          />
          <AttackButton
            totalPlayerData={totalPlayerData}
            roomCode={roomCode}
            attackTarget={attackTarget}
            playerName={playerName}
            isPlayerEliminated={isPlayerEliminated}
            setTotalPlayerData={setTotalPlayerData}
          />
          {isPlayerEliminated === true && <h3>You are dead.</h3>}
          {hasWon === true && <h3>You have won!</h3>}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
