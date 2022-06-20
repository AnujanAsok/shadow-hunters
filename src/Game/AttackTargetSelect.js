import { useMemo } from "react";

const AttackTargetSelect = (props) => {
  const { setAttackTarget, totalPlayerData, playerName } = props;
  const filteredPlayerTargets = useMemo(
    () =>
      totalPlayerData.filter((playerData) => playerData.name !== playerName),
    [totalPlayerData]
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
