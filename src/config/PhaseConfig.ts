/**
 * PhaseConfig.ts
 * Eagle of Fun v4.2 - Phase Progression System
 *
 * 6 phases with balanced enemy pools, spawn rates, and speed multipliers.
 * Each phase introduces new enemy types and increases difficulty.
 */

import { getI18n } from '../systems/i18n';

const i18n = getI18n();

export interface PhaseConfig {
  id: number;
  name: string;
  duration: number; // seconds (-1 = endless)
  enemies: string[]; // Enemy IDs from EnemiesConfig
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard' | 'extreme' | 'variable';
  speedMultiplier: number;
  spawnRate: number; // ms between enemy spawns
  background: string; // Hex color
  description: string;
}

/**
 * Phase Progression - Eagle of Fun v4.2
 * Balanced for 2-minute average runs
 */
export const PHASES: PhaseConfig[] = [
  // ========================================
  // PHASE 1: SOFT LAUNCH 🚀
  // Tutorial phase - easy enemies only
  // ========================================
  {
    id: 1,
    name: i18n.t('phase.softLaunch'),
    duration: 60, // 1 minute
    enemies: [
      'jeeter',      // Basic horizontal
      'paperHands'   // Fake coin drops
    ],
    difficulty: 'easy',
    speedMultiplier: 1.2,
    spawnRate: 5000, // 5 seconds between spawns
    background: '#FFFFFF',
    description: 'Get started, collect burgers! Easy enemies only.'
  },

  // ========================================
  // PHASE 2: PAPER PANIC 👋
  // Fake coins and traps introduced
  // ========================================
  {
    id: 2,
    name: i18n.t('phase.paperPanic'),
    duration: 60,
    enemies: [
      'jeeter',
      'paperHands',
      'redCandles',    // Vertical barriers
      'rugpullKevin'   // Bait and explode
    ],
    difficulty: 'medium',
    speedMultiplier: 1.4,
    spawnRate: 4500, // 4.5 seconds
    background: '#F0F8FF', // Alice Blue
    description: 'Watch out for fake coins and rugpulls! Traps everywhere.'
  },

  // ========================================
  // PHASE 3: CANDLE CRASH 📉
  // Chaos phase - horizontal waves
  // ========================================
  {
    id: 3,
    name: i18n.t('phase.candleCrash'),
    duration: 60,
    enemies: [
      'redCandles',
      'fudBot',      // Kamikaze rush
      'fourMeme',    // Fast horizontal
      'pumpFun'      // Zig-zag agile
    ],
    difficulty: 'hard',
    speedMultiplier: 1.6,
    spawnRate: 4000, // 4 seconds
    background: '#FFF5E6', // Seashell
    description: 'Chaos phase! Fast enemies and barriers everywhere.'
  },

  // ========================================
  // PHASE 4: REGULATION RUN 🧑‍💼
  // SEC + Market Manipulation
  // ========================================
  {
    id: 4,
    name: i18n.t('phase.regulationRun'),
    duration: 60,
    enemies: [
      'gary',              // SEC lawsuits
      'analystChad',       // Curved projectiles
      'moonChad',          // Diagonal rockets
      'whaleManipulator'   // Magnet pull
    ],
    difficulty: 'very_hard',
    speedMultiplier: 1.8,
    spawnRate: 3500, // 3.5 seconds
    background: '#FFF0E6', // Linen
    description: 'Lawsuit storm! SEC and whales manipulate the market.'
  },

  // ========================================
  // PHASE 5: BEAR MARKET FINALE 🐻
  // Boss + Chaos Mix
  // ========================================
  {
    id: 5,
    name: i18n.t('phase.bearMarket'),
    duration: 60,
    enemies: [
      'rektWizard',   // Chaos swaps
      'czBoss',       // Teleport boss
      'bearBoss',     // Heavy boss
      'whaleManipulator',
      'analystChad',
      'moonChad'
    ],
    difficulty: 'extreme',
    speedMultiplier: 2.0,
    spawnRate: 2500, // 2.5 seconds (fast!)
    background: '#FFE6E6', // Misty Rose
    description: 'Chaos + Boss fights! Only the strong survive.'
  },

  // ========================================
  // PHASE 6: WAGMI MODE 🦅
  // Endless endgame madness
  // ========================================
  {
    id: 6,
    name: i18n.t('phase.wagmi'),
    duration: -1, // Endless
    enemies: [
      // All enemies rotate
      'jeeter',
      'paperHands',
      'redCandles',
      'gary',
      'pumpFun',
      'fourMeme',
      'fudBot',
      'rugpullKevin',
      'analystChad',
      'rektWizard',
      'whaleManipulator',
      'moonChad',
      'bearBoss',
      'czBoss'
    ],
    difficulty: 'variable',
    speedMultiplier: 2.3,
    spawnRate: 1800, // 1.8 seconds (very fast!)
    background: '#FFE6F0', // Lavender Blush
    description: 'Endless fun, meme alerts & speed boosts! We\'re all gonna make it!'
  }
];

/**
 * Get phase by ID
 */
export function getPhase(phaseId: number): PhaseConfig | undefined {
  return PHASES.find(phase => phase.id === phaseId);
}

/**
 * Get current phase based on elapsed time
 */
export function getCurrentPhase(totalElapsedSeconds: number): PhaseConfig {
  let accumulatedTime = 0;

  for (const phase of PHASES) {
    if (phase.duration === -1) {
      // Endless phase - return this
      return phase;
    }

    accumulatedTime += phase.duration;

    if (totalElapsedSeconds < accumulatedTime) {
      return phase;
    }
  }

  // Default to last phase (WAGMI Mode)
  return PHASES[PHASES.length - 1];
}

/**
 * Get remaining time in current phase
 */
export function getPhaseRemainingTime(totalElapsedSeconds: number): number {
  let accumulatedTime = 0;

  for (const phase of PHASES) {
    if (phase.duration === -1) {
      return -1; // Endless
    }

    const phaseEndTime = accumulatedTime + phase.duration;

    if (totalElapsedSeconds < phaseEndTime) {
      return phaseEndTime - totalElapsedSeconds;
    }

    accumulatedTime = phaseEndTime;
  }

  return -1; // Endless
}

/**
 * Get total number of phases
 */
export const TOTAL_PHASES = PHASES.length;

/**
 * Enemy distribution per phase (for balancing)
 */
export const PHASE_ENEMY_COUNTS = PHASES.map(phase => ({
  phaseId: phase.id,
  phaseName: phase.name,
  enemyCount: phase.enemies.length,
  spawnRate: phase.spawnRate
}));

/**
 * Phase transition messages (for UI notifications)
 */
export const PHASE_TRANSITION_MESSAGES: Record<number, string> = {
  1: 'Welcome to America.Fun! 🦅',
  2: 'Paper hands are panicking! 👋',
  3: 'Red candles everywhere! 📉',
  4: 'Gary is coming for you! 🧑‍💼',
  5: 'Bear market finale! Survive! 🐻',
  6: 'WAGMI MODE! You made it! 🦅'
};
