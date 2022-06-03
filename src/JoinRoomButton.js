import { supabase } from "./supabase_client";

const JoinRoomButton = (props) => {
  const { player, setPage } = props;
  const handleClick = async () => {
    const roomID = 1234;
    const { data, error } = await supabase
      .from("Players")
      .update({ roomID: roomID })
      .match({ name: player });
    setPage("lobby");
  };
  return (
    <div>
      <button onClick={handleClick}>Join Room</button>
    </div>
  );
};

export default JoinRoomButton;
