import logo from './logo.svg';
import './App.css';
import { Web3Auth } from "@web3auth/modal";

const web3auth = new Web3Auth({
  clientId: "YOUR_WEB3AUTH_CLIENT_ID",
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x1", // Ethereum mainnet
  },
});

function App() {
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
await web3auth.initModal();
const provider = await web3auth.connect();
const web3 = new Web3(provider);
const accounts = await web3.eth.getAccounts();
console.log(accounts); // Affiche les comptes de l'utilisateur
