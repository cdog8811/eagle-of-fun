import Phaser from 'phaser';
import { getXPEngine } from '../systems/XPEngine';
import type { XPState } from '../systems/XPEngine';
import { getI18n } from '../systems/i18n';

/**
 * UIScene v4.2 - Professional UI with polling-based XP updates
 *
 * Performance Strategy:
 * - Polls XP state every 200ms (5 FPS - smooth enough for UI)
 * - Cached i18n labels (no translation lookups)
 * - Minimal Graphics updates
 */
export default class UIScene extends Phaser.Scene {
  private xpEngine = getXPEngine();
  private i18n = getI18n();

  // XP Display
  private levelText?: Phaser.GameObjects.Text;
  private xpText?: Phaser.GameObjects.Text;
  private xpBarBg?: Phaser.GameObjects.Graphics;
  private xpBarFill?: Phaser.GameObjects.Graphics;

  // Cached i18n labels (set once in create())
  private levelLabel: string = 'Level';
  private xpLabel: string = 'XP';

  // Polling timer for XP updates
  private lastXPPoll: number = 0;
  private xpPollInterval: number = 200; // 200ms = 5 updates per second

  // Mission System
  private missionContainers: Phaser.GameObjects.Container[] = [];
  private missions: any[] = [];

  // Weapon Display
  private weaponContainer?: Phaser.GameObjects.Container;
  private weaponText?: Phaser.GameObjects.Text;
  private weaponIcon?: Phaser.GameObjects.Text;
  private weaponEnergyBarBg?: Phaser.GameObjects.Graphics;
  private weaponEnergyBar?: Phaser.GameObjects.Graphics;
  private weaponEnergyText?: Phaser.GameObjects.Text;

  // Constants - America.Fun Patriotic Theme
  private readonly EDGE_PADDING = 35; // Same as top bar

  // Patriotic Colors (US Flag inspired)
  private readonly NAVY_BLUE = 0x002868; // Navy blue from US flag
  private readonly CRIMSON_RED = 0xDC143C; // Red from US flag
  private readonly PURE_WHITE = 0xFFFFFF; // White
  private readonly GOLD = 0xFFD700; // Gold for accents

  private readonly UI_BG_ALPHA = 0.35; // v4.2: More transparent so field is visible
  private readonly UI_BORDER_WIDTH = 3; // Thicker border
  private readonly UI_CORNER_RADIUS = 8;

  constructor() {
    super({ key: 'UIScene', active: false });
  }

  update(time: number, delta: number): void {
    // Poll XP state every 200ms instead of every frame
    if (time - this.lastXPPoll >= this.xpPollInterval) {
      this.lastXPPoll = time;
      this.updateXPDisplay();
    }
  }

  /**
   * Update XP display from engine state
   * Called only 5x per second - very performant
   */
  private updateXPDisplay(): void {
    const state = this.xpEngine.getState();

    // Update text with CACHED labels
    if (this.levelText) {
      this.levelText.setText(`${this.levelLabel} ${state.level}`);
    }
    if (this.xpText) {
      this.xpText.setText(`${state.currentXP} / ${state.xpToNextLevel} ${this.xpLabel}`);
    }

    // Update progress bar
    this.updateXPBar(state);
  }

  create(): void {
    console.log('🎨 UIScene created');

    // v4.2: Cache i18n labels ONCE like GameScene does with scoreLabel
    const levelLabelResult = this.i18n.t('ui.levelLabel');
    const xpLabelResult = this.i18n.t('ui.xp');

    // Ensure they are strings, not objects
    this.levelLabel = typeof levelLabelResult === 'string' ? levelLabelResult : 'Level';
    this.xpLabel = typeof xpLabelResult === 'string' ? xpLabelResult : 'XP';

    this.createXPDisplay();
    this.createMissionDisplay();
    this.createWeaponDisplay();

    // v4.2: Subscribe to level up events from XPEngine
    this.xpEngine.on('levelUp', (newLevel: number) => {
      this.showLevelUpAnimation();
    });

    // Get initial missions from GameScene
    // Note: GameScene will also send missions via updateMissions() after launch
    const gameScene = this.scene.get('GameScene') as any;
    if (gameScene && gameScene.missionManager) {
      console.log('🎮 UIScene - Getting initial missions from GameScene');
      const missions = gameScene.missionManager.getDailyMissions();
      if (missions && missions.length > 0) {
        this.updateMissions(missions);
      }
    }

    // Listen for scene wake events (when returning from other scenes)
    this.events.on('wake', () => {
      console.log('🔄 UIScene woke up - refreshing displays');

      // XP display updates via polling in update()

      // Refresh missions - get from GameScene
      const gameScene = this.scene.get('GameScene') as any;
      if (gameScene && gameScene.missionManager) {
        // Refresh missions based on current Meta-Level
        gameScene.missionManager.refreshMissions();

        // Get updated missions
        const missions = gameScene.missionManager.getDailyMissions();
        console.log('🔄 Refreshing missions on wake:', missions);
        this.updateMissions(missions);
      }
    });
  }

