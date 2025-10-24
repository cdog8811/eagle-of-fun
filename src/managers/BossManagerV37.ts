// ============================
// Eagle of Fun v3.7 - Boss Combat System
// Bear Market Boss - 3 Phase System
// ============================

import Phaser from 'phaser';

export interface BossPhase {
  id: number;
  name: string;
  minHP: number;
  maxHP: number;
  behavior: string;
  attackPattern: string;
  speed: number;
  attackInterval: number;
}

export class BossManagerV37 {
  private scene: Phaser.Scene;
  private boss: Phaser.GameObjects.Container | null = null;
  private bossSprite: Phaser.GameObjects.Image | null = null;
  private bossActive: boolean = false;
  private bossHP: number = 13;
  private maxBossHP: number = 13;
  private currentPhase: number = 1;
  private lastAttackTime: number = 0;
  private healthBar: Phaser.GameObjects.Graphics | null = null;
  private healthBarBg: Phaser.GameObjects.Graphics | null = null;
  private bossNameText: Phaser.GameObjects.Text | null = null;
  private phaseText: Phaser.GameObjects.Text | null = null;

  // Attack projectiles
  private redCandles: Phaser.GameObjects.Container[] = [];
  private lawsuitPapers: Phaser.GameObjects.Container[] = [];

  // Boss phases
  private phases: BossPhase[] = [
    {
      id: 1,
      name: 'Phase 1: Market Entry',
      minHP: 9,
      maxHP: 13,
      behavior: 'horizontal',
      attackPattern: 'red_candles',
      speed: 150,
      attackInterval: 3000
    },
    {
      id: 2,
      name: 'Phase 2: Regulation Storm',
      minHP: 4,
      maxHP: 8,
      behavior: 'aggressive',
      attackPattern: 'lawsuit_papers',
      speed: 200,
      attackInterval: 2000
    },
    {
      id: 3,
      name: 'Phase 3: BEAR RAGE',
      minHP: 0,
      maxHP: 3,
      behavior: 'roar_attack',
      attackPattern: 'screen_shake',
      speed: 250,
      attackInterval: 1500
    }
  ];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public spawnBoss(x: number, y: number): void {
    if (this.bossActive) return;

    console.log('🐻 BEAR MARKET BOSS SPAWNING!');

    // Boss warning
    this.showBossWarning();

    // Create boss after warning
    this.scene.time.delayedCall(2000, () => {
      this.createBoss(x, y);
    });
  }

