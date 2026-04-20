import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

const AdminPanel = () => {
  const { isOwner, withdraw, isLoading, walletAddress, contractBalance } = useWeb3();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [txStatus, setTxStatus] = useState('');

  if (!isOwner) return null;

  const handleWithdraw = async () => {
    try {
      await withdraw();
      setTxStatus('Funds withdrawn successfully!');
      setConfirmOpen(false);
    } catch {
      setTxStatus('Withdrawal failed. Please try again.');
    }
  };

  const formatAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <div className="max-w-5xl mx-auto pt-24 pb-32 px-4 space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-2">
          <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Contract Balance</span>
          <div className="text-3xl font-headline font-bold text-primary">
            {parseFloat(contractBalance).toFixed(4)} POL
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-2">
          <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Network</span>
          <div className="text-3xl font-headline font-bold text-on-surface">Polygon</div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-2">
          <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Owner</span>
          <div className="text-xl font-headline font-bold text-on-surface font-mono">
            {formatAddress(walletAddress)}
          </div>
        </div>
      </section>

      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-tertiary-container/30 to-tertiary/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
        <div className="relative bg-surface-container rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-8 pt-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-tertiary/10 text-tertiary-fixed-dim px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-tertiary/20">
                Owner Panel
              </div>
              <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight">
                Contract Management
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/10">
              <div className="w-2 h-2 rounded-[50%] bg-success animate-pulse" />
              <span className="text-xs font-medium text-on-surface-variant">Owner Wallet Connected</span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-surface-container-low p-8 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-tertiary">account_balance_wallet</span>
                  <span className="text-sm font-label font-medium text-on-surface-variant">Available Liquidity</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-headline font-black text-on-surface tracking-tighter">
                    {parseFloat(contractBalance).toFixed(2)}
                  </span>
                  <span className="text-2xl font-headline font-bold text-tertiary">POL</span>
                </div>
                <p className="mt-4 text-sm text-on-surface-variant/70 max-w-sm">
                  Total funds held in the contract, ready for withdrawal to the owner address.
                </p>
              </div>
              <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
                <button
                  onClick={() => setConfirmOpen(true)}
                  disabled={isLoading || parseFloat(contractBalance) === 0}
                  className="w-full sm:w-auto bg-error-container/20 border border-error/30 text-error px-8 py-4 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-3 hover:bg-error-container hover:text-on-error-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">dangerous</span>
                  {isLoading ? 'Withdrawing...' : 'Withdraw All Funds'}
                </button>
              </div>
              {txStatus && (
                <p className={`mt-4 text-sm font-medium ${txStatus.includes('success') ? 'text-success' : 'text-error'}`}>
                  {txStatus}
                </p>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              {[
                { icon: 'settings_suggest', title: 'Platform Fee', sub: 'Current: 2.5%' },
                { icon: 'shield_person', title: 'Emergency Stop', sub: 'Contract Status: Active' },
                { icon: 'history_edu', title: 'Audit Logs', sub: 'Last entry: 2h ago' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-surface-container-high/50 p-6 rounded-2xl flex items-center justify-between hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary">{item.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-on-surface">{item.title}</div>
                      <div className="text-xs text-on-surface-variant">{item.sub}</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/40">chevron_right</span>
                </div>
              ))}
            </div>
          </div>

          {confirmOpen && (
            <div className="bg-surface-container-lowest/50 border-t border-white/5 px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-on-surface-variant/60 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                Are you sure you want to trigger a global withdrawal? This action is irreversible.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface text-xs font-bold transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={isLoading}
                  className="bg-tertiary/10 text-tertiary px-4 py-2 rounded-lg text-xs font-bold hover:bg-tertiary/20 transition-all border border-tertiary/20 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
