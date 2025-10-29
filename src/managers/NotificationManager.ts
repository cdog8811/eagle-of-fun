/**
 * NotificationManager.ts
 * Eagle of Fun v4.2 - Centralized Notification System
 *
 * Manages all on-screen notifications to prevent overlapping.
 * Notifications are stacked from bottom to top and auto-removed.
 */

import { Scene } from 'phaser';

export enum NotificationPriority {
  HIGH = 'high',    // Important: Weapons, Bonus Items - center, longer duration
  LOW = 'low'       // Unimportant: Combos, Coins - second line, shorter duration
}

export interface NotificationConfig {
  title: string;
  message: string;
  icon?: string;
  duration?: number; // ms
  color?: string; // Title color
  priority?: NotificationPriority; // v4.2: Priority system
  borderColor?: string;
  backgroundColor?: string;
  panelWidth?: number;
  panelHeight?: number;
}

export class NotificationManager {
  private scene: Scene;
  private highPriorityNotification: Phaser.GameObjects.Container | null = null;
  private lowPriorityNotification: Phaser.GameObjects.Container | null = null;
  private highPriorityTimer: Phaser.Time.TimerEvent | null = null;
  private lowPriorityTimer: Phaser.Time.TimerEvent | null = null;

  // Configuration
  private readonly HIGH_PRIORITY_DURATION = 3000; // 3 seconds for important notifications
  private readonly LOW_PRIORITY_DURATION = 2000; // 2 seconds for combos/coins
  private readonly NOTIFICATION_SPACING = 70; // Vertical spacing between lines

  constructor(scene: Scene) {
    this.scene = scene;
  }

  /**
   * v4.2: Show a notification with priority system
   * HIGH priority: Center, longer duration (weapons, bonus items)
   * LOW priority: Second line below, shorter duration (combos, coins)
   */
  public showNotification(config: NotificationConfig): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Determine priority (default: HIGH)
    const priority = config.priority || NotificationPriority.HIGH;
    const isHighPriority = priority === NotificationPriority.HIGH;

    // Default values based on priority
    const titleColor = config.color || '#FFD700';
    const duration = config.duration || (isHighPriority ? this.HIGH_PRIORITY_DURATION : this.LOW_PRIORITY_DURATION);

    // Calculate Y position based on priority
    let yPosition: number;
    if (isHighPriority) {
      // HIGH priority: Exact center
      yPosition = height / 2;
    } else {
      // LOW priority: Below center
      yPosition = height / 2 + this.NOTIFICATION_SPACING;
    }

    // v4.2: Simple format like "SHIELD ACTIVE" - just "ICON TITLE"
    const displayText = config.icon ? `${config.icon} ${config.title.toUpperCase()}` : config.title.toUpperCase();

    // Create text (larger for high priority)
    const fontSize = isHighPriority ? '64px' : '44px';
    const titleText = this.scene.add.text(width / 2, yPosition, displayText, {
      fontSize: fontSize,
      color: titleColor,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Create container
    const container = this.scene.add.container(0, 0, [titleText]);
    container.setDepth(isHighPriority ? 2001 : 2000); // High priority on top

    // v4.2: Fade in + Pulse animation at start
    container.setAlpha(0);

    // Fade in
    this.scene.tweens.add({
      targets: container,
      alpha: 1,
      duration: 300,
      ease: 'Cubic.easeOut'
    });

    // Pulse effect (scale up and down)
    this.scene.tweens.add({
      targets: titleText,
      scale: 1.2,
      duration: 400,
      yoyo: true,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Return to normal size
        titleText.setScale(1);
      }
    });

    // Remove existing notification of same priority
    if (isHighPriority) {
      if (this.highPriorityNotification) {
        this.removeNotification(this.highPriorityNotification, true);
      }
      if (this.highPriorityTimer) {
        this.highPriorityTimer.remove();
      }
      this.highPriorityNotification = container;
      this.highPriorityTimer = this.scene.time.delayedCall(duration, () => {
        this.removeNotification(container, true);
      });
    } else {
      if (this.lowPriorityNotification) {
        this.removeNotification(this.lowPriorityNotification, false);
      }
      if (this.lowPriorityTimer) {
        this.lowPriorityTimer.remove();
      }
      this.lowPriorityNotification = container;
      this.lowPriorityTimer = this.scene.time.delayedCall(duration, () => {
        this.removeNotification(container, false);
      });
    }
  }

  /**
   * v4.2: Remove a specific notification by priority
   */
  private removeNotification(container: Phaser.GameObjects.Container, isHighPriority: boolean): void {
    if (!container) return;

    // Get the text object from container
    const textObj = container.list[0] as Phaser.GameObjects.Text;
    if (!textObj) {
      container.destroy();
      return;
    }

    const currentY = textObj.y;

    // v4.2: Gentle scale up + fade out + move up animation
    this.scene.tweens.add({
      targets: textObj,
      alpha: 0,
      scale: 1.2,
      y: currentY - 80,
      duration: 1500,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        container.destroy();

        // Clear reference
        if (isHighPriority) {
          if (this.highPriorityNotification === container) {
            this.highPriorityNotification = null;
            this.highPriorityTimer = null;
          }
        } else {
          if (this.lowPriorityNotification === container) {
            this.lowPriorityNotification = null;
            this.lowPriorityTimer = null;
          }
        }
      }
    });
  }


  /**
   * v4.2: Clear all notifications
   */
  public clearAll(): void {
    // Cancel timers
    if (this.highPriorityTimer) {
      this.highPriorityTimer.remove();
      this.highPriorityTimer = null;
    }
    if (this.lowPriorityTimer) {
      this.lowPriorityTimer.remove();
      this.lowPriorityTimer = null;
    }

    // Destroy notifications
    if (this.highPriorityNotification) {
      this.highPriorityNotification.destroy();
      this.highPriorityNotification = null;
    }
    if (this.lowPriorityNotification) {
      this.lowPriorityNotification.destroy();
      this.lowPriorityNotification = null;
    }
  }

  /**
   * v4.2: Get number of active notifications
   */
  public getActiveCount(): number {
    let count = 0;
    if (this.highPriorityNotification) count++;
    if (this.lowPriorityNotification) count++;
    return count;
  }
}
