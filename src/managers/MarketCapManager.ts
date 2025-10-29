/**
 * MarketCapManager - $AOL MarketCap Milestone System
 *
 * Features:
 * - Fetches live MCAP data from Dexscreener every 60 seconds
 * - Triggers real-time events when milestones are reached
 * - Saves milestone progress to localStorage
 * - Shows recap overlay on session start if milestone is still active
 */

import Phaser from 'phaser';
import { NotificationManager, NotificationPriority } from './NotificationManager';

interface Milestone {
  level: number;
  name: string;
  down?: boolean; // true = triggers when MCAP falls below
}

interface MilestoneData {
  lastAolMilestone: number;
  lastMilestoneTime: string;
  milestoneName: string;
}

const LS_KEY_MILESTONE = 'aolMilestoneData';
const AOL_TOKEN_ID = '2oQNkePakuPbHzrVVkQ875WHeewLHCd2cAwfwiLQbonk';

export class MarketCapManager {
  private scene: Phaser.Scene;
  private notificationManager: NotificationManager;
  private lastMcap: number = 0;
  private triggeredMilestones: Set<string> = new Set();
  private updateTimer?: Phaser.Time.TimerEvent;

  // Milestone thresholds
  private readonly milestones: Milestone[] = [
    { level: 50_000_000, name: "Valor Awakening" },
    { level: 25_000_000, name: "Community Pump Mode" },
    { level: 10_000_000, name: "Bull Market Unlocked" },
    { level: 5_000_000, name: "Freedom Rising" },
    { level: 3_000_000, name: "Bear Whisper", down: true },
    { level: 1_000_000, name: "Rug Alert", down: true }
  ];

  constructor(scene: Phaser.Scene, notificationManager: NotificationManager) {
    this.scene = scene;
    this.notificationManager = notificationManager;
  }

  /**
   * Initialize the manager - check MCAP and show recap if needed
   */
  async start(): Promise<void> {
    console.log('🎯 MarketCapManager starting...');

    // Initial check
    await this.checkMarketCap();

    // Show recap if milestone is still active
    this.showRecap();

    // Set up periodic checks (every 60 seconds)
    this.updateTimer = this.scene.time.addEvent({
      delay: 60000,
      loop: true,
      callback: () => this.checkMarketCap()
    });
  }

  /**
   * Fetch current MCAP and check for milestone triggers
   */
  async checkMarketCap(): Promise<void> {
    try {
      console.log('📊 Fetching $AOL MCAP...');

      const response = await fetch(
        `https://api.dexscreener.io/latest/dex/tokens/${AOL_TOKEN_ID}`,
        {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        }
      );

      if (!response.ok) {
        console.warn('⚠️ MCAP API returned status:', response.status);
        return;
      }

      const json = await response.json();
      const pair = json.pairs?.[0];

      if (!pair || !pair.fdv) {
        console.warn('⚠️ No MCAP data found');
        return;
      }

      const currentMcap = pair.fdv; // Use FDV as MCAP
      console.log(`💰 Current $AOL MCAP: $${(currentMcap / 1_000_000).toFixed(2)}M`);

      // Check if we crossed any milestones
      this.checkMilestones(currentMcap);

      // Update last known MCAP
      this.lastMcap = currentMcap;

    } catch (error) {
      console.error('❌ Failed to fetch MCAP:', error);
      // Fail gracefully - don't break the game
    }
  }

  /**
   * Check if current MCAP crossed any milestone thresholds
   */
  private checkMilestones(currentMcap: number): void {
    for (const milestone of this.milestones) {
      const milestoneKey = `${milestone.name}-${milestone.level}`;

      // Skip if already triggered this session
      if (this.triggeredMilestones.has(milestoneKey)) {
        continue;
      }

      let triggered = false;

      if (milestone.down) {
        // Downward milestone (bear events)
        if (this.lastMcap > milestone.level && currentMcap <= milestone.level) {
          triggered = true;
        }
      } else {
        // Upward milestone (bull events)
        if (this.lastMcap < milestone.level && currentMcap >= milestone.level) {
          triggered = true;
        }
      }

      if (triggered) {
        console.log(`🎉 Milestone triggered: ${milestone.name} at $${(currentMcap / 1_000_000).toFixed(2)}M`);
        this.triggeredMilestones.add(milestoneKey);
        this.triggerEvent(milestone, currentMcap);
      }
    }
  }

