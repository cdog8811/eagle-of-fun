export const GameConfig = {
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

  // === PHASES SYSTEM (Time-based progression) ===
  phases: [
    {
      id: 1,
      name: 'Soft Launch 🚀',
      duration: 60, // seconds
      enemies: ['jeeter'],
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
      enemies: ['jeeter', 'paperHands'],
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
      enemies: ['jeeter', 'paperHands', 'redCandles'],
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
      enemies: ['jeeter', 'paperHands', 'redCandles', 'gary'],
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
      enemies: ['jeeter', 'paperHands', 'redCandles', 'gary', 'bearBoss'],
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
      enemies: ['jeeter', 'paperHands', 'redCandles', 'gary', 'bearBoss'],
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

  // === ENEMIES ===
  enemies: {
    jeeter: {
      name: 'Jeeter',
      description: 'Paper-Hand-Symbol',
      behavior: 'horizontal',
      speed: 250,
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
      speed: 200,
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
      speed: 180,
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
      speed: 220,
      hp: 25, // v3.8: Low HP for basic enemy
      size: { width: 90, height: 100 }, // Smaller hitbox
      sprite: 'gary',
      scale: 0.22, // Slightly smaller
      meme: 'Unregistered Security!',
      controlBlockDuration: 2000 // ms
    },
    bearBoss: {
      name: 'Bear Market Boss',
      description: 'Riesiger Endgegner',
      behavior: 'chaos',
      speed: 150,
      hp: 200, // v3.8: Boss has high HP
      size: { width: 180, height: 180 }, // Slightly smaller hitbox (still big boss)
      sprite: 'bear-boss',
      scale: 0.35, // Slightly smaller but still intimidating
      meme: 'SELL! SELL! SELL!',
      isBoss: true
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
