import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCw, AlertCircle, Gift } from 'lucide-react';
import { formatMoney } from '../game/rules.ts';
import { sound } from '../utils/audio.ts';

interface MysteryWheelProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setBonusMultiplier: React.Dispatch<React.SetStateAction<number>>;
  bonusMultiplier: number;
}

interface WheelSegment {
  label: string;
  sublabel: string;
  color: string;
  textColor: string;
  rewardType: 'cash' | 'multiplier' | 'nothing' | 'jackpot';
  value: number;
}

const SEGMENTS: WheelSegment[] = [
  { label: '+$50,000', sublabel: 'Instant Cash', color: '#10B981', textColor: '#ffffff', rewardType: 'cash', value: 50000 },
  { label: '3x BOOST', sublabel: 'For 60 sec', color: '#F59E0B', textColor: '#090D16', rewardType: 'multiplier', value: 3 },
  { label: '+$5,000', sublabel: 'Pocket Change', color: '#06B6D4', textColor: '#ffffff', rewardType: 'cash', value: 5000 },
  { label: 'SAD KAZOO', sublabel: 'You win $0', color: '#EF4444', textColor: '#ffffff', rewardType: 'nothing', value: 0 },
  { label: 'JACKPOT $1M', sublabel: 'Simulated Gold', color: '#8B5CF6', textColor: '#ffffff', rewardType: 'jackpot', value: 1000000 },
  { label: '5x FRENZY', sublabel: 'Mega Boost', color: '#EC4899', textColor: '#ffffff', rewardType: 'multiplier', value: 5 },
  { label: '+$25,000', sublabel: 'Instant Cash', color: '#10B981', textColor: '#ffffff', rewardType: 'cash', value: 25000 },
  { label: '2x BOOST', sublabel: 'Double Earnings', color: '#F59E0B', textColor: '#090D16', rewardType: 'multiplier', value: 2 },
];

export const MysteryWheel: React.FC<MysteryWheelProps> = ({
  balance,
  setBalance,
  setBonusMultiplier,
  bonusMultiplier,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [freeSpinsLeft, setFreeSpinsLeft] = useState(3);
  const spinCost = 1000;

  const handleSpin = () => {
    if (isSpinning) return;

    if (freeSpinsLeft <= 0 && balance < spinCost) {
      sound.playBuzz();
      return;
    }

    if (freeSpinsLeft > 0) {
      setFreeSpinsLeft((prev) => prev - 1);
    } else {
      setBalance((prev) => prev - spinCost);
    }

    setIsSpinning(true);
    setLastWin(null);
    sound.playTick();

    // Pick a random winning segment index
    const segmentCount = SEGMENTS.length;
    const winningIndex = Math.floor(Math.random() * segmentCount);
    const segmentAngle = 360 / segmentCount;

    // Full rotations + target angle
    const extraTurns = 5 * 360; // 5 full turns
    const targetAngle = extraTurns + (segmentCount - winningIndex - 0.5) * segmentAngle;
    const newRotation = rotation + targetAngle;

    setRotation(newRotation);

    // Audio ticks during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      sound.playTick();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 120);

    setTimeout(() => {
      setIsSpinning(false);
      clearInterval(tickInterval);
      const won = SEGMENTS[winningIndex];

      if (won.rewardType === 'cash' || won.rewardType === 'jackpot') {
        setBalance((prev) => prev + won.value);
        sound.playJackpot();
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
        setLastWin(`🎉 You won ${formatMoney(won.value)} in virtual simulation cash!`);
      } else if (won.rewardType === 'multiplier') {
        setBonusMultiplier((prev) => prev * won.value);
        sound.playJackpot();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        setLastWin(`⚡ Activated ${won.value}x earnings multiplier for 60 seconds!`);
        setTimeout(() => {
          setBonusMultiplier((prev) => Math.max(1, prev / won.value));
        }, 60000);
      } else {
        sound.playBuzz();
        setLastWin(`🤡 Wah-wah! The wheel landed on Sad Kazoo ($0). Classic scam roulette!`);
      }
    }, 3800);
  };

  return (
    <div className="py-6 px-4 md:px-8 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Gift className="w-4 h-4" />
          <span>High Roller Prize Wheel</span>
        </div>
        <h2 className="text-3xl font-extrabold font-display text-white">
          Lucky Mystery Earning Wheel
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Spin the wheel of fortune to unlock massive multipliers, instant virtual bags of cash, or the notorious Sad Kazoo.
        </p>
      </div>

      {/* Wheel Stage */}
      <div className="flex flex-col items-center justify-center py-6 relative">
        {/* Pointer Triangle */}
        <div className="z-30 mb-[-14px] w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[28px] border-t-amber-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" />

        {/* The Wheel */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border-8 border-slate-800 shadow-2xl overflow-hidden bg-slate-900">
          <div
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3.8s cubic-bezier(0.15, 0.95, 0.35, 1)' : 'none',
            }}
            className="w-full h-full rounded-full relative"
          >
            {SEGMENTS.map((seg, i) => {
              const angle = (360 / SEGMENTS.length) * i;
              return (
                <div
                  key={i}
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                  className="absolute inset-0 flex justify-center pt-3 pointer-events-none"
                >
                  <div
                    className="flex flex-col items-center text-center font-bold font-display"
                    style={{ color: seg.textColor }}
                  >
                    <span className="text-xs sm:text-sm drop-shadow-md">{seg.label}</span>
                    <span className="text-[10px] opacity-80">{seg.sublabel}</span>
                  </div>
                </div>
              );
            })}

            {/* Hub Center Cap */}
            <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-slate-950 border-4 border-amber-400 shadow-xl flex items-center justify-center z-10">
              <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
          </div>
        </div>

        {/* Spin Actions */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={handleSpin}
            disabled={isSpinning || (freeSpinsLeft <= 0 && balance < spinCost)}
            className={`py-3.5 px-8 rounded-xl font-extrabold text-base transition-all flex items-center gap-2.5 shadow-xl ${
              isSpinning
                ? 'bg-slate-800 text-slate-500 cursor-wait'
                : freeSpinsLeft > 0 || balance >= spinCost
                ? 'bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 shadow-amber-500/25 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>
              {isSpinning
                ? 'Spinning the Wheel...'
                : freeSpinsLeft > 0
                ? `Free Spin (${freeSpinsLeft} Left)`
                : `Spin for ${formatMoney(spinCost)}`}
            </span>
          </button>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Free spins refresh periodically</span>
            <span aria-hidden="true">·</span>
            <span>Current Multiplier: <strong className="text-amber-300 font-mono">{bonusMultiplier.toFixed(1)}x</strong></span>
          </div>
        </div>

        {/* Win announcement banner */}
        {lastWin && (
          <div className="mt-6 py-3 px-5 rounded-xl bg-slate-900 border border-amber-500/30 text-sm font-semibold text-center text-white max-w-md animate-fade-in">
            {lastWin}
          </div>
        )}
      </div>
    </div>
  );
};
