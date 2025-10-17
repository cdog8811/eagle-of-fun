import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CreditsScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    this.cameras.main.setBackgroundColor('#E8F4FF');

    // Title
    this.add.text(width / 2, 80, '❤️ Credits', {
      fontSize: '48px',
      color: GameConfig.colors.primary,
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Game logo
    this.add.text(width / 2, 150, '🦅', {
      fontSize: '64px'
    }).setOrigin(0.5);

    // Credits content
    const credits = [
      { title: 'Game Design', content: 'America.Fun Community' },
      { title: 'Development', content: 'Built with Phaser.js & TypeScript' },
      { title: 'Inspired by', content: 'The Meme Economy & Freedom' },
      { title: 'Special Thanks', content: 'All the Degens & Patriots' },
      { title: 'Tokens Featured', content: '$AOL • $BURGER • $USD1' }
    ];

    let yPos = 240;
    credits.forEach((credit) => {
      this.add.text(width / 2, yPos, credit.title, {
        fontSize: '20px',
        color: GameConfig.colors.secondary,
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      this.add.text(width / 2, yPos + 25, credit.content, {
        fontSize: '16px',
        color: '#666666',
        fontFamily: 'Arial'
      }).setOrigin(0.5);

      yPos += 70;
    });

    // Version
    this.add.text(width / 2, height - 60, 'Version 1.0.0', {
      fontSize: '14px',
      color: '#999999',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Back button
    this.createButton(width / 2, height - 25, '← Back to Menu', () => {
      this.scene.start('StartScene');
    });

    // ESC to return
    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.start('StartScene');
    });
  }

  private createButton(x: number, y: number, text: string, callback: () => void): void {
    const button = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(0xFFFFFF, 1);
    bg.fillRoundedRect(-100, -18, 200, 36, 8);
    bg.lineStyle(2, 0x0033A0, 1);
    bg.strokeRoundedRect(-100, -18, 200, 36, 8);

    const buttonText = this.add.text(0, 0, text, {
      fontSize: '16px',
      color: '#0033A0',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    button.setSize(200, 36);
    button.setInteractive(new Phaser.Geom.Rectangle(-100, -18, 200, 36), Phaser.Geom.Rectangle.Contains);

    button.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0xFBB13C, 1);
      bg.fillRoundedRect(-100, -18, 200, 36, 8);
      bg.lineStyle(2, 0x0033A0, 1);
      bg.strokeRoundedRect(-100, -18, 200, 36, 8);
      buttonText.setColor('#FFFFFF');
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0xFFFFFF, 1);
      bg.fillRoundedRect(-100, -18, 200, 36, 8);
      bg.lineStyle(2, 0x0033A0, 1);
      bg.strokeRoundedRect(-100, -18, 200, 36, 8);
      buttonText.setColor('#0033A0');
    });

    button.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: callback
      });
    });
  }
}
