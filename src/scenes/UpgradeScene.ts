import Phaser from 'phaser';
import { getXPSystem } from '../systems/xpSystem';
import { getUpgradeSystem, type UpgradeDef, type PlayerStats } from '../systems/upgradeSystem';
import type { XPState } from '../systems/xpSystem';

/**
 * UpgradeScene - Upgrade Hangar
 *
 * Displayed after GameOver, allows spending XP on upgrades
 * Flow: GameOver → UpgradeScene → [PLAY AGAIN] → Intro/GameScene
 */
export default class UpgradeScene extends Phaser.Scene {
  private xpSystem = getXPSystem();
  private upgradeSystem = getUpgradeSystem();

  private xpState!: XPState;
  private playerStats!: PlayerStats;

  // UI Elements
  private xpDisplayBg?: Phaser.GameObjects.Graphics;
  private levelText?: Phaser.GameObjects.Text;
  private xpText?: Phaser.GameObjects.Text;
  private totalXPText?: Phaser.GameObjects.Text;

  private upgradeCards: UpgradeCard[] = [];
  private scrollY: number = 0;
  private maxScrollY: number = 0;

  // Patriotic Colors
  private readonly NAVY_BLUE = 0x002868;
  private readonly CRIMSON_RED = 0xDC143C;
  private readonly PURE_WHITE = 0xFFFFFF;
  private readonly GOLD = 0xFFD700;
  private readonly DARK_BG = 0x001845;

  constructor() {
    super({ key: 'UpgradeScene' });
  }

  create(): void {
    console.log('🛠 UPGRADE HANGAR LOADED - v3.7');

    // Get current state
    this.xpState = this.xpSystem.getState();
    this.playerStats = this.upgradeSystem.getPlayerStats();

    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(0, 0, width, height, this.DARK_BG).setOrigin(0);

    // Title
    this.add.text(width / 2, 40, '🛠 UPGRADE HANGAR', {
      fontSize: '42px',
      fontFamily: 'Arial',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, 85, 'Enhance your Eagle with permanent upgrades', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    // XP Display (Top)
    this.createXPDisplay();

    // Upgrade Cards (Scrollable Grid)
    this.createUpgradeCards();

    // Bottom Buttons
    this.createBottomButtons();

    // Setup scrolling
    this.setupScrolling();
  }

  private createXPDisplay(): void {
    const { width } = this.cameras.main;
    const x = width / 2 - 300;
    const y = 130;
    const boxWidth = 600;
    const boxHeight = 100;

    // Background
    this.xpDisplayBg = this.add.graphics();
    this.xpDisplayBg.fillStyle(this.NAVY_BLUE, 0.9);
    this.xpDisplayBg.fillRoundedRect(x, y, boxWidth, boxHeight, 12);
    this.xpDisplayBg.lineStyle(3, this.GOLD, 1);
    this.xpDisplayBg.strokeRoundedRect(x, y, boxWidth, boxHeight, 12);

    // Level (Left side)
    this.levelText = this.add.text(x + 30, y + 25, `LEVEL ${this.xpState.level}`, {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold'
    });

    // XP Progress (Center)
    const xpBarX = x + 200;
    const xpBarY = y + 35;
    const xpBarWidth = 250;
    const xpBarHeight = 20;

    // XP Bar Background
    const xpBarBg = this.add.graphics();
    xpBarBg.fillStyle(this.DARK_BG, 1);
    xpBarBg.fillRoundedRect(xpBarX, xpBarY, xpBarWidth, xpBarHeight, 10);

    // XP Bar Fill
    const progress = this.xpState.xp / this.xpState.xpToNext;
    const fillWidth = xpBarWidth * progress;

    const xpBarFill = this.add.graphics();
    xpBarFill.fillStyle(this.CRIMSON_RED, 1);
    xpBarFill.fillRoundedRect(xpBarX, xpBarY, fillWidth, xpBarHeight, 10);

    // Highlight
    xpBarFill.fillStyle(0xFFFFFF, 0.3);
    xpBarFill.fillRoundedRect(xpBarX, xpBarY, fillWidth, xpBarHeight / 3, 10);

    // XP Text (below bar)
    this.xpText = this.add.text(xpBarX + xpBarWidth / 2, xpBarY + xpBarHeight + 15,
      `${this.xpState.xp} / ${this.xpState.xpToNext} XP`, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#FFD700'
    }).setOrigin(0.5, 0);

    // Total XP (Right side)
    this.totalXPText = this.add.text(x + boxWidth - 30, y + 40,
      `Total: ${this.xpState.totalXP} XP`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#FFFFFF'
    }).setOrigin(1, 0.5);
  }

