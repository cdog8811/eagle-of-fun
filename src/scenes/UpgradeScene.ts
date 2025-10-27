import Phaser from 'phaser';
import { getXPSystem } from '../systems/xpSystem';
import { getUpgradeSystem, type UpgradeDef, type PlayerStats } from '../systems/upgradeSystem';
import type { XPState } from '../systems/xpSystem';

/**
 * UpgradeScene - Upgrade Hangar (v3.8 - Redesigned)
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

  constructor() {
    super({ key: 'UpgradeScene' });
  }

  create(): void {
    console.log('🛠 UPGRADE HANGAR LOADED - v3.8');

    // Get current state
    this.xpState = this.xpSystem.getState();
    this.playerStats = this.upgradeSystem.getPlayerStats();

    const { width, height } = this.cameras.main;

    // v3.8: Clean white background (like StartScene)
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // v3.8: Start menu music (same as StartScene)
    if (!this.sound.get('menu-music') || !this.sound.get('menu-music')?.isPlaying) {
      this.sound.play('menu-music', { volume: 0.5, loop: true });
    }

    // v3.8: Minimal floating elements (like StartScene)
    this.createMinimalElements();

    // v3.8: Title - clean, professional (FIXED to screen)
    const title = this.add.text(width / 2, 60, 'UPGRADE HANGAR', {
      fontSize: '72px',
      color: '#000000',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 6
    }).setOrigin(0.5).setScrollFactor(0);

    // Subtle underline (FIXED to screen)
    const underline = this.add.graphics();
    underline.fillStyle(0xE63946, 1);
    underline.fillRect(width / 2 - 240, 110, 480, 5);
    underline.setScrollFactor(0);

    // Subtitle (FIXED to screen)
    this.add.text(width / 2, 140, 'SPEND XP TO ENHANCE YOUR EAGLE', {
      fontSize: '22px',
      color: '#666666',
      fontFamily: 'Arial',
      letterSpacing: 3
    }).setOrigin(0.5).setScrollFactor(0);

    // XP Display (Top) - FIXED to screen
    this.createXPDisplay();

    // Upgrade Cards (Scrollable Grid)
    this.createUpgradeCards();

    // Bottom Buttons - FIXED to screen
    this.createBottomButtons();

    // v3.8: America.Fun Logo - bottom right (same as StartScene)
    const footerY = height - 30;
    const logo = this.add.image(0, footerY, 'america-logo');
    logo.setScale(0.36); // Same scale as StartScene
    logo.setAlpha(0.9);
    logo.setScrollFactor(0); // Fixed to screen
    logo.setDepth(1000);
    // Position logo so its right edge is 30px from screen edge
    logo.setX(width - (logo.width * 0.36 / 2) - 30);

    // Setup scrolling
    this.setupScrolling();
  }

  shutdown(): void {
    // CRITICAL: Remove all event listeners to prevent memory leaks and performance issues!
    console.log('🛠 UpgradeScene shutdown - removing event listeners');
    this.input.off('wheel');

    // Stop menu music
    this.sound.stopByKey('menu-music');
  }

  private createMinimalElements(): void {
    // Minimal subtle background elements - very discrete
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Just a few subtle lines for visual interest
    for (let i = 0; i < 3; i++) {
      const line = this.add.graphics();
      line.lineStyle(1, 0xE63946, 0.1);
      const x = Phaser.Math.Between(100, width - 100);
      const y = Phaser.Math.Between(100, height - 100);
      line.lineBetween(x, y, x + 100, y);
    }
  }

  private createXPDisplay(): void {
    const { width } = this.cameras.main;
    const x = width / 2 - 350;
    const y = 190;
    const boxWidth = 700;
    const boxHeight = 90;

    // v3.8: Modern minimal box (FIXED to screen)
    this.xpDisplayBg = this.add.graphics();
    this.xpDisplayBg.fillStyle(0x000000, 1);
    this.xpDisplayBg.fillRoundedRect(x, y, boxWidth, boxHeight, 6);
    this.xpDisplayBg.setScrollFactor(0);

    // Level (Left side) - FIXED to screen
    this.levelText = this.add.text(x + 30, y + 20, `LEVEL ${this.xpState.level}`, {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setScrollFactor(0);

    // XP Progress (Center)
    const xpBarX = x + 220;
    const xpBarY = y + 25;
    const xpBarWidth = 300;
    const xpBarHeight = 24;

    // XP Bar Background - FIXED to screen
    const xpBarBg = this.add.graphics();
    xpBarBg.fillStyle(0x333333, 1);
    xpBarBg.fillRoundedRect(xpBarX, xpBarY, xpBarWidth, xpBarHeight, 12);
    xpBarBg.setScrollFactor(0);

    // XP Bar Fill - FIXED to screen
    const progress = this.xpState.xp / this.xpState.xpToNext;
    const fillWidth = xpBarWidth * progress;

    const xpBarFill = this.add.graphics();
    xpBarFill.fillStyle(0xE63946, 1);  // Red accent
    xpBarFill.fillRoundedRect(xpBarX, xpBarY, fillWidth, xpBarHeight, 12);

    // Highlight
    xpBarFill.fillStyle(0xFFFFFF, 0.3);
    xpBarFill.fillRoundedRect(xpBarX, xpBarY, fillWidth, xpBarHeight / 3, 12);
    xpBarFill.setScrollFactor(0);

    // XP Text (below bar) - FIXED to screen
    this.xpText = this.add.text(xpBarX + xpBarWidth / 2, xpBarY + xpBarHeight + 12,
      `${this.xpState.xp} / ${this.xpState.xpToNext} XP`, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      letterSpacing: 1
    }).setOrigin(0.5, 0).setScrollFactor(0);

    // Total XP (Right side) - FIXED to screen
    this.totalXPText = this.add.text(x + boxWidth - 30, y + 35,
      `Total: ${this.xpState.totalXP} XP`, {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      letterSpacing: 1
    }).setOrigin(1, 0.5).setScrollFactor(0);
  }

  private createUpgradeCards(): void {
    const { width } = this.cameras.main;
    const upgradeDefs = this.upgradeSystem.getDefs();
    const upgradeState = this.upgradeSystem.getState();

    const cardWidth = 480;  // Bigger cards!
    const cardHeight = 200;
    const spacing = 30;
    const columns = 2;
    const startY = 320;
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
    const viewportHeight = this.cameras.main.height - startY - 100; // 100 = bottom buttons
    this.maxScrollY = Math.max(0, totalHeight - viewportHeight);
  }

  private createBottomButtons(): void {
    const { width, height } = this.cameras.main;
    const buttonY = height - 70;

    // v3.8: Modern minimal buttons (like StartScene)
    this.createButton(width / 2 - 220, buttonY, 'PLAY AGAIN', () => this.onPlayAgain(), 0x000000);
    this.createButton(width / 2 + 220, buttonY, 'RESET ALL', () => this.onReset(), 0x000000);
  }

  private createButton(x: number, y: number, text: string, callback: () => void, color: number): void {
    // v3.8: Use StartScene button style (Container based)
    const button = this.add.container(x, y);
    button.setScrollFactor(0); // Fixed to screen
    button.setDepth(1000);

    // Modern minimal button - same as StartScene
    const bg = this.add.graphics();
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(-200, -35, 400, 70, 6);

    const buttonText = this.add.text(0, 0, text.toUpperCase(), {
      fontSize: '28px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    button.setSize(400, 70);
    button.setInteractive(new Phaser.Geom.Rectangle(-200, -35, 400, 70), Phaser.Geom.Rectangle.Contains);

    // Elegant hover effect (same as StartScene)
    button.on('pointerover', () => {
      if (this.sound.get('hover-button')) {
        this.sound.play('hover-button', { volume: 0.3 });
      }
      bg.clear();
      bg.fillStyle(0xE63946, 1); // Red hover
      bg.fillRoundedRect(-200, -35, 400, 70, 6);
      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(color, 1);
      bg.fillRoundedRect(-200, -35, 400, 70, 6);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      });
    });

    button.on('pointerdown', () => {
      if (this.sound.get('menu-button')) {
        this.sound.play('menu-button', { volume: 0.4 });
      }
      this.tweens.add({
        targets: button,
        scaleX: 0.98,
        scaleY: 0.98,
        duration: 100,
        yoyo: true,
        onComplete: callback
      });
    });
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

    // Stop menu music before starting game
    this.sound.stopByKey('menu-music');

    this.scene.start('GameScene');
  }

  private showBuyConfirmation(def: UpgradeDef, cost: number, onConfirm: () => void): void {
    const { width, height } = this.cameras.main;

    // Dark overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
      .setOrigin(0)
      .setDepth(2000)
      .setInteractive();

    // v3.8: Larger white confirmation box for better text visibility
    const boxWidth = 700;
    const boxHeight = 380;
    const box = this.add.graphics();
    box.setDepth(2001);
    box.fillStyle(0xFFFFFF, 1);
    box.fillRoundedRect(width / 2 - boxWidth / 2, height / 2 - boxHeight / 2, boxWidth, boxHeight, 12);
    box.lineStyle(5, 0x000000, 1);
    box.strokeRoundedRect(width / 2 - boxWidth / 2, height / 2 - boxHeight / 2, boxWidth, boxHeight, 12);

    // Title - larger and clearer
    const title = this.add.text(width / 2, height / 2 - 140, 'CONFIRM PURCHASE', {
      fontSize: '46px',
      fontFamily: 'Arial',
      color: '#000000',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0.5).setDepth(2002);

    // Red underline accent
    const underline = this.add.graphics();
    underline.fillStyle(0xE63946, 1);
    underline.fillRect(width / 2 - 160, height / 2 - 110, 320, 4);
    underline.setDepth(2002);

    // Details - better spacing and readability
    const currentLevel = this.upgradeSystem.getState().levels[def.id] || 0;
    const details = this.add.text(width / 2, height / 2 - 40,
      `${def.name}\n\nLevel ${currentLevel} → ${currentLevel + 1}\n\nCost: ${cost} XP`, {
      fontSize: '26px',
      fontFamily: 'Arial',
      color: '#000000',
      fontStyle: 'bold',
      align: 'center',
      lineSpacing: 12
    }).setOrigin(0.5).setDepth(2002);

    // Confirm button (green) - larger
    const confirmBtnContainer = this.add.container(width / 2 - 130, height / 2 + 130).setDepth(2003);
    const confirmBtnBg = this.add.graphics();
    confirmBtnBg.fillStyle(0x00AA00, 1);
    confirmBtnBg.fillRoundedRect(-100, -30, 200, 60, 8);

    const confirmText = this.add.text(0, 0, 'BUY', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0.5);

    confirmBtnContainer.add([confirmBtnBg, confirmText]);
    confirmBtnContainer.setSize(200, 60);
    confirmBtnContainer.setInteractive(new Phaser.Geom.Rectangle(-100, -30, 200, 60), Phaser.Geom.Rectangle.Contains);

    // Cancel button (red) - larger
    const cancelBtnContainer = this.add.container(width / 2 + 130, height / 2 + 130).setDepth(2003);
    const cancelBtnBg = this.add.graphics();
    cancelBtnBg.fillStyle(0xE63946, 1);
    cancelBtnBg.fillRoundedRect(-100, -30, 200, 60, 8);

    const cancelText = this.add.text(0, 0, 'CANCEL', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0.5);

    cancelBtnContainer.add([cancelBtnBg, cancelText]);
    cancelBtnContainer.setSize(200, 60);
    cancelBtnContainer.setInteractive(new Phaser.Geom.Rectangle(-100, -30, 200, 60), Phaser.Geom.Rectangle.Contains);

    // Cleanup function
    const cleanup = () => {
      overlay.destroy();
      box.destroy();
      title.destroy();
      underline.destroy();
      details.destroy();
      confirmBtnContainer.destroy();
      cancelBtnContainer.destroy();
    };

    // Confirm action
    confirmBtnContainer.on('pointerdown', () => {
      cleanup();
      onConfirm();
    });

    // Cancel action
    cancelBtnContainer.on('pointerdown', cleanup);
    overlay.on('pointerdown', cleanup);

    // Hover effects - updated for larger buttons
    confirmBtnContainer.on('pointerover', () => {
      confirmBtnBg.clear();
      confirmBtnBg.fillStyle(0x00CC00, 1);
      confirmBtnBg.fillRoundedRect(-100, -30, 200, 60, 8);
    });
    confirmBtnContainer.on('pointerout', () => {
      confirmBtnBg.clear();
      confirmBtnBg.fillStyle(0x00AA00, 1);
      confirmBtnBg.fillRoundedRect(-100, -30, 200, 60, 8);
    });

    cancelBtnContainer.on('pointerover', () => {
      cancelBtnBg.clear();
      cancelBtnBg.fillStyle(0xFF4456, 1);
      cancelBtnBg.fillRoundedRect(-100, -30, 200, 60, 8);
    });
    cancelBtnContainer.on('pointerout', () => {
      cancelBtnBg.clear();
      cancelBtnBg.fillStyle(0xE63946, 1);
      cancelBtnBg.fillRoundedRect(-100, -30, 200, 60, 8);
    });
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

    const { width, height } = this.cameras.main;

    // v3.8: Clean white confirmation dialog
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
      .setOrigin(0)
      .setDepth(1000)
      .setInteractive();

    const boxWidth = 550;
    const boxHeight = 260;
    const box = this.add.graphics();
    box.setDepth(1001);
    box.fillStyle(0xFFFFFF, 1);
    box.fillRoundedRect(width / 2 - boxWidth / 2, height / 2 - boxHeight / 2, boxWidth, boxHeight, 10);
    box.lineStyle(4, 0xE63946, 1);
    box.strokeRoundedRect(width / 2 - boxWidth / 2, height / 2 - boxHeight / 2, boxWidth, boxHeight, 10);

    const confirmText = this.add.text(
      width / 2,
      height / 2 - 60,
      'RESET ALL UPGRADES?',
      {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#000000',
        fontStyle: 'bold',
        letterSpacing: 2
      }
    ).setOrigin(0.5).setDepth(1002);

    const warningText = this.add.text(
      width / 2,
      height / 2 - 10,
      'This will reset ALL upgrades!\nYour XP will be refunded.',
      {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#666666',
        align: 'center',
        lineSpacing: 5
      }
    ).setOrigin(0.5).setDepth(1002);

    // Confirm button
    const confirmBtnContainer = this.add.container(width / 2 - 100, height / 2 + 70).setDepth(1003);
    const confirmBtnBg = this.add.graphics();
    confirmBtnBg.fillStyle(0xE63946, 1);
    confirmBtnBg.fillRoundedRect(-85, -25, 170, 50, 6);

    const confirmBtnText = this.add.text(0, 0, 'RESET', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);

    confirmBtnContainer.add([confirmBtnBg, confirmBtnText]);
    confirmBtnContainer.setSize(170, 50);
    confirmBtnContainer.setInteractive(new Phaser.Geom.Rectangle(-85, -25, 170, 50), Phaser.Geom.Rectangle.Contains);

    // Cancel button
    const cancelBtnContainer = this.add.container(width / 2 + 100, height / 2 + 70).setDepth(1003);
    const cancelBtnBg = this.add.graphics();
    cancelBtnBg.fillStyle(0x000000, 1);
    cancelBtnBg.fillRoundedRect(-85, -25, 170, 50, 6);

    const cancelBtnText = this.add.text(0, 0, 'CANCEL', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);

    cancelBtnContainer.add([cancelBtnBg, cancelBtnText]);
    cancelBtnContainer.setSize(170, 50);
    cancelBtnContainer.setInteractive(new Phaser.Geom.Rectangle(-85, -25, 170, 50), Phaser.Geom.Rectangle.Contains);

    // Confirm action
    confirmBtnContainer.once('pointerdown', () => {
      console.log('🗑️ Confirming reset...');
      this.upgradeSystem.resetAll();
      this.xpSystem.resetForNewProfile();
      this.xpState = this.xpSystem.getState();
      this.refreshUI();
      overlay.destroy();
      box.destroy();
      confirmText.destroy();
      warningText.destroy();
      confirmBtnContainer.destroy();
      cancelBtnContainer.destroy();
      console.log('✅ Reset complete');
    });

    // Cancel action
    const cleanup = () => {
      overlay.destroy();
      box.destroy();
      confirmText.destroy();
      warningText.destroy();
      confirmBtnContainer.destroy();
      cancelBtnContainer.destroy();
    };

    cancelBtnContainer.once('pointerdown', cleanup);
    overlay.once('pointerdown', cleanup);

    // Hover effects
    confirmBtnContainer.on('pointerover', () => {
      confirmBtnBg.clear();
      confirmBtnBg.fillStyle(0xFF4456, 1);
      confirmBtnBg.fillRoundedRect(-85, -25, 170, 50, 6);
    });
    confirmBtnContainer.on('pointerout', () => {
      confirmBtnBg.clear();
      confirmBtnBg.fillStyle(0xE63946, 1);
      confirmBtnBg.fillRoundedRect(-85, -25, 170, 50, 6);
    });

    cancelBtnContainer.on('pointerover', () => {
      cancelBtnBg.clear();
      cancelBtnBg.fillStyle(0x333333, 1);
      cancelBtnBg.fillRoundedRect(-85, -25, 170, 50, 6);
    });
    cancelBtnContainer.on('pointerout', () => {
      cancelBtnBg.clear();
      cancelBtnBg.fillStyle(0x000000, 1);
      cancelBtnBg.fillRoundedRect(-85, -25, 170, 50, 6);
    });
  }
}

/**
 * UpgradeCard - Individual upgrade card component (v3.8 - Redesigned)
 */
