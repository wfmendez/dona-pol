import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import DonationForm from './DonationForm';
import ActivityFeed from './ActivityFeed';
import PolygonArt from './PolygonArt';

const HomePage = () => {
  const { contractBalance } = useWeb3();
  const balanceNum = parseFloat(contractBalance) || 0;
  const goal       = 12;
  const progress   = Math.min(Math.round((balanceNum / goal) * 100), 100);

  return (
    <div className="pt-28 pb-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

      {/* ── Hero & Stats ── */}
      <section className="lg:col-span-12 mb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight text-on-surface mb-4 leading-[1.05]">
              Empower{' '}
              <span className="text-primary italic">Global</span>{' '}
              Change.
            </h2>
            <p className="text-on-surface-variant text-lg max-w-lg leading-relaxed">
              Secure, transparent, and direct donations on the Polygon network.
              Your impact is verifiable, instantaneous, and permanent.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="bg-surface-container px-5 py-3 rounded-xl signature-glow border border-white/5 flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Total Raised</span>
              <span className="text-2xl font-headline font-extrabold text-on-surface">
                {balanceNum.toFixed(2)} POL
              </span>
            </div>
            <div className="bg-surface-container px-5 py-3 rounded-xl border border-white/5 flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Donors</span>
              <span className="text-2xl font-headline font-extrabold text-on-surface">47</span>
            </div>
            <div className="bg-surface-container px-5 py-3 rounded-xl border border-white/5 flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Last Active</span>
              <span className="text-2xl font-headline font-extrabold text-on-surface">2 min ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Left: Campaign card + Trust bar ── */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-surface-container-low rounded-3xl overflow-hidden shadow-2xl group">

          {/* Polygon network art — replaces generic AI image */}
          <div className="relative h-64 w-full">
            <PolygonArt />
          </div>

          <div className="p-8">
            <h3 className="text-3xl font-headline font-bold text-on-surface mb-2">
              Community Donation Drive
            </h3>
            <p className="text-on-surface-variant mb-6">
              Support local initiatives and sustainable urban development through
              direct peer-to-peer funding on the Polygon network.
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-primary font-headline font-black text-4xl">
                  {balanceNum.toFixed(2)}{' '}
                  <span className="text-xl font-medium text-slate-500">/ {goal} POL</span>
                </span>
                <span className="text-on-surface font-bold text-lg">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-container to-primary rounded-full relative transition-all duration-700"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute top-0 right-0 w-4 h-full bg-white/20 blur-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 px-4">
          {[
            { icon: 'verified_user', label: 'Contract Verified' },
            { icon: 'bolt',          label: 'Ultra-low fees'    },
            { icon: 'security',      label: 'Non-custodial'     },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-primary text-lg">{item.icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Donation form + Activity feed ── */}
      <div className="lg:col-span-5 space-y-6">
        <DonationForm />
        <ActivityFeed />
      </div>
    </div>
  );
};

export default HomePage;
