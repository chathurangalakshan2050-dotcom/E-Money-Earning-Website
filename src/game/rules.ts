/**
 * Pure game rules, scoring, financial calculations, and scam evaluation logic.
 */

export interface HustleItem {
  id: string;
  name: string;
  category: 'crypto' | 'dropship' | 'influencer' | 'ai' | 'shady';
  description: string;
  punchline: string;
  baseCost: number;
  baseRatePerSec: number;
  count: number;
  iconName: string;
}

export interface QuizScenario {
  id: string;
  title: string;
  offerType: string;
  promisedReturn: string;
  description: string;
  claims: Array<{
    id: string;
    text: string;
    isRedFlag: boolean;
    explanation: string;
  }>;
}

export interface VIPTierInfo {
  tier: string;
  rank: number;
  threshold: number;
  multiplier: number;
  title: string;
  badgeColor: string;
}

export const VIP_TIERS: VIPTierInfo[] = [
  { tier: 'Starter', rank: 1, threshold: 0, multiplier: 1, title: 'Couch Potato Hustler', badgeColor: 'text-slate-400' },
  { tier: 'Bronze', rank: 2, threshold: 1000, multiplier: 1.5, title: 'Ad Click Connoisseur', badgeColor: 'text-amber-600' },
  { tier: 'Silver', rank: 3, threshold: 25000, multiplier: 2.0, title: 'Crypto Telegram Lurker', badgeColor: 'text-slate-300' },
  { tier: 'Gold', rank: 4, threshold: 250000, multiplier: 3.0, title: 'Dubai Dropship Guru', badgeColor: 'text-amber-400' },
  { tier: 'Platinum', rank: 5, threshold: 2500000, multiplier: 5.0, title: 'Venture Capital Illusionist', badgeColor: 'text-emerald-400' },
  { tier: 'Diamond', rank: 6, threshold: 50000000, multiplier: 10.0, title: 'Galactic Meme Oligarch', badgeColor: 'text-cyan-400' },
  { tier: 'Mythic', rank: 7, threshold: 1000000000, multiplier: 25.0, title: 'Central Bank Parody Emperor', badgeColor: 'text-purple-400' },
];

/**
 * Format currency with compact human-readable suffixes
 */
