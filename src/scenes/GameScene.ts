import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';
import { logGPUStatus } from '../utils/gpuCheck';
import { FPSOverlay } from '../ui/FPSOverlay';
import { Eagle } from '../sprites/Eagle';
import { MissionManager } from '../managers/MissionManager';
import { MARKET_PHASES, MICRO_EVENTS, determinePhase, MarketPhase, MicroEvent } from '../config/MarketPhasesConfig';
import { WeaponManagerSimple } from '../managers/WeaponManagerSimple';
import { BossManagerV38 } from '../managers/BossManagerV38';
import { BandanaPowerUp } from '../managers/BandanaPowerUp';
import { getXPSystem, getXPForCoin } from '../systems/xpSystem';
import { getUpgradeSystem } from '../systems/upgradeSystem';
import { calculateHPMultiplier, calculateSpawnRateMultiplier, calculateEliteChance } from '../config/Difficulty';
import { TextPool } from '../utils/TextPool';
import { GraphicsPool } from '../utils/GraphicsPool';

export class GameScene extends Phaser.Scene {
  // XP & Upgrade Systems
  private xpSystem = getXPSystem();
  private upgradeSystem = getUpgradeSystem();
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
  private burgerCountText?: Phaser.GameObjects.Text; // Actually shows AOL combo (legacy name)
  private burgerCounterText?: Phaser.GameObjects.Text; // Shows burger count in top bar

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

  // === v3.5: MARKET PHASES SYSTEM ===
  private currentMarketPhase: string = 'BULL_RUN';
  private previousMarketPhase: string = 'BULL_RUN';
  private marketPhaseCheckInterval?: Phaser.Time.TimerEvent;
  private phaseTransitionInProgress: boolean = false;
  private activeAnnouncements: Phaser.GameObjects.Text[] = []; // v3.3: Track active announcements

  // === v3.5: SCALING SYSTEM ===
  private baseSpeed: number = 1.0;
  private speedScalingInterval?: Phaser.Time.TimerEvent;
  private difficultyScalingInterval?: Phaser.Time.TimerEvent;
  private speedMultiplier: number = 1.0;
  private enemySpawnRateMultiplier: number = 1.0;
  private coinSpawnRateMultiplier: number = 1.0;

  // === v3.5: MICRO-EVENTS SYSTEM ===
  private microEventCheckInterval?: Phaser.Time.TimerEvent;
  private activeMicroEvent?: MicroEvent;
  private microEventActive: boolean = false;
  private microEventEndTimer?: Phaser.Time.TimerEvent;
  private microEventNotification?: Phaser.GameObjects.Text;

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
  private burgerCombo: number = 0; // Track consecutive Burger pickups
  private burgerMultiplierActive: boolean = false;
  private eatTheDipActive: boolean = false; // v3.7: Burger combo power-up
  private magnetActive: boolean = false;
  private shieldActive: boolean = false;
  private freedomStrikeActive: boolean = false;
  private belleModActive: boolean = false;
  private controlBlocked: boolean = false;
  private bullMarketActive: boolean = false;
  private extraLives: number = 0;

  // === v3.2: LIFE SYSTEM ===
  private lives: number = 3; // Start with 3 hearts
  private maxLives: number = 3; // Maximum 3 hearts
  private invincible: boolean = false; // Invincibility frames after hit
  private invincibilityTimer?: Phaser.Time.TimerEvent;
  private heartSprites: Phaser.GameObjects.Image[] = [];

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
  private valorModeIcon?: Phaser.GameObjects.Text;
  private valorModeTimerText?: Phaser.GameObjects.Text;

  private magnetTimer?: Phaser.Time.TimerEvent;
  private shieldTimer?: Phaser.Time.TimerEvent;
  private burgerMultiplierTimer?: Phaser.Time.TimerEvent;
  private eatTheDipTimer?: Phaser.Time.TimerEvent; // v3.7: Eat the Dip timer
  private freedomStrikeTimer?: Phaser.Time.TimerEvent;
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
  private shieldIcon?: Phaser.GameObjects.Text | Phaser.GameObjects.Image;
  private shieldTimerText?: Phaser.GameObjects.Text;
  private belleIcon?: Phaser.GameObjects.Text;
  private belleTimerText?: Phaser.GameObjects.Text;
  private bullMarketIcon?: Phaser.GameObjects.Text;
  private bullMarketTimerText?: Phaser.GameObjects.Text;

  // Background image
  private backgroundImage?: Phaser.GameObjects.Image;

  // v3.2: Mission System
  private missionManager!: MissionManager;
  private missionUI: Phaser.GameObjects.Container[] = [];

  // v3.7: Weapon & Boss System
  private weaponManager!: WeaponManagerSimple;
  private bossManager!: BossManagerV38;
  private weaponUI?: Phaser.GameObjects.Container;
  private weaponEnergyBar?: Phaser.GameObjects.Graphics;
  private weaponEnergyBarBg?: Phaser.GameObjects.Graphics;
  private weaponPickup?: Phaser.GameObjects.Container;
  private tutorialOverlay?: Phaser.GameObjects.Container;

  // v3.8: Object Pools for performance (reuse instead of create/destroy)
  private textPool!: TextPool;
  private graphicsPool!: GraphicsPool;
  private weaponRespawnTimer?: Phaser.Time.TimerEvent;
  private bandanaPowerUp!: BandanaPowerUp;
  private bandanaMagnetActive: boolean = false;

  // v3.2: XP & Progression UI
  private levelText?: Phaser.GameObjects.Text;
  private xpBarBg?: Phaser.GameObjects.Graphics;
  private xpBarFill?: Phaser.GameObjects.Graphics;

  // v3.2: News Ticker
  private newsTickerText?: Phaser.GameObjects.Text; // Top ticker
  private newsTickerTextLeft?: Phaser.GameObjects.Text; // Left ticker
  private newsTickerTextRight?: Phaser.GameObjects.Text; // Right ticker
  private newsTickerTextBottom?: Phaser.GameObjects.Text; // Bottom ticker
  private newsTickerBg?: Phaser.GameObjects.Graphics;
  private newsMessages: string[] = [];
  private currentNewsIndex: number = 0;

  // v3.2: Glide Controls
  private spacePressed: boolean = false;
  private spaceStartTime: number = 0;
  private isGliding: boolean = false;
  private glideThreshold: number = 300; // ms
  private normalEagleX: number = 300; // Normal X position
  private glideEagleX: number = 800; // Forward X position during glide (300px more = 500+300)

  // Shield visual
  private shieldGraphics?: Phaser.GameObjects.Graphics;
  private shieldLoopSound?: Phaser.Sound.BaseSound;
  private shieldOwner: 'none' | 'powerup' | 'bandana' | 'valor' = 'none';

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

  // v3.8: Add FPS counter for performance monitoring
  private fpsOverlay?: FPSOverlay;

