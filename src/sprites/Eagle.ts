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

    // Create animations if they don't exist
    this.createAnimations(scene);

    // Create eagle sprite from sprite sheet
    this.eagleSprite = scene.add.sprite(0, 0, 'eagle');

    // Scale appropriately for 1920x1080 (frames are 512x512)
    this.eagleSprite.setScale(0.18);

    // Add sprite to container
    this.add(this.eagleSprite);

    // Add to scene
    scene.add.existing(this);

    // Start flying animation automatically
    this.eagleSprite.play('eagle_fly');

    // Idle animation (subtle bobbing and rotation)
    this.createIdleAnimation();
  }

  private createAnimations(scene: Phaser.Scene): void {
    // Only create animations if they don't exist yet
    if (!scene.anims.exists('eagle_fly')) {
      // 🦅 EAGLE_FLY - Natural wing flapping (6 fps for smoother, slower movement)
      scene.anims.create({
        key: 'eagle_fly',
        frames: scene.anims.generateFrameNumbers('eagle', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
      });
    }

    if (!scene.anims.exists('eagle_dive')) {
      // 🦅 EAGLE_DIVE - Faster wing flapping for diving (10 fps)
      scene.anims.create({
        key: 'eagle_dive',
        frames: scene.anims.generateFrameNumbers('eagle', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
    }

    if (!scene.anims.exists('eagle_hit')) {
      // 🦅 EAGLE_HIT - Hit/damage frame (frame 3 only)
      scene.anims.create({
        key: 'eagle_hit',
        frames: [{ key: 'eagle', frame: 3 }],
        frameRate: 1,
        repeat: 0
      });
    }
  }

  public flap(): void {
    this.physicsBody.setVelocityY(GameConfig.flapVelocity);

    // Play wing flap sound for eagle flight
    this.scene.sound.play('wing-flap', { volume: 0.3 });

    // Briefly switch to dive animation for faster flapping
    this.eagleSprite.play('eagle_dive', true);

    // Return to normal fly animation after a short time
    this.scene.time.delayedCall(200, () => {
      if (this.eagleSprite && this.eagleSprite.anims) {
        this.eagleSprite.play('eagle_fly', true);
      }
    });

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
      scaleY: 0.20,
      duration: 100,
      yoyo: true
    });
  }

  private createIdleAnimation(): void {
    // Subtle bobbing animation - slower and gentler
    this.scene.tweens.add({
      targets: this.eagleSprite,
      y: -2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Subtle rotation - slower and gentler
    this.scene.tweens.add({
      targets: this,
      angle: 2,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  public playHitAnimation(): void {
    // Show hit frame
    this.eagleSprite.play('eagle_hit', true);

    // Blink effect with alpha toggle (200ms intervals)
    let blinkCount = 0;
    const blinkInterval = this.scene.time.addEvent({
      delay: 200,
      repeat: 2,
      callback: () => {
        blinkCount++;
        this.eagleSprite.setAlpha(blinkCount % 2 === 0 ? 0.3 : 1.0);
      }
    });

    // Return to normal after blinking
    this.scene.time.delayedCall(600, () => {
      this.eagleSprite.setAlpha(1.0);
      this.eagleSprite.play('eagle_fly', true);
      blinkInterval.remove();
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