  private showBossWarning(): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Dark overlay
    const overlay = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    );
    overlay.setDepth(9990);

    // Warning text
    const warningText = this.scene.add.text(width / 2, height / 2, '⚠️ BOSS INCOMING! ⚠️\nMARKET CRASH IMMINENT!', {
      fontSize: '64px',
      color: '#FF0000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);
    warningText.setDepth(9991);

    // Flash effect
    this.scene.tweens.add({
      targets: [warningText],
      alpha: 0.5,
      duration: 300,
      yoyo: true,
      repeat: 5
    });

    // Remove after 2 seconds
    this.scene.time.delayedCall(2000, () => {
      overlay.destroy();
      warningText.destroy();
    });

    // Play warning sound
    if (this.scene.sound.get('lightning-strike-386161')) {
      this.scene.sound.play('lightning-strike-386161', { volume: 0.5 });
    }

    // Voice line
    console.log('🗣️ "MARKET CRASH IMMINENT!"');
  }

  private createBoss(x: number, y: number): void {
    // Create boss container
    this.boss = this.scene.add.container(x, y);

    // Boss sprite
    this.bossSprite = this.scene.add.image(0, 0, 'bear-boss');
    this.bossSprite.setScale(0.4);
    this.bossSprite.setFlipX(true);

    this.boss.add(this.bossSprite);
    this.boss.setSize(200, 200);
    this.boss.setDepth(1000);
    this.boss.setData('type', 'bearBoss');
    this.boss.setData('phase', 1);
    this.boss.setData('hp', this.maxBossHP);

    this.bossActive = true;
    this.bossHP = this.maxBossHP;
    this.currentPhase = 1;

    // Create health bar
    this.createHealthBar();

    // Start first phase
    this.startPhase(1);
  }

  private createHealthBar(): void {
    const width = this.scene.cameras.main.width;

    // Background bar
    this.healthBarBg = this.scene.add.graphics();
    this.healthBarBg.fillStyle(0x333333, 1);
    this.healthBarBg.fillRect(width / 2 - 300, 50, 600, 30);
    this.healthBarBg.setDepth(9000);

    // Health bar
    this.healthBar = this.scene.add.graphics();
    this.healthBar.setDepth(9001);

    // Boss name
    this.bossNameText = this.scene.add.text(width / 2, 30, '🐻 BEAR MARKET BOSS', {
      fontSize: '32px',
      color: '#FF0000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    this.bossNameText.setDepth(9002);

    // Phase text
    this.phaseText = this.scene.add.text(width / 2, 90, 'Phase 1: Market Entry', {
      fontSize: '24px',
      color: '#FFAA00',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.phaseText.setDepth(9002);

    this.updateHealthBar();
  }

  private updateHealthBar(): void {
    if (!this.healthBar) return;

    const width = this.scene.cameras.main.width;
    const barWidth = 600;
    const barHeight = 30;
    const hpPercent = this.bossHP / this.maxBossHP;

    // Color based on HP
    let color = 0x00FF00; // Green
    if (hpPercent < 0.66) color = 0xFFAA00; // Orange
    if (hpPercent < 0.33) color = 0xFF0000; // Red

    this.healthBar.clear();
    this.healthBar.fillStyle(color, 1);
    this.healthBar.fillRect(width / 2 - 300, 50, barWidth * hpPercent, barHeight);

    // HP text
    const hpText = `${this.bossHP} / ${this.maxBossHP}`;
    if (this.scene.children.exists(this.healthBar)) {
      const existingText = this.scene.children.getChildren().find(
        child => child.getData && child.getData('bossHPText')
      );
      if (existingText) {
        (existingText as Phaser.GameObjects.Text).setText(hpText);
      } else {
        const text = this.scene.add.text(width / 2, 65, hpText, {
          fontSize: '20px',
          color: '#FFFFFF',
          fontFamily: 'Arial',
          fontStyle: 'bold'
        }).setOrigin(0.5);
        text.setDepth(9002);
        text.setData('bossHPText', true);
      }
    }
  }

  private startPhase(phaseNum: number): void {
    this.currentPhase = phaseNum;
    const phase = this.phases[phaseNum - 1];

    console.log(`🐻 Boss Phase ${phaseNum}: ${phase.name}`);

    // Update phase text
    if (this.phaseText) {
      this.phaseText.setText(phase.name);

      // Flash effect
      this.scene.tweens.add({
        targets: this.phaseText,
        scale: 1.3,
        duration: 300,
        yoyo: true,
        repeat: 2
      });
    }

    // Phase-specific setup
    switch (phaseNum) {
      case 1:
        this.playVoiceLine('BEAR IS ANGRY!');
        break;
      case 2:
        this.playVoiceLine('YOU CAN\'T OUTFLY FUD!');
        this.scene.cameras.main.flash(500, 255, 100, 0);
        break;
      case 3:
        this.playVoiceLine('FINAL PHASE - BEAR RAGE!');
        this.scene.cameras.main.flash(800, 255, 0, 0);
        this.scene.cameras.main.shake(1000, 0.005);
        // Boss turns red
        if (this.bossSprite) {
          this.bossSprite.setTint(0xFF0000);
        }
        break;
    }
  }

  public takeDamage(damage: number): boolean {
    if (!this.bossActive || !this.boss) return false;

    this.bossHP -= damage;
    console.log(`🐻 Boss took ${damage} damage! HP: ${this.bossHP}/${this.maxBossHP}`);

    // Flash effect
    if (this.bossSprite) {
      this.scene.tweens.add({
        targets: this.bossSprite,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 2
      });
    }

    // Update health bar
    this.updateHealthBar();

    // Check phase transitions
    const phase = this.phases[this.currentPhase - 1];
    if (this.bossHP < phase.minHP && this.currentPhase < 3) {
      this.startPhase(this.currentPhase + 1);
    }

    // Check if defeated
    if (this.bossHP <= 0) {
      this.defeatBoss();
      return true;
    }

    // Play hit sound
    this.scene.sound.play('explosion-312361', { volume: 0.6 });

    return false;
  }

  private defeatBoss(): void {
    console.log('🎉 BOSS DEFEATED!');

    if (!this.boss) return;

    // Victory animation
    this.scene.tweens.add({
      targets: this.boss,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      angle: 360,
      duration: 1500,
      onComplete: () => {
        if (this.boss) {
          this.boss.destroy();
          this.boss = null;
        }
      }
    });

    // Explosion effect
    for (let i = 0; i < 10; i++) {
      this.scene.time.delayedCall(i * 100, () => {
        if (this.boss) {
          const explosion = this.scene.add.graphics();
          explosion.fillStyle(0xFF6600, 0.8);
          explosion.fillCircle(
            this.boss.x + Phaser.Math.Between(-50, 50),
            this.boss.y + Phaser.Math.Between(-50, 50),
            Phaser.Math.Between(30, 60)
          );
          explosion.setDepth(1001);

          this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 500,
            onComplete: () => explosion.destroy()
          });
        }
      });
    }

    // Play victory sound
    if (this.scene.sound.get('bosswin')) {
      this.scene.sound.play('bosswin', { volume: 0.8 });
    }

    // Clean up UI
    this.scene.time.delayedCall(2000, () => {
      this.cleanupBossUI();
    });

    // Show victory screen
    this.showVictoryScreen();

    this.bossActive = false;
  }

  private showVictoryScreen(): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Victory overlay
    const overlay = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.6
    );
    overlay.setDepth(9995);

    // Victory text
    const victoryText = this.scene.add.text(width / 2, height / 2 - 100, '🎉 BOSS DEFEATED! 🎉\n\nBULL MARKET RETURNS!', {
      fontSize: '56px',
      color: '#00FF00',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    victoryText.setDepth(9996);

    // Rewards
    const rewardsText = this.scene.add.text(width / 2, height / 2 + 50, '+1000 XP\n+500 Score\n+1 Life ❤️', {
      fontSize: '36px',
      color: '#FFD700',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);
    rewardsText.setDepth(9996);

    // Animate
    this.scene.tweens.add({
      targets: [victoryText, rewardsText],
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // Remove after 5 seconds and trigger Bull Market Phase
    this.scene.time.delayedCall(5000, () => {
      overlay.destroy();
      victoryText.destroy();
      rewardsText.destroy();

      // Trigger Bull Market Phase (handled by GameScene)
      this.scene.events.emit('bossDefeated');
    });
  }

  private cleanupBossUI(): void {
    if (this.healthBar) {
      this.healthBar.destroy();
      this.healthBar = null;
    }
    if (this.healthBarBg) {
      this.healthBarBg.destroy();
      this.healthBarBg = null;
    }
    if (this.bossNameText) {
      this.bossNameText.destroy();
      this.bossNameText = null;
    }
    if (this.phaseText) {
      this.phaseText.destroy();
      this.phaseText = null;
    }

    // Remove HP text
    const hpText = this.scene.children.getChildren().find(
      child => child.getData && child.getData('bossHPText')
    );
    if (hpText) {
      hpText.destroy();
    }
  }

  public update(delta: number): void {
    if (!this.bossActive || !this.boss) return;

    const phase = this.phases[this.currentPhase - 1];
    const now = Date.now();

    // Boss movement
    this.updateBossMovement(phase, delta);

    // Boss attacks
    if (now - this.lastAttackTime > phase.attackInterval) {
      this.performAttack(phase);
      this.lastAttackTime = now;
    }

    // Update projectiles
    this.updateProjectiles(delta);
  }

  private updateBossMovement(phase: BossPhase, delta: number): void {
    if (!this.boss) return;

    const height = this.scene.cameras.main.height;
    const speed = phase.speed * (delta / 1000);

    switch (phase.behavior) {
      case 'horizontal':
        // Slow horizontal movement
        this.boss.x -= speed * 0.3;
        // Sine wave
        this.boss.y += Math.sin(Date.now() / 1000) * 2;
        break;

      case 'aggressive':
        // Track player Y position
        const gameScene = this.scene as any;
        if (gameScene.eagle) {
          const targetY = gameScene.eagle.y;
          if (this.boss.y < targetY - 20) {
            this.boss.y += speed;
          } else if (this.boss.y > targetY + 20) {
            this.boss.y -= speed;
          }
        }
        this.boss.x -= speed * 0.2;
        break;

      case 'roar_attack':
        // Erratic movement
        if (Math.random() < 0.02) {
          const randomY = Phaser.Math.Between(200, height - 200);
          this.scene.tweens.add({
            targets: this.boss,
            y: randomY,
            duration: 800,
            ease: 'Sine.easeInOut'
          });
        }
        break;
    }

    // Keep in bounds
    if (this.boss.y < 150) this.boss.y = 150;
    if (this.boss.y > height - 150) this.boss.y = height - 150;
    if (this.boss.x < 300) this.boss.x = 300;
  }

  private performAttack(phase: BossPhase): void {
    if (!this.boss) return;

    switch (phase.attackPattern) {
      case 'red_candles':
        this.fireRedCandles();
        break;
      case 'lawsuit_papers':
        this.fireLawsuitPapers();
        break;
      case 'screen_shake':
        this.roarAttack();
        break;
    }
  }

  private fireRedCandles(): void {
    if (!this.boss) return;

    // Fire 3 red candles
    for (let i = 0; i < 3; i++) {
      const angle = -30 + (i * 30); // -30, 0, +30 degrees
      const candle = this.scene.add.container(this.boss.x, this.boss.y);

      const graphic = this.scene.add.graphics();
      graphic.fillStyle(0xFF0000, 1);
      graphic.fillRect(0, -20, 10, 40);
      candle.add(graphic);
      candle.setDepth(999);

      const angleRad = Phaser.Math.DegToRad(angle);
      (candle as any).velocityX = Math.cos(angleRad) * -400;
      (candle as any).velocityY = Math.sin(angleRad) * 400;

      this.redCandles.push(candle);
    }

    console.log('🔴 Boss fired red candles!');
  }

  private fireLawsuitPapers(): void {
    if (!this.boss) return;

    // Fire lawsuit paper toward player
    const gameScene = this.scene as any;
    const paper = this.scene.add.container(this.boss.x, this.boss.y);

    const graphic = this.scene.add.graphics();
    graphic.fillStyle(0xFFFFFF, 1);
    graphic.fillRect(-15, -20, 30, 40);
    graphic.fillStyle(0x000000, 1);
    graphic.fillRect(-12, -17, 24, 10);
    graphic.fillRect(-12, -5, 24, 10);
    graphic.fillRect(-12, 7, 24, 10);
    paper.add(graphic);
    paper.setDepth(999);

    if (gameScene.eagle) {
      const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, gameScene.eagle.x, gameScene.eagle.y);
      (paper as any).velocityX = Math.cos(angle) * 350;
      (paper as any).velocityY = Math.sin(angle) * 350;
    } else {
      (paper as any).velocityX = -350;
      (paper as any).velocityY = 0;
    }

    this.lawsuitPapers.push(paper);

    console.log('📄 Boss fired lawsuit paper!');
  }

  private roarAttack(): void {
    console.log('🐻 BEAR ROAR ATTACK!');

    // Screen shake
    this.scene.cameras.main.shake(500, 0.01);

    // Play roar sound
    if (this.scene.sound.get('ground-impact-352053')) {
      this.scene.sound.play('ground-impact-352053', { volume: 0.7 });
    }

    // Red flash
    this.scene.cameras.main.flash(300, 255, 0, 0);

    // Voice line
    this.playVoiceLine('BEAR ROAR!');
  }

  private updateProjectiles(delta: number): void {
    const deltaSeconds = delta / 1000;

    // Update red candles
    this.redCandles = this.redCandles.filter(candle => {
      if (!candle.active) return false;

      candle.x += (candle as any).velocityX * deltaSeconds;
      candle.y += (candle as any).velocityY * deltaSeconds;

      // Remove if off screen
      if (candle.x < -100 || candle.y < -100 || candle.y > this.scene.cameras.main.height + 100) {
        candle.destroy();
        return false;
      }

      return true;
    });

    // Update lawsuit papers
    this.lawsuitPapers = this.lawsuitPapers.filter(paper => {
      if (!paper.active) return false;

      paper.x += (paper as any).velocityX * deltaSeconds;
      paper.y += (paper as any).velocityY * deltaSeconds;

      // Rotate
      paper.angle += 200 * deltaSeconds;

      // Remove if off screen
      if (paper.x < -100) {
        paper.destroy();
        return false;
      }

      return true;
    });
  }

  public getBossProjectiles(): { redCandles: Phaser.GameObjects.Container[]; lawsuitPapers: Phaser.GameObjects.Container[] } {
    return {
      redCandles: this.redCandles,
      lawsuitPapers: this.lawsuitPapers
    };
  }

  public getBoss(): Phaser.GameObjects.Container | null {
    return this.boss;
  }

  public isBossActive(): boolean {
    return this.bossActive;
  }

  private playVoiceLine(line: string): void {
    console.log(`🗣️ Boss: "${line}"`);
    // Placeholder for actual voice line playback
  }

  public cleanup(): void {
    if (this.boss) {
      this.boss.destroy();
      this.boss = null;
    }

    this.cleanupBossUI();

    this.redCandles.forEach(c => c.destroy());
    this.lawsuitPapers.forEach(p => p.destroy());

    this.redCandles = [];
    this.lawsuitPapers = [];

    this.bossActive = false;
  }
}
