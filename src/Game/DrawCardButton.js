import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase_client";

const DrawCardButton = (props) => {
  const {
    currentPlayerLocationID,
    myPlayerData,
    currentTurnPlayer,
    playerName,
    hasPlayerMovedLocations,
    setHasPlayerDrawnCard,
    hasPlayerDrawnCard,
  } = props;
  const [availableCardsList, setAvailableCardsList] = useState([]);

  const fetchLocationSpecificCards = async () => {
    const { data } = await supabase
      .from("CardList")
      .select("cardID, name, description")
      .eq("locationID", currentPlayerLocationID);
    setAvailableCardsList(data);
  };

  useEffect(() => {
    fetchLocationSpecificCards();
  }, [currentPlayerLocationID]);

  const sendCardToInventory = async () => {
    const randomCard =
      availableCardsList[Math.floor(Math.random() * availableCardsList.length)];
    await supabase
      .from("PlayersToCardList")
      .insert([{ playerID: myPlayerData.playerID, cardID: randomCard.cardID }]);
    setHasPlayerDrawnCard(true);
  };

  const isMyPlayersTurn = currentTurnPlayer?.name === playerName;

  return (
    <div>
      <button
        onClick={sendCardToInventory}
        disabled={
          !isMyPlayersTurn ||
          hasPlayerMovedLocations === "location" ||
          hasPlayerDrawnCard === true
        }
      >
        Draw a card
      </button>
    </div>
  );
};

export default DrawCardButton;
