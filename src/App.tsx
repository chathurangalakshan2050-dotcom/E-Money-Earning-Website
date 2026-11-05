import React, { useState, useEffect, useRef } from 'react';
import { TopBar } from './components/TopBar.tsx';
import { LivePayoutTicker } from './components/LivePayoutTicker.tsx';
import { ClickerVault } from './components/ClickerVault.tsx';
import { HustlesShop } from './components/HustlesShop.tsx';
import { MysteryWheel } from './components/MysteryWheel.tsx';
import { ScamBusterQuiz } from './components/ScamBusterQuiz.tsx';
import { VIPTierView } from './components/VIPTierView.tsx';
import { CashoutModal } from './components/CashoutModal.tsx';
import {
  formatMoney,
  calculatePassiveIncomePerSec,
  getVIPTier,
  HustleItem,
} from './game/rules.ts';

const INITIAL_HUSTLES: HustleItem[] = [
  {
    id: 'ads',
    name: 'Watching 5-Sec AI Shampoo Ads',
    category: 'influencer',
    description: 'Guaranteed to pay 100x more than actual Google AdSense ever could in the real world.',
    punchline: '"Just watch 1,000 clips while you brush your teeth!"',
    baseCost: 20,
    baseRatePerSec: 2,
    count: 0,
    iconName: 'Smartphone',
  },
  {
    id: 'dropship',
    name: 'Selling Sahara Sand to Dubai',
    category: 'dropship',
    description: 'Proprietary dropshipping supplier shipping certified premium vintage grains.',
    punchline: '"Why sell normal products when you can sell sand to a desert?"',
    baseCost: 150,
    baseRatePerSec: 15,
    count: 0,
    iconName: 'Globe',
  },
  {
    id: 'signals',
    name: 'Telegram 1000% Forex VIP Group',
    category: 'crypto',
    description: 'Copy-paste buy signals from an anonymous guru with a rented sports car avatar.',
    punchline: '"Never lose another trade! Moonshot incoming in 3... 2... 1!"',
    baseCost: 1200,
    baseRatePerSec: 110,
    count: 0,
    iconName: 'Cpu',
  },
  {
    id: 'miner',
    name: 'Smart Fridge Doge Coin Miner',
    category: 'crypto',
    description: 'Overclocking your refrigerator condenser to mine satirical meme cryptocurrencies.',
    punchline: '"Keeps your milk chilled while heating up fictional digital ledger blocks."',
    baseCost: 9500,
    baseRatePerSec: 750,
    count: 0,
    iconName: 'Cpu',
  },
  {
    id: 'ai_cat',
    name: 'AI Virtual Cat Video Empire',
    category: 'ai',
    description: 'Generating 10,000 synthetic dancing kitten Shorts every hour using quantum neural nets.',
    punchline: '"The algorithm cannot resist fluffy digital feline choreography."',
    baseCost: 85000,
    baseRatePerSec: 6200,
    count: 0,
    iconName: 'TrendingUp',
  },
  {
    id: 'metaverse',
    name: 'Quantum Metaverse Real Estate Broker',
    category: 'dropship',
    description: 'Selling virtual beachside estates next to digital celebrities on polygon grids.',
    punchline: '"Location, location, virtualization! 100% tax-free in cyberspace."',
    baseCost: 750000,
    baseRatePerSec: 55000,
    count: 0,
    iconName: 'Globe',
  },
  {
    id: 'printer',
    name: 'Intergalactic Money Printer Deluxe',
    category: 'shady',
    description: 'Unlimited synthetic fiat printing machine with built-in confetti cannons.',
    punchline: '"Why wait for a market economy when you can just make the numbers go BRRR?"',
    baseCost: 8000000,
    baseRatePerSec: 650000,
    count: 0,
    iconName: 'Radio',
  },
];

