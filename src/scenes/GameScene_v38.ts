/**
 * GameScene v3.8 - Refactored with Core Systems
 *
 * Reduced from 5000+ lines to <800 lines by delegating to:
 * - EagleController: Player logic
 * - ProjectileManager: Bullets
 * - EnemyManager: Enemy spawning & AI
 * - PowerUpSystem: Power-ups
 * - ScoringSystem: Score & combos
 * - PhaseController: Phases & boss
 * - AudioSystem: SFX & music
 * - UIHooks: UI updates
 */

import Phaser from 'phaser';
import { Eagle } from '../sprites/Eagle';
import { MissionManager } from '../managers/MissionManager';
import { WeaponManagerSimple } from '../managers/WeaponManagerSimple';
import { BossManagerV37 } from '../managers/BossManagerV37';
import { BandanaPowerUp } from '../managers/BandanaPowerUp';
import { getXPSystem, getXPForCoin } from '../systems/xpSystem';
import { getUpgradeSystem } from '../systems/upgradeSystem';

// v3.8: Core Systems
import { EagleController } from '../core/EagleController';
import { ProjectileManager } from '../core/ProjectileManager';
import { EnemyManager } from '../core/EnemyManager';
import { PowerUpSystem } from '../core/PowerUpSystem';
import { ScoringSystem } from '../core/ScoringSystem';
import { PhaseController } from '../core/PhaseController';
import { AudioSystem } from '../core/AudioSystem';
import { UIHooks } from '../core/UIHooks';

export class GameScene extends Phaser.Scene {
  // ========== CORE SYSTEMS v3.8 ==========
  private eagleController!: EagleController;
  private projectileManager!: ProjectileManager;
  private enemyManager!: EnemyManager;
  private powerUpSystem!: PowerUpSystem;
  private scoringSystem!: ScoringSystem;
  private phaseController!: PhaseController;
  private audioSystem!: AudioSystem;
  private uiHooks!: UIHooks;

  // ========== LEGACY SYSTEMS (Keep for now) ==========
  private xpSystem = getXPSystem();
  private upgradeSystem = getUpgradeSystem();
  private missionManager!: MissionManager;
  private weaponManager!: WeaponManagerSimple;
  private bossManager!: BossManagerV37;
  private bandanaPowerUp!: BandanaPowerUp;

  // ========== GAME STATE ==========
  private eagle!: Eagle;
  private gameTime: number = 0;
  private isGameOver: boolean = false;
  private isPaused: boolean = false;
  private hasStarted: boolean = false;

  // Coin inventory
  private bonkCount: number = 0;
  private aolCount: number = 0;
  private burgerCount: number = 0;

