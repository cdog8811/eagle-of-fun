// ============================
// Eagle of Fun v3.0 - Boss Manager
// ============================

import { BOSSES, BOSS_SPAWN_CONFIG, Boss, AttackPattern } from '../config/BossesConfig';

export class BossManager {
  private scene: Phaser.Scene;
  private activeBoss: Boss | null;
  private bossSprite?: Phaser.GameObjects.Container;
  private bossHP: number;
  private bossMaxHP: number;
  private bossHPBar?: Phaser.GameObjects.Graphics;
  private bossHPText?: Phaser.GameObjects.Text;
  private attackTimer?: Phaser.Time.TimerEvent;
  private defeatedBosses: Set<string>;
  private bossProjectiles: Phaser.GameObjects.Group;
  private voiceLineText?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.activeBoss = null;
    this.bossHP = 0;
    this.bossMaxHP = 0;
    this.defeatedBosses = new Set();
    this.bossProjectiles = this.scene.add.group();
    this.loadProgress();
  }

  private loadProgress(): void {
    const saved = localStorage.getItem('eagleOfFun_bosses');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.defeatedBosses = new Set(data.defeatedBosses || []);
      } catch (e) {
        console.error('Failed to load boss progress:', e);
      }
    }
  }

  public saveProgress(): void {
    const data = {
      defeatedBosses: Array.from(this.defeatedBosses)
    };
    localStorage.setItem('eagleOfFun_bosses', JSON.stringify(data));
  }

  public checkBossSpawn(score: number, phase: number, hitsTaken: number): Boss | null {
    // Don't spawn if boss already active
    if (this.activeBoss) return null;

    // Check for The Whale (secret boss)
    const whale = BOSSES.find(b => b.id === 'the-whale');
    if (whale && score >= 2000 && hitsTaken === 0 && !this.defeatedBosses.has('the-whale')) {
      return whale;
    }

    // Check for Gary the Regulator
    const gary = BOSSES.find(b => b.id === 'gary-regulator');
    if (gary && score >= 500 && phase >= 3 && !this.defeatedBosses.has('gary-regulator')) {
      return gary;
    }

    // Check for The Bear Market
    const bear = BOSSES.find(b => b.id === 'bear-market');
    if (bear && score >= 1500 && phase >= 5 && !this.defeatedBosses.has('bear-market')) {
      return bear;
    }

    return null;
  }

  public spawnBoss(boss: Boss): void {
    this.activeBoss = boss;
    this.bossHP = boss.hp;
    this.bossMaxHP = boss.hp;

    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Create boss sprite container
    this.bossSprite = this.scene.add.container(width / 2, height * 0.3);

    // Create boss visual based on ID
    let bossGraphic: Phaser.GameObjects.Graphics;

    switch (boss.id) {
      case 'gary-regulator':
        bossGraphic = this.createGaryVisual();
        break;
      case 'bear-market':
        bossGraphic = this.createBearVisual();
        break;
      case 'the-whale':
        bossGraphic = this.createWhaleVisual();
        break;
      default:
        bossGraphic = this.scene.add.graphics();
        bossGraphic.fillStyle(0xFF0000, 1);
        bossGraphic.fillRect(-50, -50, 100, 100);
    }

    this.bossSprite.add(bossGraphic);
    this.bossSprite.setDepth(400);

    // Store boss data
    (this.bossSprite as any).bossData = boss;

    // Create HP bar
    this.createBossHPBar();

    // Start attack pattern
    this.startAttackPattern();

    // Show boss intro
    this.showBossIntro(boss);
  }

  private createGaryVisual(): Phaser.GameObjects.Graphics {
    const g = this.scene.add.graphics();

    // Suit body (dark blue)
    g.fillStyle(0x1E3A8A, 1);
    g.fillRect(-60, -20, 120, 140);

    // Head
    g.fillStyle(0xFDBB8E, 1);
    g.fillCircle(0, -50, 40);

    // Tie
    g.fillStyle(0xDC2626, 1);
    g.fillTriangle(0, -20, -15, 20, 15, 20);

    // Briefcase
    g.fillStyle(0x78350F, 1);
    g.fillRect(-35, 80, 70, 40);

    // Angry face
    g.lineStyle(3, 0x000000, 1);
    g.lineBetween(-20, -60, -10, -55); // Left eyebrow
    g.lineBetween(10, -55, 20, -60); // Right eyebrow

    return g;
  }

  private createBearVisual(): Phaser.GameObjects.Graphics {
    const g = this.scene.add.graphics();

    // Bear body (brown)
    g.fillStyle(0x78350F, 1);
    g.fillEllipse(0, 0, 200, 280);

    // Head
    g.fillStyle(0x92400E, 1);
    g.fillEllipse(0, -100, 160, 140);

    // Ears
    g.fillCircle(-60, -150, 35);
    g.fillCircle(60, -150, 35);

    // Angry eyes (red)
    g.fillStyle(0xFF0000, 1);
    g.fillCircle(-35, -110, 15);
    g.fillCircle(35, -110, 15);

    // Mouth (roaring)
    g.lineStyle(5, 0x000000, 1);
    g.strokeCircle(0, -70, 30);

    // Claws
    g.lineStyle(6, 0x1F2937, 1);
    g.lineBetween(-80, 60, -110, 100);
    g.lineBetween(-60, 60, -90, 110);
    g.lineBetween(60, 60, 90, 110);
    g.lineBetween(80, 60, 110, 100);

    return g;
  }

  private createWhaleVisual(): Phaser.GameObjects.Graphics {
    const g = this.scene.add.graphics();

    // Whale body (blue-grey)
    g.fillStyle(0x475569, 1);
    g.fillEllipse(0, 0, 350, 200);

    // Tail
    g.fillStyle(0x334155, 1);
    g.fillTriangle(150, -30, 200, -70, 200, 30);
    g.fillTriangle(150, 30, 200, 70, 200, -30);

    // Eye
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(-100, -40, 25);
    g.fillStyle(0x000000, 1);
    g.fillCircle(-95, -35, 15);

    // Money bag on back
    g.fillStyle(0x16A34A, 1);
    g.fillCircle(0, -60, 40);
    g.lineStyle(3, 0x000000, 1);
    g.strokeText('$', -10, -70, { fontSize: '32px' });

    return g;
  }

  private createBossHPBar(): void {
    const width = this.scene.cameras.main.width;

    this.bossHPBar = this.scene.add.graphics();
    this.bossHPBar.setDepth(1002);

    this.bossHPText = this.scene.add.text(
      width / 2,
      30,
      '',
      {
        fontSize: '24px',
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    this.bossHPText.setOrigin(0.5);
    this.bossHPText.setDepth(1003);

    this.updateBossHPBar();
  }

  private updateBossHPBar(): void {
    if (!this.bossHPBar || !this.bossHPText || !this.activeBoss) return;

    const width = this.scene.cameras.main.width;
    const barWidth = 600;
    const barHeight = 30;
    const x = width / 2 - barWidth / 2;
    const y = 50;

    this.bossHPBar.clear();

    // Background
    this.bossHPBar.fillStyle(0x000000, 0.8);
    this.bossHPBar.fillRect(x, y, barWidth, barHeight);

    // HP bar
    const hpPercent = this.bossHP / this.bossMaxHP;
    this.bossHPBar.fillStyle(0xDC2626, 1);
    this.bossHPBar.fillRect(x, y, barWidth * hpPercent, barHeight);

    // Border
    this.bossHPBar.lineStyle(3, 0xFFFFFF, 1);
    this.bossHPBar.strokeRect(x, y, barWidth, barHeight);

    // Text
    this.bossHPText.setText(`${this.activeBoss.name} - ${this.bossHP}/${this.bossMaxHP} HP`);
  }

  private showBossIntro(boss: Boss): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Boss name announcement
    const nameText = this.scene.add.text(
      width / 2,
      height / 2,
      boss.name.toUpperCase(),
      {
        fontSize: '72px',
        color: '#DC2626',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 8
      }
    );
    nameText.setOrigin(0.5);
    nameText.setDepth(2000);
    nameText.setAlpha(0);

    this.scene.tweens.add({
      targets: nameText,
      alpha: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      onComplete: () => nameText.destroy()
    });

    // Voice line
    const voiceLine = boss.voiceLines[0];
    this.showVoiceLine(voiceLine);
  }

  private showVoiceLine(text: string): void {
    if (!this.activeBoss) return;

    const width = this.scene.cameras.main.width;

    if (this.voiceLineText) {
      this.voiceLineText.destroy();
    }

    this.voiceLineText = this.scene.add.text(
      width / 2,
      120,
      `"${text}"`,
      {
        fontSize: '28px',
        color: '#FFFF00',
        fontFamily: 'Arial',
        fontStyle: 'bold italic',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    this.voiceLineText.setOrigin(0.5);
    this.voiceLineText.setDepth(1004);

    this.scene.time.delayedCall(3000, () => {
      if (this.voiceLineText) {
        this.voiceLineText.destroy();
      }
    });
  }

  private startAttackPattern(): void {
    if (!this.activeBoss) return;

    // Random attack every 3-5 seconds
    const attackDelay = Phaser.Math.Between(3000, 5000);

    this.attackTimer = this.scene.time.addEvent({
      delay: attackDelay,
      callback: () => this.performRandomAttack(),
      loop: true
    });
  }

  private performRandomAttack(): void {
    if (!this.activeBoss || !this.bossSprite) return;

    const attack = Phaser.Utils.Array.GetRandom(this.activeBoss.attackPatterns);

    // Show voice line sometimes
    if (Math.random() < 0.3) {
      const voiceLine = Phaser.Utils.Array.GetRandom(this.activeBoss.voiceLines);
      this.showVoiceLine(voiceLine);
    }

    // Execute attack based on pattern
    switch (attack.id) {
      case 'lawsuit-spiral':
        this.lawsuitSpiralAttack();
        break;
      case 'section-12b':
        this.section12bAttack();
        break;
      case 'roar-shake':
        this.roarShakeAttack();
        break;
      case 'platform-destroy':
        this.platformDestroyAttack();
        break;
      case 'swipe-attack':
        this.swipeAttack();
        break;
      case 'money-bundle':
        this.moneyBundleAttack();
        break;
      case 'fake-coins':
        this.fakeCoinsAttack();
        break;
      case 'whale-splash':
        this.whaleSplashAttack();
        break;
    }
  }

  private lawsuitSpiralAttack(): void {
    if (!this.bossSprite) return;

    for (let i = 0; i < 8; i++) {
      const angle = (360 / 8) * i;

      const paper = this.scene.add.graphics();
      paper.fillStyle(0xFFFFFF, 1);
      paper.fillRect(-10, -15, 20, 30);
      paper.lineStyle(2, 0x000000, 1);
      paper.strokeRect(-10, -15, 20, 30);
      paper.setPosition(this.bossSprite.x, this.bossSprite.y);
      paper.setDepth(401);

      (paper as any).angle = angle;
      (paper as any).speed = 200;
      (paper as any).damage = 10;

      this.bossProjectiles.add(paper);
    }
  }

  private section12bAttack(): void {
    // Screen shake
    this.scene.cameras.main.shake(500, 0.01);
  }

  private roarShakeAttack(): void {
    // Screen shake
    this.scene.cameras.main.shake(800, 0.02);

    // Red candles fall
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(100, this.scene.cameras.main.width - 100);

      const candle = this.scene.add.graphics();
      candle.fillStyle(0xDC2626, 1);
      candle.fillRect(-5, -30, 10, 60);
      candle.setPosition(x, -50);
      candle.setDepth(401);

      (candle as any).velocityY = 400;
      (candle as any).damage = 20;

      this.bossProjectiles.add(candle);
    }
  }

  private platformDestroyAttack(): void {
    // Visual effect only - actual platform removal would need game reference
    console.log('Platform destroy attack!');
  }

  private swipeAttack(): void {
    if (!this.bossSprite) return;

    const swipe = this.scene.add.graphics();
    swipe.lineStyle(20, 0x78350F, 0.8);
    swipe.lineBetween(-100, 0, 100, 0);
    swipe.setPosition(this.bossSprite.x, this.bossSprite.y);
    swipe.setDepth(401);

    (swipe as any).damage = 15;
    this.bossProjectiles.add(swipe);

    // Animate swipe
    this.scene.tweens.add({
      targets: swipe,
      rotation: Math.PI,
      duration: 500,
      onComplete: () => swipe.destroy()
    });
  }

  private moneyBundleAttack(): void {
    if (!this.bossSprite) return;

    for (let i = 0; i < 3; i++) {
      const bundle = this.scene.add.graphics();
      bundle.fillStyle(0x16A34A, 1);
      bundle.fillRect(-15, -10, 30, 20);
      bundle.setPosition(this.bossSprite.x, this.bossSprite.y);
      bundle.setDepth(401);

      const angle = Phaser.Math.Between(-45, 45);
      (bundle as any).velocityX = Math.cos(Phaser.Math.DegToRad(angle)) * 300;
      (bundle as any).velocityY = Math.sin(Phaser.Math.DegToRad(angle)) * 300;
      (bundle as any).damage = 15;

      this.bossProjectiles.add(bundle);
    }
  }

  private fakeCoinsAttack(): void {
    // Spawn fake coins that damage player
    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(100, this.scene.cameras.main.width - 100);

      const fakeCoin = this.scene.add.graphics();
      fakeCoin.fillStyle(0x9CA3AF, 1); // Grey instead of gold
      fakeCoin.fillCircle(0, 0, 15);
      fakeCoin.setPosition(x, -50);
      fakeCoin.setDepth(401);

      (fakeCoin as any).velocityY = 200;
      (fakeCoin as any).damage = 20;
      (fakeCoin as any).isFake = true;

      this.bossProjectiles.add(fakeCoin);
    }
  }

  private whaleSplashAttack(): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    const wave = this.scene.add.graphics();
    wave.fillStyle(0x3B82F6, 0.6);
    wave.fillRect(0, height - 200, width, 200);
    wave.setDepth(401);

    (wave as any).damage = 30;
    this.bossProjectiles.add(wave);

    this.scene.tweens.add({
      targets: wave,
      y: height,
      alpha: 0,
      duration: 2000,
      onComplete: () => wave.destroy()
    });
  }

  public damageBoss(damage: number): boolean {
    if (!this.activeBoss) return false;

    this.bossHP = Math.max(0, this.bossHP - damage);
    this.updateBossHPBar();

    // Flash boss sprite
    if (this.bossSprite) {
      this.scene.tweens.add({
        targets: this.bossSprite,
        alpha: 0.5,
        duration: 100,
        yoyo: true
      });
    }

    // Check if defeated
    if (this.bossHP <= 0) {
      this.defeatBoss();
      return true;
    }

    return false;
  }

  private defeatBoss(): void {
    if (!this.activeBoss) return;

    const boss = this.activeBoss;

    // Mark as defeated
    this.defeatedBosses.add(boss.id);
    this.saveProgress();

    // Clear boss
    if (this.bossSprite) {
      this.scene.tweens.add({
        targets: this.bossSprite,
        alpha: 0,
        scaleX: 2,
        scaleY: 2,
        duration: 1000,
        onComplete: () => {
          this.bossSprite?.destroy();
        }
      });
    }

    if (this.attackTimer) {
      this.attackTimer.remove();
    }

    if (this.bossHPBar) {
      this.bossHPBar.destroy();
    }

    if (this.bossHPText) {
      this.bossHPText.destroy();
    }

    // Show victory message
    this.showVictoryMessage(boss);

    this.activeBoss = null;
  }

  private showVictoryMessage(boss: Boss): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    const victoryText = this.scene.add.text(
      width / 2,
      height / 2,
      'BOSS DEFEATED!',
      {
        fontSize: '64px',
        color: '#16A34A',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
      }
    );
    victoryText.setOrigin(0.5);
    victoryText.setDepth(2001);

    this.scene.tweens.add({
      targets: victoryText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      repeat: 2,
      onComplete: () => victoryText.destroy()
    });
  }

  public getActiveBoss(): Boss | null {
    return this.activeBoss;
  }

  public getBossProjectiles(): Phaser.GameObjects.Group {
    return this.bossProjectiles;
  }

  public update(delta: number): void {
    // Update boss movement
    if (this.bossSprite && this.activeBoss) {
      // Simple hover animation
      const time = Date.now() / 1000;
      this.bossSprite.y += Math.sin(time * 2) * 0.5;
    }

    // Update projectiles
    this.bossProjectiles.getChildren().forEach((proj: any) => {
      if (proj && proj.active) {
        if (proj.velocityX !== undefined) {
          proj.x += proj.velocityX * (delta / 1000);
        }
        if (proj.velocityY !== undefined) {
          proj.y += proj.velocityY * (delta / 1000);
        }

        // Spiral movement for lawsuit papers
        if (proj.angle !== undefined) {
          const speed = proj.speed || 200;
          proj.angle += 180 * (delta / 1000);
          proj.x += Math.cos(Phaser.Math.DegToRad(proj.angle)) * speed * (delta / 1000);
          proj.y += Math.sin(Phaser.Math.DegToRad(proj.angle)) * speed * (delta / 1000);
        }

        // Remove if off screen
        const cam = this.scene.cameras.main;
        if (proj.x < -200 || proj.x > cam.width + 200 ||
            proj.y < -200 || proj.y > cam.height + 200) {
          proj.destroy();
        }
      }
    });
  }

  public destroy(): void {
    if (this.attackTimer) {
      this.attackTimer.remove();
    }
    this.bossSprite?.destroy();
    this.bossHPBar?.destroy();
    this.bossHPText?.destroy();
    this.voiceLineText?.destroy();
    this.bossProjectiles.clear(true, true);
  }
}
