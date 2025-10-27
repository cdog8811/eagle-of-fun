import Phaser from 'phaser';

/**
 * Object Pool for Graphics objects (particles, effects)
 *
 * Reuses graphics objects to avoid constant creation/destruction
 */
export class GraphicsPool {
  private scene: Phaser.Scene;
  private pool: Phaser.GameObjects.Graphics[] = [];
  private active: Set<Phaser.GameObjects.Graphics> = new Set();
  private maxPoolSize: number = 30;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Get a graphics object from the pool
   */
  acquire(): Phaser.GameObjects.Graphics {
    let graphics: Phaser.GameObjects.Graphics;

    if (this.pool.length > 0) {
      // Reuse from pool
      graphics = this.pool.pop()!;
      graphics.clear();
      graphics.setActive(true);
      graphics.setVisible(true);
      graphics.setAlpha(1);
      graphics.setScale(1);
    } else {
      // Create new
      graphics = this.scene.add.graphics();
    }

    this.active.add(graphics);
    return graphics;
  }

  /**
   * Return a graphics object to the pool
   */
  release(graphics: Phaser.GameObjects.Graphics): void {
    if (!graphics) return;

    // Stop any active tweens
    this.scene.tweens.killTweensOf(graphics);

    // Reset state
    graphics.clear();
    graphics.setActive(false);
    graphics.setVisible(false);
    graphics.setAlpha(1);
    graphics.setScale(1);

    // Remove from active set
    this.active.delete(graphics);

    // Return to pool if not at max size
    if (this.pool.length < this.maxPoolSize) {
      this.pool.push(graphics);
    } else {
      graphics.destroy();
    }
  }

  /**
   * Clean up all pooled objects
   */
  destroy(): void {
    this.pool.forEach(obj => obj.destroy());
    this.pool = [];
    this.active.forEach(obj => obj.destroy());
    this.active.clear();
  }

  /**
   * Get pool statistics
   */
  getStats(): { poolSize: number; activeSize: number } {
    return {
      poolSize: this.pool.length,
      activeSize: this.active.size
    };
  }

  /**
   * Create a simple explosion effect using Phaser's optimized particle system
   * v3.8: This is performant because Phaser handles particle pooling internally!
   */
  createExplosion(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config?: {
      count?: number;
      color?: number;
      speed?: { min: number; max: number };
      lifespan?: number;
      scale?: number;
    }
  ): void {
    const cfg = {
      count: 8,
      color: 0xFFFFFF,
      speed: { min: 100, max: 200 },
      lifespan: 500,
      scale: 0.5,
      ...config
    };

    // v3.8 OPTIMIZED: Use Phaser's particle system (auto-pooled!)
    // Create a simple circle texture if not exists
    const textureName = `particle_${cfg.color.toString(16)}`;
    if (!scene.textures.exists(textureName)) {
      const graphics = scene.make.graphics({});
      graphics.fillStyle(cfg.color, 1);
      graphics.fillCircle(4, 4, 4);
      graphics.generateTexture(textureName, 8, 8);
      graphics.destroy();
    }

    // Create particle emitter (one-shot explosion)
    const particles = scene.add.particles(x, y, textureName, {
      speed: cfg.speed,
      scale: { start: cfg.scale, end: 0 },
      lifespan: cfg.lifespan,
      quantity: cfg.count,
      blendMode: 'ADD',
      emitting: false // Don't auto-emit, we'll explode once
    });

    // Explode and auto-destroy
    particles.explode(cfg.count);

    // Auto cleanup after lifespan
    scene.time.delayedCall(cfg.lifespan + 100, () => {
      particles.destroy();
    });
  }
}
