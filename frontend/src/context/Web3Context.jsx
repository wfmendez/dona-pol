import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, DONATION_FACTORY_ABI } from '../config/constants';

const SUPPORTED_CHAIN_IDS = [31337, 80002]; // Hardhat local + Polygon Amoy
const PAST_EVENTS_BLOCK_RANGE = 2000;       // look back ~2 000 blocks on connect
const MAX_DONATIONS_CACHE = 30;            // keep last 30 events in memory
const BALANCE_POLL_INTERVAL = 30_000;      // refresh balances every 30 s

/* ── helpers ── */

const parseEventLog = (event) => ({
  donor:        event.args.donor,
  amount:       ethers.formatEther(event.args.amount),
  totalBalance: ethers.formatEther(event.args.totalBalance),
  timestamp:    new Date(Number(event.args.timestamp) * 1000),
  message:      event.args.message ?? '',
  txHash:       event.log?.transactionHash ?? event.transactionHash ?? '',
  blockNumber:  event.log?.blockNumber    ?? event.blockNumber    ?? 0,
});

/* ── context ── */

const Web3Context = createContext();
export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  // wallet / provider
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer,        setSigner]        = useState(null);
  const [provider,      setProvider]      = useState(null);
  const [chainId,       setChainId]       = useState(null);
  const [walletBalance, setWalletBalance] = useState('0');

  // contract
  const [contract,         setContract]         = useState(null);
  const [contractBalance,  setContractBalance]  = useState('0');
  const [donorCount,       setDonorCount]       = useState(0);
  const [donations,        setDonations]        = useState([]);   // live event log
  const [isOwner,          setIsOwner]          = useState(false);

  // ui state
  const [isLoading,          setIsLoading]          = useState(false);
  const [contractError,      setContractError]      = useState(null);
  const [lastTxHash,         setLastTxHash]         = useState(null);
  const [lastDonationAmount, setLastDonationAmount] = useState(null);

  const isWrongNetwork = chainId !== null && !SUPPORTED_CHAIN_IDS.includes(chainId);

  /* ── balance helpers ── */

  const updateContractBalance = useCallback(async (c) => {
    try {
      const bal = await c.getContractBalance();
      setContractBalance(ethers.formatEther(bal));
    } catch { /* contract not deployed or RPC error */ }
  }, []);

  const updateWalletBalance = useCallback(async (prov, address) => {
    try {
      const bal = await prov.getBalance(address);
      setWalletBalance(ethers.formatEther(bal));
    } catch { /* ignore */ }
  }, []);

  const updateDonorCount = useCallback(async (c, fallbackDonations = []) => {
    try {
      // Prefer on-chain donorCount() (v2 contract)
      const count = await c.donorCount();
      setDonorCount(Number(count));
    } catch {
      // Fall back: count unique donors from loaded events
      const uniq = new Set(fallbackDonations.map((d) => d.donor.toLowerCase()));
      setDonorCount(uniq.size);
    }
  }, []);

  /* ── past-event loader ── */

  const loadPastEvents = useCallback(async (c) => {
    try {
      const filter = c.filters.DonationReceived();
      const raw    = await c.queryFilter(filter, -PAST_EVENTS_BLOCK_RANGE);
      const parsed = raw
        .reverse()
        .slice(0, MAX_DONATIONS_CACHE)
        .map(parseEventLog);
      setDonations(parsed);
      return parsed;
    } catch (err) {
      console.warn('[Web3] Could not load past events:', err.message);
      return [];
    }
  }, []);

  /* ── gas estimation ── */

  /**
   * Estimates network fee for a given donation.
   * Returns { units, costPol, costGwei } or null on failure.
   */
  const estimateGas = useCallback(
    async (amount, message = '') => {
      if (!provider || !amount || parseFloat(amount) <= 0) return null;
      try {
        const value = ethers.parseEther(amount);
        let gasUnits;

        if (message.trim() && contract) {
          try {
            // v2 contract: donate(string)
            gasUnits = await contract.donate.estimateGas(message.trim(), { value });
          } catch {
            // fallback: plain transfer
            gasUnits = await provider.estimateGas({ to: CONTRACT_ADDRESS, value });
          }
        } else {
          gasUnits = await provider.estimateGas({ to: CONTRACT_ADDRESS, value });
        }

        const feeData  = await provider.getFeeData();
        const gasPrice = feeData.maxFeePerGas ?? feeData.gasPrice ?? ethers.parseUnits('30', 'gwei');
        const costWei  = gasUnits * gasPrice;

        return {
          units:    Number(gasUnits),
          costPol:  parseFloat(ethers.formatEther(costWei)).toFixed(6),
          costGwei: parseFloat(ethers.formatUnits(gasPrice, 'gwei')).toFixed(1),
        };
      } catch {
        return null;
      }
    },
    [provider, contract],
  );

  /* ── wallet connect ── */

  const connectWallet = async () => {
    if (!window.ethereum) { setContractError('no_metamask'); return; }
    try {
      setIsLoading(true);
      setContractError(null);

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const accounts     = await web3Provider.send('eth_requestAccounts', []);
      const network      = await web3Provider.getNetwork();

      setChainId(Number(network.chainId));
      setWalletAddress(accounts[0]);
      setProvider(web3Provider);

      const web3Signer      = await web3Provider.getSigner();
      const donationContract = new ethers.Contract(CONTRACT_ADDRESS, DONATION_FACTORY_ABI, web3Signer);

      setSigner(web3Signer);
      setContract(donationContract);

      // Verify contract is actually deployed
      const code = await web3Provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') { setContractError('not_deployed'); return; }

      // Load on-chain data
      const ownerAddr = await donationContract.owner();
      setIsOwner(accounts[0].toLowerCase() === ownerAddr.toLowerCase());

      await Promise.all([
        updateContractBalance(donationContract),
        updateWalletBalance(web3Provider, accounts[0]),
      ]);

      const pastEvents = await loadPastEvents(donationContract);
      await updateDonorCount(donationContract, pastEvents);

    } catch (error) {
      console.error('[Web3] Connect error:', error);
      if (error.code === 4001) return; // user rejected
      if (error.message?.includes('not_deployed') || error.code === 'CALL_EXCEPTION') {
        setContractError('not_deployed');
      } else {
        setContractError('connect_failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ── real-time event subscription ── */

  useEffect(() => {
    if (!contract || contractError) return;

    const handleDonation = (...args) => {
      // ethers v6: last arg is the EventLog object
      const event = args[args.length - 1];
      const [donor, amount, totalBalance, timestamp, message] = args;

      const entry = {
        donor,
        amount:       ethers.formatEther(amount),
        totalBalance: ethers.formatEther(totalBalance),
        timestamp:    new Date(Number(timestamp) * 1000),
        message:      message ?? '',
        txHash:       event.log?.transactionHash ?? '',
        blockNumber:  event.log?.blockNumber     ?? 0,
      };

      setDonations((prev) => {
        // de-duplicate by txHash
        if (entry.txHash && prev.some((d) => d.txHash === entry.txHash)) return prev;
        return [entry, ...prev].slice(0, MAX_DONATIONS_CACHE);
      });

      // Update balances live
      setContractBalance(ethers.formatEther(totalBalance));
      // Refresh donor count from contract (handles new unique donors)
      contract.donorCount?.()
        .then((c) => setDonorCount(Number(c)))
        .catch(() => {});
    };

    contract.on('DonationReceived', handleDonation);
    return () => { contract.off('DonationReceived', handleDonation); };
  }, [contract, contractError]);

  /* ── periodic balance refresh ── */

  useEffect(() => {
    if (!contract || !provider || !walletAddress) return;
    const id = setInterval(() => {
      updateContractBalance(contract);
      updateWalletBalance(provider, walletAddress);
    }, BALANCE_POLL_INTERVAL);
    return () => clearInterval(id);
  }, [contract, provider, walletAddress, updateContractBalance, updateWalletBalance]);

  /* ── MetaMask listeners ── */

  useEffect(() => {
    if (!window.ethereum) return;
    connectWallet();
    const reload = () => window.location.reload();
    window.ethereum.on('accountsChanged', reload);
    window.ethereum.on('chainChanged',    reload);
    return () => {
      window.ethereum.removeListener('accountsChanged', reload);
      window.ethereum.removeListener('chainChanged',    reload);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── switch network ── */

  const switchToAmoy = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13882' }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId:            '0x13882',
            chainName:          'Polygon Amoy Testnet',
            nativeCurrency:     { name: 'POL', symbol: 'POL', decimals: 18 },
            rpcUrls:            ['https://rpc-amoy.polygon.technology/'],
            blockExplorerUrls:  ['https://amoy.polygonscan.com/'],
          }],
        });
      }
    }
  };

  /* ── donate ── */

  const donate = async (amount, message = '') => {
    if (!signer || !amount || parseFloat(amount) <= 0) return;
    try {
      setIsLoading(true);
      const value = ethers.parseEther(amount);
      let tx;

      if (message.trim() && contract) {
        try {
          // v2 contract: donate(string message) payable
          tx = await contract.donate(message.trim(), { value });
        } catch {
          // Old contract deployed — fall back to plain transfer
          tx = await signer.sendTransaction({ to: CONTRACT_ADDRESS, value });
        }
      } else {
        tx = await signer.sendTransaction({ to: CONTRACT_ADDRESS, value });
      }

      const receipt = await tx.wait();
      setLastTxHash(tx.hash);
      setLastDonationAmount(amount);

      if (provider) await updateWalletBalance(provider, walletAddress);
    } catch (error) {
      console.error('[Web3] Donate error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* ── withdraw ── */

  const withdraw = async () => {
    if (!contract || !isOwner) return;
    try {
      setIsLoading(true);
      const tx = await contract.withdraw();
      await tx.wait();
      if (contract)  await updateContractBalance(contract);
      if (provider)  await updateWalletBalance(provider, walletAddress);
    } catch (error) {
      console.error('[Web3] Withdraw error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearLastTx = () => {
    setLastTxHash(null);
    setLastDonationAmount(null);
  };

  /* ── context value ── */

  return (
    <Web3Context.Provider value={{
      // wallet
      walletAddress,
      walletBalance,
      chainId,
      isWrongNetwork,
      contractError,
      // contract
      contractBalance,
      donorCount,
      donations,
      isOwner,
      isLoading,
      // tx state
      lastTxHash,
      lastDonationAmount,
      // actions
      connectWallet,
      switchToAmoy,
      donate,
      withdraw,
      clearLastTx,
      estimateGas,
    }}>
      {children}
    </Web3Context.Provider>
  );
};
