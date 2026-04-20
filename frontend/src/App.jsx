import { useState } from 'react';
import { useWeb3 } from './context/Web3Context';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import WrongNetworkBanner from './components/WrongNetworkBanner';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';
import DonationSuccess from './components/DonationSuccess';

function App() {
  const { isOwner, lastTxHash, clearLastTx, isWrongNetwork } = useWeb3();
  const [activeTab, setActiveTab] = useState('home');

  if (lastTxHash) {
    return (
      <div className="bg-surface-container-lowest min-h-screen text-on-surface font-body">
        <DonationSuccess txHash={lastTxHash} onBack={clearLastTx} />
        <footer className="fixed bottom-8 w-full flex justify-center pointer-events-none opacity-40">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              volunteer_activism
            </span>
            <span className="font-headline font-black tracking-tighter text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-container">
              Dona-Pol
            </span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest min-h-screen text-on-surface font-body selection:bg-primary-container/30 selection:text-on-primary-container">
      <WrongNetworkBanner />
      <Header />

      <div className={isWrongNetwork ? 'opacity-40 grayscale pointer-events-none' : ''}>
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'admin' && isOwner && <AdminPanel />}
        {activeTab === 'admin' && !isOwner && <HomePage />}
        {(activeTab === 'explore' || activeTab === 'impact') && <HomePage />}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isOwner={isOwner} />

      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-[50%] bg-primary-container/10 blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-[50%] bg-secondary-container/10 blur-[120px] -z-10 pointer-events-none" />
    </div>
  );
}

export default App;
