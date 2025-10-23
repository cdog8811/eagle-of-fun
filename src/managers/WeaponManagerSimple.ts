// ============================
// Eagle of Fun v3.0 - Simple Weapon Manager
// Using simple circles instead of Graphics objects
// ============================

export class WeaponManagerSimple {
  private scene: Phaser.Scene;
  private weaponCharge: number = 100;
  private lastFireTime: number = 0;
  private fireCooldown: number = 500; // ms

  // Simple projectile arrays
  private projectiles: Phaser.GameObjects.Arc[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public getWeaponCharge(): number {
    return this.weaponCharge;
  }

  public getCurrentWeapon(): any {
    // Return simple weapon info for UI
    return {
      id: 'feather-blaster',
      name: 'Feather Blaster',
      cooldown: this.fireCooldown,
      coinCost: 5
    };
  }

  public switchWeapon(direction: number): void {
    // Placeholder for future weapon switching
    // Currently only one weapon available
  }

  public reload(availableCoins: number): boolean {
    const weapon = this.getCurrentWeapon();
    if (availableCoins >= weapon.coinCost && this.weaponCharge < 100) {
      this.weaponCharge = 100;
      return true;
    }
    return false;
  }

  public addCharge(coins: number): void {
    this.weaponCharge = Math.min(100, this.weaponCharge + (coins * 5));
  }

  public canFire(): boolean {
    const now = Date.now();
    return this.weaponCharge >= 20 && (now - this.lastFireTime) >= this.fireCooldown;
  }

  public fire(x: number, y: number, angle: number = 0): void {
    if (!this.canFire()) return;

    // Consume charge
    this.weaponCharge = Math.max(0, this.weaponCharge - 20);
    this.lastFireTime = Date.now();

    // Fire 3 simple projectiles
    for (let i = 0; i < 3; i++) {
      const spread = (i - 1) * 15; // -15, 0, 15 degrees
      const projectileAngle = angle + spread;

      // Create simple circle projectile
      const projectile = this.scene.add.circle(x, y, 8, 0xFFD700);
      projectile.setDepth(500);

      // Store velocity
      const speed = 600;
      (projectile as any).velocityX = Math.cos(Phaser.Math.DegToRad(projectileAngle)) * speed;
      (projectile as any).velocityY = Math.sin(Phaser.Math.DegToRad(projectileAngle)) * speed;
      (projectile as any).damage = 10;

      this.projectiles.push(projectile);
    }
  }

  public update(delta: number): void {
    if (!this.scene || !this.scene.cameras || !this.scene.cameras.main) return;

    const cam = this.scene.cameras.main;
    const toRemove: Phaser.GameObjects.Arc[] = [];

    // Update projectiles (don't modify array during iteration)
    for (let i = 0; i < this.projectiles.length; i++) {
      const proj = this.projectiles[i];

      if (!proj || !proj.active) {
        toRemove.push(proj);
        continue;
      }

      try {
        // Move projectile
        const vx = (proj as any).velocityX;
        const vy = (proj as any).velocityY;

        if (vx !== undefined) proj.x += vx * (delta / 1000);
        if (vy !== undefined) proj.y += vy * (delta / 1000);

        // Remove if off screen
        if (proj.x < -50 || proj.x > cam.width + 50 ||
            proj.y < -50 || proj.y > cam.height + 50) {
          toRemove.push(proj);
        }
      } catch (e) {
        toRemove.push(proj);
      }
    }

    // Clean up off-screen projectiles
    toRemove.forEach(proj => {
      const index = this.projectiles.indexOf(proj);
      if (index > -1) {
        this.projectiles.splice(index, 1);
      }
      try {
        if (proj && proj.active) proj.destroy();
      } catch (e) {
        // Silently ignore
      }
    });
  }

  public getProjectiles(): Phaser.GameObjects.Arc[] {
    return this.projectiles;
  }

  public removeProjectile(proj: Phaser.GameObjects.Arc): void {
    const index = this.projectiles.indexOf(proj);
    if (index > -1) {
      this.projectiles.splice(index, 1);
    }
    if (proj && proj.active) {
      proj.destroy();
    }
  }

  public getProjectileGroups(): any {
    // For compatibility with collision detection code
    return {
      featherGroup: this.projectiles
    };
  }

  public unlockWeapon(level: number): void {
    // Placeholder - currently only one weapon available
    // Future: unlock more weapons based on level
  }

  public destroy(): void {
    this.projectiles.forEach(p => {
      if (p && p.active) p.destroy();
    });
    this.projectiles = [];
  }
}
