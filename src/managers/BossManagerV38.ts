// ============================
// Eagle of Fun v3.8 - Boss Combat System
// Config-driven boss system using Bosses.ts
// ============================

import Phaser from 'phaser';
import { BossDef, BossPhase, shouldSpawnBoss, getAttackPattern } from '../config/Bosses';

export class BossManagerV38 {
  private scene: Phaser.Scene;
  private boss: Phaser.GameObjects.Container | null = null;
  private bossSprite: Phaser.GameObjects.Graphics | null = null;
  private bossActive: boolean = false;
  private bossDefeated: boolean = false;

  // Boss state
  private bossDef: BossDef | null = null;
  private bossHP: number = 0;
  private maxBossHP: number = 0;
  private currentPhase: BossPhase | null = null;
  private currentPhaseIndex: number = 0;

  // Attack timing
  private lastAttackTime: number = 0;
  private attackCooldown: number = 0;

  // UI Elements
  private healthBar: Phaser.GameObjects.Graphics | null = null;
  private healthBarBg: Phaser.GameObjects.Graphics | null = null;
  private bossNameText: Phaser.GameObjects.Text | null = null;
  private phaseText: Phaser.GameObjects.Text | null = null;
  private hpText: Phaser.GameObjects.Text | null = null;

  // Attack projectiles
  private projectiles: Phaser.GameObjects.Container[] = [];

  // Add spawning
  private lastAddSpawnTime: number = 0;
  private addSpawnInterval: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Check if boss should spawn and spawn if conditions met
   */
  public checkAndSpawn(score: number, phase: number, timeElapsed: number): boolean {
    if (this.bossActive || this.bossDefeated) return false;

    const bossDef = shouldSpawnBoss(score, phase, timeElapsed);
    if (bossDef) {
      this.spawnBoss(bossDef);
      return true;
    }
    return false;
  }

  /**
   * Spawn boss with warning screen
   */
  private spawnBoss(bossDef: BossDef): void {
    console.log(`🐻 Boss spawning: ${bossDef.name} - ${bossDef.title}`);

    this.bossDef = bossDef;
    this.bossHP = bossDef.hp;
    this.maxBossHP = bossDef.hp;
    this.currentPhaseIndex = 0;
    this.currentPhase = bossDef.phases[0];

    // Show warning screen
    this.showBossWarning();

    // Create boss after warning
    this.scene.time.delayedCall(2000, () => {
      this.createBoss();
    });
  }

  /**
   * Show boss warning screen
   */
  private showBossWarning(): void {
    if (!this.bossDef || !this.currentPhase) return;

    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Dark overlay
    const overlay = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.8
    );
    overlay.setDepth(9990);

    // Warning text
    const warningText = this.scene.add.text(
      width / 2,
      height / 2,
      this.currentPhase.announcement,
      {
        fontSize: '56px',
        color: `#${this.currentPhase.color.toString(16).padStart(6, '0')}`,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 8
      }
    ).setOrigin(0.5);
    warningText.setDepth(9991);

    // Flash effect
    this.scene.tweens.add({
      targets: [warningText],
      alpha: 0.5,
      duration: 300,
      yoyo: true,
      repeat: 5
    });

    // Screen shake
    this.scene.cameras.main.shake(2000, 0.005);

    // Remove after 2 seconds
    this.scene.time.delayedCall(2000, () => {
      overlay.destroy();
      warningText.destroy();
    });

