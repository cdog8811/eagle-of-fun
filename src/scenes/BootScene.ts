import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Load any assets needed for the loading screen
    // For now, we'll just set up basic configurations
  }

  create(): void {
    // Initialize game data
    this.initializeGameData();

    // Move to preload scene
    this.scene.start('PreloadScene');
  }

  private initializeGameData(): void {
    // Initialize local storage for game data
    if (!localStorage.getItem('eagleOfFun_highScore')) {
      localStorage.setItem('eagleOfFun_highScore', '0');
    }

    if (!localStorage.getItem('eagleOfFun_unlockedSkins')) {
      localStorage.setItem('eagleOfFun_unlockedSkins', JSON.stringify(['default']));
    }

    if (!localStorage.getItem('eagleOfFun_currentSkin')) {
      localStorage.setItem('eagleOfFun_currentSkin', 'default');
    }

    // Initialize game registry
    this.registry.set('highScore', parseInt(localStorage.getItem('eagleOfFun_highScore') || '0'));
    this.registry.set('currentScore', 0);
    this.registry.set('unlockedSkins', JSON.parse(localStorage.getItem('eagleOfFun_unlockedSkins') || '["default"]'));
    this.registry.set('currentSkin', localStorage.getItem('eagleOfFun_currentSkin') || 'default');
    this.registry.set('soundEnabled', true);
    this.registry.set('musicEnabled', true);
  }
}
