/**
 * XPEngine.ts - Professional XP System for Eagle of Fun
 *
 * Architecture:
 * - Pure data model, NO UI logic
 * - Event-driven communication (Phaser EventEmitter)
 * - Batched updates for performance
 * - Zero localStorage calls during gameplay
 *
 * Performance Targets:
 * - addXP(): < 0.1ms per call
 * - No UI dependencies
 * - No i18n calls
 */

import Phaser from 'phaser';

export interface XPState {
  level: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
}

export interface XPConfig {
  baseXPPerLevel: number;
  scalingFactor: number;
}

export class XPEngine extends Phaser.Events.EventEmitter {
  private level: number = 1;
  private currentXP: number = 0;
  private totalXP: number = 0;
  private xpToNextLevel: number = 500; // Updated to match new baseXPPerLevel

  private config: XPConfig = {
    baseXPPerLevel: 500,    // Increased from 300 for slower progression
    scalingFactor: 1.5      // Increased from 1.35 for exponential growth
  };

  constructor() {
    super();
    this.loadFromStorage();
  }

  /**
   * Add XP - ULTRA FAST, no UI, no callbacks, no localStorage
   * Just pure math and state updates
   */
  public addXP(amount: number): void {
    if (amount <= 0) return;

    this.currentXP += amount;
    this.totalXP += amount;

    // Check for level ups
    let leveledUp = false;
    while (this.currentXP >= this.xpToNextLevel) {
      this.currentXP -= this.xpToNextLevel;
      this.level++;
      this.xpToNextLevel = this.calculateXPForLevel(this.level);
      leveledUp = true;
    }

    // Emit event ONLY if leveled up (rare)
    if (leveledUp) {
      this.emit('levelUp', this.level);
    }
  }

  /**
   * Get current state - used by UI for polling
   */
  public getState(): XPState {
    return {
      level: this.level,
      currentXP: this.currentXP,
      totalXP: this.totalXP,
      xpToNextLevel: this.xpToNextLevel
    };
  }

  /**
   * Calculate XP needed for next level
   */
  private calculateXPForLevel(level: number): number {
    return Math.floor(
      this.config.baseXPPerLevel +
      Math.pow(level, this.config.scalingFactor) * 120
    );
  }

  /**
   * Spend XP (for upgrades)
   */
  public spendXP(amount: number): boolean {
    if (this.totalXP < amount) {
      return false;
    }

    this.totalXP -= amount;

    // Deduct from current level XP if possible
    if (this.currentXP >= amount) {
      this.currentXP -= amount;
    } else {
      this.currentXP = 0;
    }

    return true;
  }

  /**
   * Reset progress (for testing)
   */
  public reset(): void {
    this.level = 1;
    this.currentXP = 0;
    this.totalXP = 0;
    this.xpToNextLevel = this.calculateXPForLevel(1);
  }

  /**
   * Load from localStorage - ONLY called once at game start
   */
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('eof_xp_v2');
      if (saved) {
        const data = JSON.parse(saved);
        this.level = data.level || 1;
        this.currentXP = data.currentXP || 0;
        this.totalXP = data.totalXP || 0;
        this.xpToNextLevel = this.calculateXPForLevel(this.level);
      }
    } catch (e) {
      console.warn('Failed to load XP data:', e);
    }
  }

  /**
   * Save to localStorage - ONLY called on game over, pause, or scene change
   */
  public save(): void {
    try {
      const data = {
        level: this.level,
        currentXP: this.currentXP,
        totalXP: this.totalXP
      };
      localStorage.setItem('eof_xp_v2', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save XP data:', e);
    }
  }
}

// Singleton instance
let xpEngine: XPEngine | null = null;

export function getXPEngine(): XPEngine {
  if (!xpEngine) {
    xpEngine = new XPEngine();
  }
  return xpEngine;
}
