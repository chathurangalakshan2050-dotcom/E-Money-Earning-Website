import React from 'react';
import {
  TrendingUp,
  Cpu,
  Smartphone,
  Globe,
  Radio,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { formatMoney, calculateUpgradeCost, HustleItem, VIPTierInfo } from '../game/rules.ts';
import { sound } from '../utils/audio.ts';

interface HustlesShopProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  hustles: HustleItem[];
  setHustles: React.Dispatch<React.SetStateAction<HustleItem[]>>;
  vipTier: VIPTierInfo;
  bonusMultiplier: number;
}

export const HustlesShop: React.FC<HustlesShopProps> = ({
  balance,
  setBalance,
  hustles,
  setHustles,
  vipTier,
  bonusMultiplier,
}) => {
  const handleBuyHustle = (id: string) => {
    const hustle = hustles.find((h) => h.id === id);
    if (!hustle) return;

    const cost = calculateUpgradeCost(hustle.baseCost, hustle.count);
    if (balance >= cost) {
      setBalance((prev) => prev - cost);
      setHustles((prev) =>
        prev.map((item) => (item.id === id ? { ...item, count: item.count + 1 } : item))
      );
      sound.playCashRegister();
    }
  };

  const getHustleIcon = (category: string) => {
    switch (category) {
      case 'crypto':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'dropship':
        return <Globe className="w-5 h-5 text-amber-400" />;
      case 'influencer':
        return <Smartphone className="w-5 h-5 text-pink-400" />;
      case 'ai':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      default:
        return <Radio className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="py-6 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
            Satirical Earning Hustles &amp; Pipelines
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Automate your virtual money printing factory with infamous Internet get-rich-quick tropes.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block">Available Cash:</span>
            <span className="text-base text-amber-400 font-bold">{formatMoney(balance)}</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-400 block">Total Passive:</span>
            <span className="text-base text-emerald-400 font-bold">
              +{formatMoney(
                hustles.reduce((acc, h) => acc + h.baseRatePerSec * h.count, 0) *
                  vipTier.multiplier *
                  bonusMultiplier
              )} / s
            </span>
          </div>
        </div>
      </div>

      {/* Hustle Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hustles.map((hustle) => {
          const cost = calculateUpgradeCost(hustle.baseCost, hustle.count);
          const canAfford = balance >= cost;
          const currentEarning = hustle.baseRatePerSec * hustle.count * vipTier.multiplier * bonusMultiplier;

          return (
            <div
              key={hustle.id}
              className={`bg-slate-900/90 border rounded-xl p-5 transition-all flex flex-col justify-between gap-4 ${
                hustle.count > 0 ? 'border-amber-500/30' : 'border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      {getHustleIcon(hustle.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{hustle.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="capitalize">{hustle.category} Hustle</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400 font-mono">
                          +{formatMoney(hustle.baseRatePerSec * vipTier.multiplier * bonusMultiplier)}/s each
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-500 block">Owned</span>
                    <span className="text-lg font-bold font-mono text-white tabular-nums">
                      {hustle.count}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic">{hustle.punchline}</p>
                <p className="text-xs text-slate-400">{hustle.description}</p>
              </div>

              {/* Bottom Row */}
              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between gap-3">
                <div className="text-xs font-mono">
                  <span className="text-slate-500 block">Generating</span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    +{formatMoney(currentEarning)} / sec
                  </span>
                </div>

                <button
                  onClick={() => handleBuyHustle(hustle.id)}
                  disabled={!canAfford}
                  className={`py-2 px-4 rounded-lg font-bold text-xs transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    canAfford
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 active:scale-[0.98]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Buy 1 ({formatMoney(cost)})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
