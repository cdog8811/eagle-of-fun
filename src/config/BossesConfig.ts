// ============================
// Eagle of Fun v3.0 - Bosses Config
// ============================

export interface Boss {
  id: string;
  name: string;
  phase: number; // Market phase when boss appears
  hp: number;
  size: { width: number; height: number };
  attackPatterns: AttackPattern[];
  voiceLines: string[];
  dropReward: BossReward;
  theme: string; // Music theme
  triggerCondition?: BossTrigger;
}

export interface AttackPattern {
  id: string;
  name: string;
  description: string;
  cooldown: number; // milliseconds
  damage: number;
  effect?: string;
}

export interface BossReward {
  type: 'badge' | 'boost' | 'unlock';
  name: string;
  value: number; // XP or multiplier
  extraLives?: number;
  coinMultiplier?: number;
  duration?: number; // For temporary boosts (ms)
}

export interface BossTrigger {
  minScore?: number;
  maxHits?: number; // Max hits taken by player
  special?: string;
}

export const BOSSES: Boss[] = [
  {
    id: 'gary-regulator',
    name: 'Gary the Regulator',
    phase: 3,
    hp: 30,
    size: { width: 200, height: 250 },
    attackPatterns: [
      {
        id: 'lawsuit-spiral',
        name: 'Lawsuit Papers',
        description: 'Throws lawsuit papers in spirals',
        cooldown: 3000,
        damage: 10,
        effect: 'Spiral pattern'
      },
      {
        id: 'section-12b',
        name: 'Section 12B Call',
        description: 'Shouts legal violation, screen shake',
        cooldown: 8000,
        damage: 15,
        effect: 'Screen shake'
      }
    ],
    voiceLines: [
      'This violates section 12 B!',
      'I\'m shutting this down!',
      'You need a license for that!',
      'Unregistered securities!'
    ],
    dropReward: {
      type: 'badge',
      name: 'Freedom Badge',
      value: 500,
      extraLives: 1
    },
    theme: 'Office Synthwave'
  },
  {
    id: 'bear-market',
    name: 'The Bear Market',
    phase: 5,
    hp: 75,
    size: { width: 300, height: 350 },
    attackPatterns: [
      {
        id: 'roar-shake',
        name: 'Bear Roar',
        description: 'Screams, causes screen shake and red candles fall',
        cooldown: 5000,
        damage: 20,
        effect: 'Screen shake + red candles'
      },
      {
        id: 'platform-destroy',
        name: 'Platform Smash',
        description: 'Destroys ground platforms',
        cooldown: 7000,
        damage: 25,
        effect: 'Removes platforms'
      },
      {
        id: 'swipe-attack',
        name: 'Bear Swipe',
        description: 'Fast claw swipe',
        cooldown: 4000,
        damage: 15,
        effect: 'Wide arc'
      }
    ],
    voiceLines: [
      'GRRRRAAAAHHH!',
      'Your portfolio is REKT!',
      'The bull run is OVER!',
      'Dump it ALL!'
    ],
    dropReward: {
      type: 'boost',
      name: 'Bull Revival',
      value: 0,
      coinMultiplier: 5,
      duration: 10000
    },
    theme: 'Heavy Metal Bear'
  },
  {
    id: 'the-whale',
    name: 'The Whale',
    phase: 0, // Secret boss, phase independent
    hp: 150,
    size: { width: 400, height: 300 },
    attackPatterns: [
      {
        id: 'money-bundle',
        name: 'Money Bundle Throw',
        description: 'Throws money bundles that confuse players',
        cooldown: 4000,
        damage: 15,
        effect: 'Distraction'
      },
      {
        id: 'fake-coins',
        name: 'Fake Coin Rain',
        description: 'Spawns fake coins that damage on collection',
        cooldown: 6000,
        damage: 20,
        effect: 'Fake collectibles'
      },
      {
        id: 'whale-splash',
        name: 'Whale Splash',
        description: 'Creates massive wave across screen',
        cooldown: 10000,
        damage: 30,
        effect: 'Full screen wave'
      }
    ],
    voiceLines: [
      'He bought the top!',
      'Dump it on retail!',
      'I control the market!',
      'Your bags are heavy!'
    ],
    dropReward: {
      type: 'unlock',
      name: 'Golden Portfolio',
      value: 2 // Mission unlocks
    },
    theme: 'Deep Bass House',
    triggerCondition: {
      minScore: 2000,
      maxHits: 0, // No damage taken
      special: 'Perfect run'
    }
  }
];

// Boss spawn thresholds
export const BOSS_SPAWN_CONFIG = {
  'gary-regulator': {
    scoreThreshold: 500,
    phaseRequired: 3
  },
  'bear-market': {
    scoreThreshold: 1500,
    phaseRequired: 5
  },
  'the-whale': {
    scoreThreshold: 2000,
    phaseRequired: 0,
    perfectRun: true
  }
};
