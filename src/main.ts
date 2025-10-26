import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { StartScene } from './scenes/StartScene';
import { IntroScene } from './scenes/IntroScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { LeaderboardScene } from './scenes/LeaderboardScene';
import { HowToPlayScene } from './scenes/HowToPlayScene';
import { CreditsScene } from './scenes/CreditsScene';
import UIScene from './scenes/UIScene';
import UpgradeScene from './scenes/UpgradeScene';
import { GameConfig } from './config/GameConfig';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GameConfig.width,
  height: GameConfig.height,
  parent: 'game-container',
  backgroundColor: '#E8F4FF',
  fps: {
    target: 60,
    min: 30,
    forceSetTimeOut: true,  // Chrome fix: uses setTimeout instead of RAF
    deltaHistory: 10
  },
  render: {
    pixelArt: false,
    roundPixels: false,
    antialias: true,
    powerPreference: 'high-performance'  // Force Chrome to use dedicated GPU
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GameConfig.gravity, x: 0 },
      debug: false,
      fps: 60,
      timeScale: 1
    }
  },
  scene: [
    BootScene,
    PreloadScene,
    StartScene,
    IntroScene,
    GameScene,
    UIScene,
    GameOverScene,
    UpgradeScene,
    LeaderboardScene,
    HowToPlayScene,
    CreditsScene
  ]
};

const game = new Phaser.Game(config);

// Make game instance globally accessible for debugging
(window as any).game = game;

// Low FPS warning after 5 seconds
setTimeout(() => {
  const actualFps = Math.round(game.loop.actualFps);
  if (actualFps < 55) {
    console.warn('⚠️ Low FPS detected:', actualFps, 'FPS');
    console.warn('💡 Recommendations:');
    console.warn('   1. Use Safari instead of Chrome for 60 FPS on macOS');
    console.warn('   2. Enable Hardware Acceleration in Chrome settings');
    console.warn('   3. Check chrome://gpu to verify GPU acceleration');
    console.warn('   4. Close other browser tabs to free up resources');
  } else {
    console.log('✅ Good FPS:', actualFps, 'FPS');
  }
}, 5000);
