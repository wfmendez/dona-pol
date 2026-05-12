import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

const AMOY_EXPLORER = 'https://amoy.polygonscan.com/tx/';
const LOCAL_CHAIN   = 31337;

const shortAddr = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

const relativeTime = (date) => {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
};

const AdminPanel = () => {
  const {
    isOwner, withdraw, isLoading,
    walletAddress, contractBalance,
    donorCount, donations, chainId,
  } = useWeb3();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [txStatus,    setTxStatus]    = useState('');

  if (!isOwner) return null;

  const isLocal    = chainId === LOCAL_CHAIN;
  const totalRaised = parseFloat(contractBalance) || 0;

  // Sum all donation amounts from loaded events
  const totalFromEvents = donations.reduce((s, d) => s + parseFloat(d.amount), 0);

  const handleWithdraw = async () => {
    try {
      await withdraw();
      setTxStatus('success');
      setConfirmOpen(false);
    } catch {
      setTxStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-24 pb-32 px-4 space-y-8">

      {/* ── Stat cards ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Contract Balance', value: `${totalRaised.toFixed(4)} POL`, accent: 'text-primary' },
          { label: 'Unique Donors',    value: donorCount || '—',                accent: 'text-success' },
          { label: 'Events Loaded',   value: donations.length,                 accent: 'text-on-surface' },
          { label: 'Network',         value: isLocal ? 'Hardhat' : 'Amoy',    accent: isLocal ? 'text-amber-400' : 'text-success' },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-low p-5 rounded-2xl flex flex-col gap-1">
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
              {s.label}
            </span>
            <div className={`text-2xl font-headline font-bold ${s.accent}`}>
              {s.value}
            </div>
          </div>
        ))}
      </section>

      {/* ── Main management card ── */}
      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-tertiary-container/30 to-tertiary/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
        <div className="relative bg-surface-container rounded-3xl overflow-hidden shadow-2xl">

          {/* Card header */}
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
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-on-surface-variant font-mono">
                {shortAddr(walletAddress)}
              </span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Liquidity + withdraw */}
            <div className="lg:col-span-7 bg-surface-container-low p-8 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-tertiary">account_balance_wallet</span>
                  <span className="text-sm font-label font-medium text-on-surface-variant">Available to Withdraw</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-headline font-black text-on-surface tracking-tighter">
                    {totalRaised.toFixed(2)}
                  </span>
                  <span className="text-2xl font-headline font-bold text-tertiary">POL</span>
                </div>
                <p className="mt-3 text-sm text-on-surface-variant/70 max-w-sm">
                  Total funds in contract, ready for withdrawal to the owner address.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-3">
                <button
                  onClick={() => { setConfirmOpen(true); setTxStatus(''); }}
                  disabled={isLoading || totalRaised === 0}
                  className="w-full sm:w-auto bg-error-container/20 border border-error/30 text-error px-8 py-4 rounded-xl
                    font-headline font-bold text-sm flex items-center justify-center gap-3
                    hover:bg-error-container hover:text-on-error-container transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">dangerous</span>
                  {isLoading ? 'Withdrawing…' : 'Withdraw All Funds'}
                </button>

                {txStatus === 'success' && (
                  <p className="text-success text-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Withdrawn successfully!
                  </p>
                )}
                {txStatus === 'error' && (
                  <p className="text-error text-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">error</span>
                    Withdrawal failed — please retry.
                  </p>
                )}
              </div>
            </div>

            {/* Quick stats sidebar */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {[
                {
                  icon:  'group',
                  title: 'Unique Donors',
                  sub:   donorCount ? `${donorCount} wallet${donorCount !== 1 ? 's' : ''} contributed` : 'No donations yet',
                },
                {
                  icon:  'bolt',
                  title: 'Network',
                  sub:   isLocal
                    ? 'Local Hardhat node (chain 31337)'
                    : 'Polygon Amoy testnet (chain 80002)',
                },
                {
                  icon:  'history_edu',
                  title: 'Events in Memory',
                  sub:   donations.length
                    ? `${donations.length} donation event${donations.length !== 1 ? 's' : ''} loaded`
                    : 'No events loaded yet',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-surface-container-high/50 p-5 rounded-2xl flex items-center justify-between hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-tertiary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-tertiary">{item.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-on-surface">{item.title}</div>
                      <div className="text-xs text-on-surface-variant">{item.sub}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Withdraw confirm bar */}
          {confirmOpen && (
            <div className="bg-surface-container-lowest/50 border-t border-white/5 px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-on-surface-variant/60 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                This sends the entire contract balance to your wallet. Irreversible.
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
                  className="bg-tertiary/10 text-tertiary px-5 py-2 rounded-lg text-xs font-bold
                    hover:bg-tertiary/20 transition-all border border-tertiary/20 disabled:opacity-50"
                >
                  {isLoading ? 'Processing…' : 'Confirm Withdrawal'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Recent donations table ── */}
      {donations.length > 0 && (
        <section className="bg-surface-container rounded-3xl overflow-hidden border border-white/5">
          <div className="px-8 pt-6 pb-4 flex items-center justify-between">
            <h3 className="text-lg font-headline font-bold text-on-surface">Donation History</h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">
              Last {donations.length} events
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/10">
                  <th className="text-left px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Donor</th>
                  <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Amount</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden md:table-cell">Message</th>
                  <th className="text-right px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Time</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => (
                  <tr
                    key={d.txHash || i}
                    className="border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="px-8 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-on-surface text-xs">{shortAddr(d.donor)}</span>
                        {d.txHash && !isLocal && (
                          <a
                            href={`${AMOY_EXPLORER}${d.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-xs text-primary/60 hover:text-primary">
                              open_in_new
                            </span>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-primary text-xs">
                      +{parseFloat(d.amount).toFixed(4)} POL
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {d.message ? (
                        <span className="text-[11px] text-on-surface-variant/70 italic truncate max-w-[160px] block" title={d.message}>
                          "{d.message}"
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-8 py-3 text-right text-[11px] text-slate-500">
                      {relativeTime(d.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>
  );
};

export default AdminPanel;
