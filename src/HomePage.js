import CreatePlayerButton from "./CreatePlayerButton";
const HomePage = (props) => {
  const { player, setPlayer, setPage } = props;
  return (
    <div>
      <h1>This is the home page.</h1>

      <CreatePlayerButton
        player={player}
        setPlayer={setPlayer}
        setPage={setPage}
      ></CreatePlayerButton>
    </div>
  );
};

export default HomePage;
