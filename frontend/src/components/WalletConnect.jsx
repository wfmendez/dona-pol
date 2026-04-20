import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const WalletConnect = () => {
  const { walletAddress, connectWallet, isLoading } = useWeb3();
  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (walletAddress) {
    return (
      <div className="flex items-center gap-2 bg-surface-bright px-4 py-2 rounded-xl border border-outline-variant/15">
        <div className="w-2 h-2 rounded-[50%] bg-success animate-pulse" />
        <span className="font-mono text-sm font-medium text-on-surface">
          {formatAddress(walletAddress)}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isLoading}
      className="bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed px-6 py-2.5 rounded-full font-headline font-bold text-sm active:scale-90 transition-transform shadow-lg disabled:opacity-60"
    >
      {isLoading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default WalletConnect;
