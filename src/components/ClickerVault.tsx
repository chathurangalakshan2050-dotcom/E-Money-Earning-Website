import React, { useState, useRef } from 'react';
import { Zap, Flame, Award, ArrowUpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatMoney, calculateClickValue, calculateUpgradeCost, VIPTierInfo } from '../game/rules.ts';
import { sound } from '../utils/audio.ts';

interface ClickerVaultProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  lifetimeEarnings: number;
  setLifetimeEarnings: React.Dispatch<React.SetStateAction<number>>;
  clickUpgrades: number;
  setClickUpgrades: React.Dispatch<React.SetStateAction<number>>;
  passiveIncomePerSec: number;
  vipTier: VIPTierInfo;
  bonusMultiplier: number;
  frenzyActive: boolean;
  setFrenzyActive: (active: boolean) => void;
  onOpenCashout: () => void;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  amountText: string;
  isCrit: boolean;
}

export const ClickerVault: React.FC<ClickerVaultProps> = ({
  balance,
  setBalance,
  lifetimeEarnings,
  setLifetimeEarnings,
  clickUpgrades,
  setClickUpgrades,
  passiveIncomePerSec,
  vipTier,
  bonusMultiplier,
  frenzyActive,
  setFrenzyActive,
  onOpenCashout,
}) => {
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [frenzyClicks, setFrenzyClicks] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const coinRef = useRef<HTMLDivElement>(null);

  const clickCost = calculateUpgradeCost(15, clickUpgrades, 1.45);
  const currentClickValue = calculateClickValue(
    1,
    clickUpgrades,
    vipTier.multiplier,
    bonusMultiplier * (frenzyActive ? 5 : 1)
  );

  const handleCoinClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Determine critical click (15% chance for 3x crit)
    const isCrit = Math.random() < 0.15;
    const earned = isCrit ? currentClickValue * 3 : currentClickValue;

    setBalance((prev) => prev + earned);
    setLifetimeEarnings((prev) => prev + earned);

    if (isCrit) {
      sound.playCashRegister();
    } else {
      sound.playCoin();
    }

    // Floating text coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (Math.random() * 40 - 20);
    const y = e.clientY - rect.top - 20;

    const newFloat: FloatingText = {
      id: Date.now() + Math.random(),
      x,
      y,
      amountText: isCrit ? `🔥 CRIT +${formatMoney(earned)}` : `+${formatMoney(earned)}`,
      isCrit,
    };

    setFloatingTexts((prev) => [...prev.slice(-15), newFloat]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== newFloat.id));
    }, 900);

    // Frenzy meter progress
    if (!frenzyActive) {
      const nextCount = frenzyClicks + 1;
      if (nextCount >= 20) {
        setFrenzyActive(true);
        setFrenzyClicks(0);
        sound.playJackpot();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          setFrenzyActive(false);
        }, 10000);
      } else {
        setFrenzyClicks(nextCount);
      }
    }
  };

  const handleBuyClickUpgrade = () => {
    if (balance >= clickCost) {
      setBalance((prev) => prev - clickCost);
      setClickUpgrades((prev) => prev + 1);
      sound.playCashRegister();
    }
  };

  return (
    <div className="py-6 px-4 md:px-8 max-w-6xl mx-auto space-y-8">
      {/* Hero Stats Header */}
      <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 md:p-8 backdrop-blur shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Balance */}
          <div className="md:col-span-2 space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400/90">
              Total Virtual Balance
            </span>
            <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight text-white flex items-baseline gap-2">
              <span className="text-amber-400">$</span>
              <span className="font-mono tabular-nums">{balance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold font-mono flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                +{formatMoney(passiveIncomePerSec)} / sec passive
              </span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-amber-300 font-semibold font-mono">
                +{formatMoney(currentClickValue)} per tap
              </span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-slate-300">
                Lifetime: <strong className="text-white font-mono">{formatMoney(lifetimeEarnings)}</strong>
              </span>
            </div>
          </div>

          {/* VIP Status & Cashout CTA */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>VIP Rank</span>
                <span className={`font-bold ${vipTier.badgeColor}`}>{vipTier.tier}</span>
              </div>
              <p className="text-sm font-semibold text-white mt-1">{vipTier.title}</p>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">{vipTier.multiplier}x Global Multiplier</p>
            </div>

            <button
              onClick={() => {
                sound.playCashRegister();
                onOpenCashout();
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] text-center"
            >
              Simulate Instant Cashout
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: The Big Golden Coin & Multipliers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Tap Upgrade card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-white text-base">Tap Multiplier Upgrade</h3>
            </div>
            <p className="text-xs text-slate-400">
              Upgrade your click power to print exponentially higher sums with each single finger tap.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Tap Power</span>
                <span className="font-mono text-emerald-400 font-semibold">{formatMoney(currentClickValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Upgrade Level</span>
                <span className="font-mono text-amber-400 font-semibold">Lvl {clickUpgrades}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5">
                <span className="text-slate-400">Next Upgrade Cost</span>
                <span className="font-mono text-white font-bold">{formatMoney(clickCost)}</span>
              </div>
            </div>

            <button
              onClick={handleBuyClickUpgrade}
              disabled={balance < clickCost}
              className={`w-full py-2.5 px-4 font-bold text-xs rounded-lg transition-all ${
                balance >= clickCost
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {balance >= clickCost ? `Upgrade Tap Power (${formatMoney(clickCost)})` : 'Need More Virtual Cash'}
            </button>
          </div>

          {/* Frenzy Rush Gauge */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className={`w-5 h-5 ${frenzyActive ? 'text-red-500 animate-bounce' : 'text-amber-400'}`} />
                <h3 className="font-semibold text-white text-sm">Turbo Frenzy Mode</h3>
              </div>
              <span className="text-xs font-mono text-amber-300">
                {frenzyActive ? '10x ACTIVATED!' : `${frenzyClicks} / 20 clicks`}
              </span>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  frenzyActive
                    ? 'bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300 animate-pulse w-full'
                    : 'bg-gradient-to-r from-amber-500 to-amber-300'
                }`}
                style={{ width: frenzyActive ? '100%' : `${(frenzyClicks / 20) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Tap the giant coin rapidly to activate 10 seconds of 5x Golden Turbo Frenzy!
            </p>
          </div>
        </div>

        {/* Center: The Giant Golden Coin with Floating Numbers */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center py-4 relative">
          {frenzyActive && (
            <div className="mb-4 py-1.5 px-4 bg-gradient-to-r from-red-500 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-red-500/30 animate-pulse flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>5x TURBO FRENZY IS BURNING! CLICK AS FAST AS YOU CAN!</span>
            </div>
          )}

          <div ref={coinRef} className="relative select-none touch-manipulation">
            {/* Ambient gold glow */}
            <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl animate-pulse pointer-events-none" />

            {/* Clickable Coin Button */}
            <button
              onClick={handleCoinClick}
              onMouseDown={() => setIsPressing(true)}
              onMouseUp={() => setIsPressing(false)}
              onMouseLeave={() => setIsPressing(false)}
              aria-label="Click to generate virtual cash"
              className={`relative z-10 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden transition-transform duration-75 cursor-pointer shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${
                isPressing ? 'scale-95' : 'hover:scale-[1.03]'
              }`}
            >
              <img
                src="/src/assets/images/golden_cash_coin_1793896697984.jpg"
                alt="Golden Virtual Cash Coin"
                className="w-full h-full object-cover rounded-full pointer-events-none animate-gold-glow"
                referrerPolicy="no-referrer"
              />
            </button>

            {/* Floating click particles */}
            <div className="absolute inset-0 pointer-events-none z-30">
              {floatingTexts.map((item) => (
                <div
                  key={item.id}
                  style={{ left: `${item.x}px`, top: `${item.y}px` }}
                  className={`absolute font-black font-display text-lg md:text-2xl animate-float-up pointer-events-none whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${
                    item.isCrit ? 'text-red-400 scale-125' : 'text-amber-300'
                  }`}
                >
                  {item.amountText}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Click or tap the golden medallion to print simulated cash
          </p>
        </div>
      </div>
    </div>
  );
};
