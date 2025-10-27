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

    // v3.8: America.Fun Logo - bottom right (same as StartScene)
    const footerY = height - 30;
    const logo = this.add.image(0, footerY, 'america-logo');
    logo.setScale(0.36); // Same scale as StartScene
    logo.setAlpha(0.9);
    // Position logo so its right edge is 30px from screen edge
    logo.setX(width - (logo.width * 0.36 / 2) - 30);

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

    // Instructions - v3.8 UPDATED (Current Mechanics)
    const instructions = [
      {
        number: '1',
        title: 'CONTROLS',
        text: 'SPACE = Fly/Glide • P = Pause\nQ/W/E = Shoot (Forward/Up/Down when weapon unlocked)'
      },
      {
        number: '2',
        title: 'COINS & SCORING',
        text: '$BONK = 1pt • $AOL = 5pts • $BURGER = 3pts\nCollect coins to gain XP and charge weapon energy!'
      },
      {
        number: '3',
        title: 'WEAPONS & COMBAT',
        text: 'Unlock weapons by leveling up (XP)\nShoot enemies with Q/W/E • Energy recharges from coins'
      },
      {
        number: '4',
        title: 'ENEMIES & BOSSES',
        text: 'Destroy enemies with weapons or avoid them\nBoss appears at 5000 score - find the weakpoint!'
      },
      {
        number: '5',
        title: 'POWER-UPS',
        text: '5x BURGER = Magnet Mode • Shield = 10s protection\nBandana = Speed boost • Collect for advantages!'
      },
      {
        number: '6',
        title: 'PROGRESSION',
        text: 'Earn XP → Level Up → Upgrade Hall → Choose Upgrades\nComplete daily missions for bonus rewards!'
      },
      {
        number: '7',
        title: 'MARKET PHASES',
        text: 'Bull Run = More coins • Bear Market = Harder enemies\nCrash/Rally = Chaos mode • Adapt to survive!'
      }
    ];

    let yPos = 170;
    instructions.forEach((instruction) => {
      this.createInstructionCard(width / 2, yPos, instruction.number, instruction.title, instruction.text);
      yPos += 85; // Slightly smaller spacing for 7 items
    });

    // Pro tip - updated for v3.8
    this.add.text(width / 2, height - 100, 'PRO TIP: UPGRADE IN THE HALL AFTER EACH RUN!', {
      fontSize: '14px',
      color: '#E63946',
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

    // Background - subtle, clean (slightly smaller for 7 items)
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.03);
    bg.fillRoundedRect(-500, -32, 1000, 72, 4);

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

  shutdown(): void {
    // v3.8 CRITICAL FIX: Remove keyboard event listeners to prevent memory leaks!
    this.input.keyboard?.removeAllListeners();
    this.tweens.killAll();
    this.sound.stopAll();
  }
}
