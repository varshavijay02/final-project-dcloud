import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
// import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
// import "./App.css";

// run a hardhat node: `npx hardhat node`
// open integrated terminal of client and type `npm start` in terminal

const ethers = require("ethers");

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        //Change this every time you close your node.
        //If u close your node then run:-
        // "npx hardhat node" (then)
        // "npx hardhat run --network localhost scripts/deploy.js"
        // copy the address given after line "Library deployed to:" to the below variable.
        // pinata free dedicated gateway: cyan-spare-cattle-259.mypinata.cloud
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);
        console.log(address);

        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask not installed");
      }
    };
    provider && loadProvider();
  }, []);

  return (
    <>
      <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      <div className="App">
        <h1>Dcloud 2.0</h1>
        <div class="bg"></div>
        <div class="bg bg2"></div>
        <div class="bg bg3"></div>

        <p style={{ color: "black" }}>
          Account : {account ? account : "Not Connected"}
        </p>
        <FileUpload account={account} provider={provider} contract={contract} />
        <Display contract={contract} account={account}></Display>
      </div>
    </>
  );
}

export default App;
