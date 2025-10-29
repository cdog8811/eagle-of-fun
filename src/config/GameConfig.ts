/**
 * GameConfig.ts
 * Eagle of Fun v4.2 - Main Game Configuration
 *
 * Updated to use new modular config system:
 * - EnemiesConfig.ts for enemy definitions
 * - PhaseConfig.ts for phase progression
 * - CombosConfig.ts for power-up synergies
 */

import { PHASES } from './PhaseConfig';
import { ENEMIES } from './EnemiesConfig';

export const GameConfig = {
  // === FEATURE FLAGS ===
  ENABLE_UPGRADE_SYSTEM: true,   // Re-enabled to test performance
  ENABLE_XP_SYSTEM: false,       // Keep disabled - XP causes slowdown
  DEBUG_COLLISIONS: false,       // Disable debug logs for production

  // Game dimensions - high resolution for professional quality
  width: 1920,
  height: 1080,

  // Physics - improved controls for better flight feel
  gravity: 800,  // Reduced from 1200 for easier control
  flapVelocity: -600,  // Increased from -400 for more powerful flaps

  // Gameplay
  scrollSpeed: 200,
  scrollSpeedIncrease: 10,
  maxScrollSpeed: 400,

  // Obstacles
  obstacleSpawnInterval: 1500, // milliseconds (schneller für mehr Action)
  obstacleGap: 220, // etwas größer für einfacheres Gameplay

  // === PHASES SYSTEM (v4.2 - Imported from PhaseConfig.ts) ===
  phases: PHASES,

  // === LEGACY PHASE STRUCTURE (DEPRECATED - kept for compatibility) ===
  legacyPhases: [
    {
      id: 1,
      name: 'Soft Launch 🚀',
      duration: 60, // seconds
      enemies: ['jeeter', 'droneling'], // v3.8: Added droneling (swarm intro)
      difficulty: 'easy',
      speedMultiplier: 1.3,
      spawnRate: 5000, // ms between enemy spawns (increased from 3500 - less enemies)
      background: '#FFFFFF',
      description: 'Get started, collect burgers!'
    },
    {
      id: 2,
      name: 'Paper Panic 👋',
      duration: 60,
      enemies: ['jeeter', 'paperHands', 'droneling', 'firecracker', 'splitter'], // v3.9: Added splitter
      difficulty: 'medium',
      speedMultiplier: 1.5,
      spawnRate: 4500, // increased from 3000
      background: '#F0F8FF',
      description: 'Watch out for fake coins! Speed +50%'
    },
    {
      id: 3,
      name: 'Candle Crash 📉',
      duration: 60,
      enemies: ['jeeter', 'paperHands', 'redCandles', 'fourMeme', 'hawkeye', 'droneling', 'firecracker', 'sbf', 'splitter', 'healer'], // v3.9: Added healer
      difficulty: 'hard',
      speedMultiplier: 1.7,
      spawnRate: 4000, // increased from 2500
      background: '#FFF5E6',
      description: 'Barriers incoming! Higher difficulty'
    },
    {
      id: 4,
      name: 'Regulation Run 🧑‍💼',
      duration: 60,
      enemies: ['jeeter', 'paperHands', 'redCandles', 'gary', 'fourMeme', 'pumpFun', 'hawkeye', 'custodian', 'firecracker', 'sbf', 'dokwon', 'kamikaze', 'shieldBearer'], // v3.9: Added kamikaze, shieldBearer
      difficulty: 'very_hard',
      speedMultiplier: 1.9,
      spawnRate: 3500, // increased from 2200
      background: '#FFF0E6',
      description: 'Lawsuit storm! Power-ups needed'
    },
    {
      id: 5,
      name: 'Bear Market Finale 🐻',
      duration: 60,
      enemies: ['paperHands', 'redCandles', 'gary', 'fourMeme', 'pumpFun', 'bearBoss', 'hawkeye', 'custodian', 'firecracker', 'sbf', 'dokwon', 'czBoss', 'splitter', 'healer', 'kamikaze', 'shieldBearer'], // v3.9: All new enemies
      difficulty: 'extreme',
      speedMultiplier: 2.1,
      spawnRate: 1800,
      background: '#FFE6E6',
      description: 'Chaos + Freedom final phase'
    },
    {
      id: 6,
      name: 'WAGMI Mode 🦅',
      duration: -1, // Endless
      enemies: ['paperHands', 'redCandles', 'gary', 'fourMeme', 'pumpFun', 'bearBoss', 'hawkeye', 'custodian', 'firecracker', 'sbf', 'dokwon', 'czBoss', 'splitter', 'healer', 'kamikaze', 'shieldBearer'], // v3.9: All enemies
      difficulty: 'variable',
      speedMultiplier: 2.3,
      spawnRate: 1500,
      background: '#FFE6F0',
      description: 'Endless fun, meme alerts & speed boosts!'
    }
  ],

  // === COINS (Power-Tokens) - v3.5 Balanced ===
  coins: {
    BONK: {
      name: '$BONK',
      description: 'Common meme coin',
      points: 5,
      icon: '🐕',
      spawnChance: 35, // v3.5: 35% (reduced from 40%)
      effect: 'none'
    },
    AOL: {
      name: '$AOL',
      description: 'Core coin – enables Buyback Mode',
      points: 10,
      icon: '🇺🇸',
      spawnChance: 20, // v3.5: 20% (balanced)
      effect: 'buyback_boost', // 3x AOL = Buyback Mode
      comboRequired: 3
    },
    USD1: {
      name: '$USD1',
      description: 'Stablecoin – safe, low value',
      points: 2,
      icon: '💵',
      spawnChance: 10, // v3.5: 10% (stable)
      effect: 'none'
    },
    BURGER: {
      name: '$BURGER',
      description: 'Multiplicator coin (Burger Mode trigger)',
      points: 25,
      icon: '🍔',
      spawnChance: 17.5, // v3.5: 17.5%
      effect: 'score_multiplier', // 5x BURGER = 2× score
      comboRequired: 5,
      multiplierDuration: 5000 // ms
    },
    VALOR: {
      name: '$VALOR',
      description: 'Premium coin – larger sprite, triggers Gold Feather chance',
      points: 25, // v3.5: 25 points
      icon: '🦅',
      spawnChance: 17.5, // v3.5: 17.5%
      effect: 'gold_feather_chance', // 5% chance to drop Gold Feather
      goldFeatherChance: 5
    }
  },

  // === ENEMIES (v4.2 - Imported from EnemiesConfig.ts) ===
  enemies: ENEMIES,

  // === LEGACY ENEMIES (DEPRECATED - kept for compatibility) ===
  legacyEnemies: {
    jeeter: {
      name: 'Jeeter',
      description: 'Paper-Hand-Symbol',
      behavior: 'horizontal',
      speed: 280, // Fast - annoying quick enemy
      hp: 20, // v3.8: Very low HP (1 shot at start)
      size: { width: 100, height: 100 }, // Slightly smaller hitbox
      sprite: 'jeet',
      scale: 0.22, // Slightly smaller
      meme: 'I sold the top!'
    },
    paperHands: {
      name: 'Paper Hands Pete',
      description: 'Droppt Fake-Coins',
      behavior: 'drops_fake_coins',
      speed: 160, // Slow - easier to dodge
      hp: 30, // v3.8: Medium-low HP
      size: { width: 85, height: 85 }, // Slightly smaller hitbox
      sprite: 'paper-hands',
      scale: 0.18, // Slightly smaller
      meme: 'Nooo I panic sold!',
      fakeCoinPenalty: -10
    },
    redCandles: {
      name: 'Red Candles',
      description: 'Vertikale Barrieren',
      behavior: 'vertical_barrier',
      speed: 140, // Very slow - stationary threat
      hp: 35, // v3.8: Medium HP
      size: { width: 50, height: 150 }, // Smaller hitbox - was too dangerous
      sprite: 'red-candles',
      scale: 0.25, // Slightly smaller visual scale
      meme: 'Market Dump Incoming 🚨'
    },
    gary: {
      name: 'Gary (SEC)',
      description: 'Wirft Lawsuit Papers',
      behavior: 'throws_papers',
      speed: 190, // Medium speed
      hp: 25, // v3.8: Low HP for basic enemy
      size: { width: 90, height: 100 }, // Smaller hitbox
      sprite: 'gary',
      scale: 0.22, // Slightly smaller
      meme: 'Unregistered Security!',
      controlBlockDuration: 2000, // ms
      throwInterval: 2500 // v3.8 FIX: Added missing throwInterval property (ms between throws)
    },
    bearBoss: {
      name: 'Bear Market Boss',
      description: 'Riesiger Endgegner',
      behavior: 'chaos',
      speed: 130, // Very slow - intimidating boss
      hp: 200, // v3.8: Boss has high HP
      size: { width: 180, height: 180 }, // Slightly smaller hitbox (still big boss)
      sprite: 'bear-boss',
      scale: 0.35, // Slightly smaller but still intimidating
      meme: 'SELL! SELL! SELL!',
      isBoss: true
    },
    fourMeme: {
      name: '4meme (CZ)',
      description: 'Kontrahent zu America.Fun - gehört zu CZ/Binance',
      behavior: 'horizontal',
      speed: 260, // Fast competitor
      hp: 28,
      size: { width: 95, height: 95 },
      sprite: 'fourmeme',
      scale: 0.20,
      meme: '4meme > AOL 🖐️'
    },
    pumpFun: {
      name: 'Pump.fun',
      description: 'Größte Memecoin-Plattform - Kontrahent',
      behavior: 'horizontal',
      speed: 270, // Very fast platform
      hp: 30,
      size: { width: 90, height: 90 },
      sprite: 'pumpfun',
      scale: 0.22,
      meme: 'Pump it or dump it! 💎'
    },
    // === NEW ENEMIES v3.8 (Enemies.ts Phase 0) ===
    hawkeye: {
      name: 'HawkEye',
      description: 'Sniper - fires aimed laser shots',
      behavior: 'sniper',
      speed: 150, // Slow sniper - precision over speed
      hp: 35,
      size: { width: 95, height: 95 },
      sprite: 'emoji-hawkeye', // 🎯 emoji
      scale: 1.2,
      meme: '🎯 Targeted strike!',
      aiType: 'sniper',
      projectileType: 'laser',
      fireRate: 3000 // ms between shots
    },
    droneling: {
      name: 'Droneling',
      description: 'Swarm enemy - spawns in groups of 5',
      behavior: 'swarm',
      speed: 240, // Medium-fast swarm
      hp: 20,
      size: { width: 70, height: 70 },
      sprite: 'emoji-droneling', // 🚁 emoji
      scale: 1.0,
      meme: '🚁 Swarm incoming!',
      aiType: 'swarm',
      groupSize: 5
    },
    custodian: {
      name: 'Custodian',
      description: 'Shielded - only vulnerable from top/bottom',
      behavior: 'shielded',
      speed: 120, // Very slow tank with shield
      hp: 50,
      size: { width: 100, height: 100 },
      sprite: 'emoji-custodian', // 🛡️ emoji
      scale: 1.3,
      meme: '🛡️ Protected!',
      aiType: 'shielded',
      shieldDirection: 'front' // front-facing shield
    },
    firecracker: {
      name: 'FireCracker',
      description: 'Exploder - creates splinters on death',
      behavior: 'exploder',
      speed: 220, // Medium-fast explosive
      hp: 25,
      size: { width: 80, height: 80 },
      sprite: 'emoji-firecracker', // 💥 emoji
      scale: 1.1,
      meme: '💥 Boom!',
      aiType: 'exploder',
      explosionRadius: 100,
      splinterCount: 6
    },
    sbf: {
      name: 'SBF',
      description: 'Tank - high HP, slow movement',
      behavior: 'tank',
      speed: 100, // Extremely slow tank
      hp: 150,
      size: { width: 120, height: 120 },
      sprite: 'emoji-sbf', // 🏦 emoji
      scale: 1.4,
      meme: '🏦 Too big to fail!',
      aiType: 'basic'
    },
    dokwon: {
      name: 'Do Kwon',
      description: 'Elite - fast and dangerous',
      behavior: 'elite',
      speed: 320, // Very fast elite
      hp: 80,
      size: { width: 100, height: 100 },
      sprite: 'emoji-dokwon', // ⚡ emoji
      scale: 1.3,
      meme: '⚡ UST goes brr!',
      aiType: 'basic'
    },
    czBoss: {
      name: 'CZ',
      description: 'Boss-tier elite enemy',
      behavior: 'boss_tier',
      speed: 180, // Medium speed boss-tier
      hp: 300,
      size: { width: 140, height: 140 },
      sprite: 'emoji-cz', // 🐻 emoji
      scale: 1.5,
      meme: '🐻 Bear Market King!',
      aiType: 'basic',
      isBoss: false // Not a real boss, just boss-tier stats
    },
    // === NEW ENEMIES v3.9 ===
    splitter: {
      name: 'Splitter',
      description: 'Divides into 2 smaller enemies on death',
      behavior: 'splitter',
      speed: 210, // Medium speed
      hp: 40,
      size: { width: 90, height: 90 },
      sprite: 'emoji-splitter', // 🔄 emoji
      scale: 1.2,
      meme: '🔄 Double trouble!',
      aiType: 'splitter',
      splitCount: 2, // Spawns 2 mini enemies on death
      splitHP: 15 // HP of each split enemy
    },
    healer: {
      name: 'Healer',
      description: 'Heals nearby enemies periodically',
      behavior: 'healer',
      speed: 110, // Very slow support unit
      hp: 60,
      size: { width: 95, height: 95 },
      sprite: 'emoji-healer', // 💚 emoji
      scale: 1.3,
      meme: '💚 Healing the pump!',
      aiType: 'healer',
      healRange: 200, // Heal radius in pixels
      healAmount: 10, // HP healed per tick
      healInterval: 3000 // ms between heals
    },
    kamikaze: {
      name: 'Kamikaze',
      description: 'Rushes directly at the eagle - high risk!',
      behavior: 'kamikaze',
      speed: 400, // EXTREMELY fast rush!
      hp: 20, // Low HP
      size: { width: 75, height: 75 },
      sprite: 'emoji-kamikaze', // 💥 emoji
      scale: 1.1,
      meme: '💥 All in! YOLO!',
      aiType: 'kamikaze',
      rushSpeed: 600, // Even faster when charging!
      explosionDamage: 2 // Damage on impact
    },
    shieldBearer: {
      name: 'Shield Bearer',
      description: 'Has a rotating shield - attack from behind!',
      behavior: 'shield_rotating',
      speed: 145, // Slow defensive unit
      hp: 70,
      size: { width: 100, height: 100 },
      sprite: 'emoji-shield', // 🛡️ emoji
      scale: 1.3,
      meme: '🛡️ Protected by the shield!',
      aiType: 'shielded',
      shieldRotationSpeed: 2, // Radians per second
      shieldArc: Math.PI * 0.6 // 108 degrees shield coverage
    }
  },

  // === POWER-UPS ===
  powerUps: {
    buybackMode: {
      name: '🧲 Buyback Mode',
      icon: '🧲',
      description: 'Attracts all coins',
      duration: 5000, // ms
      trigger: 'collect_3_aol',
      magnetRadius: 400,
      sound: 'Buyback activated!',
      text: 'Coins fly to you like liquidity 🧲💸'
    },
    freedomShield: {
      name: '🛡️ Freedom Shield',
      icon: '🛡️',
      description: 'Protects from 1 hit',
      duration: 8000,
      trigger: 'pickup',
      spawnChance: 15 // % chance to spawn
    },
    freedomStrike: {
      name: '⚡ Freedom Strike',
      icon: '⚡',
      description: 'Lightning destroys all enemies!',
      duration: 1000, // Visual effect duration
      trigger: 'pickup',
      effect: 'destroyAllEnemies', // v3.5: New effect
      spawnChance: 8 // % chance to spawn
    },
    belleMod: {
      name: 'Κρόνος Belle',
      icon: '👁️',
      description: 'MOD protection - deletes FUD and bans Jeeters',
      duration: 8000, // 8 seconds
      trigger: 'pickup',
      spawnChance: 12, // % chance to spawn
      sound: 'Moderator online.',
      text: 'Κρόνος Belle is watching 👁️',
      blockHits: true
    },
    vesper0x: {
      name: 'Vesper0x',
      icon: '🦌',
      description: 'America.Fun Team Member - Grants extra life!',
      duration: 0, // Instant pickup
      trigger: 'pickup',
      spawnChance: 5, // % chance to spawn (rare)
      sound: 'Vesper0x appears!',
      text: 'Vesper0x grants you an extra life! 🦌❤️',
      effect: 'extraLife'
    },
    cryptoActing: {
      name: "CryptoActing's Early Entry",
      icon: '🕶️',
      description: 'The Early Believer - High risk, high reward!',
      duration: 12000, // 12 seconds
      trigger: 'pickup',
      spawnChance: 8, // % chance to spawn (rare but not too rare)
      sound: 'You got in before the rest!',
      text: 'CryptoActing entered early — market goes nuts! 🕶️',
      effect: 'earlyEntry',
      scoreMultiplier: 3, // 3x score
      enemySpeedIncrease: 1.2, // +20% enemy speed
      perfectEntryBonus: 250 // XP bonus if no damage taken
    },
    danxxProtocol: {
      name: 'Danxx Protocol',
      icon: '🧱',
      description: 'The Market Stabilizer - Brings order to chaos!',
      duration: 8000, // 8 seconds
      trigger: 'pickup',
      spawnChance: 5, // % chance to spawn (medium-rare)
      sound: 'When chaos hits, he brings order to the chain!',
      text: 'Danxx initiated the Buyback Protocol. 🧱',
      effect: 'marketStabilizer',
      coinSpeedReduction: 0.7, // -30% coin speed (coins move 70% of normal)
      xpBonus: 1.2, // +20% XP per coin
      enemySpawnReduction: 0.5, // Enemy spawn rate halved
      magnetActive: true // Magnet effect active
    },
    roseModMode: {
      name: "Rose's Mod Mode",
      icon: '🌹',
      description: 'The Telegram Guardian - Mutes the FUD!',
      duration: 10000, // 10 seconds
      trigger: 'pickup',
      spawnChance: 6, // % chance to spawn (frequent but pleasant)
      sound: 'She mutes the FUD and keeps the vibes high.',
      text: 'Rose muted the FUD! The chat is peaceful. 🌹',
      effect: 'fudMuter',
      freezeEnemies: true, // FUD-Bots, Jeeters, Influencers freeze
      clearProjectiles: true, // Remove all enemy projectiles
      magnetBoost: 1.3, // Slight coin magnet increase
      xpBonus: 1.1 // +10% XP
    }
  },

  // Scoring
  pointsPerSecond: 1,
  coinPoints: {
    BONK: 5,
    AOL: 10,
    USD1: 2,
    BURGER: 25,
    VALOR: 25 // v3.2 SPEC: 25 points
  },
  fudWallBonus: 10,

  // Colors (America.Fun theme)
  colors: {
    primary: '#E63946',    // Red
    secondary: '#0033A0',  // Blue
    gold: '#FBB13C',       // Gold
    white: '#FFFFFF',
    lightBlue: '#E8F4FF',
    bonkOrange: '#FF6B00'
  },

  // Skins
  skins: [
    { id: 'default', name: 'Classic Eagle', unlocked: true },
    { id: 'ogle', name: 'Ogle Mode', unlocked: false, requirement: 'score_1000' },
    { id: 'bonk', name: 'Bonk Pup', unlocked: false, requirement: 'score_2000' },
    { id: 'burger', name: 'Burger Beast', unlocked: false, requirement: 'score_3000' },
    { id: 'whale', name: 'WLFI Whale', unlocked: false, requirement: 'score_5000' },
    { id: 'vesper', name: 'Golden Wings', unlocked: false, requirement: 'secret' }
  ],

  // Easter eggs
  easterEggs: {
    declaration: '1776',
    bonkParty: 420
  }
};
