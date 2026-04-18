import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const AdminPanel = () => {
  const { isOwner, withdraw, isLoading, walletAddress } = useWeb3();

  if (!isOwner) return null;

  return (
    <div className="card owner-card">
      <h3>Admin Panel</h3>
      <button onClick={withdraw} disabled={!walletAddress || isLoading}>
        {isLoading ? 'Withdrawing...' : 'Withdraw Funds'}
      </button>
    </div>
  );
};

export default AdminPanel;
