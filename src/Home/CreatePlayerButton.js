import { supabase } from "../supabase_client";
import { useEffect, useState } from "react";
import JoinRoomButton from "./JoinRoomButton";
import CreateRoomButton from "./CreateRoomButton";

const CreatePlayerButton = (props) => {
  const [usernameInput, setUsernameInput] = useState();
  const [usernameTaken, setUsernameTaken] = useState(false);
  const { player, setPlayer, setPage, setRoomCode, setIsHost } = props;

  const onChange = (e) => {
    setUsernameInput(e.target.value);
  };

  const handleClick = async () => {
    const { data, error, status } = await supabase
      .from("Players")
      .insert([{ name: usernameInput }]);
    if (error === null) {
      setPlayer(usernameInput);
    } else {
      setUsernameTaken(true);
    }
  };
  return (
    <div>
      <div>
        <label> Enter Username: </label>
        <input type="text" onChange={onChange} disabled={player !== ""} />
        <button onClick={handleClick} disabled={player !== ""}>
          Set Username
        </button>
        <div>
          {usernameTaken === true && player === "" && (
            <h3>That username is taken, Please enter another name.</h3>
          )}
        </div>
      </div>

      <CreateRoomButton
        player={player}
        setPage={setPage}
        setRoomCode={setRoomCode}
        setIsHost={setIsHost}
      />

      <JoinRoomButton
        player={player}
        setPage={setPage}
        setRoomCode={setRoomCode}
      />
    </div>
  );
};

export default CreatePlayerButton;
