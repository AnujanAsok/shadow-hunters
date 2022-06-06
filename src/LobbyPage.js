import PlayerList from "./PlayerList";

const LobbyPage = (props) => {
  const { roomCode } = props;
  return (
    <div>
      <h1>This is the Lobby page.</h1>
      <h2>Room Code: {roomCode}</h2>
      <PlayerList roomCode={roomCode} />
    </div>
  );
};

export default LobbyPage;
