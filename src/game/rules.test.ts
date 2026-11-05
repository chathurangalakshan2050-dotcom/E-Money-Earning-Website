import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatMoney,
  calculateUpgradeCost,
  calculateClickValue,
  calculatePassiveIncomePerSec,
  getVIPTier,
  evaluateRedFlagQuiz,
  SCAM_SCENARIOS,
} from './rules.ts';

test('formatMoney handles small and massive numbers correctly', () => {
  assert.equal(formatMoney(0), '$0');
  assert.equal(formatMoney(450), '$450');
  assert.equal(formatMoney(1500), '$1.50 K');
  assert.equal(formatMoney(2500000), '$2.50 M');
  assert.equal(formatMoney(12400000000), '$12.40 B');
  assert.equal(formatMoney(8900000000000), '$8.90 T');
});

test('calculateUpgradeCost scales exponentially', () => {
  const baseCost = 100;
  assert.equal(calculateUpgradeCost(baseCost, 0), 100);
  assert.equal(calculateUpgradeCost(baseCost, 1), 115);
  assert.equal(calculateUpgradeCost(baseCost, 5), Math.floor(100 * Math.pow(1.15, 5)));
});

test('calculateClickValue incorporates upgrades and multipliers', () => {
  const initialClick = calculateClickValue(1, 0, 1, 1);
  assert.equal(initialClick, 1);

  const upgradedClick = calculateClickValue(1, 2, 2, 1);
  assert.ok(upgradedClick > initialClick);
});

test('calculatePassiveIncomePerSec calculates sum with multipliers', () => {
  const hustles = [
    { baseRatePerSec: 10, count: 2 },
    { baseRatePerSec: 50, count: 1 },
  ];
  // 10*2 + 50*1 = 70. With VIP multiplier 2.0 = 140
  const rate = calculatePassiveIncomePerSec(hustles, 2.0, 1.0);
  assert.equal(rate, 140);
});

test('getVIPTier returns correct tier for lifetime earnings', () => {
  assert.equal(getVIPTier(0).tier, 'Starter');
  assert.equal(getVIPTier(1500).tier, 'Bronze');
  assert.equal(getVIPTier(50000).tier, 'Silver');
  assert.equal(getVIPTier(500000).tier, 'Gold');
  assert.equal(getVIPTier(10000000).tier, 'Platinum');
  assert.equal(getVIPTier(100000000).tier, 'Diamond');
  assert.equal(getVIPTier(5000000000).tier, 'Mythic');
});

test('evaluateRedFlagQuiz accurately identifies passes and false positives', () => {
  const scenario = SCAM_SCENARIOS[0]; // c1, c2, c3 are red flags; c4 is not
  // Perfect pass
  const perfectResult = evaluateRedFlagQuiz(['c1', 'c2', 'c3'], scenario.claims);
  assert.equal(perfectResult.passed, true);
  assert.equal(perfectResult.score, 3);
  assert.equal(perfectResult.multiplierReward, 2.5);

  // Partial pass with false positive
  const partialResult = evaluateRedFlagQuiz(['c1', 'c4'], scenario.claims);
  assert.equal(partialResult.passed, false);
  assert.equal(partialResult.falsePositives, 1);
});
