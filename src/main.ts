import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { StartScene } from './scenes/StartScene';
import { BuilderIntroScene } from './scenes/BuilderIntroScene';
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
  type: Phaser.AUTO,  // Let Phaser choose best renderer
  width: GameConfig.width,
  height: GameConfig.height,
  parent: 'game-container',
  backgroundColor: '#E8F4FF',
  fps: {
    target: 60,
    min: 30,
    forceSetTimeOut: false,  // v3.9.2: Use RAF (requestAnimationFrame) for better performance
    deltaHistory: 10,
    smoothStep: true,  // Smooth out frame time variations
    panicMax: 120  // Don't panic if frame takes longer than 120ms
  },
  render: {
    pixelArt: false,
    roundPixels: false,
    antialias: true,
    powerPreference: 'high-performance',  // Force Chrome to use dedicated GPU
    batchSize: 4096,  // v3.9.2: Increase batch size (default 2048) for more sprites per draw call
    maxTextures: 16,  // v3.9.2: Allow more textures (default 8) to reduce texture swaps
    mipmapFilter: 'LINEAR'  // Better texture filtering
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
    BuilderIntroScene,
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

// v3.9.2: Enhanced FPS monitoring and diagnostics
setTimeout(() => {
  const actualFps = Math.round(game.loop.actualFps);
  const avgDelta = game.loop.delta;

  console.log('🎮 FPS Report:');
  console.log('   Actual FPS:', actualFps);
  console.log('   Avg Frame Time:', avgDelta.toFixed(2) + 'ms (target: 16.67ms)');
  console.log('   Renderer:', game.renderer.type === Phaser.WEBGL ? 'WebGL' : 'Canvas');

  if (actualFps < 55) {
    console.warn('⚠️ Low FPS detected:', actualFps, 'FPS');
    console.warn('💡 Recommendations:');
    console.warn('   1. Try Safari instead of Chrome for 60 FPS on macOS');
    console.warn('   2. Enable Hardware Acceleration in Chrome settings');
    console.warn('   3. Check chrome://gpu to verify GPU acceleration');
    console.warn('   4. Close other browser tabs to free up resources');
    console.warn('   5. Disable browser extensions (especially crypto wallets)');
  } else {
    console.log('✅ Good FPS:', actualFps, 'FPS');
  }

  // CRITICAL PERFORMANCE FIX: Disable ALL console logging AFTER startup diagnostics
  // Console calls are EXPENSIVE and cause frame drops + timer skips!
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.error = () => {};  // DISABLED: Was causing timer to skip seconds!
}, 5000);
