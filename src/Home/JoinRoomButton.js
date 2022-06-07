import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";

const JoinRoomButton = (props) => {
  const { player, setPage, setRoomCode } = props;
  const [userRoomInput, setUserRoomInput] = useState();
  const [roomExists, setRoomExists] = useState(true);
  const onChange = (e) => {
    setUserRoomInput(e.target.value);
  };
  const handleClick = async () => {
    let lobby = "";
    const { data, error } = await supabase
      .from("Players")
      .select("roomID")
      .match({ roomID: userRoomInput });
    if (data[0] !== undefined && data[0].roomID === userRoomInput) {
      const { data, error } = await supabase
        .from("Players")
        .update({ roomID: userRoomInput })
        .match({ name: player });
      lobby = "lobby";
    } else {
      setRoomExists(false);
      lobby = "home";
    }
    setPage(lobby);
    setRoomCode(userRoomInput);
  };
  return (
    <div>
      <div>
        <input
          type="text"
          onChange={onChange}
          placeholder="Enter existing room code"
        ></input>
        <button onClick={handleClick}>Join Room</button>
      </div>
      <div>{roomExists === false && <h2>That Room Does Not Exist</h2>}</div>
    </div>
  );
};

export default JoinRoomButton;
