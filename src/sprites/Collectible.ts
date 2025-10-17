import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

export class Collectible extends Phaser.GameObjects.Container {
  public coinType: string;
  private coinSprite: Phaser.GameObjects.Sprite | Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, type: string) {
    super(scene, x, y);

    this.coinType = type;

    // Create coin sprite from image or fallback to graphics
    this.coinSprite = this.createCoin();
    this.add(this.coinSprite);

    scene.add.existing(this);

    // Floating animation
    scene.tweens.add({
      targets: this,
      y: this.y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Rotation animation
    scene.tweens.add({
      targets: this,
      angle: 360,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });

    // Subtle pulse animation - much less aggressive
    scene.tweens.add({
      targets: this.coinSprite,
      scale: 1.02,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createCoin(): Phaser.GameObjects.Sprite | Phaser.GameObjects.Graphics {
    let imageKey: string | null = null;
    let scale = 0.04; // Smaller coins - better proportion to player

    switch (this.coinType) {
      case 'AOL':
        imageKey = 'coin-aol';
        scale = 0.04;
        break;
      case 'BURGER':
        imageKey = 'coin-burger';
        scale = 0.03;
        break;
      case 'USD1':
        // Use jeet image as placeholder for USD1
        imageKey = 'jeet';
        scale = 0.04;
        break;
    }

    // Try to load sprite, fallback to graphics if not available
    if (imageKey && this.scene.textures.exists(imageKey)) {
      const sprite = this.scene.add.sprite(0, 0, imageKey);
      sprite.setScale(scale);
      return sprite;
    } else {
      // Fallback to graphics
      return this.drawCoinGraphics();
    }
  }

  private drawCoinGraphics(): Phaser.GameObjects.Graphics {
    let color: number;

    switch (this.coinType) {
      case 'AOL':
        color = 0xFBB13C; // Gold
        break;
      case 'BURGER':
        color = 0xFF6B35; // Orange
        break;
      case 'USD1':
        color = 0x4CAF50; // Green
        break;
      default:
        color = 0xFBB13C;
    }

    const graphic = this.scene.add.graphics();
    graphic.fillStyle(color, 1);
    graphic.fillCircle(0, 0, 20);
    graphic.lineStyle(3, 0xFFFFFF, 1);
    graphic.strokeCircle(0, 0, 20);

    return graphic;
  }

  public getBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(
      this.x - 20,
      this.y - 20,
      40,
      40
    );
  }
}
