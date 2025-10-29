import { getI18n } from '../systems/i18n';

const i18n = getI18n();

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
    name: i18n.t('mission.tier1.name'),
    description: i18n.t('mission.tier1.desc'),
    requiredLevel: 0,
    missions: [
      {
        id: 'rookie_collect',
        title: i18n.t('mission.rookieCollect.title'),
        description: i18n.t('mission.rookieCollect.desc'),
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
        title: i18n.t('mission.rookieTime.title'),
        description: i18n.t('mission.rookieTime.desc'),
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
        title: i18n.t('mission.rookieShield.title'),
        description: i18n.t('mission.rookieShield.desc'),
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
      title: i18n.t('mission.tier1.reward')
    }
  },
  {
    tier: 2,
    name: i18n.t('mission.tier2.name'),
    description: i18n.t('mission.tier2.desc'),
    requiredLevel: 2,
    missions: [
      {
        id: 'degen_collect',
        title: i18n.t('mission.degenCollect.title'),
        description: i18n.t('mission.degenCollect.desc'),
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
        title: i18n.t('mission.degenBelleKills.title'),
        description: i18n.t('mission.degenBelleKills.desc'),
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
        title: i18n.t('mission.degenScore.title'),
        description: i18n.t('mission.degenScore.desc'),
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
        title: i18n.t('mission.degenCombo.title'),
        description: i18n.t('mission.degenCombo.desc'),
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
      title: i18n.t('mission.tier2.reward')
    }
  },
  {
    tier: 3,
    name: i18n.t('mission.tier3.name'),
    description: i18n.t('mission.tier3.desc'),
    requiredLevel: 5,
    missions: [
      {
        id: 'commander_score',
        title: i18n.t('mission.commanderScore.title'),
        description: i18n.t('mission.commanderScore.desc'),
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
        title: i18n.t('mission.commanderBear.title'),
        description: i18n.t('mission.commanderBear.desc'),
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
        title: i18n.t('mission.commanderPerfect.title'),
        description: i18n.t('mission.commanderPerfect.desc'),
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
        title: i18n.t('mission.commanderEnemies.title'),
        description: i18n.t('mission.commanderEnemies.desc'),
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
      title: i18n.t('mission.tier3.reward')
    }
  },
  {
    tier: 4,
    name: i18n.t('mission.tier4.name'),
    description: i18n.t('mission.tier4.desc'),
    requiredLevel: 10,
    missions: [
      {
        id: 'patriot_perfect_kills',
        title: i18n.t('mission.patriotPerfectKills.title'),
        description: i18n.t('mission.patriotPerfectKills.desc'),
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
        title: i18n.t('mission.patriotScore.title'),
        description: i18n.t('mission.patriotScore.desc'),
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
        title: i18n.t('mission.patriotPhases.title'),
        description: i18n.t('mission.patriotPhases.desc'),
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
        title: i18n.t('mission.patriotCombo.title'),
        description: i18n.t('mission.patriotCombo.desc'),
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
      title: i18n.t('mission.tier4.reward')
    }
  },
  {
    tier: 5,
    name: i18n.t('mission.tier5.name'),
    description: i18n.t('mission.tier5.desc'),
    requiredLevel: 20,
    missions: [
      {
        id: 'legend_million',
        title: i18n.t('mission.legendMillion.title'),
        description: i18n.t('mission.legendMillion.desc'),
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
        title: i18n.t('mission.legendFlawless.title'),
        description: i18n.t('mission.legendFlawless.desc'),
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
        title: i18n.t('mission.legendEnemies.title'),
        description: i18n.t('mission.legendEnemies.desc'),
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
      title: i18n.t('mission.tier5.reward')
    }
  }
];

// Daily/Weekly Mission Pool for rotation
export const MissionPool: Omit<Mission, 'progress' | 'completed'>[] = [
  {
    id: 'daily_bonk',
    title: i18n.t('mission.dailyBonk.title'),
    description: i18n.t('mission.dailyBonk.desc'),
    type: 'collect',
    target: 30,
    reward: { xp: 150 },
    tier: 0,
    emoji: '🟠'
  },
  {
    id: 'daily_burger',
    title: i18n.t('mission.dailyBurger.title'),
    description: i18n.t('mission.dailyBurger.desc'),
    type: 'collect',
    target: 5,
    reward: { xp: 200 },
    tier: 0,
    emoji: '🍔'
  },
  {
    id: 'daily_pumpfun',
    title: i18n.t('mission.dailyPumpfun.title'),
    description: i18n.t('mission.dailyPumpfun.desc'),
    type: 'kill',
    target: 5,
    reward: { xp: 150 },
    tier: 0,
    emoji: '💊'
  },
  {
    id: 'daily_fourmeme',
    title: i18n.t('mission.dailyFourmeme.title'),
    description: i18n.t('mission.dailyFourmeme.desc'),
    type: 'kill',
    target: 5,
    reward: { xp: 150 },
    tier: 0,
    emoji: '🤡'
  },
  {
    id: 'daily_quick',
    title: i18n.t('mission.dailyQuick.title'),
    description: i18n.t('mission.dailyQuick.desc'),
    type: 'score',
    target: 10000,
    reward: { xp: 250 },
    tier: 0,
    emoji: '⚡'
  },
  {
    id: 'daily_bear',
    title: i18n.t('mission.dailyBear.title'),
    description: i18n.t('mission.dailyBear.desc'),
    type: 'kill',
    target: 3,
    reward: { xp: 300 },
    tier: 0,
    emoji: '🐻'
  }
];
