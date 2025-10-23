import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { Eagle } from '../sprites/Eagle';

export class GameScene extends Phaser.Scene {
  private eagle!: Eagle;
  private coins: Phaser.GameObjects.Container[] = [];
  private enemies: Phaser.GameObjects.Container[] = [];
  private powerups: Phaser.GameObjects.Container[] = [];
  private fakeCoins: Phaser.GameObjects.Container[] = [];
  private lawsuitPapers: Phaser.GameObjects.Container[] = [];

  // Score & Timer
  private score: number = 0;
  private gameTime: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private phaseText!: Phaser.GameObjects.Text;
  private burgerCountText?: Phaser.GameObjects.Text;

  // Coin counters
  private bonkCount: number = 0;
  private aolCount: number = 0;
  private burgerCount: number = 0;
  private usd1Count: number = 0;
  private valorCount: number = 0;
  private bonkCountText?: Phaser.GameObjects.Text;
  private aolCountText?: Phaser.GameObjects.Text;
  private burgerCountDisplayText?: Phaser.GameObjects.Text;
  private usd1CountText?: Phaser.GameObjects.Text;
  private valorCountText?: Phaser.GameObjects.Text;

  // Game state
  private gameStartTime: number = 0;
  private isGameOver: boolean = false;
  private isPaused: boolean = false;
  private hasStarted: boolean = false;
  private countdownStarted: boolean = false;
  private backgroundMusicStarted: boolean = false;
  private currentBackgroundMusic?: Phaser.Sound.BaseSound;

  // === PHASE SYSTEM ===
  private currentPhase: number = 1;
  private phaseStartTime: number = 0;
  private phaseTimer?: Phaser.Time.TimerEvent;
  private showingPhaseAnnouncement: boolean = false;

  // Timers
  private coinSpawnTimer?: Phaser.Time.TimerEvent;
  private enemySpawnTimer?: Phaser.Time.TimerEvent;
  private gameTimer?: Phaser.Time.TimerEvent;
  private taglineTimer?: Phaser.Time.TimerEvent;
  private powerupSpawnTimer?: Phaser.Time.TimerEvent;

  // Speeds & Progression
  private coinSpeed: number = 300;
  private enemySpeed: number = 250;

  // === POWERUPS ===
  private aolCombo: number = 0; // Track consecutive AOL pickups
  private burgerMultiplierActive: boolean = false;
  private magnetActive: boolean = false;
  private shieldActive: boolean = false;
  private solanaSurgeActive: boolean = false;
  private belleModActive: boolean = false;
  private controlBlocked: boolean = false;
  private bullMarketActive: boolean = false;
  private extraLives: number = 0;

  // === v3.2: VALOR MODE ===
  private valorModeActive: boolean = false;
  private valorModeStage: number = 0; // 0 = inactive, 1 = stage1, 2 = stage2, 3 = afterglow
  private valorModeCooldown: boolean = false;
  private valorScoreMultiplier: number = 1;
  private originalCoinSpeed: number = 0;
  private originalEnemySpeed: number = 0;
  private valorAuraParticles: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  private valorScreenGlow?: Phaser.GameObjects.Rectangle;
  private valorModeText?: Phaser.GameObjects.Text;

  private magnetTimer?: Phaser.Time.TimerEvent;
  private shieldTimer?: Phaser.Time.TimerEvent;
  private burgerMultiplierTimer?: Phaser.Time.TimerEvent;
  private solanaSurgeTimer?: Phaser.Time.TimerEvent;
  private belleModTimer?: Phaser.Time.TimerEvent;
  private controlBlockTimer?: Phaser.Time.TimerEvent;
  private bullMarketTimer?: Phaser.Time.TimerEvent;

  // v3.2: VALOR MODE timers
  private valorStage1Timer?: Phaser.Time.TimerEvent;
  private valorStage2Timer?: Phaser.Time.TimerEvent;
  private valorAfterglowTimer?: Phaser.Time.TimerEvent;
  private valorCooldownTimer?: Phaser.Time.TimerEvent;

  // Combo System
  private comboCount: number = 0;
  private lastCoinTime: number = 0;
  private comboText?: Phaser.GameObjects.Text;

  // HUD
  private magnetIcon?: Phaser.GameObjects.Text;
  private magnetTimerText?: Phaser.GameObjects.Text;
  private shieldIcon?: Phaser.GameObjects.Image;
  private shieldTimerText?: Phaser.GameObjects.Text;
  private belleIcon?: Phaser.GameObjects.Text;
  private belleTimerText?: Phaser.GameObjects.Text;
  private bullMarketIcon?: Phaser.GameObjects.Text;
  private bullMarketTimerText?: Phaser.GameObjects.Text;

  // Background image
  private backgroundImage?: Phaser.GameObjects.Image;

  // Shield visual
  private shieldGraphics?: Phaser.GameObjects.Graphics;
  private shieldLoopSound?: Phaser.Sound.BaseSound;

  // Belle MOD visuals
  private belleSprite?: Phaser.GameObjects.Image;
  private belleAura?: Phaser.GameObjects.Graphics;

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
    this.countdownStarted = false;

    // Phase system
    this.currentPhase = 1;
    this.phaseStartTime = 0;

    // Speeds
    this.coinSpeed = 300;
    this.enemySpeed = 250;

    // Power-ups
    this.aolCombo = 0;
    this.burgerMultiplierActive = false;
    this.magnetActive = false;
    this.shieldActive = false;
    this.solanaSurgeActive = false;
    this.controlBlocked = false;
    this.backgroundMusicStarted = false;

    // Arrays
    this.coins = [];
    this.enemies = [];
    this.powerups = [];
    this.fakeCoins = [];
    this.lawsuitPapers = [];

    // Graphics
    this.shieldGraphics = undefined;

