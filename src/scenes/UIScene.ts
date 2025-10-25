import Phaser from 'phaser';

/**
 * UIScene - Separate Scene für alle UI-Elemente
 *
 * Zeigt an:
 * - XP-Leiste (Top Right)
 * - Missionen (Bottom Right)
 * - Waffenanzeige (Bottom Left)
 *
 * Design: Modern, clean, transparent, gut lesbar
 */
export default class UIScene extends Phaser.Scene {
  // XP System
  private levelText?: Phaser.GameObjects.Text;
  private xpText?: Phaser.GameObjects.Text;
  private xpBarBg?: Phaser.GameObjects.Graphics;
  private xpBarFill?: Phaser.GameObjects.Graphics;
  private currentLevel: number = 1;
  private currentXP: number = 0;
  private xpToNextLevel: number = 1000;

  // Mission System
  private missionContainers: Phaser.GameObjects.Container[] = [];
  private missions: any[] = [];

  // Weapon Display
  private weaponContainer?: Phaser.GameObjects.Container;
  private weaponText?: Phaser.GameObjects.Text;
  private weaponIcon?: Phaser.GameObjects.Text;

  // Constants
  private readonly EDGE_PADDING = 35; // Same as top bar
  private readonly UI_BG_COLOR = 0x000000;
  private readonly UI_BG_ALPHA = 0.6; // Transparent
  private readonly UI_BORDER_COLOR = 0x444444;
  private readonly UI_BORDER_WIDTH = 2;
  private readonly UI_CORNER_RADIUS = 8;

  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create(): void {
    console.log('🎨 UIScene created');

    this.createXPDisplay();
    this.createMissionDisplay();
    this.createWeaponDisplay();
  }

  // ========== XP DISPLAY (TOP RIGHT) ==========
  private createXPDisplay(): void {
    const width = this.cameras.main.width;
    const x = width - this.EDGE_PADDING - 250; // 250px width for XP bar
    const y = this.EDGE_PADDING + 120; // Below top bar + 20px extra

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(this.UI_BG_COLOR, this.UI_BG_ALPHA);
    bg.fillRoundedRect(x, y, 250, 70, this.UI_CORNER_RADIUS);
    bg.lineStyle(this.UI_BORDER_WIDTH, this.UI_BORDER_COLOR, 1);
    bg.strokeRoundedRect(x, y, 250, 70, this.UI_CORNER_RADIUS);

    // Level Text (Large, bold)
    this.levelText = this.add.text(x + 20, y + 15, 'LEVEL 1', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold'
    });

    // XP Bar Background
    const barX = x + 20;
    const barY = y + 45;
    const barWidth = 210;
    const barHeight = 12;

    this.xpBarBg = this.add.graphics();
    this.xpBarBg.fillStyle(0x333333, 1);
    this.xpBarBg.fillRoundedRect(barX, barY, barWidth, barHeight, 6);

    // XP Bar Fill
    this.xpBarFill = this.add.graphics();
    this.updateXPBar();

