import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css'; 

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// --- IMPORTANT ACTION! ---
// Contract's ABI here.
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "donor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalDonated",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "DonationReceived",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getContractBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];


function App() {
  // States to manage the DApp's information
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [message, setMessage] = useState('Welcome! Connect your wallet to get started.');
  const [contractBalance, setContractBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);

  // Function to update the balance displayed in the UI
  const updateBalance = async (currentContract) => {
    if (!currentContract) return;
    try {
      const balance = await currentContract.getContractBalance();
      setContractBalance(ethers.formatEther(balance)); // Convert Wei to Ether for display
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // This hook runs only once when the component loads
  useEffect(() => {
    const connectWallet = async () => {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // Request user to connect their MetaMask account
          const accounts = await provider.send("eth_requestAccounts", []);
          setWalletAddress(accounts[0]);
          
          // Get the signer, needed to send transactions
          const web3Signer = await provider.getSigner();
          setSigner(web3Signer);
          
          // Create an instance of the contract we can interact with
          const donationContract = new ethers.Contract(contractAddress, contractABI, web3Signer);
          setContract(donationContract);

          // Check if the connected address is the contract owner
          const ownerAddress = await donationContract.owner();
          setIsOwner(accounts[0].toLowerCase() === ownerAddress.toLowerCase());

          setMessage('Wallet connected successfully.');
          updateBalance(donationContract);

        } catch (error) {
          console.error("Error connecting wallet:", error);
          setMessage('Error connecting. Check the console for more details.');
        }
      } else {
        setMessage('MetaMask is not installed. Please install it.');
      }
    };

    connectWallet();

    // Set up listeners to reload the page if the user changes account or network
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []); // The empty array ensures this effect runs only once

  // Function to handle sending donations
  const handleDonate = async () => {
    if (!contract || !donationAmount || parseFloat(donationAmount) <= 0) {
      setMessage('Please enter a valid amount to donate.');
      return;
    }

    try {
      setMessage(`Processing donation of ${donationAmount} POL...`);
      // Convert the amount to Wei, the smallest unit of Ether/POL
      const amountInWei = ethers.parseEther(donationAmount);
      
      // Send the transaction. Since we don't call a specific function,
      // the `receive()` function in our contract is triggered.
      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: amountInWei
      });

      await tx.wait(); // Wait for the transaction to be confirmed

      setMessage(`Thank you for your donation of ${donationAmount} POL!`);
      setDonationAmount('');
      updateBalance(contract); // Update the balance in the UI
    } catch (error) {
      console.error("Error during donation:", error);
      setMessage(`Donation error: ${error.reason || 'Transaction rejected.'}`);
    }
  };

  // Function for the owner to withdraw funds
  const handleWithdraw = async () => {
    if (!contract || !isOwner) {
      setMessage("Action not allowed. Only the owner can withdraw funds.");
      return;
    }

    try {
      setMessage("Withdrawing funds...");
      const tx = await contract.withdraw(); // Call the 'withdraw' function from the contract
      await tx.wait();

      setMessage("Funds withdrawn successfully!");
      updateBalance(contract); // Update the balance
    } catch (error) {
      console.error("Error during withdrawal:", error);
      setMessage(`Withdrawal error: ${error.reason || 'Transaction rejected.'}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dona-Pol</h1>
        <p>{message}</p>
        
        {walletAddress && <p className="address"><strong>Your Address:</strong> {walletAddress}</p>}
        
        <section>
        <div className="card">
          <h2>Contract Balance</h2>
          <p className="balance">{contractBalance} POL (local)</p>
        </div>

        <div className="card">
          <h3>Make a Donation</h3>
          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="e.g., 0.01"
          />
          <button onClick={handleDonate} disabled={!signer}>
            Donate
          </button>
        </div>
        </section>

        {isOwner && (
          <div className="card owner-card">
            <h3>Admin Panel</h3>
            <button onClick={handleWithdraw} disabled={!signer}>
              Withdraw Funds
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
