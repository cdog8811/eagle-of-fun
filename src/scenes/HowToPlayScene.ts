import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

export class HowToPlayScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HowToPlayScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background - clean white
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // America.Fun Logo - bottom right corner
    const logo = this.add.image(width - 80, height - 40, 'america-logo');
    logo.setScale(0.15);
    logo.setAlpha(0.9);

    // Title - professional
    const title = this.add.text(width / 2, 80, 'HOW TO PLAY', {
      fontSize: '56px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 4
    }).setOrigin(0.5);

    // Red underline
    const underline = this.add.graphics();
    underline.lineStyle(4, 0xE63946, 1);
    underline.lineBetween(width / 2 - 200, 120, width / 2 + 200, 120);

    // Instructions - UPDATED
    const instructions = [
      {
        number: '1',
        title: 'CONTROLS',
        text: 'Click, Tap or SPACE to fly • P = Pause\nAvoid Jeeters and collect coins!'
      },
      {
        number: '2',
        title: 'ENEMIES',
        text: 'Jeeters fly towards you from the right\nTouch any Jeeter = GAME OVER'
      },
      {
        number: '3',
        title: 'COLLECTIBLES',
        text: '$AOL = 5 points • $BURGER = 3 points\nCollect as many as you can!'
      },
      {
        number: '4',
        title: 'POWER-UPS',
        text: '5x Burgers = Magnet Mode (5s)\n250 points = Shield Powerup (10s protection)'
      },
      {
        number: '5',
        title: 'GOAL',
        text: 'Survive as long as possible • Beat the high score\nThe longer you fly, the faster it gets!'
      }
    ];

    let yPos = 180;
    instructions.forEach((instruction) => {
      this.createInstructionCard(width / 2, yPos, instruction.number, instruction.title, instruction.text);
      yPos += 95;
    });

    // Pro tip - clean design, updated
    this.add.text(width / 2, height - 100, 'PRO TIP: STACK BURGERS FOR MAGNET POWER!', {
      fontSize: '14px',
      color: '#FBB13C',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 1
    }).setOrigin(0.5);

    // Back button
    this.createButton(width / 2, height - 50, 'BACK TO MENU', () => {
      this.scene.start('StartScene');
    });

    // ESC to return
    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.start('StartScene');
    });
  }

  private createInstructionCard(x: number, y: number, number: string, title: string, text: string): void {
    const card = this.add.container(x, y);

    // Background - subtle, clean
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.03);
    bg.fillRoundedRect(-500, -35, 1000, 80, 4);

    // Number marker - red circle
    const numberBg = this.add.graphics();
    numberBg.fillStyle(0xE63946, 1);
    numberBg.fillCircle(-450, 0, 20);

    const numberText = this.add.text(-450, 0, number, {
      fontSize: '18px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Title
    const titleText = this.add.text(-400, -15, title, {
      fontSize: '20px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0, 0.5);

    // Description
    const descText = this.add.text(-400, 15, text, {
      fontSize: '15px',
      color: '#666666',
      fontFamily: 'Arial',
      lineSpacing: 5
    }).setOrigin(0, 0.5);

    card.add([bg, numberBg, numberText, titleText, descText]);
  }

  private createButton(x: number, y: number, text: string, callback: () => void): void {
    const button = this.add.container(x, y);

    // Modern black button
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRoundedRect(-130, -22, 260, 44, 4);

    const buttonText = this.add.text(0, 0, text, {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 1
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    button.setSize(260, 44);
    button.setInteractive(new Phaser.Geom.Rectangle(-130, -22, 260, 44), Phaser.Geom.Rectangle.Contains);

    // Hover effects
    button.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0xE63946, 1);
      bg.fillRoundedRect(-130, -22, 260, 44, 4);
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x000000, 1);
      bg.fillRoundedRect(-130, -22, 260, 44, 4);
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
