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
}
