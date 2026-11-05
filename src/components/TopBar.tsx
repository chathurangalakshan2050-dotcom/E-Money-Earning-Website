import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface TopBarProps {
  activeTab: 'clicker' | 'hustles' | 'wheel' | 'quiz' | 'vip';
  setActiveTab: (tab: 'clicker' | 'hustles' | 'wheel' | 'quiz' | 'vip') => void;
  onOpenCashout: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  totalBalanceFormatted: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCashout,
  soundEnabled,
  setSoundEnabled,
  totalBalanceFormatted,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    sound.enabled = next;
    setSoundEnabled(next);
    if (next) sound.playTick();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 px-4 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            setActiveTab('clicker');
            sound.playTick();
          }}
          className="text-left font-display text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 hover:opacity-95 transition-opacity whitespace-nowrap shrink-0"
        >
          <span className="text-amber-400">CashTycoon</span>
          <span className="text-emerald-400">3000</span>
        </button>

        {/* Zone 2: 4-5 Clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              setActiveTab('clicker');
              sound.playTick();
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-amber-300 ${
              activeTab === 'clicker' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Clicker Vault
          </button>
          <button
            onClick={() => {
              setActiveTab('hustles');
              sound.playTick();
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-amber-300 ${
              activeTab === 'hustles' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Hustles &amp; Upgrades
          </button>
          <button
            onClick={() => {
              setActiveTab('wheel');
              sound.playTick();
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-amber-300 ${
              activeTab === 'wheel' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Lucky Wheel
          </button>
          <button
            onClick={() => {
              setActiveTab('quiz');
              sound.playTick();
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-amber-300 ${
              activeTab === 'quiz' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Scam Buster
          </button>
          <button
            onClick={() => {
              setActiveTab('vip');
              sound.playTick();
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-amber-300 ${
              activeTab === 'vip' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            VIP Tiers
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              sound.playCashRegister();
              onOpenCashout();
            }}
            className="px-4 py-2 text-xs md:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Cash Out ({totalBalanceFormatted})</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-800 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => {
            setActiveTab('clicker');
            sound.playTick();
          }}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'clicker' ? 'bg-amber-400/20 text-amber-300' : 'text-slate-400'
          }`}
        >
          Clicker
        </button>
        <button
          onClick={() => {
            setActiveTab('hustles');
            sound.playTick();
          }}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'hustles' ? 'bg-amber-400/20 text-amber-300' : 'text-slate-400'
          }`}
        >
          Hustles
        </button>
        <button
          onClick={() => {
            setActiveTab('wheel');
            sound.playTick();
          }}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'wheel' ? 'bg-amber-400/20 text-amber-300' : 'text-slate-400'
          }`}
        >
          Wheel
        </button>
        <button
          onClick={() => {
            setActiveTab('quiz');
            sound.playTick();
          }}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'quiz' ? 'bg-amber-400/20 text-amber-300' : 'text-slate-400'
          }`}
        >
          Scam Buster
        </button>
        <button
          onClick={() => {
            setActiveTab('vip');
            sound.playTick();
          }}
          className={`px-2.5 py-1.5 rounded whitespace-nowrap ${
            activeTab === 'vip' ? 'bg-amber-400/20 text-amber-300' : 'text-slate-400'
          }`}
        >
          VIP
        </button>
      </div>
    </header>
  );
};
