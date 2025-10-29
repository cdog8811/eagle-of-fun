/**
 * EnemiesConfig.ts
 * Eagle of Fun v4.2 - Enemy Configuration
 *
 * Defines all 14 enemies with balanced HP, behavior, and meme culture.
 * Removed: Solana Turtle and legacy enemies
 * Added: FUD Bot, Rugpull Rick, Analyst Chad, Rekt Wizard, Whale Manipulator, Moon Chad
 */

export type EnemyArchetype =
  | 'basic'      // Simple horizontal movement
  | 'trap'       // Drops fake coins or baits
  | 'static'     // Barriers, minimal movement
  | 'shooter'    // Fires projectiles
  | 'agile'      // Fast, zig-zag movement
  | 'kamikaze'   // Rushes player directly
  | 'chaos'      // Special mechanics (swap HP/score)
  | 'magnet'     // Pulls coins/enemies
  | 'boss';      // High HP, intimidating

export interface EnemyConfig {
  id: string;
  name: string;
  icon: string;
  archetype: EnemyArchetype;
  behavior: string;
  hp: number;
  speed: number;
  size: { width: number; height: number };
  sprite: string;
  scale: number;
  memePhrase: string;
  description: string;

  // Optional special properties
  fakeCoinPenalty?: number;
  controlBlockDuration?: number;
  throwInterval?: number;
  explosionRadius?: number;
  rushSpeed?: number;
  explosionDamage?: number;
  healRange?: number;
  magnetRadius?: number;
  projectileType?: string;
  fireRate?: number;
}

/**
 * Core Enemy Roster - Eagle of Fun v4.2
 * Total: 14 enemies (5 core + 9 new/reworked)
 */