  /**
   * Trigger visual effects and save to localStorage
   */
  private triggerEvent(milestone: Milestone, mcap: number): void {
    const mcapM = (mcap / 1_000_000).toFixed(1);

    // Save to localStorage
    const data: MilestoneData = {
      lastAolMilestone: milestone.level,
      lastMilestoneTime: new Date().toISOString(),
      milestoneName: milestone.name
    };
    localStorage.setItem(LS_KEY_MILESTONE, JSON.stringify(data));

    // Trigger visual effects based on milestone
    switch (milestone.name) {
      case "Freedom Rising":
        this.freedomRising(mcapM);
        break;
      case "Bull Market Unlocked":
        this.bullMarketUnlocked(mcapM);
        break;
      case "Community Pump Mode":
        this.communityPumpMode(mcapM);
        break;
      case "Valor Awakening":
        this.valorAwakening(mcapM);
        break;
      case "Bear Whisper":
        this.bearWhisper(mcapM);
        break;
      case "Rug Alert":
        this.rugAlert(mcapM);
        break;
    }
  }

  /**
   * Show recap overlay on session start if milestone is still active
   */
  private showRecap(): void {
    const savedData = localStorage.getItem(LS_KEY_MILESTONE);
    if (!savedData) return;

    try {
      const data: MilestoneData = JSON.parse(savedData);

      // Only show recap if MCAP is still at/above the milestone
      if (this.lastMcap >= data.lastAolMilestone && !data.milestoneName.includes('Bear') && !data.milestoneName.includes('Rug')) {
        const mcapM = (this.lastMcap / 1_000_000).toFixed(1);
        this.showRecapOverlay(data.milestoneName, mcapM);
      }
    } catch (error) {
      console.error('Failed to parse milestone data:', error);
    }
  }

  /**
   * Display recap text at top of screen
   */
  private showRecapOverlay(milestoneName: string, mcapM: string): void {
    const width = this.scene.cameras.main.width;

    const text = this.scene.add.text(
      width / 2,
      100,
      `$AOL currently at $${mcapM}M MCAP – ${milestoneName} Active! 🐂`,
      {
        fontSize: '24px',
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5).setDepth(10000);

    // Fade out after 2 seconds
    this.scene.tweens.add({
      targets: text,
      alpha: 0,
      duration: 500,
      delay: 2000,
      onComplete: () => text.destroy()
    });

    console.log(`📢 Recap shown: ${milestoneName}`);
  }

  /**
   * MILESTONE EFFECTS
   */

  private freedomRising(mcapM: string): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Golden background tint
    const overlay = this.scene.add.rectangle(0, 0, width, height, 0xFFD700, 0.2)
      .setOrigin(0)
      .setDepth(9998);

    // Show notification via NotificationManager
    this.notificationManager.showNotification({
      title: `🇺🇸 $AOL hit $${mcapM}M MCAP – Freedom Rising!`,
      message: '',
      priority: NotificationPriority.HIGH,
      color: '#FFD700',
      duration: 5000
    });

    // Fade out background overlay after 5 seconds
    this.scene.time.delayedCall(5000, () => {
      this.scene.tweens.add({
        targets: overlay,
        alpha: 0,
        duration: 1000,
        onComplete: () => overlay.destroy()
      });
    });

    // Play milestone sound
    if (this.scene.sound.get('milestone-reached')) {
      this.scene.sound.play('milestone-reached', { volume: 0.7 });
    }
  }

  private bullMarketUnlocked(mcapM: string): void {
    // Show notification via NotificationManager
    this.notificationManager.showNotification({
      title: `🚀 $AOL reached $${mcapM}M MCAP – Bull Market Unlocked!`,
      message: '',
      priority: NotificationPriority.HIGH,
      color: '#22C55E',
      duration: 4000
    });

    // Coin rain effect (spawn extra coins for 10 seconds)
    this.scene.time.addEvent({
      delay: 500,
      repeat: 20,
      callback: () => {
        this.scene.events.emit('milestone-coin-rain');
      }
    });

    // XP boost notification
    this.scene.events.emit('milestone-xp-boost', 1.2, 60000); // +20% for 1 minute

    // Play milestone sound
    if (this.scene.sound.get('milestone-reached')) {
      this.scene.sound.play('milestone-reached', { volume: 0.7 });
    }
  }

