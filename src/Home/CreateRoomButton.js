import { useEffect } from "react";
import { supabase } from "../supabase_client";
import { generateRoomCode } from "../utils";

const CreateRoomButton = (props) => {
  const { player, setPage, setRoomCode, setIsHost, roomCode } = props;
  let pageSelect = "home";
  let hostSelect = false;
  let roomSelect = null;

  const fetchRoomCodes = async () => {
    const { data } = await supabase.from("Players").select("roomID");
    const registeredRooms = data;
    return registeredRooms;
  };

  const handleClick = async () => {
    const roomID = generateRoomCode();
    const registeredRooms = await fetchRoomCodes();
    const existingRoomCode = registeredRooms.find(
      (rooms) => rooms.roomID === roomID
    );

    if (existingRoomCode === undefined) {
      const { data, error } = await supabase
        .from("Players")
        .update({ roomID: roomID })
        .match({ name: player });
      hostSelect = true;
      roomSelect = roomID;
      pageSelect = "lobby";
    } else {
      handleClick();
    }
    setIsHost(hostSelect);
    setPage(pageSelect);
    setRoomCode(roomSelect);
  };

  return (
    <div>
      <button onClick={handleClick}>Create Room</button>
    </div>
  );
};

export default CreateRoomButton;
