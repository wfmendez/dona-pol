import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const WalletConnect = () => {
  const { walletAddress, connectWallet } = useWeb3();

  if (!walletAddress) {
    return (
      <button onClick={connectWallet} className="connect-btn">
        Connect Wallet
      </button>
    );
  }

  return (
    <p className="address">
      <strong>Your Address:</strong> {walletAddress}
    </p>
  );
};

export default WalletConnect;