  private communityPumpMode(mcapM: string): void {
    // Show notification via NotificationManager
    this.notificationManager.showNotification({
      title: `🎉 $AOL is pumping! $${mcapM}M – Community Pump Mode!`,
      message: '',
      priority: NotificationPriority.HIGH,
      color: '#F59E0B',
      duration: 5000
    });

    // Freeze all enemies for 5 seconds
    this.scene.events.emit('milestone-freeze-enemies', 5000);

    // Play milestone sound
    if (this.scene.sound.get('milestone-reached')) {
      this.scene.sound.play('milestone-reached', { volume: 0.7 });
    }
  }

  private valorAwakening(mcapM: string): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Golden aura overlay
    const aura = this.scene.add.rectangle(0, 0, width, height, 0xFFD700, 0.3)
      .setOrigin(0)
      .setDepth(9998);

    // Show notification via NotificationManager
    this.notificationManager.showNotification({
      title: `🦅 $AOL surpassed $${mcapM}M – Valor Awakening!`,
      message: '',
      priority: NotificationPriority.HIGH,
      color: '#FFD700',
      duration: 5000
    });

    // Fade out aura after 5 seconds
    this.scene.time.delayedCall(5000, () => {
      this.scene.tweens.add({
        targets: aura,
        alpha: 0,
        duration: 1000,
        onComplete: () => aura.destroy()
      });
    });

    // Play milestone sound (milestone sound instead of valorawakens)
    if (this.scene.sound.get('milestone-reached')) {
      this.scene.sound.play('milestone-reached', { volume: 0.7 });
    }
  }

  private bearWhisper(mcapM: string): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Gray overlay
    const overlay = this.scene.add.rectangle(0, 0, width, height, 0x666666, 0.3)
      .setOrigin(0)
      .setDepth(9998);

    // Show notification via NotificationManager
    this.notificationManager.showNotification({
      title: `😴 $AOL fell below $${mcapM}M – Bear Whisper… Hold the Line!`,
      message: '',
      priority: NotificationPriority.HIGH,
      color: '#888888',
      duration: 4000
    });

    // Fade out overlay after 4 seconds
    this.scene.time.delayedCall(4000, () => {
      this.scene.tweens.add({
        targets: overlay,
        alpha: 0,
        duration: 1000,
        onComplete: () => overlay.destroy()
      });
    });

    // Play milestone sound
    if (this.scene.sound.get('milestone-reached')) {
      this.scene.sound.play('milestone-reached', { volume: 0.7 });
    }
  }

  private rugAlert(mcapM: string): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Red flash overlay
    const overlay = this.scene.add.rectangle(0, 0, width, height, 0xFF0000, 0.5)
      .setOrigin(0)
      .setDepth(9998);

    // Flashing effect
    this.scene.tweens.add({
      targets: overlay,
      alpha: 0.2,
      duration: 300,
      yoyo: true,
      repeat: 5
    });

    // Show notification via NotificationManager
    this.notificationManager.showNotification({
      title: `💀 RUG ALERT! $AOL under $${mcapM}M – Liquidity gone!`,
      message: '',
      priority: NotificationPriority.HIGH,
      color: '#EF4444',
      duration: 3000
    });

    // Shake screen
    this.scene.cameras.main.shake(3000, 0.01);

    // Play milestone sound
    if (this.scene.sound.get('milestone-reached')) {
      this.scene.sound.play('milestone-reached', { volume: 0.7 });
    }

    // Fade out overlay after 3 seconds
    this.scene.time.delayedCall(3000, () => {
      this.scene.tweens.add({
        targets: overlay,
        alpha: 0,
        duration: 1000,
        onComplete: () => overlay.destroy()
      });
    });
  }

  /**
   * Cleanup when scene shuts down
   */
  destroy(): void {
    if (this.updateTimer) {
      this.updateTimer.destroy();
      this.updateTimer = undefined;
    }
    this.triggeredMilestones.clear();
    console.log('🛑 MarketCapManager destroyed');
  }
}
