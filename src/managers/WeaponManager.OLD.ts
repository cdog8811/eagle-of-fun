// ============================
// Eagle of Fun v3.0 - Weapon Manager
// ============================

import { WEAPONS, WEAPON_UPGRADES, WEAPON_CHARGE_PER_COIN, Weapon, WeaponUpgrade } from '../config/WeaponsConfig';

export class WeaponManager {
  private scene: Phaser.Scene;
  private weapons: Weapon[];
  private currentWeaponIndex: number;
  private weaponCharge: number; // 0-100%
  private weaponCooldowns: Map<string, number>; // weaponId -> cooldown timestamp
  private weaponTiers: Map<string, number>; // weaponId -> current tier
  private unlockedWeapons: Set<string>;

  // Projectile arrays instead of groups
  private feathers: Phaser.GameObjects.Graphics[] = [];
  private pulses: Phaser.GameObjects.Graphics[] = [];
  private bombs: Phaser.GameObjects.Graphics[] = [];
  private beams: Phaser.GameObjects.Graphics[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.weapons = [...WEAPONS];
    this.currentWeaponIndex = 0;
    this.weaponCharge = 100; // Start fully charged
    this.weaponCooldowns = new Map();
    this.weaponTiers = new Map();
    this.unlockedWeapons = new Set(['feather-blaster']); // Start with basic weapon

    // Initialize tiers
    WEAPONS.forEach(weapon => {
      this.weaponTiers.set(weapon.id, 1);
    });

    this.loadProgress();
  }

