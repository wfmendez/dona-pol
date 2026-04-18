import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

const DonationForm = () => {
  const { donate, isLoading, walletAddress } = useWeb3();
  const [donationAmount, setDonationAmount] = useState('');

  const handleDonate = async () => {
    await donate(donationAmount);
    setDonationAmount('');
  };

  return (
    <div className="card donation-card">
      <h3>Make a Donation</h3>
      <div className="input-group"> 
        <label htmlFor="donation-amount">Amount to Donate (POL)</label>
        <input
          id="donation-amount" 
          type="number"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          placeholder="0"
          min="0" 
          step="1"
          aria-label="Amount to donate in POL" 
          />
      </div>
      <button onClick={handleDonate} disabled={!walletAddress || isLoading}>
        {isLoading ? 'Processing...' : 'Donate'}
      </button>
    </div>
  );
};

export default DonationForm;
