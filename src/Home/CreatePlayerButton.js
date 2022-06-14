import { supabase } from "../supabase_client";
import { useEffect, useState } from "react";
import JoinRoomButton from "./JoinRoomButton";
import CreateRoomButton from "./CreateRoomButton";

const CreatePlayerButton = (props) => {
  const [usernameInput, setUsernameInput] = useState();
  const [usernameTaken, setUsernameTaken] = useState();
  const { playerName, setPlayerName, setPage, setRoomCode, setIsHost } = props;

  const onChange = (e) => {
    setUsernameInput(e.target.value);
  };

  const handleClick = async () => {
    let fetchUsername = "";
    let isNameTaken = false;
    const { data, error, status } = await supabase
      .from("Players")
      .insert([{ name: usernameInput }]);
    if (error === null) {
      fetchUsername = usernameInput;
    } else {
      isNameTaken = true;
    }
    setPlayerName(fetchUsername);
    setUsernameTaken(isNameTaken);
  };
  return (
    <div>
      <div>
        <label> Enter Username: </label>
        <input type="text" onChange={onChange} disabled={playerName !== ""} />
        <button onClick={handleClick} disabled={playerName !== ""}>
          Set Username
        </button>

        {usernameTaken === true && playerName === "" && (
          <h3>That username is taken, Please enter another name.</h3>
        )}
      </div>

      <CreateRoomButton
        playerName={playerName}
        setPage={setPage}
        setRoomCode={setRoomCode}
        setIsHost={setIsHost}
      />

      <JoinRoomButton
        playerName={playerName}
        setPage={setPage}
        setRoomCode={setRoomCode}
      />
    </div>
  );
};

export default CreatePlayerButton;
