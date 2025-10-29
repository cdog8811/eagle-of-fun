import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { LeaderboardService } from '../services/LeaderboardService';

export class GameOverScene extends Phaser.Scene {
  private nameInput: HTMLInputElement | null = null;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const score = this.registry.get('currentScore') || 0;
    const highScore = this.registry.get('highScore') || 0;
    const isNewHighScore = score === highScore && score > 0;

    // Background - clean white
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // Play Game Over music
    if (this.cache.audio.exists('game-over-music')) {
      this.sound.play('game-over-music', {
        volume: 0.4,
        loop: false
      });
    }

    // Dynamic spacing system - mehr Platz
    const spacing = 50;
    let currentY = 100;

    // Game Over title - wie StartScene
    const title = this.add.text(width / 2, currentY, 'GAME OVER', {
      fontSize: '72px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 8
    }).setOrigin(0.5);

    // Pulse animation for title
    this.tweens.add({
      targets: title,
      scale: 1.02,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    currentY += 70 + spacing;

    // Red underline
    const underline = this.add.graphics();
    underline.lineStyle(6, 0xE63946, 1);
    underline.lineBetween(width / 2 - 240, currentY, width / 2 + 240, currentY);

    currentY += spacing;

    // Jeeter sad animation - kleiner
    const jeeterY = currentY + 60;
    const eagleContainer = this.createSadEagle(width / 2, jeeterY);
    currentY = jeeterY + 100 + spacing;

    // Score display - kleiner, wie StartScene
    const scoreText = this.add.text(width / 2, currentY, `FINAL SCORE: ${score}`, {
      fontSize: '42px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0.5);
    currentY += 50 + 35;

    // Meme message based on score - kleiner
    let memeMessage = this.getMemeMessage(score);
    const memeText = this.add.text(width / 2, currentY, memeMessage, {
      fontSize: '28px',
      color: '#E63946',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);
    currentY += 35 + 35;

    if (isNewHighScore) {
      const newHighScoreText = this.add.text(width / 2, currentY, 'NEW HIGH SCORE!', {
        fontSize: '32px',
        color: '#00AA00',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        letterSpacing: 3
      }).setOrigin(0.5);

      // Pulse animation
      this.tweens.add({
        targets: newHighScoreText,
        scale: 1.05,
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      currentY += 40 + 35;
    } else {
      this.add.text(width / 2, currentY, `HIGH SCORE: ${highScore}`, {
        fontSize: '24px',
        color: '#666666',
        fontFamily: 'Arial',
        letterSpacing: 2
      }).setOrigin(0.5);
      currentY += 30 + 35;
    }

    // Name input prompt
    this.add.text(width / 2, currentY, 'ENTER YOUR NAME', {
      fontSize: '24px',
      color: '#666666',
      fontFamily: 'Arial',
      letterSpacing: 2
    }).setOrigin(0.5);
    currentY += 30 + 25;

    // Create HTML input field
    this.createNameInput(width / 2, currentY);
    currentY += 60 + 30;

    // Save Name Button
    this.createButton(width / 2, currentY, 'SAVE NAME', () => {
      this.saveName();
    });
    currentY += 44 + 50;

    // Buttons container - responsive positioning
    const buttonGroupY = Math.max(currentY, height - 150);

    this.createButton(width / 2 - 250, buttonGroupY, 'TRY AGAIN', () => {
      this.cleanupInput();
      this.sound.stopAll();

      // Skip UpgradeScene if upgrade system is disabled
      if (GameConfig.ENABLE_UPGRADE_SYSTEM) {
        this.scene.start('UpgradeScene');
      } else {
        this.scene.start('GameScene', { autoStart: true });
      }
    });

    this.createButton(width / 2 + 250, buttonGroupY, 'HALL OF DEGENS', () => {
      this.cleanupInput();
      this.sound.stopAll();
      this.scene.start('LeaderboardScene');
    });

    // v3.8: America.Fun Logo - bottom right (same as StartScene)
    const footerY = height - 30;
    const logo = this.add.image(0, footerY, 'america-logo');
    logo.setScale(0.36); // Same scale as StartScene
    logo.setAlpha(0.9);
    // Position logo so its right edge is 30px from screen edge
    logo.setX(width - (logo.width * 0.36 / 2) - 30);

    // Share button - positioned left bottom
    const shareBtn = this.add.text(width / 2 - 300, height - 60, 'SHARE ON X', {
      fontSize: '20px',
      color: '#666666',
      fontFamily: 'Arial',
      letterSpacing: 2
    }).setOrigin(0.5);
    shareBtn.setInteractive({ useHandCursor: true });
    shareBtn.on('pointerover', () => shareBtn.setColor('#E63946'));
    shareBtn.on('pointerout', () => shareBtn.setColor('#666666'));
    shareBtn.on('pointerdown', () => this.shareOnTwitter(score));

    // Back to menu text - positioned center bottom
    const backText = this.add.text(width / 2 + 300, height - 60, 'ESC = MAIN MENU', {
      fontSize: '20px',
      color: '#999999',
      fontFamily: 'Arial',
      letterSpacing: 2
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-ESC', () => {
      this.cleanupInput();
      this.sound.stopAll();
      this.scene.start('StartScene');
    });
  }

  private createSadEagle(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Use jeet.png image instead of graphics - bigger for 1920x1080
    const jeetImage = this.add.image(0, 0, 'jeet');
    jeetImage.setScale(0.5);

    container.add([jeetImage]);

    // Slight bobbing animation
    this.tweens.add({
      targets: container,
      y: y + 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return container;
  }

  private createNameInput(x: number, y: number): void {
    const canvas = this.sys.game.canvas;
    const rect = canvas.getBoundingClientRect();

    // Calculate scale factor for positioning
    const scaleX = rect.width / this.cameras.main.width;
    const scaleY = rect.height / this.cameras.main.height;

    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.maxLength = 15;
    this.nameInput.placeholder = 'Your Name';
    this.nameInput.style.position = 'absolute';

    // Center the input field properly for scaled canvas
    const inputWidth = 300;
    const inputHeight = 60;
    this.nameInput.style.left = `${rect.left + (x * scaleX) - (inputWidth / 2)}px`;
    this.nameInput.style.top = `${rect.top + (y * scaleY) - (inputHeight / 2)}px`;
    this.nameInput.style.width = `${inputWidth}px`;
    this.nameInput.style.height = `${inputHeight}px`;
    this.nameInput.style.fontSize = '28px';
    this.nameInput.style.textAlign = 'center';
    this.nameInput.style.border = '4px solid #000000';
    this.nameInput.style.borderRadius = '8px';
    this.nameInput.style.outline = 'none';
    this.nameInput.style.backgroundColor = '#FFFFFF';
    this.nameInput.style.fontFamily = 'Arial';
    this.nameInput.style.fontWeight = 'bold';
    this.nameInput.style.padding = '0';

    document.body.appendChild(this.nameInput);
    this.nameInput.focus();

    // Enter key to save
    this.nameInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.saveName();
      }
    });

    // Check for "Vesper" easter egg
    this.nameInput.addEventListener('input', () => {
      if (this.nameInput?.value.toLowerCase() === 'vesper') {
        this.unlockVesperSkin();
      }
    });
  }

  private async saveName(): Promise<void> {
    const name = this.nameInput?.value.trim() || 'Anonymous';
    const score = this.registry.get('currentScore') || 0;
    const level = this.registry.get('playerLevel') || 1;

    // v4.2: Save to online leaderboard
    const confirmText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'SAVING...',
      {
        fontSize: '48px',
        color: '#888888',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        letterSpacing: 2,
        align: 'center'
      }
    ).setOrigin(0.5);
    confirmText.setDepth(3000);

    // Submit to online leaderboard
    const response = await LeaderboardService.submitScore(name, score, level);

    if (response.success) {
      console.log('✅ Score submitted to online leaderboard:', response.entry);
      confirmText.setText('SAVED!\n\nLoading Leaderboard...');
      confirmText.setColor('#00AA00');
    } else {
      console.warn('⚠️ Failed to submit to online leaderboard:', response.error);
      confirmText.setText('SAVED LOCALLY!\n\nLoading Leaderboard...');
      confirmText.setColor('#FBB13C');

      // Fallback: Save to localStorage
      const leaderboardEntry = {
        name: name,
        score: score,
        date: new Date().toISOString()
      };

      const leaderboardJson = localStorage.getItem('eagleOfFun_leaderboard');
      let leaderboard = leaderboardJson ? JSON.parse(leaderboardJson) : [];
      leaderboard.push(leaderboardEntry);
      leaderboard.sort((a: any, b: any) => b.score - a.score);
      leaderboard = leaderboard.slice(0, 10);
      localStorage.setItem('eagleOfFun_leaderboard', JSON.stringify(leaderboard));
    }

    // Cleanup input
    this.cleanupInput();

    // Navigate to DonationScene after 2 seconds (v4.2: Show donation scene before leaderboard)
    this.time.delayedCall(2000, () => {
      this.sound.stopAll();
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('DonationScene');
      });
    });
  }

  private cleanupInput(): void {
    if (this.nameInput) {
      document.body.removeChild(this.nameInput);
      this.nameInput = null;
    }
  }

  private createButton(x: number, y: number, text: string, callback: () => void): void {
    const button = this.add.container(x, y);

    // Modern black button - bigger
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRoundedRect(-180, -35, 360, 70, 6);

    // Button text - bigger
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '28px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    button.setSize(360, 70);
    button.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(-180, -35, 360, 70),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true
    });

    // Hover effects
    button.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0xE63946, 1);
      bg.fillRoundedRect(-180, -35, 360, 70, 6);
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x000000, 1);
      bg.fillRoundedRect(-180, -35, 360, 70, 6);
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

  private shareOnTwitter(score: number): void {
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

  private unlockVesperSkin(): void {
    const unlockedSkins = this.registry.get('unlockedSkins') || ['default'];

    if (!unlockedSkins.includes('vesper')) {
      unlockedSkins.push('vesper');
      this.registry.set('unlockedSkins', unlockedSkins);
      localStorage.setItem('eagleOfFun_unlockedSkins', JSON.stringify(unlockedSkins));

      // Show unlock notification
      const notification = this.add.text(
        this.cameras.main.width / 2,
        520,
        'GOLDEN WINGS UNLOCKED',
        {
          fontSize: '18px',
          color: '#E63946',
          fontFamily: 'Arial',
          fontStyle: 'bold',
          letterSpacing: 2
        }
      ).setOrigin(0.5);

      this.tweens.add({
        targets: notification,
        alpha: 0,
        y: 500,
        duration: 2000,
        delay: 1000
      });
    }
  }

  private getMemeMessage(score: number): string {
    if (score >= 2000) return '🦅 CERTIFIED DEGEN PILOT 🦅';
    if (score >= 1000) return '🔥 FREEDOM SECURED! 🔥';
    if (score >= 500) return '💪 Not bad, Patriot!';
    if (score >= 200) return '📈 WAGMI';
    if (score >= 100) return '👀 Keep stacking!';
    return '😅 You got Jeeted, bro.';
  }

  shutdown(): void {
    this.cleanupInput();

    // v3.8: Additional cleanup
    this.tweens.killAll();
    this.sound.stopAll();
    this.input.keyboard?.off('keydown-ESC');
  }
}
