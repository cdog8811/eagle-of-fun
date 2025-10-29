/**
 * CombosConfig.ts
 * Eagle of Fun v4.2 - Power-Up Combo System
 *
 * Defines synergistic combos when multiple power-ups are active simultaneously.
 * Displays on-screen notifications and applies special effects.
 */

export type ComboTrigger = string[]; // Array of power-up IDs that must be active

export interface ComboConfig {
  id: string;
  name: string;
  trigger: ComboTrigger; // Power-up IDs that must be active (e.g., ['cryptoActing', 'valorMode'])
  effect: string; // Effect description
  message: string; // Display message
  icon: string;
  // Effect multipliers and flags
  scoreMultiplier?: number;
  xpMultiplier?: number;
  timeFreezeSeconds?: number;
  autoCollectCoins?: boolean;
  invincible?: boolean;
  freezeEnemies?: boolean;
  clearEnemies?: boolean;
  stopEnemySpawns?: boolean;
}

/**
 * Combo Definitions - Eagle of Fun v4.2
 * 5 powerful synergies for advanced gameplay
 */
export const COMBOS: Record<string, ComboConfig> = {
  // ========================================
  // COMBO 1: PERFECT ENTRY
  // CryptoActing + VALOR Mode
  // ========================================
  perfectEntry: {
    id: 'perfectEntry',
    name: 'Perfect Entry',
    trigger: ['cryptoActing', 'valorMode'],
    effect: '6× score multiplier - Ultimate risk/reward!',
    message: 'Perfect Entry! Market explodes! 🚀💎',
    icon: '🕶️🦾',
    scoreMultiplier: 6, // CryptoActing (3×) + VALOR (2×) = 6×
    invincible: true
  },

  // ========================================
  // COMBO 2: BUYBACK PROTOCOL
  // Danxx + Belle Mod
  // ========================================
  buybackProtocol: {
    id: 'buybackProtocol',
    name: 'Buyback Protocol',
    trigger: ['danxxProtocol', 'belleMod'],
    effect: 'Time freeze + 0 enemy spawns for 3 seconds',
    message: 'Danxx stabilized the chain! 🧱👁️',
    icon: '🧱👁️',
    timeFreezeSeconds: 3,
    stopEnemySpawns: true,
    invincible: true
  },

  // ========================================
  // COMBO 3: MUTED & NUKED
  // Rose Mod Mode + Freedom Strike
  // ========================================
  mutedAndNuked: {
    id: 'mutedAndNuked',
    name: 'Muted & Nuked',
    trigger: ['roseModMode', 'freedomStrike'],
    effect: 'Freeze all enemies + Lightning clear',
    message: 'Muted and nuked! 🌹⚡',
    icon: '🌹⚡',
    freezeEnemies: true,
    clearEnemies: true
  },

  // ========================================
  // COMBO 4: LIQUIDITY FLOOD
  // Burger + Buyback Mode
  // ========================================
  liquidityFlood: {
    id: 'liquidityFlood',
    name: 'Liquidity Flood',
    trigger: ['burgerMultiplier', 'buybackMode'],
    effect: 'Auto-collect coins + 2× multiplier',
    message: 'Liquidity Flood! 🍔🧲',
    icon: '🍔🧲',
    scoreMultiplier: 2,
    autoCollectCoins: true
  },

  // ========================================
  // COMBO 5: AMERICA ASCENDS
  // Belle Mod + VALOR Mode
  // ========================================
  americaAscends: {
    id: 'americaAscends',
    name: 'America Ascends',
    trigger: ['belleMod', 'valorMode'],
    effect: 'Invincible + glow + XP ×3',
    message: 'America Ascends! 🦅👁️',
    icon: '👁️🦾',
    xpMultiplier: 3,
    invincible: true
  }
};

/**
 * Check if a combo is active based on current power-up states
 * @param activePowerUps - Array of currently active power-up IDs
 * @returns Array of active combo IDs
 */
export function getActiveCombos(activePowerUps: string[]): string[] {
  const activeCombos: string[] = [];

  for (const comboId in COMBOS) {
    const combo = COMBOS[comboId];
    const allTriggersActive = combo.trigger.every(triggerId =>
      activePowerUps.includes(triggerId)
    );

    if (allTriggersActive) {
      activeCombos.push(comboId);
    }
  }

  return activeCombos;
}

/**
 * Get combo by ID
 */
export function getCombo(comboId: string): ComboConfig | undefined {
  return COMBOS[comboId];
}

/**
 * Calculate total score multiplier from all active combos
 */
export function getTotalScoreMultiplier(activeCombos: string[]): number {
  let multiplier = 1;

  for (const comboId of activeCombos) {
    const combo = COMBOS[comboId];
    if (combo?.scoreMultiplier) {
      multiplier *= combo.scoreMultiplier;
    }
  }

  return multiplier;
}

/**
 * Calculate total XP multiplier from all active combos
 */
export function getTotalXPMultiplier(activeCombos: string[]): number {
  let multiplier = 1;

  for (const comboId of activeCombos) {
    const combo = COMBOS[comboId];
    if (combo?.xpMultiplier) {
      multiplier *= combo.xpMultiplier;
    }
  }

  return multiplier;
}

/**
 * Check if player is invincible from any combo
 */
export function isInvincibleFromCombo(activeCombos: string[]): boolean {
  return activeCombos.some(comboId => COMBOS[comboId]?.invincible);
}

/**
 * Export all combo IDs for easy reference
 */
export const COMBO_IDS = Object.keys(COMBOS);

/**
 * Power-Up ID mappings (for reference)
 * These should match the actual power-up IDs used in GameScene.ts
 */
export const POWER_UP_MAPPINGS = {
  cryptoActing: 'cryptoActingActive',
  valorMode: 'valorModeActive',
  danxxProtocol: 'danxxProtocolActive',
  belleMod: 'belleModActive',
  roseModMode: 'roseModModeActive',
  freedomStrike: 'freedomStrikeActive',
  burgerMultiplier: 'burgerMultiplierActive',
  buybackMode: 'magnetActive' // Buyback Mode = Magnet Active
};

/**
 * Combo notification durations (ms)
 */
export const COMBO_NOTIFICATION_DURATION = 3000; // 3 seconds
export const COMBO_EFFECT_LINGER_TIME = 500; // 0.5 seconds after power-ups end
