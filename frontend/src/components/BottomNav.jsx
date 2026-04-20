import React from 'react';

const NAV_ITEMS = [
  { id: 'home', icon: 'grid_view', label: 'Home' },
  { id: 'explore', icon: 'explore', label: 'Explore' },
  { id: 'impact', icon: 'favorite', label: 'My Impact' },
  { id: 'admin', icon: 'admin_panel_settings', label: 'Admin' },
];

const BottomNav = ({ activeTab, setActiveTab, isOwner }) => {
  const visibleItems = NAV_ITEMS.filter((item) => item.id !== 'admin' || isOwner);

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-slate-950/90 backdrop-blur-2xl border-t border-white/5 shadow-2xl">
      {visibleItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-1 transition-all ${
              isActive
                ? 'bg-primary-container/20 text-primary'
                : 'text-slate-500 hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-label text-[10px] uppercase tracking-widest mt-1">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