  private loadProgress(): void {
    const saved = localStorage.getItem('eagleOfFun_weapons');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.unlockedWeapons = new Set(data.unlockedWeapons || ['feather-blaster']);
        this.weaponTiers = new Map(data.weaponTiers || []);
      } catch (e) {
        console.error('Failed to load weapon progress:', e);
      }
    }
  }

  public saveProgress(): void {
    const data = {
      unlockedWeapons: Array.from(this.unlockedWeapons),
      weaponTiers: Array.from(this.weaponTiers.entries())
    };
    localStorage.setItem('eagleOfFun_weapons', JSON.stringify(data));
  }

  public getCurrentWeapon(): Weapon {
    return this.weapons[this.currentWeaponIndex];
  }

  public getWeaponCharge(): number {
    return this.weaponCharge;
  }

  public addCharge(coins: number): void {
    const chargeAdded = coins * WEAPON_CHARGE_PER_COIN;
    this.weaponCharge = Math.min(100, this.weaponCharge + chargeAdded);
  }

  public canFire(): boolean {
    const weapon = this.getCurrentWeapon();

    // Check if weapon is unlocked
    if (!this.unlockedWeapons.has(weapon.id)) {
      return false;
    }

    // Check charge
    if (this.weaponCharge < 20) { // Need at least 20% to fire
      return false;
    }

    // Check cooldown
    const lastFired = this.weaponCooldowns.get(weapon.id) || 0;
    const tier = this.weaponTiers.get(weapon.id) || 1;
    const upgrade = WEAPON_UPGRADES[weapon.id]?.[tier - 1];
    const cooldownReduction = upgrade?.cooldownReduction || 0;
    const actualCooldown = weapon.cooldown * (1 - cooldownReduction / 100);

    return Date.now() - lastFired >= actualCooldown;
  }

  public fire(x: number, y: number, angle: number = 0): void {
    console.log('WeaponManager.fire() called', { x, y, angle });

    if (!this.canFire()) {
      console.log('Cannot fire - check failed');
      return;
    }

    const weapon = this.getCurrentWeapon();
    console.log('Firing weapon:', weapon.id);

    // Consume charge
    this.weaponCharge = Math.max(0, this.weaponCharge - 20);

    // Update cooldown
    this.weaponCooldowns.set(weapon.id, Date.now());

    // Fire weapon based on type
    try {
      switch (weapon.id) {
        case 'feather-blaster':
          console.log('Calling fireFeatherBlaster');
          this.fireFeatherBlaster(x, y, angle);
          console.log('fireFeatherBlaster done');
          break;
        case 'aol-pulse':
          this.fireAOLPulse(x, y);
          break;
        case 'burger-bomb':
          this.fireBurgerBomb(x, y, angle);
          break;
        case 'valor-beam':
          this.fireValorBeam(x, y, angle);
          break;
        case 'buyback-nova':
          this.fireBuybackNova(x, y);
          break;
      }
      console.log('Weapon fired successfully');
    } catch (e) {
      console.error('Error firing weapon:', e);
      throw e;
    }
  }

  private fireFeatherBlaster(x: number, y: number, angle: number): void {
    try {
      const tier = this.weaponTiers.get('feather-blaster') || 1;
      const featherCount = tier >= 4 ? 5 : 3;

      for (let i = 0; i < featherCount; i++) {
        const spread = (i - Math.floor(featherCount / 2)) * 15; // degrees
        const featherAngle = angle + spread;

        const feather = this.scene.add.graphics();
        feather.fillStyle(0xFFD700, 1);
        feather.fillRect(0, -2, 20, 4);
        feather.setPosition(x, y);
        feather.setRotation(Phaser.Math.DegToRad(featherAngle));
        feather.setDepth(500);

        // Store velocity on data
        (feather as any).velocityX = Math.cos(Phaser.Math.DegToRad(featherAngle)) * 600;
        (feather as any).velocityY = Math.sin(Phaser.Math.DegToRad(featherAngle)) * 600;
        (feather as any).damage = 10 * (tier >= 2 ? 1.2 : 1);

        this.feathers.push(feather);
      }
    } catch (e) {
      console.error('Error in fireFeatherBlaster:', e);
    }
  }

  private fireAOLPulse(x: number, y: number): void {
    const tier = this.weaponTiers.get('aol-pulse') || 1;
    const pulseCount = tier >= 5 ? 2 : 1;

    for (let p = 0; p < pulseCount; p++) {
      const pulse = this.scene.add.graphics();
      pulse.lineStyle(6, 0x3B82F6, 1);
      pulse.strokeRect(-30, -20, 60, 40);
      pulse.lineStyle(4, 0xEF4444, 1);
      pulse.strokeRect(-28, -18, 56, 36);
      pulse.setPosition(x + (p * 50), y);
      pulse.setDepth(500);

      (pulse as any).width = tier >= 4 ? 100 : 60;
      (pulse as any).damage = 15 * (tier >= 2 ? 1.3 : 1);
      (pulse as any).velocityX = 400;

      this.pulses.push(pulse);

      // Animate expansion with safety check
      this.scene.tweens.add({
        targets: pulse,
        scaleX: tier >= 4 ? 2 : 1.5,
        scaleY: tier >= 4 ? 2 : 1.5,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          if (pulse && pulse.active) {
            pulse.destroy();
          }
        }
      });
    }
  }

  private fireBurgerBomb(x: number, y: number, angle: number): void {
    const tier = this.weaponTiers.get('burger-bomb') || 1;

    const bomb = this.scene.add.graphics();
    bomb.fillStyle(0xFFA500, 1);
    bomb.fillCircle(0, 0, 15);
    bomb.fillStyle(0xFF6B6B, 1);
    bomb.fillCircle(0, -5, 8);
    bomb.setPosition(x, y);
    bomb.setDepth(500);

    (bomb as any).velocityX = Math.cos(Phaser.Math.DegToRad(angle)) * 300;
    (bomb as any).velocityY = Math.sin(Phaser.Math.DegToRad(angle)) * 300;
    (bomb as any).damage = 25 * (tier >= 2 ? 1.25 : 1);
    (bomb as any).explosionRadius = tier >= 4 ? 150 : 100;

    this.bombs.push(bomb);

    // Auto-explode after 2 seconds
    this.scene.time.delayedCall(2000, () => {
      if (bomb && bomb.active) {
        this.explodeBomb(bomb);
      }
    });
  }

  private explodeBomb(bomb: Phaser.GameObjects.Graphics): void {
    if (!bomb || !bomb.active) return;

    const x = bomb.x;
    const y = bomb.y;
    const radius = (bomb as any).explosionRadius || 100;

    // Create explosion visual
    const explosion = this.scene.add.graphics();
    explosion.fillStyle(0xFF6B00, 0.8);
    explosion.fillCircle(x, y, radius);
    explosion.setDepth(501);

    this.scene.tweens.add({
      targets: explosion,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        if (explosion && explosion.active) {
          explosion.destroy();
        }
      }
    });

    bomb.destroy();
  }

  private fireValorBeam(x: number, y: number, angle: number): void {
    const tier = this.weaponTiers.get('valor-beam') || 1;
    const duration = tier >= 4 ? 3000 : 2000;

    const beam = this.scene.add.graphics();
    beam.lineStyle(20, 0xFFD700, 0.8);
    beam.lineBetween(0, 0, 800, 0);
    beam.setPosition(x, y);
    beam.setRotation(Phaser.Math.DegToRad(angle));
    beam.setDepth(500);

    (beam as any).damage = 50 * (tier >= 2 ? 1.5 : 1);
    (beam as any).bossDamageMultiplier = 3;

    this.beams.push(beam);

    // Screen glow effect
    const glow = this.scene.add.rectangle(
      this.scene.cameras.main.width / 2,
      this.scene.cameras.main.height / 2,
      this.scene.cameras.main.width,
      this.scene.cameras.main.height,
      0xFFD700,
      0.2
    );
    glow.setDepth(499);

    // Fade out beam with safety checks
    this.scene.time.delayedCall(duration, () => {
      if (beam && beam.active) {
        beam.destroy();
      }
      if (glow && glow.active) {
        glow.destroy();
      }
    });
  }

  private fireBuybackNova(x: number, y: number): void {
    const tier = this.weaponTiers.get('buyback-nova') || 1;
    const radius = tier >= 4 ? 800 : 600;

    // Patriotic explosion effect
    const nova = this.scene.add.graphics();
    nova.fillStyle(0x3B82F6, 0.7);
    nova.fillCircle(x, y, 50);
    nova.setDepth(502);

    this.scene.tweens.add({
      targets: nova,
      scaleX: radius / 50,
      scaleY: radius / 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        if (nova && nova.active) {
          nova.destroy();
        }
      }
    });

    // Red flash
    const flash = this.scene.add.graphics();
    flash.fillStyle(0xEF4444, 0.5);
    flash.fillCircle(x, y, 50);
    flash.setDepth(503);

    this.scene.tweens.add({
      targets: flash,
      scaleX: radius / 50,
      scaleY: radius / 50,
      alpha: 0,
      duration: 1000,
      delay: 100,
      onComplete: () => {
        if (flash && flash.active) {
          flash.destroy();
        }
      }
    });

    // Store damage info for collision detection
    (nova as any).damage = 100 * (tier >= 2 ? 1.5 : 1);
    (nova as any).radius = radius;
  }

  public switchWeapon(direction: number): void {
    const unlockedList = Array.from(this.unlockedWeapons);
    if (unlockedList.length <= 1) return;

    let newIndex = this.currentWeaponIndex + direction;
    if (newIndex < 0) newIndex = this.weapons.length - 1;
    if (newIndex >= this.weapons.length) newIndex = 0;

    // Make sure new weapon is unlocked
    while (!this.unlockedWeapons.has(this.weapons[newIndex].id)) {
      newIndex += direction;
      if (newIndex < 0) newIndex = this.weapons.length - 1;
      if (newIndex >= this.weapons.length) newIndex = 0;
    }

    this.currentWeaponIndex = newIndex;
  }

  public reload(coins: number): boolean {
    const weapon = this.getCurrentWeapon();
    if (coins >= weapon.coinCost) {
      this.weaponCooldowns.set(weapon.id, 0); // Reset cooldown
      this.weaponCharge = 100; // Full charge
      return true;
    }
    return false;
  }

  public unlockWeapon(level: number): void {
    WEAPONS.forEach(weapon => {
      if (weapon.unlockLevel <= level) {
        this.unlockedWeapons.add(weapon.id);
      }
    });
    this.saveProgress();
  }

  public update(delta: number): void {
    if (!this.scene || !this.scene.cameras || !this.scene.cameras.main) return;

    // Update feathers
    this.feathers = this.feathers.filter(feather => {
      if (!feather || !feather.active) return false;

      try {
        if ((feather as any).velocityX !== undefined) {
          feather.x += (feather as any).velocityX * (delta / 1000);
        }
        if ((feather as any).velocityY !== undefined) {
          feather.y += (feather as any).velocityY * (delta / 1000);
        }

        // Remove if off screen
        if (feather.x < -100 || feather.x > this.scene.cameras.main.width + 100 ||
            feather.y < -100 || feather.y > this.scene.cameras.main.height + 100) {
          feather.destroy();
          return false;
        }
        return true;
      } catch (e) {
        return false;
      }
    });

    // Update pulses
    this.pulses = this.pulses.filter(pulse => {
      if (!pulse || !pulse.active) return false;

      try {
        if ((pulse as any).velocityX !== undefined) {
          pulse.x += (pulse as any).velocityX * (delta / 1000);
        }
        return true;
      } catch (e) {
        return false;
      }
    });

    // Update bombs
    this.bombs = this.bombs.filter(bomb => {
      if (!bomb || !bomb.active) return false;

      try {
        if ((bomb as any).velocityX !== undefined) {
          bomb.x += (bomb as any).velocityX * (delta / 1000);
        }
        if ((bomb as any).velocityY !== undefined) {
          bomb.y += (bomb as any).velocityY * (delta / 1000);
          (bomb as any).velocityY += 200 * (delta / 1000); // Gravity
        }
        return true;
      } catch (e) {
        return false;
      }
    });

    // Clean up inactive beams
    this.beams = this.beams.filter(beam => beam && beam.active);
  }

  public getProjectileGroups(): {
    feathers: Phaser.GameObjects.Graphics[];
    pulses: Phaser.GameObjects.Graphics[];
    bombs: Phaser.GameObjects.Graphics[];
    beams: Phaser.GameObjects.Graphics[];
  } {
    return {
      feathers: this.feathers,
      pulses: this.pulses,
      bombs: this.bombs,
      beams: this.beams
    };
  }

  public destroy(): void {
    this.feathers.forEach(f => { if (f && f.active) f.destroy(); });
    this.pulses.forEach(p => { if (p && p.active) p.destroy(); });
    this.bombs.forEach(b => { if (b && b.active) b.destroy(); });
    this.beams.forEach(b => { if (b && b.active) b.destroy(); });

    this.feathers = [];
    this.pulses = [];
    this.bombs = [];
    this.beams = [];
  }
}
