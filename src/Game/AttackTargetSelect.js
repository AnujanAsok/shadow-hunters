import { useMemo } from "react";

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
        console.log(totalPlayerData);
        const locationDistance =
          playerData.locationID - currentPlayerLocationID;
        return (
          playerData.name !== playerName &&
          playerData.locationID &&
          (Math.abs(locationDistance) === 1 || locationDistance === 0)
        );
      }),
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
