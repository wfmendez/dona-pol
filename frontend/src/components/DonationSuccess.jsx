import React from 'react';

const DonationSuccess = ({ txHash, amount, onBack }) => {
  const shortHash = txHash
    ? `${txHash.slice(0, 10)}...${txHash.slice(-6)}`
    : '0x...';

  const explorerUrl = txHash
    ? `https://amoy.polygonscan.com/tx/${txHash}`
    : '#';

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden px-4 bg-surface-container-lowest">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-[50%] bg-primary-container/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-[50%] bg-success/5 blur-[100px]" />
      </div>

      <section className="relative z-10 w-full max-w-xl">
        <div className="bg-surface-container/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] border border-outline-variant/15 flex flex-col items-center text-center shadow-2xl">

          {/* Checkmark */}
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-success/20 rounded-[50%] blur-2xl animate-pulse" />
            <div className="relative w-28 h-28 bg-success/10 rounded-[50%] flex items-center justify-center border border-success/30 success-glow">
              <span
                className="material-symbols-outlined text-success"
                style={{ fontSize: '64px', fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-3 mb-10">
            <p className="font-label text-success tracking-[0.2em] text-xs font-bold uppercase">
              Transaction Confirmed
            </p>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface">
              {amount ? `${amount} POL donated` : 'Donation sent'} ✓
            </h1>
            <p className="font-body text-on-surface-variant max-w-sm mx-auto text-base leading-relaxed">
              Your contribution has been recorded on the Polygon network. Thank you for making a difference.
            </p>
          </div>

          {/* TX details */}
          <div className="w-full bg-surface-container-low rounded-2xl p-5 mb-8 flex flex-col gap-3 text-left border border-outline-variant/10">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-label text-sm">Status</span>
              <div className="flex items-center gap-2 bg-success/10 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-[50%] bg-success" />
                <span className="text-success font-medium text-xs">Success</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-label text-sm">Network</span>
              <span className="text-on-surface font-medium text-sm">Polygon Amoy</span>
            </div>
            {amount && (
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-label text-sm">Amount</span>
                <span className="text-primary font-bold text-sm">{amount} POL</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-label text-sm">Tx Hash</span>
              <span className="text-primary font-mono text-xs truncate max-w-[180px]">
                {shortHash}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-container rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
              <button className="relative w-full py-4 bg-primary-container text-on-primary-container font-headline font-bold rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">open_in_new</span>
                View on Polygonscan
              </button>
            </a>
            <button
              onClick={onBack}
              className="flex-1 py-4 bg-surface-container-highest/50 border border-outline-variant/20 hover:border-primary/50 text-on-surface font-headline font-bold rounded-xl transition-all duration-200 active:scale-95"
            >
              Back to Campaign
            </button>
          </div>

          {/* Share */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest">
              Share Impact
            </span>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-[50%] bg-surface-container-high flex items-center justify-center hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-lg">share</span>
              </button>
              <button className="w-10 h-10 rounded-[50%] bg-surface-container-high flex items-center justify-center hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-lg">favorite</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Confetti dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-3 h-3 bg-primary rounded-[50%] blur-[1px]" />
        <div className="absolute top-[15%] right-[20%] w-4 h-2 bg-success rotate-45 rounded-sm" />
        <div className="absolute bottom-[30%] left-[25%] w-2 h-4 bg-primary-container -rotate-12 rounded-sm" />
        <div className="absolute top-[40%] right-[10%] w-3 h-3 border border-success rounded-[50%]" />
        <div className="absolute bottom-[20%] left-[15%] w-3 h-3 bg-tertiary-container rotate-45 rounded-sm" />
        <div className="absolute top-[10%] left-[40%] w-2 h-5 bg-success/40 rounded-full" />
        <div className="absolute bottom-[40%] right-[15%] w-3 h-3 bg-primary-fixed-dim rounded-[50%] blur-[2px]" />
      </div>
    </main>
  );
};

export default DonationSuccess;
