import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { Eagle } from '../sprites/Eagle';

export class GameScene extends Phaser.Scene {
  private eagle!: Eagle;
  private coins: Phaser.GameObjects.Container[] = [];
  private jeeters: Phaser.GameObjects.Container[] = [];
  private powerups: Phaser.GameObjects.Container[] = [];

  // Score & Timer
  private score: number = 0;
  private gameTime: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;

  // Game state
  private gameStartTime: number = 0;
  private isGameOver: boolean = false;
  private isPaused: boolean = false;
  private hasStarted: boolean = false;

  // Timers
  private coinSpawnTimer?: Phaser.Time.TimerEvent;
  private jeeterSpawnTimer?: Phaser.Time.TimerEvent;
  private gameTimer?: Phaser.Time.TimerEvent;
  private taglineTimer?: Phaser.Time.TimerEvent;

  // Speeds & Progression
  private coinSpeed: number = 300;
  private jeeterSpeed: number = 250;
  private currentLevel: number = 1;

  // Powerups
  private burgerCount: number = 0;
  private magnetActive: boolean = false;
  private shieldActive: boolean = false;
  private magnetTimer?: Phaser.Time.TimerEvent;
  private shieldTimer?: Phaser.Time.TimerEvent;

  // Combo System
  private comboCount: number = 0;
  private lastCoinTime: number = 0;
  private comboText?: Phaser.GameObjects.Text;

  // HUD
  private magnetIcon?: Phaser.GameObjects.Text;
  private shieldIcon?: Phaser.GameObjects.Text;
  private burgerCountText?: Phaser.GameObjects.Text;

  // Shield visual
  private shieldGraphics?: Phaser.GameObjects.Graphics;

  // Pause
  private pauseText?: Phaser.GameObjects.Text;
  private pauseOverlay?: Phaser.GameObjects.Graphics;

