import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, DONATION_FACTORY_ABI } from '../config/constants';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState('Welcome! Connect your wallet to get started.');
  const [isLoading, setIsLoading] = useState(false);

  const updateBalance = async (currentContract) => {
    if (!currentContract) return;
    try {
      const balance = await currentContract.getContractBalance();
      setContractBalance(ethers.formatEther(balance)); // Convert Wei to Ether for display
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Request user to connect their MetaMask account
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        
        // Get the signer, needed to send transactions
        const web3Signer = await provider.getSigner();
        setSigner(web3Signer);
        
        // Create an instance of the contract we can interact with
        const donationContract = new ethers.Contract(CONTRACT_ADDRESS, DONATION_FACTORY_ABI, web3Signer);
        setContract(donationContract);

        // Check if the connected address is the contract owner
        const ownerAddress = await donationContract.owner();
        setIsOwner(accounts[0].toLowerCase() === ownerAddress.toLowerCase());

        setMessage('Wallet connected successfully.');
        await updateBalance(donationContract);

      } catch (error) {
        console.error("Error connecting wallet:", error);
        setMessage('Error connecting. Check the console for more details.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setMessage('MetaMask is not installed. Please install it.');
    }
  };

  useEffect(() => {
    connectWallet();

    // Set up listeners to reload the page if the user changes account or network
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  const donate = async (donationAmount) => {
    if (!contract || !donationAmount || parseFloat(donationAmount) <= 0) {
      setMessage('Please enter a valid amount to donate.');
      return;
    }

    try {
      setIsLoading(true);
      setMessage(`Processing donation of ${donationAmount} POL...`);
      const amountInWei = ethers.parseEther(donationAmount);
      
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: amountInWei
      });

      await tx.wait(); 

      setMessage(`Thank you for your donation of ${donationAmount} POL!`);
      await updateBalance(contract); 
    } catch (error) {
      console.error("Error during donation:", error);
      setMessage(`Donation error: ${error.reason || 'Transaction rejected.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async () => {
    if (!contract || !isOwner) {
      setMessage("Action not allowed. Only the owner can withdraw funds.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("Withdrawing funds...");
      const tx = await contract.withdraw(); 
      await tx.wait();

      setMessage("Funds withdrawn successfully!");
      await updateBalance(contract); 
    } catch (error) {
      console.error("Error during withdrawal:", error);
      setMessage(`Withdrawal error: ${error.reason || 'Transaction rejected.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        walletAddress,
        contractBalance,
        isOwner,
        message,
        isLoading,
        connectWallet,
        donate,
        withdraw,
        setMessage
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