class UpgradeCard {
  public def: UpgradeDef;
  private container: Phaser.GameObjects.Container;
  private levelText: Phaser.GameObjects.Text;
  private costText: Phaser.GameObjects.Text;
  private buyButton: Phaser.GameObjects.Container;
  private buyButtonBg: Phaser.GameObjects.Graphics;
  private buyButtonRect?: Phaser.GameObjects.Rectangle;  // v3.8: Rectangle for hit detection
  private buyButtonText: Phaser.GameObjects.Text;
  private effectText: Phaser.GameObjects.Text;
  private bgGraphics: Phaser.GameObjects.Graphics;

  private baseY: number;
  private cardWidth: number;
  private cardHeight: number;
  private buttonX: number;  // v3.8: Store button position
  private buttonY: number;
  private buttonWidth: number = 160;
  private buttonHeight: number = 50;

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
    this.cardWidth = width;
    this.cardHeight = height;

    // v3.8: Clean white background with black border
    this.bgGraphics = scene.add.graphics();
    this.bgGraphics.fillStyle(0xFFFFFF, 1);
    this.bgGraphics.fillRoundedRect(0, 0, width, height, 8);
    this.bgGraphics.lineStyle(3, 0x000000, 1);
    this.bgGraphics.strokeRoundedRect(0, 0, width, height, 8);

