export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'collect' | 'time' | 'kill' | 'score' | 'combo' | 'survive' | 'phase' | 'perfect';
  target: number;
  progress: number;
  completed: boolean;
  reward: {
    xp: number;
    points?: number;
    unlocks?: string[]; // Skins, powerups, etc.
  };
  tier: number;
  emoji: string;
}

export interface MissionTier {
  tier: number;
  name: string;
  description: string;
  requiredLevel: number;
  missions: Mission[];
  tierReward: {
    xp: number;
    unlocks: string[];
    title: string;
  };
}

export const MissionTiers: MissionTier[] = [
  {
    tier: 1,
    name: 'Rookie Eagle 🦅',
    description: 'Learn to fly, collect, and survive',
    requiredLevel: 0,
    missions: [
      {
        id: 'rookie_collect',
        title: 'First Haul',
        description: '💰 Collect 50 Tokens',
        type: 'collect',
        target: 50,
        progress: 0,
        completed: false,
        reward: { xp: 100, points: 500 },
        tier: 1,
        emoji: '💰'
      },
      {
        id: 'rookie_time',
        title: 'Survival Basics',
        description: '⏱️ Survive 2 Minutes',
        type: 'time',
        target: 120,
        progress: 0,
        completed: false,
        reward: { xp: 100, points: 500 },
        tier: 1,
        emoji: '⏱️'
      },
      {
        id: 'rookie_shield',
        title: 'Shield Master',
        description: '🛡️ Destroy 10 enemies with Belle/Shield',
        type: 'kill',
        target: 10,
        progress: 0,
        completed: false,
        reward: { xp: 100, points: 500 },
        tier: 1,
        emoji: '🛡️'
      }
    ],
    tierReward: {
      xp: 300,
      unlocks: ['background_patriot'],
      title: 'Tier 1 Complete: Ready to Soar!'
    }
  },
  {
    tier: 2,
    name: 'Degen Flyer 🚀',
    description: 'Master the basics and face tougher challenges',
    requiredLevel: 2,
    missions: [
      {
        id: 'degen_collect',
        title: 'Token Hoarder',
        description: '💎 Collect 100 Tokens',
        type: 'collect',
        target: 100,
        progress: 0,
        completed: false,
        reward: { xp: 250, points: 1000 },
        tier: 2,
        emoji: '💎'
      },
      {
        id: 'degen_belle_kills',
        title: 'MOD Power',
        description: '👁️ Destroy 20 enemies with Belle Shield',
        type: 'kill',
        target: 20,
        progress: 0,
        completed: false,
        reward: { xp: 250, points: 1200 },
        tier: 2,
        emoji: '👁️'
      },
      {
        id: 'degen_score',
        title: 'Rising Star',
        description: '⭐ Reach 15,000 points',
        type: 'score',
        target: 15000,
        progress: 0,
        completed: false,
        reward: { xp: 250, points: 1500 },
        tier: 2,
        emoji: '⭐'
      },
      {
        id: 'degen_combo',
        title: 'Combo King',
        description: '🔥 Achieve a 15x combo',
        type: 'combo',
        target: 15,
        progress: 0,
        completed: false,
        reward: { xp: 250, points: 1000 },
        tier: 2,
        emoji: '🔥'
      }
    ],
    tierReward: {
      xp: 500,
      unlocks: ['powerup_usd1_boost', 'skin_chrome_eagle'],
      title: 'Tier 2 Complete: Degen Status Achieved!'
    }
  },
  {
    tier: 3,
    name: 'Meme Commander 💪',
    description: 'Face intense challenges and prove your skills',
    requiredLevel: 5,
    missions: [
      {
        id: 'commander_score',
        title: 'High Roller',
        description: '🎯 Reach 50,000 points',
        type: 'score',
        target: 50000,
        progress: 0,
        completed: false,
        reward: { xp: 500, points: 3000 },
        tier: 3,
        emoji: '🎯'
      },
      {
        id: 'commander_bear',
        title: 'Bear Market Survivor',
        description: '🐻 Survive a full Bear Market phase (45s)',
        type: 'phase',
        target: 1,
        progress: 0,
        completed: false,
        reward: { xp: 500, points: 2500 },
        tier: 3,
        emoji: '🐻'
      },
      {
        id: 'commander_perfect',
        title: 'Flawless Flight',
        description: '💯 Survive 3 minutes without losing a life',
        type: 'perfect',
        target: 180,
        progress: 0,
        completed: false,
        reward: { xp: 500, points: 4000 },
        tier: 3,
        emoji: '💯'
      },
      {
        id: 'commander_enemies',
        title: 'Enemy Crusher',
        description: '💥 Destroy 50 enemies total',
        type: 'kill',
        target: 50,
        progress: 0,
        completed: false,
        reward: { xp: 500, points: 2000 },
        tier: 3,
        emoji: '💥'
      }
    ],
    tierReward: {
      xp: 1000,
      unlocks: ['skin_golden_wings', 'trail_effect_stars'],
      title: 'Tier 3 Complete: Commander Unlocked!'
    }
  },
  {
    tier: 4,
    name: 'Launch Patriot 🇺🇸',
    description: 'Speed and precision - become unstoppable',
    requiredLevel: 10,
    missions: [
      {
        id: 'patriot_perfect_kills',
        title: 'Untouchable',
        description: '🎖️ Destroy 10 enemies without losing a life',
        type: 'perfect',
        target: 10,
        progress: 0,
        completed: false,
        reward: { xp: 750, points: 5000 },
        tier: 4,
        emoji: '🎖️'
      },
      {
        id: 'patriot_score',
        title: 'Elite Scorer',
        description: '💫 Reach 100,000 points',
        type: 'score',
        target: 100000,
        progress: 0,
        completed: false,
        reward: { xp: 750, points: 6000 },
        tier: 4,
        emoji: '💫'
      },
      {
        id: 'patriot_phases',
        title: 'Phase Master',
        description: '🔄 Survive 10 market phase changes',
        type: 'phase',
        target: 10,
        progress: 0,
        completed: false,
        reward: { xp: 750, points: 4000 },
        tier: 4,
        emoji: '🔄'
      },
      {
        id: 'patriot_combo',
        title: 'Combo God',
        description: '⚡ Achieve a 30x combo',
        type: 'combo',
        target: 30,
        progress: 0,
        completed: false,
        reward: { xp: 750, points: 5000 },
        tier: 4,
        emoji: '⚡'
      }
    ],
    tierReward: {
      xp: 2000,
      unlocks: ['hall_of_degen_access', 'skin_freedom_eagle'],
      title: 'Tier 4 Complete: Hall of Degen Unlocked!'
    }
  },
  {
    tier: 5,
    name: 'America Legend 🏆',
    description: 'The ultimate endgame challenge',
    requiredLevel: 20,
    missions: [
      {
        id: 'legend_million',
        title: 'Million Point Club',
        description: '🌟 Hit 1,000,000 Score',
        type: 'score',
        target: 1000000,
        progress: 0,
        completed: false,
        reward: { xp: 2000, points: 50000 },
        tier: 5,
        emoji: '🌟'
      },
      {
        id: 'legend_flawless',
        title: 'Immortal Run',
        description: '👑 Complete all phases without dying',
        type: 'perfect',
        target: 300,
        progress: 0,
        completed: false,
        reward: { xp: 2000, points: 100000 },
        tier: 5,
        emoji: '👑'
      },
      {
        id: 'legend_enemies',
        title: 'Destroyer',
        description: '💣 Destroy 200 enemies in one run',
        type: 'kill',
        target: 200,
        progress: 0,
        completed: false,
        reward: { xp: 2000, points: 75000 },
        tier: 5,
        emoji: '💣'
      }
    ],
    tierReward: {
      xp: 5000,
      unlocks: ['secret_ending', 'skin_launchpad_eagle', 'title_america_legend'],
      title: 'TIER 5 COMPLETE: WELCOME TO THE LAUNCHPAD! 🇺🇸'
    }
  }
];

