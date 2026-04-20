import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

const PRESETS = ['0.1', '0.5', '1'];

const DonationForm = () => {
  const { donate, isLoading, walletAddress, connectWallet } = useWeb3();
  const [amount, setAmount] = useState('');
  const [selected, setSelected] = useState('0.5');
  const [error, setError] = useState('');

  const handlePreset = (val) => {
    setSelected(val);
    setAmount(val);
    setError('');
  };

  const handleCustom = (e) => {
    setSelected('custom');
    setAmount(e.target.value);
    setError('');
  };

  const handleDonate = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    try {
      await donate(amount);
      setAmount('');
      setSelected('0.5');
    } catch {
      setError('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="bg-surface-container rounded-3xl p-8 border border-white/5 relative overflow-hidden">
      <h4 className="text-xl font-headline font-bold text-on-surface mb-6">Make a Donation</h4>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => handlePreset(p)}
              className={`py-4 rounded-2xl font-bold transition-all ${
                selected === p
                  ? 'bg-primary-container text-on-primary-container shadow-lg'
                  : 'bg-surface-container-low border border-outline-variant/20 hover:border-primary/50 text-on-surface'
              }`}
            >
              {p} POL
            </button>
          ))}
          <button
            onClick={() => { setSelected('custom'); setAmount(''); }}
            className={`py-4 rounded-2xl font-medium transition-all ${
              selected === 'custom'
                ? 'bg-primary-container text-on-primary-container shadow-lg'
                : 'bg-surface-container-low border border-outline-variant/20 hover:border-primary/50 text-slate-400'
            }`}
          >
            Custom
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="text-slate-500 font-bold">POL</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={handleCustom}
            placeholder="0.00"
            disabled={!walletAddress}
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-4 pl-14 pr-4 text-on-surface placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50"
          />
        </div>

        {error && (
          <p className="text-error text-sm">{error}</p>
        )}

        <button
          onClick={handleDonate}
          disabled={!walletAddress || isLoading}
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-headline font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-xl shadow-primary-container/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-xl">refresh</span>
              Processing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              Donate Now
            </>
          )}
        </button>
      </div>

      {!walletAddress && (
        <div className="absolute inset-0 bg-surface-container/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center rounded-3xl">
          <div className="w-16 h-16 bg-primary/10 rounded-[50%] flex items-center justify-center mb-4">
            <span
              className="material-symbols-outlined text-primary text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
          </div>
          <h5 className="text-xl font-headline font-bold text-on-surface mb-2">Wallet Disconnected</h5>
          <p className="text-sm text-on-surface-variant mb-6">
            Connect your Polygon wallet to participate in this campaign.
          </p>
          <button
            onClick={connectWallet}
            className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-bold shadow-lg shadow-primary-container/40 hover:scale-105 transition-transform active:scale-95"
          >
            Connect Now
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationForm;
