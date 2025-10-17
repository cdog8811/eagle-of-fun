import Phaser from 'phaser';
import { GameConfig } from '../config/GameConfig';

export class Obstacle extends Phaser.GameObjects.Graphics {
  private width: number = 60;
  private obstacleHeight: number;
  private obstacleType: 'top' | 'bottom';

  constructor(scene: Phaser.Scene, x: number, y: number, height: number, type: 'top' | 'bottom') {
    super(scene);

    this.x = x;
    this.y = y;
    this.obstacleHeight = height;
    this.obstacleType = type;

    this.drawObstacle();
    scene.add.existing(this);
  }

  private drawObstacle(): void {
    // FUD Cloud style obstacle
    const types = ['fud', 'rocket', 'bearWall'];
    const obstacleStyle = types[Math.floor(Math.random() * types.length)];

    if (obstacleStyle === 'fud') {
      // FUD Cloud
      this.fillStyle(0x808080, 0.8);
      this.fillRoundedRect(-this.width / 2, 0, this.width, this.obstacleHeight, 10);

      // Add FUD text
      const fudTexts = ['REKT', 'RUG', 'TAX', 'BEAR', 'FUD'];
      const text = fudTexts[Math.floor(Math.random() * fudTexts.length)];

      // Note: We'll add text as a separate Text object in the scene
      const textObj = this.scene.add.text(this.x, this.y + this.obstacleHeight / 2, text, {
        fontSize: '14px',
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      // Store reference to destroy with obstacle
      (this as any).textObj = textObj;

    } else if (obstacleStyle === 'rocket') {
      // FUD Rocket
      this.fillStyle(0xFF4444, 0.9);
      this.fillTriangle(
        0, 0,
        -this.width / 2, this.obstacleHeight,
        this.width / 2, this.obstacleHeight
      );

    } else {
      // Bear Market Wall (red candles)
      this.fillStyle(0xE63946, 1);
      this.fillRect(-this.width / 2, 0, this.width, this.obstacleHeight);

      // Add candle wick
      this.lineStyle(2, 0xFFFFFF, 1);
      this.strokeRect(-this.width / 2, 0, this.width, this.obstacleHeight);
    }
  }

  public getBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(
      this.x - this.width / 2,
      this.y,
      this.width,
      this.obstacleHeight
    );
  }

  public destroy(fromScene?: boolean): void {
    // Destroy associated text if exists
    if ((this as any).textObj) {
      (this as any).textObj.destroy();
    }
    super.destroy(fromScene);
  }
}