  init(): void {
    // Reset all game state variables when scene starts
    this.score = 0;
    this.gameTime = 0;
    this.isGameOver = false;
    this.isPaused = false;
    this.hasStarted = false;
    this.countdownStarted = false;

    // CRITICAL: Reset time.paused flag (prevents slowmo bug!)
    this.time.paused = false;

    // Phase system
    this.currentPhase = 1;
    this.phaseStartTime = 0;

    // Speeds
    this.coinSpeed = 300;
    this.enemySpeed = 250;
    this.originalCoinSpeed = 0; // Will be set after phase multiplier applies
    this.originalEnemySpeed = 0;

    // v3.7: Reset lives based on upgrades
    const playerStats = this.upgradeSystem.getPlayerStats();
    this.maxLives = 3 + playerStats.maxHeartsBonus;
    this.lives = this.maxLives;
    this.invincible = false;
    this.shieldOwner = 'none';

    // Power-ups
    this.aolCombo = 0;
    this.burgerCombo = 0; // v3.7: Reset burger combo
    this.burgerMultiplierActive = false;
    this.eatTheDipActive = false; // v3.7: Reset Eat the Dip
    this.magnetActive = false;
    this.shieldActive = false;
    this.freedomStrikeActive = false;
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

    // Stop any leftover menu music from UpgradeScene
    this.sound.stopByKey('menu-music');

    // CRITICAL: Ensure time and tweens are not paused (prevents slowmo bug!)
    this.time.paused = false;
    this.tweens.resumeAll();

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

    // v3.8: America.Fun Logo - bottom right (same as StartScene)
    const footerY = height - 30;
    const logo = this.add.image(0, footerY, 'america-logo');
    logo.setScale(0.36); // Same scale as StartScene
    logo.setAlpha(0.9);
    logo.setDepth(1000);
    // Position logo so its right edge is 30px from screen edge
    logo.setX(width - (logo.width * 0.36 / 2) - 30);

    // Create eagle - bigger and positioned on the left
    this.eagle = new Eagle(this, 300, height / 2);

    // v3.2: Initialize Mission System
    this.missionManager = MissionManager.getInstance();

    // v3.7: Refresh missions based on current Meta-Level
    // (important when returning from UpgradeScene after leveling up)
    this.missionManager.refreshMissions();

    // v3.7: Initialize Weapon & Boss Systems
    this.weaponManager = new WeaponManagerSimple(this);
    this.bossManager = new BossManagerV38(this);
    this.bandanaPowerUp = new BandanaPowerUp(this);

    // v3.8: Initialize Object Pools for performance
    this.textPool = new TextPool(this);
    this.graphicsPool = new GraphicsPool(this);
    console.log('✨ Object pools initialized for visual effects');

    // Auto-upgrade weapon based on player level
    this.checkWeaponAutoUpgrade();

    // Pause physics immediately - will resume after countdown
    this.physics.pause();

    // Launch or wake UIScene as overlay
    if (this.scene.isActive('UIScene')) {
      console.log('🔄 UIScene already running - waking it up');
      this.scene.wake('UIScene');
    } else {
      console.log('🚀 Launching UIScene for the first time');
      this.scene.launch('UIScene');
    }

    // Wait for UIScene to be ready, then send missions
    this.time.delayedCall(100, () => {
      const uiScene = this.scene.get('UIScene') as any;
      if (uiScene && uiScene.updateMissions) {
        console.log('🚀 GameScene: Sending initial missions to UIScene');
        uiScene.updateMissions(this.missionManager.getDailyMissions());
      }
    });

    // v3.2: NEWS TICKER - At very top (BREAKING)
    this.createNewsTicker();

    // ========== GAME HUD - TOP BAR (WHITE BACKGROUND - SAME HEIGHT AS BLUE BAR) ==========
    const hudY = 62; // Adjusted for thicker bar (55px height)

    // Background bar for HUD - WHITE, same height as blue bar (55px)
    const hudBg = this.add.graphics();
    hudBg.fillStyle(0xFFFFFF, 1); // White background
    hudBg.fillRoundedRect(35, 35, width - 70, 55, 10);
    hudBg.lineStyle(3, 0xCCCCCC, 1); // Light gray border
    hudBg.strokeRoundedRect(35, 35, width - 70, 55, 10);
    hudBg.setDepth(999);

    const hudStyle = {
      fontSize: '24px',
      color: '#D32F2F',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 0
    };

    // Timer - left side (proper spacing from edge)
    this.timerText = this.add.text(65, hudY, 'TIME: 0s', hudStyle);
    this.timerText.setOrigin(0, 0.5);
    this.timerText.setDepth(1000);

    // Phase - left-center
    this.phaseText = this.add.text(width * 0.25, hudY, 'PHASE: 1', hudStyle);
    this.phaseText.setOrigin(0.5, 0.5);
    this.phaseText.setDepth(1000);

    // Score - center
    this.scoreText = this.add.text(width * 0.45, hudY, 'SCORE: 0', hudStyle);
    this.scoreText.setOrigin(0.5, 0.5);
    this.scoreText.setDepth(1000);

    // v3.8: FPS Overlay (disabled - performance fixed! 60 FPS achieved!)
    // Uncomment for debugging if needed:
    // this.fpsOverlay = new FPSOverlay(this);
    // this.fpsOverlay.setPosition(width - 110, 10);
    // this.fpsOverlay.setOrigin(0, 0);

    // v3.2: Hearts inline in top bar
    this.createHeartDisplay();

    // v3.2: AOL Logo counter (AOL combo) - moved inside bar
    const aolLogo = this.add.image(width - 280, hudY, 'coin-aol');
    aolLogo.setScale(0.08); // Small size for top bar
    aolLogo.setOrigin(0.5, 0.5);
    aolLogo.setDepth(1000);

    // AOL Combo counter (shows combo progress: 0/3, 1/3, 2/3, 3/3)
    const aolComboText = this.add.text(width - 250, hudY, '0/3', hudStyle);
    aolComboText.setOrigin(0, 0.5);
    aolComboText.setDepth(1000);
    this.burgerCountText = aolComboText; // Store reference (legacy property name)

    // v3.7: Burger counter - moved inside bar (shows combo progress: 0/5, 1/5, etc.)
    this.burgerCounterText = this.add.text(width - 160, hudY, '🍔 0/5', hudStyle);
    this.burgerCounterText.setOrigin(0, 0.5);
    this.burgerCounterText.setDepth(1000);

    // v3.2: XP & LEVEL - Now handled by UIScene
    // v3.7: XP display is now handled by UIScene listening to xpSystem
    // No need to manually update here - UIScene subscribes to xpSystem changes

    // v3.2: MISSION SYSTEM - Now handled by UIScene
    // Missions are sent to UIScene after launch (see delayedCall above)

    // v3.7: Weapon UI will be created when weapon is collected
    // (Don't create it at start)

    // ========== COIN COUNTERS - SECOND ROW (BLUE BAR) - 20px thicker ==========
    const coinCounterY = 115; // Adjusted for thicker bar
    const coinStyle = {
      fontSize: '22px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    };

    // Background for coin counters - Deep blue, 20px thicker (55px instead of 35px)
    const coinBg = this.add.graphics();
    coinBg.fillStyle(0x1A3A8A, 0.95); // Deep blue
    coinBg.fillRoundedRect(35, 90, width - 70, 55, 8);
    coinBg.setDepth(998);

    // Calculate spacing for 5 coins
    const coinStartX = 80;
    const coinSpacing = (width - 160) / 5;

    // BONK Count
    this.bonkCountText = this.add.text(coinStartX, coinCounterY, '🐕 $BONK: 0', coinStyle);
    this.bonkCountText.setOrigin(0, 0.5);
    this.bonkCountText.setDepth(1000);

    // AOL Count
    this.aolCountText = this.add.text(coinStartX + coinSpacing, coinCounterY, '🦅 $AOL: 0', coinStyle);
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

    // ========== POWER-UP PANEL - Larger with transparent backgrounds ==========
    const powerupIconY = height - 65; // More space from bottom

    // Magnet/Buyback Mode - LARGER with background (200px wide for long text)
    const magnetBg = this.add.graphics();
    magnetBg.fillStyle(0x002868, 0.8); // Navy blue transparent
    magnetBg.fillRoundedRect(width / 2 - 380, powerupIconY - 35, 200, 70, 8);
    magnetBg.lineStyle(2, 0xFFD700, 1); // Gold border
    magnetBg.strokeRoundedRect(width / 2 - 380, powerupIconY - 35, 200, 70, 8);
    magnetBg.setVisible(false);
    magnetBg.setDepth(999);
    (this as any).magnetBg = magnetBg;

    this.magnetIcon = this.add.text(width / 2 - 340, powerupIconY, '🧲', {
      fontSize: '48px'
    }).setOrigin(0.5);
    this.magnetIcon.setVisible(false);
    this.magnetIcon.setDepth(1000);

    this.magnetTimerText = this.add.text(width / 2 - 280, powerupIconY, 'BUYBACK\n10s', {
      fontSize: '17px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'left',
      lineSpacing: 2
    }).setOrigin(0, 0.5);
    this.magnetTimerText.setVisible(false);
    this.magnetTimerText.setDepth(1000);

    // Shield/America Hat - LARGER with background
    const shieldBg = this.add.graphics();
    shieldBg.fillStyle(0x002868, 0.8);
    shieldBg.fillRoundedRect(width / 2 - 170, powerupIconY - 35, 160, 70, 8);
    shieldBg.lineStyle(2, 0xFFD700, 1);
    shieldBg.strokeRoundedRect(width / 2 - 170, powerupIconY - 35, 160, 70, 8);
    shieldBg.setVisible(false);
    shieldBg.setDepth(999);
    (this as any).shieldBg = shieldBg;

    // v3.8: Use text instead of image for shield icon (emoji rendering)
    const shieldIcon = this.add.text(width / 2 - 135, powerupIconY, 'SHIELD', {
      fontSize: '32px',
      color: '#4169E1',
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    shieldIcon.setOrigin(0.5);
    shieldIcon.setVisible(false);
    shieldIcon.setDepth(1000);
    this.shieldIcon = shieldIcon;

    this.shieldTimerText = this.add.text(width / 2 - 80, powerupIconY, 'SHIELD\n8s', {
      fontSize: '17px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'left',
      lineSpacing: 2
    }).setOrigin(0, 0.5);
    this.shieldTimerText.setVisible(false);
    this.shieldTimerText.setDepth(1000);

    // Belle MOD - LARGER with background
    const belleBg = this.add.graphics();
    belleBg.fillStyle(0x002868, 0.8);
    belleBg.fillRoundedRect(width / 2 + 10, powerupIconY - 35, 160, 70, 8);
    belleBg.lineStyle(2, 0xFFD700, 1);
    belleBg.strokeRoundedRect(width / 2 + 10, powerupIconY - 35, 160, 70, 8);
    belleBg.setVisible(false);
    belleBg.setDepth(999);
    (this as any).belleBg = belleBg;

    this.belleIcon = this.add.text(width / 2 + 45, powerupIconY, '👁️', {
      fontSize: '48px'
    }).setOrigin(0.5);
    this.belleIcon.setVisible(false);
    this.belleIcon.setDepth(1000);

    this.belleTimerText = this.add.text(width / 2 + 100, powerupIconY, 'BELLE\n15s', {
      fontSize: '17px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'left',
      lineSpacing: 2
    }).setOrigin(0, 0.5);
    this.belleTimerText.setVisible(false);
    this.belleTimerText.setDepth(1000);

    // Bull Market Mode - LARGER with background
    const bullBg = this.add.graphics();
    bullBg.fillStyle(0x002868, 0.8);
    bullBg.fillRoundedRect(width / 2 + 190, powerupIconY - 35, 160, 70, 8);
    bullBg.lineStyle(2, 0xFFD700, 1);
    bullBg.strokeRoundedRect(width / 2 + 190, powerupIconY - 35, 160, 70, 8);
    bullBg.setVisible(false);
    bullBg.setDepth(999);
    (this as any).bullBg = bullBg;

    this.bullMarketIcon = this.add.text(width / 2 + 225, powerupIconY, '🐂', {
      fontSize: '48px'
    }).setOrigin(0.5);
    this.bullMarketIcon.setVisible(false);
    this.bullMarketIcon.setDepth(1000);

    this.bullMarketTimerText = this.add.text(width / 2 + 280, powerupIconY, 'BULL\n10s', {
      fontSize: '17px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'left',
      lineSpacing: 2
    }).setOrigin(0, 0.5);
    this.bullMarketTimerText.setVisible(false);
    this.bullMarketTimerText.setDepth(1000);

    // VALOR Mode - LARGER with background (far right) - 200px wide
    const valorBg = this.add.graphics();
    valorBg.fillStyle(0x002868, 0.8);
    valorBg.fillRoundedRect(width / 2 + 370, powerupIconY - 35, 200, 70, 8);
    valorBg.lineStyle(2, 0xFFD700, 1);
    valorBg.strokeRoundedRect(width / 2 + 370, powerupIconY - 35, 200, 70, 8);
    valorBg.setVisible(false);
    valorBg.setDepth(999);
    (this as any).valorBg = valorBg;

    this.valorModeIcon = this.add.text(width / 2 + 410, powerupIconY, '⚡', {
      fontSize: '48px'
    }).setOrigin(0.5);
    this.valorModeIcon.setVisible(false);
    this.valorModeIcon.setDepth(1000);

    this.valorModeTimerText = this.add.text(width / 2 + 450, powerupIconY, 'VALOR\n15s', {
      fontSize: '17px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'left',
      lineSpacing: 2
    }).setOrigin(0, 0.5);
    this.valorModeTimerText.setVisible(false);
    this.valorModeTimerText.setDepth(1000);

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
        const playerStats = this.upgradeSystem.getPlayerStats();
        this.eagle.flap(playerStats.flapBoost);
      }
    });

    // v3.2: SPACE key down - start tracking hold time
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
        if (!this.spacePressed) {
          // First press - immediate flap
          const playerStats = this.upgradeSystem.getPlayerStats();
          this.eagle.flap(playerStats.flapBoost);
          this.spacePressed = true;
          // v3.8 PERFORMANCE: Use game time instead of Date.now()
          this.spaceStartTime = this.time.now;
        }
      }
    });

    // v3.2: SPACE key up - check if glide should activate
    this.input.keyboard?.on('keyup-SPACE', () => {
      if (this.spacePressed) {
        console.log('SPACE RELEASED - isGliding:', this.isGliding);
        this.spacePressed = false;
        // DON'T set isGliding to false here - let update() handle the fly-back logic
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

    // v3.7: Weapon Controls - Q/W/E keys
    // Q - Fire straight
    this.input.keyboard?.on('keydown-Q', () => {
      if (!this.hasStarted || this.isPaused || this.controlBlocked || !this.eagle) return;
      if (!this.weaponManager.hasWeapon()) return;

      const eagleX = this.eagle.x || 300;
      const eagleY = this.eagle.y || this.cameras.main.height / 2;

      this.weaponManager.fire(eagleX, eagleY, 0); // Straight ahead
    });

    // W - Fire upward angle
    this.input.keyboard?.on('keydown-W', () => {
      if (!this.hasStarted || this.isPaused || this.controlBlocked || !this.eagle) return;
      if (!this.weaponManager.hasWeapon()) return;

      const eagleX = this.eagle.x || 300;
      const eagleY = this.eagle.y || this.cameras.main.height / 2;

      this.weaponManager.fire(eagleX, eagleY, -15); // 15 degrees up
    });

    // E - Fire downward angle
    this.input.keyboard?.on('keydown-E', () => {
      if (!this.hasStarted || this.isPaused || this.controlBlocked || !this.eagle) return;
      if (!this.weaponManager.hasWeapon()) return;

      const eagleX = this.eagle.x || 300;
      const eagleY = this.eagle.y || this.cameras.main.height / 2;

      this.weaponManager.fire(eagleX, eagleY, 15); // 15 degrees down
    });

    // Prevent TAB from causing issues (browser focus change)
    this.input.keyboard?.on('keydown-TAB', (event: KeyboardEvent) => {
      event.preventDefault(); // Prevent browser tab switching/focus
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

    // v3.8: Listen for boss defeated event
    this.events.on('bossDefeated', (bossDef: any) => {
      console.log(`Boss defeated event received: ${bossDef.name}`);

      // Award XP
      this.xpSystem.addXP({
        delta: bossDef.rewards.xp,
        source: 'bossKill',
        meta: { bossId: bossDef.id }
      });

      // Award bonus score
      const bonusScore = 1000;
      this.score += bonusScore;
      this.scoreText.setText(`SCORE: ${this.score}`);

      // Add extra life if player has less than max
      if (this.lives < this.maxLives) {
        this.lives++;
        this.updateHeartDisplay();
        console.log('Boss reward: +1 Life!');
      }

      // Play victory music
      if (this.sound.get('bosswin')) {
        this.sound.play('bosswin', { volume: 0.8 });
      }
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
            // v3.8: sound.play returns BaseSound | boolean, assign properly
            const music = this.sound.play('background-music-2', {
              volume: 0.5,
              loop: true
            });
            if (music && typeof music !== 'boolean') {
              this.currentBackgroundMusic = music;
            }
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
    // v3.8 FIX: Use scene.time.now for game time sync!
    this.gameStartTime = this.time.now;
    this.phaseStartTime = this.time.now;
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

    // CRITICAL FIX: DON'T override speeds here!
    // Speeds are already set correctly by phase progression (Phase 1: 300 × 1.3 = 390)
    // Only ensure originalSpeeds are set for Valor Mode restoration
    if (this.originalCoinSpeed === 0) {
      this.originalCoinSpeed = this.coinSpeed;
      this.originalEnemySpeed = this.enemySpeed;
      console.log(`✅ Original speeds saved: coinSpeed=${this.originalCoinSpeed}, enemySpeed=${this.originalEnemySpeed}`);
    }

    // Start game timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameTime++;
        this.timerText.setText(`TIME: ${this.gameTime}s`);
        this.checkPhaseProgression();
        this.checkMarketPhaseTransition(); // v3.3: Check market phase
      },
      callbackScope: this,
      loop: true
    });

    // v3.3: Initialize Market Phase System
    this.currentMarketPhase = 'BULL_RUN';
    this.applyMarketPhaseEffects();
    this.updateTickerForPhase();

    // v3.4: Initialize Speed & Difficulty Scaling System
    this.speedMultiplier = 1.0;
    this.enemySpawnRateMultiplier = 1.0;
    this.coinSpawnRateMultiplier = 1.0;

    // v3.7: Start Bandana Power-Up spawn timer
    this.bandanaPowerUp.startSpawnTimer();

    // v3.4: Speed Scaling Timer (+3% every 20 seconds, max 2.5x)
    this.speedScalingInterval = this.time.addEvent({
      delay: 20000, // 20 seconds
      callback: this.applySpeedScaling,
      callbackScope: this,
      loop: true
    });

    // v3.4: Difficulty Scaling Timer (+4% enemy spawn every 15 seconds)
    this.difficultyScalingInterval = this.time.addEvent({
      delay: 15000, // 15 seconds
      callback: this.applyDifficultyScaling,
      callbackScope: this,
      loop: true
    });

    // v3.5: Micro-Events System (check every 30 seconds for random events)
    this.microEventCheckInterval = this.time.addEvent({
      delay: 30000, // Check every 30 seconds
      callback: this.checkMicroEvents,
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

    // v3.8: Difficulty Scaling - Spawn rate increases every 60 seconds
    this.time.addEvent({
      delay: 60000, // Every 60 seconds
      callback: () => {
        if (this.enemySpawnTimer && !this.isGameOver) {
          const spawnRateMultiplier = calculateSpawnRateMultiplier(this.gameTime);
          const currentPhase = GameConfig.phases[this.currentPhase - 1];
          const newDelay = currentPhase.spawnRate * spawnRateMultiplier;

          console.log(`⚡ Difficulty scaling: Spawn rate ${(spawnRateMultiplier * 100).toFixed(0)}% (${newDelay.toFixed(0)}ms delay)`);

          // Restart timer with new delay
          this.enemySpawnTimer.remove();
          this.enemySpawnTimer = this.time.addEvent({
            delay: newDelay,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
          });
        }
      },
      callbackScope: this,
      loop: true
    });

    // v3.8: Spawn power-ups occasionally (reduced frequency for balance)
    this.powerupSpawnTimer = this.time.addEvent({
      delay: 25000, // Every 25 seconds (was 15s - too easy!)
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

    // Chrome FPS fix: Visibility API to prevent throttling when tab is inactive
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // v3.8 FIX: wake() sets sleep to false internally
        this.game.loop.wake();
        console.log('Tab visible - Game loop resumed');
      } else {
        // v3.8 FIX: sleep() sets sleep to true internally
        this.game.loop.sleep();
        console.log('Tab hidden - Game loop sleeping');
      }
    });

    // Log GPU status for debugging
    this.time.delayedCall(1000, () => logGPUStatus());
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
      if (this.freedomStrikeTimer) this.freedomStrikeTimer.paused = true;
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
      if (this.freedomStrikeTimer) this.freedomStrikeTimer.paused = false;
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
    // v3.8 FIX: Use scene.time.now for game time sync!
    this.phaseStartTime = this.time.now;

    // v3.2: Track phase change for missions
    this.missionManager.onPhaseChange();
    this.updateMissionUI();

    // Phase change sound will be played in showPhaseAnnouncement
    // (removed duplicate sound play here)

    // Update HUD
    this.phaseText.setText(`PHASE: ${phaseId}`);

    // Update speeds
    const baseSpeed = 300;
    this.coinSpeed = baseSpeed * phase.speedMultiplier;
    this.enemySpeed = (baseSpeed * 0.8) * phase.speedMultiplier;

    // Update enemy spawn rate (v3.8 FIX: delay is readonly, recreate timer)
    if (this.enemySpawnTimer) {
      this.enemySpawnTimer.remove();
      this.enemySpawnTimer = this.time.addEvent({
        delay: phase.spawnRate,
        callback: () => this.spawnEnemy(),
        loop: true
      });
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

    // v3.8 FIX: Use scene.time.now for game time sync!
    const phaseElapsed = Math.floor((this.time.now - this.phaseStartTime) / 1000);

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
    // v3.9.2 PERFORMANCE: Limit max enemies to prevent slowdown
    const MAX_ENEMIES = 50; // Maximum enemies on screen at once
    if (this.enemies.length >= MAX_ENEMIES) {
      console.warn(`⚠️ Max enemies reached (${MAX_ENEMIES}), skipping spawn`);
      return;
    }

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Get current phase
    const phase = GameConfig.phases[this.currentPhase - 1];

    // v3.8: Difficulty Scaling - Elite enemy chance increases over time
    const eliteChance = calculateEliteChance(this.gameTime, 0.05); // Start at 5%, increases +4% per minute
    const isEliteSpawn = Math.random() < eliteChance;

    // === v3.5: DYNAMIC SPAWN PATTERNS ===
    // Reduced spawn chances - quality over quantity
    const spawnPattern = Phaser.Math.Between(1, 100);

    if (spawnPattern <= 4 && this.gameTime > 60) {
      // V-Formation (3 enemies) - only after 60s, very rare
      this.spawnFormation('v-formation');
      return;
    } else if (spawnPattern <= 6 && this.gameTime > 90) {
      // Line formation (2 enemies) - only after 90s, extremely rare
      this.spawnFormation('line');
      return;
    }
    // Wave formation removed - too chaotic

    // Choose random enemy from current phase's enemy list
    const enemyTypes = phase.enemies;

    // v3.8: If elite spawn, prefer stronger enemies (last 30% of enemy list)
    let randomEnemyType: string;
    if (isEliteSpawn && enemyTypes.length > 3) {
      const eliteStartIndex = Math.floor(enemyTypes.length * 0.7); // Last 30% are elite
      const eliteTypes = enemyTypes.slice(eliteStartIndex);
      // v3.8 BUG FIX: Check if eliteTypes is empty before accessing!
      if (eliteTypes.length > 0) {
        randomEnemyType = eliteTypes[Phaser.Math.Between(0, eliteTypes.length - 1)];
        console.log(`💀 Elite spawn! (${(eliteChance * 100).toFixed(1)}% chance) - Spawning: ${randomEnemyType}`);
      } else {
        // Fallback to regular spawn if no elite types available
        randomEnemyType = enemyTypes[Phaser.Math.Between(0, enemyTypes.length - 1)];
      }
    } else {
      randomEnemyType = enemyTypes[Phaser.Math.Between(0, enemyTypes.length - 1)];
    }

    // Get enemy config
    const enemyConfig = (GameConfig.enemies as any)[randomEnemyType];
    if (!enemyConfig) return;

    // === v3.5: DYNAMIC MOVEMENT PATTERNS ===
    // Reduced movement pattern chances - most enemies still move straight
    let movementPattern = 'straight';

    if (this.gameTime > 45) {
      const patternRoll = Phaser.Math.Between(1, 100);
      if (patternRoll <= 15) {
        movementPattern = 'sine_wave'; // Gentle wave
      } else if (patternRoll <= 25) {
        movementPattern = 'tracking'; // Follow eagle (more predictable)
      } else if (patternRoll <= 30 && randomEnemyType !== 'bearBoss') {
        movementPattern = 'dash'; // Rare dash
      }
      // Zigzag removed - too unpredictable
    }

    // Random Y position (avoid edges)
    const y = Phaser.Math.Between(180, height - 180);

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
    enemy.setData('movementPattern', movementPattern);
    enemy.setData('startY', y); // Store initial Y for wave patterns
    enemy.setData('waveOffset', Math.random() * Math.PI * 2); // Random wave offset
    enemy.setData('zigzagDirection', 1); // 1 = down, -1 = up
    enemy.setData('dashCooldown', 0);

    // v3.8: HP system removed for performance (caused 15-27 FPS)
    // Back to one-shot kills

    // Special behavior for Paper Hands Pete - drops ONE fake coin less frequently
    if (randomEnemyType === 'paperHands') {
      const dropInterval = Phaser.Math.Between(4000, 6000); // Doubled delay
      this.time.delayedCall(dropInterval, () => {
        if (enemy.active) {
          this.spawnFakeCoin(enemy.x, enemy.y);
          // Only ONE fake coin per paperHands (removed second drop)
        }
      });
    }

    // Special behavior for Gary - throws lawsuit papers continuously
    if (randomEnemyType === 'gary') {
      const throwPaper = () => {
        if (enemy.active) {
          this.spawnLawsuitPaper(enemy.x, enemy.y);
          this.time.delayedCall(Phaser.Math.Between(1500, 2500), throwPaper);
        }
      };
      this.time.delayedCall(1000, throwPaper);
    }

    // Special behavior for bearBoss - chaos mode
    if (randomEnemyType === 'bearBoss') {
      enemy.setData('movementPattern', 'boss_chaos');
      enemy.setData('chaosTimer', 0);
    }

    this.enemies.push(enemy);
  }

  // v3.5: Spawn enemy formations
  private spawnFormation(formationType: string): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const phase = GameConfig.phases[this.currentPhase - 1];
    const enemyTypes = phase.enemies.filter(e => e !== 'bearBoss'); // No bosses in formations

    switch (formationType) {
      case 'v-formation':
        // 3 enemies in V shape
        const vType = enemyTypes[Phaser.Math.Between(0, enemyTypes.length - 1)];
        const centerY = Phaser.Math.Between(300, height - 300);
        const spacing = 120;

        this.createSingleEnemy(vType, width + 100, centerY, 'straight');
        this.createSingleEnemy(vType, width + 200, centerY - spacing, 'straight');
        this.createSingleEnemy(vType, width + 200, centerY + spacing, 'straight');
        break;

      case 'line':
        // 2 enemies in horizontal line - simple and predictable
        const lineType = enemyTypes[Phaser.Math.Between(0, enemyTypes.length - 1)];
        const lineY = Phaser.Math.Between(300, height - 300);
        const lineSpacing = 180; // Increased spacing

        // Always spawn exactly 2 enemies
        this.createSingleEnemy(lineType, width + 100, lineY, 'straight');
        this.createSingleEnemy(lineType, width + 100 + lineSpacing, lineY, 'straight');
        break;

      case 'wave':
        // 4 enemies in wave pattern
        const waveType = enemyTypes[Phaser.Math.Between(0, enemyTypes.length - 1)];
        const waveStartY = Phaser.Math.Between(300, height - 400);

        for (let i = 0; i < 4; i++) {
          const offset = Math.sin(i * 0.8) * 80;
          this.createSingleEnemy(waveType, width + 100 + (i * 120), waveStartY + offset, 'sine_wave');
        }
        break;
    }
  }

  // Helper function to create a single enemy with specific pattern
  private createSingleEnemy(enemyType: string, x: number, y: number, pattern: string): void {
    const enemyConfig = (GameConfig.enemies as any)[enemyType];
    if (!enemyConfig) return;

    const enemy = this.add.container(x, y);
    const enemyImage = this.add.image(0, 0, enemyConfig.sprite);
    enemyImage.setScale(enemyConfig.scale);
    enemyImage.setFlipX(true);

    enemy.add(enemyImage);
    enemy.setSize(enemyConfig.size.width, enemyConfig.size.height);
    enemy.setData('type', enemyType);
    enemy.setData('config', enemyConfig);
    enemy.setData('movementPattern', pattern);
    enemy.setData('startY', y);
    enemy.setData('waveOffset', Math.random() * Math.PI * 2);
    enemy.setData('zigzagDirection', 1);

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

  /**
   * v3.8: Spawn specific enemy type (used by Boss add waves)
   */
  public spawnSpecificEnemy(enemyType: string): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Get enemy config
    const enemyConfig = (GameConfig.enemies as any)[enemyType];
    if (!enemyConfig) {
      console.warn(`Unknown enemy type: ${enemyType}`);
      return;
    }

    // Random Y position (avoid edges)
    const y = Phaser.Math.Between(180, height - 180);

    // Create enemy container
    const enemy = this.add.container(width + 100, y);

    // Create enemy sprite
    const enemyImage = this.add.image(0, 0, enemyConfig.sprite);
    enemyImage.setScale(enemyConfig.scale);
    enemyImage.setFlipX(true); // Face left

    enemy.add(enemyImage);
    enemy.setSize(enemyConfig.size.width, enemyConfig.size.height);
    enemy.setData('type', enemyType);
    enemy.setData('config', enemyConfig);
    enemy.setData('movementPattern', 'straight'); // Boss adds move straight
    enemy.setData('startY', y);

    // Special behavior for Gary - throws lawsuit papers
    if (enemyType === 'gary') {
      const throwPaper = () => {
        if (enemy.active) {
          this.spawnLawsuitPaper(enemy.x, enemy.y);
          this.time.delayedCall(GameConfig.enemies.gary.throwInterval, throwPaper);
        }
      };
      this.time.delayedCall(GameConfig.enemies.gary.throwInterval, throwPaper);
    }

    // Special behavior for exploder
    if (enemyConfig.aiType === 'exploder') {
      enemy.setData('shouldExplode', true);
    }

    // Special behavior for sniper
    if (enemyConfig.aiType === 'sniper') {
      enemy.setData('fireTimer', enemyConfig.fireRate || 3000);
    }

    this.enemies.push(enemy);
    console.log(`🐻 Boss spawned add: ${enemyType}`);
  }

  /**
   * v3.8: Spawn enemy projectile (for sniper AI)
   * Fires from enemy position towards target
   */
  private spawnEnemyProjectile(fromX: number, fromY: number, targetX: number, targetY: number, type: string): void {
    const projectile = this.add.container(fromX, fromY);

    // Create projectile visual based on type
    if (type === 'laser') {
      // Red laser beam
      const laserGraphics = this.add.graphics();
      laserGraphics.fillStyle(0xFF0000, 1);
      laserGraphics.fillRect(-15, -3, 30, 6);
      laserGraphics.lineStyle(2, 0xFF6666, 1);
      laserGraphics.strokeRect(-15, -3, 30, 6);
      projectile.add(laserGraphics);
      projectile.setSize(30, 6);
    } else {
      // Default projectile
      const graphics = this.add.graphics();
      graphics.fillStyle(0xFF4444, 1);
      graphics.fillCircle(0, 0, 8);
      projectile.add(graphics);
      projectile.setSize(16, 16);
    }

    projectile.setData('type', 'enemyProjectile');
    projectile.setData('damage', 1);

    // Calculate angle towards target
    const angle = Phaser.Math.Angle.Between(fromX, fromY, targetX, targetY);
    projectile.setRotation(angle);

    // Move towards target
    const speed = 400; // pixels per second
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;

    this.tweens.add({
      targets: projectile,
      x: projectile.x + velocityX * 3, // Travel for 3 seconds max
      y: projectile.y + velocityY * 3,
      duration: 3000,
      onComplete: () => {
        projectile.destroy();
        const index = this.lawsuitPapers.indexOf(projectile);
        if (index > -1) this.lawsuitPapers.splice(index, 1);
      }
    });

    // Add to lawsuit papers array for collision detection (reuse existing system)
    this.lawsuitPapers.push(projectile);
  }

  /**
   * v3.8: Spawn explosion splinters (for exploder AI)
   * Creates 6 projectiles in all directions
   */
  private spawnExplosionSplinters(x: number, y: number, count: number = 6): void {
    const angleStep = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      const angle = angleStep * i;
      const splinter = this.add.container(x, y);

      // Orange/red splinter visual
      const graphics = this.add.graphics();
      graphics.fillStyle(0xFF8800, 1);
      graphics.fillCircle(0, 0, 6);
      graphics.lineStyle(2, 0xFFAA00, 1);
      graphics.strokeCircle(0, 0, 6);
      splinter.add(graphics);
      splinter.setSize(12, 12);

      splinter.setData('type', 'enemyProjectile');
      splinter.setData('damage', 1);
      splinter.setRotation(angle);

      // Fly outward in all directions
      const speed = 300;
      const distance = 400;
      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;

      this.tweens.add({
        targets: splinter,
        x: targetX,
        y: targetY,
        duration: 1500,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          splinter.destroy();
          const index = this.lawsuitPapers.indexOf(splinter);
          if (index > -1) this.lawsuitPapers.splice(index, 1);
        }
      });

      // Add to lawsuit papers array for collision detection
      this.lawsuitPapers.push(splinter);
    }

    // Visual explosion effect
    const explosionCircle = this.add.graphics();
    explosionCircle.lineStyle(4, 0xFF6600, 1);
    explosionCircle.strokeCircle(x, y, 20);
    explosionCircle.setDepth(999);

    this.tweens.add({
      targets: explosionCircle,
      alpha: 0,
      duration: 400,
      onUpdate: (tween) => {
        const progress = tween.progress;
        explosionCircle.clear();
        explosionCircle.lineStyle(4, 0xFF6600, 1 - progress);
        explosionCircle.strokeCircle(x, y, 20 + progress * 80);
      },
      onComplete: () => explosionCircle.destroy()
    });

    // Play explosion sound
    this.sound.play('explosion', { volume: 0.6 });
  }

  /**
   * v3.9: Spawn mini enemies when Splitter dies
   * Creates smaller, faster enemies that scatter outward
   */
  private spawnSplitterEnemies(x: number, y: number, count: number, hp: number, parentConfig: any): void {
    // Spawn mini enemies in random directions
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5; // Slight randomness
      const distance = 80 + Math.random() * 40; // Spawn offset

      const miniX = x + Math.cos(angle) * distance;
      const miniY = y + Math.sin(angle) * distance;

      // Create mini enemy (smaller version of parent)
      const miniEnemy = this.add.container(miniX, miniY);

      // Mini enemy visual (smaller emoji, 0.7x scale)
      const miniSprite = this.add.text(0, 0, '🔄', {
        fontSize: Math.floor(parentConfig.scale * 40 * 0.7) + 'px'
      });
      miniSprite.setOrigin(0.5);
      miniEnemy.add(miniSprite);

      // Set smaller size
      const miniSize = {
        width: parentConfig.size.width * 0.6,
        height: parentConfig.size.height * 0.6
      };
      miniEnemy.setSize(miniSize.width, miniSize.height);

      // Store data
      miniEnemy.setData('type', 'splitter-mini');
      miniEnemy.setData('hp', hp); // Lower HP
      miniEnemy.setData('maxHp', hp);
      miniEnemy.setData('config', {
        ...parentConfig,
        size: miniSize,
        speed: parentConfig.speed * 1.3, // Faster!
        scale: parentConfig.scale * 0.7,
        meme: '💨 Mini split!'
      });
      miniEnemy.setData('movementPattern', 'straight');

      // Add to enemies array
      this.enemies.push(miniEnemy);

      // Spawn animation - pop out effect
      miniEnemy.setScale(0);
      this.tweens.add({
        targets: miniEnemy,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Back.easeOut'
      });
    }

    // Split visual effect
    this.graphicsPool.createExplosion(this, x, y, {
      count: count * 2,
      color: 0x00FFFF,
      speed: { min: 100, max: 200 },
      lifespan: 400,
      scale: 0.5
    });

    // Sound effect
    this.sound.play('power-up', { volume: 0.4, rate: 1.3 });
  }

  private spawnPowerup(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const y = Phaser.Math.Between(150, height - 150);

    // v3.8: Check if we should spawn Vesper (every 2500 points - was 500, too easy!)
    if (this.score > 0 && this.score % 2500 === 0 && !this.bullMarketActive) {
      this.spawnVesper();
      return;
    }

    // Randomly choose powerup type (excluding buyback which is triggered by AOL combo)
    // v3.8: 2% chance for Vesper0x (rare - was 5%, reduced for balance)
    let randomType: string;
    const vesperRoll = Phaser.Math.Between(1, 100);
    if (vesperRoll <= 2) {
      randomType = 'vesper0x';
    } else {
      const powerupTypes = ['shield', 'freedomStrike', 'belleMod'];
      randomType = powerupTypes[Phaser.Math.Between(0, powerupTypes.length - 1)];
    }

    const powerup = this.add.container(width + 100, y);

    let icon: string | Phaser.GameObjects.Image;
    let glowColor: number;

    switch (randomType) {
      case 'shield':
        icon = this.add.image(0, 0, 'america-hat');
        icon.setScale(0.15);
        glowColor = 0xFF0000; // Red glow for America
        break;
      case 'freedomStrike':
        icon = '⚡';
        glowColor = 0xFFFF00; // Yellow glow for lightning
        break;
      case 'belleMod':
        icon = this.add.image(0, 0, 'mod-belle');
        icon.setScale(0.1); // Smaller icon
        glowColor = 0xFFD700; // Gold glow for MOD
        break;
      case 'vesper0x':
        icon = this.add.image(0, 0, 'vesper');
        icon.setScale(0.15); // Same size as hat and bandana
        glowColor = 0xFF69B4; // Pink glow for Vesper0x
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
    (this as any).magnetBg?.setVisible(true);

    // Play buyback voice sound
    this.sound.play('buyback-voice', { volume: 0.7 });

    // Visual feedback - centered
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const text = this.add.text(width / 2, height / 2 - 50, '🧲 BUYBACK ACTIVATED!\nCoins fly to you like liquidity 💸', {
      fontSize: '56px',
      color: '#FBB13C',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 6
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
      (this as any).magnetBg?.setVisible(false);
    });
  }

  private activateShield(): void {
    // Only allow America Hat to override if no other system owns the shield
    if (this.shieldActive && this.shieldOwner !== 'none' && this.shieldOwner !== 'powerup') {
      console.log('Shield already owned by:', this.shieldOwner, '- America Hat blocked');
      return;
    }

    // Cancel old shield timer if re-activating America Hat shield
    if (this.shieldTimer) {
      this.shieldTimer.remove();
      this.shieldTimer = undefined;
    }

    this.shieldActive = true;
    this.shieldOwner = 'powerup';
    this.shieldIcon?.setVisible(true);
    this.shieldTimerText?.setVisible(true);
    (this as any).shieldBg?.setVisible(true);

    console.log('America Hat shield activated - Owner: powerup');

    // Play shield activation sound
    this.sound.play('shield-activate', { volume: 0.5 });

    // Start shield active loop sound
    if (this.cache.audio.exists('shield-active-loop')) {
      if (this.shieldLoopSound) {
        this.shieldLoopSound.stop();
      }
      this.shieldLoopSound = this.sound.add('shield-active-loop', {
        volume: 0.3,
        loop: true
      });
      this.shieldLoopSound.play();
    }

    // Visual feedback
    const text = this.add.text(this.cameras.main.width / 2, 230, '🇺🇸 AMERICA HAT PROTECTION ACTIVATED!', {
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
      y: 180,
      duration: 1500,
      onComplete: () => text.destroy()
    });

    // Create beautiful shield graphics that follows eagle
    if (this.shieldGraphics) {
      this.shieldGraphics.destroy();
    }
    this.shieldGraphics = this.add.graphics();
    this.shieldGraphics.setDepth(999); // Higher depth to ensure visibility

    // v3.8 PERFORMANCE: Draw shield ONCE here, not every frame
    // Outer glow
    this.shieldGraphics.fillStyle(0x00AAFF, 0.2);
    this.shieldGraphics.fillCircle(0, 0, 100);

    // Middle ring
    this.shieldGraphics.lineStyle(6, 0x00DDFF, 0.8);
    this.shieldGraphics.strokeCircle(0, 0, 85);

    // Inner ring
    this.shieldGraphics.lineStyle(4, 0x88EEFF, 1);
    this.shieldGraphics.strokeCircle(0, 0, 75);

    // Energy particles effect (8 static dots in circle)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI / 4);
      const px = Math.cos(angle) * 82;
      const py = Math.sin(angle) * 82;
      this.shieldGraphics.fillStyle(0xFFFFFF, 0.9);
      this.shieldGraphics.fillCircle(px, py, 3);
    }

    // Deactivate after duration (with upgrade bonus)
    const playerStats = this.upgradeSystem.getPlayerStats();
    const duration = (GameConfig.powerUps.freedomShield.duration + playerStats.shieldExtraSeconds * 1000);
    this.shieldTimer = this.time.delayedCall(duration, () => {
      // Only deactivate if we still own the shield
      if (this.shieldOwner === 'powerup') {
        console.log('America Hat shield expired - deactivating');
        this.shieldActive = false;
        this.shieldOwner = 'none';
        this.shieldIcon?.setVisible(false);
        this.shieldTimerText?.setVisible(false);
        (this as any).shieldBg?.setVisible(false);
        if (this.shieldGraphics) {
          this.shieldGraphics.destroy();
          this.shieldGraphics = undefined;
        }
        // Stop shield loop sound
        if (this.shieldLoopSound) {
          this.shieldLoopSound.stop();
          this.shieldLoopSound = undefined;
        }
      } else {
        console.log('America Hat timer expired but shield owned by:', this.shieldOwner);
      }
    });
  }

  private activateFreedomStrike(): void {
    if (this.freedomStrikeActive) return;

    this.freedomStrikeActive = true;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    console.log('⚡ FREEDOM STRIKE ACTIVATED!');

    // Play lightning strike sound
    this.sound.play('lightning-strike', { volume: 0.8 });

    // White/Yellow lightning flash effect
    const flash = this.add.graphics();
    flash.fillStyle(0xFFFFFF, 0.8); // Bright white flash
    flash.fillRect(0, 0, width, height);
    flash.setDepth(1999);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 200,
      repeat: 3,
      yoyo: true,
      onComplete: () => flash.destroy()
    });

    // Lightning bolts animation - more bolts for dramatic effect
    for (let i = 0; i < 12; i++) {
      const bolt = this.add.graphics();
      bolt.lineStyle(8, 0xFFFF00, 1);

      const startX = Phaser.Math.Between(0, width);
      const startY = 0;
      const endX = startX + Phaser.Math.Between(-150, 150);
      const endY = height;
      const midX = (startX + endX) / 2 + Phaser.Math.Between(-80, 80);
      const midY = height / 2;

      bolt.beginPath();
      bolt.moveTo(startX, startY);
      bolt.lineTo(midX, midY);
      bolt.lineTo(endX, endY);
      bolt.strokePath();
      bolt.setDepth(2000);
      bolt.setAlpha(0.9);

      this.time.delayedCall(i * 80, () => {
        this.tweens.add({
          targets: bolt,
          alpha: 0,
          duration: 300,
          onComplete: () => bolt.destroy()
        });
      });
    }

    // Visual feedback text
    const text = this.add.text(width / 2, 230, '⚡ FREEDOM STRIKE!\nLightning Destroys All Enemies', {
      fontSize: '52px',
      color: '#FFFF00',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    text.setDepth(2001);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: 180,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => text.destroy()
    });

    // === DESTROY ALL ENEMIES (except bosses) ===
    let enemiesDestroyed = 0;
    let totalPoints = 0;
    this.enemies.forEach((enemy: Phaser.GameObjects.Container) => {
      const enemyData = enemy.getData('enemyType');

      // Skip boss enemies
      if (enemyData && enemyData.isBoss) {
        console.log('  WARNING: Skipping boss enemy:', enemyData.name);
        return;
      }

      // Destroy non-boss enemies with explosion effect
      enemiesDestroyed++;

      // Play explosion sound for each enemy
      this.sound.play('explosion', { volume: 0.4 });

      // Create explosion visual at enemy position
      const explosionCircle = this.add.graphics();
      explosionCircle.fillStyle(0xFFFF00, 0.8);
      explosionCircle.fillCircle(enemy.x, enemy.y, 40);
      explosionCircle.setDepth(1998);

      this.tweens.add({
        targets: explosionCircle,
        alpha: 0,
        scaleX: 2,
        scaleY: 2,
        duration: 400,
        ease: 'Power2',
        onComplete: () => explosionCircle.destroy()
      });

      // Award points for destroying enemy
      const pointsAwarded = 50;
      this.score += pointsAwarded;
      totalPoints += pointsAwarded;

      // v3.7: Award XP for enemy kill
      this.xpSystem.addXP({
        delta: 4,
        source: 'enemyKill',
        meta: { enemyType: 'freedom_strike' }
      });

      // Show floating points text for each enemy
      const pointsText = this.add.text(enemy.x, enemy.y, `+${pointsAwarded}`, {
        fontSize: '28px',
        color: '#FFFF00',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5).setDepth(2000);

      this.tweens.add({
        targets: pointsText,
        y: enemy.y - 80,
        alpha: 0,
        duration: 1200,
        ease: 'Power2',
        onComplete: () => pointsText.destroy()
      });

      // Destroy the enemy
      enemy.destroy();
    });

    // Clear enemies array
    this.enemies = [];

    // Update score display
    this.scoreText.setText(`SCORE: ${this.score}`);

    console.log(`  ⚡ Destroyed ${enemiesDestroyed} enemies! Total points: ${totalPoints}`);

    // Show total points earned
    if (totalPoints > 0) {
      const totalPointsText = this.add.text(width / 2, height / 2 + 100, `+${totalPoints} POINTS!\n${enemiesDestroyed} enemies destroyed`, {
        fontSize: '42px',
        color: '#FFD700',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 5
      }).setOrigin(0.5).setDepth(2002);

      this.tweens.add({
        targets: totalPointsText,
        y: height / 2 + 50,
        alpha: 0,
        duration: 2500,
        ease: 'Power2',
        onComplete: () => totalPointsText.destroy()
      });
    }

    // Deactivate after visual effect
    const duration = GameConfig.powerUps.freedomStrike.duration;
    this.freedomStrikeTimer = this.time.delayedCall(duration, () => {
      this.freedomStrikeActive = false;
    });
  }

  private activateBelleMod(): void {
    if (this.belleModActive) return;

    this.belleModActive = true;
    this.belleIcon?.setVisible(true);
    this.belleTimerText?.setVisible(true);
    (this as any).belleBg?.setVisible(true);

    // Play Belle collection sound
    this.sound.play('belle-collect', { volume: 0.6 });

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Visual feedback text - centered
    const text = this.add.text(width / 2, height / 2 - 50, 'Κρόνος Belle is watching 👁️', {
      fontSize: '56px',
      color: '#FFD700',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
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

    // v3.8 PERFORMANCE: Draw aura ONCE here, not every frame
    // Golden glow aura
    this.belleAura.fillStyle(0xFFD700, 0.15);
    this.belleAura.fillCircle(0, 0, 110);

    // Golden ring
    this.belleAura.lineStyle(5, 0xFFD700, 0.7);
    this.belleAura.strokeCircle(0, 0, 95);

    // Inner gold ring
    this.belleAura.lineStyle(3, 0xFFF59D, 1);
    this.belleAura.strokeCircle(0, 0, 85);

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
      (this as any).belleBg?.setVisible(false);
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

    // Visual feedback - centered
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const text = this.add.text(width / 2, height / 2 - 50, '🍔 BURGER MULTIPLIER!\nScore x2 for 5 seconds', {
      fontSize: '56px',
      color: '#FBB13C',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 6
    }).setOrigin(0.5);
    text.setDepth(2000);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: 150,
      duration: 1500,
      onComplete: () => text.destroy()
    });

    // v3.8: Deactivate after duration (with upgrade bonus)
    const playerStats = this.upgradeSystem.getPlayerStats();
    const duration = GameConfig.coins.BURGER.multiplierDuration + (playerStats.burgerDurationBonus * 1000);
    console.log(`🍔 Burger multiplier active for ${(duration/1000).toFixed(1)}s (bonus: +${playerStats.burgerDurationBonus.toFixed(1)}s)`);
    this.burgerMultiplierTimer = this.time.delayedCall(duration, () => {
      this.burgerMultiplierActive = false;
    });
  }

  private updateAOLCombo(): void {
    this.burgerCountText?.setText(`${this.aolCombo}/3`);

    // Animation
    this.tweens.add({
      targets: this.burgerCountText,
      scale: 1.15,
      duration: 100,
      yoyo: true
    });
  }

  // v3.7: Update burger combo counter
  private updateBurgerCombo(): void {
    if (this.burgerCounterText) {
      this.burgerCounterText.setText(`🍔 ${this.burgerCombo}/5`);
    }

    // Animation
    this.tweens.add({
      targets: this.burgerCounterText,
      scale: 1.2,
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut'
    });
  }

  // v3.7: EAT THE DIP - Burger combo power-up (5 burgers)
  private activateEatTheDip(): void {
    if (this.eatTheDipActive) return;

    console.log('🍔💰 EAT THE DIP ACTIVATED!');
    this.eatTheDipActive = true;
    this.burgerCombo = 0; // Reset combo
    this.updateBurgerCombo();

    // Play burger combo sound
    this.sound.play('burgercombo', { volume: 0.9 });

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Golden screen glow overlay
    const dipGlow = this.add.rectangle(width / 2, height / 2, width, height, 0xFFD700, 0.3);
    dipGlow.setDepth(1500);

    // Pulsing animation
    this.tweens.add({
      targets: dipGlow,
      alpha: 0.15,
      duration: 500,
      yoyo: true,
      repeat: 19, // 10 seconds total (500ms * 20 = 10s)
      ease: 'Sine.easeInOut'
    });

    // Main title text
    const titleText = this.add.text(width / 2, height / 2 - 50, '🍔 EAT THE DIP! 🍔', {
      fontSize: '72px',
      color: '#FFD700',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#8B4513',
      strokeThickness: 8
    }).setOrigin(0.5);
    titleText.setDepth(2000);

    // Subtitle text
    const subtitleText = this.add.text(width / 2, height / 2 + 30, 'Coin Rain x2 • Score x3 • 10 seconds', {
      fontSize: '36px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    subtitleText.setDepth(2000);

    // Animate texts
    this.tweens.add({
      targets: [titleText, subtitleText],
      alpha: 0,
      y: '-=100',
      duration: 2000,
      delay: 500,
      ease: 'Quad.easeIn',
      onComplete: () => {
        titleText.destroy();
        subtitleText.destroy();
      }
    });

    // EFFECT 1: Double coin spawn rate
    const originalCoinDelay = this.coinSpawnTimer?.delay || 1500;
    if (this.coinSpawnTimer) {
      this.coinSpawnTimer.remove();
    }
    this.coinSpawnTimer = this.time.addEvent({
      delay: originalCoinDelay / 2, // DOUBLE spawn rate
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    // EFFECT 2: Score multiplier is handled in collectCoin (check eatTheDipActive)

    // v3.8: Deactivate after duration (with upgrade bonus)
    const playerStats = this.upgradeSystem.getPlayerStats();
    const eatDipDuration = (10 + playerStats.burgerDurationBonus) * 1000;
    console.log(`🍔 Eat the Dip active for ${(eatDipDuration/1000).toFixed(1)}s (bonus: +${playerStats.burgerDurationBonus.toFixed(1)}s)`);
    this.eatTheDipTimer = this.time.delayedCall(eatDipDuration, () => {
      console.log('🍔 EAT THE DIP ended');
      this.eatTheDipActive = false;

      // Remove glow
      dipGlow.destroy();

      // Restore normal coin spawn rate
      if (this.coinSpawnTimer) {
        this.coinSpawnTimer.remove();
      }
      this.coinSpawnTimer = this.time.addEvent({
        delay: originalCoinDelay,
        callback: this.spawnCoin,
        callbackScope: this,
        loop: true
      });
    });
  }

  /**
   * v3.8: OPTIMIZED - Show floating text using object pool
   * Text object is automatically returned to pool after animation
   */
  private showFloatingText(
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
    animConfig?: {
      yOffset?: number;
      duration?: number;
      fadeOut?: boolean;
      scale?: boolean;
    }
  ): void {
    // Get text from pool
    const textObj = this.textPool.acquire(x, y, text, style);
    textObj.setDepth(2000);

    // Default animation config
    const config = {
      yOffset: -50,
      duration: 800,
      fadeOut: true,
      scale: false,
      ...animConfig
    };

    // Build tween targets
    const tweenTargets: any = {
      y: y + config.yOffset
    };

    if (config.fadeOut) {
      tweenTargets.alpha = 0;
    }

    if (config.scale) {
      tweenTargets.scale = 1.2;
    }

    // Animate with auto-release to pool
    this.tweens.add({
      targets: textObj,
      ...tweenTargets,
      duration: config.duration,
      ease: 'Power2',
      onComplete: () => {
        this.textPool.release(textObj); // Return to pool instead of destroy!
      }
    });
  }

  private showComboText(combo: number, bonusPoints: number): void {
    // Show combo centered on screen
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const comboText = this.add.text(width / 2, height / 2 - 50, `🔥 ${combo}x COMBO!\n+${bonusPoints}`, {
      fontSize: '56px',
      color: '#FF6B00',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#FFFFFF',
      strokeThickness: 6
    }).setOrigin(0.5);
    comboText.setDepth(1500);

    this.tweens.add({
      targets: comboText,
      scale: 1.2,
      alpha: 0,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => comboText.destroy()
    });
  }

  private showMemePopup(text: string, color: string = '#E63946'): void {
    const width = this.cameras.main.width;

    const memeText = this.add.text(width / 2, 200, text, {
      fontSize: '44px',
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
      y: 230,
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
      this.magnetTimerText.setText(`BUYBACK\n${remaining}s`);

      // Blink warning when < 3 seconds - more prominent
      if (remaining <= 3) {
        this.magnetTimerText.setColor(remaining % 2 === 0 ? '#FF0000' : '#FFFFFF');
        this.magnetIcon?.setAlpha(remaining % 2 === 0 ? 0.4 : 1);
        this.magnetIcon?.setScale(remaining % 2 === 0 ? 1.2 : 1); // Pulse effect
      }
    }

    // Update Shield timer
    if (this.shieldActive && this.shieldTimer && this.shieldTimerText) {
      const remaining = Math.ceil((this.shieldTimer.delay - this.shieldTimer.elapsed) / 1000);
      this.shieldTimerText.setText(`SHIELD\n${remaining}s`);

      // Blink warning when < 3 seconds - more prominent
      if (remaining <= 3) {
        this.shieldTimerText.setColor(remaining % 2 === 0 ? '#FF0000' : '#FFFFFF');
        this.shieldIcon?.setAlpha(remaining % 2 === 0 ? 0.4 : 1);
        this.shieldIcon?.setScale(remaining % 2 === 0 ? 1.2 : 1); // Pulse effect
      }
    }

    // Update Belle MOD timer
    if (this.belleModActive && this.belleModTimer && this.belleTimerText) {
      const remaining = Math.ceil((this.belleModTimer.delay - this.belleModTimer.elapsed) / 1000);
      this.belleTimerText.setText(`BELLE\n${remaining}s`);

      // Blink warning when < 3 seconds - more prominent
      if (remaining <= 3) {
        this.belleTimerText.setColor(remaining % 2 === 0 ? '#FF0000' : '#FFFFFF');
        this.belleIcon?.setAlpha(remaining % 2 === 0 ? 0.4 : 1);
        this.belleIcon?.setScale(remaining % 2 === 0 ? 1.2 : 1); // Pulse effect
      }
    }

    // Update Bull Market timer
    if (this.bullMarketActive && this.bullMarketTimer && this.bullMarketTimerText) {
      const remaining = Math.ceil((this.bullMarketTimer.delay - this.bullMarketTimer.elapsed) / 1000);
      this.bullMarketTimerText.setText(`BULL\n${remaining}s`);

      // Blink warning when < 3 seconds - more prominent
      if (remaining <= 3) {
        this.bullMarketTimerText.setColor(remaining % 2 === 0 ? '#FF0000' : '#FFFFFF');
        this.bullMarketIcon?.setAlpha(remaining % 2 === 0 ? 0.4 : 1);
        this.bullMarketIcon?.setScale(remaining % 2 === 0 ? 1.2 : 1); // Pulse effect
      }
    }

    // Update VALOR Mode timer
    if (this.valorModeActive && this.valorModeTimerText) {
      let remaining = 0;
      let stageName = 'VALOR';

      if (this.valorModeStage === 1 && this.valorStage1Timer) {
        remaining = Math.ceil((this.valorStage1Timer.delay - this.valorStage1Timer.elapsed) / 1000);
        stageName = 'VALOR';
      } else if (this.valorModeStage === 2 && this.valorStage2Timer) {
        remaining = Math.ceil((this.valorStage2Timer.delay - this.valorStage2Timer.elapsed) / 1000);
        stageName = 'ASCENSION';
      } else if (this.valorModeStage === 3) {
        // Afterglow stage - show a fixed time or just the stage name
        stageName = 'AFTERGLOW';
        remaining = 3; // Afterglow lasts 3 seconds
      }

      this.valorModeTimerText.setText(`${stageName}\n${remaining}s`);

      // Blink warning when < 3 seconds - more prominent
      if (remaining <= 3) {
        this.valorModeTimerText.setColor(remaining % 2 === 0 ? '#FF0000' : '#FFFFFF');
        this.valorModeIcon?.setAlpha(remaining % 2 === 0 ? 0.4 : 1);
        this.valorModeIcon?.setScale(remaining % 2 === 0 ? 1.2 : 1); // Pulse effect
      } else {
        this.valorModeTimerText.setColor('#FFFFFF');
        this.valorModeIcon?.setAlpha(1);
        this.valorModeIcon?.setScale(1);
      }
    }
  }

  update(): void {
    // v3.8: Update FPS overlay
    if (this.fpsOverlay) {
      this.fpsOverlay.update();
    }

    // v3.8 PERFORMANCE: Cache eagle position (accessed many times)
    const eagleX = this.eagle?.x || 0;
    const eagleY = this.eagle?.y || 0;

    // v3.8 PERFORMANCE: Cache blink state (calculated 3 times before!)
    const blinkState = Math.floor(this.time.now / 250) % 2 === 0;

    // v3.8 PERFORMANCE: Only update shield position, don't redraw every frame
    if (this.shieldActive && this.shieldGraphics && this.eagle) {
      // Only move shield to eagle position
      this.shieldGraphics.setPosition(eagleX, eagleY);

      // v3.8 PERFORMANCE: Use game time instead of Date.now() for blinking
      if (this.shieldTimer) {
        const remaining = Math.ceil((this.shieldTimer.delay - this.shieldTimer.elapsed) / 1000);
        if (remaining <= 3) {
          // Blink effect when < 3 seconds remaining (use cached state)
          this.shieldGraphics.setAlpha(blinkState ? 0.3 : 1);
        } else {
          this.shieldGraphics.setAlpha(1);
        }
      }
    }

    // v3.8 PERFORMANCE: Only update positions, don't redraw every frame
    if (this.belleModActive && this.eagle) {
      // Position Belle sprite next to eagle (offset left-up)
      if (this.belleSprite) {
        this.belleSprite.setPosition(eagleX - 80, eagleY - 60);

        // v3.8 PERFORMANCE: Use cached blink state
        if (this.belleModTimer) {
          const remaining = Math.ceil((this.belleModTimer.delay - this.belleModTimer.elapsed) / 1000);
          if (remaining <= 3) {
            // Flash Belle sprite on/off (use cached state)
            this.belleSprite.setAlpha(blinkState ? 0.3 : 1);
          } else {
            this.belleSprite.setAlpha(1);
          }
        }
      }

      // v3.8 PERFORMANCE: Only update aura position and alpha
      if (this.belleAura) {
        this.belleAura.setPosition(eagleX, eagleY);

        // v3.8 PERFORMANCE: Use cached blink state
        if (this.belleModTimer) {
          const remaining = Math.ceil((this.belleModTimer.delay - this.belleModTimer.elapsed) / 1000);
          if (remaining <= 3) {
            // Pulsing aura when time running out (use cached state)
            this.belleAura.setAlpha(blinkState ? 0.3 : 1);
          } else {
            this.belleAura.setAlpha(1);
          }
        }
      }
    }

    if (!this.hasStarted || this.isGameOver || this.isPaused) return;

    // Safety check: Fix NaN score
    if (isNaN(this.score)) {
      console.warn('Score was NaN, resetting to 0');
      this.score = 0;
      this.scoreText.setText(`SCORE: ${this.score}`);
    }

    // v3.8 PERFORMANCE: Cache screen dimensions (accessed 89 times!)
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // v3.8 PERFORMANCE: Cache delta and common values
    // v3.9.2 STABILITY FIX: Clamp delta to prevent stuttering from frame spikes
    // At 60 FPS, delta should be ~16.67ms. Clamp to 10-40ms range.
    let delta = this.game.loop.delta;
    if (delta < 10) delta = 10;   // Minimum: ~100 FPS
    if (delta > 40) delta = 40;   // Maximum: ~25 FPS (prevent huge jumps)
    const deltaSeconds = delta / 1000;

    // v3.8 PERFORMANCE: Cache player stats (called 11 times in original code!)
    const playerStats = this.upgradeSystem.getPlayerStats();

    // v3.8 PERFORMANCE: Cache common speeds (used in every loop)
    const coinMoveSpeed = this.coinSpeed * deltaSeconds;
    const enemyMoveSpeed = this.enemySpeed * deltaSeconds;

    // v3.9.2 CRITICAL FIX: Count shield bearers ONCE per frame instead of per enemy!
    // BEFORE: 5 shield bearers × 50 enemies = 250 filter operations per frame!
    // AFTER: 1 filter operation per frame (250x faster!)
    const shieldBearerCount = this.enemies.filter(e =>
      e && e.active && (e.getData('type') === 'shieldBearer' || e.getData('aiType') === 'shielded')
    ).length;

    this.weaponManager.update(delta);
    this.bossManager.update(delta);
    this.bandanaPowerUp.update(); // Bandana effects, magnet, trail

    // v3.8: Check if boss should spawn (at score milestones like 5000)
    if (!this.bossManager.isBossActive() && !this.bossManager.isBossDefeated()) {
      this.bossManager.checkAndSpawn(this.score, this.currentPhase, this.gameTime);
    }

    // v3.7: Update ticker positions for continuous flow around perimeter
    this.updateTickerPositions(delta);

    // v3.7: Update weapon UI energy bar
    if (this.weaponManager.hasWeapon()) {
      this.updateWeaponUI();
    }

    // v3.7: Check projectile collisions with enemies
    const hits = this.weaponManager.checkCollisions(this.enemies);
    for (const hit of hits) {
      // v3.8: Skip if enemy is invalid
      if (!hit.enemy || !hit.enemy.active) continue;

      // === ENHANCED HIT EFFECTS ===
      const hitX = hit.enemy.x;
      const hitY = hit.enemy.y;

      // v3.8 OPTIMIZED: Subtle hit particles (Phaser's particle system is performant!)
      this.graphicsPool.createExplosion(this, hitX, hitY, {
        count: 6,
        color: 0xFFAA00,
        speed: { min: 80, max: 150 },
        lifespan: 400,
        scale: 0.4
      });

      // Play enemy hit sound
      this.sound.play('enemyhit', { volume: 0.6 });

      // v3.8: REVERTED - Back to one-shot kills for performance
      // HP system caused 15-27 FPS, too slow
      // v3.8 PERFORMANCE: Removed screen shake for 60 FPS

      // v3.8: Check if exploder enemy - spawn splinters before death
      const shouldExplode = hit.enemy.getData('shouldExplode');
      const enemyConfig = hit.enemy.getData('config');
      if (shouldExplode && enemyConfig) {
        const splinterCount = enemyConfig.splinterCount || 6;
        this.spawnExplosionSplinters(hitX, hitY, splinterCount);
      }

      // v3.9: Check if splitter enemy - spawn mini enemies before death
      const hitEnemyType = hit.enemy.getData('type') || '';
      if (hitEnemyType === 'splitter' && enemyConfig) {
        const splitCount = enemyConfig.splitCount || 2;
        const splitHP = enemyConfig.splitHP || 15;
        this.spawnSplitterEnemies(hitX, hitY, splitCount, splitHP, enemyConfig);
      }

      // Destroy enemy (one-shot kill)
      hit.enemy.destroy();
      const index = this.enemies.indexOf(hit.enemy);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }

      // Award points
      const pointsAwarded = 50;
      this.score += pointsAwarded;
      this.scoreText.setText(`SCORE: ${this.score}`);

      // v3.7: Award XP for enemy kill
      const enemyType = hit.enemy.getData('type') || 'unknown';
      this.xpSystem.addXP({
        delta: 4,
        source: 'enemyKill',
        meta: { enemyType }
      });

      // v3.8 OPTIMIZED: Show floating score using object pool!
      this.showFloatingText(
        hitX,
        hitY,
        `+${pointsAwarded}`,
        {
          fontSize: '24px',
          color: '#FFD700',
          fontFamily: 'Arial',
          fontStyle: 'bold'
        },
        {
          yOffset: -40,
          duration: 800,
          fadeOut: true
        }
      );

      // Play explosion sound
      if (this.sound.get('explosion')) {
        this.sound.play('explosion', { volume: 0.5 });
      }

      // Destroy projectile
      this.weaponManager.destroyProjectile(hit.projectile);
    }

    // v3.8: Check projectile collisions with boss
    if (this.bossManager.isBossActive()) {
      const boss = this.bossManager.getBoss();
      if (boss && boss.active) {
        const projectiles = this.weaponManager.getProjectiles();
        // v3.8 PERFORMANCE: Squared distance check (7.5x faster!)
        const bossHitRadiusSq = 100 * 100; // Boss hitbox radius squared

        for (const proj of projectiles) {
          if (!proj.active) continue;

          // v3.8 PERFORMANCE: Use squared distance (no sqrt!)
          const dx = proj.x - boss.x;
          const dy = proj.y - boss.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < bossHitRadiusSq) {
            // Hit boss
            const damage = proj.damage || 15;
            this.bossManager.takeDamage(damage, { x: proj.x, y: proj.y });

            // Destroy projectile
            this.weaponManager.destroyProjectile(proj);
          }
        }
      }
    }

    // v3.8: Check boss projectile collisions with player
    if (this.bossManager.isBossActive()) {
      const bossProjectiles = this.bossManager.getBossProjectiles();
      // v3.8 PERFORMANCE: Squared distance check (7.5x faster!)
      const playerHitRadiusSq = 60 * 60; // Player hitbox radius squared

      for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const proj = bossProjectiles[i];
        if (!proj || !proj.active) continue;

        // v3.8 PERFORMANCE: Use squared distance (no sqrt!)
        const dx = proj.x - eagleX; // Use cached eagle position!
        const dy = proj.y - eagleY;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < playerHitRadiusSq) {
          // Hit player
          this.takeDamage();
          proj.destroy();
          bossProjectiles.splice(i, 1);
        }
      }
    }

    // v3.7: Check projectile collisions with fake coins
    const fakeCoinHits = this.weaponManager.checkFakeCoinCollisions(this.fakeCoins);
    for (const hit of fakeCoinHits) {
      // Skip if fake coin already destroyed or collected
      if (!hit.fakeCoin || !hit.fakeCoin.active || hit.fakeCoin.getData('collected')) {
        continue;
      }

      // Save coordinates BEFORE destroying
      const hitX = hit.fakeCoin.x;
      const hitY = hit.fakeCoin.y;

      // Mark as collected to prevent double-hit
      hit.fakeCoin.setData('collected', true);

      // Play hit sound
      if (this.sound.get('coin')) {
        this.sound.play('coin', { volume: 0.5 });
      }

      // v3.8 PERFORMANCE: Removed feedback text and particle effects for 60 FPS
      // Sound feedback is sufficient

      // Remove from array first
      const index = this.fakeCoins.indexOf(hit.fakeCoin);
      if (index > -1) {
        this.fakeCoins.splice(index, 1);
      }

      // Destroy fake coin LAST
      hit.fakeCoin.destroy();

      // Destroy projectile
      this.weaponManager.destroyProjectile(hit.projectile);
    }

    // v3.2: Track time for missions
    this.missionManager.onTimeUpdate(this.gameTime);

    // v3.2: GLIDE CONTROLS - Check if space held long enough
    if (this.spacePressed && !this.isGliding && this.eagle) {
      // v3.8 PERFORMANCE: Use game time instead of Date.now()
      const holdTime = this.time.now - this.spaceStartTime;
      if (holdTime >= this.glideThreshold) {
        console.log('GLIDE START - Moving forward to position:', this.glideEagleX);
        this.isGliding = true;

        // Play whoosh sound when gliding starts
        this.sound.play('whoosh', { volume: 0.6 });

        // Activate glide immediately when threshold reached
        const eagleBody = this.eagle.body as Phaser.Physics.Arcade.Body;
        if (eagleBody) {
          // v3.8: Apply glideGravityMul upgrade (default 1.0, reduced by upgrades)
          // v3.9.2 CRITICAL FIX: Use cached playerStats instead of calling every frame!
          const glideGravityReduction = 0.2 * playerStats.glideGravityMul;
          eagleBody.setGravityY(GameConfig.gravity * glideGravityReduction);
          console.log(`🪶 Glide gravity: ${glideGravityReduction.toFixed(2)}x (upgrade: ${playerStats.glideGravityMul.toFixed(2)})`);
        }

        // Pause animation during glide (frozen pose)
        this.eagle.pauseAnimation();

        // Move eagle forward smoothly
        this.tweens.add({
          targets: this.eagle,
          x: this.glideEagleX,
          duration: 300,
          ease: 'Cubic.easeOut',
          onComplete: () => {
            console.log('Forward glide tween completed at x:', this.eagle?.x);
          }
        });
      }
    }

    // v3.2: Maintain glide effect while holding
    if (this.isGliding && this.spacePressed && this.eagle) {
      const eagleBody = this.eagle.body as Phaser.Physics.Arcade.Body;
      if (eagleBody) {
        // v3.8: Keep reduced gravity (with upgrade applied)
        // v3.9.2 CRITICAL FIX: Use cached playerStats instead of calling 60 times/sec!
        const glideGravityReduction = 0.2 * playerStats.glideGravityMul;
        eagleBody.setGravityY(GameConfig.gravity * glideGravityReduction);
      }
      // Visual feedback - slight transparency
      this.eagle.setAlpha(0.85);
    }

    // v3.2: End glide when space released
    if (this.isGliding && !this.spacePressed && this.eagle) {
      console.log('GLIDE END - Flying back to position:', this.normalEagleX);

      // Reset to normal gravity
      const eagleBody = this.eagle.body as Phaser.Physics.Arcade.Body;
      if (eagleBody) {
        eagleBody.setGravityY(GameConfig.gravity);
      }
      this.eagle.setAlpha(1.0);

      // Resume animation
      this.eagle.resumeAnimation();

      // Eagle flies BACK to normal position
      this.tweens.add({
        targets: this.eagle,
        x: this.normalEagleX,
        duration: 400,
        ease: 'Cubic.easeInOut',
        onComplete: () => {
          console.log('Fly-back tween completed');
        }
      });

      this.isGliding = false;
    }

    // Update power-up timers
    this.updatePowerupTimers();

    // Check if eagle is out of bounds
    if (this.eagle.y < 0 || this.eagle.y > height) {
      this.gameOver();
      return;
    }

    // v3.8 PERFORMANCE: Pre-calculate magnet values ONCE (not per coin!)
    const magnetRange = this.magnetActive ? 400 + playerStats.magnetRadius + playerStats.buybackRadiusBonus : 0;
    const magnetSpeed = this.magnetActive ? 200 * deltaSeconds : 0;
    const collisionRadius = 80; // Coin collection radius
    const collisionRadiusSq = collisionRadius * collisionRadius; // Squared for faster checks

    // v3.9.2 PERFORMANCE: Track if any coins were collected this frame
    let coinsCollectedThisFrame = false;

    // Update coins - move towards player (FIXED: Use reverse loop to avoid splice issues)
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];

      // Skip if already collected or destroyed
      if (!coin || !coin.active || coin.getData('collected')) continue;

      // v3.8 PERFORMANCE: Move coin left (use cached speed)
      coin.x -= coinMoveSpeed;

      // Remove off-screen coins
      if (coin.x < -100) {
        coin.destroy();
        this.coins.splice(i, 1);
        continue;
      }

      // v3.8 PERFORMANCE: Calculate distance ONCE and reuse
      const dx = eagleX - coin.x;
      const dy = eagleY - coin.y;
      const distanceSq = dx * dx + dy * dy; // Squared distance (avoids sqrt!)

      // Magnet effect - pull coins towards eagle
      if (this.magnetActive) {
        const magnetRangeSq = magnetRange * magnetRange;
        if (distanceSq < magnetRangeSq && distanceSq > 0) {
          // v3.8 PERFORMANCE: Only sqrt when actually needed!
          const distance = Math.sqrt(distanceSq);
          // v3.8 BUG FIX: Prevent division by zero if distance is 0
          if (distance > 0) {
            coin.x += (dx / distance) * magnetSpeed;
            coin.y += (dy / distance) * magnetSpeed;
          }
        }
      }

      // v3.8 PERFORMANCE: Check collision with squared distance (no sqrt!)
      if (distanceSq < collisionRadiusSq) {
        // Mark as collected to prevent double collection
        coin.setData('collected', true);

        // Play coin collection sound
        this.sound.play('coin-collect', { volume: 0.4 });

        // v3.7: Add energy to weapon (3% per coin)
        this.weaponManager.addEnergyFromCoin();

        // Collect coin - with safety checks
        const points = coin.getData('points') || 0;
        const type = coin.getData('type') || 'aol';

        // Safety check before adding points
        if (typeof points === 'number' && !isNaN(points)) {
          // v3.8 PERFORMANCE: Combo system using game time instead of Date.now()
          const currentTime = this.time.now;
          const timeSinceLastCoin = currentTime - this.lastCoinTime;

          let bonusPoints = 0;
          if (timeSinceLastCoin < 1000 && this.lastCoinTime > 0) {
            // Combo!
            this.comboCount++;
            bonusPoints = this.comboCount * 5;
            this.showComboText(this.comboCount, bonusPoints);

            // v3.2: Track combo for missions
            this.missionManager.onComboAchieved(this.comboCount);
            // v3.9.2 PERFORMANCE: Removed updateMissionUI() - will be called once at end of coin collection
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

          // v3.7: Apply "Eat the Dip" multiplier (×3)
          if (this.eatTheDipActive) {
            finalPoints *= 3;
          }

          // Apply bull market bonus (×2 coin value)
          if (this.bullMarketActive) {
            finalPoints *= 2;
          }

          this.score += finalPoints;
          this.scoreText.setText(`SCORE: ${this.score}`);

          // v3.2: Track score for missions
          this.missionManager.onScoreUpdate(this.score);
          // v3.9.2 PERFORMANCE: Removed updateMissionUI() - will be called once at end of coin collection

          // v3.7: Award XP for coin collection
          const coinXP = getXPForCoin(type);
          // v3.9.2 CRITICAL: Use cached playerStats instead of calling getPlayerStats() for EVERY coin!
          const xpWithBonus = Math.floor(coinXP * playerStats.coinGainMul);
          this.xpSystem.addXP({
            delta: xpWithBonus,
            source: 'coin',
            meta: { coinType: type, baseXP: coinXP, multiplier: playerStats.coinGainMul }
          });

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

        // v3.7: Track BURGER combo for "Eat the Dip" (collect 5 burgers total)
        if (type === 'burger') {
          this.burgerCombo++;
          this.burgerCount++;
          this.updateBurgerCombo(); // Show combo progress (0/5, 1/5, etc.)

          // Update blue bar counter (total burgers)
          if (this.burgerCountDisplayText) {
            this.burgerCountDisplayText.setText(`🍔 $BURGER: ${this.burgerCount}`);
          }

          // Activate single-burger multiplier
          this.activateBurgerMultiplier();

          // Check if we hit 5 burgers for "Eat the Dip"
          if (this.burgerCombo >= 5) {
            this.activateEatTheDip();
          }
        }
        // Note: Burger combo does NOT reset when collecting other coins (counts total burgers)

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

          // 7% chance to spawn Gold Feather (only if not in cooldown)
          if (!this.valorModeActive && !this.valorModeCooldown) {
            const goldFeatherRoll = Math.random() * 100;
            if (goldFeatherRoll < 7) { // Reduced from 15% to 7% - less frequent
              this.spawnGoldFeather(coin.y);
              console.log('✨ Gold Feather spawned from $VALOR coin!');
            }
          }
        }

        // v3.2: Track coin collection for missions
        this.missionManager.onCoinCollected(type);
        // v3.9.2 PERFORMANCE: Mark that coins were collected (update UI once at end)
        coinsCollectedThisFrame = true;

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
          case 'valor':
            coinName = '$VALOR';
            coinColor = '#FFD700'; // Gold
            break;
        }

        // v3.8 OPTIMIZED: Show floating coin feedback using object pool!
        // Pool reuses text objects instead of creating/destroying = 60 FPS maintained
        let finalPoints = points;
        if (this.burgerMultiplierActive) finalPoints = points * 2;
        if (this.eatTheDipActive) finalPoints = points * 3;
        if (this.bullMarketActive) finalPoints = points * 2;

        this.showFloatingText(
          coin.x,
          coin.y,
          `${coinName} +${finalPoints}`,
          {
            fontSize: '20px',
            color: coinColor,
            fontFamily: 'Arial',
            fontStyle: 'bold'
          },
          {
            yOffset: -40,
            duration: 600,
            fadeOut: true
          }
        );

        this.coins.splice(i, 1);
        coin.destroy();
      }
    }

    // v3.9.2 PERFORMANCE: Update mission UI ONCE per frame instead of per coin!
    // BEFORE: 50 coins collected = 50x updateMissionUI() calls = MASSIVE SLOWDOWN!
    // AFTER: 50 coins collected = 1x updateMissionUI() call = SMOOTH!
    if (coinsCollectedThisFrame) {
      this.updateMissionUI();
    }

    // Update powerups
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const powerup = this.powerups[i];

      // Skip if destroyed
      if (!powerup || !powerup.active) continue;

      // v3.8 PERFORMANCE: Use cached speed
      powerup.x -= coinMoveSpeed;

      if (powerup.x < -100) {
        powerup.destroy();
        this.powerups.splice(i, 1);
        continue;
      }

      // v3.8 PERFORMANCE: Use squared distance (no sqrt!)
      const dx = eagleX - powerup.x;
      const dy = eagleY - powerup.y;
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq < collisionRadiusSq) {
        const type = powerup.getData('type');

        switch (type) {
          case 'shield':
            this.activateShield();
            break;
          case 'freedomStrike':
            this.activateFreedomStrike();
            break;
          case 'belleMod':
            this.activateBelleMod();
            break;
          case 'vesper':
            this.activateBullMarket();
            break;
          case 'vesper0x':
            // Extra life from Vesper0x
            this.addExtraLife();
            break;
          case 'goldFeather':
            // v3.2: Activate VALOR MODE
            this.activateValorMode();
            this.sound.play('valorawakens', { volume: 0.9 });
            break;
          case 'bandana':
            // v3.7: Activate BANDANA MODE
            this.bandanaPowerUp.activate();
            break;
        }

        powerup.destroy();
        this.powerups.splice(i, 1);
      }
    }

    // v3.7: Check weapon pickup collision
    if (this.weaponPickup && this.weaponPickup.active) {
      // v3.8 PERFORMANCE: Use cached speed
      this.weaponPickup.x -= coinMoveSpeed;

      if (this.weaponPickup.x < -100) {
        this.weaponPickup.destroy();
        this.weaponPickup = undefined;
      } else {
        // v3.8 PERFORMANCE: Use squared distance (no sqrt!)
        const dx = this.weaponPickup.x - eagleX;
        const dy = this.weaponPickup.y - eagleY;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < collisionRadiusSq) {
          this.collectWeaponPickup();
        }
      }
    }

    // Update fake coins
    for (let i = this.fakeCoins.length - 1; i >= 0; i--) {
      const fakeCoin = this.fakeCoins[i];

      if (!fakeCoin || !fakeCoin.active || fakeCoin.getData('collected')) continue;

      // v3.8 PERFORMANCE: Use cached speed
      fakeCoin.x -= coinMoveSpeed;

      if (fakeCoin.x < -100) {
        fakeCoin.destroy();
        this.fakeCoins.splice(i, 1);
        continue;
      }

      // v3.8 PERFORMANCE: Use squared distance (no sqrt!)
      const dx = eagleX - fakeCoin.x;
      const dy = eagleY - fakeCoin.y;
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq < collisionRadiusSq) {
        fakeCoin.setData('collected', true);

        // v3.8 PERFORMANCE: Removed all fake coin feedback animations (text + tweens)
        // Check if shield or Belle MOD is active
        if (this.shieldActive || this.belleModActive) {
          // Shield or Belle MOD protects against fake coins
          this.fakeCoins.splice(i, 1);
          fakeCoin.destroy();
          continue;
        }

        // v3.8 PERFORMANCE: Removed FAKE text, tween, and shake animations
        this.fakeCoins.splice(i, 1);
        fakeCoin.destroy();

        // v3.2: Take damage instead of instant game over
        this.takeDamage();
      }
    }

    // Update lawsuit papers
    for (let i = this.lawsuitPapers.length - 1; i >= 0; i--) {
      const paper = this.lawsuitPapers[i];

      if (!paper || !paper.active) continue;

      // v3.9.2 PERFORMANCE: Use cached deltaSeconds
      paper.x -= (this.coinSpeed * 0.5) * deltaSeconds;

      if (paper.x < -100) {
        paper.destroy();
        this.lawsuitPapers.splice(i, 1);
        continue;
      }

      // Check collision with eagle (v3.8 PERFORMANCE: Squared distance!)
      const dx = paper.x - eagleX; // Use cached position!
      const dy = paper.y - eagleY;
      const distanceSq = dx * dx + dy * dy;
      const collisionRadiusSq = 80 * 80;

      if (distanceSq < collisionRadiusSq) {
        // v3.8: Check if this is an enemy projectile (laser/splinter) or lawsuit paper
        const isEnemyProjectile = paper.getData('type') === 'enemyProjectile';

        if (isEnemyProjectile) {
          // Enemy projectile - causes damage
          this.takeDamage();
        } else {
          // Lawsuit paper - blocks controls temporarily
          const duration = GameConfig.enemies.gary.controlBlockDuration;
          this.blockControls(duration);
        }

        // v3.8 PERFORMANCE: Removed screen shake for 60 FPS

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
      const movementPattern = enemy.getData('movementPattern') || 'straight';

      // v3.8: Width needed for sniper AI
      const enemyLoopWidth = this.cameras.main.width;

      // v3.9.2 PERFORMANCE: Use cached deltaSeconds
      // Different speeds for different enemies
      const baseSpeed = enemyConfig.speed * deltaSeconds;

      // === v3.5: DYNAMIC MOVEMENT PATTERNS ===
      switch (movementPattern) {
        case 'straight':
          // Normal horizontal movement
          enemy.x -= baseSpeed;
          break;

        case 'sine_wave':
          // Gentle sine wave movement (up and down)
          enemy.x -= baseSpeed;
          const waveOffset = enemy.getData('waveOffset') || 0;
          const startY = enemy.getData('startY') || enemy.y;
          const waveTime = this.gameTime + waveOffset;
          const waveAmplitude = 40; // Reduced from 60 to 40 - gentler movement
          const waveSpeed = 1.5; // Reduced from 2 to 1.5 - slower wave
          enemy.y = startY + Math.sin(waveTime * waveSpeed) * waveAmplitude;

          // Keep within visible bounds
          const maxWaveHeight = this.cameras.main.height;
          if (enemy.y < 200) enemy.y = 200;
          if (enemy.y > maxWaveHeight - 200) enemy.y = maxWaveHeight - 200;
          break;

        case 'dash':
          // Occasional dash forward with warning
          enemy.x -= baseSpeed;
          let dashCooldown = enemy.getData('dashCooldown') || 0;
          // v3.9.2 PERFORMANCE: Use cached delta
          dashCooldown -= delta;

          if (dashCooldown <= 0) {
            // Reduced dash speed for better visibility
            enemy.x -= baseSpeed * 8; // Reduced from 15 to 8
            dashCooldown = 3000; // Increased from 2000 to 3000ms - less frequent
          }
          enemy.setData('dashCooldown', dashCooldown);
          break;

        case 'tracking':
          // Smoothly follow the eagle's Y position
          enemy.x -= baseSpeed;
          const targetY = this.eagle.y;
          const currentY = enemy.y;
          const trackingSpeed = baseSpeed * 0.8; // Reduced from 1.5 to 0.8 - slower tracking
          const deadzone = 30; // Increased from 10 to 30 - less aggressive

          if (currentY < targetY - deadzone) {
            enemy.y += trackingSpeed;
          } else if (currentY > targetY + deadzone) {
            enemy.y -= trackingSpeed;
          }

          // Keep within visible bounds
          const maxHeight = this.cameras.main.height;
          if (enemy.y < 180) enemy.y = 180;
          if (enemy.y > maxHeight - 180) enemy.y = maxHeight - 180;
          break;

        case 'boss_chaos':
          // v3.8 PERFORMANCE: Boss special movement - direct Y change instead of tween
          enemy.x -= baseSpeed * 0.6; // Slower horizontal movement
          let chaosTimer = enemy.getData('chaosTimer') || 0;
          // v3.9.2 PERFORMANCE: Use cached delta
          chaosTimer += delta;

          if (chaosTimer > 1500) { // Increased from 800 to 1500 - slower changes
            // Random direction change with constraints - direct movement instead of tween
            const randomY = Phaser.Math.Between(250, this.cameras.main.height - 250);
            const currentBossY = enemy.getData('chaosTargetY') || enemy.y;
            enemy.setData('chaosTargetY', randomY);
            enemy.setData('chaosStartY', currentBossY);
            enemy.setData('chaosMoveProgress', 0);
            chaosTimer = 0;
          }

          // Smooth interpolation to target Y (replaces tween)
          const chaosTargetY = enemy.getData('chaosTargetY');
          if (chaosTargetY !== undefined) {
            let chaosMoveProgress = enemy.getData('chaosMoveProgress') || 0;
            // v3.9.2 PERFORMANCE: Use cached delta
            chaosMoveProgress += delta / 1800; // 1800ms duration
            if (chaosMoveProgress >= 1) {
              enemy.y = chaosTargetY;
              enemy.setData('chaosTargetY', undefined);
            } else {
              const chaosStartY = enemy.getData('chaosStartY') || enemy.y;
              // Sine easing
              const t = Math.sin(chaosMoveProgress * Math.PI / 2);
              enemy.y = chaosStartY + (chaosTargetY - chaosStartY) * t;
              enemy.setData('chaosMoveProgress', chaosMoveProgress);
            }
          }

          enemy.setData('chaosTimer', chaosTimer);
          break;

        default:
          enemy.x -= baseSpeed;
      }

      // v3.8: Special AI behaviors for new enemies
      const aiType = enemyConfig.aiType;

      if (aiType === 'sniper') {
        // HawkEye sniper - fires aimed laser shots
        let fireTimer = enemy.getData('fireTimer') || 0;
        // v3.9.2 PERFORMANCE: Use cached delta
        fireTimer -= delta;

        if (fireTimer <= 0 && enemy.x < enemyLoopWidth - 100) {
          // Fire laser at player
          this.spawnEnemyProjectile(enemy.x, enemy.y, this.eagle.x, this.eagle.y, 'laser');
          fireTimer = enemyConfig.fireRate || 3000;
        }
        enemy.setData('fireTimer', fireTimer);
      }

      if (aiType === 'exploder') {
        // FireCracker - check if should explode (will be handled in collision/destroy)
        // Mark for explosion on death
        enemy.setData('shouldExplode', true);
      }

      // v3.9: SHIELD BEARER AI - Rotating shield protection
      // v3.9.1 PERFORMANCE FIX: Only redraw shield every 3 frames (60 FPS → 20 visual updates/sec)
      if (aiType === 'shielded' && (enemyType === 'shieldBearer' || enemyConfig.shieldRotationSpeed)) {
        // Update shield rotation
        let shieldAngle = enemy.getData('shieldAngle') || 0;
        const rotationSpeed = enemyConfig.shieldRotationSpeed || 2; // radians per second
        // v3.9.2 PERFORMANCE: Use cached deltaSeconds
        shieldAngle += rotationSpeed * deltaSeconds;
        enemy.setData('shieldAngle', shieldAngle);

        // PERFORMANCE: Only redraw every 3 frames
        let redrawCounter = enemy.getData('shieldRedrawCounter') || 0;
        redrawCounter++;
        enemy.setData('shieldRedrawCounter', redrawCounter);

        if (redrawCounter >= 3) {
          enemy.setData('shieldRedrawCounter', 0);

          // Draw rotating shield (visual feedback)
          let shieldGraphic = enemy.getData('shieldGraphic');
          if (!shieldGraphic || !shieldGraphic.active) {
            shieldGraphic = this.add.graphics();
            enemy.add(shieldGraphic);
            enemy.setData('shieldGraphic', shieldGraphic);
          }

          // Clear and redraw shield
          shieldGraphic.clear();
          const shieldArc = enemyConfig.shieldArc || Math.PI * 0.6; // 108 degrees
          const shieldRadius = Math.max(enemyConfig.size.width, enemyConfig.size.height) / 2 + 10;

          // Draw shield arc (single layer for performance)
          shieldGraphic.lineStyle(4, 0x00AAFF, 0.8);
          shieldGraphic.beginPath();
          shieldGraphic.arc(0, 0, shieldRadius, shieldAngle - shieldArc / 2, shieldAngle + shieldArc / 2, false);
          shieldGraphic.strokePath();

          // v3.9.2 PERFORMANCE: Use cached shieldBearerCount (calculated once per frame)
          // Add rim highlight ONLY if less than 5 shield bearers (performance)
          if (shieldBearerCount < 5) {
            shieldGraphic.lineStyle(2, 0xFFFFFF, 0.6);
            shieldGraphic.beginPath();
            shieldGraphic.arc(0, 0, shieldRadius - 2, shieldAngle - shieldArc / 2, shieldAngle + shieldArc / 2, false);
            shieldGraphic.strokePath();
          }
        }
      }

      // v3.9: KAMIKAZE AI - Rushes directly at the eagle!
      if (aiType === 'kamikaze' || enemyType === 'kamikaze') {
        // Calculate direction to eagle
        const toEagleX = eagleX - enemy.x;
        const toEagleY = eagleY - enemy.y;
        const distance = Math.sqrt(toEagleX * toEagleX + toEagleY * toEagleY);

        if (distance > 0) {
          // v3.9.2 PERFORMANCE: Use cached deltaSeconds
          const rushSpeed = (enemyConfig.rushSpeed || 500) * deltaSeconds;

          // Normalize and apply rush speed
          enemy.x += (toEagleX / distance) * rushSpeed;
          enemy.y += (toEagleY / distance) * rushSpeed;

          // Rotate kamikaze to face eagle (adds visual feedback)
          const angle = Math.atan2(toEagleY, toEagleX);
          enemy.setRotation(angle);

          // Visual trail effect - red danger particles
          if (Math.random() < 0.3) { // 30% chance per frame
            this.graphicsPool.createExplosion(this, enemy.x, enemy.y, {
              count: 1,
              color: 0xFF3333,
              speed: { min: 20, max: 40 },
              lifespan: 200,
              scale: 0.2
            });
          }
        }
      }

      // v3.9: HEALER AI - Heals nearby enemies periodically
      if (aiType === 'healer' || enemyType === 'healer') {
        let healTimer = enemy.getData('healTimer') || 0;
        // v3.9.2 PERFORMANCE: Use cached delta
        healTimer -= delta;

        if (healTimer <= 0) {
          const healRange = enemyConfig.healRange || 200;
          const healAmount = enemyConfig.healAmount || 10;
          const healRangeSq = healRange * healRange;

          // Find nearby enemies to heal
          let healedCount = 0;
          for (const otherEnemy of this.enemies) {
            if (otherEnemy === enemy || !otherEnemy.active) continue;

            // v3.9 PERFORMANCE: Squared distance check
            const dx = otherEnemy.x - enemy.x;
            const dy = otherEnemy.y - enemy.y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq < healRangeSq) {
              const currentHP = otherEnemy.getData('hp') || 0;
              const maxHP = otherEnemy.getData('maxHp') || currentHP;

              if (currentHP < maxHP && currentHP > 0) {
                // Heal the enemy
                const newHP = Math.min(maxHP, currentHP + healAmount);
                otherEnemy.setData('hp', newHP);
                healedCount++;

                // Heal visual effect - green particles
                this.graphicsPool.createExplosion(this, otherEnemy.x, otherEnemy.y, {
                  count: 3,
                  color: 0x00FF88,
                  speed: { min: 30, max: 60 },
                  lifespan: 300,
                  scale: 0.3
                });
              }
            }
          }

          // Reset heal timer
          healTimer = enemyConfig.healInterval || 3000;

          // v3.9.2 PERFORMANCE: Simplified visual feedback (no onUpdate callback)
          // Visual feedback on healer - green pulse
          if (healedCount > 0) {
            const healAura = this.add.graphics();
            healAura.lineStyle(3, 0x00FF88, 0.6);
            healAura.strokeCircle(enemy.x, enemy.y, healRange * 0.3);
            healAura.setDepth(499);

            // PERFORMANCE: Simple fade tween without onUpdate callback
            this.tweens.add({
              targets: healAura,
              alpha: 0,
              duration: 400,
              onComplete: () => healAura.destroy()
            });

            // Sound effect
            this.sound.play('power-up', { volume: 0.2, rate: 1.5 });
          }
        }
        enemy.setData('healTimer', healTimer);
      }

      // Remove off-screen enemies
      if (enemy.x < -200) {
        enemy.destroy();
        this.enemies.splice(i, 1);
        continue;
      }

      // Check collision with eagle (ignore if shield is active)
      // v3.8: Safety check for missing config
      if (!enemyConfig) {
        console.warn('Enemy missing config:', enemyType);
        enemy.destroy();
        this.enemies.splice(i, 1);
        continue;
      }

      // v3.8 PERFORMANCE: Squared distance check (7.5x faster!)
      const dx = enemy.x - eagleX; // Use cached position!
      const dy = enemy.y - eagleY;
      const distanceSq = dx * dx + dy * dy;

      // Collision radius based on enemy size
      const collisionRadius = Math.max(enemyConfig.size.width, enemyConfig.size.height) / 2 + 40;
      const collisionRadiusSq = collisionRadius * collisionRadius;

      if (distanceSq < collisionRadiusSq) {
        if (this.shieldActive || this.belleModActive) {
          // Shield or Belle MOD protects - destroy enemy
          const enemyType = enemy.getData('type') || 'enemy';

          // v3.8: Check if exploder enemy - spawn splinters before death
          const shouldExplode = enemy.getData('shouldExplode');
          if (shouldExplode) {
            const splinterCount = enemyConfig.splinterCount || 6;
            this.spawnExplosionSplinters(enemy.x, enemy.y, splinterCount);
          }

          enemy.destroy();
          this.enemies.splice(i, 1);

          // v3.2: Award points for killing enemy
          const killPoints = 50;
          this.score += killPoints;
          this.scoreText.setText(`SCORE: ${this.score}`);

          // v3.5: Play explosion sound when enemy defeated
          this.sound.play('explosion', { volume: 0.7 });

          // v3.2: Track enemy kill for missions
          this.missionManager.onEnemyKilled(enemyType);
          this.missionManager.onScoreUpdate(this.score);
          this.updateMissionUI();

          // v3.8 PERFORMANCE: Removed visual feedback (text + tween + shake) for 60 FPS
        } else {
          // v3.2: Hit by enemy - take damage instead of instant game over
          // Play crash sound
          this.sound.play('crash', { volume: 0.6 });

          // Show enemy meme text
          const meme = enemyConfig.meme || 'Hit!';
          this.showMemePopup(meme, '#FF0000');

          // Take damage (removes 1 life, adds invincibility frames)
          this.takeDamage();

          // v3.8: Check if exploder enemy - spawn splinters before death
          const shouldExplode = enemy.getData('shouldExplode');
          if (shouldExplode) {
            const splinterCount = enemyConfig.splinterCount || 6;
            this.spawnExplosionSplinters(enemy.x, enemy.y, splinterCount);
          }

          // Destroy enemy after hit
          enemy.destroy();
          this.enemies.splice(i, 1);

          // v3.8 PERFORMANCE: Removed screen shake for 60 FPS
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
    this.freedomStrikeTimer?.remove();
    this.controlBlockTimer?.remove();
    this.belleModTimer?.remove();
    this.bullMarketTimer?.remove();

    // v3.9.2 CRITICAL: Flush XP system to save pending XP to localStorage
    // This ensures player doesn't lose XP from coins collected in the last second
    this.xpSystem.flush();

    // Update high score
    const currentHighScore = this.registry.get('highScore') || 0;
    if (this.score > currentHighScore) {
      this.registry.set('highScore', this.score);
      localStorage.setItem('eagleOfFun_highScore', this.score.toString());

      // Play new record sound
      this.sound.play('newrecord', { volume: 0.9 });
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
    this.freedomStrikeTimer?.remove();
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

    // Add a life to the player
    this.addLife();

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Visual feedback - centered
    const text = this.add.text(width / 2, height / 2 - 50, `🐂 BULL MARKET MODE!\n+1 Extra Life | Coins ×2\n"${this.getRandomWisdom()}"`, {
      fontSize: '56px',
      color: '#00FF00',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6
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
    (this as any).bullBg?.setVisible(true);

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
      (this as any).bullBg?.setVisible(false);
      this.coinSpeed = originalCoinSpeed;
      this.enemySpeed = originalEnemySpeed;
    });
  }

  // ========== v3.7: WEAPON PICKUP SYSTEM ==========
  private spawnWeaponPickup(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const y = height / 2;

    this.weaponPickup = this.add.container(width + 100, y);

    // Weapon crate visual (blue box with weapon icon)
    const crateGraphics = this.add.graphics();
    crateGraphics.fillStyle(0x0088FF, 1);
    crateGraphics.fillRoundedRect(-40, -40, 80, 80, 8);
    crateGraphics.lineStyle(4, 0xFFFFFF, 1);
    crateGraphics.strokeRoundedRect(-40, -40, 80, 80, 8);

    // Star icon for weapon
    const star = this.add.graphics();
    star.fillStyle(0xFFFFFF, 1);
    for (let i = 0; i < 5; i++) {
      const angle = (i * 144 - 90) * Math.PI / 180;
      const x = Math.cos(angle) * 20;
      const y = Math.sin(angle) * 20;
      if (i === 0) star.moveTo(x, y);
      else star.lineTo(x, y);
    }
    star.closePath();
    star.fillPath();

    // Glow effect
    const glow = this.add.graphics();
    glow.fillStyle(0x0088FF, 0.3);
    glow.fillCircle(0, 0, 60);

    // Text label
    const label = this.add.text(0, 60, '⚡ WEAPON', {
      fontSize: '20px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    this.weaponPickup.add([glow, crateGraphics, star, label]);
    this.weaponPickup.setData('type', 'weapon');
    this.weaponPickup.setSize(80, 80);

    // Pulse animation
    this.tweens.add({
      targets: glow,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Float animation
    this.tweens.add({
      targets: this.weaponPickup,
      y: y - 20,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private showEnemyHPBar(enemy: Phaser.GameObjects.Container): void {
    const currentHP = enemy.getData('hp') || 0;
    const maxHP = enemy.getData('maxHp') || 100;
    // v3.8 BUG FIX: Prevent division by zero if maxHP is 0
    const hpPercent = maxHP > 0 ? currentHP / maxHP : 0;

    // Only show HP bar if damaged (< 100% HP)
    if (hpPercent >= 1.0) return;

    // Check if HP bar already exists
    let bar = enemy.getData('hpBar');

    if (bar) {
      // Update existing bar (more efficient than recreate)
      bar.clear();
    } else {
      // Create new HP bar
      bar = this.add.graphics();
      enemy.add(bar);
      enemy.setData('hpBar', bar);
    }

    const barWidth = 60;
    const barHeight = 6;

    // Background (red)
    bar.fillStyle(0xFF0000, 0.8);
    bar.fillRect(-barWidth / 2, -40, barWidth, barHeight);

    // Foreground (green to red gradient based on HP)
    const color = hpPercent > 0.5 ? 0x00FF00 : hpPercent > 0.25 ? 0xFFFF00 : 0xFF0000;
    bar.fillStyle(color, 1);
    bar.fillRect(-barWidth / 2, -40, barWidth * hpPercent, barHeight);

    // Border
    bar.lineStyle(1, 0x000000, 1);
    bar.strokeRect(-barWidth / 2, -40, barWidth, barHeight);
  }

  private calculateEnemyHP(baseHP: number): number {
    // Calculate HP with time-based scaling
    const secondsElapsed = this.gameTime;

    // Import difficulty scaling (inline for now)
    const HP_SCALING_INTERVAL = 30;           // Every 30 seconds
    const HP_SCALING_INCREASE = 1.06;         // +6% per interval
    const HP_SCALING_MAX_MULTIPLIER = 2.2;    // Cap at 220% of base HP

    const intervals = Math.floor(secondsElapsed / HP_SCALING_INTERVAL);
    const multiplier = Math.pow(HP_SCALING_INCREASE, intervals);
    const cappedMultiplier = Math.min(multiplier, HP_SCALING_MAX_MULTIPLIER);

    return Math.floor(baseHP * cappedMultiplier);
  }

  private checkWeaponAutoUpgrade(): void {
    // Auto-upgrade weapon based on player XP level
    if (!this.weaponManager.hasWeapon()) return;

    const playerLevel = this.xpSystem.getState().level;
    const currentWeaponLevel = this.weaponManager.getWeaponLevel();

    // Weapon progression by player level:
    // Level 1-2: Weapon Level 1-2 (Basic/Rapid)
    // Level 3-4: Weapon Level 3 (Power Laser)
    // Level 5: Weapon Level 4 (Eagle Spread) - First new weapon!
    // Level 7: Weapon Level 5 (Rail AOL)
    // Level 10: Weapon Level 6 (Burger Mortar)

    const upgradeLevels = [
      { playerLevel: 3, weaponLevel: 3 },  // Power Laser
      { playerLevel: 5, weaponLevel: 4 },  // Eagle Spread (3 projectiles)
      { playerLevel: 7, weaponLevel: 5 },  // Rail AOL (pierce)
      { playerLevel: 10, weaponLevel: 6 }  // Burger Mortar (splash)
    ];

    for (const upgrade of upgradeLevels) {
      if (playerLevel >= upgrade.playerLevel && currentWeaponLevel < upgrade.weaponLevel) {
        const oldLevel = this.weaponManager.getWeaponLevel();

        while (this.weaponManager.getWeaponLevel() < upgrade.weaponLevel) {
          this.weaponManager.upgradeWeapon();
        }

        // Show notification if weapon was upgraded
        if (this.weaponManager.getWeaponLevel() > oldLevel) {
          this.showWeaponUpgradeNotification();
        }
      }
    }
  }

  private showWeaponUpgradeNotification(): void {
    const weaponName = this.weaponManager.getWeaponName();
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // v3.8: Modern white panel with black border
    const panel = this.add.graphics();
    panel.fillStyle(0xFFFFFF, 1); // White background
    panel.fillRoundedRect(width / 2 - 300, height / 2 - 120, 600, 240, 12);
    panel.lineStyle(4, 0x000000, 1); // Black border
    panel.strokeRoundedRect(width / 2 - 300, height / 2 - 120, 600, 240, 12);
    panel.setDepth(2000);

    // v3.8: Title text - clean black
    const title = this.add.text(width / 2, height / 2 - 70, 'NEW WEAPON UNLOCKED', {
      fontSize: '36px',
      color: '#000000',
      fontFamily: 'Impact, Arial Black, Arial',
      fontStyle: 'bold',
      letterSpacing: 3
    });
    title.setOrigin(0.5);
    title.setDepth(2001);

    // Red underline accent
    const underline = this.add.graphics();
    underline.fillStyle(0xE63946, 1);
    underline.fillRect(width / 2 - 160, height / 2 - 45, 320, 4);
    underline.setDepth(2001);

    // v3.8: Weapon name - red accent
    const weaponText = this.add.text(width / 2, height / 2 + 10, weaponName, {
      fontSize: '52px',
      color: '#E63946', // Red accent for weapon name
      fontFamily: 'Impact, Arial Black, Arial',
      fontStyle: 'bold',
      letterSpacing: 4
    });
    weaponText.setOrigin(0.5);
    weaponText.setDepth(2001);

    // v3.8: Instruction text - black
    const instruction = this.add.text(width / 2, height / 2 + 70, 'Press Q / W / E to fire!', {
      fontSize: '24px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 2
    });
    instruction.setOrigin(0.5);
    instruction.setDepth(2001);

    // Pulse animation
    this.tweens.add({
      targets: [title, weaponText],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 400,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeInOut'
    });

    // Play upgrade sound
    if (this.sound.get('power-up')) {
      this.sound.play('power-up', { volume: 0.8 });
    }

    // Remove notification after 3 seconds
    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: [panel, underline, title, weaponText, instruction],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          panel.destroy();
          underline.destroy();
          title.destroy();
          weaponText.destroy();
          instruction.destroy();
        }
      });
    });
  }

  private collectWeaponPickup(): void {
    if (!this.weaponPickup || !this.weaponPickup.active) return;

    // Unlock weapon
    this.weaponManager.unlockWeapon();
    this.checkWeaponAutoUpgrade();

    // Play collection sound
    if (this.sound.get('power-up')) {
      this.sound.play('power-up', { volume: 0.6 });
    }

    // Visual feedback
    const width = this.cameras.main.width;
    const feedbackText = this.add.text(width / 2, 300, '⚡ WEAPON UNLOCKED!', {
      fontSize: '48px',
      color: '#0088FF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#FFFFFF',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(2000);

    this.tweens.add({
      targets: feedbackText,
      alpha: 0,
      y: 250,
      duration: 2000,
      onComplete: () => feedbackText.destroy()
    });

    // Destroy pickup
    this.weaponPickup.destroy();
    this.weaponPickup = undefined;

    // Stop the respawn timer (player has weapon now)
    if (this.weaponRespawnTimer) {
      this.weaponRespawnTimer.remove();
      this.weaponRespawnTimer = undefined;
      console.log('🔫 Weapon respawn timer stopped');
    }

    // FREEZE gameplay (but keep input working) so player can read tutorial
    this.controlBlocked = true;
    this.physics.pause();
    this.time.paused = true; // Pause all timers (coin spawns, enemies, etc.)
    this.tweens.pauseAll(); // Pause all animations

    // Show tutorial overlay FIRST, then create UI
    this.showWeaponTutorial();

    // Create weapon UI
    this.createWeaponUI();
  }

  private showWeaponTutorial(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // PAUSE THE GAME COMPLETELY - freeze gameplay so player can read tutorial
    this.isPaused = true; // This stops the update loop from processing game logic
    this.controlBlocked = true;
    this.physics.pause();
    this.time.paused = true; // Pause all timers
    this.tweens.pauseAll(); // Pause all animations

    console.log('🎮 GAME PAUSED - Weapon tutorial showing');

    // Create a container for all tutorial elements
    const tutorialElements: Phaser.GameObjects.GameObject[] = [];

    // v3.8: Dark overlay for better readability
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7); // Darker overlay
    overlay.fillRect(0, 0, width, height);
    overlay.setDepth(5000);
    overlay.setScrollFactor(0); // Fixed to camera
    tutorialElements.push(overlay);

    // v3.8: Larger white box with thick black border for high contrast
    const boxWidth = 700;
    const boxHeight = 450;
    const tutorialBg = this.add.graphics();
    tutorialBg.fillStyle(0xFFFFFF, 1); // Pure white background
    tutorialBg.fillRoundedRect(width / 2 - boxWidth / 2, height / 2 - boxHeight / 2, boxWidth, boxHeight, 16);
    tutorialBg.lineStyle(6, 0x000000, 1); // Thick black border
    tutorialBg.strokeRoundedRect(width / 2 - boxWidth / 2, height / 2 - boxHeight / 2, boxWidth, boxHeight, 16);
    tutorialBg.setDepth(5001);
    tutorialBg.setScrollFactor(0);
    tutorialElements.push(tutorialBg);

    // v3.8: Title - larger and bolder for better visibility
    const title = this.add.text(width / 2, height / 2 - 170, 'WEAPON UNLOCKED', {
      fontSize: '52px', // Larger title
      color: '#000000',
      fontFamily: 'Impact, Arial Black, Arial',
      fontStyle: 'bold',
      letterSpacing: 6
    }).setOrigin(0.5).setDepth(5002);
    title.setScrollFactor(0);
    tutorialElements.push(title);

    // Red underline accent (like StartScene) - wider
    const underline = this.add.graphics();
    underline.fillStyle(0xE63946, 1); // Red accent
    underline.fillRect(width / 2 - 180, height / 2 - 135, 360, 5); // Wider and thicker
    underline.setDepth(5002);
    underline.setScrollFactor(0);
    tutorialElements.push(underline);

    // v3.8: Instructions - larger text for better readability
    const controlsY = height / 2 - 80;
    const lineHeight = 45; // More spacing between lines

    const qControl = this.add.text(width / 2 - 150, controlsY, 'Q', {
      fontSize: '36px', // Larger keys
      color: '#E63946', // Red accent for keys
      fontFamily: 'Arial Black, Arial',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0, 0.5).setDepth(5002);
    qControl.setScrollFactor(0);
    tutorialElements.push(qControl);

    const qLabel = this.add.text(width / 2 - 100, controlsY, 'Shoot Forward', {
      fontSize: '26px', // Larger labels
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5).setDepth(5002);
    qLabel.setScrollFactor(0);
    tutorialElements.push(qLabel);

    const wControl = this.add.text(width / 2 - 150, controlsY + lineHeight, 'W', {
      fontSize: '36px', // Larger keys
      color: '#E63946', // Red accent for keys
      fontFamily: 'Arial Black, Arial',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0, 0.5).setDepth(5002);
    wControl.setScrollFactor(0);
    tutorialElements.push(wControl);

    const wLabel = this.add.text(width / 2 - 100, controlsY + lineHeight, 'Shoot Up', {
      fontSize: '26px', // Larger labels
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5).setDepth(5002);
    wLabel.setScrollFactor(0);
    tutorialElements.push(wLabel);

    const eControl = this.add.text(width / 2 - 150, controlsY + lineHeight * 2, 'E', {
      fontSize: '36px', // Larger keys
      color: '#E63946', // Red accent for keys
      fontFamily: 'Arial Black, Arial',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0, 0.5).setDepth(5002);
    eControl.setScrollFactor(0);
    tutorialElements.push(eControl);

    const eLabel = this.add.text(width / 2 - 100, controlsY + lineHeight * 2, 'Shoot Down', {
      fontSize: '26px', // Larger labels
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5).setDepth(5002);
    eLabel.setScrollFactor(0);
    tutorialElements.push(eLabel);

    // v3.8: Energy info - larger and clearer
    const energyInfo = this.add.text(width / 2, height / 2 + 110,
      'Coins charge energy • Shooting uses energy',
      {
        fontSize: '22px', // Larger info text
        color: '#555555', // Slightly darker gray
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(5002);
    energyInfo.setScrollFactor(0);
    tutorialElements.push(energyInfo);

    // v3.8: Close hint - larger and more prominent
    const closeHint = this.add.text(width / 2, height / 2 + 180, 'Press SPACE to continue', {
      fontSize: '26px', // Larger hint
      color: '#E63946', // Red accent
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0.5).setDepth(5002);
    closeHint.setScrollFactor(0);
    tutorialElements.push(closeHint);

    // Pulsing animation on close hint
    this.tweens.add({
      targets: closeHint,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Store reference
    (this as any).tutorialElements = tutorialElements;

    // Close ONLY with SPACE key
    const closeFunction = () => {
      // Remove all tutorial elements
      tutorialElements.forEach(el => {
        if (el && (el as any).destroy) {
          (el as any).destroy();
        }
      });

      // Clear reference
      (this as any).tutorialElements = undefined;

      // Remove listener
      this.input.keyboard?.off('keydown-SPACE', closeFunction);

      // UNFREEZE gameplay - resume physics, timers, tweens and controls
      this.isPaused = false; // Resume update loop processing
      this.controlBlocked = false;
      this.physics.resume();
      this.time.paused = false; // Resume all timers
      this.tweens.resumeAll(); // Resume all animations

      console.log('✅ Weapon tutorial closed - game resumed');
    };

    this.input.keyboard?.once('keydown-SPACE', closeFunction);
  }

  private startWeaponRespawnTimer(): void {
    // Clear any existing timer
    if (this.weaponRespawnTimer) {
      this.weaponRespawnTimer.remove();
    }

    // Create a timer that checks every 15 seconds
    this.weaponRespawnTimer = this.time.addEvent({
      delay: 15000, // 15 seconds
      callback: () => {
        // Only respawn if:
        // 1. Player doesn't have weapon yet
        // 2. No weapon pickup currently on screen
        if (!this.weaponManager.hasWeapon() && !this.weaponPickup) {
          console.log('🔫 Respawning weapon pickup (player missed it)');
          this.spawnWeaponPickup();
        } else if (this.weaponManager.hasWeapon()) {
          // Player has weapon now, stop the timer
          if (this.weaponRespawnTimer) {
            this.weaponRespawnTimer.remove();
            this.weaponRespawnTimer = undefined;
          }
        }
      },
      loop: true
    });
  }

  // ========== v3.2: VALOR MODE (3 STAGES) ==========
  private activateValorMode(): void {
    if (this.valorModeActive || this.valorModeCooldown) return;
    if (!this.eagle || !this.eagle.active) return;

    console.log('🦅 VALOR MODE v3.2 ACTIVATED - Stage 1 Begin');

    // Store original speeds
    this.originalCoinSpeed = this.coinSpeed;
    this.originalEnemySpeed = this.enemySpeed;

    // Start Stage 1
    this.startValorStage1();
  }

  private startValorStage1(): void {
    this.valorModeActive = true;
    this.valorModeStage = 1;
    this.valorScoreMultiplier = 2; // Stage 1: ×2 score

    // Switch to gold eagle sprite
    if (this.eagle && this.eagle.active) {
      console.log('🦅 VALOR STAGE 1: Switching eagle to gold sprite...');
      this.eagle.switchToGoldSprite();
      console.log('🦅 Gold sprite switch complete');
    } else {
      console.error('❌ Eagle not available for gold sprite switch!');
    }

    // Set invincibility - VALOR owns the shield
    console.log('VALOR MODE taking shield ownership');
    this.shieldActive = true;
    this.shieldOwner = 'valor';

    // Create shield graphics for VALOR mode
    if (this.shieldGraphics) {
      this.shieldGraphics.destroy();
    }
    this.shieldGraphics = this.add.graphics();
    this.shieldGraphics.setDepth(999); // Higher depth to ensure visibility

    // v3.9.2 FIX: Draw VALOR shield (gold/yellow themed)
    // Outer glow (golden)
    this.shieldGraphics.fillStyle(0xFFD700, 0.2);
    this.shieldGraphics.fillCircle(0, 0, 100);

    // Middle ring (bright gold)
    this.shieldGraphics.lineStyle(6, 0xFFDD00, 0.8);
    this.shieldGraphics.strokeCircle(0, 0, 85);

    // Inner ring (yellow-white)
    this.shieldGraphics.lineStyle(4, 0xFFFF88, 1);
    this.shieldGraphics.strokeCircle(0, 0, 75);

    // Energy particles effect (8 static dots in circle) - white/gold
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI / 4);
      const px = Math.cos(angle) * 82;
      const py = Math.sin(angle) * 82;
      this.shieldGraphics.fillStyle(0xFFFFFF, 0.9);
      this.shieldGraphics.fillCircle(px, py, 3);
    }

    // v3.8: Stage 1: Speed ×2, Coins ×1.5 (reduced for performance)
    this.coinSpeed = this.originalCoinSpeed * 2;  // Was 3x
    this.enemySpeed = this.originalEnemySpeed * 2;  // Was 3x

    // Coin spawn rate ×1.5 (was 2x - reduced for performance)
    if (this.coinSpawnTimer) {
      this.coinSpawnTimer.remove();
    }
    this.coinSpawnTimer = this.time.addEvent({
      delay: 1000, // 1.5x faster (was 750ms = 2x)
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    // Create golden screen glow
    this.createValorScreenGlow();

    // Create VALOR MODE HUD
    this.createValorModeHUD('VALOR MODE', 'Stage 1');

    // Stage 1 visual feedback
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const overlay = this.add.text(width / 2, height / 2 + 80, '⚡🦅 VALOR MODE STAGE 1 🦅⚡\nSPEED ×3 | COINS ×2\nSCORE ×2', {
      fontSize: '48px',
      color: '#FFD700',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6
    });
    overlay.setOrigin(0.5);
    overlay.setDepth(10000);

    this.tweens.add({
      targets: overlay,
      alpha: 0,
      duration: 2500,
      onComplete: () => overlay.destroy()
    });

    // Play sound
    this.sound.play('buyback-voice', { volume: 0.9 });
    // v3.8 PERFORMANCE: Removed shake, kept flash for visual feedback
    this.cameras.main.flash(500, 255, 215, 0, true);

    // Stage 1 duration: 6 seconds
    this.valorStage1Timer = this.time.delayedCall(6000, () => {
      this.startValorStage2();
    });
  }

  private startValorStage2(): void {
    console.log('⚡ VALOR MODE - Stage 2 Begin (ASCENSION)');

    this.valorModeStage = 2;
    this.valorScoreMultiplier = 3; // Stage 2: ×3 score

    // Keep invincibility active
    this.shieldActive = true;

    // v3.8: Stage 2: Speed ×2.5, Coins ×2 (reduced for performance)
    this.coinSpeed = this.originalCoinSpeed * 2.5;  // Was 4.5x
    this.enemySpeed = this.originalEnemySpeed * 2.5;  // Was 4.5x

    // Coin spawn rate ×2 (was 4x - reduced for performance)
    if (this.coinSpawnTimer) {
      this.coinSpawnTimer.remove();
    }
    this.coinSpawnTimer = this.time.addEvent({
      delay: 750, // 2x faster (was 375ms = 4x)
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    // Update HUD
    this.updateValorModeHUD('VALOR ASCENSION', 'Stage 2');

    // Stage 2 visual feedback
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const overlay = this.add.text(width / 2, height / 2 + 80, '⚡🦅 VALOR MODE STAGE 2 🦅⚡\nSPEED ×2.5 | COINS ×2\nSCORE ×3', {
      fontSize: '52px',
      color: '#FFD700',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6
    });
    overlay.setOrigin(0.5);
    overlay.setDepth(10000);

    this.tweens.add({
      targets: overlay,
      alpha: 0,
      duration: 2500,
      onComplete: () => overlay.destroy()
    });

    // v3.8 PERFORMANCE: Removed shake, kept flash for visual feedback
    this.cameras.main.flash(800, 255, 215, 0, true);

    // Stage 2 duration: 6 seconds
    this.valorStage2Timer = this.time.delayedCall(6000, () => {
      this.startValorAfterglow();
    });
  }

  private startValorAfterglow(): void {
    console.log('✨ VALOR MODE - Afterglow (fade out)');

    this.valorModeStage = 3;
    this.valorScoreMultiplier = 1.5; // Afterglow: ×1.5 score

    // Keep invincibility active during afterglow - VALOR still owns shield
    this.shieldActive = true;
    this.shieldOwner = 'valor';

    // Slow down to ×1.5
    this.coinSpeed = this.originalCoinSpeed * 1.5;
    this.enemySpeed = this.originalEnemySpeed * 1.5;

    // Normal coin spawn
    if (this.coinSpawnTimer) {
      this.coinSpawnTimer.remove();
    }
    this.coinSpawnTimer = this.time.addEvent({
      delay: 1500,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    // Update HUD
    this.updateValorModeHUD('VALOR AFTERGLOW', 'Fade');

    // Afterglow duration: 5 seconds
    this.valorAfterglowTimer = this.time.delayedCall(5000, () => {
      this.deactivateValorMode();
    });
  }

  private deactivateValorMode(): void {
    console.log('VALOR MODE v3.2 - Complete Deactivation');

    this.valorModeActive = false;
    this.valorModeStage = 0;
    this.valorScoreMultiplier = 1;

    // Restore normal speeds (with safety check!)
    if (this.originalCoinSpeed === 0 || this.originalEnemySpeed === 0) {
      console.error('⚠️ BUG: originalSpeeds are 0! Resetting to defaults.');
      this.originalCoinSpeed = 300;
      this.originalEnemySpeed = 250;
    }
    this.coinSpeed = this.originalCoinSpeed;
    this.enemySpeed = this.originalEnemySpeed;
    console.log(`✅ Speeds restored to: coinSpeed=${this.coinSpeed}, enemySpeed=${this.enemySpeed}`);

    // Restore normal coin spawn
    if (this.coinSpawnTimer) {
      this.coinSpawnTimer.remove();
    }
    this.coinSpawnTimer = this.time.addEvent({
      delay: 1500,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    // Switch back to normal eagle
    if (this.eagle && this.eagle.active) {
      console.log('🦅 VALOR MODE END: Switching back to normal eagle sprite...');
      this.eagle.switchToNormalSprite();
      console.log('🦅 Normal sprite switch complete');

      // Additional safety check after 500ms to ensure sprite switched
      this.time.delayedCall(500, () => {
        if (this.eagle && this.eagle.active) {
          // Call switch again if needed (switchToNormalSprite has internal checks)
          this.eagle.switchToNormalSprite();
        }
      });
    }

    // Remove shield and destroy graphics - only if VALOR owns it
    if (this.shieldOwner === 'valor') {
      console.log('VALOR MODE releasing shield ownership');
      this.shieldActive = false;
      this.shieldOwner = 'none';
      if (this.shieldGraphics) {
        this.shieldGraphics.destroy();
        this.shieldGraphics = undefined;
      }
    } else {
      console.log('VALOR MODE ending but shield owned by:', this.shieldOwner);
    }

    // Remove screen glow
    if (this.valorScreenGlow) {
      this.valorScreenGlow.destroy();
      this.valorScreenGlow = undefined;
    }
    if (this.valorModeText) {
      this.valorModeText.destroy();
      this.valorModeText = undefined;
    }

    // Hide VALOR mode indicator at bottom
    const valorBg = (this as any).valorBg;
    if (valorBg) valorBg.setVisible(false);
    if (this.valorModeIcon) this.valorModeIcon.setVisible(false);
    if (this.valorModeTimerText) this.valorModeTimerText.setVisible(false);

    // v3.8: Start cooldown (with upgrade reduction)
    const playerStats = this.upgradeSystem.getPlayerStats();
    const cooldownDuration = (60 - playerStats.valorCDMinus) * 1000; // 60s base, reduced by upgrade
    console.log(`⚡ VALOR MODE cooldown: ${(cooldownDuration/1000).toFixed(0)}s (reduced by ${playerStats.valorCDMinus}s)`);
    this.valorModeCooldown = true;
    this.valorCooldownTimer = this.time.delayedCall(cooldownDuration, () => {
      this.valorModeCooldown = false;
      console.log('VALOR MODE - Cooldown complete. Ready again!');
    });
  }

  private createValorScreenGlow(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Use rectangle instead of graphics to avoid crashes
    this.valorScreenGlow = this.add.rectangle(0, 0, width, height, 0xFFD700, 0.15);
    this.valorScreenGlow.setOrigin(0, 0);
    this.valorScreenGlow.setDepth(9999);

    // Pulsing animation
    this.tweens.add({
      targets: this.valorScreenGlow,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createValorModeHUD(title: string, subtitle: string): void {
    const width = this.cameras.main.width;

    // Show VALOR mode indicator at bottom (like other power-ups)
    const valorBg = (this as any).valorBg;
    if (valorBg) valorBg.setVisible(true);
    if (this.valorModeIcon) this.valorModeIcon.setVisible(true);
    if (this.valorModeTimerText) this.valorModeTimerText.setVisible(true);

    // VALOR MODE text at top center - below top bar (top bar is ~100px high)
    this.valorModeText = this.add.text(width / 2, 200, `${title}\n${subtitle}`, {
      fontSize: '38px',
      color: '#FFD700',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 5
    });
    this.valorModeText.setOrigin(0.5);
    this.valorModeText.setDepth(10000);
  }

  private updateValorModeHUD(title: string, subtitle: string): void {
    if (this.valorModeText) {
      this.valorModeText.setText(`${title}\n${subtitle}`);
    }
  }

  // v3.2: LIFE SYSTEM - Create heart display (inline in top bar)
  private createHeartDisplay(): void {
    const width = this.cameras.main.width;
    const heartStartX = width * 0.62; // Position in top bar, after SCORE (better spacing)
    const heartY = 62; // Same as hudY (adjusted for 55px bar)
    const heartSpacing = 35;

    // Clear existing hearts
    this.heartSprites.forEach(heart => heart.destroy());
    this.heartSprites = [];

    // Create hearts based on current lives
    for (let i = 0; i < this.maxLives; i++) {
      const heart = this.add.text(
        heartStartX + (i * heartSpacing),
        heartY,
        '❤️',
        {
          fontSize: '28px'
        }
      );
      heart.setOrigin(0.5);
      heart.setDepth(1001);

      // Make heart semi-transparent if empty
      if (i >= this.lives) {
        heart.setAlpha(0.2);
      }

      this.heartSprites.push(heart as any);
    }
  }

  // v3.2: Update heart display after taking damage or gaining life
  private updateHeartDisplay(): void {
    for (let i = 0; i < this.heartSprites.length; i++) {
      if (i < this.lives) {
        this.heartSprites[i].setAlpha(1.0); // Full heart
      } else {
        this.heartSprites[i].setAlpha(0.2); // Empty heart
      }
    }
  }

  // v3.2: Take damage and lose a life
  private takeDamage(): void {
    if (this.invincible || this.shieldActive || this.belleModActive) {
      console.log('takeDamage blocked - invincible:', this.invincible, 'shield:', this.shieldActive, 'belle:', this.belleModActive);
      return;
    }

    // Set invincibility IMMEDIATELY to prevent multiple hits in same frame
    this.invincible = true;

    this.lives--;
    console.log('💔 Took damage! Lives remaining:', this.lives);
    this.updateHeartDisplay();

    // Play hit animation on eagle
    if (this.eagle) {
      this.eagle.playHitAnimation();
    }

    // === v3.8: VISUAL HIT FEEDBACK ===

    // 1. SCREEN SHAKE (intense but short)
    this.cameras.main.shake(250, 0.015); // 250ms duration, 0.015 intensity

    // 2. RED FLASH on eagle position
    if (this.eagle) {
      const hitFlash = this.add.graphics();
      hitFlash.fillStyle(0xFF0000, 0.6);
      hitFlash.fillCircle(this.eagle.x, this.eagle.y, 80);
      hitFlash.setDepth(2000);

      this.tweens.add({
        targets: hitFlash,
        alpha: 0,
        scaleX: 2,
        scaleY: 2,
        duration: 300,
        ease: 'Power2',
        onComplete: () => hitFlash.destroy()
      });

      // 3. HIT PARTICLES - Blood/Impact effect
      this.graphicsPool.createExplosion(this, this.eagle.x, this.eagle.y, {
        count: 12,
        color: 0xFF3333,
        speed: { min: 100, max: 200 },
        lifespan: 500,
        scale: 0.6
      });
    }

    // 4. SCREEN FLASH (white flash for impact)
    const screenFlash = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.cameras.main.width,
      this.cameras.main.height,
      0xFFFFFF,
      0.5
    );
    screenFlash.setDepth(1999);
    screenFlash.setScrollFactor(0);

    this.tweens.add({
      targets: screenFlash,
      alpha: 0,
      duration: 150,
      ease: 'Power2',
      onComplete: () => screenFlash.destroy()
    });

    // 5. PLAY HIT SOUND (louder)
    this.sound.play('crash', { volume: 0.8 });

    // Invincibility frames (2 seconds)

    // Blink effect during invincibility
    let blinkCount = 0;
    const blinkInterval = this.time.addEvent({
      delay: 150,
      repeat: 13, // 2 seconds / 150ms = ~13 blinks
      callback: () => {
        if (this.eagle) {
          this.eagle.setAlpha(blinkCount % 2 === 0 ? 0.3 : 1.0);
        }
        blinkCount++;
      }
    });

    // Remove invincibility after 2 seconds
    this.invincibilityTimer = this.time.delayedCall(2000, () => {
      this.invincible = false;
      if (this.eagle) {
        this.eagle.setAlpha(1.0);
      }
      blinkInterval.remove();
    });

    // Check if game over
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  // v3.2: Add a life (from powerup or milestone)
  private addLife(): void {
    if (this.lives < this.maxLives) {
      this.lives++;
      this.updateHeartDisplay();

      // Visual feedback
      const width = this.cameras.main.width;
      const text = this.add.text(width / 2, 300, '+1 LIFE!', {
        fontSize: '48px',
        color: '#FF1493',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#FFFFFF',
        strokeThickness: 6
      }).setOrigin(0.5);
      text.setDepth(10000);

      this.tweens.add({
        targets: text,
        alpha: 0,
        y: text.y - 80,
        duration: 1500,
        ease: 'Cubic.easeOut',
        onComplete: () => text.destroy()
      });

      this.sound.play('buyback-voice', { volume: 0.7 });
    }
  }

  // v3.8: Add extra life from Vesper0x power-up
  private addExtraLife(): void {
    if (this.lives < this.maxLives) {
      this.lives++;
      this.updateHeartDisplay();

      // Visual feedback with Vesper0x branding
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;

      // Background panel
      const panel = this.add.graphics();
      panel.fillStyle(0x000000, 0.8);
      panel.fillRoundedRect(width / 2 - 200, height / 2 - 80, 400, 160, 16);
      panel.setDepth(9999);

      // Title
      const title = this.add.text(width / 2, height / 2 - 40, '🦌 VESPER0X APPEARS! 🦌', {
        fontSize: '28px',
        color: '#FF69B4',
        fontFamily: 'Arial Black, Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
      }).setOrigin(0.5);
      title.setDepth(10000);

      // Message
      const message = this.add.text(width / 2, height / 2 + 10, 'Extra Life Granted! ❤️', {
        fontSize: '24px',
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);
      message.setDepth(10000);

      // America.Fun Team label
      const team = this.add.text(width / 2, height / 2 + 45, 'America.Fun Team Member', {
        fontSize: '16px',
        color: '#FFD700',
        fontFamily: 'Arial',
        fontStyle: 'italic'
      }).setOrigin(0.5);
      team.setDepth(10000);

      // Fade out after 2.5 seconds
      this.time.delayedCall(2500, () => {
        this.tweens.add({
          targets: [panel, title, message, team],
          alpha: 0,
          duration: 500,
          onComplete: () => {
            panel.destroy();
            title.destroy();
            message.destroy();
            team.destroy();
          }
        });
      });

      // Play sound
      this.sound.play('belle-collect', { volume: 0.8 });
    } else {
      // Already at max lives - still show message
      const width = this.cameras.main.width;
      const text = this.add.text(width / 2, 300, 'ALREADY AT MAX LIVES!', {
        fontSize: '32px',
        color: '#FFD700',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);
      text.setDepth(10000);

      this.tweens.add({
        targets: text,
        alpha: 0,
        y: text.y - 60,
        duration: 1500,
        ease: 'Cubic.easeOut',
        onComplete: () => text.destroy()
      });
    }
  }

  // v3.2: Update mission UI - now sends to UIScene
  private updateMissionUI(): void {
    const dailyMissions = this.missionManager.getDailyMissions();
    const uiScene = this.scene.get('UIScene') as any;

    if (uiScene && uiScene.updateMissions) {
      uiScene.updateMissions(dailyMissions);
    }

    // Also update XP display
    this.updateXPDisplay();
  }

  // v3.7: XP display update - UIScene now listens to xpSystem automatically
  private updateXPDisplay(): void {
    // REMOVED: Old mission-based XP system
    // UIScene now subscribes to xpSystem.onXPChange() and updates automatically
    // No manual updates needed here anymore
  }

  // v3.7: NEWS TICKER FRAME - Simplified continuous ticker on all 4 sides
  private createNewsTicker(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const frameThickness = 28;

    // Create frame graphics
    this.newsTickerBg = this.add.graphics();
    this.newsTickerBg.fillStyle(0xC62828, 0.95);
    this.newsTickerBg.fillRect(0, 0, width, frameThickness);
    this.newsTickerBg.fillRect(0, 0, frameThickness, height);
    this.newsTickerBg.fillRect(width - frameThickness, 0, frameThickness, height);
    this.newsTickerBg.fillRect(0, height - frameThickness, width, frameThickness);
    this.newsTickerBg.setDepth(2000);

    // BREAKING label
    const breakingLabel = this.add.text(frameThickness + 15, 14, '🚨 BREAKING:', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);
    breakingLabel.setDepth(2002);

    const tickerMessage = ' Gary sues another meme coin!  •  $BONK hits new ATH  •  Whales accumulating  •  Bear market cancelled  •  Diamond hands prevail  •  ';
    const repeatedMessage = tickerMessage.repeat(3); // v3.8: Reduced from 20 to 3 - fixes WebGL texture size error!

    const tickerStyle = {
      fontSize: '15px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'normal'
    };

    const edgeGap = 10;
    const topWidth = width - (frameThickness * 2) - (edgeGap * 2);
    const sideHeight = height - (frameThickness * 2) - (edgeGap * 2);

    // TOP ticker (horizontal, right to left)
    this.newsTickerText = this.add.text(width, 14, repeatedMessage, tickerStyle);
    this.newsTickerText.setOrigin(0, 0.5);
    this.newsTickerText.setDepth(2001);
    const topMask = this.add.graphics();
    topMask.fillRect(frameThickness + edgeGap, 0, topWidth, frameThickness);
    this.newsTickerText.setMask(topMask.createGeometryMask());

    // LEFT ticker (vertical, top to bottom) - centered with padding from edge
    const textPadding = 6; // Padding from screen edge for readability
    const leftCenterX = frameThickness / 2 + textPadding; // Slightly more to the right
    this.newsTickerTextLeft = this.add.text(leftCenterX, -500, repeatedMessage, tickerStyle);
    this.newsTickerTextLeft.setOrigin(0.5, 0);
    this.newsTickerTextLeft.setAngle(90);
    this.newsTickerTextLeft.setDepth(2001);
    const leftMask = this.add.graphics();
    // Mask covers full left frame area
    leftMask.fillRect(0, frameThickness + edgeGap, frameThickness, sideHeight);
    this.newsTickerTextLeft.setMask(leftMask.createGeometryMask());

    // RIGHT ticker (vertical, bottom to top) - centered with padding from edge
    const rightCenterX = width - (frameThickness / 2) + textPadding; // Slightly more to the right (away from edge)
    this.newsTickerTextRight = this.add.text(rightCenterX, height + 500, repeatedMessage, tickerStyle);
    this.newsTickerTextRight.setOrigin(0.5, 0);
    this.newsTickerTextRight.setAngle(90);
    this.newsTickerTextRight.setDepth(2001);
    const rightMask = this.add.graphics();
    // Mask covers full right frame area
    rightMask.fillRect(width - frameThickness, frameThickness + edgeGap, frameThickness, sideHeight);
    this.newsTickerTextRight.setMask(rightMask.createGeometryMask());

    // BOTTOM ticker (horizontal, left to right)
    this.newsTickerTextBottom = this.add.text(-width, height - 14, repeatedMessage, tickerStyle);
    this.newsTickerTextBottom.setOrigin(0, 0.5);
    this.newsTickerTextBottom.setDepth(2001);
    const bottomMask = this.add.graphics();
    bottomMask.fillRect(frameThickness + edgeGap, height - frameThickness, topWidth, frameThickness);
    this.newsTickerTextBottom.setMask(bottomMask.createGeometryMask());

    this.startNewsTickerScroll();
  }

  // Animate ticker scroll on all 4 sides with Tweens
  private startNewsTickerScroll(): void {
    if (!this.newsTickerText) return;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const singleMessageLength = this.newsTickerText.width / 3; // v3.8: Changed from /20 to /3 (matches repeat(3))
    const scrollDuration = 30000;

    // TOP ticker: Scroll from right to left
    this.newsTickerText.x = width;
    this.tweens.add({
      targets: this.newsTickerText,
      x: -singleMessageLength,
      duration: scrollDuration,
      ease: 'Linear',
      repeat: -1
    });

    // LEFT ticker: Scroll from top to bottom
    if (this.newsTickerTextLeft) {
      this.newsTickerTextLeft.y = -singleMessageLength;
      this.tweens.add({
        targets: this.newsTickerTextLeft,
        y: height + singleMessageLength,
        duration: scrollDuration,
        ease: 'Linear',
        repeat: -1
      });
    }

    // RIGHT ticker: Scroll from bottom to top
    if (this.newsTickerTextRight) {
      this.newsTickerTextRight.y = height + singleMessageLength;
      this.tweens.add({
        targets: this.newsTickerTextRight,
        y: -singleMessageLength,
        duration: scrollDuration,
        ease: 'Linear',
        repeat: -1
      });
    }

    // BOTTOM ticker: Scroll from left to right
    if (this.newsTickerTextBottom) {
      this.newsTickerTextBottom.x = -singleMessageLength;
      this.tweens.add({
        targets: this.newsTickerTextBottom,
        x: width + singleMessageLength,
        duration: scrollDuration,
        ease: 'Linear',
        repeat: -1
      });
    }
  }

  // Dummy function for compatibility (no longer needed with Tweens)
  private updateTickerPositions(delta: number): void {
    // Ticker now uses Tweens instead of manual update
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

  // ========== v3.3: MARKET PHASES SYSTEM ==========

  private checkMarketPhaseTransition(): void {
    if (this.phaseTransitionInProgress) return;

    const newPhase = determinePhase(this.gameTime, this.score);

    if (newPhase !== this.currentMarketPhase) {
      console.log(`📊 Market Phase Transition: ${this.currentMarketPhase} → ${newPhase}`);
      this.previousMarketPhase = this.currentMarketPhase;
      this.currentMarketPhase = newPhase;
      this.performPhaseTransition();
    }
  }

  private performPhaseTransition(): void {
    this.phaseTransitionInProgress = true;

    const phase = MARKET_PHASES[this.currentMarketPhase];

    // Screen flash
    this.cameras.main.flash(500, 255, 255, 255, false);

    // Sound effect
    if (this.sound.get('phase-change')) {
      this.sound.play('phase-change', { volume: 0.6 });
    }

    // v3.3: Visual Market Phase Announcement
    this.showMarketPhaseAnnouncement(phase);

    // Update ticker with phase message
    this.updateTickerForPhase();

    // Apply phase effects
    this.applyMarketPhaseEffects();

    // v3.7: Spawn weapon pickup after Phase 1 (when transitioning to CORRECTION)
    if (this.currentMarketPhase === 'CORRECTION' && !this.weaponManager.hasWeapon()) {
      this.spawnWeaponPickup();

      // Start a timer to respawn weapon if player misses it
      this.startWeaponRespawnTimer();
    }

    // Reset transition flag after 1 second
    this.time.delayedCall(1000, () => {
      this.phaseTransitionInProgress = false;
    });
  }

  private showMarketPhaseAnnouncement(phase: MarketPhase): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Get phase emoji
    const phaseEmojis: { [key: string]: string } = {
      'BULL_RUN': '🐂',
      'CORRECTION': '📉',
      'BEAR_TRAP': '🐻',
      'SIDEWAYS': '↔️',
      'VALOR_COMEBACK': '🦅',
      'ENDLESS_WAGMI': '🌟'
    };

    const emoji = phaseEmojis[this.currentMarketPhase] || '📊';

    // v3.3: Calculate Y position based on active announcements
    const baseY = height / 2;
    const spacing = 150; // Space between announcements
    const yPosition = baseY + (this.activeAnnouncements.length * spacing);

    // Create announcement text
    const announcementText = this.add.text(
      width / 2,
      yPosition,
      `${emoji} ${phase.name.toUpperCase()} ${emoji}\n${phase.theme}`,
      {
        fontSize: '64px',
        color: `#${phase.tickerColor.toString(16).padStart(6, '0')}`,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 8
      }
    );
    announcementText.setOrigin(0.5);
    announcementText.setDepth(10000);
    announcementText.setAlpha(0);

    // v3.3: Add to active announcements list
    this.activeAnnouncements.push(announcementText);

    // Animate in
    this.tweens.add({
      targets: announcementText,
      alpha: 1,
      scale: { from: 0.5, to: 1.2 },
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Hold for 1.5 seconds, then fade out
        this.tweens.add({
          targets: announcementText,
          alpha: 0,
          scale: 1.3,
          duration: 800,
          delay: 1500,
          ease: 'Cubic.easeIn',
          onComplete: () => {
            // v3.3: Remove from active announcements
            const index = this.activeAnnouncements.indexOf(announcementText);
            if (index > -1) {
              this.activeAnnouncements.splice(index, 1);
            }
            announcementText.destroy();

            // v3.3: Move remaining announcements up
            this.repositionActiveAnnouncements();
          }
        });
      }
    });
  }

  // v3.3: Reposition remaining announcements when one is removed
  private repositionActiveAnnouncements(): void {
    const height = this.cameras.main.height;
    const baseY = height / 2;
    const spacing = 150;

    this.activeAnnouncements.forEach((announcement, index) => {
      const targetY = baseY + (index * spacing);

      // Smoothly move to new position
      this.tweens.add({
        targets: announcement,
        y: targetY,
        duration: 300,
        ease: 'Cubic.easeOut'
      });
    });
  }

  private applyMarketPhaseEffects(): void {
    const phase = MARKET_PHASES[this.currentMarketPhase];

    if (!phase) {
      console.warn(`Unknown market phase: ${this.currentMarketPhase}`);
      return;
    }

    console.log(`Applying phase effects for ${phase.name}:`);
    console.log(`  - Coin Spawn: ×${phase.coinSpawnModifier}`);
    console.log(`  - Enemy Spawn: ×${phase.enemySpawnModifier}`);
    console.log(`  - Speed: ×${phase.speedModifier}`);

    // Apply speed modifier
    const baseSpeed = 300;
    this.coinSpeed = baseSpeed * phase.speedModifier;
    this.enemySpeed = (250 * phase.speedModifier);

    // Update coin spawn rate
    if (this.coinSpawnTimer) {
      this.coinSpawnTimer.remove();
    }
    const baseCoinDelay = 1500;
    const newCoinDelay = baseCoinDelay / phase.coinSpawnModifier;
    this.coinSpawnTimer = this.time.addEvent({
      delay: newCoinDelay,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    // Update enemy spawn rate
    if (this.enemySpawnTimer) {
      this.enemySpawnTimer.remove();
    }
    const currentPhaseConfig = GameConfig.phases[this.currentPhase - 1];
    if (currentPhaseConfig) {
      const baseEnemyDelay = currentPhaseConfig.spawnRate;
      const newEnemyDelay = baseEnemyDelay / phase.enemySpawnModifier;
      this.enemySpawnTimer = this.time.addEvent({
        delay: newEnemyDelay,
        callback: this.spawnEnemy,
        callbackScope: this,
        loop: true
      });
    }

    // Apply background filter if specified
    if (phase.backgroundFilter !== undefined && this.backgroundImage) {
      this.backgroundImage.setTint(phase.backgroundFilter);
    } else if (this.backgroundImage) {
      this.backgroundImage.clearTint();
    }
  }

  private updateTickerForPhase(): void {
    const phase = MARKET_PHASES[this.currentMarketPhase];

    if (!phase || !this.newsTickerBg || !this.newsTickerText) {
      return;
    }

    // Update full frame background color to match market phase
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const frameThickness = 28;

    this.newsTickerBg.clear();
    this.newsTickerBg.fillStyle(phase.tickerColor, 0.95);

    // Redraw complete frame: TOP, LEFT, RIGHT, BOTTOM
    this.newsTickerBg.fillRect(0, 0, width, frameThickness); // Top bar
    this.newsTickerBg.fillRect(0, 0, frameThickness, height); // Left bar
    this.newsTickerBg.fillRect(width - frameThickness, 0, frameThickness, height); // Right bar
    this.newsTickerBg.fillRect(0, height - frameThickness, width, frameThickness); // Bottom bar

    // Update ticker message on all 4 sides
    const tickerMessage = `  ${phase.tickerMessage}  •  `.repeat(10);

    if (this.newsTickerText) {
      this.newsTickerText.setText(tickerMessage);
    }
    if (this.newsTickerTextLeft) {
      this.newsTickerTextLeft.setText(tickerMessage);
    }
    if (this.newsTickerTextRight) {
      this.newsTickerTextRight.setText(tickerMessage);
    }
    if (this.newsTickerTextBottom) {
      this.newsTickerTextBottom.setText(tickerMessage);
    }

    console.log(`📰 Ticker updated on all 4 sides: ${phase.tickerMessage}`);
  }

  // ========== v3.4: SPEED & DIFFICULTY SCALING SYSTEM ==========

  private applySpeedScaling(): void {
    // v3.4: Increase speed by 3% every 20 seconds, max 2.5x
    this.speedMultiplier = Math.min(this.speedMultiplier * 1.03, 2.5);

    console.log(`⚡ Speed Scaling Applied: ×${this.speedMultiplier.toFixed(2)}`);

    // Apply to coin and enemy speeds
    const phase = MARKET_PHASES[this.currentMarketPhase];
    if (phase) {
      const baseSpeed = 300;
      this.coinSpeed = baseSpeed * phase.speedModifier * this.speedMultiplier;
      this.enemySpeed = 250 * phase.speedModifier * this.speedMultiplier;
    }

    // v3.4: Reduce coin spawn rate by 1% every 20 seconds (min 0.5x)
    this.coinSpawnRateMultiplier = Math.max(this.coinSpawnRateMultiplier * 0.99, 0.5);

    // Update coin spawn timer
    if (this.coinSpawnTimer && phase) {
      this.coinSpawnTimer.remove();
      const baseCoinDelay = 1500;
      const newCoinDelay = (baseCoinDelay / phase.coinSpawnModifier) / this.coinSpawnRateMultiplier;
      this.coinSpawnTimer = this.time.addEvent({
        delay: newCoinDelay,
        callback: this.spawnCoin,
        callbackScope: this,
        loop: true
      });
      console.log(`  - Coin Spawn Rate: ×${this.coinSpawnRateMultiplier.toFixed(2)} (delay: ${newCoinDelay.toFixed(0)}ms)`);
    }
  }

  private applyDifficultyScaling(): void {
    // v3.4: Increase enemy spawn rate by 4% every 15 seconds
    this.enemySpawnRateMultiplier *= 1.04;

    console.log(`💀 Difficulty Scaling Applied: ×${this.enemySpawnRateMultiplier.toFixed(2)}`);

    // Update enemy spawn timer
    const phase = MARKET_PHASES[this.currentMarketPhase];
    const currentPhaseConfig = GameConfig.phases[this.currentPhase - 1];

    if (this.enemySpawnTimer && phase && currentPhaseConfig) {
      this.enemySpawnTimer.remove();
      const baseEnemyDelay = currentPhaseConfig.spawnRate;
      const newEnemyDelay = (baseEnemyDelay / phase.enemySpawnModifier) / this.enemySpawnRateMultiplier;
      this.enemySpawnTimer = this.time.addEvent({
        delay: newEnemyDelay,
        callback: this.spawnEnemy,
        callbackScope: this,
        loop: true
      });
      console.log(`  - Enemy Spawn Rate: ×${this.enemySpawnRateMultiplier.toFixed(2)} (delay: ${newEnemyDelay.toFixed(0)}ms)`);
    }
  }

  // ========== v3.5: MICRO-EVENTS SYSTEM ==========

  private checkMicroEvents(): void {
    // Don't trigger events if one is already active
    if (this.microEventActive) return;

    // Random chance to trigger an event
    const randomRoll = Phaser.Math.Between(0, 100);
    let cumulativeProbability = 0;

    for (const event of MICRO_EVENTS) {
      cumulativeProbability += event.probability;
      if (randomRoll <= cumulativeProbability) {
        this.triggerMicroEvent(event);
        return;
      }
    }
  }

  private triggerMicroEvent(event: MicroEvent): void {
    console.log(`Micro-Event Triggered: ${event.name}`);

    this.microEventActive = true;
    this.activeMicroEvent = event;

    // Show notification
    this.showMicroEventNotification(event);

    // Apply event effect
    this.applyMicroEventEffect(event);

    // End event after duration
    this.microEventEndTimer = this.time.delayedCall(event.duration, () => {
      this.endMicroEvent(event);
    });
  }

  private showMicroEventNotification(event: MicroEvent): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create notification at bottom-center
    const startY = height - 150;
    const targetY = height - 180;

    // Background box - Navy Blue with Gold border (patriotic)
    const bg = this.add.graphics();
    bg.fillStyle(0x002868, 0.9); // Navy blue
    bg.fillRoundedRect(width / 2 - 300, targetY - 35, 600, 70, 12);
    bg.lineStyle(4, 0xFFD700, 1); // Gold border
    bg.strokeRoundedRect(width / 2 - 300, targetY - 35, 600, 70, 12);
    bg.setDepth(9998);
    bg.setAlpha(0);

    this.microEventNotification = this.add.text(
      width / 2,
      targetY,
      event.message,
      {
        fontSize: '32px',
        color: '#FFFFFF', // White text
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    this.microEventNotification.setOrigin(0.5);
    this.microEventNotification.setDepth(9999);
    this.microEventNotification.setAlpha(0);

    // Animate in together
    this.tweens.add({
      targets: [this.microEventNotification, bg],
      alpha: 1,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Fade out after 3 seconds
        this.time.delayedCall(3000, () => {
          this.tweens.add({
            targets: [this.microEventNotification, bg],
            alpha: 0,
            duration: 500,
            onComplete: () => {
              this.microEventNotification?.destroy();
              bg.destroy();
            }
          });
        });
      }
    });
  }

  private applyMicroEventEffect(event: MicroEvent): void {
    switch (event.effect) {
      case 'coinSpawn3x':
        // Triple coin spawn rate
        if (this.coinSpawnTimer) {
          this.coinSpawnTimer.remove();
          const phase = MARKET_PHASES[this.currentMarketPhase];
          const baseCoinDelay = 1500;
          const newDelay = (baseCoinDelay / (phase?.coinSpawnModifier || 1)) / 3;
          this.coinSpawnTimer = this.time.addEvent({
            delay: newDelay,
            callback: this.spawnCoin,
            callbackScope: this,
            loop: true
          });
          console.log(`  - Coin spawn rate ×3 (delay: ${newDelay}ms)`);
        }
        break;

      case 'enemyPause':
        // Pause enemy spawning
        if (this.enemySpawnTimer) {
          this.enemySpawnTimer.paused = true;
          console.log(`  - Enemies paused for ${event.duration}ms`);
        }
        break;

      case 'coinRain':
        // Spawn multiple coins at once
        for (let i = 0; i < 10; i++) {
          this.time.delayedCall(i * 200, () => {
            this.spawnCoin();
          });
        }
        console.log(`  - Coin rain: 10 coins spawning`);
        break;

      case 'xpDouble':
        // XP multiplier handled in mission system (TODO)
        console.log(`  - XP ×2 for ${event.duration}ms`);
        break;

      case 'guaranteedFeather':
        // Spawn gold feather after delay (only if not in cooldown)
        this.time.delayedCall(3000, () => {
          if (!this.valorModeActive && !this.valorModeCooldown) {
            const y = Phaser.Math.Between(100, this.cameras.main.height - 100);
            this.spawnGoldFeather(y);
            console.log(`  - Gold Feather spawned from Micro-Event!`);
          } else {
            console.log(`  - Gold Feather spawn blocked (VALOR MODE active or cooldown)`);
          }
        });
        break;
    }
  }

  private endMicroEvent(event: MicroEvent): void {
    console.log(`🏁 Micro-Event Ended: ${event.name}`);

    // Restore effects
    switch (event.effect) {
      case 'coinSpawn3x':
        // Restore normal coin spawn rate
        if (this.coinSpawnTimer) {
          this.coinSpawnTimer.remove();
          const phase = MARKET_PHASES[this.currentMarketPhase];
          const baseCoinDelay = 1500;
          const newDelay = (baseCoinDelay / (phase?.coinSpawnModifier || 1)) / this.coinSpawnRateMultiplier;
          this.coinSpawnTimer = this.time.addEvent({
            delay: newDelay,
            callback: this.spawnCoin,
            callbackScope: this,
            loop: true
          });
        }
        break;

      case 'enemyPause':
        // Resume enemy spawning
        if (this.enemySpawnTimer) {
          this.enemySpawnTimer.paused = false;
        }
        break;
    }

    // Fade out notification (nach unten)
    if (this.microEventNotification) {
      const height = this.cameras.main.height;
      this.tweens.add({
        targets: this.microEventNotification,
        alpha: 0,
        y: height - 80,
        duration: 300,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          this.microEventNotification?.destroy();
          this.microEventNotification = undefined;
        }
      });
    }

    this.microEventActive = false;
    this.activeMicroEvent = undefined;
  }

  // ========== v3.7: WEAPON SYSTEM HELPERS ==========

  // Removed: deductCoinsForWeapon (no longer needed with energy system)

  private updateWeaponUI(): void {
    if (!this.weaponManager.hasWeapon()) return;

    const energy = this.weaponManager.getEnergy();
    const weaponName = this.weaponManager.getWeaponName();
    const weaponLevel = this.weaponManager.getWeaponLevel();

    // Send to UIScene
    const uiScene = this.scene.get('UIScene') as any;
    if (uiScene && uiScene.updateWeapon) {
      const weaponIcon = '🔫'; // You can change based on weapon type
      const info = `Lv${weaponLevel} | Energy: ${Math.floor(energy)}%`;
      uiScene.updateWeapon(weaponName, weaponIcon, info);
    }
  }

  private createWeaponUI(): void {
    // Weapon UI now handled by UIScene
    // Just send initial data
    this.updateWeaponUI();
  }

  /**
   * v3.8: CRITICAL - Complete cleanup to prevent memory leaks!
   * Called automatically by Phaser when scene shuts down
   */
  shutdown(): void {
    console.log('GameScene shutdown - cleaning up ALL resources');

    // 1. REMOVE ALL EVENT LISTENERS (CRITICAL!)
    this.input.off('pointerdown');
    this.input.keyboard?.off('keydown-SPACE');
    this.input.keyboard?.off('keyup-SPACE');
    this.input.keyboard?.off('keydown-P');
    this.input.keyboard?.off('keydown-ESC');
    this.input.keyboard?.off('keydown-Q');
    this.input.keyboard?.off('keydown-W');
    this.input.keyboard?.off('keydown-E');
    this.input.keyboard?.off('keydown-TAB');
    this.events.off('bossDefeated');

    // 2. STOP ALL TIMERS
    this.coinSpawnTimer?.remove();
    this.enemySpawnTimer?.remove();
    this.gameTimer?.remove();
    this.powerupSpawnTimer?.remove();
    this.taglineTimer?.remove();
    this.phaseTimer?.remove();
    this.magnetTimer?.remove();
    this.shieldTimer?.remove();
    this.burgerMultiplierTimer?.remove();
    this.eatTheDipTimer?.remove();
    this.freedomStrikeTimer?.remove();
    this.belleModTimer?.remove();
    this.controlBlockTimer?.remove();
    this.bullMarketTimer?.remove();
    this.valorStage1Timer?.remove();
    this.valorStage2Timer?.remove();
    this.valorAfterglowTimer?.remove();
    this.valorCooldownTimer?.remove();
    this.weaponRespawnTimer?.remove();
    this.marketPhaseCheckInterval?.remove();
    this.speedScalingInterval?.remove();
    this.difficultyScalingInterval?.remove();
    this.microEventCheckInterval?.remove();
    this.microEventEndTimer?.remove();

    // 3. STOP ALL SOUNDS
    this.sound.stopAll();
    if (this.currentBackgroundMusic) {
      this.currentBackgroundMusic.stop();
      this.currentBackgroundMusic = undefined;
    }
    if (this.shieldLoopSound) {
      this.shieldLoopSound.stop();
      this.shieldLoopSound = undefined;
    }

    // 4. KILL ALL TWEENS (CRITICAL!)
    this.tweens.killAll();

    // 5. DESTROY ALL ARRAYS OF OBJECTS
    this.coins.forEach(coin => coin?.destroy());
    this.coins = [];
    this.enemies.forEach(enemy => enemy?.destroy());
    this.enemies = [];
    this.powerups.forEach(powerup => powerup?.destroy());
    this.powerups = [];
    this.fakeCoins.forEach(fakeCoin => fakeCoin?.destroy());
    this.fakeCoins = [];
    this.lawsuitPapers.forEach(paper => paper?.destroy());
    this.lawsuitPapers = [];
    this.missionUI.forEach(ui => ui?.destroy());
    this.missionUI = [];
    this.activeAnnouncements.forEach(ann => ann?.destroy());
    this.activeAnnouncements = [];

    // 6. CLEANUP OBJECT POOLS
    this.textPool?.destroy();
    this.graphicsPool?.destroy();

    // 7. DESTROY GRAPHICS OBJECTS
    this.shieldGraphics?.destroy();
    this.belleAura?.destroy();
    this.valorScreenGlow?.destroy();
    this.weaponUI?.destroy();
    this.weaponEnergyBar?.destroy();
    this.weaponEnergyBarBg?.destroy();
    this.weaponPickup?.destroy();
    this.tutorialOverlay?.destroy();

    // 8. CLEANUP MANAGERS
    if (this.weaponManager && typeof this.weaponManager.destroy === 'function') {
      this.weaponManager.destroy();
    }
    if (this.bossManager && typeof this.bossManager.cleanup === 'function') {
      this.bossManager.cleanup();
    }
    if (this.bandanaPowerUp && typeof this.bandanaPowerUp.cleanup === 'function') {
      this.bandanaPowerUp.cleanup();
    }

    console.log('GameScene cleanup complete - no memory leaks!');
  }
}
