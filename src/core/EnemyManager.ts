/**
 * EnemyManager v3.8 (Simplified)
 *
 * Manages enemy spawning, wave control, and AI behavior
 */

import Phaser from 'phaser';
import { getEnemyDef, getPhaseSpawnPool, type EnemyDef } from '../config/Enemies';
import { calculateHPMultiplier, calculateEliteChance } from '../config/Difficulty';

export interface Enemy {
  sprite: Phaser.GameObjects.Sprite;
  enemyId: string;
  hp: number;
  maxHp: number;
  speed: number;
  aiType: string;
  isElite: boolean;
  active: boolean;
  aiData?: any; // AI-specific data (timers, targets, etc.)
}

export class EnemyManager {
  private scene: Phaser.Scene;
  private enemies: Enemy[] = [];

  // Spawn control
  private spawnTimer: number = 0;
  private spawnInterval: number = 2.0; // seconds
  private currentPhase: number = 1;

  // Difficulty tracking
  private gameStartTime: number = 0;

  // Callbacks
  private onEnemyDeathCallback?: (enemy: Enemy, x: number, y: number) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gameStartTime = 0; // v3.8: Initialize in init() with scene.time.now
  }

  public init(startPhase: number = 1): void {
    this.currentPhase = startPhase;
    this.spawnTimer = 0;
    this.enemies = [];
    // v3.8: Use scene.time.now instead of Date.now() - synced with game time!
    this.gameStartTime = this.scene.time.now;

    console.log('EnemyManager initialized');
  }

  /**
   * Update spawning and AI
   */
  public update(dt: number): void {
    const dtSeconds = dt / 1000;

    // Spawn enemies
    this.spawnTimer -= dtSeconds;
    if (this.spawnTimer <= 0) {
      this.spawnEnemy();
      this.spawnTimer = this.spawnInterval;
    }

    // Update AI for each enemy
    for (const enemy of this.enemies) {
      if (enemy.active) {
        this.updateAI(enemy, dtSeconds);
      }
    }
  }

  /**
   * Spawn a random enemy from current phase pool
   */
  private spawnEnemy(): void {
    // v3.8: Use scene.time.now for accurate game time
    const secondsElapsed = (this.scene.time.now - this.gameStartTime) / 1000;
    const hpMultiplier = calculateHPMultiplier(secondsElapsed);

    // Get spawn pool for current phase
    const spawnPool = getPhaseSpawnPool(this.currentPhase);
    if (spawnPool.length === 0) return;

    // Pick random enemy from pool
    const enemyId = Phaser.Math.RND.pick(spawnPool);
    const enemyDef = getEnemyDef(enemyId);
    if (!enemyDef) return;

    // Check for elite spawn
    const eliteChance = calculateEliteChance(secondsElapsed, 0.1);
    const isElite = Math.random() < eliteChance;

    // Spawn position (right side of screen)
    const x = this.scene.cameras.main.scrollX + this.scene.cameras.main.width + 50;
    const y = Phaser.Math.Between(100, this.scene.cameras.main.height - 100);

    // Create sprite
    const sprite = this.scene.physics.add.sprite(x, y, enemyDef.sprite || 'enemy-drone');
    sprite.setDepth(400);

    // Calculate HP with multiplier
    const baseHp = enemyDef.hp;
    const finalHp = Math.floor(baseHp * hpMultiplier * (isElite ? 2.0 : 1.0));

    // Create enemy data
    const enemy: Enemy = {
      sprite,
      enemyId: enemyDef.id,
      hp: finalHp,
      maxHp: finalHp,
      speed: enemyDef.speed,
      aiType: enemyDef.aiType,
      isElite,
      active: true,
      aiData: {}
    };

    // Elite visual
    if (isElite) {
      sprite.setTint(0xFF0000);
    }

    this.enemies.push(enemy);
  }

  /**
   * Update AI behavior
   */
  private updateAI(enemy: Enemy, dt: number): void {
    const sprite = enemy.sprite;
    const body = sprite.body as Phaser.Physics.Arcade.Body;

    switch (enemy.aiType) {
      case 'straight':
        // Move left
        body.setVelocityX(-enemy.speed);
        body.setVelocityY(0);
        break;

      case 'zigzag':
        // Move left with sine wave
        if (!enemy.aiData.time) enemy.aiData.time = 0;
        enemy.aiData.time += dt;
        body.setVelocityX(-enemy.speed);
        body.setVelocityY(Math.sin(enemy.aiData.time * 3) * 100);
        break;

      case 'sniper':
        // Move slowly, stop periodically
        if (!enemy.aiData.shootTimer) enemy.aiData.shootTimer = 2.0;
        enemy.aiData.shootTimer -= dt;

        if (enemy.aiData.shootTimer <= 0) {
          body.setVelocity(0, 0);
          enemy.aiData.shootTimer = 3.0;
        } else {
          body.setVelocityX(-enemy.speed * 0.5);
        }
        break;

      case 'swarm':
        // Move in group formation (v3.8: Use scene time, not Date.now()!)
        if (!enemy.aiData.swarmTime) enemy.aiData.swarmTime = 0;
        enemy.aiData.swarmTime += dt;
        body.setVelocityX(-enemy.speed);
        body.setVelocityY(Math.sin(enemy.aiData.swarmTime * 2) * 50);
        break;

      case 'shielded':
        // Move straight with shield
        body.setVelocityX(-enemy.speed * 0.8);
        body.setVelocityY(0);
        break;

      case 'exploder':
        // Move fast toward player
        body.setVelocityX(-enemy.speed);
        body.setVelocityY(0);
        break;

      default:
        // Default: move left
        body.setVelocityX(-enemy.speed);
        body.setVelocityY(0);
        break;
    }

    // Remove if out of bounds (left side)
    if (sprite.x < this.scene.cameras.main.scrollX - 100) {
      this.removeEnemy(enemy);
    }
  }

  /**
   * Damage an enemy
   */
  public damageEnemy(enemy: Enemy, damage: number): boolean {
    enemy.hp -= damage;

    // Visual feedback
    enemy.sprite.setTint(0xFF0000);
    this.scene.time.delayedCall(100, () => {
      if (enemy.isElite) {
        enemy.sprite.setTint(0xFF0000);
      } else {
        enemy.sprite.clearTint();
      }
    });

    // Check death
    if (enemy.hp <= 0) {
      this.killEnemy(enemy);
      return true;
    }

    return false;
  }

  /**
   * Kill an enemy
   */
  private killEnemy(enemy: Enemy): void {
    // Callback for drops/scoring
    if (this.onEnemyDeathCallback) {
      this.onEnemyDeathCallback(enemy, enemy.sprite.x, enemy.sprite.y);
    }

    // Explosion effect
    this.createExplosion(enemy.sprite.x, enemy.sprite.y);

    // Remove
    this.removeEnemy(enemy);
  }

  /**
   * Create explosion effect
   */
  private createExplosion(x: number, y: number): void {
    // Simple particle burst
    const particles = this.scene.add.particles(x, y, 'particle-white', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.5, end: 0 },
      lifespan: 500,
      quantity: 8,
      blendMode: 'ADD'
    });

    this.scene.time.delayedCall(500, () => {
      particles.destroy();
    });
  }

  /**
   * Remove enemy from scene
   */
  private removeEnemy(enemy: Enemy): void {
    enemy.active = false;
    enemy.sprite.destroy();

    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
    }
  }

  /**
   * Get all active enemies
   */
  public getEnemies(): Enemy[] {
    return this.enemies.filter(e => e.active);
  }

  /**
   * Set current phase
   */
  public setPhase(phase: number): void {
    this.currentPhase = phase;
    console.log(`EnemyManager: Phase ${phase}`);
  }

  /**
   * Set spawn interval (for difficulty scaling)
   */
  public setSpawnInterval(interval: number): void {
    this.spawnInterval = interval;
  }

  /**
   * Callbacks
   */
  public onEnemyDeath(callback: (enemy: Enemy, x: number, y: number) => void): void {
    this.onEnemyDeathCallback = callback;
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.enemies.forEach(e => e.sprite.destroy());
    this.enemies = [];
  }
}
