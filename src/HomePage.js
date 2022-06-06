import CreatePlayerButton from "./CreatePlayerButton";
const HomePage = (props) => {
  const { player, setPlayer, setPage, setRoomCode } = props;
  return (
    <div>
      <h1>This is the home page.</h1>

      <CreatePlayerButton
        player={player}
        setPlayer={setPlayer}
        setPage={setPage}
        setRoomCode={setRoomCode}
      ></CreatePlayerButton>
    </div>
  );
};

export default HomePage;
