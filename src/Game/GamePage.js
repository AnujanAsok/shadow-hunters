import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";

const GamePage = (props) => {
  const { roomCode, totalPlayers } = props;
  const [attackTarget, setAttackTarget] = useState();
  const [totalPlayersHp, setTotalPlayersHp] = useState(["hello"]);

  const handleChange = (e) => {
    setAttackTarget(e.target.value);
  };

  const handleClick = () => {};

  useEffect(() => {
    const fetchHitpoints = async () => {
      const { data, error } = await supabase
        .from("Players")
        .select("name, Hitpoints")
        .eq("roomID", roomCode);
      const playerHp = data.map((playerData) => {
        return { name: playerData.name, Hitpoints: playerData.Hitpoints };
      });
      setTotalPlayersHp(playerHp);
    };
    fetchHitpoints();
  }, []);

  useEffect(
    () => console.log("DID STATE CHANGE? ", totalPlayersHp),
    [totalPlayersHp]
  );
  useEffect(() => console.log("MY COMPONENT MOUNTED "), []);
  useEffect(() => {
    let mySubscription = supabase
      .from("Players:gameStatus=eq.true")
      .on("UPDATE", (payload) => {
        console.log(payload);
        console.log("State variable total players: ", totalPlayersHp);
        const changeHitpoints = totalPlayersHp.map((playerData) => {
          if (payload.new.name === playerData.name) {
            return { name: payload.new.name, Hitpoints: payload.new.Hitpoints };
          } else {
            return { name: playerData.name, Hitpoints: playerData.Hitpoints };
          }
        });
        console.log("results from hitpoint map ", changeHitpoints);
        setTotalPlayersHp(changeHitpoints);
      })
      .subscribe();
  }, []);
  return (
    <div>
      <h1>This is the Game Page</h1>
      <div>
        <select name="test" id="test" onChange={handleChange}>
          {totalPlayersHp.map((element) => (
            <option value={element.name} key={element.name}>
              {element.name} HitPoints: {element.Hitpoints}
            </option>
          ))}
        </select>
        <button onClick={handleClick}>Attack</button>
      </div>
    </div>
  );
};

export default GamePage;
