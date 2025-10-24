// ============================
// Eagle of Fun v3.7 - Coin-Based Weapon System
// "Trade with bullets. Invest with courage."
// ============================

import Phaser from 'phaser';

export interface Weapon {
  id: string;
  name: string;
  icon: string;
  costPerShot: number;
  coinType: 'BONK' | 'AOL' | 'BURGER' | 'VALOR' | 'MIXED';
  damage: number;
  cooldown: number; // milliseconds
  projectileSpeed: number;
  projectileColor: number;
  special?: 'area' | 'pierce' | 'splash';
  specialRadius?: number;
  pierceCount?: number;
  unlocked: boolean;
  description: string;
}

export interface Projectile {
  sprite: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  damage: number;
  weapon: Weapon;
  active: boolean;
  pierceRemaining?: number;
  costPaid: number; // Track how many coins were spent
  coinType: string;
}

export interface CoinCounts {
  BONK: number;
  AOL: number;
  BURGER: number;
  VALOR: number;
}

export class WeaponManagerV37 {
  private scene: Phaser.Scene;
  private weapons: Map<string, Weapon>;
  private currentWeaponId: string = 'freedomBolt';
  private lastFireTime: number = 0;
  private lastShiftPress: number = 0;
  private projectiles: Projectile[] = [];
  private aimAngle: number = 0; // -15 to +15 degrees
  private isAiming: boolean = false;

  // Coin tracking
  private coinCounts: CoinCounts = {
    BONK: 0,
    AOL: 0,
    BURGER: 0,
    VALOR: 0
  };

