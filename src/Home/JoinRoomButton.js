import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";

const JoinRoomButton = (props) => {
  const { playerName, setPage, setRoomCode } = props;
  const [roomCodeInput, setRoomCodeInput] = useState();
  const [doesRoomExist, setDoesRoomExist] = useState();

  const onChange = (e) => {
    setRoomCodeInput(e.target.value);
  };

  const handleClick = async () => {
    let pageSelect = "";
    let isRoomValid = true;
    const { data, error } = await supabase
      .from("Players")
      .select("roomID")
      .match({ roomID: roomCodeInput });
    if (data[0] !== undefined && data[0].roomID === roomCodeInput) {
      const { data, error } = await supabase
        .from("Players")
        .update({ roomID: roomCodeInput })
        .match({ name: playerName });
      pageSelect = "lobby";
    } else {
      isRoomValid = false;
      pageSelect = "home";
    }
    setDoesRoomExist(isRoomValid);
    setPage(pageSelect);
    setRoomCode(roomCodeInput);
  };
  return (
    <div>
      <div>
        <input
          type="text"
          onChange={onChange}
          placeholder="Enter existing room code"
          className="input input2"
        ></input>
        <button onClick={handleClick} className="button button3">
          Join Room
        </button>
      </div>
      {doesRoomExist === false && <h2>That Room Does Not Exist</h2>}
    </div>
  );
};

export default JoinRoomButton;
