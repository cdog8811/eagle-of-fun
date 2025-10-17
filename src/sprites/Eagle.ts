import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

export class Eagle extends Phaser.GameObjects.Container {
  private eagleSprite: Phaser.GameObjects.Sprite;
  private physicsBody: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // Add physics
    scene.physics.world.enable(this);
    this.physicsBody = this.body as Phaser.Physics.Arcade.Body;
    this.physicsBody.setGravityY(GameConfig.gravity);
    this.physicsBody.setSize(80, 80); // Adjusted for image size

    // Create eagle sprite from loaded image
    this.eagleSprite = scene.add.sprite(0, 0, 'player-eagle');

    // Scale to bigger size for 1920x1080
    this.eagleSprite.setScale(0.35);

    // Add sprite to container
    this.add(this.eagleSprite);

    // Add to scene
    scene.add.existing(this);

    // Idle animation
    this.createIdleAnimation();
  }

  public flap(): void {
    this.physicsBody.setVelocityY(GameConfig.flapVelocity);

    // Flap animation - tilt up when flapping
    this.scene.tweens.add({
      targets: this,
      angle: -15,
      duration: 100,
      yoyo: true,
      ease: 'Quad.easeOut'
    });

    // Scale animation for flapping effect
    this.scene.tweens.add({
      targets: this.eagleSprite,
      scaleY: 0.38,
      duration: 100,
      yoyo: true
    });
  }

  private createIdleAnimation(): void {
    // Subtle bobbing animation
    this.scene.tweens.add({
      targets: this.eagleSprite,
      y: -3,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Subtle rotation
    this.scene.tweens.add({
      targets: this,
      angle: 3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  public getBounds(): Phaser.Geom.Rectangle {
    // Adjusted bounds for the scaled eagle sprite
    const width = 60;
    const height = 60;
    return new Phaser.Geom.Rectangle(
      this.x - width / 2,
      this.y - height / 2,
      width,
      height
    );
  }
}
