/**
 * Enemies Configuration v3.8
 *
 * Defines all enemy types with stats, behavior, and loot
 */

export interface EnemyDef {
  id: string;
  name: string;
  sprite: string;

  // Stats
  hp: number;
  speed: number;
  damage: number;
  points: number;
  xpReward: number;

  // Behavior
  aiType: 'basic' | 'sniper' | 'swarm' | 'shielded' | 'exploder';
  spawnWeight: number; // Relative probability (higher = more common)

  // Loot
  drops: {
    bonk?: number;    // % chance (0-100)
    aol?: number;
    burger?: number;
    bandana?: number;
  };

  // Special properties
  special?: {
    shieldDirection?: 'front' | 'back' | 'top' | 'bottom';
    explosionRadius?: number;
    explosionDamage?: number;
    projectileType?: string;
    groupSize?: number; // For swarm enemies
  };
}

export const ENEMY_TYPES: Record<string, EnemyDef> = {
  // Basic - Classic enemy from current game
  gary: {
    id: 'gary',
    name: 'Gary (Basic)',
    sprite: 'gary',
    hp: 50,
    speed: 200,
    damage: 1,
    points: 12,
    xpReward: 10,
    aiType: 'basic',
    spawnWeight: 40,
    drops: {
      bonk: 30,
      aol: 10
    }
  },

  // Fast - SEC Guy from current game
  secguy: {
    id: 'secguy',
    name: 'SEC Guy (Fast)',
    sprite: 'sec-guy',
    hp: 75,
    speed: 300,
    damage: 1,
    points: 16,
    xpReward: 15,
    aiType: 'basic',
    spawnWeight: 25,
    drops: {
      bonk: 25,
      aol: 15
    }
  },

  // NEW: Sniper "HawkEye"
  hawkeye: {
    id: 'hawkeye',
    name: 'HawkEye (Sniper)',
    sprite: 'hawkeye',
    hp: 60,
    speed: 120,
    damage: 2,
    points: 20,
    xpReward: 18,
    aiType: 'sniper',
    spawnWeight: 15,
    drops: {
      aol: 40,
      burger: 5
    },
    special: {
      projectileType: 'laser'
    }
  },

  // NEW: Swarm "Dronelings"
  droneling: {
    id: 'droneling',
    name: 'Droneling (Swarm)',
    sprite: 'droneling',
    hp: 20,
    speed: 280,
    damage: 1,
    points: 8,
    xpReward: 5,
    aiType: 'swarm',
    spawnWeight: 20, // Spawns in groups
    drops: {
      bonk: 50
    },
    special: {
      groupSize: 5 // Spawns 5 at once in V-formation
    }
  },

  // NEW: Shielded "Custodian"
  custodian: {
    id: 'custodian',
    name: 'Custodian (Shielded)',
    sprite: 'custodian',
    hp: 140,
    speed: 160,
    damage: 1,
    points: 22,
    xpReward: 25,
    aiType: 'shielded',
    spawnWeight: 12,
    drops: {
      aol: 30,
      burger: 10,
      bandana: 2
    },
    special: {
      shieldDirection: 'front' // Only vulnerable from top/bottom
    }
  },

  // NEW: Exploder "FireCracker"
  firecracker: {
    id: 'firecracker',
    name: 'FireCracker (Exploder)',
    sprite: 'firecracker',
    hp: 40,
    speed: 220,
    damage: 1,
    points: 18,
    xpReward: 12,
    aiType: 'exploder',
    spawnWeight: 18,
    drops: {
      bonk: 20
    },
    special: {
      explosionRadius: 80, // pixels
      explosionDamage: 1,
      projectileType: 'splinter' // 6 splinters on death
    }
  },

  // Elite enemies (from current game)
  sbf: {
    id: 'sbf',
    name: 'SBF (Tank)',
    sprite: 'sbf',
    hp: 150,
    speed: 150,
    damage: 2,
    points: 25,
    xpReward: 25,
    aiType: 'basic',
    spawnWeight: 8,
    drops: {
      aol: 35,
      burger: 15
    }
  },

  dokwon: {
    id: 'dokwon',
    name: 'Do Kwon (Elite)',
    sprite: 'do-kwon',
    hp: 200,
    speed: 250,
    damage: 2,
    points: 35,
    xpReward: 50,
    aiType: 'basic',
    spawnWeight: 5,
    drops: {
      aol: 40,
      burger: 20,
      bandana: 3
    }
  },

  cz: {
    id: 'cz',
    name: 'CZ (Boss-tier)',
    sprite: 'cz',
    hp: 300,
    speed: 200,
    damage: 2,
    points: 50,
    xpReward: 100,
    aiType: 'basic',
    spawnWeight: 2,
    drops: {
      aol: 50,
      burger: 30,
      bandana: 5
    }
  }
};

/**
 * Phase-based enemy spawn pools
 * Each phase has different enemy mix
 */
export interface PhaseSpawnPool {
  phase: number;
  minScore: number;
  enemies: string[]; // Enemy IDs that can spawn
  eliteChance: number; // % chance for elite spawn (0-100)
}

export const PHASE_SPAWN_POOLS: PhaseSpawnPool[] = [
  {
    phase: 1,
    minScore: 0,
    enemies: ['gary', 'droneling'],
    eliteChance: 0
  },
  {
    phase: 2,
    minScore: 500,
    enemies: ['gary', 'secguy', 'droneling', 'firecracker'],
    eliteChance: 5
  },
  {
    phase: 3,
    minScore: 1500,
    enemies: ['gary', 'secguy', 'hawkeye', 'droneling', 'firecracker', 'sbf'],
    eliteChance: 10
  },
  {
    phase: 4,
    minScore: 3000,
    enemies: ['gary', 'secguy', 'hawkeye', 'custodian', 'firecracker', 'sbf', 'dokwon'],
    eliteChance: 15
  },
  {
    phase: 5,
    minScore: 5000,
    enemies: ['secguy', 'hawkeye', 'custodian', 'firecracker', 'sbf', 'dokwon', 'cz'],
    eliteChance: 20
  }
];

/**
 * Get enemy definition by ID
 */
export function getEnemyDef(id: string): EnemyDef | undefined {
  return ENEMY_TYPES[id];
}

/**
 * Get spawn pool for current phase/score
 */
export function getSpawnPool(score: number): PhaseSpawnPool {
  // Find highest phase that player qualifies for
  for (let i = PHASE_SPAWN_POOLS.length - 1; i >= 0; i--) {
    if (score >= PHASE_SPAWN_POOLS[i].minScore) {
      return PHASE_SPAWN_POOLS[i];
    }
  }
  return PHASE_SPAWN_POOLS[0];
}

/**
 * Get spawn pool enemy IDs for a specific phase number
 */
export function getPhaseSpawnPool(phase: number): string[] {
  // Find pool for this phase
  const pool = PHASE_SPAWN_POOLS.find(p => p.phase === phase);
  if (!pool) {
    // Default to phase 1
    return PHASE_SPAWN_POOLS[0].enemies;
  }
  return pool.enemies;
}