  // Stats
  private totalShots: number = 0;
  private totalHits: number = 0;
  private totalMisses: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.weapons = new Map();
    this.initializeWeapons();
  }

  private initializeWeapons(): void {
    // Freedom Bolt - Default weapon (BONK coins)
    this.weapons.set('freedomBolt', {
      id: 'freedomBolt',
      name: 'Freedom Bolt',
      icon: '⚡',
      costPerShot: 1,
      coinType: 'BONK',
      damage: 1,
      cooldown: 800,
      projectileSpeed: 600,
      projectileColor: 0x0088FF,
      unlocked: true,
      description: '1 BONK • 1-hit kill'
    });

    // HODL Cannon - Area damage (AOL coins)
    this.weapons.set('hodlCannon', {
      id: 'hodlCannon',
      name: 'HODL Cannon',
      icon: '💎',
      costPerShot: 2,
      coinType: 'AOL',
      damage: 2,
      cooldown: 1200,
      projectileSpeed: 500,
      projectileColor: 0xFF6600,
      special: 'area',
      specialRadius: 100,
      unlocked: true,
      description: '2 AOL • Area damage 100px'
    });

    // Burger Blaster - Splash damage (BURGER coins)
    this.weapons.set('burgerBlaster', {
      id: 'burgerBlaster',
      name: 'Burger Blaster',
      icon: '🍔',
      costPerShot: 1,
      coinType: 'BURGER',
      damage: 1,
      cooldown: 900,
      projectileSpeed: 550,
      projectileColor: 0xFFAA00,
      special: 'splash',
      specialRadius: 80,
      unlocked: true,
      description: '1 BURGER • Splash + grease'
    });

    // AOL Laser - Piercing beam (AOL coins)
    this.weapons.set('aolLaser', {
      id: 'aolLaser',
      name: 'AOL Laser',
      icon: '🔴',
      costPerShot: 3,
      coinType: 'AOL',
      damage: 2,
      cooldown: 2000,
      projectileSpeed: 800,
      projectileColor: 0xFF0000,
      special: 'pierce',
      pierceCount: 3,
      unlocked: true,
      description: '3 AOL • Pierces 3 enemies'
    });

    // Valor Beam - Only in Valor Mode (FREE)
    this.weapons.set('valorBeam', {
      id: 'valorBeam',
      name: 'Valor Beam',
      icon: '✨',
      costPerShot: 0,
      coinType: 'VALOR',
      damage: 999,
      cooldown: 100,
      projectileSpeed: 1000,
      projectileColor: 0xFFD700,
      special: 'pierce',
      pierceCount: 999,
      unlocked: false,
      description: 'FREE • Kills all on screen'
    });
  }

  public updateCoinCounts(bonk: number, aol: number, burger: number, valor: number): void {
    this.coinCounts.BONK = bonk;
    this.coinCounts.AOL = aol;
    this.coinCounts.BURGER = burger;
    this.coinCounts.VALOR = valor;
  }

  public getCurrentWeapon(): Weapon {
    return this.weapons.get(this.currentWeaponId)!;
  }

  public getAllWeapons(): Weapon[] {
    return Array.from(this.weapons.values()).filter(w => w.unlocked);
  }

  public cycleWeapon(): void {
    const weaponKeys = Array.from(this.weapons.keys()).filter(key =>
      this.weapons.get(key)!.unlocked
    );
    const currentIndex = weaponKeys.indexOf(this.currentWeaponId);
    const nextIndex = (currentIndex + 1) % weaponKeys.length;
    this.currentWeaponId = weaponKeys[nextIndex];

    const weapon = this.getCurrentWeapon();
    console.log(`🔫 Switched to ${weapon.name}`);

    // Show weapon switch feedback
    this.showWeaponSwitchFeedback(weapon);
  }

  private showWeaponSwitchFeedback(weapon: Weapon): void {
    const width = this.scene.cameras.main.width;
    const text = this.scene.add.text(width / 2, 150, `${weapon.icon} ${weapon.name}`, {
      fontSize: '32px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    text.setDepth(9999);

    this.scene.tweens.add({
      targets: text,
      alpha: 0,
      y: 100,
      duration: 1000,
      onComplete: () => text.destroy()
    });
  }

  public canFire(): boolean {
    const weapon = this.getCurrentWeapon();
    const now = Date.now();

    // Check cooldown
    if (now - this.lastFireTime < weapon.cooldown) {
      return false;
    }

    // Check ammo (coins)
    if (weapon.coinType !== 'VALOR' && weapon.costPerShot > 0) {
      const coinCount = this.coinCounts[weapon.coinType];
      if (coinCount < weapon.costPerShot) {
        // Not enough coins - play "no liquidity" sound
        this.playNoLiquiditySound();
        return false;
      }
    }

    return true;
  }

  public fire(x: number, y: number, angle?: number): { success: boolean; cost: number; coinType: string } {
    if (!this.canFire()) {
      return { success: false, cost: 0, coinType: '' };
    }

    const weapon = this.getCurrentWeapon();
    const fireAngle = angle !== undefined ? angle : this.aimAngle;

    const cost = weapon.costPerShot;
    const coinType = weapon.coinType;

    // Create projectile
    this.createProjectile(x, y, fireAngle, weapon, cost, coinType);

    // Update fire time
    this.lastFireTime = Date.now();
    this.totalShots++;

    // Play sound
    this.playFireSound(weapon);

    // Voice line
    this.playVoiceLine('fire');

    return { success: true, cost, coinType };
  }

  public rapidFire(x: number, y: number): { success: boolean; totalCost: number; coinType: string } {
    // Fire 3 shots in burst
    const angles = [-10, 0, 10];
    let totalCost = 0;
    let coinType = '';

    angles.forEach((angle, index) => {
      this.scene.time.delayedCall(index * 100, () => {
        const result = this.fire(x, y, angle);
        if (result.success) {
          totalCost += result.cost;
          coinType = result.coinType;
        }
      });
    });

    return { success: true, totalCost, coinType };
  }

  public handleShiftPress(eagleX: number, eagleY: number): { rapidFire: boolean; cost: number; coinType: string } {
    const now = Date.now();
    const timeSinceLastPress = now - this.lastShiftPress;

    if (timeSinceLastPress <= 400) {
      // Double press detected - rapid fire
      console.log('🔥 RAPID FIRE!');
      const result = this.rapidFire(eagleX + 50, eagleY);
      this.lastShiftPress = 0; // Reset
      return { rapidFire: true, cost: result.totalCost, coinType: result.coinType };
    } else {
      // Single press - normal fire
      const result = this.fire(eagleX + 50, eagleY);
      this.lastShiftPress = now;
      return { rapidFire: false, cost: result.cost, coinType: result.coinType };
    }
  }

  public adjustAim(direction: number): void {
    // direction: -1 = up, +1 = down
    this.aimAngle = Phaser.Math.Clamp(this.aimAngle + (direction * 5), -15, 15);
    console.log(`🎯 Aim angle: ${this.aimAngle}°`);
  }

  public setAiming(aiming: boolean): void {
    this.isAiming = aiming;
  }

  public getAimAngle(): number {
    return this.aimAngle;
  }

  private createProjectile(x: number, y: number, angle: number, weapon: Weapon, cost: number, coinType: string): void {
    // === MUZZLE FLASH ===
    this.createMuzzleFlash(x, y, weapon.projectileColor);

    // Create projectile graphics with glow
    const graphics = this.scene.add.graphics();

    // Draw projectile based on weapon type with enhanced visuals
    if (weapon.special === 'pierce') {
      // Laser beam with glow
      // Outer glow
      graphics.fillStyle(weapon.projectileColor, 0.3);
      graphics.fillRect(-5, -6, 50, 12);
      // Main beam
      graphics.fillStyle(weapon.projectileColor, 1);
      graphics.fillRect(0, -3, 45, 6);
      // Inner core
      graphics.fillStyle(0xFFFFFF, 0.9);
      graphics.fillRect(0, -1, 45, 2);
    } else if (weapon.special === 'area') {
      // Cannon ball with glow
      graphics.fillStyle(weapon.projectileColor, 0.4);
      graphics.fillCircle(0, 0, 16);
      graphics.fillStyle(weapon.projectileColor, 1);
      graphics.fillCircle(0, 0, 12);
      graphics.fillStyle(0xFFFFFF, 0.7);
      graphics.fillCircle(-3, -3, 6);
    } else if (weapon.special === 'splash') {
      // Burger projectile with layers
      // Bottom bun
      graphics.fillStyle(0xFFAA00, 1);
      graphics.fillCircle(0, 0, 10);
      // Patty
      graphics.fillStyle(0xFF6B6B, 1);
      graphics.fillCircle(0, -4, 7);
      // Cheese
      graphics.fillStyle(0xFFFF00, 1);
      graphics.fillCircle(0, 2, 6);
      // Glow
      graphics.fillStyle(0xFFAA00, 0.3);
      graphics.fillCircle(0, 0, 15);
    } else {
      // Standard bolt with glow and core
      // Outer glow
      graphics.fillStyle(weapon.projectileColor, 0.4);
      graphics.fillCircle(0, 0, 12);
      // Main body
      graphics.fillStyle(weapon.projectileColor, 1);
      graphics.fillCircle(0, 0, 8);
      // Inner core
      graphics.fillStyle(0xFFFFFF, 0.9);
      graphics.fillCircle(-2, 0, 4);
      // Sparkle
      graphics.fillStyle(0xFFFFFF, 1);
      graphics.fillCircle(2, -2, 2);
    }

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
    const velocityX = Math.cos(angleRad) * weapon.projectileSpeed;
    const velocityY = Math.sin(angleRad) * weapon.projectileSpeed;

    const projectile: Projectile = {
      sprite: graphics,
      x: x,
      y: y,
      velocityX: velocityX,
      velocityY: velocityY,
      damage: weapon.damage,
      weapon: weapon,
      active: true,
      pierceRemaining: weapon.pierceCount || 0,
      costPaid: cost,
      coinType: coinType
    };

    this.projectiles.push(projectile);

    // Create trail emitter
    this.createTrailEffect(projectile, weapon.projectileColor);
  }

  private createMuzzleFlash(x: number, y: number, color: number): void {
    const flash = this.scene.add.graphics();
    flash.fillStyle(color, 0.8);
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
  }

  private createTrailEffect(projectile: Projectile, color: number): void {
    // Create trail particles
    const trail = this.scene.add.graphics();
    trail.fillStyle(color, 0.6);
    trail.fillCircle(0, 0, 4);
    trail.x = projectile.x;
    trail.y = projectile.y;
    trail.setDepth(1498);

    this.scene.tweens.add({
      targets: trail,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 300,
      onComplete: () => trail.destroy()
    });

    // Store reference to create more trails in update
    (projectile as any).lastTrailTime = Date.now();
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
      const lastTrailTime = (projectile as any).lastTrailTime || 0;
      if (Date.now() - lastTrailTime > 50) { // Every 50ms
        const trail = this.scene.add.graphics();
        trail.fillStyle(projectile.weapon.projectileColor, 0.5);
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
        // Missed shot - no return
        projectile.active = false;
        this.totalMisses++;
        this.showMissedFeedback(projectile);
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
          this.totalHits++;

          // Handle special effects
          if (projectile.weapon.special === 'area') {
            this.createAreaDamage(projectile.x, projectile.y, projectile.weapon.specialRadius || 100, enemies);
          }

          if (projectile.weapon.special === 'splash') {
            this.createSplashEffect(projectile.x, projectile.y, projectile.weapon.specialRadius || 80);
          }

          // Handle pierce
          if (projectile.weapon.special === 'pierce' && projectile.pierceRemaining) {
            projectile.pierceRemaining--;
            if (projectile.pierceRemaining <= 0) {
              projectile.active = false;
            }
          } else {
            // Normal projectile - destroy on hit
            projectile.active = false;
          }

          break;
        }
      }
    }

    return hits;
  }

  private createAreaDamage(x: number, y: number, radius: number, enemies: Phaser.GameObjects.Container[]): void {
    // Visual effect
    const circle = this.scene.add.graphics();
    circle.lineStyle(4, 0xFF6600, 1);
    circle.strokeCircle(x, y, radius);
    circle.setDepth(1600);

    this.scene.tweens.add({
      targets: circle,
      alpha: 0,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 500,
      onComplete: () => circle.destroy()
    });

    // Damage nearby enemies (handled by caller)
  }

  private createSplashEffect(x: number, y: number, radius: number): void {
    // Grease splash effect
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const splash = this.scene.add.graphics();
      splash.fillStyle(0xFFAA00, 0.8);
      splash.fillCircle(0, 0, 5);
      splash.setPosition(x, y);
      splash.setDepth(1599);

      this.scene.tweens.add({
        targets: splash,
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        alpha: 0,
        duration: 600,
        onComplete: () => splash.destroy()
      });
    }
  }

  public onProjectileHit(projectile: Projectile): number {
    // Return 1.5× coins on hit
    const returnAmount = Math.floor(projectile.costPaid * 1.5);

    // Show coin return feedback
    this.showCoinReturnFeedback(projectile.x, projectile.y, returnAmount, projectile.coinType);

    // Play sound (use existing collect sound)
    if (this.scene.sound.get('coin-collect')) {
      this.scene.sound.play('coin-collect', { volume: 0.6 });
    }

    return returnAmount;
  }

  private showCoinReturnFeedback(x: number, y: number, amount: number, coinType: string): void {
    const text = this.scene.add.text(x, y, `+${amount} ${coinType}`, {
      fontSize: '24px',
      color: '#00FF00',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    text.setDepth(9998);

    this.scene.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => text.destroy()
    });
  }

  private showMissedFeedback(projectile: Projectile): void {
    const text = this.scene.add.text(projectile.x, projectile.y, 'Rekt!', {
      fontSize: '20px',
      color: '#FF0000',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    text.setDepth(9998);

    this.scene.tweens.add({
      targets: text,
      alpha: 0,
      duration: 500,
      onComplete: () => text.destroy()
    });
  }

  public destroyProjectile(projectile: Projectile): void {
    projectile.active = false;
    if (projectile.sprite && projectile.sprite.active) {
      projectile.sprite.destroy();
    }
  }

  private playFireSound(weapon: Weapon): void {
    // Play weapon-specific sound (skip if not loaded)
    if (this.scene.sound.get('shoot')) {
      this.scene.sound.play('shoot', { volume: 0.4 });
    }
  }

  private playNoLiquiditySound(): void {
    console.log('🚫 No liquidity!');
    // Voice line: "You're out of liquidity!"
  }

  private playVoiceLine(type: string): void {
    // Placeholder for voice lines
    if (Math.random() < 0.1) { // 10% chance
      console.log('🗣️ "Deploying freedom!"');
    }
  }

  public getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  public getStats(): { shots: number; hits: number; misses: number; accuracy: number } {
    const accuracy = this.totalShots > 0 ? (this.totalHits / this.totalShots) * 100 : 0;
    return {
      shots: this.totalShots,
      hits: this.totalHits,
      misses: this.totalMisses,
      accuracy: Math.round(accuracy)
    };
  }

  public cleanup(): void {
    this.projectiles.forEach(p => {
      if (p.sprite && p.sprite.active) {
        p.sprite.destroy();
      }
    });
    this.projectiles = [];
  }

  public unlockValorBeam(): void {
    const valorBeam = this.weapons.get('valorBeam');
    if (valorBeam) {
      valorBeam.unlocked = true;
      console.log('✨ Valor Beam unlocked!');
    }
  }

  public lockValorBeam(): void {
    const valorBeam = this.weapons.get('valorBeam');
    if (valorBeam) {
      valorBeam.unlocked = false;
      // Switch to another weapon if currently using Valor Beam
      if (this.currentWeaponId === 'valorBeam') {
        this.currentWeaponId = 'freedomBolt';
      }
    }
  }
}