  private createUpgradeCards(): void {
    const { width } = this.cameras.main;
    const upgradeDefs = this.upgradeSystem.getDefs();
    const upgradeState = this.upgradeSystem.getState();

    const cardWidth = 380;
    const cardHeight = 180;
    const spacing = 20;
    const columns = 2;
    const startY = 260;
    const startX = width / 2 - (cardWidth * columns + spacing) / 2;

    let row = 0;
    let col = 0;

    for (const def of upgradeDefs) {
      const x = startX + col * (cardWidth + spacing);
      const y = startY + row * (cardHeight + spacing);

      const currentLevel = upgradeState.levels[def.id] || 0;
      const card = new UpgradeCard(
        this,
        x,
        y,
        cardWidth,
        cardHeight,
        def,
        currentLevel,
        this.xpState,
        () => this.onUpgradeBuy(def)
      );

      this.upgradeCards.push(card);

      col++;
      if (col >= columns) {
        col = 0;
        row++;
      }
    }

    // Calculate max scroll
    const totalRows = Math.ceil(upgradeDefs.length / columns);
    const totalHeight = totalRows * (cardHeight + spacing);
    const viewportHeight = this.cameras.main.height - startY - 120; // 120 = bottom buttons
    this.maxScrollY = Math.max(0, totalHeight - viewportHeight);
  }

  private createBottomButtons(): void {
    const { width, height } = this.cameras.main;
    const buttonY = height - 60;

    // Play Button (Green)
    const playButton = this.add.rectangle(width / 2 - 120, buttonY, 200, 50, 0x00AA00)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.onPlayAgain());

    const playButtonBorder = this.add.graphics();
    playButtonBorder.lineStyle(3, this.GOLD, 1);
    playButtonBorder.strokeRoundedRect(width / 2 - 220, buttonY - 25, 200, 50, 8);

    this.add.text(width / 2 - 120, buttonY, '▶ PLAY AGAIN', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Reset Button (Red)
    const resetButton = this.add.rectangle(width / 2 + 120, buttonY, 200, 50, 0xAA0000)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.onReset());

    const resetButtonBorder = this.add.graphics();
    resetButtonBorder.lineStyle(3, this.GOLD, 1);
    resetButtonBorder.strokeRoundedRect(width / 2 + 20, buttonY - 25, 200, 50, 8);

    this.add.text(width / 2 + 120, buttonY, '🔄 RESET ALL', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Hover effects
    playButton.on('pointerover', () => playButton.setFillStyle(0x00CC00));
    playButton.on('pointerout', () => playButton.setFillStyle(0x00AA00));
    resetButton.on('pointerover', () => resetButton.setFillStyle(0xCC0000));
    resetButton.on('pointerout', () => resetButton.setFillStyle(0xAA0000));
  }

