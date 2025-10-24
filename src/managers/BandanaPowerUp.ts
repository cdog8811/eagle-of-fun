// ============================
// Eagle of Fun v3.7 - Bandana Power-Up System
// "Bandana on – full degen mode!"
// ============================

import Phaser from 'phaser';

export class BandanaPowerUp {
  private scene: Phaser.Scene;

  // State
  private bandanaActive: boolean = false;
  private bandanaCooldown: boolean = false;
  private bandanaTimer?: Phaser.Time.TimerEvent;
  private bandanaCooldownTimer?: Phaser.Time.TimerEvent;
  private bandanaSpawnTimer?: Phaser.Time.TimerEvent;

  // Original values (to restore after)
  private originalCoinSpeed: number = 0;
  private originalEnemySpeed: number = 0;
  private originalEagleSpeed: number = 0;

  // Visual elements
  private bandanaSprite?: Phaser.GameObjects.Sprite;
  private trailEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private hudOverlay?: Phaser.GameObjects.Container;
  private screenShakeInterval?: Phaser.Time.TimerEvent;

  // Audio
  private bandanaLoopSound?: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public startSpawnTimer(): void {
    console.log('🧢 Bandana spawn timer started - 10% chance every 20s');

    this.bandanaSpawnTimer = this.scene.time.addEvent({
      delay: 20000, // Every 20 seconds
      callback: () => {
        const random = Math.random();
        if (random < 0.10) { // 10% chance
          console.log('🧢 Bandana spawn triggered! (roll:', random, ')');
          this.spawnBandana();
        } else {
          console.log('🧢 Bandana spawn check - no spawn (roll:', random, ')');
        }
      },
      loop: true
    });
  }

