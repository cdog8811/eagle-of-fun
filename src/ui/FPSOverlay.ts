import Phaser from 'phaser';

export class FPSOverlay extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene) {
    super(scene, 20, 20, 'FPS: --', {
      font: '18px Courier New',
      color: '#00FF00',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });

    scene.add.existing(this);
    this.setDepth(10000);
    this.setScrollFactor(0);
  }

  update() {
    const fps = Math.round(this.scene.game.loop.actualFps);
    const target = this.scene.game.loop.targetFps;

    // Color coding based on performance
    let color = '#00FF00'; // Green for good FPS
    if (fps < 50) {
      color = '#FFFF00'; // Yellow for moderate
    }
    if (fps < 40) {
      color = '#FF4444'; // Red for poor
    }

    this.setText(`FPS: ${fps}/${target}`);
    this.setColor(color);
  }
}
