// ============================
// Eagle of Fun v3.7 - Simple Energy-Based Weapon System
// Coins charge energy → Shoot with Q/W/E
// ============================

import Phaser from 'phaser';

export interface Projectile {
  sprite: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  damage: number;
  active: boolean;
}

export class WeaponManagerSimple {
  private scene: Phaser.Scene;
  private weaponUnlocked: boolean = false;
  private weaponLevel: number = 1; // 1, 2, 3
  private weaponEnergy: number = 0; // 0-100
  private maxEnergy: number = 100;
  private energyPerCoin: number = 3; // Each coin adds 3% energy
  private lastFireTime: number = 0;
  private projectiles: Projectile[] = [];

  // Weapon stats per level
  private weaponStats = {
    1: { fireRate: 500, damage: 1, energyCost: 10, color: 0x0088FF, speed: 600, name: 'Basic Blaster' },
    2: { fireRate: 400, damage: 2, energyCost: 8, color: 0xFF6600, speed: 700, name: 'Rapid Cannon' },
    3: { fireRate: 300, damage: 3, energyCost: 5, color: 0xFF0000, speed: 800, name: 'Power Laser' }
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public unlockWeapon(): void {
    this.weaponUnlocked = true;
    this.weaponLevel = 1;
    this.weaponEnergy = 50; // Start with 50% energy
    console.log('🔫 Weapon unlocked! Use Q/W/E to shoot!');
  }

  public hasWeapon(): boolean {
    return this.weaponUnlocked;
  }

  public upgradeWeapon(): void {
    if (this.weaponLevel < 3) {
      this.weaponLevel++;
      console.log(`⬆️ Weapon upgraded to Level ${this.weaponLevel}!`);
    }
  }

  public getWeaponLevel(): number {
    return this.weaponLevel;
  }

  public getWeaponName(): string {
    if (!this.weaponUnlocked) return 'No Weapon';
    return this.weaponStats[this.weaponLevel as keyof typeof this.weaponStats].name;
  }

  public addEnergyFromCoin(): void {
    if (!this.weaponUnlocked) return;

    this.weaponEnergy = Math.min(this.maxEnergy, this.weaponEnergy + this.energyPerCoin);
  }

  public getEnergy(): number {
    return this.weaponEnergy;
  }

  public getMaxEnergy(): number {
    return this.maxEnergy;
  }

  public getEnergyPercent(): number {
    return (this.weaponEnergy / this.maxEnergy) * 100;
  }

  public canFire(): boolean {
    if (!this.weaponUnlocked) return false;

    const stats = this.weaponStats[this.weaponLevel as keyof typeof this.weaponStats];
    const now = Date.now();

    // Check cooldown
    if (now - this.lastFireTime < stats.fireRate) return false;

    // Check energy
    if (this.weaponEnergy < stats.energyCost) return false;

    return true;
  }

  public fire(x: number, y: number, angle: number = 0): boolean {
    if (!this.canFire()) {
      // Low energy feedback
      if (this.weaponEnergy < 10) {
        console.log('⚡ Low energy! Collect more coins!');
      }
      return false;
    }

    const stats = this.weaponStats[this.weaponLevel as keyof typeof this.weaponStats];

    // Deduct energy
    this.weaponEnergy = Math.max(0, this.weaponEnergy - stats.energyCost);

    // Create projectile
    this.createProjectile(x, y, angle, stats);

    // Update fire time
    this.lastFireTime = Date.now();

    // Play sound
    if (this.scene.sound.get('shoot')) {
      this.scene.sound.play('shoot', { volume: 0.4 });
    }

    return true;
  }

  private createProjectile(x: number, y: number, angle: number, stats: any): void {
    // === MUZZLE FLASH ===
    const flash = this.scene.add.graphics();
    flash.fillStyle(stats.color, 0.8);
    flash.fillCircle(x, y, 20);
    flash.fillStyle(0xFFFFFF, 0.6);
    flash.fillCircle(x, y, 12);
    flash.setDepth(1499);

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 150,
      ease: 'Power2',
      onComplete: () => flash.destroy()
    });

    // Create projectile graphics with glow
    const graphics = this.scene.add.graphics();

