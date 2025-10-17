import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  private loadingText!: Phaser.GameObjects.Text;
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.createLoadingScreen();

    // Load game images
    this.load.image('player-eagle', 'assets/images/player-eagle.png');
    this.load.image('coin-aol', 'assets/images/token_aol.png');
    this.load.image('coin-burger', 'assets/images/Token_Burger.png');
    this.load.image('jeet', 'assets/images/jeet.png');
    this.load.image('america-logo', 'assets/images/americalogo.png');

    // Load audio (will be replaced with actual assets)
    // this.load.audio('theme', 'assets/audio/theme.mp3');
    // this.load.audio('flap', 'assets/audio/flap.mp3');
    // this.load.audio('coin', 'assets/audio/coin.mp3');
    // this.load.audio('gameOver', 'assets/audio/game-over.mp3');
    // this.load.audio('buyback', 'assets/audio/buyback.mp3');

    // Load progress
    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xFBB13C, 1);
      this.progressBar.fillRect(250, 280, 300 * value, 30);
      this.loadingText.setText(`Loading: ${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
    });
  }

  create(): void {
    // Move to start scene
    this.scene.start('StartScene');
  }

  private createLoadingScreen(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading: 0%', {
      fontSize: '24px',
      color: '#0033A0',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Progress bar background
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0xFFFFFF, 0.8);
    this.progressBox.fillRect(240, 270, 320, 50);

    // Progress bar
    this.progressBar = this.add.graphics();

    // Title
    this.add.text(width / 2, 100, '🦅 Eagle of Fun', {
      fontSize: '48px',
      color: '#E63946',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Tagline
    this.add.text(width / 2, 160, 'Avoid the FUD. Stack the $AOL. Be the Meme.', {
      fontSize: '16px',
      color: '#0033A0',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }
}
