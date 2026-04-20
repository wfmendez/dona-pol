import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const BalanceCard = () => {
  const { contractBalance } = useWeb3();
  return (
    <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-2">
      <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
        Contract Balance
      </span>
      <div className="text-3xl font-headline font-bold text-primary">
        {parseFloat(contractBalance).toFixed(4)} POL
      </div>
    </div>
  );
};

export default BalanceCard;