  // ========== XP DISPLAY (TOP RIGHT) ==========
  private createXPDisplay(): void {
    const width = this.cameras.main.width;
    const x = width - this.EDGE_PADDING - 250; // 250px width for XP bar
    const y = this.EDGE_PADDING + 120; // Below top bar + 20px extra

    // Background - Navy Blue
    const bg = this.add.graphics();
    bg.fillStyle(this.NAVY_BLUE, this.UI_BG_ALPHA);
    bg.fillRoundedRect(x, y, 250, 70, this.UI_CORNER_RADIUS);
    bg.lineStyle(this.UI_BORDER_WIDTH, this.GOLD, 1); // Gold border
    bg.strokeRoundedRect(x, y, 250, 70, this.UI_CORNER_RADIUS);

    // Get initial state
    const initialState = this.xpEngine.getState();

    // Level Text (Large, bold) - White
    this.levelText = this.add.text(x + 20, y + 15, `${this.levelLabel} ${initialState.level}`, {
      fontSize: '20px',
      fontFamily: this.i18n.getFontFamily(),
      color: '#FFFFFF',
      fontStyle: 'bold'
    });

    // XP Bar Background - Dark blue
    const barX = x + 20;
    const barY = y + 45;
    const barWidth = 210;
    const barHeight = 12;

    this.xpBarBg = this.add.graphics();
    this.xpBarBg.fillStyle(0x001845, 1); // Darker navy
    this.xpBarBg.fillRoundedRect(barX, barY, barWidth, barHeight, 6);

    // XP Bar Fill - Red/White stripes effect
    this.xpBarFill = this.add.graphics();
    this.updateXPBar(initialState);

    // XP Text - Gold (using cached label to avoid [object Object])
    this.xpText = this.add.text(x + 125, y + 15, `${initialState.currentXP} / ${initialState.xpToNextLevel} ${this.xpLabel}`, {
      fontSize: '14px',
      fontFamily: this.i18n.getFontFamily(),
      color: '#FFD700' // Gold
    });
  }

  private updateXPBar(state: XPState): void {
    if (!this.xpBarFill) return;

    // Calculate progress percentage
    const progress = state.currentXP / state.xpToNextLevel;
    const width = this.cameras.main.width;
    const x = width - this.EDGE_PADDING - 250;
    const barX = x + 20;
    const barY = 45 + this.EDGE_PADDING + 120; // Match createXPDisplay position
    const barWidth = 210;
    const barHeight = 12;
    const fillWidth = barWidth * progress;

    // Clear and redraw fill
    this.xpBarFill.clear();

    // Draw progress bar with patriotic red color
    this.xpBarFill.fillStyle(0xDC143C, 1); // Crimson red (US Flag red)
    this.xpBarFill.fillRoundedRect(barX, barY, fillWidth, barHeight, 6);
  }

