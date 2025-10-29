import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { LeaderboardService, LeaderboardEntry as APILeaderboardEntry } from '../services/LeaderboardService';

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  title: string;
  level?: number;
}

export class LeaderboardScene extends Phaser.Scene {
  private loadingText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background - clean white
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // Play Leaderboard music
    if (this.cache.audio.exists('leaderboard-music')) {
      this.sound.play('leaderboard-music', {
        volume: 0.4,
        loop: true
      });
    }

    // v3.8: America.Fun Logo - bottom right (same as StartScene)
    const footerY = height - 30;
    const logo = this.add.image(0, footerY, 'america-logo');
    logo.setScale(0.36); // Same scale as StartScene
    logo.setAlpha(0.9);
    // Position logo so its right edge is 30px from screen edge
    logo.setX(width - (logo.width * 0.36 / 2) - 30);

    // Title - professional, bigger
    this.add.text(width / 2, 150, 'HALL OF DEGENS', {
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

    // Show loading text
    this.loadingText = this.add.text(width / 2, height / 2, 'Loading leaderboard...', {
      fontSize: '32px',
      color: '#888888',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Load leaderboard from API (v4.2: Online leaderboard)
    this.loadOnlineLeaderboard(width, localHighScore);

    // Buttons - professional, better positioned
    this.createButton(width / 2 - 250, height - 100, 'PLAY AGAIN', () => {
      this.sound.stopAll();

      // Skip UpgradeScene if upgrade system is disabled
      if (GameConfig.ENABLE_UPGRADE_SYSTEM) {
        this.scene.start('UpgradeScene');
      } else {
        this.scene.start('GameScene', { autoStart: true });
      }
    });

    this.createButton(width / 2 + 250, height - 100, 'MAIN MENU', () => {
      this.sound.stopAll();
      this.scene.start('StartScene');
    });

    // Share on X button - positioned center
    const shareBtn = this.add.text(width / 2, height - 150, 'SHARE ON X', {
      fontSize: '20px',
      color: '#666666',
      fontFamily: 'Arial',
      letterSpacing: 2,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    shareBtn.setInteractive({ useHandCursor: true });
    shareBtn.on('pointerover', () => shareBtn.setColor('#E63946'));
    shareBtn.on('pointerout', () => shareBtn.setColor('#666666'));
    shareBtn.on('pointerdown', () => this.shareOnX(localHighScore));

    // Community text links - centered, same height as logo
    const communityLinkSpacing = 180;

    this.createCommunityLink(width / 2 - communityLinkSpacing, footerY, 'Telegram (EN)', 'https://t.me/official_america_dot_fun');
    this.createCommunityLink(width / 2, footerY, 'Telegram (CN)', 'https://t.me/americafunchinese');
    this.createCommunityLink(width / 2 + communityLinkSpacing, footerY, 'America.Fun', 'https://www.america.fun/');

    this.input.keyboard?.on('keydown-ESC', () => {
      this.sound.stopAll();
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
    button.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(-130, -22, 260, 44),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true
    });

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

  /**
   * v4.2: Load online leaderboard from Vercel Postgres API
   */
  private async loadOnlineLeaderboard(width: number, localHighScore: number): Promise<void> {
    try {
      const response = await LeaderboardService.fetchLeaderboard(100);

      // Hide loading text
      if (this.loadingText) {
        this.loadingText.destroy();
      }

      if (response.success && response.leaderboard && response.leaderboard.length > 0) {
        // Convert API entries to display format
        const leaderboardData: LeaderboardEntry[] = response.leaderboard.map((entry, index) => ({
          rank: index + 1,
          name: entry.player_name,
          score: entry.score,
          level: entry.level,
          title: this.getTitleForScore(entry.score)
        }));

        // Limit to top 7 entries
        const topEntries = leaderboardData.slice(0, 7);

        // Draw leaderboard
        this.drawLeaderboard(width / 2, 320, topEntries, localHighScore);
      } else {
        // Fallback to local leaderboard if API fails
        this.loadLocalLeaderboard(width, localHighScore);
      }
    } catch (error) {
      console.error('Error loading online leaderboard:', error);

      // Hide loading text
      if (this.loadingText) {
        this.loadingText.destroy();
      }

      // Fallback to local leaderboard
      this.loadLocalLeaderboard(width, localHighScore);
    }
  }

  /**
   * Fallback: Load leaderboard from localStorage
   */
  private loadLocalLeaderboard(width: number, localHighScore: number): void {
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

    // Limit to top 7 entries
    const topEntries = leaderboardData.slice(0, 7);

    // Draw leaderboard
    this.drawLeaderboard(width / 2, 320, topEntries, localHighScore);

    // Show "Local Scores Only" message
    this.add.text(width / 2, 280, '(Local Scores - Online leaderboard unavailable)', {
      fontSize: '18px',
      color: '#999999',
      fontFamily: 'Arial',
      fontStyle: 'italic'
    }).setOrigin(0.5);
  }

  private createCommunityLink(x: number, y: number, text: string, url: string): void {
    const link = this.add.text(x, y, text, {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'Arial',
      letterSpacing: 1
    }).setOrigin(0.5);

    link.setInteractive({ useHandCursor: true });

    // Hover effects - same as StartScene
    link.on('pointerover', () => {
      link.setColor('#E63946'); // Red hover
      this.tweens.add({
        targets: link,
        scale: 1.05,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });

    link.on('pointerout', () => {
      link.setColor('#888888');
      this.tweens.add({
        targets: link,
        scale: 1,
        duration: 200
      });
    });

    link.on('pointerdown', () => {
      window.open(url, '_blank');
    });
  }

  private shareOnX(score: number): void {
    const text = `Built by a guy with 0 game-dev experience,
still more fun than half the coins I bought 💀

Scored ${score} points in Eagle of Fun 🦅

For the culture. For the memes. For America.Fun 🇺🇸

Play it. Laugh. Lose. Repeat.

🦅 https://eagle-of-fun.vercel.app/

$AOL #EagleOfFun #AmericaFun #ForTheCulture`;
    const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;

    window.open(xUrl, '_blank');
  }

  shutdown(): void {
    this.input.keyboard?.off('keydown-ESC');
    this.tweens.killAll();
    this.sound.stopAll();
  }
}
