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
  velocityYInitial?: number; // For gravity-based weapons
  damage: number;
  active: boolean;
  pierce?: number; // How many enemies this can pierce through
  splashRadius?: number; // Splash damage radius on hit
  splashDamage?: number; // Splash damage amount
  hasGravity?: boolean; // Apply gravity to projectile
}

export class WeaponManagerSimple {
  private scene: Phaser.Scene;
  private weaponUnlocked: boolean = false;
  private weaponLevel: number = 1; // 1-6
  private weaponEnergy: number = 0; // 0-100
  private maxEnergy: number = 100;
  private energyPerCoin: number = 3; // Each coin adds 3% energy
  private lastFireTime: number = 0;
  private projectiles: Projectile[] = [];

  // Weapon stats per level
  private weaponStats = {
    1: { fireRate: 500, damage: 1, energyCost: 10, color: 0x0088FF, speed: 900, name: 'Basic Blaster' },
    2: { fireRate: 400, damage: 2, energyCost: 8, color: 0xFF6600, speed: 1100, name: 'Rapid Cannon' },
    3: { fireRate: 300, damage: 3, energyCost: 5, color: 0xFF0000, speed: 1300, name: 'Power Laser' },
    4: { fireRate: 450, damage: 2, energyCost: 12, color: 0xFFAA00, speed: 850, name: 'Eagle Spread', special: 'spread' },
    5: { fireRate: 550, damage: 4, energyCost: 15, color: 0x00FFFF, speed: 1400, name: 'Rail AOL', special: 'pierce' },
    6: { fireRate: 650, damage: 3, energyCost: 18, color: 0xFF6B35, speed: 600, name: 'Burger Mortar', special: 'mortar' }
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
    if (this.weaponLevel < 6) {
      this.weaponLevel++;
      const stats = this.weaponStats[this.weaponLevel as keyof typeof this.weaponStats];
      console.log(`⬆️ Weapon upgraded to Level ${this.weaponLevel}: ${stats.name}!`);
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

    // Check for special weapon type
    const special = (stats as any).special;

    if (special === 'spread') {
      // Eagle Spread: Fire 3 projectiles in a spread pattern
      this.createProjectile(x, y, angle - 15, stats); // Left
      this.createProjectile(x, y, angle, stats);      // Center
      this.createProjectile(x, y, angle + 15, stats); // Right
    } else {
      // Normal single projectile
      this.createProjectile(x, y, angle, stats);
    }

    // Update fire time
    this.lastFireTime = Date.now();

    // Play blaster shot sound
    this.scene.sound.play('blastershot', { volume: 0.5 });

    return true;
  }

  private createProjectile(x: number, y: number, angle: number, stats: any): void {
    // === ENHANCED MUZZLE FLASH ===
    const flash = this.scene.add.graphics();

    // Outer explosion ring
    flash.fillStyle(stats.color, 0.6);
    flash.fillCircle(x, y, 30);

    // Middle bright ring
    flash.fillStyle(0xFFFFFF, 0.8);
    flash.fillCircle(x, y, 20);

    // Inner core
    flash.fillStyle(stats.color, 1);
    flash.fillCircle(x, y, 12);

    flash.setDepth(1499);

    // Explosive flash animation
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scaleX: 2.5,
      scaleY: 2.5,
      duration: 120,
      ease: 'Cubic.easeOut',
      onComplete: () => flash.destroy()
    });

    // Calculate angle once for all uses
    const angleRad = Phaser.Math.DegToRad(angle);

    // Add directional blast streak
    const streak = this.scene.add.graphics();
    const streakLength = 40;
    const endX = x + Math.cos(angleRad) * streakLength;
    const endY = y + Math.sin(angleRad) * streakLength;

    streak.lineStyle(8, stats.color, 0.7);
    streak.lineBetween(x, y, endX, endY);
    streak.setDepth(1498);

