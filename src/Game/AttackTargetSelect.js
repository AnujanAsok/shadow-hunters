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
        const locationDistance =
          playerData.locationID - currentPlayerLocationID;
        return (
          playerData.name !== playerName &&
          playerData.locationID &&
          (Math.abs(locationDistance) === 1 || locationDistance === 0)
        );
      }),
    [totalPlayerData, currentPlayerLocationID]
  );

  useEffect(() => {
    //disable the attack button when no target is in the location
    setAttackTarget((currentValue) => {
      if (filteredPlayerTargets.length === 0) {
        return "Select a target";
      } else {
        return currentValue;
      }
    });
  }, [filteredPlayerTargets]);

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
        <option value={"Select a target"}>Select a target</option>
        {filteredPlayerTargets.map((targetPlayers) => (
          <option value={targetPlayers.name} key={targetPlayers.name}>
            {targetPlayers.name} HitPoints: {targetPlayers.Hitpoints}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AttackTargetSelect;
