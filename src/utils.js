export const generateRoomCode = () => {
  const roomKeys = "abcdefghijklmnopqrstuvwxyz";
  let roomID = "";
  for (let i = 0; i < 4; i++) {
    roomID += roomKeys.charAt(Math.floor(Math.random() * roomKeys.length));
    roomID = roomID.toUpperCase();
  }
  return roomID;
};

export const generateSixSidedDice = () => {
  return Math.floor(Math.random() * 6 + 1);
};

export const generateFourSidedDice = () => {
  return Math.floor(Math.random() * 4 + 1);
};
