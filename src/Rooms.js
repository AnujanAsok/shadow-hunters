import { supabase } from "./supabase_client";

const Rooms = () => {
  const onclick = async () => {
    let { data, error, status } = await supabase
      .from("Rooms")
      .insert([{ roomcode: "hytr" }]);
  };
  return (
    <div>
      <button onClick={onclick}>Create Room</button>
    </div>
  );
};
export default Rooms;
