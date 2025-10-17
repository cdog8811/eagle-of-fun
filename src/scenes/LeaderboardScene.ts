import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  title: string;
}

export class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background - clean white
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // America.Fun Logo - bigger with pulse
    const logo = this.add.image(width - 150, height - 80, 'america-logo');
    logo.setScale(0.3);
    logo.setAlpha(0.9);

    // Pulse animation for logo
    this.tweens.add({
      targets: logo,
      scale: 0.32,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Title - professional, bigger
    this.add.text(width / 2, 150, 'LEADERBOARD', {
      fontSize: '96px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 8
    }).setOrigin(0.5);

    // Underline
    const underline = this.add.graphics();
    underline.fillStyle(0xE63946, 1);
    underline.fillRect(width / 2 - 320, 230, 640, 6);

    // Get local high score
    const localHighScore = this.registry.get('highScore') || 0;

    // Load leaderboard from localStorage
    const leaderboardJson = localStorage.getItem('eagleOfFun_leaderboard');
    let leaderboardData: LeaderboardEntry[] = [];

    if (leaderboardJson) {
      const savedLeaderboard = JSON.parse(leaderboardJson);
      leaderboardData = savedLeaderboard.map((entry: any, index: number) => ({
        rank: index + 1,
        name: entry.name,
        score: entry.score,
        title: this.getTitleForScore(entry.score)
      }));
    }

    // If leaderboard is empty, show placeholder data
    if (leaderboardData.length === 0) {
      leaderboardData = [
        { rank: 1, name: 'Play to be first!', score: 0, title: 'No scores yet' }
      ];
    }

    // Limit to top 7 entries to avoid overlap with buttons
    const topEntries = leaderboardData.slice(0, 7);

    // Draw leaderboard - adjusted Y position for better spacing
    this.drawLeaderboard(width / 2, 320, topEntries, localHighScore);

    // Buttons - professional, better positioned
    this.createButton(width / 2 - 250, height - 100, 'PLAY AGAIN', () => {
      this.scene.start('GameScene');
    });

    this.createButton(width / 2 + 250, height - 100, 'MAIN MENU', () => {
      this.scene.start('StartScene');
    });

    // Back instruction - repositioned to avoid overlap
    this.add.text(width / 2, height - 30, 'ESC = BACK', {
      fontSize: '20px',
      color: '#999999',
      fontFamily: 'Arial',
      letterSpacing: 2
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.start('StartScene');
    });
  }

  private drawLeaderboard(x: number, y: number, data: LeaderboardEntry[], localScore: number): void {
    const startY = y;
    const lineHeight = 80;  // Increased for 1920x1080

    data.forEach((entry, index) => {
      const posY = startY + (index * lineHeight);
      const isLocalPlayer = entry.name === 'You';

      // Clean background box - minimal design
      const bg = this.add.graphics();

      // Top 3 get subtle color accent
      if (entry.rank === 1) {
        bg.fillStyle(0xE63946, 0.05); // Red tint
      } else if (entry.rank === 2) {
        bg.fillStyle(0x000000, 0.03); // Light gray
      } else if (entry.rank === 3) {
        bg.fillStyle(0xFBB13C, 0.05); // Gold tint
      } else {
        bg.fillStyle(0x000000, 0.02);
      }

      bg.fillRect(x - 600, posY - 30, 1200, 70);  // Bigger for higher res

      // Subtle divider line
      bg.lineStyle(1, 0x000000, 0.1);
      bg.lineBetween(x - 600, posY + 40, x + 600, posY + 40);

      if (isLocalPlayer) {
        bg.lineStyle(3, 0xE63946, 1);
        bg.strokeRect(x - 600, posY - 30, 1200, 70);
      }

      // Rank - clean numbers, bigger for 1920x1080
      const rankColor = entry.rank <= 3 ? '#E63946' : '#000000';
      this.add.text(x - 560, posY, `#${entry.rank}`, {
        fontSize: '32px',
        color: rankColor,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        letterSpacing: 1
      }).setOrigin(0, 0.5);

      // Name - uppercase, bigger
      this.add.text(x - 460, posY, entry.name.toUpperCase(), {
        fontSize: '28px',
        color: isLocalPlayer ? '#E63946' : '#000000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        letterSpacing: 1
      }).setOrigin(0, 0.5);

      // Score - prominent, bigger
      this.add.text(x + 250, posY, entry.score.toString(), {
        fontSize: '36px',
        color: '#000000',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      // Title - subtle, bigger
      this.add.text(x + 420, posY, entry.title, {
        fontSize: '20px',
        color: '#999999',
        fontFamily: 'Arial',
        letterSpacing: 1
      }).setOrigin(0, 0.5);
    });
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
      letterSpacing: 2
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    button.setSize(260, 44);
    button.setInteractive(new Phaser.Geom.Rectangle(-130, -22, 260, 44), Phaser.Geom.Rectangle.Contains);

    button.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0xE63946, 1);
      bg.fillRoundedRect(-130, -22, 260, 44, 4);
      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x000000, 1);
      bg.fillRoundedRect(-130, -22, 260, 44, 4);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      });
    });

    button.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scaleX: 0.98,
        scaleY: 0.98,
        duration: 100,
        yoyo: true,
        onComplete: callback
      });
    });
  }

  private getTitleForScore(score: number): string {
    if (score >= 10000) return 'Buyback Emperor';
    if (score >= 5000) return 'FUD Destroyer';
    if (score >= 3000) return 'Juicy Patriot';
    if (score >= 2000) return 'Sky Warrior';
    if (score >= 1000) return 'Coin Collector';
    if (score >= 500) return 'Rising Star';
    if (score >= 100) return 'Eagle Scout';
    return 'Rookie Degen';
  }
}
