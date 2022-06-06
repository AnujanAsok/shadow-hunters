import { supabase } from "./supabase_client";
import { useEffect, useState } from "react";
import JoinRoomButton from "./JoinRoomButton";
import CreateRoomButton from "./CreateRoomButton";

const CreatePlayerButton = (props) => {
  const [usernameInput, setUsernameInput] = useState();
  const { player, setPlayer, setPage, setRoomCode } = props;
  const onChange = (e) => {
    setUsernameInput(e.target.value);
  };
  const handleClick = async () => {
    setPlayer(usernameInput);
    const { error, status } = await supabase
      .from("Players")
      .insert([{ name: usernameInput }]);
  };
  return (
    <div>
      <div>
        <label> Enter Username: </label>
        <input type="text" onChange={onChange} disabled={player !== ""} />
        <button onClick={handleClick} disabled={player !== ""}>
          Set Username
        </button>
      </div>
      <div>
        <CreateRoomButton
          player={player}
          setPage={setPage}
          setRoomCode={setRoomCode}
        />
      </div>
      <div>
        <JoinRoomButton
          player={player}
          setPage={setPage}
          setRoomCode={setRoomCode}
        />
      </div>
    </div>
  );
};

export default CreatePlayerButton;
