// ============================
// Eagle of Fun - Upgrade System
// Player stats, upgrades, costs, caps
// ============================

import { GameConfig } from '../config/GameConfig';
import { Storage, LS_KEYS } from './storage';
import type { XPState } from './xpSystem';

export type UpgradeId =
  | 'wing_strength'
  | 'magnet_range'
  | 'shield_duration'
  | 'blaster_cooldown'
  | 'valor_cooldown'
  | 'extra_heart'
  | 'coin_gain'
  | 'glide_efficiency'
  | 'buyback_radius'
  | 'burger_duration';

export interface PlayerStats {
  flapBoost: number;          // +% on flap velocity/accel
  magnetRadius: number;       // px bonus
  shieldExtraSeconds: number; // +s
  blasterCDMul: number;       // multiplicative <1 is faster
  valorCDMinus: number;       // -seconds from base 60s
  maxHeartsBonus: number;     // +hearts (cap 5 total)
  coinGainMul: number;        // x1.0..x1.25
  glideGravityMul: number;    // e.g. 0.85 instead of 1.0
  buybackRadiusBonus: number; // +px
  burgerDurationBonus: number;// +s
}

export const defaultStats: PlayerStats = {
  flapBoost: 0,
  magnetRadius: 0,
  shieldExtraSeconds: 0,
  blasterCDMul: 1.0,
  valorCDMinus: 0,
  maxHeartsBonus: 0,
  coinGainMul: 1.0,
  glideGravityMul: 1.0,
  buybackRadiusBonus: 0,
  burgerDurationBonus: 0,
};

export interface UpgradeDef {
  id: UpgradeId;
  name: string;
  desc: string;
  maxLevel: number;
  baseCost: number;   // in XP
  costGrowth: number; // multiplicative
  apply: (level: number, stats: PlayerStats) => PlayerStats;
  requiresLevel?: number; // min player level
}

export interface UpgradesState {
  levels: Record<UpgradeId, number>;
}

function getDefaultUpgradesState(): UpgradesState {
  return {
    levels: {
      wing_strength: 0,
      magnet_range: 0,
      shield_duration: 0,
      blaster_cooldown: 0,
      valor_cooldown: 0,
      extra_heart: 0,
      coin_gain: 0,
      glide_efficiency: 0,
      buyback_radius: 0,
      burger_duration: 0,
    }
  };
}