    this.scene.tweens.add({
      targets: streak,
      alpha: 0,
      duration: 100,
      onComplete: () => streak.destroy()
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
    graphics.setRotation(angleRad);

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
    const velocityX = Math.cos(angleRad) * stats.speed;
    const velocityY = Math.sin(angleRad) * stats.speed;

    const special = stats.special;
    const projectile: Projectile = {
      sprite: graphics,
      x: x,
      y: y,
      velocityX: velocityX,
      velocityY: velocityY,
      velocityYInitial: velocityY, // Store for gravity calculations
      damage: stats.damage,
      active: true,
      // Pierce feature (Rail AOL)
      pierce: special === 'pierce' ? 3 : undefined,
      // Splash damage (Burger Mortar)
      splashRadius: special === 'mortar' ? 80 : undefined,
      splashDamage: special === 'mortar' ? 50 : undefined,
      // Gravity (Burger Mortar)
      hasGravity: special === 'mortar'
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

      // Apply gravity if projectile has gravity (Mortar)
      if (projectile.hasGravity) {
        projectile.velocityY += 800 * deltaSeconds; // Gravity acceleration
      }

      // Move projectile
      projectile.x += projectile.velocityX * deltaSeconds;
      projectile.y += projectile.velocityY * deltaSeconds;
      projectile.sprite.x = projectile.x;
      projectile.sprite.y = projectile.y;

      // Update rotation for mortar projectiles
      if (projectile.hasGravity) {
        const angle = Math.atan2(projectile.velocityY, projectile.velocityX);
        projectile.sprite.setRotation(angle);
      }

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

          // Handle splash damage (Mortar)
          if (projectile.splashRadius && projectile.splashDamage) {
            // Create explosion visual
            this.createExplosion(projectile.x, projectile.y, projectile.splashRadius);

            // Find all enemies in splash radius
            for (const splashEnemy of enemies) {
              if (!splashEnemy.active || splashEnemy === enemy) continue;

              const splashDist = Phaser.Math.Distance.Between(
                projectile.x,
                projectile.y,
                splashEnemy.x,
                splashEnemy.y
              );

              if (splashDist < projectile.splashRadius) {
                // Add splash hit with reduced damage
                const splashProjectile = { ...projectile, damage: projectile.splashDamage! };
                hits.push({ enemy: splashEnemy, projectile: splashProjectile });
              }
            }
          }

          // Handle pierce (Rail)
          if (projectile.pierce && projectile.pierce > 0) {
            projectile.pierce--;
            if (projectile.pierce === 0) {
              projectile.active = false;
            }
          } else {
            projectile.active = false;
          }

          if (!projectile.pierce || projectile.pierce === 0) {
            break; // Stop checking this projectile
          }
        }
      }
    }

    return hits;
  }

  private createExplosion(x: number, y: number, radius: number): void {
    // Explosion flash
    const explosion = this.scene.add.graphics();
    explosion.fillStyle(0xFF6B35, 0.6);
    explosion.fillCircle(x, y, radius);
    explosion.fillStyle(0xFFAA00, 0.8);
    explosion.fillCircle(x, y, radius * 0.7);
    explosion.fillStyle(0xFFFFFF, 1);
    explosion.fillCircle(x, y, radius * 0.4);
    explosion.setDepth(1500);

    this.scene.tweens.add({
      targets: explosion,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      ease: 'Cubic.easeOut',
      onComplete: () => explosion.destroy()
    });

    // Explosion sound
    this.scene.sound.play('explosion', { volume: 0.3 });
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

  public checkFakeCoinCollisions(fakeCoins: Phaser.GameObjects.Container[]): {
    fakeCoin: Phaser.GameObjects.Container;
    projectile: Projectile;
  }[] {
    const hits: { fakeCoin: Phaser.GameObjects.Container; projectile: Projectile }[] = [];

    for (const projectile of this.projectiles) {
      if (!projectile.active) continue;

      for (const fakeCoin of fakeCoins) {
        if (!fakeCoin.active || fakeCoin.getData('collected')) continue;

        const distance = Phaser.Math.Distance.Between(
          projectile.x,
          projectile.y,
          fakeCoin.x,
          fakeCoin.y
        );

        // Fake coins have similar size to real coins (~50px radius)
        if (distance < 60) {
          hits.push({ fakeCoin, projectile });
          projectile.active = false;
          break;
        }
      }
    }

    return hits;
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
