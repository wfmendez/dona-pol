import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const BalanceCard = () => {
  const { contractBalance } = useWeb3();

  return (
    <div className="card">
      <h2>Contract Balance</h2>
      <p className="balance">{contractBalance} POL (local)</p>
    </div>
  );
};

export default BalanceCard;
