import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const Header = () => {
  const { walletAddress, connectWallet, isLoading } = useWeb3();

  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 z-50 bg-slate-900/80 backdrop-blur-xl shadow-[0_0_20px_rgba(130,71,229,0.2)]">
      <div className="flex items-center gap-3">
        <span
          className="material-symbols-outlined text-primary text-3xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          volunteer_activism
        </span>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container font-headline">
            Dona-Pol
          </h1>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium -mt-1">
            Future of Philanthropy
          </span>
        </div>
      </div>

      {walletAddress ? (
        <button className="flex items-center gap-2 bg-surface-bright px-4 py-2 rounded-xl border border-outline-variant/15 transition-transform active:scale-95">
          <div className="w-2 h-2 rounded-[50%] bg-success animate-pulse" />
          <span className="font-mono text-sm font-medium text-on-surface">
            {formatAddress(walletAddress)}
          </span>
        </button>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed px-6 py-2.5 rounded-full font-headline font-bold text-sm active:scale-90 transition-transform shadow-lg disabled:opacity-60"
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </header>
  );
};

export default Header;
