import React, { useState } from "react";
import "./App.css";
import contractABI from "./abi.json";
const { ethers } = require("ethers");

const contractAddress = "0x05e32b6134D72E610aFe2a5Df6bbaE8b399CF57b";

async function requestAccount() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
}

async function getMessage(setCurrentMessage, setMessage) {
  if (typeof window.ethereum !== "undefined") {
    await requestAccount();

    // Use MetaMask provider for production
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const message = await contract.getMessage();
      await message.wait();
      setMessage(message); // Update the state with the current message
      console.log("Current message:", message);
    } catch (err) {
      console.error("Error:", err);
    }
  } else {
    console.error(
      "Please install MetaMask or use a compatible Ethereum browser."
    );
  }
}

async function setMessage(newMessage, setCurrentMessage) {
  if (typeof window.ethereum !== "undefined") {
    await requestAccount();

    // Use MetaMask provider for production
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const transaction = await contract.setMessage(newMessage);
      await transaction.wait();
      console.log("Message set successfully");
      // Update the current message directly from the newMessage state
      setCurrentMessage(newMessage);
    } catch (err) {
      console.error("Error:", err);
    }
  } else {
    console.error(
      "Please install MetaMask or use a compatible Ethereum browser."
    );
  }
}

function App() {
  const [currentMessage, setCurrentMessage] = useState("Loading...");
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="App">
      <div>
        <h2>Current Message</h2>
        <p id="currentMessage">{currentMessage}</p>
        <button onClick={() => getMessage(setCurrentMessage, setNewMessage)}>
          Get Message
        </button>
      </div>

      <div>
        <h2>Set Message</h2>
        <label htmlFor="newMessageInput">New Message:</label>
        <input
          type="text"
          id="newMessageInput"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={() => setMessage(newMessage, setCurrentMessage)}>
          Set Message
        </button>
      </div>
    </div>
  );
}

export default App;
