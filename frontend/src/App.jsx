import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import donaPolLogo from './assets/dona-pol-logo.svg';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const contractABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "donor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "totalDonated", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "DonationReceived",
    "type": "event"
  },
  { "inputs": [], "name": "getContractBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "stateMutability": "payable", "type": "receive" }
];

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [message, setMessage] = useState({ text: 'Welcome! Connect your wallet to get started.', type: 'info' });
  const [contractBalance, setContractBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState({ donate: false, withdraw: false });

  const showMessage = (text, type = 'info') => setMessage({ text, type });

  const updateBalance = async (currentContract) => {
    if (!currentContract) return;
    try {
      const balance = await currentContract.getContractBalance();
      setContractBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          setWalletAddress(accounts[0]);

          const web3Signer = await provider.getSigner();
          setSigner(web3Signer);

          const donationContract = new ethers.Contract(contractAddress, contractABI, web3Signer);
          setContract(donationContract);

          const ownerAddress = await donationContract.owner();
          setIsOwner(accounts[0].toLowerCase() === ownerAddress.toLowerCase());

          showMessage('Wallet connected successfully!', 'success');
          updateBalance(donationContract);
        } catch (error) {
          console.error("Error connecting wallet:", error);
          showMessage('Error connecting wallet. Check console for details.', 'error');
        }
      } else {
        showMessage('MetaMask is not installed. Please install it.', 'error');
      }
    };

    connectWallet();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  const handleDonate = async () => {
    if (!contract || !donationAmount || parseFloat(donationAmount) <= 0) {
      showMessage('Please enter a valid amount to donate.', 'error');
      return;
    }

    setIsLoading(prev => ({ ...prev, donate: true }));
    showMessage(`Processing donation of ${donationAmount} POL...`, 'info');

    try {
      const amountInWei = ethers.parseEther(donationAmount);
      const tx = await signer.sendTransaction({ to: contractAddress, value: amountInWei });
      await tx.wait();

      showMessage(`Thank you for your donation of ${donationAmount} POL!`, 'success');
      setDonationAmount('');
      updateBalance(contract);
    } catch (error) {
      console.error("Error during donation:", error);
      const errorMsg = error.reason || error.message || 'Transaction rejected.';
      showMessage(`Error: ${errorMsg}`, 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, donate: false }));
    }
  };

  const handleWithdraw = async () => {
    if (!contract || !isOwner) {
      showMessage("Action not allowed. Only the owner can withdraw.", 'error');
      return;
    }

    setIsLoading(prev => ({ ...prev, withdraw: true }));
    showMessage("Withdrawing funds...", 'info');

    try {
      const tx = await contract.withdraw();
      await tx.wait();
      showMessage("Funds withdrawn successfully!", 'success');
      updateBalance(contract);
    } catch (error) {
      console.error("Error during withdrawal:", error);
      showMessage(`Error: ${error.reason || 'Transaction rejected.'}`, 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, withdraw: false }));
    }
  };

  const formatAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-top">
          <img src={donaPolLogo} className="logo" alt="Dona-Pol logo" />
          <h1>Dona-Pol</h1>
          <p className="subtitle">Decentralized Donations on Polygon</p>
        </div>

        <div className={`message ${message.type}`}>
          {message.text}
        </div>

        {walletAddress && (
          <div className="wallet-info">
            <span className="wallet-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 12V8H4a4 4 0 0 1 0-8h16a4 4 0 0 1 0 8v4z"/>
                <path d="M4 12v4h16v-4"/>
              </svg>
              {formatAddress(walletAddress)}
            </span>
          </div>
        )}

        <div className="cards-container">
          <div className="card balance-card">
            <h2>Contract Balance</h2>
            <p className="balance-amount">{parseFloat(contractBalance).toFixed(4)}</p>
            <p className="balance-label">POL</p>
          </div>

          <div className="card donation-card">
            <h3>Make a Donation</h3>
            <div className="input-group">
              <label htmlFor="donation-amount">Amount to Donate</label>
              <input
                id="donation-amount"
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="0.0"
                min="0"
                step="0.01"
                disabled={!signer}
              />
            </div>
            <button 
              className={`btn btn-primary ${isLoading.donate ? 'btn-loading' : ''}`}
              onClick={handleDonate} 
              disabled={!signer || !donationAmount || isLoading.donate}
            >
              {isLoading.donate ? 'Processing...' : 'Donate POL'}
            </button>
          </div>
        </div>

        {isOwner && (
          <div className="card owner-card">
            <span className="owner-badge">Admin</span>
            <h3>Owner Panel</h3>
            <button 
              className={`btn btn-danger ${isLoading.withdraw ? 'btn-loading' : ''}`}
              onClick={handleWithdraw} 
              disabled={!signer || isLoading.withdraw}
            >
              {isLoading.withdraw ? 'Withdrawing...' : 'Withdraw Funds'}
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;