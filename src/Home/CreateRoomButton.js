import { supabase } from "../supabase_client";
import { randomKeyGenerator } from "../utils";

const CreateRoomButton = (props) => {
  const { player, setPage, setRoomCode, setIsHost } = props;
  const handleClick = async () => {
    const roomID = randomKeyGenerator();
    setRoomCode(roomID);
    const { data, error } = await supabase
      .from("Players")
      .update({ roomID: roomID })
      .match({ name: player });
    setIsHost(true);
    setPage("lobby");
  };
  return (
    <div>
      <button onClick={handleClick}>Create Room</button>
    </div>
  );
};

export default CreateRoomButton;
