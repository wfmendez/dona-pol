import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';

const PRESETS = ['0.1', '0.5', '1'];
const MSG_MAX = 140;

const DonationForm = () => {
  const {
    donate, isLoading,
    walletAddress, connectWallet,
    walletBalance, estimateGas,
  } = useWeb3();

  const [amount,      setAmount]      = useState('0.5');
  const [selected,    setSelected]    = useState('0.5');
  const [message,     setMessage]     = useState('');
  const [showMsg,     setShowMsg]     = useState(false);
  const [error,       setError]       = useState('');
  const [gasEst,      setGasEst]      = useState(null);
  const [estimating,  setEstimating]  = useState(false);

  /* ── debounced gas estimation ── */
  useEffect(() => {
    if (!walletAddress || !amount || parseFloat(amount) <= 0) {
      setGasEst(null);
      return;
    }
    setEstimating(true);
    const t = setTimeout(async () => {
      const est = await estimateGas(amount, message);
      setGasEst(est);
      setEstimating(false);
    }, 600);
    return () => clearTimeout(t);
  }, [amount, message, walletAddress, estimateGas]);

  /* ── handlers ── */
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
    if (!val || val <= 0) { setError('Enter a valid amount.'); return; }
    const bal = parseFloat(walletBalance) || 0;
    if (bal > 0 && val > bal) { setError('Insufficient wallet balance.'); return; }

    try {
      setError('');
      await donate(amount, showMsg ? message : '');
      setAmount('0.5');
      setSelected('0.5');
      setMessage('');
    } catch (err) {
      if (err?.code === 4001) setError('Transaction rejected.');
      else setError('Transaction failed — please try again.');
    }
  };

  const walBal = parseFloat(walletBalance) || 0;
  const amtNum = parseFloat(amount)        || 0;
  const tooLow = walBal > 0 && amtNum > walBal;

  return (
    <div className="bg-surface-container rounded-3xl p-8 border border-white/5 relative overflow-hidden">

      {/* Title row */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-headline font-bold text-on-surface">Make a Donation</h4>
        {walletAddress && (
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Wallet</span>
            <span className={`text-sm font-bold ${tooLow ? 'text-error' : 'text-primary'}`}>
              {walBal.toFixed(3)} POL
            </span>
          </div>
        )}
      </div>

      <div className="space-y-5">

        {/* Preset buttons */}
        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => handlePreset(p)}
              className={`py-4 rounded-2xl font-bold transition-all ${
                selected === p
                  ? 'bg-primary-container text-on-primary-container shadow-lg scale-[1.02]'
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
                ? 'bg-primary-container text-on-primary-container shadow-lg scale-[1.02]'
                : 'bg-surface-container-low border border-outline-variant/20 hover:border-primary/50 text-slate-400'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Amount input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-500 font-bold pointer-events-none select-none">
            POL
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={handleCustom}
            placeholder="0.00"
            disabled={!walletAddress}
            className={`w-full bg-surface-container-lowest border rounded-2xl py-4 pl-14 pr-4 text-on-surface placeholder:text-slate-600
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50
              ${tooLow ? 'border-error/60' : 'border-outline-variant/20'}`}
          />
        </div>

        {/* Optional on-chain message */}
        <button
          onClick={() => setShowMsg((v) => !v)}
          disabled={!walletAddress}
          className="flex items-center gap-2 text-xs text-on-surface-variant/50 hover:text-primary transition-colors disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-base leading-none">
            {showMsg ? 'chat_bubble' : 'add_comment'}
          </span>
          {showMsg ? 'Hide message' : 'Add on-chain message (stored on Polygon)'}
        </button>

        {showMsg && (
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MSG_MAX))}
              placeholder="Your message will live on-chain forever…"
              rows={2}
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-3 px-4
                text-on-surface placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50
                focus:border-primary transition-all text-sm resize-none"
            />
            <span className={`absolute bottom-2 right-3 text-[10px] ${message.length >= MSG_MAX ? 'text-error' : 'text-slate-600'}`}>
              {message.length}/{MSG_MAX}
            </span>
          </div>
        )}

        {/* Gas estimate pill */}
        {walletAddress && amtNum > 0 && (
          <div className="flex items-center justify-between bg-surface-container-lowest/60 rounded-xl px-4 py-2.5 border border-outline-variant/10">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm leading-none">local_gas_station</span>
              Est. network fee
            </span>
            {estimating ? (
              <span className="text-[11px] text-slate-500 animate-pulse">Calculating…</span>
            ) : gasEst ? (
              <span className="text-[11px] font-bold text-on-surface-variant">
                ~{gasEst.costPol} POL
                <span className="ml-1 font-normal text-slate-500">@ {gasEst.costGwei} Gwei</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-600">Unavailable</span>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-error text-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </p>
        )}

        {/* Donate button */}
        <button
          onClick={handleDonate}
          disabled={!walletAddress || isLoading || tooLow}
          className="relative w-full group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-container rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300 group-disabled:opacity-0" />
          <div className={`relative w-full py-4 rounded-2xl font-headline font-extrabold flex items-center justify-center gap-2
            transition-all active:scale-[0.98]
            ${(!walletAddress || isLoading || tooLow)
              ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed shadow-xl shadow-primary-container/20'
            }`}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-xl">refresh</span>
                Processing…
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  volunteer_activism
                </span>
                Donate {amtNum > 0 ? `${amount} POL` : 'Now'}
              </>
            )}
          </div>
        </button>

      </div>

      {/* Wallet-not-connected overlay */}
      {!walletAddress && (
        <div className="absolute inset-0 bg-surface-container/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center rounded-3xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <span
              className="material-symbols-outlined text-primary text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
          </div>
          <h5 className="text-xl font-headline font-bold text-on-surface mb-2">Wallet Not Connected</h5>
          <p className="text-sm text-on-surface-variant mb-6">
            Connect your Polygon wallet to make a donation.
          </p>
          <button
            onClick={connectWallet}
            className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-bold
              shadow-lg shadow-primary-container/40 hover:scale-105 transition-transform active:scale-95"
          >
            Connect Now
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationForm;
