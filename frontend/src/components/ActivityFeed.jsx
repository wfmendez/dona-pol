import React from 'react';
import { useWeb3 } from '../context/Web3Context';

/* ── helpers ── */

const GRADIENTS = [
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-500',
  'from-blue-500 to-cyan-600',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-500',
  'from-indigo-500 to-blue-600',
  'from-teal-500 to-green-500',
];

/** Deterministic gradient from address string */
const addrGradient = (addr) => {
  const hash = addr
    .toLowerCase()
    .split('')
    .reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
  return GRADIENTS[hash % GRADIENTS.length];
};

const shortAddr = (addr) =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '0x…';

const relativeTime = (date) => {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 5)    return 'just now';
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
};

const AMOY_EXPLORER = 'https://amoy.polygonscan.com/tx/';
const LOCAL_CHAIN   = 31337;

/* ── component ── */

const ActivityFeed = () => {
  const { donations, chainId, isLoading } = useWeb3();
  const isLocal  = chainId === LOCAL_CHAIN;
  const hasItems = donations.length > 0;

  return (
    <div className="bg-surface-container-low rounded-3xl p-6 border border-white/5">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Live Activity
          </h4>
          {hasItems && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
          )}
        </div>
        <span
          className="material-symbols-outlined text-primary text-lg"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {hasItems ? 'rss_feed' : 'history'}
        </span>
      </div>

      {/* Body */}
      {!hasItems ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
          {isLoading ? (
            <>
              <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl animate-pulse">
                cloud_sync
              </span>
              <p className="text-on-surface-variant/40 text-xs uppercase tracking-widest">
                Syncing with blockchain…
              </p>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-on-surface-variant/20 text-5xl">
                volunteer_activism
              </span>
              <p className="text-on-surface-variant/40 text-sm">
                No donations yet — be the first!
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((tx, i) => (
            <DonationRow
              key={tx.txHash || i}
              tx={tx}
              isLocal={isLocal}
              isFirst={i === 0}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      {hasItems && (
        <p className="mt-4 text-center text-[10px] text-slate-600 uppercase tracking-widest">
          {donations.length} event{donations.length !== 1 ? 's' : ''} loaded · real-time
        </p>
      )}
    </div>
  );
};

/* ── row sub-component ── */

const DonationRow = ({ tx, isLocal, isFirst }) => {
  const explorerUrl = !isLocal && tx.txHash
    ? `${AMOY_EXPLORER}${tx.txHash}`
    : null;

  return (
    <div
      className={`flex items-center justify-between py-2.5 px-1 rounded-xl group transition-colors hover:bg-surface-container ${
        isFirst ? 'animate-[fadeSlideIn_0.35s_ease_both]' : ''
      }`}
    >
      {/* Left: avatar + info */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br flex-shrink-0 shadow-md ${addrGradient(tx.donor)}`}
        />
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-mono text-on-surface">
            {shortAddr(tx.donor)}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 flex-shrink-0">
              {relativeTime(tx.timestamp)}
            </span>
            {tx.message && (
              <span
                className="text-[10px] text-primary/70 italic truncate max-w-[110px]"
                title={tx.message}
              >
                "{tx.message}"
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: amount + explorer link */}
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
        <span className="text-sm font-bold text-primary">
          +{parseFloat(tx.amount).toFixed(3)}
          <span className="text-[10px] font-normal text-slate-500 ml-0.5">POL</span>
        </span>
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="View on Polygonscan"
          >
            <span className="material-symbols-outlined text-on-surface-variant/40 hover:text-primary text-sm transition-colors">
              open_in_new
            </span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