  // Coin sprites (for collection)
  private coins: Phaser.GameObjects.Container[] = [];
  private coinSpawnTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'GameScene' });
  }

  // ========== LIFECYCLE ==========

  create(): void {
    console.log('🎮 GameScene v3.8 - Starting...');

    // Initialize core systems
    this.initCoreSystems();

    // Initialize legacy systems
    this.initLegacySystems();

    // Create player
    this.createPlayer();

    // Setup world
    this.setupWorld();

    // Start game loops
    this.startGameLoops();

    // Launch UI
    this.launchUI();

    console.log('✅ GameScene v3.8 - Ready');
  }

  update(time: number, delta: number): void {
    if (this.isPaused || this.isGameOver) return;

    const dt = delta;

    // Update core systems
    this.eagleController.update(dt);
    this.projectileManager.update(dt);
    this.enemyManager.update(dt);
    this.powerUpSystem.update(dt);
    this.scoringSystem.update(dt);
    this.phaseController.update(dt, this.scoringSystem.getScore(), this.gameTime);

    // Update legacy systems
    this.weaponManager.update(dt);
    this.bossManager.update(dt);

    // Update game time
    this.gameTime += dt / 1000;

    // Update UI
    this.updateUI();

    // Check collisions
    this.checkCollisions();
  }

  // ========== INITIALIZATION ==========

  private initCoreSystems(): void {
    // Create systems
    this.eagleController = new EagleController(this);
    this.projectileManager = new ProjectileManager(this);
    this.enemyManager = new EnemyManager(this);
    this.powerUpSystem = new PowerUpSystem(this);
    this.scoringSystem = new ScoringSystem(this);
    this.phaseController = new PhaseController(this);
    this.audioSystem = new AudioSystem(this);
    this.uiHooks = new UIHooks(this);

    // Initialize
    this.eagleController.init(3); // 3 lives
    this.projectileManager.init();
    this.enemyManager.init(1); // Start at phase 1
    this.powerUpSystem.init();
    this.scoringSystem.init();
    this.phaseController.init(1);
    this.audioSystem.init();
    this.uiHooks.init();

    // Setup callbacks
    this.setupCoreCallbacks();

    console.log('✅ Core systems initialized');
  }

  private initLegacySystems(): void {
    // Mission Manager
    this.missionManager = MissionManager.getInstance();
    this.missionManager.refreshMissions();

    // Weapon Manager
    this.weaponManager = new WeaponManagerSimple(this);

    // Boss Manager
    this.bossManager = new BossManagerV37(this);

    // Bandana Power-up
    this.bandanaPowerUp = new BandanaPowerUp(this);

    console.log('✅ Legacy systems initialized');
  }

  private setupCoreCallbacks(): void {
    // Eagle callbacks
    this.eagleController.onDamage(() => {
      this.audioSystem.playDamage();
      this.uiHooks.updateLives(this.eagleController.getLives());
    });

    this.eagleController.onDeath(() => {
      this.gameOver();
    });

    // Enemy callbacks
    this.enemyManager.onEnemyDeath((enemy, x, y) => {
      this.handleEnemyDeath(enemy, x, y);
    });

    // Power-up callbacks
    this.powerUpSystem.onPowerUpCollected((type, duration) => {
      this.handlePowerUpCollected(type, duration);
    });

    this.powerUpSystem.onEffectExpired((type) => {
      this.handlePowerUpExpired(type);
    });

    // Phase callbacks
    this.phaseController.onPhaseChange((phase) => {
      console.log(`🎮 Phase ${phase.number}: ${phase.name}`);
      this.enemyManager.setPhase(phase.number);
      this.uiHooks.updatePhase(phase.number, phase.name);
    });

    this.phaseController.onBossTrigger((boss) => {
      console.log(`👹 Boss: ${boss.name}`);
      this.uiHooks.showBossWarning(boss.name, boss.title);
      this.audioSystem.playSFX('sfx-boss-warning');
    });

    // Scoring callbacks
    this.scoringSystem.onScoreChange((score) => {
      this.uiHooks.updateScore(score);
    });

    this.scoringSystem.onComboChange((kills, multiplier, timer) => {
      this.uiHooks.updateCombo(kills, multiplier, timer);
    });
  }

  private createPlayer(): void {
    // Create Eagle sprite
    this.eagle = new Eagle(this, 200, this.cameras.main.height / 2);
    this.add.existing(this.eagle);

    // Get speed bonus from upgrades
    const speedBonus = this.upgradeSystem.getSpeedBonus();

    // Initialize controller with eagle
    this.eagleController.setEagle(this.eagle, speedBonus);

    console.log('✅ Player created');
  }

  private setupWorld(): void {
    // Background
    this.cameras.main.setBackgroundColor('#87CEEB');

    // World bounds
    this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height);

    console.log('✅ World setup complete');
  }

  private startGameLoops(): void {
    // Coin spawning
    this.coinSpawnTimer = this.time.addEvent({
      delay: 2000,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    // Start background music
    this.audioSystem.playMusic('music-game', true);

    this.hasStarted = true;

    console.log('✅ Game loops started');
  }

  private launchUI(): void {
    // Launch or wake UIScene
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

    // Refresh missions based on current Meta-Level
    this.missionManager.refreshMissions();

    console.log('✅ UI launched');
  }

  // ========== GAME LOGIC ==========

  private spawnCoin(): void {
    const x = this.cameras.main.scrollX + this.cameras.main.width + 50;
    const y = Phaser.Math.Between(100, this.cameras.main.height - 100);

    // Random coin type
    const types = ['BONK', 'AOL', 'BURGER'];
    const type = Phaser.Math.RND.pick(types);

    // Create coin container
    const coinContainer = this.add.container(x, y);

    // Create coin sprite
    const coinSprite = this.add.sprite(0, 0, `coin-${type.toLowerCase()}`);
    coinSprite.setScale(0.8);
    coinContainer.add(coinSprite);

    // Add physics
    this.physics.add.existing(coinContainer);
    const body = coinContainer.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(-300);

    // Store type in data
    (coinContainer as any).coinType = type;

    // Add to coins array
    this.coins.push(coinContainer);

    // Auto-remove if out of bounds
    this.time.delayedCall(5000, () => {
      if (this.coins.includes(coinContainer)) {
        coinContainer.destroy();
        const index = this.coins.indexOf(coinContainer);
        if (index > -1) this.coins.splice(index, 1);
      }
    });
  }

  private handleEnemyDeath(enemy: any, x: number, y: number): void {
    // Award score
    this.scoringSystem.addEnemyScore(enemy.enemyId, x, y, false);

    // Drop coins
    this.dropCoinsFromEnemy(enemy, x, y);

    // Audio
    this.audioSystem.playEnemyDeath();

    // XP
    const xp = 10;
    this.xpSystem.addXP(xp);

    // Mission progress
    this.missionManager.recordKill(enemy.enemyId);
  }

  private dropCoinsFromEnemy(enemy: any, x: number, y: number): void {
    // Simple coin drop (can be expanded with enemy.drops config)
    const coinType = Phaser.Math.RND.pick(['BONK', 'AOL']);
    const count = Phaser.Math.Between(1, 3);

    for (let i = 0; i < count; i++) {
      const offsetX = Phaser.Math.Between(-30, 30);
      const offsetY = Phaser.Math.Between(-30, 30);

      const coinContainer = this.add.container(x + offsetX, y + offsetY);
      const coinSprite = this.add.sprite(0, 0, `coin-${coinType.toLowerCase()}`);
      coinSprite.setScale(0.6);
      coinContainer.add(coinSprite);

      this.physics.add.existing(coinContainer);
      const body = coinContainer.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));

      (coinContainer as any).coinType = coinType;
      this.coins.push(coinContainer);

      // Auto-remove
      this.time.delayedCall(3000, () => {
        if (this.coins.includes(coinContainer)) {
          coinContainer.destroy();
          const index = this.coins.indexOf(coinContainer);
          if (index > -1) this.coins.splice(index, 1);
        }
      });
    }
  }

  private handlePowerUpCollected(type: string, duration: number): void {
    console.log(`⚡ Power-up collected: ${type}`);

    // Apply effect to eagle controller
    switch (type) {
      case 'shield':
        this.eagleController.setShield(true);
        this.uiHooks.updateShield(true);
        break;
      case 'speed':
        this.eagleController.setSpeedBoost(1.5);
        break;
      case 'invincibility':
        this.eagleController.setInvincibility(duration);
        break;
      case 'damage':
        // Store damage boost for projectiles
        break;
    }

    // Audio
    this.audioSystem.playPowerUpCollect();

    // UI
    this.uiHooks.updatePowerUp(type, duration);
  }

  private handlePowerUpExpired(type: string): void {
    console.log(`⏱️ Power-up expired: ${type}`);

    // Remove effect
    switch (type) {
      case 'shield':
        this.eagleController.setShield(false);
        this.uiHooks.updateShield(false);
        break;
      case 'speed':
        this.eagleController.setSpeedBoost(1.0);
        break;
    }

    // UI
    this.uiHooks.removePowerUp(type);
  }

  // ========== COLLISIONS ==========

  private checkCollisions(): void {
    // Eagle vs Coins
    this.coins.forEach(coin => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(
        this.eagle.getBounds(),
        coin.getBounds()
      )) {
        this.collectCoin(coin);
      }
    });

    // Eagle vs Power-ups
    this.powerUpSystem.getPowerUps().forEach(powerUp => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(
        this.eagle.getBounds(),
        powerUp.sprite.getBounds()
      )) {
        this.powerUpSystem.collectPowerUp(powerUp);
      }
    });

    // Projectiles vs Enemies
    const projectiles = this.projectileManager.getProjectiles();
    const enemies = this.enemyManager.getEnemies();

    projectiles.forEach(proj => {
      enemies.forEach(enemy => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(
          proj.sprite.getBounds(),
          enemy.sprite.getBounds()
        )) {
          // Hit enemy
          const killed = this.enemyManager.damageEnemy(enemy, proj.damage);
          this.audioSystem.playEnemyHit();

          // Remove projectile (unless pierce)
          if (!proj.pierce || proj.pierceCount >= (proj.pierce || 0)) {
            this.projectileManager.removeProjectile(proj);
          } else {
            proj.pierceCount++;
          }
        }
      });
    });

    // Eagle vs Enemies
    enemies.forEach(enemy => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(
        this.eagle.getBounds(),
        enemy.sprite.getBounds()
      )) {
        this.eagleController.takeDamage();
        this.enemyManager.damageEnemy(enemy, 999); // Kill enemy on contact
      }
    });
  }

  private collectCoin(coinContainer: Phaser.GameObjects.Container): void {
    const coinType = (coinContainer as any).coinType;

    // Add to inventory
    switch (coinType) {
      case 'BONK':
        this.bonkCount++;
        break;
      case 'AOL':
        this.aolCount++;
        break;
      case 'BURGER':
        this.burgerCount++;
        break;
    }

    // Audio
    this.audioSystem.playCoinCollect(coinType);

    // XP
    const xp = getXPForCoin(coinType);
    this.xpSystem.addXP(xp);

    // Score
    this.scoringSystem.addCoinScore(coinType);

    // UI
    this.uiHooks.updateCoins(this.bonkCount, this.aolCount, this.burgerCount);

    // Mission progress
    this.missionManager.recordCoinCollected(coinType);

    // Remove coin
    coinContainer.destroy();
    const index = this.coins.indexOf(coinContainer);
    if (index > -1) this.coins.splice(index, 1);
  }

  // ========== UI UPDATE ==========

  private updateUI(): void {
    // Update power-up timers
    const activeEffects = this.powerUpSystem.getActiveEffects();
    activeEffects.forEach(effect => {
      this.uiHooks.updatePowerUp(effect.type, effect.timeRemaining);
    });
  }

  // ========== WEAPON FIRING ==========

  public fireWeapon(weaponId: string, direction: string): void {
    // Get damage bonus from upgrades
    const damageBonus = this.upgradeSystem.getDamageBonus();

    // Fire projectile
    this.projectileManager.fire(
      weaponId,
      this.eagle.x,
      this.eagle.y,
      direction,
      damageBonus
    );

    // Audio
    this.audioSystem.playWeaponFire(weaponId);
  }

  // ========== GAME OVER ==========

  private gameOver(): void {
    this.isGameOver = true;

    console.log('💀 Game Over');

    // Stop music
    this.audioSystem.stopMusic(true);

    // Save stats
    this.saveGameStats();

    // Transition to GameOver scene
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', {
        score: this.scoringSystem.getScore(),
        time: this.gameTime,
        kills: this.scoringSystem.getTotalKills()
      });
    });
  }

  private saveGameStats(): void {
    // Save to localStorage
    const stats = {
      score: this.scoringSystem.getScore(),
      time: this.gameTime,
      kills: this.scoringSystem.getTotalKills(),
      bonk: this.bonkCount,
      aol: this.aolCount,
      burger: this.burgerCount,
      timestamp: Date.now()
    };

    localStorage.setItem('lastGameStats', JSON.stringify(stats));
  }

  // ========== CLEANUP ==========

  shutdown(): void {
    // Cleanup core systems
    this.eagleController?.destroy();
    this.projectileManager?.destroy();
    this.enemyManager?.destroy();
    this.powerUpSystem?.destroy();
    this.scoringSystem?.destroy();
    this.phaseController?.destroy();
    this.audioSystem?.destroy();
    this.uiHooks?.destroy();

    // Cleanup coins
    this.coins.forEach(c => c.destroy());
    this.coins = [];

    // Stop timers
    this.coinSpawnTimer?.destroy();

    console.log('🧹 GameScene cleanup complete');
  }
}
