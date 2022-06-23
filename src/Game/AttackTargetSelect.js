import { useEffect, useMemo } from "react";
import { supabase } from "../supabase_client";

const AttackTargetSelect = (props) => {
  const {
    setAttackTarget,
    totalPlayerData,
    playerName,
    currentPlayerLocationID,
  } = props;

  const filteredPlayerTargets = useMemo(
    () =>
      totalPlayerData.filter((playerData) => {
        const distanceFromTarget =
          playerData.locationID - currentPlayerLocationID;
        return (
          playerData.name !== playerName &&
          playerData.locationID &&
          (Math.abs(distanceFromTarget) === 1 || distanceFromTarget === 0)
        );
      }),
    [totalPlayerData, currentPlayerLocationID]
  );

  return (
    <div>
      <select
        name="selectingAttackTarget"
        id="selectingAttackTarget"
        defaultValue={"Select a target"}
        onChange={(e) => {
          setAttackTarget(e.target.value);
        }}
      >
        <option value={"Select a target"} selected>
          Select a target
        </option>
        {filteredPlayerTargets.map((targetPlayers) => (
          <option value={targetPlayers.name} key={targetPlayers.name}>
            {targetPlayers.name} hp: {targetPlayers.hitpoints}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AttackTargetSelect;
