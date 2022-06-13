import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";
import { generateRoomCode } from "../utils";

const CreateRoomButton = (props) => {
  const { player, setPage, setRoomCode, setIsHost, roomCode } = props;
  const [isRoomTaken, setIsRoomTaken] = useState(false);

  const validRoomCode = async () => {
    const roomID = generateRoomCode();
    const { data, error } = await supabase
      .from("Players")
      .update({ roomID: roomID })
      .match({ name: player });
    setRoomCode(roomID);
    return error;
  };

  const handleClick = async () => {
    const checkRoomCode = await validRoomCode();
    let pageSelect = "home";
    let hostSelect = false;
    if (checkRoomCode === null) {
      hostSelect = true;
      pageSelect = "lobby";
    } else {
      setIsRoomTaken(true);
    }

    setIsHost(hostSelect);
    setPage(pageSelect);
  };

  return (
    <div>
      <button onClick={handleClick}>Create Room</button>
      {isRoomTaken === true && <h3>Room is in use, please try again</h3>}
    </div>
  );
};

export default CreateRoomButton;
