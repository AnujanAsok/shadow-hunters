import { supabase } from "./supabase_client";
import { useEffect, useState } from "react";
import JoinRoomButton from "./JoinRoomButton";

const CreatePlayerButton = (props) => {
  const [hasUserInput, setHasUserInput] = useState();
  const { player, setPlayer, setPage } = props;
  const onChange = (e) => {
    setHasUserInput(e.target.value);
  };
  const handleClick = async () => {
    setPlayer(hasUserInput);
    const { error, status } = await supabase
      .from("Players")
      .insert([{ name: hasUserInput }]);
  };
  return (
    <div>
      {player === "" && (
        <div>
          <label> Enter Username: </label>
          <input type="text" onChange={onChange} />
          <button onClick={handleClick}>Set Username</button>
        </div>
      )}
      <div>
        <JoinRoomButton player={player} setPage={setPage}></JoinRoomButton>
      </div>
    </div>
  );
};

export default CreatePlayerButton;
