import React from 'react';

const MOCK_ACTIVITY = [
  { address: '0x12...ab6d', time: '2 mins ago', amount: '0.5', gradient: 'from-indigo-500 to-purple-500' },
  { address: '0x88...f21a', time: '14 mins ago', amount: '1.2', gradient: 'from-emerald-500 to-teal-500' },
  { address: '0x3c...99de', time: '45 mins ago', amount: '0.1', gradient: 'from-orange-500 to-red-500' },
  { address: '0x71...440c', time: '1 hour ago', amount: '5.0', gradient: 'from-blue-500 to-cyan-500' },
  { address: '0xa4...11ff', time: '3 hours ago', amount: '0.25', gradient: 'from-pink-500 to-rose-500' },
];

const ActivityFeed = () => (
  <div className="bg-surface-container-low rounded-3xl p-6 border border-white/5">
    <div className="flex items-center justify-between mb-6">
      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Recent Activity</h4>
      <span className="material-symbols-outlined text-primary text-sm">history</span>
    </div>
    <div className="space-y-4">
      {MOCK_ACTIVITY.map((tx, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-[50%] bg-gradient-to-br ${tx.gradient}`}
            />
            <div className="flex flex-col">
              <span className="text-xs font-mono text-on-surface">{tx.address}</span>
              <span className="text-[10px] text-slate-500">{tx.time}</span>
            </div>
          </div>
          <span className="text-sm font-bold text-primary">+{tx.amount} POL</span>
        </div>
      ))}
    </div>
  </div>
);

export default ActivityFeed;
