import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

export class StartScene extends Phaser.Scene {
  private fallingCoins: Phaser.GameObjects.Graphics[] = [];
  private musicStarted: boolean = false;

  constructor() {
    super({ key: 'StartScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Clean white background
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // v3.9.2: Start music immediately (browser will allow after first user interaction)
    // Music will auto-start when scene loads
    this.time.delayedCall(100, () => {
      this.tryAutoplayMusic();
    });

    // Fallback: Resume audio context on ANY interaction (required by browsers)
    this.input.on('pointerdown', () => {
      this.startMusicIfNeeded();
    });

    // Minimal floating elements
    this.createMinimalElements();

    // Title - clean, professional, bigger and more centered
    const title = this.add.text(width / 2, 200, 'EAGLE OF FUN', {
      fontSize: '96px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 8
    }).setOrigin(0.5);

    // Subtle underline
    const underline = this.add.graphics();
    underline.fillStyle(0xE63946, 1);
    underline.fillRect(width / 2 - 280, 270, 560, 6);

    // Tagline - sophisticated
    this.add.text(width / 2, 310, 'STACK. SURVIVE. DOMINATE.', {
      fontSize: '28px',
      color: '#666666',
      fontFamily: 'Arial',
      letterSpacing: 4
    }).setOrigin(0.5);

    // Eagle image in center - bigger
    const eagleSprite = this.add.image(width / 2, 480, 'player-eagle');
    eagleSprite.setScale(0.6);

    // Subtle hover animation
    this.tweens.add({
      targets: eagleSprite,
      y: 470,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Buttons (better spacing, more centered)
    const buttonY = 680;
    const buttonSpacing = 90;

    this.createButton(width / 2, buttonY, '▶️ Start Flight', () => {
      // v3.9.2: Ensure music starts on first interaction
      this.startMusicIfNeeded();

      // Stop menu music before starting intro
      this.sound.stopByKey('menu-music');
      // Play "ready for takeoff" sound
      this.sound.play('ready-for-takeoff', { volume: 0.7 });
      // Wait 2 seconds before starting intro scene
      this.time.delayedCall(2000, () => {
        this.scene.start('IntroScene');
      });
    });

    this.createButton(width / 2, buttonY + buttonSpacing, '🏆 Hall of Degens', () => {
      // Stop menu music before going to Hall of Degens
      this.sound.stopByKey('menu-music');
      this.scene.start('LeaderboardScene');
    });

    this.createButton(width / 2, buttonY + buttonSpacing * 2, 'ℹ️ How to Play', () => {
      // Stop menu music before going to how to play
      this.sound.stopByKey('menu-music');
      this.scene.start('HowToPlayScene');
    });

    // High score display - center
    const highScore = this.registry.get('highScore') || 0;
    this.add.text(width / 2, height - 90, `BEST: ${highScore}`, {
      fontSize: '24px',
      color: '#999999',
      fontFamily: 'Arial',
      letterSpacing: 2
    }).setOrigin(0.5);

    // Footer Container - Text links, Logo rechts, auf einer Linie
    const footerY = height - 30;

    // Credit text - bottom left
    this.add.text(30, footerY, 'Made by Cdog for the america.fun Community', {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Arial',
      letterSpacing: 1
    }).setOrigin(0, 0.5);

    // America.Fun Logo - bottom right, bigger (+20%)
    const logo = this.add.image(0, footerY, 'america-logo');
    logo.setScale(0.36); // 0.3 * 1.2 = 0.36
    logo.setAlpha(0.9);
    // Position logo so its right edge is 30px from screen edge
    logo.setX(width - (logo.width * 0.36 / 2) - 30);

    // Easter egg: Listen for "1776" input
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      this.handleEasterEggInput(event.key);
    });
  }

  update(): void {
    // Minimal animations - no distracting elements
  }

  private createButton(x: number, y: number, text: string, callback: () => void): void {
    const button = this.add.container(x, y);

    // Modern minimal button - bigger
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRoundedRect(-200, -35, 400, 70, 6);

    // Remove emoji, clean text
    const cleanText = text.replace(/[^\w\s]/gi, '').trim();
    const buttonText = this.add.text(0, 0, cleanText.toUpperCase(), {
      fontSize: '28px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    button.setSize(400, 70);
    button.setInteractive(new Phaser.Geom.Rectangle(-200, -35, 400, 70), Phaser.Geom.Rectangle.Contains);

    // Elegant hover effect
    button.on('pointerover', () => {
      this.sound.play('hover-button', { volume: 0.3 });
      bg.clear();
      bg.fillStyle(0xE63946, 1);
      bg.fillRoundedRect(-200, -35, 400, 70, 6);
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
      bg.fillRoundedRect(-200, -35, 400, 70, 6);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      });
    });

    button.on('pointerdown', () => {
      this.sound.play('menu-button', { volume: 0.4 });
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

  private createMinimalElements(): void {
    // Minimal subtle background elements - very discrete
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Just a few subtle lines for visual interest
    for (let i = 0; i < 3; i++) {
      const line = this.add.graphics();
      line.lineStyle(1, 0xE63946, 0.1);
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(100, height - 100);
      line.lineBetween(x, y, x + 100, y);
      this.fallingCoins.push(line);
    }
  }

  private easterEggInput: string = '';

  private handleEasterEggInput(key: string): void {
    if (key.match(/[0-9]/)) {
      this.easterEggInput += key;

      if (this.easterEggInput.includes(GameConfig.easterEggs.declaration)) {
        this.showDeclarationPopup();
        this.easterEggInput = '';
      }

      // Keep only last 10 characters
      if (this.easterEggInput.length > 10) {
        this.easterEggInput = this.easterEggInput.slice(-10);
      }
    }
  }

  // Try to autoplay music (works if user interacted with page before)
  private tryAutoplayMusic(): void {
    if (!this.musicStarted && this.cache.audio.exists('menu-music')) {
      console.log('Attempting to autoplay menu music...');

      // Try to play music
      try {
        const music = this.sound.play('menu-music', {
          volume: 0.5,
          loop: true
        });

        if (music) {
          this.musicStarted = true;
          console.log('✅ Music autoplayed successfully!');
        }
      } catch (error) {
        console.log('⚠️ Autoplay blocked by browser - will start on user interaction');
      }
    }
  }

  // Start music if not already started
  private startMusicIfNeeded(): void {
    if (!this.musicStarted) {
      this.musicStarted = true;
      console.log('StartScene: User clicked, resuming AudioContext');

      // v3.8 FIX: Type guard for WebAudioSoundManager
      const soundManager = this.sound as any;
      if (soundManager.context && typeof soundManager.context.resume === 'function') {
        soundManager.context.resume().then(() => {
          console.log('AudioContext resumed, state:', soundManager.context.state);

          // Start menu music after AudioContext is resumed
          if (this.cache.audio.exists('menu-music')) {
            console.log('Playing menu music');
            const music = this.sound.play('menu-music', {
              volume: 0.5,
              loop: true
            });
            console.log('Menu music playing:', music);
          } else {
            console.log('menu-music not found in cache');
          }
        });
      }
    }
  }

  private showDeclarationPopup(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const popup = this.add.container(width / 2, height / 2);

    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.8);
    bg.fillRect(0, 0, width, height);

    const box = this.add.graphics();
    box.fillStyle(0xFFFFFF, 1);
    box.fillRoundedRect(-200, -100, 400, 200, 10);
    box.lineStyle(4, 0xE63946, 1);
    box.strokeRoundedRect(-200, -100, 400, 200, 10);

    const text = this.add.text(0, -40, '🦅 Declaration of\nMemependence 🦅', {
      fontSize: '24px',
      color: '#E63946',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    const subtext = this.add.text(0, 20, 'Easter Egg Unlocked!', {
      fontSize: '16px',
      color: '#0033A0',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    popup.add([box, text, subtext]);
    this.add.existing(bg);

    bg.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
    bg.on('pointerdown', () => {
      bg.destroy();
      popup.destroy();
    });
  }

  /**
   * v3.8: Cleanup to prevent memory leaks
   */
  shutdown(): void {
    // Remove all event listeners
    this.input.off('pointerdown');
    this.input.keyboard?.off('keydown');

    // Kill all tweens
    this.tweens.killAll();

    // Stop all sounds
    this.sound.stopAll();
  }
}
