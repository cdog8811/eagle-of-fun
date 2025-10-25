/**
 * Difficulty Configuration v3.8
 *
 * Adaptive difficulty scaling over time
 */

// ========== HP SCALING ==========
export const HP_SCALING = {
  interval: 30,           // Every 30 seconds
  increase: 1.06,         // +6% per interval
  maxMultiplier: 2.2      // Cap at 220% of base HP
} as const;

/**
 * Calculate HP multiplier based on game time
 */
export function calculateHPMultiplier(secondsElapsed: number): number {
  const intervals = Math.floor(secondsElapsed / HP_SCALING.interval);
  const multiplier = Math.pow(HP_SCALING.increase, intervals);
  return Math.min(multiplier, HP_SCALING.maxMultiplier);
}

// ========== SPAWN RATE SCALING ==========
export const SPAWN_RATE_SCALING = {
  spawnRateDecreaseInterval: 60,  // Every 60 seconds
  spawnRateDecrease: 0.98,        // -2% spawn delay (faster spawns)
  minSpawnRateMultiplier: 0.5,    // Cap at 50% of base delay

  eliteIncreaseInterval: 60,      // Every 60 seconds
  eliteIncrease: 0.04,            // +4% elite chance
  maxEliteChance: 0.5             // Cap at 50% elite chance
} as const;

/**
 * Calculate spawn rate multiplier
 * Lower = faster spawns (shorter delay between spawns)
 */
export function calculateSpawnRateMultiplier(secondsElapsed: number): number {
  const intervals = Math.floor(secondsElapsed / SPAWN_RATE_SCALING.spawnRateDecreaseInterval);
  const multiplier = Math.pow(SPAWN_RATE_SCALING.spawnRateDecrease, intervals);
  return Math.max(multiplier, SPAWN_RATE_SCALING.minSpawnRateMultiplier);
}

/**
 * Calculate elite spawn chance
 * Returns value between 0 and 1
 */
export function calculateEliteChance(secondsElapsed: number, baseChance: number): number {
  const intervals = Math.floor(secondsElapsed / SPAWN_RATE_SCALING.eliteIncreaseInterval);
  const increase = intervals * SPAWN_RATE_SCALING.eliteIncrease;
  const chance = baseChance + increase;
  return Math.min(chance, SPAWN_RATE_SCALING.maxEliteChance);
}

// ========== PHASE DIFFICULTY ==========
export interface PhaseDifficulty {
  phase: number;
  name: string;
  scoreThreshold: number;
  duration: number;         // seconds

  // Enemy spawning
  baseSpawnRate: number;    // ms between spawns
  maxEnemiesOnScreen: number;

  // Difficulty modifiers
  hpMultiplier: number;
  speedMultiplier: number;
  damageMultiplier: number;
}

export const PHASE_DIFFICULTIES: PhaseDifficulty[] = [
  {
    phase: 1,
    name: 'Introduction',
    scoreThreshold: 0,
    duration: 30,
    baseSpawnRate: 2000,
    maxEnemiesOnScreen: 5,
    hpMultiplier: 1.0,
    speedMultiplier: 1.0,
    damageMultiplier: 1.0
  },
  {
    phase: 2,
    name: 'Ramp Up',
    scoreThreshold: 500,
    duration: 40,
    baseSpawnRate: 1800,
    maxEnemiesOnScreen: 7,
    hpMultiplier: 1.1,
    speedMultiplier: 1.05,
    damageMultiplier: 1.0
  },
  {
    phase: 3,
    name: 'Mid Game',
    scoreThreshold: 1500,
    duration: 50,
    baseSpawnRate: 1500,
    maxEnemiesOnScreen: 9,
    hpMultiplier: 1.2,
    speedMultiplier: 1.1,
    damageMultiplier: 1.0
  },
  {
    phase: 4,
    name: 'High Stakes',
    scoreThreshold: 3000,
    duration: 60,
    baseSpawnRate: 1200,
    maxEnemiesOnScreen: 12,
    hpMultiplier: 1.3,
    speedMultiplier: 1.15,
    damageMultiplier: 1.0
  },
  {
    phase: 5,
    name: 'Endless',
    scoreThreshold: 5000,
    duration: 0, // Infinite
    baseSpawnRate: 1000,
    maxEnemiesOnScreen: 15,
    hpMultiplier: 1.4,
    speedMultiplier: 1.2,
    damageMultiplier: 1.0
  }
];

/**
 * Get current phase based on score
 */
export function getCurrentPhase(score: number): PhaseDifficulty {
  for (let i = PHASE_DIFFICULTIES.length - 1; i >= 0; i--) {
    if (score >= PHASE_DIFFICULTIES[i].scoreThreshold) {
      return PHASE_DIFFICULTIES[i];
    }
  }
  return PHASE_DIFFICULTIES[0];
}

// ========== MARKET PHASE MODIFIERS ==========
export interface MarketPhaseModifier {
  coinSpawnMod: number;
  enemySpawnMod: number;
  speedMod: number;
  specialRules?: {
    disableSnipers?: boolean;
    increaseDronelings?: boolean;
    increaseShielded?: boolean;
    bossChanceBonus?: number;
  };
}

export const MARKET_PHASE_MODIFIERS: Record<string, MarketPhaseModifier> = {
  BULL_RUN: {
    coinSpawnMod: 1.6,
    enemySpawnMod: 0.8,
    speedMod: 1.0,
    specialRules: {
      disableSnipers: true
    }
  },

  CORRECTION: {
    coinSpawnMod: 1.0,
    enemySpawnMod: 1.0,
    speedMod: 1.0
  },

  BEAR_TRAP: {
    coinSpawnMod: 0.7,
    enemySpawnMod: 1.3,
    speedMod: 0.9,
    specialRules: {
      increaseShielded: true
    }
  },

  SIDEWAYS: {
    coinSpawnMod: 1.0,
    enemySpawnMod: 1.0,
    speedMod: 1.0,
    specialRules: {
      increaseDronelings: true
    }
  },

  VALOR_COMEBACK: {
    coinSpawnMod: 2.0,
    enemySpawnMod: 0.6,
    speedMod: 1.1,
    specialRules: {
      bossChanceBonus: 0.05 // +5% boss chance
    }
  },

  ENDLESS_WAGMI: {
    coinSpawnMod: 1.2,
    enemySpawnMod: 1.5,
    speedMod: 1.3
  }
};

/**
 * Get market phase modifier
 */
export function getMarketPhaseModifier(marketPhase: string): MarketPhaseModifier {
  return MARKET_PHASE_MODIFIERS[marketPhase] || MARKET_PHASE_MODIFIERS.CORRECTION;
}

// ========== DIFFICULTY BALANCE ==========
/**
 * Calculate final enemy stats based on all modifiers
 */
export interface FinalEnemyStats {
  hp: number;
  speed: number;
  damage: number;
}

export function calculateFinalEnemyStats(
  baseHp: number,
  baseSpeed: number,
  baseDamage: number,
  phaseIndex: number,
  secondsElapsed: number
): FinalEnemyStats {
  const phase = PHASE_DIFFICULTIES[phaseIndex] || PHASE_DIFFICULTIES[0];
  const hpMult = calculateHPMultiplier(secondsElapsed);

  return {
    hp: Math.floor(baseHp * phase.hpMultiplier * hpMult),
    speed: baseSpeed * phase.speedMultiplier,
    damage: baseDamage * phase.damageMultiplier
  };
}
