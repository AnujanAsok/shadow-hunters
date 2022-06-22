import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";

const PlayerList = (props) => {
  const { roomCode, totalPlayerNames, setTotalPlayerNames } = props;
  const [playerReadyStatus, setPlayerReadyStatus] = useState();

  const fetchPlayerNames = async () => {
    const { data } = await supabase
      .from("Players")
      .select("name")
      .eq("roomID", roomCode);

    const playerNames = data.map((element) => {
      return element.name;
    });

    setTotalPlayerNames(playerNames);
  };
  useEffect(() => {
    fetchPlayerNames();

    let mySubscription = supabase
      .from("Players")
      .on("UPDATE", (payload) => {
        if (payload.new.roomID === roomCode) {
          setTotalPlayerNames((totalPlayerNames) =>
            totalPlayerNames.concat(payload.new.name)
          );
        }
      })
      .subscribe();
  }, []);

  return (
    <div className="playerListContainer">
      <table>
        {totalPlayerNames.map((playerNames) => (
          <tr className="tableBorder">
            <td key={playerNames}>{playerNames}</td>
            <td>Ready</td>
          </tr>
        ))}
      </table>
    </div>
  );
};
export default PlayerList;
