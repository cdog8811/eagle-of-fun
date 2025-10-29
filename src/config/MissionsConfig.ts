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
    name: 'mission.tier1.name',
    description: 'mission.tier1.desc',
    requiredLevel: 0,
    missions: [
      {
        id: 'rookie_collect',
        title: 'mission.rookieCollect.title',
        description: 'mission.rookieCollect.desc',
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
        title: 'mission.rookieTime.title',
        description: 'mission.rookieTime.desc',
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
        title: 'mission.rookieShield.title',
        description: 'mission.rookieShield.desc',
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
      title: 'mission.tier1.reward'
    }
  },
  {
    tier: 2,
    name: 'mission.tier2.name',
    description: 'mission.tier2.desc',
    requiredLevel: 2,
    missions: [
      {
        id: 'degen_collect',
        title: 'mission.degenCollect.title',
        description: 'mission.degenCollect.desc',
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
        title: 'mission.degenBelleKills.title',
        description: 'mission.degenBelleKills.desc',
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
        title: 'mission.degenScore.title',
        description: 'mission.degenScore.desc',
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
        title: 'mission.degenCombo.title',
        description: 'mission.degenCombo.desc',
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
      title: 'mission.tier2.reward'
    }
  },
  {
    tier: 3,
    name: 'mission.tier3.name',
    description: 'mission.tier3.desc',
    requiredLevel: 5,
    missions: [
      {
        id: 'commander_score',
        title: 'mission.commanderScore.title',
        description: 'mission.commanderScore.desc',
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
        title: 'mission.commanderBear.title',
        description: 'mission.commanderBear.desc',
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
        title: 'mission.commanderPerfect.title',
        description: 'mission.commanderPerfect.desc',
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
        title: 'mission.commanderEnemies.title',
        description: 'mission.commanderEnemies.desc',
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
      title: 'mission.tier3.reward'
    }
  },
  {
    tier: 4,
    name: 'mission.tier4.name',
    description: 'mission.tier4.desc',
    requiredLevel: 10,
    missions: [
      {
        id: 'patriot_perfect_kills',
        title: 'mission.patriotPerfectKills.title',
        description: 'mission.patriotPerfectKills.desc',
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
        title: 'mission.patriotScore.title',
        description: 'mission.patriotScore.desc',
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
        title: 'mission.patriotPhases.title',
        description: 'mission.patriotPhases.desc',
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
        title: 'mission.patriotCombo.title',
        description: 'mission.patriotCombo.desc',
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
      title: 'mission.tier4.reward'
    }
  },
  {
    tier: 5,
    name: 'mission.tier5.name',
    description: 'mission.tier5.desc',
    requiredLevel: 20,
    missions: [
      {
        id: 'legend_million',
        title: 'mission.legendMillion.title',
        description: 'mission.legendMillion.desc',
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
        title: 'mission.legendFlawless.title',
        description: 'mission.legendFlawless.desc',
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
        title: 'mission.legendEnemies.title',
        description: 'mission.legendEnemies.desc',
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
      title: 'mission.tier5.reward'
    }
  }
];

// Daily/Weekly Mission Pool for rotation
export const MissionPool: Omit<Mission, 'progress' | 'completed'>[] = [
  {
    id: 'daily_bonk',
    title: 'mission.dailyBonk.title',
    description: 'mission.dailyBonk.desc',
    type: 'collect',
    target: 30,
    reward: { xp: 150 },
    tier: 0,
    emoji: '🟠'
  },
  {
    id: 'daily_burger',
    title: 'mission.dailyBurger.title',
    description: 'mission.dailyBurger.desc',
    type: 'collect',
    target: 5,
    reward: { xp: 200 },
    tier: 0,
    emoji: '🍔'
  },
  {
    id: 'daily_pumpfun',
    title: 'mission.dailyPumpfun.title',
    description: 'mission.dailyPumpfun.desc',
    type: 'kill',
    target: 5,
    reward: { xp: 150 },
    tier: 0,
    emoji: '💊'
  },
  {
    id: 'daily_fourmeme',
    title: 'mission.dailyFourmeme.title',
    description: 'mission.dailyFourmeme.desc',
    type: 'kill',
    target: 5,
    reward: { xp: 150 },
    tier: 0,
    emoji: '🤡'
  },
  {
    id: 'daily_quick',
    title: 'mission.dailyQuick.title',
    description: 'mission.dailyQuick.desc',
    type: 'score',
    target: 10000,
    reward: { xp: 250 },
    tier: 0,
    emoji: '⚡'
  },
  {
    id: 'daily_bear',
    title: 'mission.dailyBear.title',
    description: 'mission.dailyBear.desc',
    type: 'kill',
    target: 3,
    reward: { xp: 300 },
    tier: 0,
    emoji: '🐻'
  }
];
