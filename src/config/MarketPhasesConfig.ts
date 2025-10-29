// Eagle of Fun v3.5 - Market Phases Configuration

import { getI18n } from '../systems/i18n';

const i18n = getI18n();

export interface MarketPhase {
  name: string;
  theme: string;
  minTime: number; // seconds
  maxTime: number; // seconds
  minScore: number;
  maxScore: number;
  coinSpawnModifier: number; // multiplier
  enemySpawnModifier: number; // multiplier
  speedModifier: number;
  tickerColor: number; // hex color
  tickerMessage: string;
  backgroundFilter?: number; // tint for dark filter
  audioTrack?: string;
}

export const MARKET_PHASES: { [key: string]: MarketPhase } = {
  BULL_RUN: {
    name: 'Bull Run',
    theme: 'Euphoria',
    minTime: 0,
    maxTime: 60,
    minScore: 0,
    maxScore: 500,
    coinSpawnModifier: 1.25, // +25% coins
    enemySpawnModifier: 0.8, // -20% enemies
    speedModifier: 1.0,
    tickerColor: 0x00FF00, // Green
    tickerMessage: i18n.t('marketPhase.bullRun'),
    audioTrack: 'background-music'
  },

  CORRECTION: {
    name: 'Correction',
    theme: 'Reality sets in',
    minTime: 60,
    maxTime: 120,
    minScore: 500,
    maxScore: 1500,
    coinSpawnModifier: 0.85, // -15% coins
    enemySpawnModifier: 1.2, // +20% enemies
    speedModifier: 1.3,
    tickerColor: 0xFFFF00, // Yellow
    tickerMessage: i18n.t('marketPhase.correction'),
    audioTrack: 'background-music'
  },

  BEAR_TRAP: {
    name: 'Bear Trap',
    theme: 'Panic',
    minTime: 120,
    maxTime: 180,
    minScore: 1500,
    maxScore: 3000,
    coinSpawnModifier: 0.75, // -25% coins
    enemySpawnModifier: 1.5, // +50% enemies
    speedModifier: 1.6,
    tickerColor: 0xFF0000, // Red
    tickerMessage: i18n.t('marketPhase.bearTrap'),
    backgroundFilter: 0x8B0000, // Dark red tint
    audioTrack: 'background-music-2'
  },

  SIDEWAYS: {
    name: 'Sideways Phase',
    theme: 'Market breathes',
    minTime: 180,
    maxTime: 240,
    minScore: 3000,
    maxScore: 4000,
    coinSpawnModifier: 1.0, // balanced
    enemySpawnModifier: 1.0, // balanced
    speedModifier: 1.4,
    tickerColor: 0xADD8E6, // Light blue
    tickerMessage: i18n.t('marketPhase.sideways'),
    audioTrack: 'background-music'
  },

  VALOR_COMEBACK: {
    name: 'Valor Comeback',
    theme: 'Heroic',
    minTime: 240,
    maxTime: 600,
    minScore: 4000,
    maxScore: 999999,
    coinSpawnModifier: 1.5, // +50% coins
    enemySpawnModifier: 1.3, // +30% enemies but manageable
    speedModifier: 2.0,
    tickerColor: 0xFFD700, // Gold
    tickerMessage: i18n.t('marketPhase.valorComeback'),
    audioTrack: 'background-music'
  },

  ENDLESS_WAGMI: {
    name: 'Endless WAGMI',
    theme: 'Chaos',
    minTime: 600,
    maxTime: 999999,
    minScore: 999999,
    maxScore: 9999999,
    coinSpawnModifier: 1.2,
    enemySpawnModifier: 2.0, // extreme
    speedModifier: 2.5, // max speed
    tickerColor: 0xFF00FF, // Magenta
    tickerMessage: i18n.t('marketPhase.endlessWagmi'),
    audioTrack: 'background-music-2'
  }
};

// Micro-Events System
export interface MicroEvent {
  name: string;
  message: string;
  duration: number; // ms
  effect: string;
  probability: number; // 0-100
}

export const MICRO_EVENTS: MicroEvent[] = [
  {
    name: 'Elon Tweet',
    message: i18n.t('microEvent.elonTweet'),
    duration: 5000,
    effect: 'coinSpawn3x',
    probability: 5
  },
  {
    name: 'SEC Down',
    message: i18n.t('microEvent.secDown'),
    duration: 5000,
    effect: 'enemyPause',
    probability: 3
  },
  {
    name: 'Market Pump',
    message: i18n.t('microEvent.marketPump'),
    duration: 10000,
    effect: 'coinRain',
    probability: 4
  },
  {
    name: 'Burger Friday',
    message: i18n.t('microEvent.burgerFriday'),
    duration: 10000,
    effect: 'xpDouble',
    probability: 6
  },
  {
    name: 'Valor Drop',
    message: i18n.t('microEvent.valorDrop'),
    duration: 10000,
    effect: 'guaranteedFeather',
    probability: 2
  }
];

// Phase determination logic
export function determinePhase(gameTime: number, score: number): string {
  // Check time-based phases first
  if (gameTime >= 600) return 'ENDLESS_WAGMI';
  if (gameTime >= 240) return 'VALOR_COMEBACK';
  if (gameTime >= 180) return 'SIDEWAYS';
  if (gameTime >= 120) return 'BEAR_TRAP';
  if (gameTime >= 60) return 'CORRECTION';
  return 'BULL_RUN';
}
