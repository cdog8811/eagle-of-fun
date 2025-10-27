/**
 * ProjectileManager v3.8
 *
 * Manages all projectiles (bullets) with object pooling for performance
 */

import Phaser from 'phaser';
import { getWeaponDef } from '../config/Weapons';

export interface Projectile {
  sprite: Phaser.GameObjects.Sprite;
  damage: number;
  pierce: number; // How many enemies left to pierce
  splashRadius?: number;
  active: boolean;
}

export class ProjectileManager {
  private scene: Phaser.Scene;
  private projectiles: Projectile[] = [];
  private pool: Phaser.GameObjects.Sprite[] = [];
  private maxPoolSize: number = 100;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public init(): void {
    console.log('ProjectileManager initialized');
  }

  /**
   * Fire a projectile
   */
  public fire(
    weaponId: string,
    x: number,
    y: number,
    direction: 'forward' | 'up' | 'down',
    damageBonus: number = 0
  ): void {
    const weaponDef = getWeaponDef(weaponId);
    if (!weaponDef) return;

    const weapon = weaponDef;

    // Handle spread shot
    if (weapon.special?.pellets) {
      const pellets = weapon.special.pellets;
      const spreadAngle = weapon.special.spreadAngle || 0;

      for (let i = 0; i < pellets; i++) {
        const offset = ((i - (pellets - 1) / 2) * spreadAngle);
        this.createProjectile(weapon, x, y, direction, offset, damageBonus);
      }
    } else {
      this.createProjectile(weapon, x, y, direction, 0, damageBonus);
    }
  }

  private createProjectile(
    weapon: any,
    x: number,
    y: number,
    direction: string,
    angleOffset: number,
    damageBonus: number
  ): void {
    // Get sprite from pool or create new
    const sprite = this.getFromPool(weapon.bulletSprite);
    sprite.setPosition(x, y);
    sprite.setScale(weapon.bulletScale);
    sprite.setActive(true);
    sprite.setVisible(true);

    // Calculate velocity
    const speed = weapon.bulletSpeed;
    let vx = 0, vy = 0;

    switch (direction) {
      case 'forward':
        vx = speed;
        break;
      case 'up':
        vy = -speed;
        break;
      case 'down':
        vy = speed;
        break;
    }

    // Apply angle offset for spread
    if (angleOffset !== 0) {
      const angle = Math.atan2(vy, vx) + (angleOffset * Math.PI / 180);
      const magnitude = Math.sqrt(vx * vx + vy * vy);
      vx = Math.cos(angle) * magnitude;
      vy = Math.sin(angle) * magnitude;
    }

    (sprite.body as Phaser.Physics.Arcade.Body).setVelocity(vx, vy);

    // Create projectile data
    this.projectiles.push({
      sprite,
      damage: weapon.damage + damageBonus,
      pierce: weapon.special?.pierce || 0,
      splashRadius: weapon.special?.splashRadius,
      active: true
    });
  }

  private getFromPool(spriteKey: string): Phaser.GameObjects.Sprite {
    const pooled = this.pool.pop();
    if (pooled) {
      pooled.setTexture(spriteKey);
      return pooled;
    }

    const sprite = this.scene.physics.add.sprite(0, 0, spriteKey);
    sprite.setDepth(500);
    return sprite;
  }

  public update(_dt: number): void {
    const bounds = this.scene.cameras.main.getBounds();

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];

      // Check out of bounds
      if (!bounds.contains(proj.sprite.x, proj.sprite.y)) {
        this.returnToPool(proj);
        this.projectiles.splice(i, 1);
      }
    }
  }

  private returnToPool(proj: Projectile): void {
    proj.sprite.setActive(false);
    proj.sprite.setVisible(false);
    (proj.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    if (this.pool.length < this.maxPoolSize) {
      this.pool.push(proj.sprite);
    } else {
      proj.sprite.destroy();
    }
  }

  public getProjectiles(): Projectile[] {
    return this.projectiles.filter(p => p.active);
  }

  public removeProjectile(proj: Projectile): void {
    const index = this.projectiles.indexOf(proj);
    if (index > -1) {
      this.returnToPool(proj);
      this.projectiles.splice(index, 1);
    }
  }

  public destroy(): void {
    this.projectiles.forEach(p => p.sprite.destroy());
    this.pool.forEach(s => s.destroy());
    this.projectiles = [];
    this.pool = [];
  }
}
