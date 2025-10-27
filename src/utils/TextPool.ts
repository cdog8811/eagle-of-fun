import Phaser from 'phaser';

/**
 * Object Pool for Text objects - Performance optimization
 *
 * Instead of creating/destroying text objects constantly,
 * we reuse them from a pool. This eliminates:
 * - Memory allocation overhead
 * - Garbage collection spikes
 * - Object creation time
 *
 * Usage:
 * const text = textPool.acquire(x, y, content, style);
 * // ... animate text ...
 * textPool.release(text); // Return to pool when done
 */
export class TextPool {
  private scene: Phaser.Scene;
  private pool: Phaser.GameObjects.Text[] = [];
  private active: Set<Phaser.GameObjects.Text> = new Set();
  private maxPoolSize: number = 50; // Maximum objects to keep in pool

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Get a text object from the pool (or create new if pool empty)
   */
  acquire(
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle
  ): Phaser.GameObjects.Text {
    let textObj: Phaser.GameObjects.Text;

    if (this.pool.length > 0) {
      // Reuse from pool
      textObj = this.pool.pop()!;
      textObj.setPosition(x, y);
      textObj.setText(text);
      textObj.setStyle(style);
      textObj.setActive(true);
      textObj.setVisible(true);
      textObj.setAlpha(1);
      textObj.setScale(1);
    } else {
      // Create new
      textObj = this.scene.add.text(x, y, text, style);
    }

    textObj.setOrigin(0.5);
    this.active.add(textObj);
    return textObj;
  }

  /**
   * Return a text object to the pool for reuse
   */
  release(textObj: Phaser.GameObjects.Text): void {
    if (!textObj) return;

    // Stop any active tweens on this object
    this.scene.tweens.killTweensOf(textObj);

    // Reset state
    textObj.setActive(false);
    textObj.setVisible(false);
    textObj.setAlpha(1);
    textObj.setScale(1);

    // Remove from active set
    this.active.delete(textObj);

    // Return to pool if not at max size
    if (this.pool.length < this.maxPoolSize) {
      this.pool.push(textObj);
    } else {
      // Pool is full, destroy the object
      textObj.destroy();
    }
  }

  /**
   * Clean up all pooled objects (call on scene shutdown)
   */
  destroy(): void {
    // Destroy all pooled objects
    this.pool.forEach(obj => obj.destroy());
    this.pool = [];

    // Destroy all active objects
    this.active.forEach(obj => obj.destroy());
    this.active.clear();
  }

  /**
   * Get pool statistics for debugging
   */
  getStats(): { poolSize: number; activeSize: number } {
    return {
      poolSize: this.pool.length,
      activeSize: this.active.size
    };
  }
}
