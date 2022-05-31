import logo from "./logo.svg";
import "./App.css";
import { supabase } from "./supabase_client";

function App() {
  const getProfile = async () => {
    let { data, error, status } = await supabase
      .from("initial-test")
      .select(`color`);
    console.log(data);
  };
  getProfile();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
export default App;
