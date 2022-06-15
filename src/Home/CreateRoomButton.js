import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";
import { generateRoomCode } from "../utils";

const CreateRoomButton = (props) => {
  const { playerName, setPage, setRoomCode, setIsHost, roomCode } = props;
  const [isRoomTaken, setIsRoomTaken] = useState();

  const validRoomCode = async () => {
    const roomID = generateRoomCode();
    const { error } = await supabase.from("Rooms").insert({ roomID: roomID }); // fix this
    console.log(error);
    const { data } = await supabase
      .from("Players")
      .update({ roomID: roomID })
      .match({ name: playerName });
    setRoomCode(roomID);
    return error;
  };

  const handleClick = async () => {
    const checkRoomCode = await validRoomCode();
    let pageSelect = "home";
    let hostSelect = false;
    let roomAlreadyExists = false;
    if (checkRoomCode === null) {
      hostSelect = true;
      pageSelect = "lobby";
    } else {
      roomAlreadyExists = true;
    }
    setIsRoomTaken(roomAlreadyExists);
    setIsHost(hostSelect);
    setPage(pageSelect);
  };

  return (
    <div>
      <button onClick={handleClick}>Create Room</button>
      {isRoomTaken === true && <h3>Room creation , please try again</h3>}
    </div>
  );
};

export default CreateRoomButton;
