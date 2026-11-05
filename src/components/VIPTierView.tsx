import React from 'react';
import { Crown, Check, Lock, Sparkles } from 'lucide-react';
import { VIP_TIERS, formatMoney, VIPTierInfo } from '../game/rules.ts';

interface VIPTierViewProps {
  lifetimeEarnings: number;
  currentTier: VIPTierInfo;
}

export const VIPTierView: React.FC<VIPTierViewProps> = ({
  lifetimeEarnings,
  currentTier,
}) => {
  return (
    <div className="py-6 px-4 md:px-8 max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Crown className="w-4 h-4" />
          <span>Executive Prestige Hierarchy</span>
        </div>
        <h2 className="text-3xl font-bold font-display text-white">
          VIP Hustler Tiers
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          As your lifetime virtual simulation wealth climbs, automatically unlock higher prestige tiers with massive permanent multipliers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {VIP_TIERS.map((tier) => {
          const isUnlocked = lifetimeEarnings >= tier.threshold;
          const isCurrent = currentTier.tier === tier.tier;

          return (
            <div
              key={tier.tier}
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between gap-5 relative overflow-hidden ${
                isCurrent
                  ? 'bg-amber-500/10 border-amber-400 shadow-xl shadow-amber-500/10'
                  : isUnlocked
                  ? 'bg-slate-900 border-slate-700'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  Current
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Crown className={`w-5 h-5 ${tier.badgeColor}`} />
                  <span className={`font-bold text-sm uppercase tracking-wider ${tier.badgeColor}`}>
                    Tier {tier.rank} · {tier.tier}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-white font-display">{tier.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Requires: {tier.threshold === 0 ? '$0 (Free)' : formatMoney(tier.threshold)} lifetime
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{tier.multiplier}x Global Multiplier</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Access to automated vanity certificates</span>
                  </div>
                </div>
              </div>

              <div>
                {isUnlocked ? (
                  <div className="w-full py-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Unlocked &amp; Active</span>
                  </div>
                ) : (
                  <div className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 font-medium text-xs text-center flex items-center justify-center gap-1.5">
                    <Lock className="w-4 h-4" />
                    <span>Locked ({formatMoney(tier.threshold - lifetimeEarnings)} needed)</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
