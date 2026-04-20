import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const WrongNetworkBanner = () => {
  const { isWrongNetwork, switchToAmoy } = useWeb3();

  if (!isWrongNetwork) return null;

  return (
    <div className="fixed top-[72px] left-0 w-full z-40 bg-error-container text-on-error-container px-6 py-3 flex flex-col md:flex-row items-center justify-center gap-4 shadow-xl">
      <div className="flex items-center gap-2">
        <span
          className="material-symbols-outlined text-xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          warning
        </span>
        <span className="font-headline font-bold tracking-tight">
          Please switch to Polygon Amoy
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
};

export default WrongNetworkBanner;