  // ========== MISSION DISPLAY (BOTTOM RIGHT) ==========
  private createMissionDisplay(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const missionWidth = 300;
    const missionHeight = 70; // Smaller height
    const spacing = 12;
    const x = width - this.EDGE_PADDING - missionWidth;
    const bottomPadding = 120; // Extra space from bottom to avoid power-up displays

    // Create 3 mission slots
    for (let i = 0; i < 3; i++) {
      const y = height - bottomPadding - (missionHeight * (i + 1)) - (spacing * i);

      // Background - Navy Blue
      const bg = this.add.graphics();
      bg.fillStyle(this.NAVY_BLUE, this.UI_BG_ALPHA);
      bg.fillRoundedRect(x, y, missionWidth, missionHeight, this.UI_CORNER_RADIUS);

      // Gold border
      bg.lineStyle(this.UI_BORDER_WIDTH, this.GOLD, 1);
      bg.strokeRoundedRect(x, y, missionWidth, missionHeight, this.UI_CORNER_RADIUS);

      // Mission Title (emoji + title) - White
      const titleText = this.add.text(x + 15, y + 15, '🎯 Mission', {
        fontSize: '18px',
        fontFamily: this.i18n.getFontFamily(),
        color: '#FFFFFF',
        fontStyle: 'bold'
      });

      // Progress Text (bigger, centered) - White
      const progressText = this.add.text(x + 15, y + 42, '0 / 0', {
        fontSize: '16px',
        fontFamily: this.i18n.getFontFamily(),
        color: '#FFFFFF'
      });

      // Reward Text (right side) - Gold
      const rewardText = this.add.text(x + missionWidth - 80, y + 42, '+0 XP', {
        fontSize: '16px',
        fontFamily: this.i18n.getFontFamily(),
        color: '#FFD700', // Gold
        fontStyle: 'bold'
      });

      // Container for easy management
      const container = this.add.container(0, 0, [bg, titleText, progressText, rewardText]);
      this.missionContainers.push(container);
    }
  }