  // Tagline
  private taglineText?: Phaser.GameObjects.Text;
  private taglines: string[] = [
    "Avoid FUD. Stack Fun. Fly Free.",
    "Fly. Buyback. Fun",
    "Built by Degens. Protected by Eagles.",
    "Fly or get REKT.",
    "WAGMI"
  ];
  private currentTaglineIndex: number = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(): void {
    // Reset all game state variables when scene starts
    this.score = 0;
    this.gameTime = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.hasStarted = false;
    this.coinSpeed = 300;
    this.jeeterSpeed = 250;
    this.currentLevel = 1;
    this.burgerCount = 0;
    this.magnetActive = false;
    this.shieldActive = false;
    this.coins = [];
    this.jeeters = [];
    this.powerups = [];
    this.shieldGraphics = undefined;
    this.comboCount = 0;
    this.lastCoinTime = 0;
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background - clean white
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // America.Fun Logo - bottom right corner, bigger with pulse animation
    const logo = this.add.image(width - 150, height - 80, 'america-logo');
    logo.setScale(0.3);
    logo.setAlpha(0.9);
    logo.setDepth(1000);

    // Pulse animation for logo
    this.tweens.add({
      targets: logo,
      scale: 0.32,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Create eagle - bigger and positioned on the left
    this.eagle = new Eagle(this, 300, height / 2);

    // Pause physics immediately - will resume after countdown
    this.physics.pause();

    // ========== GAME HUD - TOP BAR ==========
    const hudY = 50;

    // Background bar for HUD
    const hudBg = this.add.graphics();
    hudBg.fillStyle(0xFFFFFF, 0.9);
    hudBg.fillRoundedRect(40, 20, width - 80, 60, 10);
    hudBg.lineStyle(3, 0xE63946, 1);
    hudBg.strokeRoundedRect(40, 20, width - 80, 60, 10);
    hudBg.setDepth(999);

    const hudStyle = {
      fontSize: '28px',
      color: '#E63946',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 1
    };

    // Timer - left side
    this.timerText = this.add.text(80, hudY, 'TIME: 0', hudStyle);
    this.timerText.setOrigin(0, 0.5);
    this.timerText.setDepth(1000);

    // Level - left-center
    this.levelText = this.add.text(width * 0.28, hudY, 'LEVEL: 1', hudStyle);
    this.levelText.setOrigin(0, 0.5);
    this.levelText.setDepth(1000);

    // Burgers - right-center
    this.burgerCountText = this.add.text(width * 0.55, hudY, 'BURGERS: 0/5', hudStyle);
    this.burgerCountText.setOrigin(0, 0.5);
    this.burgerCountText.setDepth(1000);

    // Score - right side
    this.scoreText = this.add.text(width - 80, hudY, 'SCORE: 0', hudStyle);
    this.scoreText.setOrigin(1, 0.5);
    this.scoreText.setDepth(1000);

    // Powerup Icons - below HUD, centered
    this.magnetIcon = this.add.text(width / 2 - 60, 110, 'MAGNET', {
      fontSize: '24px',
      color: '#00AAFF',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.magnetIcon.setVisible(false);
    this.magnetIcon.setDepth(1000);

    this.shieldIcon = this.add.text(width / 2 + 60, 110, 'SHIELD', {
      fontSize: '24px',
      color: '#00AAFF',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.shieldIcon.setVisible(false);
    this.shieldIcon.setDepth(1000);

    // Tagline will be shown during gameplay, not at bottom

    // Instructions - will be destroyed after countdown
    let instructions: Phaser.GameObjects.Text | null = this.add.text(width / 2, height / 2 + 150, 'Press SPACE to start\n\nP = Pause', {
      fontSize: '36px',
      color: GameConfig.colors.secondary,
      fontFamily: 'Arial',
      letterSpacing: 2,
      align: 'center'
    }).setOrigin(0.5);
    instructions.setDepth(500);

    // Input handlers
    this.input.on('pointerdown', () => {
      if (!this.hasStarted) {
        this.startCountdown();
        if (instructions) {
          instructions.destroy();
          instructions = null;
        }
      } else if (!this.isPaused && this.hasStarted) {
        this.eagle.flap();
      }
    });

    this.input.keyboard?.on('keydown-SPACE', () => {
      if (!this.hasStarted) {
        this.startCountdown();
        if (instructions) {
          instructions.destroy();
          instructions = null;
        }
      } else if (!this.isPaused && this.hasStarted) {
        this.eagle.flap();
      }
    });

    // Pause key
    this.input.keyboard?.on('keydown-P', () => {
      this.togglePause();
    });

    // ESC to return to menu
    this.input.keyboard?.on('keydown-ESC', () => {
      this.cleanupAndExit();
    });
  }

  private showTaglineInGame(): void {
    // Don't show if game is over or paused
    if (this.isGameOver || this.isPaused) return;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Get next tagline
    this.currentTaglineIndex = (this.currentTaglineIndex + 1) % this.taglines.length;
    const tagline = this.taglines[this.currentTaglineIndex];

    // Create tagline text at bottom of screen - subtle
    const taglineText = this.add.text(width / 2, height - 150, tagline, {
      fontSize: '24px',
      color: '#999999',
      fontFamily: 'Arial',
      fontStyle: 'normal',
      letterSpacing: 2,
      align: 'center'
    }).setOrigin(0.5);
    taglineText.setDepth(500);
    taglineText.setAlpha(0);

    // Fade in
    this.tweens.add({
      targets: taglineText,
      alpha: 0.7,
      duration: 800,
      ease: 'Power2'
    });

    // Fade out and destroy after 5 seconds
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: taglineText,
        alpha: 0,
        duration: 800,
        onComplete: () => taglineText.destroy()
      });
    });
  }

  private startCountdown(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Physics already paused in create() - will resume after countdown

    // Countdown: 3, 2, 1, GO!
    const countdownText = this.add.text(width / 2, height / 2, '3', {
      fontSize: '128px',
      color: '#E63946',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    countdownText.setDepth(2000);

    let count = 3;
    const countdownInterval = this.time.addEvent({
      delay: 1000,
      callback: () => {
        count--;
        if (count > 0) {
          countdownText.setText(count.toString());
          this.tweens.add({
            targets: countdownText,
            scale: 1.5,
            alpha: 0,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => {
              countdownText.setScale(1);
              countdownText.setAlpha(1);
            }
          });
        } else {
          countdownText.setText('GO!');
          this.tweens.add({
            targets: countdownText,
            scale: 2,
            alpha: 0,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => {
              countdownText.destroy();
              this.startGame();
            }
          });
        }
      },
      repeat: 3
    });
  }

  private startGame(): void {
    this.gameStartTime = Date.now();
    this.hasStarted = true;

    // Resume physics after countdown
    this.physics.resume();

    // Start game timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameTime++;
        this.timerText.setText(`TIME: ${this.gameTime}`);
      },
      callbackScope: this,
      loop: true
    });

    // Spawn coins regularly - balanced frequency
    this.coinSpawnTimer = this.time.addEvent({
      delay: 1500,  // Reduced from 800ms - less coins
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    // Spawn first coin after 1 second
    this.time.delayedCall(1000, () => this.spawnCoin());

    // Spawn jeeters (enemies) regularly - less aggressive
    this.jeeterSpawnTimer = this.time.addEvent({
      delay: 4000,  // Increased from 2500ms - less enemies
      callback: this.spawnJeeter,
      callbackScope: this,
      loop: true
    });

    // Spawn first jeeter after 5 seconds - give player time
    this.time.delayedCall(5000, () => this.spawnJeeter());

    // Show taglines every 30 seconds during gameplay
    this.taglineTimer = this.time.addEvent({
      delay: 30000,  // 30 seconds
      callback: this.showTaglineInGame,
      callbackScope: this,
      loop: true
    });

    // Show first tagline after 15 seconds
    this.time.delayedCall(15000, () => this.showTaglineInGame());
  }

  private togglePause(): void {
    if (!this.hasStarted || this.isGameOver) return;

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      // Pause EVERYTHING
      this.physics.pause();
      this.tweens.pauseAll(); // Pause all animations (coin feedback, etc.)
      this.time.paused = true; // Pause ALL timers globally

      // Pause specific timers
      if (this.coinSpawnTimer) this.coinSpawnTimer.paused = true;
      if (this.jeeterSpawnTimer) this.jeeterSpawnTimer.paused = true;
      if (this.gameTimer) this.gameTimer.paused = true;
      if (this.taglineTimer) this.taglineTimer.paused = true;
      if (this.magnetTimer) this.magnetTimer.paused = true;
      if (this.shieldTimer) this.shieldTimer.paused = true;

      // Show pause text only - no overlay
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;

      this.pauseText = this.add.text(width / 2, height / 2, 'PAUSED', {
        fontSize: '96px',
        color: '#E63946',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#FFFFFF',
        strokeThickness: 6
      }).setOrigin(0.5);
      this.pauseText.setDepth(1501);
    } else {
      // Resume EVERYTHING
      this.physics.resume();
      this.tweens.resumeAll(); // Resume all animations
      this.time.paused = false; // Resume ALL timers globally

      // Resume specific timers
      if (this.coinSpawnTimer) this.coinSpawnTimer.paused = false;
      if (this.jeeterSpawnTimer) this.jeeterSpawnTimer.paused = false;
      if (this.gameTimer) this.gameTimer.paused = false;
      if (this.taglineTimer) this.taglineTimer.paused = false;
      if (this.magnetTimer) this.magnetTimer.paused = false;
      if (this.shieldTimer) this.shieldTimer.paused = false;

      // Hide pause text
      this.pauseText?.destroy();
    }
  }

  private spawnCoin(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Random Y position
    const y = Phaser.Math.Between(150, height - 150);

    // Create coin container
    const coin = this.add.container(width + 100, y);

    // Randomly choose coin type - Burgers are rarer but worth more
    const coinType = Phaser.Math.Between(0, 100);
    let coinImage: Phaser.GameObjects.Image;
    let points: number;
    let type: string;

    if (coinType < 70) {
      // 70% chance for AOL coin (common)
      coinImage = this.add.image(0, 0, 'coin-aol');
      coinImage.setScale(0.15); // Made bigger
      points = 3;
      type = 'aol';
    } else {
      // 30% chance for BURGER coin (rare, more valuable)
      coinImage = this.add.image(0, 0, 'coin-burger');
      coinImage.setScale(0.12); // Made bigger
      points = 5;
      type = 'burger';
    }

    coin.add(coinImage);
    coin.setData('points', points);
    coin.setData('type', type);
    coin.setData('collected', false);
    coin.setSize(100, 100);

    this.coins.push(coin);
  }

  private spawnJeeter(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Random Y position
    const y = Phaser.Math.Between(150, height - 150);

    // Create jeeter container
    const jeeter = this.add.container(width + 100, y);

    // Use jeet.png as enemy
    const jeeterImage = this.add.image(0, 0, 'jeet');
    jeeterImage.setScale(0.25); // Made bigger
    jeeterImage.setFlipX(true); // Flip to face left

    jeeter.add(jeeterImage);
    jeeter.setSize(120, 120);

    this.jeeters.push(jeeter);
  }

  private spawnShieldPowerup(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const y = Phaser.Math.Between(150, height - 150);

    const powerup = this.add.container(width + 100, y);

    // Shield icon
    const shield = this.add.text(0, 0, '🛡️', {
      fontSize: '64px'
    }).setOrigin(0.5);

    // Glow effect
    const glow = this.add.graphics();
    glow.fillStyle(0x00AAFF, 0.3);
    glow.fillCircle(0, 0, 50);

    powerup.add([glow, shield]);
    powerup.setData('type', 'shield');
    powerup.setSize(100, 100);

    // Pulse animation
    this.tweens.add({
      targets: powerup,
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    this.powerups.push(powerup);
  }

  private activateMagnet(): void {
    if (this.magnetActive) return;

    this.magnetActive = true;
    this.burgerCount = 0;
    this.updateBurgerCount();

    this.magnetIcon?.setVisible(true);

    // Visual feedback
    const text = this.add.text(this.cameras.main.width / 2, 200, 'MAGNET ACTIVATED!', {
      fontSize: '48px',
      color: '#FBB13C',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: 150,
      duration: 1500,
      onComplete: () => text.destroy()
    });

    // Deactivate after 5 seconds
    this.magnetTimer = this.time.delayedCall(5000, () => {
      this.magnetActive = false;
      this.magnetIcon?.setVisible(false);
    });
  }

  private activateShield(): void {
    if (this.shieldActive) return;

    this.shieldActive = true;
    this.shieldIcon?.setVisible(true);

    // Visual feedback
    const text = this.add.text(this.cameras.main.width / 2, 200, 'SHIELD ACTIVATED!', {
      fontSize: '48px',
      color: '#00AAFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    text.setDepth(500);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: 150,
      duration: 1500,
      onComplete: () => text.destroy()
    });

    // Create beautiful shield graphics that follows eagle
    this.shieldGraphics = this.add.graphics();
    this.shieldGraphics.setDepth(99); // Just below eagle

    // Pulse animation for shield
    this.tweens.add({
      targets: this.shieldGraphics,
      alpha: 0.6,
      duration: 500,
      yoyo: true,
      repeat: 19, // 10 seconds
      onComplete: () => {
        if (this.shieldGraphics) {
          this.shieldGraphics.destroy();
          this.shieldGraphics = undefined;
        }
      }
    });

    // Deactivate after 10 seconds
    this.shieldTimer = this.time.delayedCall(10000, () => {
      this.shieldActive = false;
      this.shieldIcon?.setVisible(false);
      if (this.shieldGraphics) {
        this.shieldGraphics.destroy();
        this.shieldGraphics = undefined;
      }
    });
  }

  private updateBurgerCount(): void {
    this.burgerCountText?.setText(`BURGERS: ${this.burgerCount}/5`);

    // Burger animation
    this.tweens.add({
      targets: this.burgerCountText,
      scale: 1.15,
      duration: 100,
      yoyo: true
    });
  }

  private showComboText(combo: number, bonusPoints: number): void {
    // Show combo above eagle
    const comboText = this.add.text(this.eagle.x, this.eagle.y - 80, `🔥 ${combo}x COMBO!\n+${bonusPoints}`, {
      fontSize: '36px',
      color: '#FF6B00',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 5
    }).setOrigin(0.5);
    comboText.setDepth(1500);

    this.tweens.add({
      targets: comboText,
      y: comboText.y - 60,
      alpha: 0,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => comboText.destroy()
    });
  }

  private checkLevelProgression(): void {
    let newLevel = this.currentLevel;
    let levelName = '';
    let speedMultiplier = 1;
    let background = '#FFFFFF';

    // Dynamic level system based on score
    if (this.score >= 1000) {
      // Level 5: Freedom Mode
      newLevel = 5;
      levelName = 'FREEDOM MODE!';
      speedMultiplier = 1.7;
      background = '#FFE6E6'; // Light red tint
      this.activateFreedomMode();
    } else if (this.score >= 700) {
      // Level 4: Market Volatility
      newLevel = 4;
      levelName = 'MARKET VOLATILITY!';
      speedMultiplier = 1.5;
      background = '#FFF0E6';
    } else if (this.score >= 400) {
      // Level 3: High Pressure
      newLevel = 3;
      levelName = 'HIGH PRESSURE!';
      speedMultiplier = 1.35;
      background = '#FFF5E6';
    } else if (this.score >= 200) {
      // Level 2: Speed Increasing
      newLevel = 2;
      levelName = 'SPEED INCREASING!';
      speedMultiplier = 1.2;
      background = '#F0F8FF';
      // Spawn shield powerup
      if (this.currentLevel < 2) {
        this.time.delayedCall(1000, () => this.spawnShieldPowerup());
      }
    }

    // Check if level actually changed
    if (newLevel > this.currentLevel) {
      this.currentLevel = newLevel;

      // Update speeds
      this.coinSpeed = 300 * speedMultiplier;
      this.jeeterSpeed = 250 * speedMultiplier;

      // Update level text
      this.levelText.setText(`LEVEL: ${Math.floor(newLevel)}`);

      // Show level up animation
      this.showLevelUpAnimation(Math.floor(newLevel), levelName);

      // Change background
      this.changeBackground(background);

      // Adjust spawn rates for higher levels
      if (this.coinSpawnTimer) {
        this.coinSpawnTimer.delay = Math.max(800, 1500 - (newLevel * 100));
      }
      if (this.jeeterSpawnTimer) {
        this.jeeterSpawnTimer.delay = Math.max(2000, 4000 - (newLevel * 200));
      }
    }
  }

  private showLevelUpAnimation(level: number, levelName: string): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Big level announcement
    const levelText = this.add.text(width / 2, height / 2, `LEVEL ${level}\n${levelName}`, {
      fontSize: '72px',
      color: '#E63946',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 8
    }).setOrigin(0.5);
    levelText.setDepth(2000);
    levelText.setAlpha(0);

    // Fade in and scale up
    this.tweens.add({
      targets: levelText,
      alpha: 1,
      scale: 1.2,
      duration: 300,
      ease: 'Back.easeOut'
    });

    // Hold for a moment then fade out
    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: levelText,
        alpha: 0,
        y: height / 2 - 100,
        duration: 800,
        ease: 'Power2',
        onComplete: () => levelText.destroy()
      });
    });
  }

  private activateFreedomMode(): void {
    // Freedom Mode special effects (only once)
    if (this.currentLevel >= 5) return;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Flash effect - Red, White, Blue sequence
    const flash = this.add.graphics();
    flash.setDepth(1999);

    let colorIndex = 0;
    const colors = [0xFF0000, 0xFFFFFF, 0x0000FF]; // Red, White, Blue

    const flashInterval = this.time.addEvent({
      delay: 200,
      callback: () => {
        flash.clear();
        flash.fillStyle(colors[colorIndex % 3], 0.4);
        flash.fillRect(0, 0, width, height);
        colorIndex++;
      },
      repeat: 8
    });

    this.time.delayedCall(2000, () => {
      flash.destroy();
      flashInterval.remove();
    });

    // Freedom mode announcement
    this.showMemePopup('🇺🇸 FREEDOM MODE ACTIVATED! 🦅', '#E63946');
  }

  private showMemePopup(text: string, color: string = '#E63946'): void {
    const width = this.cameras.main.width;

    const memeText = this.add.text(width / 2, 150, text, {
      fontSize: '48px',
      color: color,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 6
    }).setOrigin(0.5);
    memeText.setDepth(2001);
    memeText.setAlpha(0);

    this.tweens.add({
      targets: memeText,
      alpha: 1,
      y: 180,
      duration: 300,
      ease: 'Back.easeOut'
    });

    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: memeText,
        alpha: 0,
        y: 140,
        duration: 500,
        onComplete: () => memeText.destroy()
      });
    });
  }

  private changeBackground(color: string): void {
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 1000,
      onUpdate: (tween) => {
        const value = tween.getValue();
        // Smooth color transition would go here
      },
      onComplete: () => {
        this.cameras.main.setBackgroundColor(color);
      }
    });
  }

  update(): void {
    if (!this.hasStarted || this.isGameOver || this.isPaused) return;

    // Safety check: Fix NaN score
    if (isNaN(this.score)) {
      console.warn('Score was NaN, resetting to 0');
      this.score = 0;
      this.scoreText.setText(`SCORE: ${this.score}`);
    }

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Update shield graphics to follow eagle
    if (this.shieldActive && this.shieldGraphics) {
      this.shieldGraphics.clear();

      // Draw beautiful layered shield
      // Outer glow
      this.shieldGraphics.fillStyle(0x00AAFF, 0.2);
      this.shieldGraphics.fillCircle(this.eagle.x, this.eagle.y, 100);

      // Middle ring
      this.shieldGraphics.lineStyle(6, 0x00DDFF, 0.8);
      this.shieldGraphics.strokeCircle(this.eagle.x, this.eagle.y, 85);

      // Inner ring
      this.shieldGraphics.lineStyle(4, 0x88EEFF, 1);
      this.shieldGraphics.strokeCircle(this.eagle.x, this.eagle.y, 75);

      // Energy particles effect (optional rotating dots)
      const time = Date.now() / 1000;
      for (let i = 0; i < 8; i++) {
        const angle = (time * 2 + i * Math.PI / 4) % (Math.PI * 2);
        const px = this.eagle.x + Math.cos(angle) * 82;
        const py = this.eagle.y + Math.sin(angle) * 82;
        this.shieldGraphics.fillStyle(0xFFFFFF, 0.9);
        this.shieldGraphics.fillCircle(px, py, 3);
      }
    }

    // Check if eagle is out of bounds
    if (this.eagle.y < 0 || this.eagle.y > height) {
      this.gameOver();
      return;
    }

    // Update coins - move towards player (FIXED: Use reverse loop to avoid splice issues)
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];

      // Skip if already collected or destroyed
      if (!coin || !coin.active || coin.getData('collected')) continue;

      // Move coin left
      coin.x -= this.coinSpeed * (this.game.loop.delta / 1000);

      // Remove off-screen coins
      if (coin.x < -100) {
        coin.destroy();
        this.coins.splice(i, 1);
        continue;
      }

      // Magnet effect - pull coins towards eagle
      if (this.magnetActive) {
        const dx = this.eagle.x - coin.x;
        const dy = this.eagle.y - coin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 400 && distance > 0) {
          const speed = 200 * (this.game.loop.delta / 1000);
          coin.x += (dx / distance) * speed;
          coin.y += (dy / distance) * speed;
        }
      }

      // Check collision with eagle
      const distance = Phaser.Math.Distance.Between(
        coin.x,
        coin.y,
        this.eagle.x,
        this.eagle.y
      );

      if (distance < 80) {
        // Mark as collected to prevent double collection
        coin.setData('collected', true);

        // Collect coin - with safety checks
        const points = coin.getData('points') || 0;
        const type = coin.getData('type') || 'aol';

        // Safety check before adding points
        if (typeof points === 'number' && !isNaN(points)) {
          // Combo system: Check if collected within 1 second
          const currentTime = Date.now();
          const timeSinceLastCoin = currentTime - this.lastCoinTime;

          let bonusPoints = 0;
          if (timeSinceLastCoin < 1000 && this.lastCoinTime > 0) {
            // Combo!
            this.comboCount++;
            bonusPoints = this.comboCount * 5;
            this.showComboText(this.comboCount, bonusPoints);
          } else {
            // Reset combo
            this.comboCount = 1;
          }

          this.lastCoinTime = currentTime;

          this.score += points + bonusPoints;
          this.scoreText.setText(`SCORE: ${this.score}`);

          // Score blink animation
          this.tweens.add({
            targets: this.scoreText,
            scale: 1.1,
            duration: 100,
            yoyo: true
          });
        } else {
          console.error('Invalid points value:', points);
        }

        // Track burger count for magnet powerup
        if (type === 'burger') {
          this.burgerCount++;
          this.updateBurgerCount();

          if (this.burgerCount >= 5) {
            this.activateMagnet();
          }
        }

        // Check level progression
        this.checkLevelProgression();

        // Show coin collection feedback with points
        const coinName = type === 'aol' ? '$AOL' : '$BURGER';
        const feedbackText = this.add.text(coin.x, coin.y, `${coinName} +${points}`, {
          fontSize: '32px',
          color: type === 'aol' ? '#E63946' : '#FBB13C',
          fontFamily: 'Arial',
          fontStyle: 'bold',
          stroke: '#FFFFFF',
          strokeThickness: 4
        }).setOrigin(0.5);
        feedbackText.setDepth(500);

        // Animate feedback text upwards and fade out
        this.tweens.add({
          targets: feedbackText,
          y: feedbackText.y - 80,
          alpha: 0,
          duration: 1000,
          ease: 'Power2',
          onComplete: () => feedbackText.destroy()
        });

        // Visual feedback - only this coin disappears
        // Immediately remove from array to prevent further updates
        this.coins.splice(i, 1);

        this.tweens.add({
          targets: coin,
          scale: 1.5,
          alpha: 0,
          duration: 200,
          onComplete: () => {
            if (coin && coin.active) {
              coin.destroy();
            }
          }
        });
      }
    }

    // Update powerups
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const powerup = this.powerups[i];

      // Skip if destroyed
      if (!powerup || !powerup.active) continue;

      powerup.x -= this.coinSpeed * (this.game.loop.delta / 1000);

      if (powerup.x < -100) {
        powerup.destroy();
        this.powerups.splice(i, 1);
        continue;
      }

      const distance = Phaser.Math.Distance.Between(
        powerup.x,
        powerup.y,
        this.eagle.x,
        this.eagle.y
      );

      if (distance < 80) {
        const type = powerup.getData('type');
        if (type === 'shield') {
          this.activateShield();
        }
        powerup.destroy();
        this.powerups.splice(i, 1);
      }
    }

    // Update jeeters - move towards player
    for (let i = this.jeeters.length - 1; i >= 0; i--) {
      const jeeter = this.jeeters[i];

      // Skip if destroyed
      if (!jeeter || !jeeter.active) continue;

      jeeter.x -= this.jeeterSpeed * (this.game.loop.delta / 1000);

      // Remove off-screen jeeters
      if (jeeter.x < -100) {
        jeeter.destroy();
        this.jeeters.splice(i, 1);
        continue;
      }

      // Check collision with eagle (ignore if shield is active)
      const distance = Phaser.Math.Distance.Between(
        jeeter.x,
        jeeter.y,
        this.eagle.x,
        this.eagle.y
      );

      if (distance < 90) {
        if (this.shieldActive) {
          // Shield protects - destroy jeeter
          jeeter.destroy();
          this.jeeters.splice(i, 1);

          // Visual feedback
          const text = this.add.text(jeeter.x, jeeter.y, 'BLOCKED!', {
            fontSize: '32px',
            color: '#00AAFF',
            fontFamily: 'Arial',
            fontStyle: 'bold'
          }).setOrigin(0.5);

          this.tweens.add({
            targets: text,
            alpha: 0,
            y: text.y - 50,
            duration: 800,
            onComplete: () => text.destroy()
          });
        } else {
          // Hit by jeeter - game over
          this.gameOver();
        }
      }
    }
  }

  private gameOver(): void {
    if (this.isGameOver) return;
    this.isGameOver = true;

    console.log('GAME OVER! Final score:', this.score);

    // Stop all timers
    this.coinSpawnTimer?.remove();
    this.jeeterSpawnTimer?.remove();
    this.gameTimer?.remove();
    this.magnetTimer?.remove();
    this.shieldTimer?.remove();

    // Update high score
    const currentHighScore = this.registry.get('highScore') || 0;
    if (this.score > currentHighScore) {
      this.registry.set('highScore', this.score);
      localStorage.setItem('eagleOfFun_highScore', this.score.toString());
    }

    // Store current score
    this.registry.set('currentScore', this.score);

    // Transition to game over scene
    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene');
    });
  }

  private cleanupAndExit(): void {
    this.coinSpawnTimer?.remove();
    this.jeeterSpawnTimer?.remove();
    this.gameTimer?.remove();
    this.magnetTimer?.remove();
    this.shieldTimer?.remove();
    this.scene.start('StartScene');
  }
}