    // Combo
    this.comboCount = 0;
    this.lastCoinTime = 0;
  }

  create(data?: { autoStart?: boolean }): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background - clean white
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // Smooth fade in from white
    this.cameras.main.fadeIn(600, 255, 255, 255);

    // Check if we should auto-start (coming from IntroScene)
    const shouldAutoStart = data?.autoStart || false;

    // Add background image (Phase 1 initially)
    this.backgroundImage = this.add.image(width / 2, height / 2, 'bg-phase1');
    this.backgroundImage.setDisplaySize(width, height);
    this.backgroundImage.setDepth(0);
    this.backgroundImage.setAlpha(0.8); // Slightly transparent for better contrast

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
    this.timerText = this.add.text(80, hudY, 'TIME: 0s', hudStyle);
    this.timerText.setOrigin(0, 0.5);
    this.timerText.setDepth(1000);

    // Phase - left-center
    this.phaseText = this.add.text(width * 0.28, hudY, 'PHASE: 1', hudStyle);
    this.phaseText.setOrigin(0, 0.5);
    this.phaseText.setDepth(1000);

    // Score - right-center
    this.scoreText = this.add.text(width * 0.60, hudY, 'SCORE: 0', hudStyle);
    this.scoreText.setOrigin(0, 0.5);
    this.scoreText.setDepth(1000);

    // AOL Combo (für Buyback Mode) - right side
    this.burgerCountText = this.add.text(width - 80, hudY, 'AOL: 0/3', hudStyle);
    this.burgerCountText.setOrigin(1, 0.5);
    this.burgerCountText.setDepth(1000);

    // ========== COIN COUNTERS - SECOND ROW ==========
    const coinCounterY = 100;
    const coinStyle = {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    };

    // Background for coin counters
    const coinBg = this.add.graphics();
    coinBg.fillStyle(0x0033A0, 0.85);
    coinBg.fillRoundedRect(40, 80, width - 80, 45, 8);
    coinBg.setDepth(998);

    // Calculate spacing for 4 coins
    const coinStartX = 100;
    const coinSpacing = (width - 200) / 4;

    // BONK Count
    this.bonkCountText = this.add.text(coinStartX, coinCounterY, '🐕 $BONK: 0', coinStyle);
    this.bonkCountText.setOrigin(0, 0.5);
    this.bonkCountText.setDepth(1000);

    // AOL Count
    this.aolCountText = this.add.text(coinStartX + coinSpacing, coinCounterY, '🟣 $AOL: 0', coinStyle);
    this.aolCountText.setOrigin(0, 0.5);
    this.aolCountText.setDepth(1000);

    // BURGER Count
    this.burgerCountDisplayText = this.add.text(coinStartX + coinSpacing * 2, coinCounterY, '🍔 $BURGER: 0', coinStyle);
    this.burgerCountDisplayText.setOrigin(0, 0.5);
    this.burgerCountDisplayText.setDepth(1000);

    // USD1 Count
    this.usd1CountText = this.add.text(coinStartX + coinSpacing * 3, coinCounterY, '💵 $USD1: 0', coinStyle);
    this.usd1CountText.setOrigin(0, 0.5);
    this.usd1CountText.setDepth(1000);

    // VALOR Count
    this.valorCountText = this.add.text(coinStartX + coinSpacing * 4, coinCounterY, '⚡ $VALOR: 0', coinStyle);
    this.valorCountText.setOrigin(0, 0.5);
    this.valorCountText.setDepth(1000);

    // ========== POWER-UP PANEL - COMPACT BOTTOM BAR ==========
    const powerupIconY = height - 40; // Closer to bottom
    const powerupTimerY = height - 20;

    // Smaller compact background
    const powerupBg = this.add.graphics();
    powerupBg.fillStyle(0xFFFFFF, 0.85); // More transparent
    powerupBg.fillRoundedRect(width / 2 - 400, height - 55, 800, 50, 8); // Smaller: 50px height
    powerupBg.lineStyle(2, 0xE63946, 1); // Thinner border
    powerupBg.strokeRoundedRect(width / 2 - 400, height - 55, 800, 50, 8);
    powerupBg.setDepth(999);

    // Magnet/Buyback Mode - compact
    this.magnetIcon = this.add.text(width / 2 - 270, powerupIconY - 8, '🧲', {
      fontSize: '24px',
      color: '#E63946',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.magnetIcon.setVisible(false);
    this.magnetIcon.setDepth(1000);

    this.magnetTimerText = this.add.text(width / 2 - 240, powerupIconY - 8, 'BUYBACK 10s', {
      fontSize: '14px',
      color: '#666666',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);
    this.magnetTimerText.setVisible(false);
    this.magnetTimerText.setDepth(1000);

    // Shield/America Hat - compact
    this.shieldIcon = this.add.text(width / 2 - 90, powerupIconY - 8, '🛡️', {
      fontSize: '24px',
      color: '#E63946',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.shieldIcon.setVisible(false);
    this.shieldIcon.setDepth(1000);

    this.shieldTimerText = this.add.text(width / 2 - 60, powerupIconY - 8, 'SHIELD 8s', {
      fontSize: '14px',
      color: '#666666',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);
    this.shieldTimerText.setVisible(false);
    this.shieldTimerText.setDepth(1000);

    // Belle MOD - compact
    this.belleIcon = this.add.text(width / 2 + 70, powerupIconY - 8, '👁️', {
      fontSize: '24px',
      color: '#E63946',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.belleIcon.setVisible(false);
    this.belleIcon.setDepth(1000);

    this.belleTimerText = this.add.text(width / 2 + 100, powerupIconY - 8, 'BELLE 15s', {
      fontSize: '14px',
      color: '#666666',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);
    this.belleTimerText.setVisible(false);
    this.belleTimerText.setDepth(1000);

    // Bull Market Mode - compact
    this.bullMarketIcon = this.add.text(width / 2 + 230, powerupIconY - 8, '🐂', {
      fontSize: '24px',
      color: '#E63946',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.bullMarketIcon.setVisible(false);
    this.bullMarketIcon.setDepth(1000);

    this.bullMarketTimerText = this.add.text(width / 2 + 260, powerupIconY - 8, 'BULL 10s', {
      fontSize: '14px',
      color: '#666666',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);
    this.bullMarketTimerText.setVisible(false);
    this.bullMarketTimerText.setDepth(1000);

    // Tagline will be shown during gameplay, not at bottom

    // Instructions - will be destroyed after countdown (only if not auto-starting)
    let instructions: Phaser.GameObjects.Text | null = null;

    if (!shouldAutoStart) {
      instructions = this.add.text(width / 2, height / 2 + 150, 'Press SPACE to start\n\nP = Pause', {
        fontSize: '36px',
        color: GameConfig.colors.secondary,
        fontFamily: 'Arial',
        letterSpacing: 2,
        align: 'center'
      }).setOrigin(0.5);
      instructions.setDepth(500);
    }

    // Input handlers
    this.input.on('pointerdown', () => {
      if (!this.hasStarted && !this.countdownStarted) {
        this.sound.play('ui-confirm', { volume: 0.3 });
        this.countdownStarted = true;
        this.startCountdown();
        if (instructions) {
          instructions.destroy();
          instructions = null;
        }
      } else if (!this.isPaused && this.hasStarted && !this.controlBlocked) {
        this.eagle.flap();
      }
    });

    this.input.keyboard?.on('keydown-SPACE', () => {
      if (!this.hasStarted && !this.countdownStarted) {
        this.sound.play('ui-confirm', { volume: 0.3 });
        this.countdownStarted = true;
        this.startCountdown();
        if (instructions) {
          instructions.destroy();
          instructions = null;
        }
      } else if (!this.isPaused && this.hasStarted && !this.controlBlocked) {
        this.eagle.flap();
      }
    });

    // Auto-start countdown if coming from IntroScene
    if (shouldAutoStart) {
      // Start countdown immediately
      this.countdownStarted = true;
      this.time.delayedCall(100, () => {
        this.startCountdown();
      });
    }

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

    // Fade out and destroy after 2 seconds
    this.time.delayedCall(2000, () => {
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

    // Play countdown sound FIRST (3-2-1 with voice)
    console.log('Playing countdown sound...');
    if (this.cache.audio.exists('countdown')) {
      console.log('Countdown sound exists in cache');
      this.sound.play('countdown', { volume: 0.8 });
    } else {
      console.log('Countdown sound NOT in cache!');
    }

    // Start background music during countdown for smoother transition (lower volume)
    if (!this.backgroundMusicStarted && this.cache.audio.exists('background-music')) {
      console.log('Starting background music during countdown');

      // Delay music start by 0.5 seconds so countdown voice is clear
      this.time.delayedCall(500, () => {
        this.currentBackgroundMusic = this.sound.add('background-music', {
          volume: 0.2,  // Very low volume during countdown
          loop: false
        });

        // When first track ends, play second track on loop
        this.currentBackgroundMusic.once('complete', () => {
          if (this.cache.audio.exists('background-music-2')) {
            this.currentBackgroundMusic = this.sound.play('background-music-2', {
              volume: 0.5,
              loop: true
            });
          }
        });

        this.currentBackgroundMusic.play();
        this.backgroundMusicStarted = true;

        // Fade in music volume during countdown
        this.tweens.add({
          targets: this.currentBackgroundMusic,
          volume: 0.5,
          duration: 3000,
          ease: 'Linear'
        });
      });
    }

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
    this.phaseStartTime = Date.now();
    this.hasStarted = true;

    // Play game start sound - only if available
    if (this.sound.get('game-start')) {
      this.sound.play('game-start', { volume: 0.5 });
    }

    // Background music already started during countdown
    // Just ensure volume is at full level
    if (this.currentBackgroundMusic && this.backgroundMusicStarted) {
      console.log('Background music already playing, ensuring full volume');
      this.tweens.add({
        targets: this.currentBackgroundMusic,
        volume: 0.5,
        duration: 500,
        ease: 'Linear'
      });
    }

    // Resume physics after countdown
    this.physics.resume();

    // Start game timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameTime++;
        this.timerText.setText(`TIME: ${this.gameTime}s`);
        this.checkPhaseProgression();
      },
      callbackScope: this,
      loop: true
    });

    // Start Phase 1
    this.startPhase(1);

    // Spawn coins regularly - balanced frequency
    this.coinSpawnTimer = this.time.addEvent({
      delay: 1500,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    // Spawn first coin after 1 second
    this.time.delayedCall(1000, () => this.spawnCoin());

    // Spawn enemies based on current phase
    this.enemySpawnTimer = this.time.addEvent({
      delay: GameConfig.phases[0].spawnRate,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    // Spawn first enemy after 5 seconds - give player time
    this.time.delayedCall(5000, () => this.spawnEnemy());

    // Spawn power-ups occasionally
    this.powerupSpawnTimer = this.time.addEvent({
      delay: 15000, // Every 15 seconds
      callback: this.spawnPowerup,
      callbackScope: this,
      loop: true
    });

    // Show taglines every 30 seconds during gameplay
    this.taglineTimer = this.time.addEvent({
      delay: 30000,
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

      // Pause all sounds
      this.sound.pauseAll();

      // Pause specific timers
      if (this.coinSpawnTimer) this.coinSpawnTimer.paused = true;
      if (this.enemySpawnTimer) this.enemySpawnTimer.paused = true;
      if (this.gameTimer) this.gameTimer.paused = true;
      if (this.powerupSpawnTimer) this.powerupSpawnTimer.paused = true;
      if (this.taglineTimer) this.taglineTimer.paused = true;
      if (this.phaseTimer) this.phaseTimer.paused = true;
      if (this.magnetTimer) this.magnetTimer.paused = true;
      if (this.shieldTimer) this.shieldTimer.paused = true;
      if (this.burgerMultiplierTimer) this.burgerMultiplierTimer.paused = true;
      if (this.solanaSurgeTimer) this.solanaSurgeTimer.paused = true;
      if (this.controlBlockTimer) this.controlBlockTimer.paused = true;

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

      // Resume all sounds
      this.sound.resumeAll();

      // Resume specific timers
      if (this.coinSpawnTimer) this.coinSpawnTimer.paused = false;
      if (this.enemySpawnTimer) this.enemySpawnTimer.paused = false;
      if (this.gameTimer) this.gameTimer.paused = false;
      if (this.powerupSpawnTimer) this.powerupSpawnTimer.paused = false;
      if (this.taglineTimer) this.taglineTimer.paused = false;
      if (this.phaseTimer) this.phaseTimer.paused = false;
      if (this.magnetTimer) this.magnetTimer.paused = false;
      if (this.shieldTimer) this.shieldTimer.paused = false;
      if (this.burgerMultiplierTimer) this.burgerMultiplierTimer.paused = false;
      if (this.solanaSurgeTimer) this.solanaSurgeTimer.paused = false;
      if (this.controlBlockTimer) this.controlBlockTimer.paused = false;

      // Hide pause text
      this.pauseText?.destroy();
    }
  }

  // ========== PHASE SYSTEM ==========
  private startPhase(phaseId: number): void {
    if (phaseId > GameConfig.phases.length) {
      phaseId = GameConfig.phases.length; // WAGMI Mode (endless)
    }

    const phase = GameConfig.phases[phaseId - 1];
    this.currentPhase = phaseId;
    this.phaseStartTime = Date.now();

    // Phase change sound will be played in showPhaseAnnouncement
    // (removed duplicate sound play here)

    // Update HUD
    this.phaseText.setText(`PHASE: ${phaseId}`);

    // Update speeds
    const baseSpeed = 300;
    this.coinSpeed = baseSpeed * phase.speedMultiplier;
    this.enemySpeed = (baseSpeed * 0.8) * phase.speedMultiplier;

    // Update enemy spawn rate
    if (this.enemySpawnTimer) {
      this.enemySpawnTimer.delay = phase.spawnRate;
    }

    // Change background image based on phase - ALWAYS for each phase change
    if (this.backgroundImage) {
      let bgKey = 'bg-phase1'; // Default

      // Determine which background to use
      if (phaseId <= 2) {
        bgKey = 'bg-phase1'; // Phase 1-2: Liberty of Freedom
      } else if (phaseId <= 4) {
        bgKey = 'bg-phase2'; // Phase 3-4: City Sky
      } else {
        bgKey = 'bg-phase3'; // Phase 5-6: Grand Canyon
      }

      console.log(`[PHASE ${phaseId}] Changing background from current to ${bgKey}`);

      // Stop any existing background tweens
      this.tweens.killTweensOf(this.backgroundImage);

      // Smooth fade transition
      this.tweens.add({
        targets: this.backgroundImage,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          if (this.backgroundImage) {
            console.log(`[PHASE ${phaseId}] Setting texture to ${bgKey}`);
            this.backgroundImage.setTexture(bgKey);
            this.tweens.add({
              targets: this.backgroundImage,
              alpha: 0.8,
              duration: 300,
              onComplete: () => {
                console.log(`[PHASE ${phaseId}] Background change complete!`);
              }
            });
          }
        }
      });
    } else {
      console.warn(`[PHASE ${phaseId}] Background image not found!`);
    }

    // Change background color (fallback)
    this.cameras.main.setBackgroundColor(phase.background);

    // Show phase announcement
    this.showPhaseAnnouncement(phase);
  }

  private checkPhaseProgression(): void {
    const phase = GameConfig.phases[this.currentPhase - 1];

    // If endless phase (WAGMI Mode), don't progress
    if (phase.duration === -1) return;

    const phaseElapsed = Math.floor((Date.now() - this.phaseStartTime) / 1000);

    if (phaseElapsed >= phase.duration) {
      // Move to next phase
      this.startPhase(this.currentPhase + 1);
    }
  }

  private showPhaseAnnouncement(phase: any): void {
    // Prevent showing multiple announcements at once
    if (this.showingPhaseAnnouncement) return;

    this.showingPhaseAnnouncement = true;

    // Play phase change sound
    this.sound.play('phase-change', { volume: 0.7 });

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Phase announcement
    const phaseText = this.add.text(width / 2, height / 2, `${phase.name}\n${phase.description}`, {
      fontSize: '64px',
      color: '#E63946',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 8
    }).setOrigin(0.5);
    phaseText.setDepth(2000);
    phaseText.setAlpha(0);

    // Fade in
    this.tweens.add({
      targets: phaseText,
      alpha: 1,
      scale: 1.2,
      duration: 500,
      ease: 'Back.easeOut'
    });

    // Hold for 2 seconds then fade out
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: phaseText,
        alpha: 0,
        y: height / 2 - 100,
        duration: 800,
        ease: 'Power2',
        onComplete: () => {
          phaseText.destroy();
          this.showingPhaseAnnouncement = false; // Reset flag when animation completes
        }
      });
    });

    // Special effects for WAGMI Mode
    if (phase.id === 6) {
      this.activateWAGMIMode();
    }
  }

  private activateWAGMIMode(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Flash effect
    const flash = this.add.graphics();
    flash.setDepth(1999);

    let colorIndex = 0;
    const colors = [0xFF0000, 0xFFFFFF, 0x0000FF];

    const flashInterval = this.time.addEvent({
      delay: 200,
      callback: () => {
        flash.clear();
        flash.fillStyle(colors[colorIndex % 3], 0.3);
        flash.fillRect(0, 0, width, height);
        colorIndex++;
      },
      repeat: 8
    });

    this.time.delayedCall(2000, () => {
      flash.destroy();
      flashInterval.remove();
    });

    // WAGMI announcement
    this.showMemePopup('🇺🇸 WAGMI MODE - FREEDOM ACHIEVED 🦅', '#FBB13C');
  }

  // ========== SPAWN METHODS ==========
  private spawnCoin(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Random Y position
    const y = Phaser.Math.Between(150, height - 150);

    // Create coin container
    const coin = this.add.container(width + 100, y);

    // Choose coin type based on spawn chances from GameConfig
    const roll = Phaser.Math.Between(1, 100);
    let coinImage: Phaser.GameObjects.Image;
    let points: number;
    let type: string;
    let coinKey: string;

    // v3.2: Updated spawn distribution (40% BONK, 25% AOL, 15% VALOR, 10% USD1, 10% BURGER)
    if (roll <= 40) {
      // BONK (40%)
      coinKey = 'coin-bonk';
      points = GameConfig.coins.BONK.points;
      type = 'bonk';
    } else if (roll <= 65) {
      // AOL (25%)
      coinKey = 'coin-aol';
      points = GameConfig.coins.AOL.points;
      type = 'aol';
    } else if (roll <= 80) {
      // VALOR (15%) - v3.2 NEW
      coinKey = 'coin-valor';
      points = GameConfig.coins.VALOR.points;
      type = 'valor';
    } else if (roll <= 90) {
      // USD1 (10%)
      coinKey = 'coin-usd1';
      points = GameConfig.coins.USD1.points;
      type = 'usd1';
    } else {
      // BURGER (10%)
      coinKey = 'coin-burger';
      points = GameConfig.coins.BURGER.points;
      type = 'burger';
    }

    coinImage = this.add.image(0, 0, coinKey);

    // v3.2: Size scaling for special coins
    if (type === 'valor') {
      coinImage.setScale(0.18); // VALOR largest (premium coin)
    } else if (type === 'aol') {
      coinImage.setScale(0.16); // AOL bigger (combo importance)
    } else {
      coinImage.setScale(0.12); // Normal size for other coins
    }

    coin.add(coinImage);
    coin.setData('points', points);
    coin.setData('type', type);
    coin.setData('collected', false);
    coin.setSize(100, 100);

    // Subtle rotation animation
    this.tweens.add({
      targets: coin,
      angle: 360,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });

    this.coins.push(coin);
  }

  private spawnEnemy(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Get current phase
    const phase = GameConfig.phases[this.currentPhase - 1];

    // Choose random enemy from current phase's enemy list
    const enemyTypes = phase.enemies;
    const randomEnemyType = enemyTypes[Phaser.Math.Between(0, enemyTypes.length - 1)];

    // Get enemy config
    const enemyConfig = (GameConfig.enemies as any)[randomEnemyType];
    if (!enemyConfig) return;

    // Random Y position
    const y = Phaser.Math.Between(150, height - 150);

    // Create enemy container
    const enemy = this.add.container(width + 100, y);

    // Create enemy sprite
    const enemyImage = this.add.image(0, 0, enemyConfig.sprite);
    enemyImage.setScale(enemyConfig.scale);
    enemyImage.setFlipX(true); // Face left

    enemy.add(enemyImage);
    enemy.setSize(enemyConfig.size.width, enemyConfig.size.height);
    enemy.setData('type', randomEnemyType);
    enemy.setData('config', enemyConfig);

    // Special behavior for Paper Hands Pete - occasionally drops fake coins
    if (randomEnemyType === 'paperHands') {
      this.time.delayedCall(Phaser.Math.Between(2000, 4000), () => {
        if (enemy.active) {
          this.spawnFakeCoin(enemy.x, enemy.y);
        }
      });
    }

    // Special behavior for Gary - throws lawsuit papers
    if (randomEnemyType === 'gary') {
      this.time.delayedCall(Phaser.Math.Between(1000, 3000), () => {
        if (enemy.active) {
          this.spawnLawsuitPaper(enemy.x, enemy.y);
        }
      });
    }

    this.enemies.push(enemy);
  }

  private spawnFakeCoin(x: number, y: number): void {
    // Create fake coin that looks like real coin but causes penalty
    const fakeCoin = this.add.container(x, y);

    const coinImage = this.add.image(0, 0, 'coin-usd1');
    coinImage.setScale(0.12);
    coinImage.setTint(0x888888); // Gray tint to show it's fake

    fakeCoin.add(coinImage);
    fakeCoin.setData('penalty', -10);
    fakeCoin.setData('collected', false);
    fakeCoin.setSize(100, 100);

    // Wobble animation to indicate it's fake
    this.tweens.add({
      targets: fakeCoin,
      angle: { from: -15, to: 15 },
      duration: 300,
      yoyo: true,
      repeat: -1
    });

    this.fakeCoins.push(fakeCoin);
  }

  private spawnLawsuitPaper(x: number, y: number): void {
    // Create lawsuit paper projectile
    const paper = this.add.container(x, y);

    // Create paper visual (simple rectangle for now)
    const paperGraphics = this.add.graphics();
    paperGraphics.fillStyle(0xFFFFFF, 1);
    paperGraphics.fillRect(-20, -30, 40, 60);
    paperGraphics.lineStyle(2, 0x000000, 1);
    paperGraphics.strokeRect(-20, -30, 40, 60);

    // Add text
    const text = this.add.text(0, 0, '📄', {
      fontSize: '32px'
    }).setOrigin(0.5);

    paper.add([paperGraphics, text]);
    paper.setSize(40, 60);
    paper.setData('type', 'lawsuit');

    // Floating down animation
    this.tweens.add({
      targets: paper,
      y: paper.y + 400,
      duration: 3000,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        paper.destroy();
        const index = this.lawsuitPapers.indexOf(paper);
        if (index > -1) this.lawsuitPapers.splice(index, 1);
      }
    });

    this.lawsuitPapers.push(paper);
  }

  private spawnPowerup(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const y = Phaser.Math.Between(150, height - 150);

    // Check if we should spawn Vesper (every 500 points)
    if (this.score > 0 && this.score % 500 === 0 && !this.bullMarketActive) {
      this.spawnVesper();
      return;
    }

    // Randomly choose powerup type (excluding buyback which is triggered by AOL combo)
    const powerupTypes = ['shield', 'solanaSurge', 'belleMod'];
    const randomType = powerupTypes[Phaser.Math.Between(0, powerupTypes.length - 1)];

    const powerup = this.add.container(width + 100, y);

    let icon: string | Phaser.GameObjects.Image;
    let glowColor: number;

    switch (randomType) {
      case 'shield':
        icon = this.add.image(0, 0, 'america-hat');
        icon.setScale(0.15);
        glowColor = 0xFF0000; // Red glow for America
        break;
      case 'solanaSurge':
        icon = '⚡';
        glowColor = 0xFF00FF;
        break;
      case 'belleMod':
        icon = this.add.image(0, 0, 'mod-belle');
        icon.setScale(0.1); // Smaller icon
        glowColor = 0xFFD700; // Gold glow for MOD
        break;
      default:
        icon = this.add.image(0, 0, 'america-hat');
        icon.setScale(0.15);
        glowColor = 0xFF0000;
    }

    // Glow effect
    const glow = this.add.graphics();
    glow.fillStyle(glowColor, 0.3);
    glow.fillCircle(0, 0, 50);

    // Add icon (either text or image)
    if (typeof icon === 'string') {
      const iconText = this.add.text(0, 0, icon, {
        fontSize: '64px'
      }).setOrigin(0.5);
      powerup.add([glow, iconText]);
    } else {
      powerup.add([glow, icon]);
    }

    powerup.setData('type', randomType);
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

  // ========== POWER-UP ACTIVATION ==========
  private activateMagnet(): void {
    if (this.magnetActive) return;

    this.magnetActive = true;
    this.aolCombo = 0;
    this.updateAOLCombo();

    this.magnetIcon?.setVisible(true);
    this.magnetTimerText?.setVisible(true);

    // Play buyback voice sound
    this.sound.play('buyback-voice', { volume: 0.7 });

    // Visual feedback
    const text = this.add.text(this.cameras.main.width / 2, 200, '🧲 BUYBACK ACTIVATED!\nCoins fly to you like liquidity 💸', {
      fontSize: '42px',
      color: '#FBB13C',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    text.setDepth(2000);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: 150,
      duration: 1500,
      onComplete: () => text.destroy()
    });

    // Deactivate after 5 seconds
    const duration = GameConfig.powerUps.buybackMode.duration;
    this.magnetTimer = this.time.delayedCall(duration, () => {
      this.magnetActive = false;
      this.magnetIcon?.setVisible(false);
      this.magnetTimerText?.setVisible(false);
    });
  }

  private activateShield(): void {
    if (this.shieldActive) return;

    this.shieldActive = true;
    this.shieldIcon?.setVisible(true);
    this.shieldTimerText?.setVisible(true);

    // Play shield activation sound
    this.sound.play('shield-activate', { volume: 0.5 });

    // Start shield active loop sound
    if (this.cache.audio.exists('shield-active-loop')) {
      this.shieldLoopSound = this.sound.add('shield-active-loop', {
        volume: 0.3,
        loop: true
      });
      this.shieldLoopSound.play();
    }

    // Visual feedback
    const text = this.add.text(this.cameras.main.width / 2, 200, '🇺🇸 AMERICA HAT PROTECTION ACTIVATED!', {
      fontSize: '48px',
      color: '#FF0000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    text.setDepth(2000);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: 150,
      duration: 1500,
      onComplete: () => text.destroy()
    });

    // Create beautiful shield graphics that follows eagle
    this.shieldGraphics = this.add.graphics();
    this.shieldGraphics.setDepth(99);

    // Pulse animation for shield
    const duration = GameConfig.powerUps.freedomShield.duration;
    this.tweens.add({
      targets: this.shieldGraphics,
      alpha: 0.6,
      duration: 500,
      yoyo: true,
      repeat: (duration / 500) - 1,
      onComplete: () => {
        if (this.shieldGraphics) {
          this.shieldGraphics.destroy();
          this.shieldGraphics = undefined;
        }
      }
    });

    // Deactivate after duration
    this.shieldTimer = this.time.delayedCall(duration, () => {
      this.shieldActive = false;
      this.shieldIcon?.setVisible(false);
      this.shieldTimerText?.setVisible(false);
      if (this.shieldGraphics) {
        this.shieldGraphics.destroy();
        this.shieldGraphics = undefined;
      }
      // Stop shield loop sound
      if (this.shieldLoopSound) {
        this.shieldLoopSound.stop();
        this.shieldLoopSound = undefined;
      }
    });
  }

  private activateSolanaSurge(): void {
    if (this.solanaSurgeActive) return;

    this.solanaSurgeActive = true;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Lightning flash effect
    const flash = this.add.graphics();
    flash.fillStyle(0x9945FF, 0.6); // Solana purple
    flash.fillRect(0, 0, width, height);
    flash.setDepth(1999);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      repeat: 2,
      yoyo: true,
      onComplete: () => flash.destroy()
    });

    // Lightning bolts animation
    for (let i = 0; i < 5; i++) {
      const bolt = this.add.graphics();
      bolt.lineStyle(6, 0xFFFF00, 1);

      const startX = Phaser.Math.Between(0, width);
      const startY = 0;
      const endX = startX + Phaser.Math.Between(-100, 100);
      const endY = height;
      const midX = (startX + endX) / 2 + Phaser.Math.Between(-50, 50);
      const midY = height / 2;

      bolt.beginPath();
      bolt.moveTo(startX, startY);
      bolt.lineTo(midX, midY);
      bolt.lineTo(endX, endY);
      bolt.strokePath();
      bolt.setDepth(2000);
      bolt.setAlpha(0.8);

      this.time.delayedCall(i * 100, () => {
        this.tweens.add({
          targets: bolt,
          alpha: 0,
          duration: 400,
          onComplete: () => bolt.destroy()
        });
      });
    }

    // Visual feedback text
    const text = this.add.text(width / 2, 200, '⚡ SOLANA SURGE!\nSpeed Boost Activated', {
      fontSize: '48px',
      color: '#9945FF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    text.setDepth(2001);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: 150,
      duration: 1500,
      onComplete: () => text.destroy()
    });

    // Temporarily increase speeds
    const originalCoinSpeed = this.coinSpeed;
    const originalEnemySpeed = this.enemySpeed;

    const boost = GameConfig.powerUps.solanaSurge.speedBoost;
    this.coinSpeed *= boost;
    this.enemySpeed *= boost;

    // Deactivate after duration
    const duration = GameConfig.powerUps.solanaSurge.duration;
    this.solanaSurgeTimer = this.time.delayedCall(duration, () => {
      this.solanaSurgeActive = false;
      this.coinSpeed = originalCoinSpeed;
      this.enemySpeed = originalEnemySpeed;
    });
  }

  private activateBelleMod(): void {
    if (this.belleModActive) return;

    this.belleModActive = true;
    this.belleIcon?.setVisible(true);
    this.belleTimerText?.setVisible(true);

    // Play Belle collection sound
    this.sound.play('belle-collect', { volume: 0.6 });

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Visual feedback text
    const text = this.add.text(width / 2, 200, 'Κρόνος Belle is watching 👁️', {
      fontSize: '48px',
      color: '#FFD700',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    text.setDepth(2000);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: 150,
      duration: 1500,
      onComplete: () => text.destroy()
    });

    // Create Belle sprite companion (follows eagle, slightly offset)
    this.belleSprite = this.add.image(0, 0, 'mod-belle');
    this.belleSprite.setScale(0.12); // Made smaller - was too big
    this.belleSprite.setDepth(150);

    // Create protection aura
    this.belleAura = this.add.graphics();
    this.belleAura.setDepth(99);

    // Pulse animation for aura
    const duration = GameConfig.powerUps.belleMod.duration;
    this.tweens.add({
      targets: this.belleAura,
      alpha: 0.4,
      duration: 600,
      yoyo: true,
      repeat: (duration / 600) - 1,
      onComplete: () => {
        if (this.belleAura) {
          this.belleAura.destroy();
          this.belleAura = undefined;
        }
      }
    });

    // Floating animation for Belle
    this.tweens.add({
      targets: this.belleSprite,
      y: '+=10',
      duration: 800,
      yoyo: true,
      repeat: (duration / 800) - 1
    });

    // Deactivate after duration
    this.belleModTimer = this.time.delayedCall(duration, () => {
      this.belleModActive = false;
      this.belleIcon?.setVisible(false);
      this.belleTimerText?.setVisible(false);
      if (this.belleSprite) {
        this.belleSprite.destroy();
        this.belleSprite = undefined;
      }
      if (this.belleAura) {
        this.belleAura.destroy();
        this.belleAura = undefined;
      }
    });
  }

  private blockControls(duration: number): void {
    this.controlBlocked = true;

    // Visual feedback
    const text = this.add.text(this.cameras.main.width / 2, 300, '⚠️ CONTROLS BLOCKED!\nUnregistered Security!', {
      fontSize: '36px',
      color: '#FF0000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    text.setDepth(2000);

    this.tweens.add({
      targets: text,
      alpha: 0,
      duration: duration,
      onComplete: () => text.destroy()
    });

    // Unblock after duration
    this.controlBlockTimer = this.time.delayedCall(duration, () => {
      this.controlBlocked = false;
    });
  }

  private activateBurgerMultiplier(): void {
    if (this.burgerMultiplierActive) return;

    this.burgerMultiplierActive = true;

    // Visual feedback
    const text = this.add.text(this.cameras.main.width / 2, 200, '🍔 BURGER MULTIPLIER!\nScore x2 for 5 seconds', {
      fontSize: '48px',
      color: '#FBB13C',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 4
    }).setOrigin(0.5);
    text.setDepth(2000);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: 150,
      duration: 1500,
      onComplete: () => text.destroy()
    });

    // Deactivate after duration
    const duration = GameConfig.coins.BURGER.multiplierDuration;
    this.burgerMultiplierTimer = this.time.delayedCall(duration, () => {
      this.burgerMultiplierActive = false;
    });
  }

  private updateAOLCombo(): void {
    this.burgerCountText?.setText(`AOL: ${this.aolCombo}/3`);

    // Animation
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

  private updatePowerupTimers(): void {
    // Update Magnet/Buyback timer
    if (this.magnetActive && this.magnetTimer && this.magnetTimerText) {
      const remaining = Math.ceil((this.magnetTimer.delay - this.magnetTimer.elapsed) / 1000);
      this.magnetTimerText.setText(`BUYBACK ${remaining}s`);

      // Blink warning when < 3 seconds - more prominent
      if (remaining <= 3) {
        this.magnetTimerText.setColor(remaining % 2 === 0 ? '#FF0000' : '#666666');
        this.magnetIcon?.setAlpha(remaining % 2 === 0 ? 0.4 : 1);
        this.magnetIcon?.setScale(remaining % 2 === 0 ? 1.2 : 1); // Pulse effect
      }
    }

    // Update Shield timer
    if (this.shieldActive && this.shieldTimer && this.shieldTimerText) {
      const remaining = Math.ceil((this.shieldTimer.delay - this.shieldTimer.elapsed) / 1000);
      this.shieldTimerText.setText(`SHIELD ${remaining}s`);

      // Blink warning when < 3 seconds - more prominent
      if (remaining <= 3) {
        this.shieldTimerText.setColor(remaining % 2 === 0 ? '#FF0000' : '#666666');
        this.shieldIcon?.setAlpha(remaining % 2 === 0 ? 0.4 : 1);
        this.shieldIcon?.setScale(remaining % 2 === 0 ? 1.2 : 1); // Pulse effect
      }
    }

    // Update Belle MOD timer
    if (this.belleModActive && this.belleModTimer && this.belleTimerText) {
      const remaining = Math.ceil((this.belleModTimer.delay - this.belleModTimer.elapsed) / 1000);
      this.belleTimerText.setText(`BELLE ${remaining}s`);

      // Blink warning when < 3 seconds - more prominent
      if (remaining <= 3) {
        this.belleTimerText.setColor(remaining % 2 === 0 ? '#FF0000' : '#666666');
        this.belleIcon?.setAlpha(remaining % 2 === 0 ? 0.4 : 1);
        this.belleIcon?.setScale(remaining % 2 === 0 ? 1.2 : 1); // Pulse effect
      }
    }

    // Update Bull Market timer
    if (this.bullMarketActive && this.bullMarketTimer && this.bullMarketTimerText) {
      const remaining = Math.ceil((this.bullMarketTimer.delay - this.bullMarketTimer.elapsed) / 1000);
      this.bullMarketTimerText.setText(`BULL ${remaining}s`);

      // Blink warning when < 3 seconds - more prominent
      if (remaining <= 3) {
        this.bullMarketTimerText.setColor(remaining % 2 === 0 ? '#FF0000' : '#666666');
        this.bullMarketIcon?.setAlpha(remaining % 2 === 0 ? 0.4 : 1);
        this.bullMarketIcon?.setScale(remaining % 2 === 0 ? 1.2 : 1); // Pulse effect
      }
    }
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

    // Update power-up timers
    this.updatePowerupTimers();

    // Update shield graphics to follow eagle
    if (this.shieldActive && this.shieldGraphics) {
      this.shieldGraphics.clear();

      // Check if shield is about to expire (< 3 seconds)
      let shieldAlphaMultiplier = 1.0;
      if (this.shieldTimer) {
        const remaining = Math.ceil((this.shieldTimer.delay - this.shieldTimer.elapsed) / 1000);
        if (remaining <= 3) {
          // Blink effect when < 3 seconds remaining
          shieldAlphaMultiplier = Math.floor(Date.now() / 250) % 2 === 0 ? 0.3 : 1;
        }
      }

      // Draw beautiful layered shield with alpha multiplier
      // Outer glow
      this.shieldGraphics.fillStyle(0x00AAFF, 0.2 * shieldAlphaMultiplier);
      this.shieldGraphics.fillCircle(this.eagle.x, this.eagle.y, 100);

      // Middle ring
      this.shieldGraphics.lineStyle(6, 0x00DDFF, 0.8 * shieldAlphaMultiplier);
      this.shieldGraphics.strokeCircle(this.eagle.x, this.eagle.y, 85);

      // Inner ring
      this.shieldGraphics.lineStyle(4, 0x88EEFF, 1 * shieldAlphaMultiplier);
      this.shieldGraphics.strokeCircle(this.eagle.x, this.eagle.y, 75);

      // Energy particles effect (optional rotating dots)
      const time = Date.now() / 1000;
      for (let i = 0; i < 8; i++) {
        const angle = (time * 2 + i * Math.PI / 4) % (Math.PI * 2);
        const px = this.eagle.x + Math.cos(angle) * 82;
        const py = this.eagle.y + Math.sin(angle) * 82;
        this.shieldGraphics.fillStyle(0xFFFFFF, 0.9 * shieldAlphaMultiplier);
        this.shieldGraphics.fillCircle(px, py, 3);
      }
    }

    // Update Belle MOD companion and aura
    if (this.belleModActive) {
      // Position Belle sprite next to eagle (offset left-up)
      if (this.belleSprite) {
        this.belleSprite.setPosition(this.eagle.x - 80, this.eagle.y - 60);

        // Blink warning when < 3 seconds remaining
        if (this.belleModTimer) {
          const remaining = Math.ceil((this.belleModTimer.delay - this.belleModTimer.elapsed) / 1000);
          if (remaining <= 3) {
            // Flash Belle sprite on/off
            this.belleSprite.setAlpha(Math.floor(Date.now() / 250) % 2 === 0 ? 0.3 : 1);
          }
        }
      }

      // Draw protection aura
      if (this.belleAura) {
        this.belleAura.clear();

        // Check if warning phase
        let auraAlpha = 0.15;
        if (this.belleModTimer) {
          const remaining = Math.ceil((this.belleModTimer.delay - this.belleModTimer.elapsed) / 1000);
          if (remaining <= 3) {
            // Pulsing aura when time running out
            auraAlpha = Math.floor(Date.now() / 250) % 2 === 0 ? 0.05 : 0.25;
          }
        }

        // Golden glow aura
        this.belleAura.fillStyle(0xFFD700, auraAlpha);
        this.belleAura.fillCircle(this.eagle.x, this.eagle.y, 110);

        // Golden ring
        this.belleAura.lineStyle(5, 0xFFD700, 0.7);
        this.belleAura.strokeCircle(this.eagle.x, this.eagle.y, 95);

        // Inner gold ring
        this.belleAura.lineStyle(3, 0xFFF59D, 1);
        this.belleAura.strokeCircle(this.eagle.x, this.eagle.y, 85);
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

        // Play coin collection sound
        this.sound.play('coin-collect', { volume: 0.4 });

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

          // Apply burger multiplier if active
          let finalPoints = points + bonusPoints;
          if (this.burgerMultiplierActive) {
            finalPoints *= 2;
          }

          // Apply bull market bonus (×2 coin value)
          if (this.bullMarketActive) {
            finalPoints *= 2;
          }

          this.score += finalPoints;
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

        // Track AOL combo for Buyback Mode
        if (type === 'aol') {
          this.aolCombo++;
          this.aolCount++;
          this.updateAOLCombo();
          if (this.aolCountText) {
            this.aolCountText.setText(`🟣 $AOL: ${this.aolCount}`);
          }

          if (this.aolCombo >= 3) {
            this.activateMagnet();
          }
        } else {
          // Reset AOL combo if other coin collected
          this.aolCombo = 0;
          this.updateAOLCombo();
        }

        // Update coin counters
        if (type === 'bonk') {
          this.bonkCount++;
          if (this.bonkCountText) {
            this.bonkCountText.setText(`🐕 $BONK: ${this.bonkCount}`);
          }
        } else if (type === 'burger') {
          this.burgerCount++;
          if (this.burgerCountDisplayText) {
            this.burgerCountDisplayText.setText(`🍔 $BURGER: ${this.burgerCount}`);
          }
          this.activateBurgerMultiplier();
        } else if (type === 'usd1') {
          this.usd1Count++;
          if (this.usd1CountText) {
            this.usd1CountText.setText(`💵 $USD1: ${this.usd1Count}`);
          }
        } else if (type === 'valor') {
          // v3.2: VALOR coin collection
          this.valorCount++;
          if (this.valorCountText) {
            this.valorCountText.setText(`🦅 $VALOR: ${this.valorCount}`);
          }

          // 5% chance to spawn Gold Feather
          const goldFeatherRoll = Math.random() * 100;
          if (goldFeatherRoll < 5) {
            this.spawnGoldFeather(coin.y);
          }
        }

        // Show coin collection feedback with points
        let coinName = '';
        let coinColor = '';

        switch (type) {
          case 'bonk':
            coinName = '$BONK';
            coinColor = '#FF6B00';
            break;
          case 'aol':
            coinName = '$AOL';
            coinColor = '#9370DB';
            break;
          case 'usd1':
            coinName = '$USD1';
            coinColor = '#4CAF50';
            break;
          case 'burger':
            coinName = '$BURGER';
            coinColor = '#FBB13C';
            break;
        }

        const feedbackText = this.add.text(coin.x, coin.y, `${coinName} +${points}`, {
          fontSize: '32px',
          color: coinColor,
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

        switch (type) {
          case 'shield':
            this.activateShield();
            break;
          case 'solanaSurge':
            this.activateSolanaSurge();
            break;
          case 'belleMod':
            this.activateBelleMod();
            break;
          case 'vesper':
            this.activateBullMarket();
            break;
          case 'goldFeather':
            // v3.2: Activate VALOR MODE
            this.activateValorMode();
            this.sound.play('buyback-voice', { volume: 0.9 });
            break;
        }

        powerup.destroy();
        this.powerups.splice(i, 1);
      }
    }

    // Update fake coins
    for (let i = this.fakeCoins.length - 1; i >= 0; i--) {
      const fakeCoin = this.fakeCoins[i];

      if (!fakeCoin || !fakeCoin.active || fakeCoin.getData('collected')) continue;

      fakeCoin.x -= this.coinSpeed * (this.game.loop.delta / 1000);

      if (fakeCoin.x < -100) {
        fakeCoin.destroy();
        this.fakeCoins.splice(i, 1);
        continue;
      }

      // Check collision with eagle
      const distance = Phaser.Math.Distance.Between(
        fakeCoin.x,
        fakeCoin.y,
        this.eagle.x,
        this.eagle.y
      );

      if (distance < 80) {
        fakeCoin.setData('collected', true);

        // Check if shield or Belle MOD is active
        if (this.shieldActive || this.belleModActive) {
          // Shield or Belle MOD protects against fake coins
          const feedbackMessage = this.belleModActive ? 'DELETED!' : 'BLOCKED!';
          const feedbackColor = this.belleModActive ? '#FFD700' : '#00FF00';
          const feedbackText = this.add.text(fakeCoin.x, fakeCoin.y, feedbackMessage, {
            fontSize: '32px',
            color: feedbackColor,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#FFFFFF',
            strokeThickness: 4
          }).setOrigin(0.5);
          feedbackText.setDepth(500);

          this.tweens.add({
            targets: feedbackText,
            y: feedbackText.y - 60,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => feedbackText.destroy()
          });

          this.fakeCoins.splice(i, 1);
          fakeCoin.destroy();
          continue;
        }

        // Show death feedback for fake coin
        const feedbackText = this.add.text(fakeCoin.x, fakeCoin.y, 'FAKE!', {
          fontSize: '40px',
          color: '#FF0000',
          fontFamily: 'Arial',
          fontStyle: 'bold',
          stroke: '#FFFFFF',
          strokeThickness: 5
        }).setOrigin(0.5);
        feedbackText.setDepth(500);

        this.tweens.add({
          targets: feedbackText,
          y: feedbackText.y - 80,
          alpha: 0,
          duration: 800,
          ease: 'Power2',
          onComplete: () => feedbackText.destroy()
        });

        // Strong visual shake effect
        this.cameras.main.shake(400, 0.01);

        this.fakeCoins.splice(i, 1);
        fakeCoin.destroy();

        // Game over - fake coin is deadly
        this.gameOver();
      }
    }

    // Update lawsuit papers
    for (let i = this.lawsuitPapers.length - 1; i >= 0; i--) {
      const paper = this.lawsuitPapers[i];

      if (!paper || !paper.active) continue;

      paper.x -= (this.coinSpeed * 0.5) * (this.game.loop.delta / 1000);

      if (paper.x < -100) {
        paper.destroy();
        this.lawsuitPapers.splice(i, 1);
        continue;
      }

      // Check collision with eagle
      const distance = Phaser.Math.Distance.Between(
        paper.x,
        paper.y,
        this.eagle.x,
        this.eagle.y
      );

      if (distance < 80) {
        // Block controls temporarily
        const duration = GameConfig.enemies.gary.controlBlockDuration;
        this.blockControls(duration);

        // Visual effect
        this.cameras.main.shake(300, 0.008);

        paper.destroy();
        this.lawsuitPapers.splice(i, 1);
      }
    }

    // Update enemies - move towards player
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // Skip if destroyed
      if (!enemy || !enemy.active) continue;

      const enemyConfig = enemy.getData('config');
      const enemyType = enemy.getData('type');

      // Different speeds for different enemies
      const speed = enemyConfig.speed * (this.game.loop.delta / 1000);
      enemy.x -= speed;

      // Remove off-screen enemies
      if (enemy.x < -200) {
        enemy.destroy();
        this.enemies.splice(i, 1);
        continue;
      }

      // Check collision with eagle (ignore if shield is active)
      const distance = Phaser.Math.Distance.Between(
        enemy.x,
        enemy.y,
        this.eagle.x,
        this.eagle.y
      );

      // Collision radius based on enemy size
      const collisionRadius = Math.max(enemyConfig.size.width, enemyConfig.size.height) / 2;

      if (distance < collisionRadius + 40) {
        if (this.shieldActive || this.belleModActive) {
          // Shield or Belle MOD protects - destroy enemy
          enemy.destroy();
          this.enemies.splice(i, 1);

          // Visual feedback
          const feedbackMessage = this.belleModActive ? 'BANNED!' : 'BLOCKED!';
          const feedbackColor = this.belleModActive ? '#FFD700' : '#00FF00';
          const text = this.add.text(enemy.x, enemy.y, feedbackMessage, {
            fontSize: '32px',
            color: feedbackColor,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#FFFFFF',
            strokeThickness: 4
          }).setOrigin(0.5);
          text.setDepth(2000);

          this.tweens.add({
            targets: text,
            alpha: 0,
            y: text.y - 50,
            duration: 800,
            onComplete: () => text.destroy()
          });

          // Screen shake
          this.cameras.main.shake(150, 0.003);
        } else {
          // Hit by enemy - game over
          // Play crash sound
          this.sound.play('crash', { volume: 0.6 });

          // Show enemy meme text
          const meme = enemyConfig.meme;
          this.showMemePopup(meme, '#FF0000');

          this.gameOver();
        }
      }
    }
  }

  private gameOver(): void {
    if (this.isGameOver) return;
    this.isGameOver = true;

    console.log('GAME OVER! Final score:', this.score);

    // Stop ALL music and sounds
    this.sound.stopByKey('background-music');
    this.sound.stopByKey('background-music-2');
    this.sound.stopByKey('shield-active-loop');
    if (this.currentBackgroundMusic) {
      this.currentBackgroundMusic.stop();
    }
    if (this.shieldLoopSound) {
      this.shieldLoopSound.stop();
      this.shieldLoopSound = undefined;
    }

    // Play game over sound
    if (this.cache.audio.exists('crash')) {
      this.sound.play('crash', { volume: 0.5 });
    }

    // Pause physics immediately
    this.physics.pause();

    // Stop all timers
    this.coinSpawnTimer?.remove();
    this.enemySpawnTimer?.remove();
    this.gameTimer?.remove();
    this.powerupSpawnTimer?.remove();
    this.taglineTimer?.remove();
    this.phaseTimer?.remove();

    // Stop all power-up timers
    this.magnetTimer?.remove();
    this.shieldTimer?.remove();
    this.burgerMultiplierTimer?.remove();
    this.solanaSurgeTimer?.remove();
    this.controlBlockTimer?.remove();
    this.belleModTimer?.remove();
    this.bullMarketTimer?.remove();

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
    this.enemySpawnTimer?.remove();
    this.gameTimer?.remove();
    this.powerupSpawnTimer?.remove();
    this.taglineTimer?.remove();
    this.phaseTimer?.remove();
    this.magnetTimer?.remove();
    this.shieldTimer?.remove();
    this.burgerMultiplierTimer?.remove();
    this.solanaSurgeTimer?.remove();
    this.controlBlockTimer?.remove();

    // Stop game music
    this.sound.stopByKey('background-music');

    this.scene.start('StartScene');
  }

  // ========== v3.2: GOLD FEATHER (VALOR MODE TRIGGER) ==========
  private spawnGoldFeather(y: number): void {
    const width = this.cameras.main.width;

    const feather = this.add.container(width + 100, y);

    // Gold feather image
    const featherIcon = this.add.image(0, 0, 'feder-pixel');
    featherIcon.setScale(0.2);

    // Golden sparkle ring
    const sparkleRing = this.add.graphics();
    sparkleRing.lineStyle(3, 0xFFD700, 0.8);
    sparkleRing.strokeCircle(0, 0, 60);

    // Pulsing glow
    const glow = this.add.graphics();
    glow.fillStyle(0xFFD700, 0.4);
    glow.fillCircle(0, 0, 70);

    feather.add([glow, sparkleRing, featherIcon]);
    feather.setData('type', 'goldFeather');
    feather.setSize(100, 100);

    // Pulsing animation
    this.tweens.add({
      targets: feather,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Rotation
    this.tweens.add({
      targets: featherIcon,
      angle: 360,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });

    this.powerups.push(feather);
  }

  // ========== VESPER (BULL OF WISDOM) ==========
  private spawnVesper(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const y = height / 2;

    const vesper = this.add.container(width + 100, y);

    // Vesper image
    const vesperImage = this.add.image(0, 0, 'vesper');
    vesperImage.setScale(0.3);

    // Golden glow for wisdom
    const glow = this.add.graphics();
    glow.fillStyle(0xFFD700, 0.4);
    glow.fillCircle(0, 0, 80);

    vesper.add([glow, vesperImage]);
    vesper.setData('type', 'vesper');
    vesper.setSize(120, 120);

    // Majestic floating animation
    this.tweens.add({
      targets: vesper,
      y: y - 20,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Wisdom quotes
    const quotes = [
      "Patience is the true alpha.",
      "Even bears bow before momentum.",
      "Let your wings be guided by conviction."
    ];
    const randomQuote = quotes[Phaser.Math.Between(0, quotes.length - 1)];

    // Show quote above Vesper
    const quoteText = this.add.text(0, -100, randomQuote, {
      fontSize: '24px',
      color: '#FFD700',
      fontFamily: 'Arial',
      fontStyle: 'italic',
      align: 'center',
      wordWrap: { width: 300 }
    }).setOrigin(0.5);
    vesper.add(quoteText);

    this.powerups.push(vesper);
  }

  private activateBullMarket(): void {
    if (this.bullMarketActive) return;

    this.bullMarketActive = true;
    this.extraLives++;

    const width = this.cameras.main.width;

    // Visual feedback
    const text = this.add.text(width / 2, 200, `🐂 BULL MARKET MODE!\n+1 Extra Life | Coins ×2\n"${this.getRandomWisdom()}"`, {
      fontSize: '42px',
      color: '#00FF00',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    text.setDepth(2000);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: 150,
      duration: 3000,
      onComplete: () => text.destroy()
    });

    // Show bull market indicator
    this.bullMarketIcon?.setVisible(true);
    this.bullMarketTimerText?.setVisible(true);

    // Slow down game speed
    const originalCoinSpeed = this.coinSpeed;
    const originalEnemySpeed = this.enemySpeed;
    this.coinSpeed *= 0.7; // 30% slower
    this.enemySpeed *= 0.7;

    // Double coin values temporarily
    const duration = 10000; // 10 seconds
    this.bullMarketTimer = this.time.delayedCall(duration, () => {
      this.bullMarketActive = false;
      this.bullMarketIcon?.setVisible(false);
      this.bullMarketTimerText?.setVisible(false);
      this.coinSpeed = originalCoinSpeed;
      this.enemySpeed = originalEnemySpeed;
    });
  }

  private getRandomWisdom(): string {
    const wisdoms = [
      "Patience is the true alpha.",
      "Even bears bow before momentum.",
      "Let your wings be guided by conviction.",
      "The bull always rises.",
      "Diamond hands forge legends."
    ];
    return wisdoms[Phaser.Math.Between(0, wisdoms.length - 1)];
  }
}
