import { supabase } from "../supabase_client";
import { useEffect, useState } from "react";

const InventoryList = (props) => {
  const { myPlayerData } = props;
  const [playerInventory, setplayerInventory] = useState([]);
  const [newCollectedCardID, setNewCollectedCardID] = useState(0);

  const fetchCardInfo = async () => {
    const { data } = await supabase
      .from("CardList")
      .select("*")
      .eq("cardID", newCollectedCardID);

    setplayerInventory(() => playerInventory.concat(data));
  };

  useEffect(() => {
    let mySubscription = supabase
      .from("PlayersToCardList")
      .on("INSERT", (payload) => {
        let cardID = 0;
        if (payload.new.playerID === myPlayerData.playerID) {
          cardID = payload.new.cardID;
        }
        setNewCollectedCardID(cardID);
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, [myPlayerData]);

  useEffect(() => {
    fetchCardInfo();
  }, [newCollectedCardID]);

  useEffect(() => {
    if (newCollectedCardID !== 0) {
      fetchCardInfo();
    }
  }, [newCollectedCardID]);

  return (
    <div>
      <div className="playerInventory">
        <table>
          <thead>
            <tr>
              <td>
                <strong>Card Inventory</strong>
              </td>
            </tr>
          </thead>
          <tbody>
            {playerInventory.map((collectedCards) => (
              <tr>
                <td>{collectedCards.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default InventoryList;