  // ========== WEAPON DISPLAY (BOTTOM LEFT) ==========
  private createWeaponDisplay(): void {
    const height = this.cameras.main.height;
    const x = this.EDGE_PADDING;
    const y = height - this.EDGE_PADDING - 90;
    const boxWidth = 260;
    const boxHeight = 90;

    // Background - Navy Blue (simple)
    const bg = this.add.graphics();
    bg.fillStyle(this.NAVY_BLUE, this.UI_BG_ALPHA);
    bg.fillRoundedRect(x, y, boxWidth, boxHeight, this.UI_CORNER_RADIUS);

    // Gold border
    bg.lineStyle(this.UI_BORDER_WIDTH, this.GOLD, 1);
    bg.strokeRoundedRect(x, y, boxWidth, boxHeight, this.UI_CORNER_RADIUS);

    // Weapon Icon (emoji)
    this.weaponIcon = this.add.text(x + 15, y + 15, '🔫', {
      fontSize: '32px'
    });

    // Weapon Name - White
    this.weaponText = this.add.text(x + 60, y + 18, this.i18n.t('ui.noWeapon'), {
      fontSize: '16px',
      fontFamily: this.i18n.getFontFamily(),
      color: '#FFFFFF',
      fontStyle: 'bold'
    });

    // Energy Bar Background
    this.weaponEnergyBarBg = this.add.graphics();
    this.weaponEnergyBarBg.fillStyle(0x001845, 1); // Dark navy
    this.weaponEnergyBarBg.fillRoundedRect(x + 15, y + 58, 230, 20, 4);

    // Energy Bar Fill
    this.weaponEnergyBar = this.add.graphics();

    // Energy Text (percentage) - inside bar
    this.weaponEnergyText = this.add.text(x + 130, y + 62, '100%', {
      fontSize: '14px',
      fontFamily: this.i18n.getFontFamily(),
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.weaponContainer = this.add.container(0, 0, [
      bg,
      this.weaponIcon,
      this.weaponText,
      this.weaponEnergyBarBg,
      this.weaponEnergyBar,
      this.weaponEnergyText
    ]);
  }

  // ========== PUBLIC UPDATE METHODS ==========

  // v4.2: updateXP() removed - replaced by updateXPDisplay() with polling

  /**
   * Update Mission Display
   */
  public updateMissions(missions: any[]): void {
    if (!missions || !Array.isArray(missions)) {
      console.warn('UIScene: Invalid missions data', missions);
      return;
    }

    this.missions = missions;

    for (let i = 0; i < 3; i++) {
      const container = this.missionContainers[i];
      if (!container) continue;

      const mission = missions[i];
      if (!mission) {
        // No mission in this slot
        const texts = container.list.filter(obj => obj.type === 'Text') as Phaser.GameObjects.Text[];
        if (texts[0]) texts[0].setText(this.i18n.t('ui.noMission'));
        if (texts[1]) texts[1].setText('');
        if (texts[2]) texts[2].setText('');
        continue;
      }

      const texts = container.list.filter(obj => obj.type === 'Text') as Phaser.GameObjects.Text[];

      // v3.9.2: Removed console.log - called hundreds of times per second!

      // Update title (emoji + title) - texts[0]
      if (texts[0]) {
        const emoji = mission.emoji || '🎯';

        // Use description instead of title for display
        let descKey = mission.description || mission.title || 'Mission';

        // Translate mission description (it's a key like 'mission.dailyBonk.desc')
        let description = descKey.startsWith('mission.') ? this.i18n.t(descKey) : descKey;

        // Ensure description is a string, not an object
        if (typeof description !== 'string') {
          description = String(description);
        }

        // Truncate if too long (max 25 chars to show full description)
        if (description.length > 25) {
          description = description.substring(0, 22) + '...';
        }

        texts[0].setText(`${description}`);
        texts[0].setColor('#FFFFFF');
      }

      // Update progress - texts[1]
      if (texts[1]) {
        if (mission.completed) {
          texts[1].setText(this.i18n.t('ui.missionDone'));
          texts[1].setColor('#FFD700'); // Gold for completed
        } else {
          const progress = mission.progress || 0;
          const target = mission.target || 0;
          texts[1].setText(`${progress} / ${target}`);
          texts[1].setColor('#FFFFFF'); // White for progress
        }
      }

      // Update reward - texts[2]
      if (texts[2]) {
        // reward is an object with {xp: number}
        let xpValue = 0;
        if (mission.reward && typeof mission.reward === 'object' && mission.reward.xp) {
          xpValue = mission.reward.xp;
        } else if (typeof mission.reward === 'number') {
          xpValue = mission.reward;
        } else if (mission.xpReward) {
          xpValue = mission.xpReward;
        }
        texts[2].setText(`+${xpValue} ${this.i18n.t('ui.xp')}`);
        texts[2].setColor('#FFD700'); // Gold for rewards
      }
    }
  }

  /**
   * Update Weapon Display
   * @param weaponName - Name of the weapon
   * @param weaponIcon - Emoji icon for the weapon
   * @param info - Info string like "Lv2 | Energy: 75%"
   */
  public updateWeapon(weaponName: string, weaponIcon: string, info: string): void {
    if (this.weaponText) {
      this.weaponText.setText(weaponName);
    }

    if (this.weaponIcon) {
      this.weaponIcon.setText(weaponIcon);
    }

    // Extract energy percentage from info string
    const energyMatch = info.match(/Energy:\s*(\d+)%/);
    let energyPercent = 100;
    if (energyMatch) {
      energyPercent = parseInt(energyMatch[1]);
    }

    // Update energy bar
    if (this.weaponEnergyBar && this.weaponEnergyBarBg) {
      const height = this.cameras.main.height;
      const x = this.EDGE_PADDING;
      const y = height - this.EDGE_PADDING - 90;

      this.weaponEnergyBar.clear();

      const barWidth = 230;
      const fillWidth = (barWidth * energyPercent) / 100;

      // Color based on energy level
      let barColor = 0x00FF00; // Green
      if (energyPercent < 30) barColor = 0xFF0000; // Red
      else if (energyPercent < 60) barColor = 0xFFAA00; // Orange

      this.weaponEnergyBar.fillStyle(barColor, 1);
      this.weaponEnergyBar.fillRoundedRect(x + 15, y + 58, fillWidth, 20, 4);
    }

    // Update energy text
    if (this.weaponEnergyText) {
      this.weaponEnergyText.setText(`${energyPercent}%`);
    }
  }

  /**
   * Show Level Up Animation
   */
  public showLevelUpAnimation(): void {
    if (!this.levelText) return;

    // Flash animation
    this.tweens.add({
      targets: this.levelText,
      scale: { from: 1, to: 1.3 },
      duration: 200,
      yoyo: true,
      repeat: 2
    });

    // DISABLED: Camera flash effect was causing perceived slowdown + performance issues
    // this.cameras.main.flash(300, 76, 175, 80, false);
  }
}
