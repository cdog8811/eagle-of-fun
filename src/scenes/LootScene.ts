// ============================
// Eagle of Fun v3.0 - Loot Scene
// Variable Rewards (Slot Machine Effect)
// ============================

import Phaser from 'phaser';

export class LootScene extends Phaser.Scene {
  private score: number = 0;
  private lootSlots: Phaser.GameObjects.Container[] = [];
  private selectedRewards: string[] = [];

  constructor() {
    super({ key: 'LootScene' });
  }

  init(data: { score: number }): void {
    this.score = data.score || 0;
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    this.cameras.main.setBackgroundColor('#000000');
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Title
    const title = this.add.text(
      width / 2,
      100,
      'LOOT DROP',
      {
        fontSize: '64px',
        color: '#FFD700',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
      }
    );
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(
      width / 2,
      180,
      'Opening your reward crate...',
      {
        fontSize: '24px',
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontStyle: 'italic'
      }
    );
    subtitle.setOrigin(0.5);

    // Create 3 slot machine slots
    this.createLootSlots();

    // Start spinning animation
    this.time.delayedCall(500, () => {
      this.startSlotSpin();
    });

    // Show continue button after reveal
    this.time.delayedCall(5000, () => {
      this.showContinueButton();
    });
  }

  private createLootSlots(): void {
    const width = this.cameras.main.width;
    const slotSpacing = 300;
    const startX = width / 2 - slotSpacing;

    for (let i = 0; i < 3; i++) {
      const x = startX + (i * slotSpacing);
      const y = 400;

      const slotContainer = this.add.container(x, y);

      // Slot background
      const bg = this.add.graphics();
      bg.fillStyle(0x1F2937, 1);
      bg.fillRoundedRect(-80, -80, 160, 160, 10);
      bg.lineStyle(4, 0xFFD700, 1);
      bg.strokeRoundedRect(-80, -80, 160, 160, 10);

      // Placeholder icon
      const icon = this.add.text(0, 0, '?', {
        fontSize: '72px',
        color: '#FFD700',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      });
      icon.setOrigin(0.5);

      slotContainer.add([bg, icon]);
      slotContainer.setData('iconText', icon);

      this.lootSlots.push(slotContainer);
    }
  }

  private startSlotSpin(): void {
    const rewardTypes = ['💰', '⭐', '🎁', '💎', '🔥', '🏆'];

    // Spin each slot
    this.lootSlots.forEach((slot, index) => {
      const iconText = slot.getData('iconText') as Phaser.GameObjects.Text;

      // Spinning animation
      let spinCount = 0;
      const spinInterval = this.time.addEvent({
        delay: 100,
        callback: () => {
          const randomIcon = Phaser.Utils.Array.GetRandom(rewardTypes);
          iconText.setText(randomIcon);
          spinCount++;

          // Stop spinning after delay (stagger for each slot)
          if (spinCount > 20 + (index * 10)) {
            spinInterval.remove();
            this.revealReward(slot, index);
          }
        },
        loop: true
      });
    });
  }

  private revealReward(slot: Phaser.GameObjects.Container, index: number): void {
    const iconText = slot.getData('iconText') as Phaser.GameObjects.Text;

    // Determine reward based on probabilities
    const roll = Math.random() * 100;

    let reward: { icon: string; name: string; type: string };

    if (roll < 70) {
      // 70% XP Boost
      reward = { icon: '⭐', name: 'XP BOOST +50%', type: 'xp' };
    } else if (roll < 90) {
      // 20% Skin Piece
      reward = { icon: '💎', name: 'SKIN FRAGMENT', type: 'skin' };
    } else {
      // 10% Voice Line / Sticker
      reward = { icon: '🔥', name: 'RARE DROP!', type: 'rare' };
    }

    iconText.setText(reward.icon);

    // Glow effect
    this.tweens.add({
      targets: slot,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 300,
      yoyo: true,
      ease: 'Cubic.easeOut'
    });

    // Show reward name below slot
    const rewardText = this.add.text(
      slot.x,
      slot.y + 100,
      reward.name,
      {
        fontSize: '18px',
        color: '#FFD700',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    rewardText.setOrigin(0.5);
    rewardText.setAlpha(0);

    this.tweens.add({
      targets: rewardText,
      alpha: 1,
      y: rewardText.y - 20,
      duration: 500,
      ease: 'Back.easeOut'
    });

    // Apply reward
    this.applyReward(reward.type);

    // Sound effect
    this.sound.play('belle-collect', { volume: 0.6 });
  }

  private applyReward(type: string): void {
    switch (type) {
      case 'xp':
        // Apply XP boost
        const currentXP = parseInt(localStorage.getItem('eagleOfFun_totalXP') || '0');
        const boostedXP = Math.floor(currentXP * 0.5);
        localStorage.setItem('eagleOfFun_totalXP', (currentXP + boostedXP).toString());
        break;

      case 'skin':
        // Add skin fragment
        const fragments = parseInt(localStorage.getItem('eagleOfFun_skinFragments') || '0');
        localStorage.setItem('eagleOfFun_skinFragments', (fragments + 1).toString());
        break;

      case 'rare':
        // Unlock random voice line or sticker
        const rareItems = JSON.parse(localStorage.getItem('eagleOfFun_rareItems') || '[]');
        rareItems.push(`rare_${Date.now()}`);
        localStorage.setItem('eagleOfFun_rareItems', JSON.stringify(rareItems));
        break;
    }
  }

  private showContinueButton(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const button = this.add.container(width / 2, height - 150);

    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRoundedRect(-150, -35, 300, 70, 6);

    const text = this.add.text(0, 0, 'CONTINUE', {
      fontSize: '28px',
      color: '#FFFFFF',
      fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", Arial, sans-serif',
      fontStyle: 'bold',
      letterSpacing: 2
    });
    text.setOrigin(0.5);

    button.add([bg, text]);
    button.setSize(300, 70);
    button.setInteractive(new Phaser.Geom.Rectangle(-150, -35, 300, 70), Phaser.Geom.Rectangle.Contains);

    button.on('pointerover', () => {
      this.sound.play('hover-button', { volume: 0.3 });
      bg.clear();
      bg.fillStyle(0xE63946, 1);
      bg.fillRoundedRect(-150, -35, 300, 70, 6);
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x000000, 1);
      bg.fillRoundedRect(-150, -35, 300, 70, 6);
    });

    button.on('pointerdown', () => {
      this.sound.play('ui-confirm', { volume: 0.5 });
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('GameOverScene', { score: this.score, showLoot: false });
      });
    });

    button.setAlpha(0);
    this.tweens.add({
      targets: button,
      alpha: 1,
      duration: 500
    });
  }

  shutdown(): void {
    this.tweens.killAll();
    this.sound.stopAll();
  }
}