// Upgrade definitions
// v4.2: Reduced costs by ~40% for better progression feel
const UPGRADE_DEFS: UpgradeDef[] = [
  {
    id: 'wing_strength',
    name: 'Wing Strength',
    desc: 'Stronger flaps for better control',
    maxLevel: 10,
    baseCost: 1500,     // Reduced from 2500
    costGrowth: 1.5,    // Reduced from 1.6
    apply: (level, stats) => ({
      ...stats,
      flapBoost: stats.flapBoost + (level * 0.02) // +2% per level
    })
  },
  {
    id: 'magnet_range',
    name: 'Magnet Range',
    desc: 'Pull coins from farther away',
    maxLevel: 8,
    baseCost: 2400,     // Reduced from 4000
    costGrowth: 1.5,    // Reduced from 1.6
    apply: (level, stats) => ({
      ...stats,
      magnetRadius: stats.magnetRadius + (level * 25) // +25px per level
    })
  },
  {
    id: 'shield_duration',
    name: 'Shield Duration',
    desc: 'America Hat protection lasts longer',
    maxLevel: 5,
    baseCost: 3000,     // Reduced from 5000
    costGrowth: 1.55,   // Reduced from 1.65
    apply: (level, stats) => ({
      ...stats,
      shieldExtraSeconds: stats.shieldExtraSeconds + level // +1s per level
    })
  },
  {
    id: 'blaster_cooldown',
    name: 'Blaster Cooldown',
    desc: 'Fire your blaster more frequently',
    maxLevel: 7,
    baseCost: 3600,     // Reduced from 6000
    costGrowth: 1.55,   // Reduced from 1.65
    apply: (level, stats) => ({
      ...stats,
      // v3.9.2 CRITICAL FIX: Use defaultStats.blasterCDMul (1.0) not stats.blasterCDMul!
      // BEFORE: stats.blasterCDMul * 0.9^level → ACCUMULATES wrongly!
      // AFTER: 1.0 * 0.9^level → Correct calculation
      blasterCDMul: defaultStats.blasterCDMul * Math.pow(0.9, level) // -10% per level
    })
  },
  {
    id: 'valor_cooldown',
    name: 'Valor Cooldown',
    desc: 'Use VALOR mode more often',
    maxLevel: 5,
    baseCost: 6000,     // Reduced from 10000
    costGrowth: 1.6,    // Reduced from 1.7
    apply: (level, stats) => ({
      ...stats,
      valorCDMinus: stats.valorCDMinus + (level * 6) // -6s per level
    }),
    requiresLevel: 5
  },
  {
    id: 'extra_heart',
    name: 'Extra Heart',
    desc: 'Increase maximum health',
    maxLevel: 2,
    baseCost: 9000,     // Reduced from 15000
    costGrowth: 1.8,    // Reduced from 2.0
    apply: (level, stats) => ({
      ...stats,
      maxHeartsBonus: stats.maxHeartsBonus + level // +1 heart per level
    }),
    requiresLevel: 3
  },
  {
    id: 'coin_gain',
    name: 'Coin Value',
    desc: 'Earn more XP from coins',
    maxLevel: 5,
    baseCost: 4500,     // Reduced from 7500
    costGrowth: 1.5,    // Reduced from 1.6
    apply: (level, stats) => ({
      ...stats,
      coinGainMul: stats.coinGainMul + (level * 0.05) // +5% per level
    })
  },
  {
    id: 'glide_efficiency',
    name: 'Glide Efficiency',
    desc: 'Float more gracefully',
    maxLevel: 5,
    baseCost: 3000,     // Reduced from 5000
    costGrowth: 1.5,    // Reduced from 1.6
    apply: (level, stats) => ({
      ...stats,
      // v3.9.2 CRITICAL FIX: Use defaultStats.glideGravityMul (1.0) not stats.glideGravityMul!
      // BEFORE: stats.glideGravityMul * 0.95^level → ACCUMULATES wrongly!
      // AFTER: 1.0 * 0.95^level → Correct calculation
      glideGravityMul: defaultStats.glideGravityMul * Math.pow(0.95, level) // -5% gravity per level
    })
  },
  {
    id: 'buyback_radius',
    name: 'Buyback Radius',
    desc: 'Magnet effect has wider range',
    maxLevel: 6,
    baseCost: 3600,     // Reduced from 6000
    costGrowth: 1.5,    // Reduced from 1.6
    apply: (level, stats) => ({
      ...stats,
      buybackRadiusBonus: stats.buybackRadiusBonus + (level * 30) // +30px per level
    })
  },
  {
    id: 'burger_duration',
    name: 'Burger Duration',
    desc: 'Burger multiplier lasts longer',
    maxLevel: 4,
    baseCost: 4200,     // Reduced from 7000
    costGrowth: 1.5,    // Reduced from 1.6
    apply: (level, stats) => ({
      ...stats,
      burgerDurationBonus: stats.burgerDurationBonus + (level * 0.75) // +0.75s per level
    })
  }
];

export interface UpgradeAPI {
  getState(): UpgradesState;
  getPlayerStats(): PlayerStats;
  getDefs(): UpgradeDef[];
  getCost(id: UpgradeId, nextLevel: number): number;
  canBuy(id: UpgradeId, xpState: XPState): { ok: boolean; reason?: string };
  canBuyWithScore(id: UpgradeId, currentScore: number): { ok: boolean; reason?: string }; // NEW: Score-based
  buy(id: UpgradeId, spendXP: (amount: number) => boolean): boolean;
  buyWithScore(id: UpgradeId, currentScore: number): { success: boolean; newScore: number }; // NEW: Score-based
  resetAll(): void;
}

class UpgradeSystemImpl implements UpgradeAPI {
  private state: UpgradesState;
  // v3.9.2 CRITICAL PERFORMANCE: Cache calculated stats to avoid recalculating every frame!
  private cachedStats: PlayerStats | null = null;
  private cacheInvalidated: boolean = true;

  constructor() {
    this.state = Storage.load<UpgradesState>(LS_KEYS.UPGRADES, getDefaultUpgradesState());
    console.log('Upgrade System initialized:', this.state);
  }

  getState(): UpgradesState {
    return { ...this.state, levels: { ...this.state.levels } };
  }

  getPlayerStats(): PlayerStats {
    // FEATURE FLAG: If upgrade system is disabled, always return default stats
    if (!GameConfig.ENABLE_UPGRADE_SYSTEM) {
      return { ...defaultStats };
    }

    // v3.9.2 CRITICAL PERFORMANCE FIX: Return cached stats if available
    if (!this.cacheInvalidated && this.cachedStats) {
      return this.cachedStats;
    }

    // v3.9.2 DEBUG: Stats recalculation (logging disabled to prevent slowdown)
    // console.log('⚡ Recalculating player stats (cache miss)');

    // Recalculate stats
    let stats = { ...defaultStats };

    // Apply each upgrade
    UPGRADE_DEFS.forEach(def => {
      const level = this.state.levels[def.id] || 0;
      if (level > 0) {
        // console.log(`  - ${def.id} level ${level}`); // DISABLED: Causes slowdown
        stats = def.apply(level, stats);
      }
    });

    // Apply caps
    stats.maxHeartsBonus = Math.min(stats.maxHeartsBonus, 2); // max +2 hearts (total 5)
    stats.coinGainMul = Math.min(stats.coinGainMul, 1.25);
    stats.glideGravityMul = Math.max(stats.glideGravityMul, 0.6);
    stats.blasterCDMul = Math.max(stats.blasterCDMul, 0.4);

    // Cache the result
    this.cachedStats = stats;
    this.cacheInvalidated = false;

    // console.log('  - Final stats:', stats); // DISABLED: Causes slowdown

    return stats;
  }

