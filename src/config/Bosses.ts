/**
 * Bosses Configuration v3.8
 *
 * Defines boss encounters and mechanics
 */

export interface BossPhase {
  phaseNumber: number;
  name: string;
  hpThreshold: number;      // % of boss HP to trigger this phase (1.0 = 100%)
  duration?: number;         // Optional duration in seconds

  // Behavior
  attackPattern: string;
  movePattern: string;

  // Visual
  announcement: string;
  color: number;

  // Spawns
  addWaves?: {
    enemyType: string;
    count: number;
    interval: number;       // seconds between waves
  };
}

export interface BossDef {
  id: string;
  name: string;
  title: string;
  sprite: string;

  // Stats
  hp: number;
  speed: number;
  damage: number;

  // Trigger
  trigger: {
    type: 'score' | 'phase' | 'time';
    value: number;
  };

  // Phases
  phases: BossPhase[];

  // Rewards
  rewards: {
    xp: number;
    guaranteedDrops: string[];  // Item IDs
    cosmetics?: string[];        // Unlockable cosmetics
  };

  // Music
  musicTrack?: string;

  // Weakpoints
  weakpoints?: {
    location: 'top' | 'bottom' | 'back' | 'front';
    damageMultiplier: number;
  }[];
}

// ========== BOSS 1: BEAR OVERLORD CZ-9000 ==========
export const BOSS_CZ_9000: BossDef = {
  id: 'boss_cz_9000',
  name: 'CZ-9000',
  title: 'Bear Overlord',
  sprite: 'boss-cz',

  hp: 3000,
  speed: 150,
  damage: 2,

  trigger: {
    type: 'score',
    value: 30000  // v3.8: Boss spawns at 30k score milestone
  },

  phases: [
    {
      phaseNumber: 1,
      name: 'Shield Wall',
      hpThreshold: 1.0,
      announcement: '🐻 BOSS INCOMING: CZ-9000 BEAR OVERLORD',
      color: 0xFF0000,
      attackPattern: 'shield_rotation',
      movePattern: 'slow_horizontal',
      addWaves: {
        enemyType: 'gary',
        count: 3,
        interval: 15
      }
    },
    {
      phaseNumber: 2,
      name: 'Order Flood',
      hpThreshold: 0.7,
      announcement: '⚠️ PHASE 2: ORDER FLOOD',
      color: 0xFF6600,
      attackPattern: 'sniper_barrage',
      movePattern: 'aggressive_weave',
      addWaves: {
        enemyType: 'droneling',
        count: 5,
        interval: 12
      }
    },
    {
      phaseNumber: 3,
      name: 'Rage',
      hpThreshold: 0.4,
      announcement: '🔥 FINAL PHASE: RAGE MODE',
      color: 0xFF0000,
      attackPattern: 'laser_sweep',
      movePattern: 'fast_charge'
    }
  ],

  rewards: {
    xp: 500,
    guaranteedDrops: ['feather-gold'],
    cosmetics: ['banner_bear_slayer', 'trail_gold']
  },

  musicTrack: 'boss-theme',

  weakpoints: [
    {
      location: 'back',
      damageMultiplier: 2.0
    }
  ]
};

// ========== BOSS REGISTRY ==========
export const BOSSES: Record<string, BossDef> = {
  cz_9000: BOSS_CZ_9000
  // More bosses can be added here
};

/**
 * Get boss definition by ID
 */
export function getBossDef(id: string): BossDef | undefined {
  return BOSSES[id];
}

/**
 * Check if boss should spawn
 */
export function shouldSpawnBoss(score: number, phase: number, timeElapsed: number): BossDef | null {
  for (const boss of Object.values(BOSSES)) {
    switch (boss.trigger.type) {
      case 'score':
        if (score >= boss.trigger.value) {
          return boss;
        }
        break;
      case 'phase':
        if (phase >= boss.trigger.value) {
          return boss;
        }
        break;
      case 'time':
        if (timeElapsed >= boss.trigger.value) {
          return boss;
        }
        break;
    }
  }
  return null;
}

// ========== BOSS ATTACK PATTERNS ==========
export interface AttackPattern {
  id: string;
  description: string;
  telegraphDuration: number;  // Warning time in seconds
  executionDuration: number;  // Attack duration in seconds
  cooldown: number;           // Time before can repeat
}

export const BOSS_ATTACK_PATTERNS: Record<string, AttackPattern> = {
  shield_rotation: {
    id: 'shield_rotation',
    description: 'Meme barrage attack',
    telegraphDuration: 0,
    executionDuration: 1.0,
    cooldown: 3.0  // v3.8: Was 0 - caused performance issues! Fire every 3 seconds
  },

  sniper_barrage: {
    id: 'sniper_barrage',
    description: 'Fires 3 aimed shots at player position',
    telegraphDuration: 0.5,
    executionDuration: 2.0,
    cooldown: 4.0
  },

  laser_sweep: {
    id: 'laser_sweep',
    description: 'Sweeps laser across screen',
    telegraphDuration: 0.8,
    executionDuration: 1.5,
    cooldown: 6.0
  }
};

/**
 * Get attack pattern definition
 */
export function getAttackPattern(id: string): AttackPattern | undefined {
  return BOSS_ATTACK_PATTERNS[id];
}
