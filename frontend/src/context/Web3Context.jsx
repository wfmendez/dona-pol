import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, DONATION_FACTORY_ABI } from '../config/constants';

const SUPPORTED_CHAIN_IDS = [31337, 80002];

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [lastTxHash, setLastTxHash] = useState(null);

  const isWrongNetwork = chainId !== null && !SUPPORTED_CHAIN_IDS.includes(chainId);

  const updateBalance = async (currentContract) => {
    if (!currentContract) return;
    try {
      const balance = await currentContract.getContractBalance();
      setContractBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return;
    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));
      setWalletAddress(accounts[0]);

      const web3Signer = await provider.getSigner();
      setSigner(web3Signer);

      const donationContract = new ethers.Contract(CONTRACT_ADDRESS, DONATION_FACTORY_ABI, web3Signer);
      setContract(donationContract);

      const ownerAddress = await donationContract.owner();
      setIsOwner(accounts[0].toLowerCase() === ownerAddress.toLowerCase());

      await updateBalance(donationContract);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToAmoy = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13882' }],
      });
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  useEffect(() => {
    connectWallet();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  const donate = async (donationAmount) => {
    if (!contract || !donationAmount || parseFloat(donationAmount) <= 0) return;
    try {
      setIsLoading(true);
      const amountInWei = ethers.parseEther(donationAmount);
      const tx = await signer.sendTransaction({ to: CONTRACT_ADDRESS, value: amountInWei });
      await tx.wait();
      setLastTxHash(tx.hash);
      await updateBalance(contract);
    } catch (error) {
      console.error('Error during donation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async () => {
    if (!contract || !isOwner) return;
    try {
      setIsLoading(true);
      const tx = await contract.withdraw();
      await tx.wait();
      await updateBalance(contract);
    } catch (error) {
      console.error('Error during withdrawal:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearLastTx = () => setLastTxHash(null);

  return (
    <Web3Context.Provider value={{
      walletAddress,
      contractBalance,
      isOwner,
      isLoading,
      chainId,
      isWrongNetwork,
      lastTxHash,
      connectWallet,
      switchToAmoy,
      donate,
      withdraw,
      clearLastTx,
    }}>
      {children}
    </Web3Context.Provider>
  );
};
