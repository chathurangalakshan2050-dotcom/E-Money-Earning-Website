import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SCAM_SCENARIOS, evaluateRedFlagQuiz, QuizScenario } from '../game/rules.ts';
import { sound } from '../utils/audio.ts';

interface ScamBusterQuizProps {
  quizMultiplier: number;
  setQuizMultiplier: React.Dispatch<React.SetStateAction<number>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

export const ScamBusterQuiz: React.FC<ScamBusterQuizProps> = ({
  quizMultiplier,
  setQuizMultiplier,
  setBalance,
}) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>([]);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [feedback, setFeedback] = useState<{
    passed: boolean;
    score: number;
    totalRedFlags: number;
    falsePositives: number;
    multiplierReward: number;
  } | null>(null);

  const scenario: QuizScenario = SCAM_SCENARIOS[currentScenarioIndex];

  const handleToggleClaim = (id: string) => {
    if (hasEvaluated) return;
    sound.playTick();
    setSelectedClaimIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmitEvaluation = () => {
    if (hasEvaluated) return;
    const res = evaluateRedFlagQuiz(selectedClaimIds, scenario.claims);
    setFeedback(res);
    setHasEvaluated(true);

    if (res.passed) {
      sound.playJackpot();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
      // Award permanent quiz multiplier boost and bonus virtual money
      setQuizMultiplier((prev) => Math.min(10, prev * 1.5));
      setBalance((prev) => prev + 100000);
    } else {
      sound.playBuzz();
    }
  };

  const handleNextScenario = () => {
    setSelectedClaimIds([]);
    setHasEvaluated(false);
    setFeedback(null);
    setCurrentScenarioIndex((prev) => (prev + 1) % SCAM_SCENARIOS.length);
    sound.playTick();
  };

  return (
    <div className="py-6 px-4 md:px-8 max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <img
          src="/src/assets/images/scam_buster_badge_1793896697394.jpg"
          alt="Cyber Scam Buster Detective Badge"
          className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover border-2 border-cyan-400/30 shadow-lg shadow-cyan-500/10 shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Cyber Intelligence &amp; Scam Buster Academy</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
            Spot The Fake Earning Red Flags
          </h2>
          <p className="text-sm text-slate-400">
            Learn to identify the devious tricks of real-world fake earning websites and advance-fee scams.
            Every case solved permanently boosts your virtual earnings by <strong className="text-cyan-300">1.5x</strong>!
          </p>
          <div className="pt-1 text-xs text-slate-500">
            Current Detective Multiplier: <strong className="text-emerald-400 font-mono font-bold">{quizMultiplier.toFixed(1)}x</strong>
          </div>
        </div>
      </div>

      {/* Case Scenario Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              Investigation Case #{currentScenarioIndex + 1}
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">{scenario.title}</h3>
            <span className="text-xs text-slate-400">Category: {scenario.offerType}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono">
            <span className="text-slate-500 block">Promised Claim:</span>
            <span className="text-red-400 font-bold">{scenario.promisedReturn}</span>
          </div>
        </div>

        <p className="text-sm text-slate-300 italic">{scenario.description}</p>

        {/* Claim Selector List */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Select every statement below that represents a Scam Red Flag:
          </label>

          {scenario.claims.map((claim) => {
            const isSelected = selectedClaimIds.includes(claim.id);
            let stateStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700';

            if (hasEvaluated) {
              if (claim.isRedFlag) {
                stateStyle = isSelected
                  ? 'bg-emerald-950/40 border-emerald-500 text-white'
                  : 'bg-amber-950/40 border-amber-500 text-amber-200';
              } else if (isSelected) {
                stateStyle = 'bg-red-950/40 border-red-500 text-red-200';
              }
            } else if (isSelected) {
              stateStyle = 'bg-amber-500/10 border-amber-400 text-white';
            }

            return (
              <button
                key={claim.id}
                onClick={() => handleToggleClaim(claim.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${stateStyle}`}
              >
                <div className="mt-0.5 shrink-0">
                  {hasEvaluated ? (
                    claim.isRedFlag ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-500" />
                    )
                  ) : (
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <span className="text-xs font-black">✓</span>}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{claim.text}</p>
                  {hasEvaluated && (
                    <p className="text-xs text-slate-300 pt-1">
                      <strong className={claim.isRedFlag ? 'text-emerald-400' : 'text-slate-400'}>
                        {claim.isRedFlag ? '🚩 RED FLAG EXPLAINED: ' : 'ℹ️ BENIGN TRAIT: '}
                      </strong>
                      {claim.explanation}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit or Next Controls */}
        <div className="border-t border-slate-800 pt-5 flex items-center justify-between">
          {!hasEvaluated ? (
            <button
              onClick={handleSubmitEvaluation}
              disabled={selectedClaimIds.length === 0}
              className={`py-3 px-6 rounded-xl font-bold text-sm transition-all ${
                selectedClaimIds.length > 0
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Analyze Red Flags ({selectedClaimIds.length} Selected)
            </button>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="text-xs">
                {feedback?.passed ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Flawless detection! +1.5x Detective Multiplier &amp; +$100,000 Virtual Cash!
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Review the explanations above to spot deceptive practices.
                  </span>
                )}
              </div>

              <button
                onClick={handleNextScenario}
                className="py-2.5 px-5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-xs flex items-center gap-2 transition-colors"
              >
                <span>Next Case</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