    // Outer glow
    graphics.fillStyle(stats.color, 0.4);
    graphics.fillCircle(0, 0, 12);
    // Main body
    graphics.fillStyle(stats.color, 1);
    graphics.fillCircle(0, 0, 8);
    // Inner core
    graphics.fillStyle(0xFFFFFF, 0.9);
    graphics.fillCircle(-2, 0, 4);
    // Sparkle
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillCircle(2, -2, 2);

    graphics.x = x;
    graphics.y = y;
    graphics.setDepth(1500);
    graphics.setRotation(Phaser.Math.DegToRad(angle));

    // Pulse animation
    this.scene.tweens.add({
      targets: graphics,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 200,
      yoyo: true,
      repeat: -1
    });

    // Calculate velocity
    const angleRad = Phaser.Math.DegToRad(angle);
    const velocityX = Math.cos(angleRad) * stats.speed;
    const velocityY = Math.sin(angleRad) * stats.speed;

    const projectile: Projectile = {
      sprite: graphics,
      x: x,
      y: y,
      velocityX: velocityX,
      velocityY: velocityY,
      damage: stats.damage,
      active: true
    };

    this.projectiles.push(projectile);

    // Initial trail
    (projectile as any).lastTrailTime = Date.now();
    (projectile as any).color = stats.color;
  }

  public update(delta: number): void {
    const deltaSeconds = delta / 1000;

    // Update all projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];

      if (!projectile.active) {
        if (projectile.sprite && projectile.sprite.active) {
          projectile.sprite.destroy();
        }
        this.projectiles.splice(i, 1);
        continue;
      }

      // Move projectile
      projectile.x += projectile.velocityX * deltaSeconds;
      projectile.y += projectile.velocityY * deltaSeconds;
      projectile.sprite.x = projectile.x;
      projectile.sprite.y = projectile.y;

      // Create continuous trail effect
      const color = (projectile as any).color || 0x0088FF;
      const lastTrailTime = (projectile as any).lastTrailTime || 0;
      if (Date.now() - lastTrailTime > 50) {
        const trail = this.scene.add.graphics();
        trail.fillStyle(color, 0.5);
        trail.fillCircle(projectile.x, projectile.y, 3);
        trail.setDepth(1498);

        this.scene.tweens.add({
          targets: trail,
          alpha: 0,
          scaleX: 0.3,
          scaleY: 0.3,
          duration: 200,
          onComplete: () => trail.destroy()
        });

        (projectile as any).lastTrailTime = Date.now();
      }

      // Check bounds
      const width = this.scene.cameras.main.width;
      const height = this.scene.cameras.main.height;

      if (projectile.x > width + 100 || projectile.x < -100 ||
          projectile.y > height + 100 || projectile.y < -100) {
        projectile.active = false;
      }
    }
  }

  public checkCollisions(enemies: Phaser.GameObjects.Container[]): {
    enemy: Phaser.GameObjects.Container;
    projectile: Projectile;
  }[] {
    const hits: { enemy: Phaser.GameObjects.Container; projectile: Projectile }[] = [];

    for (const projectile of this.projectiles) {
      if (!projectile.active) continue;

      for (const enemy of enemies) {
        if (!enemy.active) continue;

        const distance = Phaser.Math.Distance.Between(
          projectile.x,
          projectile.y,
          enemy.x,
          enemy.y
        );

        const enemyConfig = enemy.getData('config');
        const hitRadius = enemyConfig ?
          Math.max(enemyConfig.size.width, enemyConfig.size.height) / 2 : 50;

        if (distance < hitRadius + 10) {
          hits.push({ enemy, projectile });
          projectile.active = false;
          break;
        }
      }
    }

    return hits;
  }

  public destroyProjectile(projectile: Projectile): void {
    projectile.active = false;
    if (projectile.sprite && projectile.sprite.active) {
      projectile.sprite.destroy();
    }
  }

  public getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  public cleanup(): void {
    this.projectiles.forEach(p => {
      if (p.sprite && p.sprite.active) {
        p.sprite.destroy();
      }
    });
    this.projectiles = [];
  }
}