  private setupScrolling(): void {
    this.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
      this.scrollY = Phaser.Math.Clamp(this.scrollY + deltaY * 0.5, 0, this.maxScrollY);
      this.updateCardPositions();
    });
  }

  private updateCardPositions(): void {
    this.upgradeCards.forEach(card => {
      card.setScrollOffset(this.scrollY);
    });
  }

  private onUpgradeBuy(def: UpgradeDef): void {
    console.log(`💰 Attempting to buy upgrade: ${def.id}`);

    // Get current state and cost
    const currentState = this.xpSystem.getState();
    const currentLevel = this.upgradeSystem.getState().levels[def.id] || 0;
    const cost = this.upgradeSystem.getCost(def.id, currentLevel + 1);

    // Check if already at max
    if (currentLevel >= def.maxLevel) {
      this.showNotification('Already at MAX level!', 0xFF0000);
      return;
    }

    // Check if can afford
    if (currentState.totalXP < cost) {
      this.showNotification(`Not enough XP! Need ${cost - currentState.totalXP} more XP`, 0xFF0000);
      if (this.sound.get('enemyhit')) {
        this.sound.play('enemyhit', { volume: 0.3 });
      }
      return;
    }

    // Show confirmation dialog
    this.showBuyConfirmation(def, cost, () => {
      // Try to buy
      const success = this.upgradeSystem.buy(def.id, (cost) => {
        if (currentState.totalXP >= cost) {
          this.xpSystem.spendXP(cost);
          return true;
        }
        return false;
      });

      if (success) {
        console.log(`✅ Upgrade purchased: ${def.id}`);

        // Visual feedback - flash green
        this.showNotification(`✅ ${def.name} upgraded to Level ${currentLevel + 1}!`, 0x00FF00);

        // Play success sound
        if (this.sound.get('coin-collect')) {
          this.sound.play('coin-collect', { volume: 0.6 });
        }

        // Refresh UI with new state
        this.xpState = this.xpSystem.getState();
        this.refreshUI();
      } else {
        console.warn('❌ Upgrade purchase failed');
        this.showNotification('Purchase failed!', 0xFF0000);
      }
    });
  }

  private refreshUI(): void {
    // Update XP display
    if (this.levelText) {
      this.levelText.setText(`LEVEL ${this.xpState.level}`);
    }
    if (this.xpText) {
      this.xpText.setText(`${this.xpState.xp} / ${this.xpState.xpToNext} XP`);
    }
    if (this.totalXPText) {
      this.totalXPText.setText(`Total: ${this.xpState.totalXP} XP`);
    }

    // Update all upgrade cards
    const upgradeState = this.upgradeSystem.getState();
    this.upgradeCards.forEach(card => {
      const currentLevel = upgradeState.levels[card.def.id] || 0;
      card.updateLevel(currentLevel, this.xpState);
    });
  }

  private onPlayAgain(): void {
    console.log('▶ Play Again clicked - skipping directly to game');
    this.scene.start('GameScene');
  }

  private showBuyConfirmation(def: UpgradeDef, cost: number, onConfirm: () => void): void {
    const { width, height } = this.cameras.main;

    // Dark overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0)
      .setDepth(2000)
      .setInteractive();

    // Confirmation box
    const boxWidth = 500;
    const boxHeight = 250;
    const box = this.add.graphics();
    box.setDepth(2001);
    box.fillStyle(this.NAVY_BLUE, 1);
    box.fillRoundedRect(width / 2 - boxWidth / 2, height / 2 - boxHeight / 2, boxWidth, boxHeight, 15);
    box.lineStyle(4, this.GOLD, 1);
    box.strokeRoundedRect(width / 2 - boxWidth / 2, height / 2 - boxHeight / 2, boxWidth, boxHeight, 15);

    // Title
    const title = this.add.text(width / 2, height / 2 - 80, 'Confirm Purchase', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2002);

    // Details
    const currentLevel = this.upgradeSystem.getState().levels[def.id] || 0;
    const details = this.add.text(width / 2, height / 2 - 20,
      `${def.name}\nLevel ${currentLevel} → ${currentLevel + 1}\n\nCost: ${cost} XP`, {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5).setDepth(2002);

    // Confirm button
    const confirmBtn = this.add.rectangle(width / 2 - 80, height / 2 + 80, 140, 50, 0x00AA00)
      .setDepth(2002)
      .setInteractive({ useHandCursor: true });

    const confirmText = this.add.text(width / 2 - 80, height / 2 + 80, '✓ BUY', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2003);

    // Cancel button
    const cancelBtn = this.add.rectangle(width / 2 + 80, height / 2 + 80, 140, 50, 0xAA0000)
      .setDepth(2002)
      .setInteractive({ useHandCursor: true });

    const cancelText = this.add.text(width / 2 + 80, height / 2 + 80, '✗ CANCEL', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(2003);

    // Cleanup function
    const cleanup = () => {
      overlay.destroy();
      box.destroy();
      title.destroy();
      details.destroy();
      confirmBtn.destroy();
      confirmText.destroy();
      cancelBtn.destroy();
      cancelText.destroy();
    };

    // Confirm action
    confirmBtn.on('pointerdown', () => {
      cleanup();
      onConfirm();
    });

    // Cancel action
    cancelBtn.on('pointerdown', cleanup);
    overlay.on('pointerdown', cleanup);

    // Hover effects
    confirmBtn.on('pointerover', () => confirmBtn.setFillStyle(0x00CC00));
    confirmBtn.on('pointerout', () => confirmBtn.setFillStyle(0x00AA00));
    cancelBtn.on('pointerover', () => cancelBtn.setFillStyle(0xCC0000));
    cancelBtn.on('pointerout', () => cancelBtn.setFillStyle(0xAA0000));
  }

  private showNotification(message: string, color: number): void {
    const { width, height } = this.cameras.main;

    const notification = this.add.text(width / 2, height / 2 - 200, message, {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: color === 0x00FF00 ? '#00FF00' : '#FF0000',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 30, y: 20 }
    }).setOrigin(0.5).setDepth(3000);

    // Animate in
    notification.setAlpha(0);
    notification.setScale(0.8);

    this.tweens.add({
      targets: notification,
      alpha: 1,
      scale: 1,
      duration: 200,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Hold for a moment, then fade out
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: notification,
            alpha: 0,
            y: notification.y - 50,
            duration: 500,
            onComplete: () => notification.destroy()
          });
        });
      }
    });
  }

  private onReset(): void {
    console.log('🔄 Reset All clicked');

    // Confirm dialog (simple)
    const confirmText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'Are you sure? This will reset ALL upgrades!\n\n[Click anywhere to cancel]',
      {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#FF0000',
        backgroundColor: '#000000',
        padding: { x: 20, y: 20 },
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(1000);

    // Confirm button
    const confirmButton = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 80,
      200,
      50,
      0xFF0000
    ).setInteractive({ useHandCursor: true }).setDepth(1001);

    const confirmButtonText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 80,
      'YES, RESET',
      {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#FFFFFF',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5).setDepth(1002);

    // Background blocker to prevent clicks
    const blocker = this.add.rectangle(
      0, 0,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7
    ).setOrigin(0).setDepth(999);

    // Confirm action
    confirmButton.once('pointerdown', () => {
      console.log('🗑️ Confirming reset...');
      this.upgradeSystem.resetAll();
      this.xpSystem.resetForNewProfile();
      this.xpState = this.xpSystem.getState();
      this.refreshUI();
      blocker.destroy();
      confirmText.destroy();
      confirmButton.destroy();
      confirmButtonText.destroy();
      console.log('✅ Reset complete');
    });

    // Cancel on blocker click
    blocker.setInteractive();
    blocker.once('pointerdown', () => {
      console.log('❌ Reset cancelled');
      blocker.destroy();
      confirmText.destroy();
      confirmButton.destroy();
      confirmButtonText.destroy();
    });
  }
}

