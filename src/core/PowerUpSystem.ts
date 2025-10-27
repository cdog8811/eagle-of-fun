/**
 * PowerUpSystem v3.8 (Simplified)
 *
 * Manages power-up spawning, collection, and effects
 */

import Phaser from 'phaser';

export interface PowerUp {
  sprite: Phaser.GameObjects.Sprite;
  type: 'shield' | 'damage' | 'speed' | 'magnet' | 'invincibility' | 'valor';
  duration: number;
  active: boolean;
}

export interface ActiveEffect {
  type: string;
  duration: number;
  timeRemaining: number;
}

export class PowerUpSystem {
  private scene: Phaser.Scene;
  private powerUps: PowerUp[] = [];
  private activeEffects: ActiveEffect[] = [];

  // Spawn control
  private spawnTimer: number = 0;
  private spawnInterval: number = 15.0; // seconds

  // Callbacks
  private onPowerUpCollectedCallback?: (type: string, duration: number) => void;
  private onEffectExpiredCallback?: (type: string) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public init(): void {
    this.powerUps = [];
    this.activeEffects = [];
    this.spawnTimer = this.spawnInterval;

    console.log('PowerUpSystem initialized');
  }

  /**
   * Update spawning and effect timers
   */
  public update(dt: number): void {
    const dtSeconds = dt / 1000;

    // Spawn power-ups
    this.spawnTimer -= dtSeconds;
    if (this.spawnTimer <= 0) {
      this.spawnPowerUp();
      this.spawnTimer = this.spawnInterval;
    }

    // Update active effects
    for (let i = this.activeEffects.length - 1; i >= 0; i--) {
      const effect = this.activeEffects[i];
      effect.timeRemaining -= dtSeconds;

      if (effect.timeRemaining <= 0) {
        this.expireEffect(effect);
        this.activeEffects.splice(i, 1);
      }
    }
  }

  /**
   * Spawn a random power-up
   */
  private spawnPowerUp(): void {
    const types: PowerUp['type'][] = ['shield', 'damage', 'speed', 'magnet', 'invincibility', 'valor'];
    const type = Phaser.Math.RND.pick(types);

    // Random position in middle area
    const x = this.scene.cameras.main.scrollX + Phaser.Math.Between(200, this.scene.cameras.main.width - 200);
    const y = Phaser.Math.Between(150, this.scene.cameras.main.height - 150);

    // Create sprite
    const sprite = this.scene.physics.add.sprite(x, y, this.getPowerUpSprite(type));
    sprite.setDepth(450);
    sprite.setScale(1.2);

    // Pulsing animation
    this.scene.tweens.add({
      targets: sprite,
      scale: 1.5,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Duration based on type
    const duration = type === 'valor' ? 8.0 : 10.0;

    const powerUp: PowerUp = {
      sprite,
      type,
      duration,
      active: true
    };

    this.powerUps.push(powerUp);

    // Auto-remove after 10 seconds
    this.scene.time.delayedCall(10000, () => {
      this.removePowerUp(powerUp);
    });
  }

  /**
   * Get sprite key for power-up type
   */
  private getPowerUpSprite(type: string): string {
    switch (type) {
      case 'shield': return 'powerup-shield';
      case 'damage': return 'powerup-damage';
      case 'speed': return 'powerup-speed';
      case 'magnet': return 'powerup-magnet';
      case 'invincibility': return 'powerup-invincibility';
      case 'valor': return 'powerup-valor';
      default: return 'powerup-shield';
    }
  }

  /**
   * Collect a power-up
   */
  public collectPowerUp(powerUp: PowerUp): void {
    // Add to active effects
    const effect: ActiveEffect = {
      type: powerUp.type,
      duration: powerUp.duration,
      timeRemaining: powerUp.duration
    };

    this.activeEffects.push(effect);

    // Callback
    if (this.onPowerUpCollectedCallback) {
      this.onPowerUpCollectedCallback(powerUp.type, powerUp.duration);
    }

    console.log(`Power-up collected: ${powerUp.type} (${powerUp.duration}s)`);

    // Remove power-up
    this.removePowerUp(powerUp);
  }

  /**
   * Remove power-up from scene
   */
  private removePowerUp(powerUp: PowerUp): void {
    if (!powerUp.active) return;

    powerUp.active = false;
    // v3.8: Kill tweens BEFORE destroying sprite to prevent memory leak!
    this.scene.tweens.killTweensOf(powerUp.sprite);
    powerUp.sprite.destroy();

    const index = this.powerUps.indexOf(powerUp);
    if (index > -1) {
      this.powerUps.splice(index, 1);
    }
  }

  /**
   * Expire an effect
   */
  private expireEffect(effect: ActiveEffect): void {
    console.log(`Power-up expired: ${effect.type}`);

    if (this.onEffectExpiredCallback) {
      this.onEffectExpiredCallback(effect.type);
    }
  }

  /**
   * Check if effect is active
   */
  public hasEffect(type: string): boolean {
    return this.activeEffects.some(e => e.type === type);
  }

  /**
   * Get remaining time for effect
   */
  public getEffectTime(type: string): number {
    const effect = this.activeEffects.find(e => e.type === type);
    return effect ? effect.timeRemaining : 0;
  }

  /**
   * Get all active effects
   */
  public getActiveEffects(): ActiveEffect[] {
    return this.activeEffects;
  }

  /**
   * Get all power-ups
   */
  public getPowerUps(): PowerUp[] {
    return this.powerUps.filter(p => p.active);
  }

  /**
   * Manually activate effect (for Valor Mode)
   */
  public activateEffect(type: string, duration: number): void {
    const effect: ActiveEffect = {
      type,
      duration,
      timeRemaining: duration
    };

    this.activeEffects.push(effect);

    if (this.onPowerUpCollectedCallback) {
      this.onPowerUpCollectedCallback(type, duration);
    }

    console.log(`Effect activated: ${type} (${duration}s)`);
  }

  /**
   * Remove all effects
   */
  public clearEffects(): void {
    this.activeEffects.forEach(effect => {
      if (this.onEffectExpiredCallback) {
        this.onEffectExpiredCallback(effect.type);
      }
    });

    this.activeEffects = [];
  }

  /**
   * Callbacks
   */
  public onPowerUpCollected(callback: (type: string, duration: number) => void): void {
    this.onPowerUpCollectedCallback = callback;
  }

  public onEffectExpired(callback: (type: string) => void): void {
    this.onEffectExpiredCallback = callback;
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    // v3.8: Kill tweens BEFORE destroying sprites to prevent memory leaks!
    this.powerUps.forEach(p => {
      this.scene.tweens.killTweensOf(p.sprite);
      p.sprite.destroy();
    });
    this.powerUps = [];
    this.activeEffects = [];
  }
}