  getDefs(): UpgradeDef[] {
    return [...UPGRADE_DEFS];
  }

  getCost(id: UpgradeId, nextLevel: number): number {
    const def = UPGRADE_DEFS.find(d => d.id === id);
    if (!def) return 0;

    return Math.floor(def.baseCost * Math.pow(def.costGrowth, nextLevel - 1));
  }

  canBuy(id: UpgradeId, xpState: XPState): { ok: boolean; reason?: string } {
    const def = UPGRADE_DEFS.find(d => d.id === id);
    if (!def) {
      return { ok: false, reason: 'Unknown upgrade' };
    }

    const currentLevel = this.state.levels[id] || 0;

    // Check max level
    if (currentLevel >= def.maxLevel) {
      return { ok: false, reason: 'Max level reached' };
    }

    // Check player level requirement
    if (def.requiresLevel && xpState.level < def.requiresLevel) {
      return { ok: false, reason: `Requires player level ${def.requiresLevel}` };
    }

    // Check cost
    const cost = this.getCost(id, currentLevel + 1);
    if (xpState.totalXP < cost) {
      return { ok: false, reason: 'Not enough XP' };
    }

    return { ok: true };
  }

  buy(id: UpgradeId, spendXP: (amount: number) => boolean): boolean {
    const currentLevel = this.state.levels[id] || 0;
    const cost = this.getCost(id, currentLevel + 1);

    // Try to spend XP
    if (!spendXP(cost)) {
      return false;
    }

    // Upgrade successful
    this.state.levels[id] = currentLevel + 1;
    this.saveState();

    // v3.9.2 CRITICAL: Invalidate cache when upgrade purchased!
    this.cacheInvalidated = true;

    console.log(`Upgraded ${id} to level ${this.state.levels[id]} (cost: ${cost} XP)`);
    return true;
  }

  // NEW: Score-based upgrade checking (no XP required)
  canBuyWithScore(id: UpgradeId, currentScore: number): { ok: boolean; reason?: string } {
    const def = UPGRADE_DEFS.find(d => d.id === id);
    if (!def) {
      return { ok: false, reason: 'Unknown upgrade' };
    }

    const currentLevel = this.state.levels[id] || 0;

    // Check max level
    if (currentLevel >= def.maxLevel) {
      return { ok: false, reason: 'Max level reached' };
    }

    // Check cost (score-based: cost is same formula but interpreted as score)
    const cost = this.getCost(id, currentLevel + 1);
    if (currentScore < cost) {
      return { ok: false, reason: 'Not enough Score' };
    }

    return { ok: true };
  }

  // NEW: Buy upgrade with score (returns remaining score)
  buyWithScore(id: UpgradeId, currentScore: number): { success: boolean; newScore: number } {
    const check = this.canBuyWithScore(id, currentScore);
    if (!check.ok) {
      return { success: false, newScore: currentScore };
    }

    const currentLevel = this.state.levels[id] || 0;
    const cost = this.getCost(id, currentLevel + 1);

    // Deduct score
    const newScore = currentScore - cost;

    // Upgrade successful
    this.state.levels[id] = currentLevel + 1;
    this.saveState();

    // v3.9.2 CRITICAL: Invalidate cache when upgrade purchased!
    this.cacheInvalidated = true;

    console.log(`Upgraded ${id} to level ${this.state.levels[id]} (cost: ${cost} Score, remaining: ${newScore})`);
    return { success: true, newScore };
  }

  resetAll(): void {
    this.state = getDefaultUpgradesState();
    this.saveState();
    console.log('All upgrades reset');
  }

  private saveState(): void {
    Storage.save(LS_KEYS.UPGRADES, this.state);
  }
}

// Singleton
let upgradeSystemInstance: UpgradeSystemImpl | null = null;

export function getUpgradeSystem(): UpgradeAPI {
  if (!upgradeSystemInstance) {
    upgradeSystemInstance = new UpgradeSystemImpl();
  }
  return upgradeSystemInstance;
}