// Daily/Weekly Mission Pool for rotation
export const MissionPool: Omit<Mission, 'progress' | 'completed'>[] = [
  {
    id: 'daily_bonk',
    title: 'BONK Collector',
    description: '🟠 Collect 30 BONK coins',
    type: 'collect',
    target: 30,
    reward: { xp: 150 },
    tier: 0,
    emoji: '🟠'
  },
  {
    id: 'daily_burger',
    title: 'Burger Hunter',
    description: '🍔 Collect 5 BURGER tokens',
    type: 'collect',
    target: 5,
    reward: { xp: 200 },
    tier: 0,
    emoji: '🍔'
  },
  {
    id: 'daily_pumpfun',
    title: 'Pill Crusher',
    description: '💊 Destroy 5 Pump.fun enemies',
    type: 'kill',
    target: 5,
    reward: { xp: 150 },
    tier: 0,
    emoji: '💊'
  },
  {
    id: 'daily_fourmeme',
    title: 'Copycat Destroyer',
    description: '🤡 Destroy 5 Four.meme enemies',
    type: 'kill',
    target: 5,
    reward: { xp: 150 },
    tier: 0,
    emoji: '🤡'
  },
  {
    id: 'daily_quick',
    title: 'Speedrun',
    description: '⚡ Score 10,000 in under 2 minutes',
    type: 'score',
    target: 10000,
    reward: { xp: 250 },
    tier: 0,
    emoji: '⚡'
  },
  {
    id: 'daily_bear',
    title: 'Bear Slayer',
    description: '🐻 Destroy 3 Bear Boss enemies',
    type: 'kill',
    target: 3,
    reward: { xp: 300 },
    tier: 0,
    emoji: '🐻'
  }
];
