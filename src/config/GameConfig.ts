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

  // Scoring
  pointsPerSecond: 1,
  coinPoints: {
    AOL: 5,
    BURGER: 3,
    USD1: 2
  },
  fudWallBonus: 10,

  // Power-ups
  powerupDuration: 5000, // milliseconds
  buybackMagnetRadius: 150,

  // Colors (America.Fun theme)
  colors: {
    primary: '#E63946',    // Red
    secondary: '#0033A0',  // Blue
    gold: '#FBB13C',       // Gold
    white: '#FFFFFF',
    lightBlue: '#E8F4FF'
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