    // XP Text
    this.xpText = this.add.text(x + 125, y + 15, '0 / 1000 XP', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#AAAAAA'
    });
  }

  private updateXPBar(): void {
    if (!this.xpBarFill) return;

    const width = this.cameras.main.width;
    const x = width - this.EDGE_PADDING - 250;
    const y = this.EDGE_PADDING + 120;
    const barX = x + 20;
    const barY = y + 45;
    const barWidth = 210;
    const barHeight = 12;

    const progress = this.currentXP / this.xpToNextLevel;
    const fillWidth = barWidth * progress;

    this.xpBarFill.clear();
    this.xpBarFill.fillStyle(0x4CAF50, 1); // Green
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

    // Create 3 mission slots
    for (let i = 0; i < 3; i++) {
      const y = height - this.EDGE_PADDING - (missionHeight * (i + 1)) - (spacing * i);

      // Background
      const bg = this.add.graphics();
      bg.fillStyle(this.UI_BG_COLOR, this.UI_BG_ALPHA);
      bg.fillRoundedRect(x, y, missionWidth, missionHeight, this.UI_CORNER_RADIUS);
      bg.lineStyle(this.UI_BORDER_WIDTH, this.UI_BORDER_COLOR, 1);
      bg.strokeRoundedRect(x, y, missionWidth, missionHeight, this.UI_CORNER_RADIUS);

      // Mission Title (emoji + title)
      const titleText = this.add.text(x + 15, y + 15, '🎯 Mission', {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#FFFFFF',
        fontStyle: 'bold'
      });

      // Progress Text (bigger, centered)
      const progressText = this.add.text(x + 15, y + 42, '0 / 0', {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#AAAAAA'
      });

      // Reward Text (right side)
      const rewardText = this.add.text(x + missionWidth - 80, y + 42, '+0 XP', {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#4CAF50',
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
    const y = height - this.EDGE_PADDING - 100;
    const boxWidth = 280;
    const boxHeight = 100;

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(this.UI_BG_COLOR, this.UI_BG_ALPHA);
    bg.fillRoundedRect(x, y, boxWidth, boxHeight, this.UI_CORNER_RADIUS);
    bg.lineStyle(this.UI_BORDER_WIDTH, this.UI_BORDER_COLOR, 1);
    bg.strokeRoundedRect(x, y, boxWidth, boxHeight, this.UI_CORNER_RADIUS);

    // Weapon Icon (Large emoji)
    this.weaponIcon = this.add.text(x + 20, y + 25, '🔫', {
      fontSize: '48px'
    });

    // Weapon Name
    this.weaponText = this.add.text(x + 90, y + 20, 'No Weapon', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      fontStyle: 'bold'
    });

    // Weapon Ammo/Info
    const ammoText = this.add.text(x + 90, y + 50, 'Press SPACE to pick up', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#AAAAAA'
    });

    this.weaponContainer = this.add.container(0, 0, [bg, this.weaponIcon, this.weaponText, ammoText]);
  }

  // ========== PUBLIC UPDATE METHODS ==========

  /**
   * Update XP Display
   */
  public updateXP(level: number, xp: number, xpToNext: number): void {
    if (!this.scene.isActive()) {
      console.warn('UIScene: Cannot update XP - scene not active');
      return;
    }

    this.currentLevel = level;
    this.currentXP = xp;
    this.xpToNextLevel = xpToNext;

    if (this.levelText) {
      this.levelText.setText(`LEVEL ${level}`);
    }

    if (this.xpText) {
      this.xpText.setText(`${xp} / ${xpToNext} XP`);
    }

    this.updateXPBar();
  }

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
        if (texts[0]) texts[0].setText('⏸️ No Mission');
        if (texts[1]) texts[1].setText('');
        if (texts[2]) texts[2].setText('');
        continue;
      }

      const texts = container.list.filter(obj => obj.type === 'Text') as Phaser.GameObjects.Text[];

      // Debug: Log mission data
      console.log('Mission data:', mission);

      // Update title (emoji + title) - texts[0]
      if (texts[0]) {
        const emoji = mission.emoji || '🎯';
        let title = mission.title || mission.description || 'Mission';

        // Ensure title is a string, not an object
        if (typeof title !== 'string') {
          title = String(title);
        }

        // Truncate if too long (max 20 chars)
        if (title.length > 20) {
          title = title.substring(0, 17) + '...';
        }

        texts[0].setText(`${emoji} ${title}`);
        texts[0].setColor('#FFFFFF');
      }

      // Update progress - texts[1]
      if (texts[1]) {
        if (mission.completed) {
          texts[1].setText('✅ Done');
          texts[1].setColor('#4CAF50');
        } else {
          const progress = mission.progress || 0;
          const target = mission.target || 0;
          texts[1].setText(`${progress} / ${target}`);
          texts[1].setColor('#CCCCCC');
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
        texts[2].setText(`+${xpValue} XP`);
        texts[2].setColor('#4CAF50');
      }
    }
  }

  /**
   * Update Weapon Display
   */
  public updateWeapon(weaponName: string, weaponIcon: string, info: string): void {
    if (this.weaponText) {
      this.weaponText.setText(weaponName);
    }

    if (this.weaponIcon) {
      this.weaponIcon.setText(weaponIcon);
    }

    // Update info text (ammo, cooldown, etc.)
    if (this.weaponContainer) {
      const texts = this.weaponContainer.list.filter(obj => obj.type === 'Text') as Phaser.GameObjects.Text[];
      if (texts[2]) {
        texts[2].setText(info);
      }
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

    // Particle effect (optional)
    this.cameras.main.flash(300, 76, 175, 80, false);
  }
}
