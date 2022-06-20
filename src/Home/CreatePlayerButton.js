import { supabase } from "../supabase_client";
import { useEffect, useState } from "react";

const CreatePlayerButton = (props) => {
  const [usernameInput, setUsernameInput] = useState();
  const [usernameTaken, setUsernameTaken] = useState();
  const { playerName, setPlayerName } = props;

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
        <input
          type="text"
          onChange={onChange}
          disabled={playerName !== ""}
          className="input"
          placeholder="Enter Your Username"
        />
        <button
          onClick={handleClick}
          disabled={playerName !== ""}
          className="button button3"
        >
          Set Username
        </button>

        {usernameTaken === true && playerName === "" && (
          <h3>That username is taken, Please enter another name.</h3>
        )}
      </div>
    </div>
  );
};

export default CreatePlayerButton;
