import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { MarketDataManager } from '../systems/marketDataManager';
import { getI18n } from '../systems/i18n';

export class StartScene extends Phaser.Scene {
  private fallingCoins: Phaser.GameObjects.Graphics[] = [];
  private musicStarted: boolean = false;
  private tokenContainers: Phaser.GameObjects.Container[] = [];
  private priceUpdateTimer?: Phaser.Time.TimerEvent;
  private i18n = getI18n();

  constructor() {
    super({ key: 'StartScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Clear token containers on restart
    this.tokenContainers = [];

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

    // Language toggle button (top right)
    this.createLanguageToggle(width);

    // Title - clean, professional, bigger and more centered
    const title = this.add.text(width / 2, 200, this.i18n.t('start.title'), {
      fontSize: '96px',
      color: '#000000',
      fontFamily: this.i18n.getFontFamily(),
      fontStyle: 'bold',
      letterSpacing: 8
    }).setOrigin(0.5);

    // Subtle underline
    const underline = this.add.graphics();
    underline.fillStyle(0xE63946, 1);
    underline.fillRect(width / 2 - 280, 270, 560, 6);

    // Tagline - sophisticated
    this.add.text(width / 2, 310, this.i18n.t('start.tagline'), {
      fontSize: '28px',
      color: '#666666',
      fontFamily: this.i18n.getFontFamily(),
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

    this.createButton(width / 2, buttonY, this.i18n.t('start.playButton'), () => {
      // v3.9.2: Ensure music starts on first interaction
      this.startMusicIfNeeded();

      // Stop menu music before starting intro
      this.sound.stopByKey('menu-music');
      // Play "ready for takeoff" sound
      this.sound.play('ready-for-takeoff', { volume: 0.7 });
      // Wait 2 seconds before starting intro scene
      // v4.2: Start with BuilderIntroScene (Cdog) before OgleScene
      this.time.delayedCall(2000, () => {
        this.scene.start('BuilderIntroScene');
      });
    });

    this.createButton(width / 2, buttonY + buttonSpacing, this.i18n.t('start.leaderboardButton'), () => {
      // Stop menu music before going to Hall of Degens
      this.sound.stopByKey('menu-music');
      this.scene.start('LeaderboardScene');
    });

    this.createButton(width / 2, buttonY + buttonSpacing * 2, this.i18n.t('start.howToPlayButton'), () => {
      // Stop music before going to how to play
      this.sound.stopByKey('menu-music');
      this.scene.start('HowToPlayScene');
    });

    // High score display - center
    const highScore = this.registry.get('highScore') || 0;
    this.add.text(width / 2, height - 110, `${this.i18n.t('start.bestScore')}: ${highScore}`, {
      fontSize: '24px',
      color: '#999999',
      fontFamily: this.i18n.getFontFamily(),
      letterSpacing: 2
    }).setOrigin(0.5);

    // Footer Container - Text links, Logo rechts, auf einer Linie
    const footerY = height - 40;

    // Credit text - bottom left
    this.add.text(30, footerY, this.i18n.t('start.madeBy'), {
      fontSize: '16px',
      color: '#888888',
      fontFamily: this.i18n.getFontFamily(),
      letterSpacing: 1
    }).setOrigin(0, 0.5);

    // Version info - bottom left, below credits
    this.add.text(30, footerY + 20, this.i18n.t('start.version'), {
      fontSize: '14px',
      color: '#999999',
      fontFamily: this.i18n.getFontFamily(),
      letterSpacing: 1
    }).setOrigin(0, 0.5);

    // Community text links - centered
    const communityY = footerY; // Same height as footerY (was +15)
    const communityLinkSpacing = 180;

    this.createCommunityTextLink(width / 2 - communityLinkSpacing, communityY, this.i18n.t('start.telegramEN'), 'https://t.me/official_america_dot_fun');
    this.createCommunityTextLink(width / 2, communityY, this.i18n.t('start.telegramCN'), 'https://t.me/americafunchinese');
    this.createCommunityTextLink(width / 2 + communityLinkSpacing, communityY, this.i18n.t('start.website'), 'https://www.america.fun/');

    // 3-Token Live Ticker - at top with 40px spacing from top
    const tokenY = 40;
    const tokenSymbols = ['AOL', 'VALOR', 'BURGER'];
    const tokenSpacing = 480; // More space between tokens
    const startX = width / 2 - tokenSpacing;

    tokenSymbols.forEach((symbol, i) => {
      const container = this.add.container(startX + i * tokenSpacing, tokenY);

      // Main text (black) - "$SYMBOL  $price  "
      const mainText = this.add.text(0, 0, `${symbol}: loading...`, {
        fontSize: '18px',
        color: '#000000',
        fontFamily: 'Arial',
        letterSpacing: 0.5
      }).setOrigin(0.5);

      // Percent text (colored) - "+X.X%  "
      const percentText = this.add.text(0, 0, '', {
        fontSize: '18px',
        color: '#FFFFFF',
        fontFamily: 'Arial',
        letterSpacing: 0.5
      }).setOrigin(0, 0.5);

      // MC text (black) - "MC $X.XM"
      const mcText = this.add.text(0, 0, '', {
        fontSize: '18px',
        color: '#000000',
        fontFamily: 'Arial',
        letterSpacing: 0.5
      }).setOrigin(0, 0.5);

      container.add([mainText, percentText, mcText]);
      container.setData('mainText', mainText);
      container.setData('percentText', percentText);
      container.setData('mcText', mcText);

      this.tokenContainers.push(container);
    });

    // Start token price updates
    this.updateTokenPrices();
    this.priceUpdateTimer = this.time.addEvent({
      delay: 60000, // Update every 60 seconds
      loop: true,
      callback: () => this.updateTokenPrices()
    });

    // America.Fun Logo - bottom right, bigger (+20%)
    const logo = this.add.image(0, footerY + 10, 'america-logo');
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

    // Use text as-is (supports Chinese characters)
    const buttonText = this.add.text(0, 0, text.toUpperCase(), {
      fontSize: '28px',
      color: '#FFFFFF',
      fontFamily: this.i18n.getFontFamily(),
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

  private createCommunityTextLink(x: number, y: number, text: string, url: string): void {
    const link = this.add.text(x, y, text, {
      fontSize: '18px',
      color: '#888888',
      fontFamily: this.i18n.getFontFamily(),
      letterSpacing: 1
    }).setOrigin(0.5);

    link.setInteractive({ useHandCursor: true });

    // Hover effects
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

  /**
   * Update all token prices from Dexscreener API
   */
  private async updateTokenPrices(): Promise<void> {
    if (this.tokenContainers.length === 0) return;

    try {
      const tokenData = await MarketDataManager.fetchAll();

      if (tokenData.length === 0) {
        // No data fetched - show error for all tokens
        this.tokenContainers.forEach((container, i) => {
          const symbols = ['AOL', 'VALOR', 'BURGER'];
          const mainText = container.getData('mainText') as Phaser.GameObjects.Text;
          const percentText = container.getData('percentText') as Phaser.GameObjects.Text;

          mainText.setText(`${symbols[i]}: unavailable`);
          mainText.setColor('#888888');
          percentText.setText('');
        });
        return;
      }

      // Update each token display
      tokenData.forEach((data, i) => {
        if (i < this.tokenContainers.length) {
          const container = this.tokenContainers[i];
          const mainText = container.getData('mainText') as Phaser.GameObjects.Text;
          const percentText = container.getData('percentText') as Phaser.GameObjects.Text;
          const mcText = container.getData('mcText') as Phaser.GameObjects.Text;

          const formatted = MarketDataManager.formatTokenDisplay(data);
          const color = MarketDataManager.getColorForChange(data.change);

          // Main text stays black
          mainText.setText(formatted.main);
          mainText.setColor('#000000');

          // Percent text gets color
          percentText.setText(formatted.percent);
          percentText.setColor(color);

          // MC text stays black
          mcText.setText(formatted.mc);
          mcText.setColor('#000000');

          // Position texts after each other
          const mainBounds = mainText.getBounds();
          percentText.setX(mainBounds.width / 2);

          const percentBounds = percentText.getBounds();
          mcText.setX(mainBounds.width / 2 + percentBounds.width);
        }
      });

      console.log('💰 Updated token prices:', tokenData.length, 'tokens');
    } catch (error) {
      console.error('❌ Error updating token prices:', error);
      this.tokenContainers.forEach((container, i) => {
        const symbols = ['AOL', 'VALOR', 'BURGER'];
        const mainText = container.getData('mainText') as Phaser.GameObjects.Text;
        const percentText = container.getData('percentText') as Phaser.GameObjects.Text;

        mainText.setText(`${symbols[i]}: error`);
        mainText.setColor('#888888');
        percentText.setText('');
      });
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
   * Create language toggle button
   */
  private createLanguageToggle(width: number): void {
    const langButton = this.add.container(width - 80, 50);
    const langBg = this.add.graphics();
    langBg.fillStyle(0x000000, 1);
    langBg.fillRoundedRect(-35, -20, 70, 40, 6);

    const currentLang = this.i18n.getLanguage();
    const langText = this.add.text(0, 0, currentLang === 'en' ? '🇺🇸 EN' : '🇨🇳 CN', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    langButton.add([langBg, langText]);
    langButton.setSize(70, 40);
    langButton.setInteractive(
      new Phaser.Geom.Rectangle(-35, -20, 70, 40),
      Phaser.Geom.Rectangle.Contains
    );

    // Hover effect
    langButton.on('pointerover', () => {
      this.sound.play('hover-button', { volume: 0.3 });
      langBg.clear();
      langBg.fillStyle(0xE63946, 1);
      langBg.fillRoundedRect(-35, -20, 70, 40, 6);
    });

    langButton.on('pointerout', () => {
      langBg.clear();
      langBg.fillStyle(0x000000, 1);
      langBg.fillRoundedRect(-35, -20, 70, 40, 6);
    });

    // Toggle language and reload scene
    langButton.on('pointerdown', () => {
      this.sound.play('menu-button', { volume: 0.4 });
      this.i18n.toggleLanguage();
      this.scene.restart(); // Reload scene with new language
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

    // Stop price update timer
    if (this.priceUpdateTimer) {
      this.priceUpdateTimer.destroy();
      this.priceUpdateTimer = undefined;
    }
  }
}
