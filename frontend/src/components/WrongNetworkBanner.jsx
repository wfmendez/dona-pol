import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const WrongNetworkBanner = () => {
  const { isWrongNetwork, contractError, switchToAmoy } = useWeb3();

  if (contractError === 'no_metamask') {
    return (
      <div className="fixed top-[72px] left-0 w-full z-40 bg-surface-container-high text-on-surface px-6 py-3 flex items-center justify-center gap-3 shadow-xl border-b border-outline-variant/20">
        <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          account_balance_wallet
        </span>
        <span className="font-headline font-bold">
          MetaMask not detected —{' '}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:opacity-80"
          >
            install it here
          </a>
        </span>
      </div>
    );
  }

  if (contractError === 'not_deployed') {
    return (
      <div className="fixed top-[72px] left-0 w-full z-40 bg-tertiary-container/80 text-on-tertiary-container px-6 py-3 flex flex-col md:flex-row items-center justify-center gap-3 shadow-xl border-b border-tertiary/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <span className="font-headline font-bold tracking-tight">
            Contract not deployed on this network
          </span>
        </div>
        <span className="text-sm opacity-80">
          Switch to Polygon Amoy (testnet) or run the local Hardhat node.
        </span>
        <button
          onClick={switchToAmoy}
          className="bg-primary-container text-on-primary-container px-5 py-1.5 rounded-lg font-bold text-sm active:scale-95 transition-transform shadow"
        >
          Switch to Amoy
        </button>
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className="fixed top-[72px] left-0 w-full z-40 bg-error-container text-on-error-container px-6 py-3 flex flex-col md:flex-row items-center justify-center gap-4 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <span className="font-headline font-bold tracking-tight">
            Wrong network — please switch to Polygon Amoy
          </span>
        </div>
        <button
          onClick={switchToAmoy}
          className="bg-gradient-to-r from-primary to-primary-container text-on-primary-container px-6 py-1.5 rounded-lg font-bold text-sm active:scale-95 transition-transform shadow-lg"
        >
          Switch Network
        </button>
      </div>
    );
  }

  return null;
};

export default WrongNetworkBanner;