  private spawnBandana(): void {
    // Don't spawn if bandana is active or on cooldown
    if (this.bandanaActive || this.bandanaCooldown) {
      console.log('🧢 Bandana spawn blocked (active or cooldown)');
      return;
    }

    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    const y = Phaser.Math.Between(150, height - 150);

    const bandana = this.scene.add.container(width + 100, y);

    // Bandana sprite
    const bandanaImage = this.scene.add.sprite(0, 0, 'bandana');
    bandanaImage.setScale(0.15); // Adjust size

    // Red glow
    const glow = this.scene.add.graphics();
    glow.fillStyle(0xFF0000, 0.4);
    glow.fillCircle(0, 0, 60);

    bandana.add([glow, bandanaImage]);
    bandana.setData('type', 'bandana');
    bandana.setSize(80, 80);

    // Pulse animation
    this.scene.tweens.add({
      targets: glow,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Float animation
    this.scene.tweens.add({
      targets: bandana,
      y: y - 20,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Store in powerups array
    (this.scene as any).powerups.push(bandana);

    console.log('🧢 Bandana spawned at y:', y);
  }

  public activate(): void {
    if (this.bandanaActive || this.bandanaCooldown) return;

    console.log('🧢 BANDANA MODE – Activated');
    console.log('Speed x2.5, FireRate x2, Invincible = true');

    this.bandanaActive = true;

    // Store original values
    const gameScene = this.scene as any;
    this.originalCoinSpeed = gameScene.coinSpeed;
    this.originalEnemySpeed = gameScene.enemySpeed;

    // Apply speed multipliers
    gameScene.coinSpeed *= 2.5;
    gameScene.enemySpeed *= 2.5;

    // Enable invincibility - BANDANA takes shield ownership
    console.log('🛡️ BANDANA MODE taking shield ownership');
    gameScene.shieldActive = true;
    gameScene.shieldOwner = 'bandana';

    // Create shield graphics for Bandana mode
    if (gameScene.shieldGraphics) {
      gameScene.shieldGraphics.destroy();
    }
    gameScene.shieldGraphics = this.scene.add.graphics();
    gameScene.shieldGraphics.setDepth(99);

    // Activate coin magnet (handled in update loop)
    (this.scene as any).bandanaMagnetActive = true;

    // Play activation sound
    if (this.scene.sound.get('bandana-activate')) {
      this.scene.sound.play('bandana-activate', { volume: 0.7 });
    }

    // Start loop music
    if (this.scene.sound.get('bandana-loop')) {
      this.bandanaLoopSound = this.scene.sound.add('bandana-loop', {
        volume: 0.4,
        loop: true
      });
      this.bandanaLoopSound.play();
    }

    // Visual effects
    this.createVisualEffects();

    // HUD overlay
    this.createHUDOverlay();

    // Screen shake interval
    this.screenShakeInterval = this.scene.time.addEvent({
      delay: 200,
      callback: () => {
        this.scene.cameras.main.shake(100, 0.001);
      },
      loop: true
    });

    // Duration: 5 seconds
    this.bandanaTimer = this.scene.time.delayedCall(5000, () => {
      this.deactivate();
    });
  }

  private createVisualEffects(): void {
    const gameScene = this.scene as any;
    const eagle = gameScene.eagle;

    if (!eagle) return;

    // Gold-red trail particle emitter
    // Note: Phaser 3 particle system - simplified version
    const graphics = this.scene.add.graphics();
    graphics.setDepth(1400);
    (this as any).trailGraphics = graphics;

    // Trail effect will be drawn in update loop
  }

  private createHUDOverlay(): void {
    const width = this.scene.cameras.main.width;

    this.hudOverlay = this.scene.add.container(width / 2, 120);
    this.hudOverlay.setDepth(10000);

    // Background
    const bg = this.scene.add.graphics();
    bg.fillStyle(0xFF0000, 0.85);
    bg.fillRoundedRect(-200, -30, 400, 60, 10);
    bg.lineStyle(3, 0xFFFFFF, 1);
    bg.strokeRoundedRect(-200, -30, 400, 60, 10);

    // Text
    const text = this.scene.add.text(0, 0, '🧢 BANDANA MODE ACTIVE – SPEED × 2.5', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // Timer text (will be updated)
    const timerText = this.scene.add.text(0, -50, '⏱ 5.0 s', {
      fontSize: '20px',
      color: '#FFD700',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.hudOverlay.add([bg, text, timerText]);
    (this.hudOverlay as any).timerText = timerText;
  }

  public update(): void {
    if (!this.bandanaActive) return;

    // Update timer display
    if (this.hudOverlay && this.bandanaTimer) {
      const remaining = this.bandanaTimer.getRemaining() / 1000;
      const timerText = (this.hudOverlay as any).timerText as Phaser.GameObjects.Text;
      if (timerText) {
        timerText.setText(`⏱ ${remaining.toFixed(1)} s`);
      }
    }

    // Draw trail effect
    const gameScene = this.scene as any;
    const eagle = gameScene.eagle;
    const trailGraphics = (this as any).trailGraphics as Phaser.GameObjects.Graphics;

    if (eagle && trailGraphics) {
      // Simple trail: draw fading circles behind eagle
      if (Math.random() < 0.5) {
        const trail = this.scene.add.graphics();
        trail.fillStyle(0xFF6600, 0.6);
        trail.fillCircle(eagle.x - 30, eagle.y, 15);
        trail.setDepth(1400);

        this.scene.tweens.add({
          targets: trail,
          alpha: 0,
          scaleX: 0.5,
          scaleY: 0.5,
          duration: 300,
          onComplete: () => trail.destroy()
        });
      }
    }

    // Coin magnet effect (300px radius)
    this.applyCoinMagnet();
  }

  private applyCoinMagnet(): void {
    const gameScene = this.scene as any;
    const eagle = gameScene.eagle;
    const coins = gameScene.coins;

    if (!eagle || !coins) return;

    for (const coin of coins) {
      if (!coin || !coin.active || coin.getData('collected')) continue;

      const distance = Phaser.Math.Distance.Between(
        coin.x,
        coin.y,
        eagle.x,
        eagle.y
      );

      if (distance < 300) {
        // Attract coin towards eagle
        const angle = Phaser.Math.Angle.Between(coin.x, coin.y, eagle.x, eagle.y);
        coin.x += Math.cos(angle) * 8;
        coin.y += Math.sin(angle) * 8;
      }
    }
  }

  private deactivate(): void {
    console.log('🧢 BANDANA MODE – Expired – Cooldown 30 s');

    this.bandanaActive = false;

    const gameScene = this.scene as any;

    // Restore original speeds
    gameScene.coinSpeed = this.originalCoinSpeed;
    gameScene.enemySpeed = this.originalEnemySpeed;

    // Disable invincibility - only if Bandana owns the shield
    if (gameScene.shieldOwner === 'bandana') {
      console.log('🛡️ BANDANA MODE releasing shield ownership');
      gameScene.shieldActive = false;
      gameScene.shieldOwner = 'none';
      if (gameScene.shieldGraphics) {
        gameScene.shieldGraphics.destroy();
        gameScene.shieldGraphics = undefined;
      }
    } else {
      console.log('🛡️ BANDANA MODE ending but shield owned by:', gameScene.shieldOwner);
    }

    // Disable coin magnet
    gameScene.bandanaMagnetActive = false;

    // Stop loop music
    if (this.bandanaLoopSound) {
      this.bandanaLoopSound.stop();
      this.bandanaLoopSound = undefined;
    }

    // Play end sound
    if (this.scene.sound.get('bandana-end')) {
      this.scene.sound.play('bandana-end', { volume: 0.6 });
    }

    // Screen flash
    this.scene.cameras.main.flash(300, 255, 255, 255, false);
    this.scene.cameras.main.flash(300, 255, 255, 255, false);

    // Remove visual effects
    if (this.hudOverlay) {
      this.hudOverlay.destroy();
      this.hudOverlay = undefined;
    }

    if (this.screenShakeInterval) {
      this.screenShakeInterval.remove();
      this.screenShakeInterval = undefined;
    }

    const trailGraphics = (this as any).trailGraphics;
    if (trailGraphics) {
      trailGraphics.destroy();
      (this as any).trailGraphics = undefined;
    }

    // Start cooldown (30 seconds)
    this.bandanaCooldown = true;
    this.bandanaCooldownTimer = this.scene.time.delayedCall(30000, () => {
      this.bandanaCooldown = false;
      console.log('🧢 Bandana cooldown complete - ready again!');
    });
  }

  public isActive(): boolean {
    return this.bandanaActive;
  }

  public isCooldown(): boolean {
    return this.bandanaCooldown;
  }

  public getFireRateMultiplier(): number {
    return this.bandanaActive ? 0.5 : 1.0; // x2 fire rate = 0.5 cooldown
  }

  public cleanup(): void {
    if (this.bandanaTimer) {
      this.bandanaTimer.remove();
    }
    if (this.bandanaCooldownTimer) {
      this.bandanaCooldownTimer.remove();
    }
    if (this.bandanaSpawnTimer) {
      this.bandanaSpawnTimer.remove();
    }
    if (this.screenShakeInterval) {
      this.screenShakeInterval.remove();
    }
    if (this.bandanaLoopSound) {
      this.bandanaLoopSound.stop();
    }
    if (this.hudOverlay) {
      this.hudOverlay.destroy();
    }
  }
}