export default function App() {
  const [balance, setBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('cashtycoon_balance');
      return saved ? parseFloat(saved) : 50; // Starter cash bonus
    } catch {
      return 50;
    }
  });

  const [lifetimeEarnings, setLifetimeEarnings] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('cashtycoon_lifetime');
      return saved ? parseFloat(saved) : 50;
    } catch {
      return 50;
    }
  });

  const [clickUpgrades, setClickUpgrades] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('cashtycoon_click_upgrades');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [hustles, setHustles] = useState<HustleItem[]>(() => {
    try {
      const saved = localStorage.getItem('cashtycoon_hustles');
      if (saved) {
        const parsed = JSON.parse(saved);
        return INITIAL_HUSTLES.map((def) => {
          const found = parsed.find((p: HustleItem) => p.id === def.id);
          return found ? { ...def, count: found.count } : def;
        });
      }
    } catch {
      // fallback
    }
    return INITIAL_HUSTLES;
  });

  const [bonusMultiplier, setBonusMultiplier] = useState<number>(1);
  const [quizMultiplier, setQuizMultiplier] = useState<number>(1);
  const [frenzyActive, setFrenzyActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [cashoutOpen, setCashoutOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'clicker' | 'hustles' | 'wheel' | 'quiz' | 'vip'>('clicker');

  const currentVIPTier = getVIPTier(lifetimeEarnings);
  const passiveRatePerSec = calculatePassiveIncomePerSec(
    hustles,
    currentVIPTier.multiplier * quizMultiplier,
    bonusMultiplier * (frenzyActive ? 5 : 1)
  );

  // Passive income game loop (100ms interval for smooth increments)
  useEffect(() => {
    const interval = setInterval(() => {
      if (passiveRatePerSec > 0) {
        const step = passiveRatePerSec / 10;
        setBalance((prev) => prev + step);
        setLifetimeEarnings((prev) => prev + step);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [passiveRatePerSec]);

  // Persist state in localStorage periodically
  useEffect(() => {
    try {
      localStorage.setItem('cashtycoon_balance', balance.toString());
      localStorage.setItem('cashtycoon_lifetime', lifetimeEarnings.toString());
      localStorage.setItem('cashtycoon_click_upgrades', clickUpgrades.toString());
      localStorage.setItem(
        'cashtycoon_hustles',
        JSON.stringify(hustles.map((h) => ({ id: h.id, count: h.count })))
      );
    } catch {
      // ignore
    }
  }, [balance, lifetimeEarnings, clickUpgrades, hustles]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      <div>
        <TopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCashout={() => setCashoutOpen(true)}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          totalBalanceFormatted={formatMoney(balance)}
        />

        <LivePayoutTicker />

        <main className="pb-16">
          {activeTab === 'clicker' && (
            <ClickerVault
              balance={balance}
              setBalance={setBalance}
              lifetimeEarnings={lifetimeEarnings}
              setLifetimeEarnings={setLifetimeEarnings}
              clickUpgrades={clickUpgrades}
              setClickUpgrades={setClickUpgrades}
              passiveIncomePerSec={passiveRatePerSec}
              vipTier={currentVIPTier}
              bonusMultiplier={bonusMultiplier * quizMultiplier}
              frenzyActive={frenzyActive}
              setFrenzyActive={setFrenzyActive}
              onOpenCashout={() => setCashoutOpen(true)}
            />
          )}

          {activeTab === 'hustles' && (
            <HustlesShop
              balance={balance}
              setBalance={setBalance}
              hustles={hustles}
              setHustles={setHustles}
              vipTier={currentVIPTier}
              bonusMultiplier={bonusMultiplier * quizMultiplier}
            />
          )}

          {activeTab === 'wheel' && (
            <MysteryWheel
              balance={balance}
              setBalance={setBalance}
              setBonusMultiplier={setBonusMultiplier}
              bonusMultiplier={bonusMultiplier * quizMultiplier}
            />
          )}

          {activeTab === 'quiz' && (
            <ScamBusterQuiz
              quizMultiplier={quizMultiplier}
              setQuizMultiplier={setQuizMultiplier}
              setBalance={setBalance}
            />
          )}

          {activeTab === 'vip' && (
            <VIPTierView
              lifetimeEarnings={lifetimeEarnings}
              currentTier={currentVIPTier}
            />
          )}
        </main>
      </div>

      {/* Cashout Simulation Modal */}
      <CashoutModal
        isOpen={cashoutOpen}
        onClose={() => setCashoutOpen(false)}
        balance={balance}
      />

      {/* Global Satirical Disclaimer Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 md:px-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-400">
          CashTycoon 3000™ · The Satirical Earning Simulator &amp; Cyber-Scam Awareness Experience
        </p>
        <p className="max-w-2xl mx-auto text-slate-500">
          Disclaimer: This application is a 100% fictional simulation designed for entertainment and cybersecurity education.
          All balances, payouts, and tickers are virtual play integers. No real financial services, deposits, withdrawals, or cryptocurrencies are used.
        </p>
        <div className="flex items-center justify-center gap-4 text-slate-600 pt-1">
          <span>Anti-Fraud Awareness</span>
          <span aria-hidden="true">·</span>
          <span>Never Pay Upfront Fees for Online Jobs</span>
          <span aria-hidden="true">·</span>
          <span>Stay Safe Online</span>
        </div>
      </footer>
    </div>
  );
}