/**
 * UpgradeCard - Individual upgrade card component
 */
class UpgradeCard {
  public def: UpgradeDef;
  private container: Phaser.GameObjects.Container;
  private levelText: Phaser.GameObjects.Text;
  private costText: Phaser.GameObjects.Text;
  private buyButton: Phaser.GameObjects.Rectangle;
  private buyButtonText: Phaser.GameObjects.Text;
  private effectText: Phaser.GameObjects.Text;

  private baseY: number;

  private readonly NAVY_BLUE = 0x002868;
  private readonly GOLD = 0xFFD700;
  private readonly DARK_BG = 0x001845;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    def: UpgradeDef,
    currentLevel: number,
    xpState: XPState,
    onBuy: () => void
  ) {
    this.def = def;
    this.baseY = y;

    // Background
    const bg = scene.add.graphics();
    bg.fillStyle(this.NAVY_BLUE, 0.85);
    bg.fillRoundedRect(0, 0, width, height, 10);
    bg.lineStyle(2, this.GOLD, 1);
    bg.strokeRoundedRect(0, 0, width, height, 10);

    // Title
    const titleText = scene.add.text(15, 15, def.name, {
      fontSize: '22px',
      fontFamily: 'Arial',
      color: '#FFD700',
      fontStyle: 'bold'
    });

    // Description
    const descText = scene.add.text(15, 45, def.desc, {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      wordWrap: { width: width - 30 }
    });

    // Level display
    this.levelText = scene.add.text(15, 75, `Level: ${currentLevel} / ${def.maxLevel}`, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#FFFFFF'
    });

    // Effect preview
    this.effectText = scene.add.text(15, 100, this.getEffectPreview(currentLevel), {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#00FF00'
    });

    // Cost display
    const nextLevel = currentLevel + 1;
    const cost = (scene as any).upgradeSystem.getCost(def.id, nextLevel);
    this.costText = scene.add.text(15, 130, `Cost: ${cost} XP`, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#FFD700',
      fontStyle: 'bold'
    });

    // Buy button
    const canBuy = (scene as any).upgradeSystem.canBuy(def.id, xpState);
    const buttonColor = canBuy.ok ? 0x00AA00 : 0x555555;

    this.buyButton = scene.add.rectangle(width - 100, height - 30, 160, 40, buttonColor)
      .setInteractive({ useHandCursor: canBuy.ok })
      .setOrigin(0.5);

    if (canBuy.ok) {
      this.buyButton.on('pointerdown', onBuy);
      this.buyButton.on('pointerover', () => this.buyButton.setFillStyle(0x00CC00));
      this.buyButton.on('pointerout', () => this.buyButton.setFillStyle(0x00AA00));
    }

    this.buyButtonText = scene.add.text(width - 100, height - 30,
      currentLevel >= def.maxLevel ? 'MAX' : (canBuy.ok ? 'BUY' : canBuy.reason || 'Locked'), {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Requirement text
    if (def.requiresLevel && xpState.level < def.requiresLevel) {
      scene.add.text(15, 155, `Requires Level ${def.requiresLevel}`, {
        fontSize: '12px',
        fontFamily: 'Arial',
        color: '#FF0000'
      });
    }

    // Container
    this.container = scene.add.container(x, y, [
      bg,
      titleText,
      descText,
      this.levelText,
      this.effectText,
      this.costText,
      this.buyButton,
      this.buyButtonText
    ]);

    // Add hover effect to entire card
    this.container.setSize(width, height);
    this.container.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);

    this.container.on('pointerover', () => {
      if (canBuy.ok) {
        scene.tweens.add({
          targets: this.container,
          scaleX: 1.02,
          scaleY: 1.02,
          duration: 150,
          ease: 'Back.easeOut'
        });
        bg.clear();
        bg.fillStyle(this.NAVY_BLUE, 0.95);
        bg.fillRoundedRect(0, 0, width, height, 10);
        bg.lineStyle(3, this.GOLD, 1);
        bg.strokeRoundedRect(0, 0, width, height, 10);
      }
    });

    this.container.on('pointerout', () => {
      scene.tweens.add({
        targets: this.container,
        scaleX: 1,
        scaleY: 1,
        duration: 150
      });
      bg.clear();
      bg.fillStyle(this.NAVY_BLUE, 0.85);
      bg.fillRoundedRect(0, 0, width, height, 10);
      bg.lineStyle(2, this.GOLD, 1);
      bg.strokeRoundedRect(0, 0, width, height, 10);
    });
  }

  private getEffectPreview(level: number): string {
    const nextLevel = level + 1;

    switch (this.def.id) {
      case 'wing_strength':
        return `+${(level * 2)}% → +${(nextLevel * 2)}% flap power`;
      case 'magnet_range':
        return `+${level * 25}px → +${nextLevel * 25}px range`;
      case 'shield_duration':
        return `+${level}s → +${nextLevel}s duration`;
      case 'blaster_cooldown':
        return `-${Math.round((1 - Math.pow(0.9, level)) * 100)}% → -${Math.round((1 - Math.pow(0.9, nextLevel)) * 100)}% cooldown`;
      case 'valor_cooldown':
        return `-${level * 6}s → -${nextLevel * 6}s cooldown`;
      case 'extra_heart':
        return `+${level} → +${nextLevel} max hearts`;
      case 'coin_gain':
        return `+${level * 5}% → +${nextLevel * 5}% XP from coins`;
      case 'glide_efficiency':
        return `-${Math.round((1 - Math.pow(0.95, level)) * 100)}% → -${Math.round((1 - Math.pow(0.95, nextLevel)) * 100)}% gravity`;
      case 'buyback_radius':
        return `+${level * 30}px → +${nextLevel * 30}px radius`;
      case 'burger_duration':
        return `+${level * 0.75}s → +${nextLevel * 0.75}s duration`;
      default:
        return '';
    }
  }

  public setScrollOffset(scrollY: number): void {
    this.container.setY(this.baseY - scrollY);
  }

  public updateLevel(newLevel: number, xpState: XPState): void {
    this.levelText.setText(`Level: ${newLevel} / ${this.def.maxLevel}`);
    this.effectText.setText(this.getEffectPreview(newLevel));

    const nextLevel = newLevel + 1;
    const cost = (this.container.scene as any).upgradeSystem.getCost(this.def.id, nextLevel);
    this.costText.setText(`Cost: ${cost} XP`);

    const canBuy = (this.container.scene as any).upgradeSystem.canBuy(this.def.id, xpState);
    const buttonColor = canBuy.ok ? 0x00AA00 : 0x555555;

    this.buyButton.setFillStyle(buttonColor);
    this.buyButton.setInteractive({ useHandCursor: canBuy.ok });
    this.buyButtonText.setText(
      newLevel >= this.def.maxLevel ? 'MAX' : (canBuy.ok ? 'BUY' : canBuy.reason || 'Locked')
    );
  }
}
