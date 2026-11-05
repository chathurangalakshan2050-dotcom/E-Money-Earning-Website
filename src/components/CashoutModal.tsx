import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, CheckCircle2, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatMoney } from '../game/rules.ts';
import { sound } from '../utils/audio.ts';

interface CashoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

export const CashoutModal: React.FC<CashoutModalProps> = ({
  isOpen,
  onClose,
  balance,
}) => {
  const [method, setMethod] = useState<'paypal' | 'crypto' | 'bank' | 'gold'>('paypal');
  const [accountInput, setAccountInput] = useState('');
  const [stage, setStage] = useState<'form' | 'processing' | 'verdict'>('form');
  const [processingLog, setProcessingLog] = useState<string>('Initiating simulated wire...');

  if (!isOpen) return null;

  const handleStartCashout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountInput) return;

    setStage('processing');
    sound.playTick();

    const logs = [
      'Contacting offshore simulated liquidity pools...',
      'Bypassing fictional central bank anti-money laundering filters...',
      'Verifying proof-of-click algorithm...',
      'Generating virtual billionaire receipt...',
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setProcessingLog(log);
        sound.playTick();
      }, (index + 1) * 150);
    });

    setTimeout(() => {
      setStage('verdict');
      sound.playJackpot();
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          ticks: 100,
          origin: { y: 0.5 },
        });
      } catch {
        // silent
      }
    }, 700);
  };

  const handleReset = () => {
    setStage('form');
    setAccountInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close cashout modal"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {stage === 'form' && (
          <form onSubmit={handleStartCashout} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Simulated Withdrawal Portal</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white mt-1">
                Request Instant Payout
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Available to withdraw: <strong className="text-amber-400 font-mono text-sm">{formatMoney(balance)}</strong>
              </p>
            </div>

            {/* Method selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Select Withdrawal Destination:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setMethod('paypal')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    method === 'paypal' ? 'bg-amber-400/10 border-amber-400 text-white' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block font-bold">PayPal</span>
                  <span className="text-[11px] text-slate-500">Instant virtual wallet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('crypto')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    method === 'crypto' ? 'bg-amber-400/10 border-amber-400 text-white' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block font-bold">Crypto (DOGE/BTC)</span>
                  <span className="text-[11px] text-slate-500">Meme gas included</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    method === 'bank' ? 'bg-amber-400/10 border-amber-400 text-white' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block font-bold">Direct Wire</span>
                  <span className="text-[11px] text-slate-500">Cayman Islands router</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('gold')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    method === 'gold' ? 'bg-amber-400/10 border-amber-400 text-white' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block font-bold">Drone Gold Delivery</span>
                  <span className="text-[11px] text-slate-500">Drops right on roof</span>
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="space-y-1.5">
              <label htmlFor="payoutAddress" className="text-xs font-semibold text-slate-300 block">
                Destination Address / Username:
              </label>
              <input
                id="payoutAddress"
                type="text"
                required
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                placeholder="e.g. Satoshi99@meme.com or 0x999..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <span className="text-[11px] text-slate-500 block">
                Enter any fictional handle. No personal data needed!
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              Confirm Cashout Request ({formatMoney(balance)})
            </button>
          </form>
        )}

        {stage === 'processing' && (
          <div className="py-8 text-center space-y-4">
            <RefreshCw className="w-12 h-12 text-amber-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">Connecting To Payment Gateways</h4>
              <p className="text-xs text-slate-400 font-mono animate-pulse">{processingLog}</p>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Simulating standard high-pressure earning portal load sequences...
            </p>
          </div>
        )}

        {stage === 'verdict' && (
          <div className="space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-bold font-display text-white">
                Reality Check Unlocked!
              </h4>
              <p className="text-sm font-semibold text-amber-300">
                You just attempted to withdraw {formatMoney(balance)} in simulated money!
              </p>
            </div>

            {/* Educational awareness card */}
            <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>HOW REAL GET-RICH-QUICK SCAMS OPERATE:</span>
              </div>
              <ul className="text-slate-300 space-y-1.5 list-disc pl-4">
                <li>
                  <strong>The Advance-Fee Hook:</strong> Real scam sites at this step demand you deposit a $20–$100 &quot;verification fee&quot; or &quot;VIP unlock fee&quot; to release your money. Once sent, the site vanishes.
                </li>
                <li>
                  <strong>Unrealistic Returns:</strong> No legal platform can pay hundreds of dollars for watching 15-second ads or typing captchas.
                </li>
                <li>
                  <strong>Golden Rule:</strong> Never pay money to receive money from an online job or earning platform!
                </li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleReset}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all"
              >
                Keep Playing CashTycoon 3000
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
