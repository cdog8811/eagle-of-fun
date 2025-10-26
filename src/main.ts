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
    forceSetTimeOut: false
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GameConfig.gravity, x: 0 },
      debug: false
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