export const ENEMIES: Record<string, EnemyConfig> = {
  // ========================================
  // CORE ENEMIES (KEEP FROM ORIGINAL)
  // ========================================

  jeeter: {
    id: 'jeeter',
    name: 'Jeeter Joe',
    icon: '👋',
    archetype: 'basic',
    behavior: 'horizontal',
    hp: 25,
    speed: 180,
    size: { width: 100, height: 100 },
    sprite: 'jeet',
    scale: 0.22,
    memePhrase: 'I sold the top!',
    description: 'Classic seller - horizontal movement'
  },

  paperHands: {
    id: 'paperHands',
    name: 'Paper Hands Pete',
    icon: '🤲',
    archetype: 'basic',
    behavior: 'horizontal',
    hp: 30,
    speed: 160,
    size: { width: 85, height: 85 },
    sprite: 'paper-hands',
    scale: 0.18,
    memePhrase: 'Nooo I panic sold!',
    description: 'Weak-handed seller - simple horizontal movement'
  },

  redCandles: {
    id: 'redCandles',
    name: 'Red Candles',
    icon: '📉',
    archetype: 'static',
    behavior: 'vertical_barrier',
    hp: 35,
    speed: 140,
    size: { width: 50, height: 150 },
    sprite: 'red-candles',
    scale: 0.25,
    memePhrase: 'Market Dump Incoming 🚨',
    description: 'Vertical barriers - chart crashes'
  },

  gary: {
    id: 'gary',
    name: 'Gary (SEC)',
    icon: '🧑‍💼',
    archetype: 'shooter',
    behavior: 'throws_papers',
    hp: 25,
    speed: 190,
    size: { width: 90, height: 100 },
    sprite: 'gary',
    scale: 0.22,
    memePhrase: 'Unregistered Security!',
    description: 'Throws lawsuit papers - control blocks player for 2s',
    controlBlockDuration: 2000,
    throwInterval: 2500
  },

  pumpFun: {
    id: 'pumpFun',
    name: 'Pump.fun',
    icon: '💎',
    archetype: 'agile',
    behavior: 'zigzag_fast',
    hp: 30,
    speed: 270,
    size: { width: 90, height: 90 },
    sprite: 'pumpfun',
    scale: 0.22,
    memePhrase: 'Pump it or dump it!',
    description: 'Competing memecoin platform - fast zig-zag'
  },

  // ========================================
  // REWORKED & NEW ENEMIES
  // ========================================

  fourMeme: {
    id: 'fourMeme',
    name: '4meme',
    icon: '🖐️',
    archetype: 'agile',
    behavior: 'horizontal_fast',
    hp: 28,
    speed: 260,
    size: { width: 95, height: 95 },
    sprite: 'fourmeme',
    scale: 0.20,
    memePhrase: '4meme > AOL 🖐️',
    description: 'Rival platform (CZ/Binance) - fast horizontal'
  },

  fudBot: {
    id: 'fudBot',
    name: 'FUD Bot v3000',
    icon: '🤖', // Robot emoji - perfect for spam bot!
    archetype: 'kamikaze',
    behavior: 'rush_player',
    hp: 20,
    speed: 400,
    size: { width: 75, height: 75 },
    sprite: 'emoji-robot', // v4.2: Uses emoji rendering
    scale: 1.0, // Not used for emoji sprites
    memePhrase: 'Buy $DOGE now!!!',
    description: 'Spam bot - rushes the player directly',
    rushSpeed: 600,
    explosionDamage: 1
  },

  rugpullKevin: {
    id: 'rugpullKevin',
    name: 'Rugpull Kevin',
    icon: '💰', // Money bag emoji
    archetype: 'trap',
    behavior: 'bait_and_explode',
    hp: 25,
    speed: 180,
    size: { width: 220, height: 220 }, // v4.2: Double size - very visible scammer!
    sprite: 'rugpull-kevin', // v4.2: Custom pixel art sprite
    scale: 0.50, // Double scale for double size
    memePhrase: 'Liquidity gone, baby!',
    description: 'Scammer - baits with fake coins then explodes',
    explosionRadius: 120,
    explosionDamage: 2
  },

  analystChad: {
    id: 'analystChad',
    name: 'Analyst Chad',
    icon: '📊', // Chart emoji - perfect for analyst!
    archetype: 'shooter',
    behavior: 'curved_projectiles',
    hp: 35,
    speed: 170,
    size: { width: 95, height: 95 },
    sprite: 'emoji-chart', // v4.2: Uses emoji rendering
    scale: 1.0, // Not used for emoji sprites
    memePhrase: 'According to my Fib levels...',
    description: 'Overconfident trader - fires curved chart projectiles',
    projectileType: 'curved',
    fireRate: 3000
  },

  rektWizard: {
    id: 'rektWizard',
    name: 'Rekt Wizard',
    icon: '🧙‍♂️', // Wizard emoji - perfect for chaos magic!
    archetype: 'chaos',
    behavior: 'chaos_swap',
    hp: 40,
    speed: 150,
    size: { width: 100, height: 100 },
    sprite: 'emoji-wizard', // v4.2: Uses emoji rendering
    scale: 1.0, // Not used for emoji sprites
    memePhrase: 'Stop loss? Never heard of it.',
    description: 'Magic of chaos - randomly swaps HP and score effects'
  },

  whaleManipulator: {
    id: 'whaleManipulator',
    name: 'Whale Manipulator',
    icon: '🐋', // Whale emoji - perfect for market manipulator!
    archetype: 'magnet',
    behavior: 'pull_coins_enemies',
    hp: 60,
    speed: 120,
    size: { width: 120, height: 120 },
    sprite: 'emoji-whale', // v4.2: Uses emoji rendering
    scale: 1.0, // Not used for emoji sprites
    memePhrase: 'Whales are buying... or are they?',
    description: 'Market manipulator - pulls coins and enemies toward itself',
    magnetRadius: 250
  },

  moonChad: {
    id: 'moonChad',
    name: 'Moon Chad',
    icon: '🧑‍🚀', // Astronaut emoji - perfect for moon boy!
    archetype: 'shooter',
    behavior: 'diagonal_rockets',
    hp: 35,
    speed: 200,
    size: { width: 95, height: 95 },
    sprite: 'emoji-astronaut', // v4.2: Uses emoji rendering
    scale: 1.0, // Not used for emoji sprites
    memePhrase: "We're going to the moon!",
    description: 'Hype trader - fires diagonal rocket projectiles',
    projectileType: 'rocket',
    fireRate: 2500
  },

  // ========================================
  // BOSSES
  // ========================================

  bearBoss: {
    id: 'bearBoss',
    name: 'Bear Boss',
    icon: '🐻',
    archetype: 'boss',
    behavior: 'chaos',
    hp: 200,
    speed: 130,
    size: { width: 180, height: 180 },
    sprite: 'bear-boss',
    scale: 0.35,
    memePhrase: 'SELL! SELL! SELL!',
    description: 'Market crash embodiment - heavy HP, moves slowly'
  },

  czBoss: {
    id: 'czBoss',
    name: 'CZ Boss',
    icon: '🐻‍❄️',
    archetype: 'boss',
    behavior: 'teleport_burst',
    hp: 300,
    speed: 180,
    size: { width: 140, height: 140 },
    sprite: 'emoji-cz', // 🐻 emoji (using bear as placeholder)
    scale: 1.5,
    memePhrase: 'I am the market!',
    description: 'Whale King / Elite - teleports and shoots burst waves'
  }
};

/**
 * Enemy Reward Calculations
 * XP = HP × 1.2
 * Score = HP × 2.0
 */
export function getEnemyXPReward(enemyId: string): number {
  const enemy = ENEMIES[enemyId];
  return enemy ? Math.floor(enemy.hp * 1.2) : 0;
}

export function getEnemyScoreReward(enemyId: string): number {
  const enemy = ENEMIES[enemyId];
  return enemy ? enemy.hp * 2 : 0;
}

/**
 * Get all enemy IDs by archetype
 */
export function getEnemiesByArchetype(archetype: EnemyArchetype): string[] {
  return Object.keys(ENEMIES).filter(id => ENEMIES[id].archetype === archetype);
}

/**
 * Get enemy by ID with type safety
 */
export function getEnemy(id: string): EnemyConfig | undefined {
  return ENEMIES[id];
}

/**
 * Export all enemy IDs for easy reference
 */
export const ENEMY_IDS = Object.keys(ENEMIES);

/**
 * Enemy Lists by Difficulty
 */
export const EASY_ENEMIES = ['jeeter', 'paperHands', 'fudBot'];
export const MEDIUM_ENEMIES = ['redCandles', 'gary', 'fourMeme', 'rugpullKevin'];
export const HARD_ENEMIES = ['pumpFun', 'analystChad', 'moonChad', 'rektWizard'];
export const ELITE_ENEMIES = ['whaleManipulator'];
export const BOSS_ENEMIES = ['bearBoss', 'czBoss'];
