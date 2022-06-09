export const generateRoomCode = () => {
  const roomKeys = "abcdefghijklmnopqrstuvwxyz";
  let roomID = "";
  for (let i = 0; i < 4; i++) {
    roomID += roomKeys.charAt(Math.floor(Math.random() * roomKeys.length));
    roomID = roomID.toUpperCase();
  }
  return roomID;
};
