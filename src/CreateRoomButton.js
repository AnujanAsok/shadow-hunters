import { supabase } from "./supabase_client";

const CreateRoomButton = (props) => {
  const { player, setPage } = props;
  const handleClick = async () => {
    const roomKeys = "abcdefghijklmnopqrstuvwxyz";
    let roomID = "";
    for (let i = 0; i < 4; i++) {
      roomID += roomKeys.charAt(Math.floor(Math.random() * roomKeys.length));
      roomID = roomID.toUpperCase();
    }
    const { data, error } = await supabase
      .from("Players")
      .update({ roomID: roomID })
      .match({ name: player });
    setPage("lobby");
  };
  return (
    <div>
      <button onClick={handleClick}>Create Room</button>
    </div>
  );
};

export default CreateRoomButton;
