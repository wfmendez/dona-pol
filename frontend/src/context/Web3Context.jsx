import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, DONATION_FACTORY_ABI } from '../config/constants';

const SUPPORTED_CHAIN_IDS = [31337, 80002]; // Hardhat local + Polygon Amoy

const Web3Context = createContext();
export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner]               = useState(null);
  const [contract, setContract]           = useState(null);
  const [contractBalance, setContractBalance] = useState('0');
  const [isOwner, setIsOwner]             = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [chainId, setChainId]             = useState(null);
  const [lastTxHash, setLastTxHash]       = useState(null);
  const [lastDonationAmount, setLastDonationAmount] = useState(null);
  const [contractError, setContractError] = useState(null);

  const isWrongNetwork = chainId !== null && !SUPPORTED_CHAIN_IDS.includes(chainId);

  const updateBalance = async (currentContract) => {
    if (!currentContract) return;
    try {
      const balance = await currentContract.getContractBalance();
      setContractBalance(ethers.formatEther(balance));
    } catch { /* ignore if not deployed */ }
  };

  const connectWallet = async () => {
    if (!window.ethereum) { setContractError('no_metamask'); return; }
    try {
      setIsLoading(true);
      setContractError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network  = await provider.getNetwork();

      setChainId(Number(network.chainId));
      setWalletAddress(accounts[0]);

      const web3Signer = await provider.getSigner();
      setSigner(web3Signer);

      const donationContract = new ethers.Contract(CONTRACT_ADDRESS, DONATION_FACTORY_ABI, web3Signer);
      setContract(donationContract);

      try {
        const code = await provider.getCode(CONTRACT_ADDRESS);
        if (code === '0x') { setContractError('not_deployed'); return; }
        const ownerAddress = await donationContract.owner();
        setIsOwner(accounts[0].toLowerCase() === ownerAddress.toLowerCase());
        await updateBalance(donationContract);
      } catch { setContractError('not_deployed'); }
    } catch (error) {
      console.error('Wallet connect error:', error);
      if (error.code !== 4001) setContractError('connect_failed');
    } finally { setIsLoading(false); }
  };

  const switchToAmoy = async () => {
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x13882' }] });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x13882', chainName: 'Polygon Amoy Testnet',
            nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
            rpcUrls: ['https://rpc-amoy.polygon.technology/'],
            blockExplorerUrls: ['https://amoy.polygonscan.com/'],
          }],
        });
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged',    () => window.location.reload());
    }
  }, []);

  const donate = async (donationAmount) => {
    if (!signer || !donationAmount || parseFloat(donationAmount) <= 0) return;
    try {
      setIsLoading(true);
      const tx = await signer.sendTransaction({ to: CONTRACT_ADDRESS, value: ethers.parseEther(donationAmount) });
      await tx.wait();
      setLastTxHash(tx.hash);
      setLastDonationAmount(donationAmount);
      if (contract) await updateBalance(contract);
    } catch (error) { console.error('Donate error:', error); throw error; }
    finally { setIsLoading(false); }
  };

  const withdraw = async () => {
    if (!contract || !isOwner) return;
    try {
      setIsLoading(true);
      const tx = await contract.withdraw();
      await tx.wait();
      await updateBalance(contract);
    } catch (error) { console.error('Withdraw error:', error); throw error; }
    finally { setIsLoading(false); }
  };

  const clearLastTx = () => { setLastTxHash(null); setLastDonationAmount(null); };

  return (
    <Web3Context.Provider value={{
      walletAddress, contractBalance, isOwner, isLoading,
      chainId, isWrongNetwork, contractError,
      lastTxHash, lastDonationAmount,
      connectWallet, switchToAmoy, donate, withdraw, clearLastTx,
    }}>
      {children}
    </Web3Context.Provider>
  );
};