export function formatMoney(amount: number): string {
  if (isNaN(amount) || amount < 0) return '$0';
  if (amount < 1000) {
    return `$${Math.floor(amount).toLocaleString('en-US')}`;
  }
  const units = [
    { value: 1e15, symbol: 'Q' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];
  for (const unit of units) {
    if (amount >= unit.value) {
      const formatted = (amount / unit.value).toFixed(2);
      return `$${formatted} ${unit.symbol}`;
    }
  }
  return `$${amount.toFixed(2)}`;
}

/**
 * Calculate cost of buying the next unit of a hustle or upgrade
 */
export function calculateUpgradeCost(baseCost: number, currentCount: number, scalingFactor = 1.15): number {
  return Math.round(baseCost * Math.pow(scalingFactor, currentCount));
}

/**
 * Calculate total click value
 */
export function calculateClickValue(
  baseClick = 1,
  clickPowerCount = 0,
  vipMultiplier = 1,
  bonusMultiplier = 1
): number {
  const upgradeBoost = Math.pow(1.6, clickPowerCount);
  const raw = (baseClick + clickPowerCount * 2) * upgradeBoost * vipMultiplier * bonusMultiplier;
  return Math.max(1, Math.floor(raw));
}

/**
 * Calculate passive income rate ($ per second)
 */
export function calculatePassiveIncomePerSec(
  hustles: Array<{ baseRatePerSec: number; count: number }>,
  vipMultiplier = 1,
  bonusMultiplier = 1
): number {
  const totalBase = hustles.reduce((acc, hustle) => acc + hustle.baseRatePerSec * hustle.count, 0);
  return totalBase * vipMultiplier * bonusMultiplier;
}

/**
 * Get current VIP Tier based on lifetime earnings
 */
export function getVIPTier(lifetimeEarnings: number): VIPTierInfo {
  for (let i = VIP_TIERS.length - 1; i >= 0; i--) {
    if (lifetimeEarnings >= VIP_TIERS[i].threshold) {
      return VIP_TIERS[i];
    }
  }
  return VIP_TIERS[0];
}

/**
 * Evaluate scam detector quiz response
 */
export function evaluateRedFlagQuiz(
  selectedIds: string[],
  claims: Array<{ id: string; isRedFlag: boolean }>
): {
  score: number;
  totalRedFlags: number;
  falsePositives: number;
  passed: boolean;
  multiplierReward: number;
} {
  const redFlagIds = claims.filter((c) => c.isRedFlag).map((c) => c.id);
  const totalRedFlags = redFlagIds.length;

  let correctFlags = 0;
  let falsePositives = 0;

  for (const id of selectedIds) {
    if (redFlagIds.includes(id)) {
      correctFlags++;
    } else {
      falsePositives++;
    }
  }

  const score = Math.max(0, correctFlags - falsePositives);
  const passed = correctFlags === totalRedFlags && falsePositives === 0;
  const multiplierReward = passed ? 2.5 : correctFlags >= 2 ? 1.5 : 1.0;

  return {
    score,
    totalRedFlags,
    falsePositives,
    passed,
    multiplierReward,
  };
}

/**
 * Sample realistic scam scenarios for the education quiz mode
 */
export const SCAM_SCENARIOS: QuizScenario[] = [
  {
    id: 'crypto_guarantee',
    title: 'NebulaQuantum AI Cloud Miner 9000',
    offerType: 'Automated Crypto Trading Bot',
    promisedReturn: '300% Daily Profit Guaranteed Forever',
    description: 'A flashy landing page with countdown timers, stock broker photos, and testimonials from "Satisfied Millionaires".',
    claims: [
      {
        id: 'c1',
        text: 'Guaranteed 300% daily returns with zero market risk',
        isRedFlag: true,
        explanation: 'No legitimate investment can guarantee high returns without risk. Guaranteed crazy profits is the #1 tell of a Ponzi scheme.',
      },
      {
        id: 'c2',
        text: 'Must deposit minimum $250 via irreversible crypto transfer',
        isRedFlag: true,
        explanation: 'Demanding untraceable cryptocurrency transfers makes chargebacks or recovery impossible once funds vanish.',
      },
      {
        id: 'c3',
        text: 'Registered under UK Companies House certificate image preview',
        isRedFlag: true,
        explanation: 'Fake shell company registrations or forged PDF certificates are commonly bought online for $20 to feign authority.',
      },
      {
        id: 'c4',
        text: 'Software uses 256-bit SSL encryption on the login page',
        isRedFlag: false,
        explanation: 'Standard HTTPS encryption is free for all websites; having SSL does not mean an investment opportunity is trustworthy.',
      },
    ],
  },
  {
    id: 'task_earning',
    title: 'EasyTask Global Social Booster',
    offerType: 'Pay-Per-Click & Video Watching Earning App',
    promisedReturn: '$50 for watching 30-second TikTok videos',
    description: 'Promises to pay huge sums just to like YouTube videos, click ads, or test mobile games from home.',
    claims: [
      {
        id: 't1',
        text: 'Earn $50/video for watching promotional clips from your phone',
        isRedFlag: true,
        explanation: 'Real digital ad revenue pays mere fractions of a penny ($0.001 - $0.01) per view. Paying $50 for a view is economically impossible.',
      },
      {
        id: 't2',
        text: 'Must pay a $49 "Account Activation & Anti-Bot Verification Fee" to withdraw your $1,200 balance',
        isRedFlag: true,
        explanation: 'Advance fee fraud (419 scam): legitimate employer platforms deduct fees from earnings, they never demand upfront cash to cash out.',
      },
      {
        id: 't3',
        text: 'Must invite 20 friends on WhatsApp before withdrawal unlocking',
        isRedFlag: true,
        explanation: 'Pyramid / viral spam mechanics require dragging friends in to artificially spread the scam before locking everyone out.',
      },
      {
        id: 't4',
        text: 'User profile shows avatar and username',
        isRedFlag: false,
        explanation: 'Basic profile fields are standard website features, not an inherent scam tell.',
      },
    ],
  },
  {
    id: 'secret_mentor',
    title: 'Dubai Private VIP E-Commerce Alpha Club',
    offerType: 'Automated E-Commerce Store Franchise',
    promisedReturn: '$25,000/month 100% hands-free passive income',
    description: 'Instagram influencer filming in front of rented Lamborghini claims their proprietary copy-paste dropshipping AI prints cash while you sleep.',
    claims: [
      {
        id: 'm1',
        text: 'Only 3 VIP spots left in your city, countdown timer expiring in 4 minutes',
        isRedFlag: true,
        explanation: 'Artificial urgency and fake scarcity are psychological pressure tactics to stop victims from doing independent research.',
      },
      {
        id: 'm2',
        text: 'Proprietary secret AI glitch that dropshippers do not want you to know',
        isRedFlag: true,
        explanation: 'Appealing to "secret loops" or insider secrets exploits FOMO and hides lack of real audited financial records.',
      },
      {
        id: 'm3',
        text: 'No transparent refund policy, all masterclass sales final and paid via wire',
        isRedFlag: true,
        explanation: 'Legitimate accredited educators provide clear terms of service and consumer protection avenues.',
      },
      {
        id: 'm4',
        text: 'Includes a downloadable 12-page PDF tutorial guide',
        isRedFlag: false,
        explanation: 'Delivering a digital PDF file is a normal educational format.',
      },
    ],
  },
];
