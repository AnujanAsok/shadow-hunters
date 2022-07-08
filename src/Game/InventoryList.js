import { supabase } from "../supabase_client";
import { useEffect, useState } from "react";

const InventoryList = (props) => {
  const { myPlayerData } = props;
  const [playerInventory, setplayerInventory] = useState([]);
  const [newCardInfo, setNewCardInfo] = useState([]);

  const fetchCardInfo = async () => {
    let cardInfo = null;
    if (myPlayerData && newCardInfo.new.playerID === myPlayerData.playerID) {
      const { data } = await supabase
        .from("CardList")
        .select("*")
        .eq("cardID", newCardInfo.new.cardID);
      cardInfo = data;
    }
    setplayerInventory((currentInventory) =>
      cardInfo !== null ? currentInventory.concat(cardInfo) : currentInventory
    );
  };

  useEffect(() => {
    let mySubscription = supabase
      .from("PlayersToCardList")
      .on("INSERT", (payload) => {
        setNewCardInfo(payload);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);

  useEffect(() => {
    fetchCardInfo();
  }, [newCardInfo]);

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
