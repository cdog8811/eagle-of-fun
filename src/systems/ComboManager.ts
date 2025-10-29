/**
 * ComboManager.ts
 * Eagle of Fun v4.2 - Combo System Manager
 *
 * Manages power-up combos, notifications, and synergy effects.
 */

import { Scene } from 'phaser';
import {
  COMBOS,
  ComboConfig,
  getActiveCombos,
  getTotalScoreMultiplier,
  getTotalXPMultiplier,
  isInvincibleFromCombo,
  COMBO_NOTIFICATION_DURATION
} from '../config/CombosConfig';
import { NotificationManager } from '../managers/NotificationManager';

export class ComboManager {
  private scene: Scene;
  private activeCombos: Set<string> = new Set();
  private notificationManager: NotificationManager;

  constructor(scene: Scene, notificationManager: NotificationManager) {
    this.scene = scene;
    this.notificationManager = notificationManager;
  }

  /**
   * Update combo state based on currently active power-ups
   * @param activePowerUps - Object with power-up states (e.g., { cryptoActingActive: true })
   */
  public update(activePowerUps: Record<string, boolean>): void {
    // Convert power-up states to array of active IDs
    const activePowerUpIds = Object.keys(activePowerUps).filter(
      key => activePowerUps[key] === true
    );

    // Normalize power-up IDs (remove 'Active' suffix)
    const normalizedIds = activePowerUpIds.map(id => id.replace('Active', ''));

    // Get currently active combos
    const newActiveCombos = getActiveCombos(normalizedIds);

    // Check for newly activated combos
    for (const comboId of newActiveCombos) {
      if (!this.activeCombos.has(comboId)) {
        this.activateCombo(comboId);
      }
    }

    // Check for deactivated combos
    for (const comboId of this.activeCombos) {
      if (!newActiveCombos.includes(comboId)) {
        this.deactivateCombo(comboId);
      }
    }
  }

  /**
   * Activate a combo
   */
  private activateCombo(comboId: string): void {
    const combo = COMBOS[comboId];
    if (!combo) return;

    this.activeCombos.add(comboId);

    // v4.2: Display combo notification using NotificationManager
    this.notificationManager.showNotification({
      title: combo.name,
      message: combo.message,
      icon: combo.icon,
      duration: COMBO_NOTIFICATION_DURATION,
      color: '#FFD700', // Golden title
      borderColor: '#FFD700', // Golden border
      backgroundColor: '#000000'
    });

    // v4.2: Play power-up combo sound
    this.scene.sound.play('belle-collect', { volume: 0.6, rate: 1.3 });

    console.log(`[ComboManager] Activated: ${combo.name}`);
  }

  /**
   * Deactivate a combo
   */
  private deactivateCombo(comboId: string): void {
    const combo = COMBOS[comboId];
    if (!combo) return;

    this.activeCombos.delete(comboId);

    console.log(`[ComboManager] Deactivated: ${combo.name}`);
  }

  /**
   * Get current score multiplier from all active combos
   */
  public getScoreMultiplier(): number {
    return getTotalScoreMultiplier(Array.from(this.activeCombos));
  }

  /**
   * Get current XP multiplier from all active combos
   */
  public getXPMultiplier(): number {
    return getTotalXPMultiplier(Array.from(this.activeCombos));
  }

  /**
   * Check if player is invincible from any active combo
   */
  public isInvincible(): boolean {
    return isInvincibleFromCombo(Array.from(this.activeCombos));
  }

  /**
   * Get all active combo IDs
   */
  public getActiveCombos(): string[] {
    return Array.from(this.activeCombos);
  }

  /**
   * Check if a specific combo is active
   */
  public isComboActive(comboId: string): boolean {
    return this.activeCombos.has(comboId);
  }

  /**
   * Clean up all combos (v4.2: NotificationManager handles cleanup)
   */
  public destroy(): void {
    this.activeCombos.clear();
  }
}
