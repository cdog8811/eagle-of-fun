/**
 * UIHooks v3.8
 *
 * Event bridge between GameScene core systems and UIScene
 * Provides a clean interface for updating UI elements
 */

import Phaser from 'phaser';

export class UIHooks {
  private scene: Phaser.Scene;
  private uiScene?: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public init(): void {
    // Get reference to UIScene
    this.uiScene = this.scene.scene.get('UIScene');

    if (!this.uiScene) {
      console.warn('⚠️ UIHooks: UIScene not found');
      return;
    }

    console.log('🔗 UIHooks initialized');
  }

  // ========== SCORE & XP ==========

  /**
   * Update score display
   */
  public updateScore(score: number): void {
    if (!this.uiScene || typeof (this.uiScene as any).updateScore !== 'function') return;
    (this.uiScene as any).updateScore(score);
  }

  /**
   * Update XP bar
   */
  public updateXP(current: number, required: number, level: number): void {
    if (!this.uiScene || typeof (this.uiScene as any).updateXP !== 'function') return;
    (this.uiScene as any).updateXP(current, required, level);
  }

  /**
   * Show level up notification
   */
  public showLevelUp(newLevel: number): void {
    if (!this.uiScene || typeof (this.uiScene as any).showLevelUp !== 'function') return;
    (this.uiScene as any).showLevelUp(newLevel);
  }

  // ========== COINS & WEAPONS ==========

  /**
   * Update coin display
   */
  public updateCoins(bonk: number, aol: number, burger: number): void {
    if (!this.uiScene || typeof (this.uiScene as any).updateCoins !== 'function') return;
    (this.uiScene as any).updateCoins(bonk, aol, burger);
  }

  /**
   * Update weapon energy display
   */
  public updateWeaponEnergy(energy: number, maxEnergy: number, weaponName: string): void {
    if (!this.uiScene || typeof (this.uiScene as any).updateWeaponEnergy !== 'function') return;
    (this.uiScene as any).updateWeaponEnergy(energy, maxEnergy, weaponName);
  }

  // ========== COMBO & STYLE ==========

  /**
   * Update combo display
   */
  public updateCombo(kills: number, multiplier: number, timer: number): void {
    if (!this.uiScene || typeof (this.uiScene as any).updateCombo !== 'function') return;
    (this.uiScene as any).updateCombo(kills, multiplier, timer);
  }

  /**
   * Show style bonus notification
   */
  public showStyleBonus(bonusName: string, points: number): void {
    if (!this.uiScene || typeof (this.uiScene as any).showStyleBonus !== 'function') return;
    (this.uiScene as any).showStyleBonus(bonusName, points);
  }

  // ========== POWER-UPS ==========

  /**
   * Update power-up display
   */
  public updatePowerUp(type: string, timeRemaining: number): void {
    if (!this.uiScene || typeof (this.uiScene as any).updatePowerUp !== 'function') return;
    (this.uiScene as any).updatePowerUp(type, timeRemaining);
  }

  /**
   * Remove power-up from display
   */
  public removePowerUp(type: string): void {
    if (!this.uiScene || typeof (this.uiScene as any).removePowerUp !== 'function') return;
    (this.uiScene as any).removePowerUp(type);
  }

  // ========== MISSIONS ==========

  /**
   * Update mission progress
   */
  public updateMissionProgress(missionId: string, progress: number, target: number): void {
    if (!this.uiScene || typeof (this.uiScene as any).updateMissionProgress !== 'function') return;
    (this.uiScene as any).updateMissionProgress(missionId, progress, target);
  }

  /**
   * Show mission complete notification
   */
  public showMissionComplete(missionName: string, reward: number): void {
    if (!this.uiScene || typeof (this.uiScene as any).showMissionComplete !== 'function') return;
    (this.uiScene as any).showMissionComplete(missionName, reward);
  }

  // ========== PHASE & BOSS ==========

  /**
   * Update phase display
   */
  public updatePhase(phaseNumber: number, phaseName: string): void {
    if (!this.uiScene || typeof (this.uiScene as any).updatePhase !== 'function') return;
    (this.uiScene as any).updatePhase(phaseNumber, phaseName);
  }

  /**
   * Show boss warning
   */
  public showBossWarning(bossName: string, bossTitle: string): void {
    if (!this.uiScene || typeof (this.uiScene as any).showBossWarning !== 'function') return;
    (this.uiScene as any).showBossWarning(bossName, bossTitle);
  }

  /**
   * Update boss HP bar
   */
  public updateBossHP(hp: number, maxHp: number, bossName: string): void {
    if (!this.uiScene || typeof (this.uiScene as any).updateBossHP !== 'function') return;
    (this.uiScene as any).updateBossHP(hp, maxHp, bossName);
  }

  /**
   * Hide boss HP bar
   */
  public hideBossHP(): void {
    if (!this.uiScene || typeof (this.uiScene as any).hideBossHP !== 'function') return;
    (this.uiScene as any).hideBossHP();
  }

  // ========== LIVES & HEALTH ==========

  /**
   * Update lives display
   */
  public updateLives(lives: number): void {
    if (!this.uiScene || typeof (this.uiScene as any).updateLives !== 'function') return;
    (this.uiScene as any).updateLives(lives);
  }

  /**
   * Update shield display
   */
  public updateShield(active: boolean): void {
    if (!this.uiScene || typeof (this.uiScene as any).updateShield !== 'function') return;
    (this.uiScene as any).updateShield(active);
  }

  // ========== NOTIFICATIONS ==========

  /**
   * Show general notification
   */
  public showNotification(message: string, duration?: number): void {
    if (!this.uiScene || typeof (this.uiScene as any).showNotification !== 'function') return;
    (this.uiScene as any).showNotification(message, duration);
  }

  /**
   * Show warning message
   */
  public showWarning(message: string): void {
    if (!this.uiScene || typeof (this.uiScene as any).showWarning !== 'function') return;
    (this.uiScene as any).showWarning(message);
  }

  // ========== CLEANUP ==========

  /**
   * Cleanup
   */
  public destroy(): void {
    this.uiScene = undefined;
  }
}