    // Title with red underline
    const titleText = scene.add.text(20, 20, def.name.toUpperCase(), {
      fontSize: '26px',
      fontFamily: 'Arial',
      color: '#000000',
      fontStyle: 'bold',
      letterSpacing: 2
    });

    const titleUnderline = scene.add.graphics();
    titleUnderline.fillStyle(0xE63946, 1);
    titleUnderline.fillRect(20, 52, 100, 3);

    // Description
    const descText = scene.add.text(20, 65, def.desc, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#666666',
      wordWrap: { width: width - 40 }
    });

    // Level display
    this.levelText = scene.add.text(20, 105, `LEVEL: ${currentLevel} / ${def.maxLevel}`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#000000',
      fontStyle: 'bold',
      letterSpacing: 1
    });

    // Effect preview
    this.effectText = scene.add.text(20, 130, this.getEffectPreview(currentLevel), {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: '#00AA00'
    });

    // Cost display
    const nextLevel = currentLevel + 1;
    const cost = (scene as any).upgradeSystem.getCost(def.id, nextLevel);
    this.costText = scene.add.text(20, 160, `COST: ${cost} XP`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#E63946',
      fontStyle: 'bold',
      letterSpacing: 1
    });

    // v3.8: Modern buy button - using Rectangle for better hit detection
    const canBuy = (scene as any).upgradeSystem.canBuy(def.id, xpState);
    const buttonColor = canBuy.ok ? 0x000000 : 0x999999;
    this.buttonX = width - 100;
    this.buttonY = height - 35;

    // Background rectangle
    this.buyButtonRect = scene.add.rectangle(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, buttonColor, 1);

    // Round corners overlay
    this.buyButtonBg = scene.add.graphics();
    this.buyButtonBg.fillStyle(buttonColor, 1);
    this.buyButtonBg.fillRoundedRect(this.buttonX - this.buttonWidth / 2, this.buttonY - this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, 6);

    // Button text
    this.buyButtonText = scene.add.text(this.buttonX, this.buttonY,
      currentLevel >= def.maxLevel ? 'MAX' : (canBuy.ok ? 'BUY' : 'LOCKED'), {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);

    // Store reference for updates
    this.buyButton = scene.add.container(0, 0);
    this.buyButton.add([this.buyButtonRect, this.buyButtonBg, this.buyButtonText]);

    // Make rectangle interactive (NOT container!)
    this.buyButtonRect.setInteractive({ useHandCursor: canBuy.ok });

    if (canBuy.ok) {
      this.buyButtonRect.on('pointerdown', onBuy);
      this.buyButtonRect.on('pointerover', () => {
        this.buyButtonRect!.setFillStyle(0xE63946, 1);
        this.buyButtonBg.clear();
        this.buyButtonBg.fillStyle(0xE63946, 1);
        this.buyButtonBg.fillRoundedRect(this.buttonX - this.buttonWidth / 2, this.buttonY - this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, 6);
      });
      this.buyButtonRect.on('pointerout', () => {
        this.buyButtonRect!.setFillStyle(0x000000, 1);
        this.buyButtonBg.clear();
        this.buyButtonBg.fillStyle(0x000000, 1);
        this.buyButtonBg.fillRoundedRect(this.buttonX - this.buttonWidth / 2, this.buttonY - this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, 6);
      });
    }

    // Requirement text
    if (def.requiresLevel && xpState.level < def.requiresLevel) {
      scene.add.text(width - 200, 160, `Requires Level ${def.requiresLevel}`, {
        fontSize: '13px',
        fontFamily: 'Arial',
        color: '#E63946'
      });
    }

    // Container
    this.container = scene.add.container(x, y, [
      this.bgGraphics,
      titleText,
      titleUnderline,
      descText,
      this.levelText,
      this.effectText,
      this.costText,
      this.buyButton
    ]);

    // v3.8: Card hover effect - REMOVED container interactivity to not block button clicks
    // The card background itself handles visual feedback without blocking child elements
    // Note: No setInteractive on container to allow button clicks to work properly
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
    this.levelText.setText(`LEVEL: ${newLevel} / ${this.def.maxLevel}`);
    this.effectText.setText(this.getEffectPreview(newLevel));

    const nextLevel = newLevel + 1;
    const cost = (this.container.scene as any).upgradeSystem.getCost(this.def.id, nextLevel);
    this.costText.setText(`COST: ${cost} XP`);

    const canBuy = (this.container.scene as any).upgradeSystem.canBuy(this.def.id, xpState);
    const buttonColor = canBuy.ok ? 0x000000 : 0x999999;

    // Update rectangle fill
    if (this.buyButtonRect) {
      this.buyButtonRect.setFillStyle(buttonColor, 1);
      this.buyButtonRect.setInteractive({ useHandCursor: canBuy.ok });
    }

    // Update graphics overlay
    this.buyButtonBg.clear();
    this.buyButtonBg.fillStyle(buttonColor, 1);
    this.buyButtonBg.fillRoundedRect(this.buttonX - this.buttonWidth / 2, this.buttonY - this.buttonHeight / 2, this.buttonWidth, this.buttonHeight, 6);

    this.buyButtonText.setText(
      newLevel >= this.def.maxLevel ? 'MAX' : (canBuy.ok ? 'BUY' : 'LOCKED')
    );
  }
}
