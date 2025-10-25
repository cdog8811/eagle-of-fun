/**
 * Scoring Configuration v3.8
 *
 * Defines scoring rules, combos, and style bonuses
 */

// ========== COIN VALUES ==========
export const COIN_VALUES = {
  BONK: 2,
  AOL: 6,
  BURGER: 12,
  VALOR: 20
} as const;

// ========== ENEMY BASE POINTS ==========
// Actual points = base × difficultyMultiplier
export const ENEMY_BASE_POINTS = {
  gary: 12,
  secguy: 16,
  hawkeye: 20,
  droneling: 8,
  custodian: 22,
  firecracker: 18,
  sbf: 25,
  dokwon: 35,
  cz: 50
} as const;

// ========== DIFFICULTY MULTIPLIER ==========
/**
 * Calculate score multiplier based on game progression
 */
export function calculateDifficultyMultiplier(phaseIndex: number, minutesElapsed: number): number {
  // difficultyMultiplier = 1 + (phase × 0.15) + (minutes × 0.05)
  const phaseBonus = phaseIndex * 0.15;
  const timeBonus = minutesElapsed * 0.05;
  return Math.max(1.0, 1 + phaseBonus + timeBonus);
}

// ========== COMBO SYSTEM ==========
export const COMBO_CONFIG = {
  // Timer settings
  baseTimer: 4.0,           // seconds
  timerIncPerKill: 0.25,    // seconds added per kill
  maxTimer: 8.0,            // maximum timer duration

  // Multiplier settings
  multPerTier: 0.1,         // +0.1× per combo tier
  maxMult: 2.0,             // maximum +2.0× multiplier

  // Combo tiers (kills needed)
  tiers: [
    { kills: 0, name: 'None', color: 0xFFFFFF },
    { kills: 5, name: 'Good', color: 0x00FF00 },
    { kills: 10, name: 'Great', color: 0xFFD700 },
    { kills: 20, name: 'Amazing', color: 0xFF6600 },
    { kills: 30, name: 'Legendary', color: 0xFF0000 },
    { kills: 50, name: 'Godlike', color: 0xFF00FF }
  ]
} as const;

/**
 * Get combo tier based on kill count
 */
export function getComboTier(kills: number): typeof COMBO_CONFIG.tiers[number] {
  for (let i = COMBO_CONFIG.tiers.length - 1; i >= 0; i--) {
    if (kills >= COMBO_CONFIG.tiers[i].kills) {
      return COMBO_CONFIG.tiers[i];
    }
  }
  return COMBO_CONFIG.tiers[0];
}

/**
 * Calculate combo multiplier
 */
export function calculateComboMultiplier(kills: number): number {
  const tier = getComboTier(kills);
  const tierIndex = COMBO_CONFIG.tiers.indexOf(tier);
  const mult = 1 + (tierIndex * COMBO_CONFIG.multPerTier);
  return Math.min(mult, 1 + COMBO_CONFIG.maxMult);
}

// ========== STYLE BONUSES ==========
export interface StyleBonus {
  id: string;
  name: string;
  description: string;
  points: number;
  color: number;
}

export const STYLE_BONUSES: Record<string, StyleBonus> = {
  aerialAce: {
    id: 'aerialAce',
    name: 'Aerial Ace',
    description: '5 kills in 2 seconds',
    points: 150,
    color: 0x00FF00
  },

  flawless30: {
    id: 'flawless30',
    name: 'Flawless 30s',
    description: '30 seconds without damage',
    points: 300,
    color: 0xFFD700
  },

  shieldBreaker: {
    id: 'shieldBreaker',
    name: 'Shield Breaker',
    description: '3 Shielded enemies from weak point',
    points: 120,
    color: 0x00FFFF
  },

  closeCall: {
    id: 'closeCall',
    name: 'Close Call',
    description: 'Kill enemy within 50px while invincible',
    points: 80,
    color: 0xFF9900
  },

  multiKill: {
    id: 'multiKill',
    name: 'Multi-Kill',
    description: 'Kill 3+ enemies with one shot',
    points: 200,
    color: 0xFF00FF
  },

  perfectPhase: {
    id: 'perfectPhase',
    name: 'Perfect Phase',
    description: 'Complete phase without taking damage',
    points: 500,
    color: 0xFF0000
  }
};

// ========== VALOR MULTIPLIERS ==========
export const VALOR_MULTIPLIERS = {
  RISING: 1.5,      // Stage 1 (slow-mo)
  UNLEASHED: 3.0,   // Stage 2 (full power)
  AFTERGLOW: 1.5    // Stage 3 (fade out)
} as const;

/**
 * Calculate total score multiplier
 */
export function calculateTotalMultiplier(
  difficultyMult: number,
  comboMult: number,
  valorMult: number = 1.0
): number {
  // Multiplicative stacking
  return difficultyMult * comboMult * valorMult;
}

/**
 * Calculate final score for an enemy kill
 */
export function calculateEnemyScore(
  enemyId: string,
  phaseIndex: number,
  minutesElapsed: number,
  comboKills: number,
  valorMult: number = 1.0
): number {
  const basePoints = ENEMY_BASE_POINTS[enemyId as keyof typeof ENEMY_BASE_POINTS] || 10;
  const diffMult = calculateDifficultyMultiplier(phaseIndex, minutesElapsed);
  const comboMult = calculateComboMultiplier(comboKills);
  const totalMult = calculateTotalMultiplier(diffMult, comboMult, valorMult);

  return Math.floor(basePoints * totalMult);
}

// ========== SCORE DISPLAY SETTINGS ==========
export const SCORE_DISPLAY = {
  // Floating text settings
  floaterDuration: 1500,    // ms
  floaterRiseSpeed: 50,     // pixels/second
  floaterFadeDelay: 1000,   // ms before fade starts

  // Size thresholds
  smallScore: 50,           // < 50 points
  mediumScore: 200,         // < 200 points
  largeScore: 500,          // >= 500 points

  // Font sizes
  smallFont: '18px',
  mediumFont: '24px',
  largeFont: '32px',

  // Colors
  normalColor: 0xFFFFFF,
  comboColor: 0xFFD700,
  valorColor: 0xFF00FF,
  bonusColor: 0x00FF00
} as const;