    // Play warning sound
    if (this.scene.sound.get('lightning-strike-386161')) {
      this.scene.sound.play('lightning-strike-386161', { volume: 0.7 });
    }
  }

  /**
   * Create boss sprite and initialize
   */
  private createBoss(): void {
    if (!this.bossDef) return;

    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Create boss container at right side of screen
    this.boss = this.scene.add.container(width - 200, height / 2);

    // v3.8: Create emoji sprite for boss (can be replaced with pixel art later)
    this.bossSprite = this.scene.add.graphics();
    this.bossSprite.fillStyle(0x8B4513, 1); // Brown for bear
    this.bossSprite.fillCircle(0, 0, 80); // Large circle
    this.bossSprite.fillStyle(0xFFFFFF, 1);
    this.bossSprite.fillCircle(-25, -20, 15); // Left eye
    this.bossSprite.fillCircle(25, -20, 15); // Right eye
    this.bossSprite.fillStyle(0x000000, 1);
    this.bossSprite.fillCircle(-25, -20, 8); // Left pupil
    this.bossSprite.fillCircle(25, -20, 8); // Right pupil
    this.bossSprite.fillCircle(0, 10, 12); // Nose
    this.bossSprite.lineStyle(4, 0x000000, 1);
    this.bossSprite.strokeCircle(0, 0, 80); // Outline

    this.boss.add(this.bossSprite);
    this.boss.setSize(160, 160);
    this.boss.setDepth(1000);
    this.boss.setData('type', 'boss');
    this.boss.setData('bossId', this.bossDef.id);

    this.bossActive = true;

    // Create health bar
    this.createHealthBar();

    // Start first phase
    this.startPhase(0);

    // Play boss music if available
    if (this.bossDef.musicTrack && this.scene.sound.get(this.bossDef.musicTrack)) {
      this.scene.sound.play(this.bossDef.musicTrack, { volume: 0.5, loop: true });
    }
  }

  /**
   * Create health bar UI
   */
  private createHealthBar(): void {
    if (!this.bossDef) return;

    const width = this.scene.cameras.main.width;

    // Background bar
    this.healthBarBg = this.scene.add.graphics();
    this.healthBarBg.fillStyle(0x333333, 1);
    this.healthBarBg.fillRect(width / 2 - 400, 50, 800, 40);
    this.healthBarBg.lineStyle(3, 0x000000, 1);
    this.healthBarBg.strokeRect(width / 2 - 400, 50, 800, 40);
    this.healthBarBg.setDepth(9000);

    // Health bar
    this.healthBar = this.scene.add.graphics();
    this.healthBar.setDepth(9001);

    // Boss name
    this.bossNameText = this.scene.add.text(
      width / 2,
      25,
      `🐻 ${this.bossDef.name} - ${this.bossDef.title}`,
      {
        fontSize: '36px',
        color: '#FF0000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5);
    this.bossNameText.setDepth(9002);

    // Phase text
    this.phaseText = this.scene.add.text(width / 2, 100, '', {
      fontSize: '28px',
      color: '#FFAA00',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.phaseText.setDepth(9002);

    // HP text
    this.hpText = this.scene.add.text(width / 2, 65, '', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    this.hpText.setDepth(9002);

    this.updateHealthBar();
  }

  /**
   * Update health bar display
   */
  private updateHealthBar(): void {
    if (!this.healthBar || !this.bossDef) return;

    const width = this.scene.cameras.main.width;
    const barWidth = 800;
    const barHeight = 40;
    const hpPercent = this.bossHP / this.maxBossHP;

    // Color based on HP
    let color = 0x00FF00; // Green
    if (hpPercent < 0.66) color = 0xFFAA00; // Orange
    if (hpPercent < 0.33) color = 0xFF0000; // Red

    this.healthBar.clear();
    this.healthBar.fillStyle(color, 1);
    this.healthBar.fillRect(width / 2 - 400, 50, barWidth * hpPercent, barHeight);

    // Update HP text
    if (this.hpText) {
      this.hpText.setText(`${Math.ceil(this.bossHP)} / ${this.maxBossHP}`);
    }
  }

  /**
   * Start a new boss phase
   */
  private startPhase(phaseIndex: number): void {
    if (!this.bossDef || phaseIndex >= this.bossDef.phases.length) return;

    this.currentPhaseIndex = phaseIndex;
    this.currentPhase = this.bossDef.phases[phaseIndex];

    console.log(`🐻 Boss Phase ${phaseIndex + 1}: ${this.currentPhase.name}`);

    // Update phase text
    if (this.phaseText) {
      this.phaseText.setText(`Phase ${phaseIndex + 1}: ${this.currentPhase.name}`);
      this.phaseText.setColor(`#${this.currentPhase.color.toString(16).padStart(6, '0')}`);

      // Flash effect
      this.scene.tweens.add({
        targets: this.phaseText,
        scale: 1.3,
        duration: 300,
        yoyo: true,
        repeat: 2
      });
    }

    // Screen effects
    this.scene.cameras.main.flash(500,
      (this.currentPhase.color >> 16) & 0xFF,
      (this.currentPhase.color >> 8) & 0xFF,
      this.currentPhase.color & 0xFF
    );

    // Reset attack timing
    const attackPattern = getAttackPattern(this.currentPhase.attackPattern);
    if (attackPattern) {
      this.attackCooldown = attackPattern.cooldown * 1000;
    }
    this.lastAttackTime = Date.now();

    // Setup add wave spawning
    if (this.currentPhase.addWaves) {
      this.addSpawnInterval = this.currentPhase.addWaves.interval * 1000;
      this.lastAddSpawnTime = Date.now();
    }

    // Visual changes for phase 3
    if (phaseIndex === 2 && this.bossSprite) {
      // Turn boss red for rage mode
      this.scene.tweens.add({
        targets: this.boss,
        scale: 1.2,
        duration: 500,
        yoyo: true
      });
      this.scene.cameras.main.shake(1000, 0.008);
    }
  }

  /**
   * Boss takes damage
   */
  public takeDamage(damage: number, hitPosition: { x: number; y: number }): boolean {
    if (!this.bossActive || !this.boss || !this.bossDef) return false;

    // v3.8: Check for weakpoint damage
    let finalDamage = damage;
    if (this.bossDef.weakpoints) {
      for (const weakpoint of this.bossDef.weakpoints) {
        if (weakpoint.location === 'back') {
          // Check if hit from behind (left side of boss)
          if (hitPosition.x < this.boss.x - 40) {
            finalDamage *= weakpoint.damageMultiplier;
            console.log(`💥 WEAKPOINT HIT! ${weakpoint.damageMultiplier}x damage!`);

            // Show weakpoint indicator
            const weakpointText = this.scene.add.text(hitPosition.x, hitPosition.y, 'WEAKPOINT!', {
              fontSize: '32px',
              color: '#FF0000',
              fontFamily: 'Arial',
              fontStyle: 'bold'
            }).setOrigin(0.5);
            weakpointText.setDepth(2000);

            this.scene.tweens.add({
              targets: weakpointText,
              y: hitPosition.y - 50,
              alpha: 0,
              duration: 1000,
              onComplete: () => weakpointText.destroy()
            });
          }
        }
      }
    }

    this.bossHP -= finalDamage;
    console.log(`🐻 Boss took ${finalDamage.toFixed(1)} damage! HP: ${Math.ceil(this.bossHP)}/${this.maxBossHP}`);

    // Flash effect
    if (this.bossSprite) {
      this.scene.tweens.add({
        targets: this.boss,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 2
      });
    }

    // Update health bar
    this.updateHealthBar();

    // Check phase transitions
    if (this.currentPhase) {
      const hpPercent = this.bossHP / this.maxBossHP;
      const nextPhaseIndex = this.currentPhaseIndex + 1;

      if (nextPhaseIndex < this.bossDef.phases.length) {
        const nextPhase = this.bossDef.phases[nextPhaseIndex];
        if (hpPercent <= nextPhase.hpThreshold) {
          this.startPhase(nextPhaseIndex);
        }
      }
    }

    // Check if defeated
    if (this.bossHP <= 0) {
      this.defeatBoss();
      return true;
    }

    // Play hit sound
    this.scene.sound.play('explosion', { volume: 0.6 });

    return false;
  }

  /**
   * Update boss AI and attacks
   */
  public update(delta: number): void {
    if (!this.bossActive || !this.boss || !this.currentPhase || !this.bossDef) return;

    const now = Date.now();

    // Boss movement
    this.updateBossMovement(delta);

    // Boss attacks
    if (now - this.lastAttackTime > this.attackCooldown) {
      this.performAttack();
      this.lastAttackTime = now;
    }

    // Add wave spawning
    if (this.currentPhase.addWaves && now - this.lastAddSpawnTime > this.addSpawnInterval) {
      this.spawnAddWave();
      this.lastAddSpawnTime = now;
    }

    // Update projectiles
    this.updateProjectiles(delta);
  }

  /**
   * Update boss movement based on phase
   */
  private updateBossMovement(delta: number): void {
    if (!this.boss || !this.currentPhase || !this.bossDef) return;

    const height = this.scene.cameras.main.height;
    const width = this.scene.cameras.main.width;
    const speed = this.bossDef.speed * (delta / 1000);

    switch (this.currentPhase.movePattern) {
      case 'slow_horizontal':
        // Slow sine wave movement
        this.boss.y += Math.sin(Date.now() / 1000) * 3;
        break;

      case 'aggressive_weave':
        // Track player Y position
        const gameScene = this.scene as any;
        if (gameScene.eagle) {
          const targetY = gameScene.eagle.y;
          if (this.boss.y < targetY - 30) {
            this.boss.y += speed * 0.8;
          } else if (this.boss.y > targetY + 30) {
            this.boss.y -= speed * 0.8;
          }
        }
        // Slight horizontal movement
        this.boss.x += Math.sin(Date.now() / 500) * 2;
        break;

      case 'fast_charge':
        // Erratic fast movement
        if (Math.random() < 0.03) {
          const randomY = Phaser.Math.Between(200, height - 200);
          this.scene.tweens.add({
            targets: this.boss,
            y: randomY,
            duration: 600,
            ease: 'Cubic.easeOut'
          });
        }
        break;
    }

    // Keep boss in bounds
    if (this.boss.y < 200) this.boss.y = 200;
    if (this.boss.y > height - 200) this.boss.y = height - 200;
    if (this.boss.x < width - 300) this.boss.x = width - 300;
    if (this.boss.x > width - 100) this.boss.x = width - 100;
  }

  /**
   * Perform attack based on current phase
   */
  private performAttack(): void {
    if (!this.currentPhase || !this.boss) return;

    console.log(`🐻 Boss attack: ${this.currentPhase.attackPattern}`);

    switch (this.currentPhase.attackPattern) {
      case 'shield_rotation':
        // Phase 1: Gary lawsuit papers (reuse existing system)
        this.fireShieldRotation();
        break;

      case 'sniper_barrage':
        // Phase 2: Aimed laser shots
        this.fireSniperBarrage();
        break;

      case 'laser_sweep':
        // Phase 3: Sweeping laser attack
        this.fireLaserSweep();
        break;
    }
  }

  /**
   * Phase 1 Attack: Shield rotation with lawsuit papers
   */
  private fireShieldRotation(): void {
    if (!this.boss) return;

    // Fire 3 lawsuit papers in spread pattern
    for (let i = 0; i < 3; i++) {
      const angle = -30 + (i * 30); // -30°, 0°, +30°
      const angleRad = Phaser.Math.DegToRad(angle);

      const paper = this.scene.add.container(this.boss.x - 50, this.boss.y);

      const graphic = this.scene.add.graphics();
      graphic.fillStyle(0xFFFFFF, 1);
      graphic.fillRect(-15, -20, 30, 40);
      graphic.lineStyle(2, 0x000000, 1);
      graphic.strokeRect(-15, -20, 30, 40);
      graphic.fillStyle(0x000000, 1);
      graphic.fillCircle(0, -10, 3);
      graphic.fillCircle(0, 0, 3);
      graphic.fillCircle(0, 10, 3);

      paper.add(graphic);
      paper.setDepth(999);
      paper.setData('type', 'bossProjectile');
      paper.setData('damage', 1);

      (paper as any).velocityX = Math.cos(angleRad) * -350;
      (paper as any).velocityY = Math.sin(angleRad) * 350;

      this.projectiles.push(paper);
    }
  }

  /**
   * Phase 2 Attack: Sniper barrage (aimed shots)
   */
  private fireSniperBarrage(): void {
    if (!this.boss) return;

    const gameScene = this.scene as any;
    if (!gameScene.eagle) return;

    // Fire 3 aimed laser shots with slight delay
    for (let i = 0; i < 3; i++) {
      this.scene.time.delayedCall(i * 300, () => {
        if (!this.boss || !gameScene.eagle) return;

        const laser = this.scene.add.container(this.boss.x - 50, this.boss.y);

        const graphic = this.scene.add.graphics();
        graphic.fillStyle(0xFF0000, 1);
        graphic.fillRect(-20, -4, 40, 8);
        graphic.lineStyle(2, 0xFF6666, 1);
        graphic.strokeRect(-20, -4, 40, 8);

        laser.add(graphic);
        laser.setDepth(999);
        laser.setData('type', 'bossProjectile');
        laser.setData('damage', 1);

        const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, gameScene.eagle.x, gameScene.eagle.y);
        laser.setRotation(angle);

        (laser as any).velocityX = Math.cos(angle) * 450;
        (laser as any).velocityY = Math.sin(angle) * 450;

        this.projectiles.push(laser);

        // Play laser sound
        this.scene.sound.play('blastershot', { volume: 0.4, rate: 0.7 });
      });
    }
  }

  /**
   * Phase 3 Attack: Laser sweep across screen
   */
  private fireLaserSweep(): void {
    if (!this.boss) return;

    const height = this.scene.cameras.main.height;

    // Create sweeping laser wall
    const laser = this.scene.add.graphics();
    laser.fillStyle(0xFF0000, 0.8);
    laser.fillRect(0, 0, 40, height);
    laser.setDepth(999);
    laser.setPosition(this.boss.x, 0);
    laser.setData('type', 'bossLaser');

    // Sweep across screen
    this.scene.tweens.add({
      targets: laser,
      x: -100,
      duration: 2500,
      ease: 'Linear',
      onComplete: () => laser.destroy()
    });

    // Screen shake
    this.scene.cameras.main.shake(2000, 0.005);

    // Play roar sound
    if (this.scene.sound.get('ground-impact-352053')) {
      this.scene.sound.play('ground-impact-352053', { volume: 0.6 });
    }

    // Check collision with laser in GameScene
    const gameScene = this.scene as any;
    if (gameScene.eagle) {
      const checkInterval = this.scene.time.addEvent({
        delay: 100,
        callback: () => {
          if (laser.active && gameScene.eagle) {
            const laserBounds = new Phaser.Geom.Rectangle(laser.x, 0, 40, height);
            const eagleBounds = new Phaser.Geom.Rectangle(
              gameScene.eagle.x - 40,
              gameScene.eagle.y - 40,
              80,
              80
            );

            if (Phaser.Geom.Intersects.RectangleToRectangle(laserBounds, eagleBounds)) {
              if (gameScene.takeDamage) {
                gameScene.takeDamage();
              }
              checkInterval.remove();
            }
          }
        },
        loop: true
      });

      this.scene.time.delayedCall(2500, () => checkInterval.remove());
    }
  }

  /**
   * Spawn add wave (Gary or Dronelings)
   */
  private spawnAddWave(): void {
    if (!this.currentPhase || !this.currentPhase.addWaves) return;

    console.log(`🐻 Boss spawning adds: ${this.currentPhase.addWaves.count}x ${this.currentPhase.addWaves.enemyType}`);

    const gameScene = this.scene as any;
    if (gameScene.spawnSpecificEnemy) {
      for (let i = 0; i < this.currentPhase.addWaves.count; i++) {
        this.scene.time.delayedCall(i * 200, () => {
          if (gameScene.spawnSpecificEnemy) {
            gameScene.spawnSpecificEnemy(this.currentPhase!.addWaves!.enemyType);
          }
        });
      }
    }
  }

  /**
   * Update projectiles
   */
  private updateProjectiles(delta: number): void {
    const deltaSeconds = delta / 1000;
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    this.projectiles = this.projectiles.filter(proj => {
      if (!proj.active) return false;

      proj.x += (proj as any).velocityX * deltaSeconds;
      proj.y += (proj as any).velocityY * deltaSeconds;

      // Rotate papers
      if (proj.getData('type') === 'bossProjectile') {
        proj.angle += 150 * deltaSeconds;
      }

      // Remove if off screen
      if (proj.x < -100 || proj.x > width + 100 || proj.y < -100 || proj.y > height + 100) {
        proj.destroy();
        return false;
      }

      return true;
    });
  }

  /**
   * Boss defeated - victory sequence
   */
  private defeatBoss(): void {
    if (!this.boss || !this.bossDef) return;

    console.log('🎉 BOSS DEFEATED!');

    // Stop boss music
    if (this.bossDef.musicTrack) {
      this.scene.sound.stopByKey(this.bossDef.musicTrack);
    }

    // Victory animation
    this.scene.tweens.add({
      targets: this.boss,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      angle: 360,
      duration: 2000,
      onComplete: () => {
        if (this.boss) {
          this.boss.destroy();
          this.boss = null;
        }
      }
    });

    // Explosion effects
    for (let i = 0; i < 15; i++) {
      this.scene.time.delayedCall(i * 100, () => {
        if (this.boss && this.boss.active) {
          const explosion = this.scene.add.graphics();
          explosion.fillStyle(0xFF6600, 0.8);
          explosion.fillCircle(
            this.boss.x + Phaser.Math.Between(-80, 80),
            this.boss.y + Phaser.Math.Between(-80, 80),
            Phaser.Math.Between(40, 80)
          );
          explosion.setDepth(1001);

          this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 600,
            onComplete: () => explosion.destroy()
          });
        }
      });
    }

    // Play victory sound
    if (this.scene.sound.get('bosswin')) {
      this.scene.sound.play('bosswin', { volume: 0.8 });
    }

    // Show victory screen
    this.scene.time.delayedCall(1000, () => {
      this.showVictoryScreen();
    });

    // Clean up UI
    this.scene.time.delayedCall(3000, () => {
      this.cleanupBossUI();
    });

    this.bossActive = false;
    this.bossDefeated = true;

    // Emit event for GameScene to handle rewards
    this.scene.events.emit('bossDefeated', this.bossDef);
  }

  /**
   * Show victory screen with rewards
   */
  private showVictoryScreen(): void {
    if (!this.bossDef) return;

    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Victory overlay
    const overlay = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.6
    );
    overlay.setDepth(9995);

    // Victory text
    const victoryText = this.scene.add.text(
      width / 2,
      height / 2 - 100,
      `🎉 BOSS DEFEATED! 🎉\n\n${this.bossDef.title} has been slain!`,
      {
        fontSize: '48px',
        color: '#00FF00',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 6
      }
    ).setOrigin(0.5);
    victoryText.setDepth(9996);

    // Rewards text
    const rewards = this.bossDef.rewards;
    const rewardsText = this.scene.add.text(
      width / 2,
      height / 2 + 50,
      `+${rewards.xp} XP\n${rewards.guaranteedDrops.join(', ')}${rewards.cosmetics ? '\n' + rewards.cosmetics.join(', ') : ''}`,
      {
        fontSize: '32px',
        color: '#FFD700',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center'
      }
    ).setOrigin(0.5);
    rewardsText.setDepth(9996);

    // Animate
    this.scene.tweens.add({
      targets: [victoryText, rewardsText],
      scale: 1.05,
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    // Remove after 5 seconds
    this.scene.time.delayedCall(5000, () => {
      overlay.destroy();
      victoryText.destroy();
      rewardsText.destroy();
    });
  }

  /**
   * Clean up boss UI elements
   */
  private cleanupBossUI(): void {
    if (this.healthBar) {
      this.healthBar.destroy();
      this.healthBar = null;
    }
    if (this.healthBarBg) {
      this.healthBarBg.destroy();
      this.healthBarBg = null;
    }
    if (this.bossNameText) {
      this.bossNameText.destroy();
      this.bossNameText = null;
    }
    if (this.phaseText) {
      this.phaseText.destroy();
      this.phaseText = null;
    }
    if (this.hpText) {
      this.hpText.destroy();
      this.hpText = null;
    }
  }

  /**
   * Get boss container for collision detection
   */
  public getBoss(): Phaser.GameObjects.Container | null {
    return this.boss;
  }

  /**
   * Get boss projectiles for collision detection
   */
  public getBossProjectiles(): Phaser.GameObjects.Container[] {
    return this.projectiles;
  }

  /**
   * Check if boss is active
   */
  public isBossActive(): boolean {
    return this.bossActive;
  }

  /**
   * Check if boss has been defeated
   */
  public isBossDefeated(): boolean {
    return this.bossDefeated;
  }

  /**
   * Cleanup all boss elements
   */
  public cleanup(): void {
    if (this.boss) {
      this.boss.destroy();
      this.boss = null;
    }

    this.cleanupBossUI();

    this.projectiles.forEach(p => p.destroy());
    this.projectiles = [];

    this.bossActive = false;

    // Stop boss music
    if (this.bossDef && this.bossDef.musicTrack) {
      this.scene.sound.stopByKey(this.bossDef.musicTrack);
    }
  }
}
