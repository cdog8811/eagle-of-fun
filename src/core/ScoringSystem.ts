/**
 * ScoringSystem v3.8
 *
 * Centralized scoring with combo tracking, style bonuses, and multipliers
 */

import Phaser from 'phaser';
import {
  COIN_VALUES,
  COMBO_CONFIG,
  STYLE_BONUSES,
  VALOR_MULTIPLIERS,
  SCORE_DISPLAY,
  calculateEnemyScore,
  calculateComboMultiplier,
  getComboTier,
  type StyleBonus
} from '../config/Scoring';

export interface ScoreEvent {
  points: number;
  x: number;
  y: number;
  type: 'coin' | 'enemy' | 'bonus' | 'combo';
  multiplier?: number;
}

export class ScoringSystem {
  private scene: Phaser.Scene;
  private score: number = 0;

  // Kill tracking
  private totalKills: number = 0;

  // Combo tracking
  private comboKills: number = 0;
  private comboTimer: number = 0;
  private comboMaxTimer: number = COMBO_CONFIG.baseTimer;

  // Valor multiplier
  private valorMultiplier: number = 1.0;

  // Phase/time tracking for difficulty multiplier
  private currentPhase: number = 1;
  private gameStartTime: number = 0;

  // Style bonus tracking
  private recentKills: { time: number; x: number; y: number }[] = [];
  private lastDamageTime: number = 0;
  private shieldBreakerCount: number = 0;

  // Floating score texts
  private floatingTexts: Phaser.GameObjects.Text[] = [];

  // Callbacks
  private onScoreChangeCallback?: (score: number) => void;
  private onComboChangeCallback?: (kills: number, multiplier: number, timer: number) => void;
  private onStyleBonusCallback?: (bonus: StyleBonus, points: number) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gameStartTime = 0; // v3.8: Initialize in init() with scene.time.now
  }

  /**
   * Initialize the scoring system
   */
  public init(startPhase: number = 1): void {
    this.score = 0;
    this.totalKills = 0;
    this.currentPhase = startPhase;
    this.comboKills = 0;
    this.comboTimer = 0;
    // v3.8: Use scene.time.now instead of Date.now() - synced with game time!
    this.gameStartTime = this.scene.time.now;
    this.valorMultiplier = 1.0;
    this.recentKills = [];
    this.lastDamageTime = 0;
    this.shieldBreakerCount = 0;

    console.log('ScoringSystem initialized');
  }

  /**
   * Update combo timer (call every frame)
   */
  public update(dt: number): void {
    // Update combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;

      if (this.comboTimer <= 0) {
        this.resetCombo();
      }
    }

    // Clean up old kills for style bonus tracking
    // v3.8: Use scene.time.now for consistency
    const now = this.scene.time.now;
    this.recentKills = this.recentKills.filter(k => now - k.time < 5000);

    // Update floating texts
    this.updateFloatingTexts(dt);
  }

  // ========== SCORING METHODS ==========

  /**
   * Add score from coin collection
   */
  public addCoinScore(coinType: keyof typeof COIN_VALUES, x: number, y: number): void {
    const points = COIN_VALUES[coinType];
    const finalPoints = Math.floor(points * this.valorMultiplier);

    this.addScore(finalPoints);
    this.showFloatingScore(finalPoints, x, y, 'coin');
  }

  /**
   * Add score from enemy kill
   */
  public addEnemyScore(enemyId: string, x: number, y: number, fromWeakpoint: boolean = false): void {
    // v3.8: Use scene.time.now for accurate game time
    const minutesElapsed = (this.scene.time.now - this.gameStartTime) / 60000;

    // Calculate base score with all multipliers
    const basePoints = calculateEnemyScore(
      enemyId,
      this.currentPhase,
      minutesElapsed,
      this.comboKills,
      this.valorMultiplier
    );

    // Weakpoint bonus
    const finalPoints = fromWeakpoint ? Math.floor(basePoints * 1.5) : basePoints;

    this.addScore(finalPoints);
    this.incrementCombo();

    // Track kill for style bonuses (v3.8: Use scene.time.now)
    this.recentKills.push({ time: this.scene.time.now, x, y });

    // Check for style bonuses
    this.checkStyleBonuses(x, y, fromWeakpoint);

    // Show floating score with combo indicator
    const comboMult = calculateComboMultiplier(this.comboKills);
    this.showFloatingScore(finalPoints, x, y, 'enemy', comboMult);
  }

  /**
   * Add style bonus
   */
  public addStyleBonus(bonusId: keyof typeof STYLE_BONUSES, x: number, y: number): void {
    const bonus = STYLE_BONUSES[bonusId];
    if (!bonus) return;

    const points = Math.floor(bonus.points * this.valorMultiplier);
    this.addScore(points);

    this.showFloatingScore(points, x, y, 'bonus');

    // Notify callback
    if (this.onStyleBonusCallback) {
      this.onStyleBonusCallback(bonus, points);
    }

    console.log(`Style Bonus: ${bonus.name} (+${points})`);
  }

  /**
   * Internal score addition
   */
  private addScore(points: number): void {
    this.score += points;

    if (this.onScoreChangeCallback) {
      this.onScoreChangeCallback(this.score);
    }
  }

  // ========== COMBO SYSTEM ==========

  /**
   * Increment combo on kill
   */
  private incrementCombo(): void {
    this.comboKills++;
    this.totalKills++;

    // Extend timer
    this.comboTimer = Math.min(
      COMBO_CONFIG.baseTimer + (this.comboKills * COMBO_CONFIG.timerIncPerKill),
      COMBO_CONFIG.maxTimer
    );

    if (this.onComboChangeCallback) {
      const mult = calculateComboMultiplier(this.comboKills);
      this.onComboChangeCallback(this.comboKills, mult, this.comboTimer);
    }
  }

  /**
   * Reset combo (on timer expire or damage taken)
   */
  public resetCombo(): void {
    if (this.comboKills > 0) {
      console.log(`Combo broken at ${this.comboKills} kills`);
    }

    this.comboKills = 0;
    this.comboTimer = 0;

    if (this.onComboChangeCallback) {
      this.onComboChangeCallback(0, 1.0, 0);
    }
  }

  // ========== VALOR MULTIPLIER ==========

  /**
   * Set Valor multiplier (from Valor Mode)
   */
  public setValorMultiplier(stage: 'RISING' | 'UNLEASHED' | 'AFTERGLOW' | 'NONE'): void {
    switch (stage) {
      case 'RISING':
        this.valorMultiplier = VALOR_MULTIPLIERS.RISING;
        break;
      case 'UNLEASHED':
        this.valorMultiplier = VALOR_MULTIPLIERS.UNLEASHED;
        break;
      case 'AFTERGLOW':
        this.valorMultiplier = VALOR_MULTIPLIERS.AFTERGLOW;
        break;
      case 'NONE':
      default:
        this.valorMultiplier = 1.0;
        break;
    }

    console.log(`Valor multiplier: ${this.valorMultiplier}x`);
  }

  // ========== STYLE BONUSES ==========

  /**
   * Check for style bonuses after kill
   */
  private checkStyleBonuses(x: number, y: number, fromWeakpoint: boolean): void {
    // v3.8: Use scene.time.now for consistency
    const now = this.scene.time.now;

    // Aerial Ace: 5 kills in 2 seconds
    const recentKills = this.recentKills.filter(k => now - k.time < 2000);
    if (recentKills.length >= 5) {
      this.addStyleBonus('aerialAce', x, y);
      this.recentKills = []; // Clear to prevent spam
    }

    // Flawless 30s: No damage for 30 seconds (v3.8: scene.time.now)
    if (now - this.lastDamageTime > 30000 && this.lastDamageTime > 0) {
      this.addStyleBonus('flawless30', x, y);
      this.lastDamageTime = now; // Reset to prevent spam
    }

    // Shield Breaker: 3 shielded enemies from weakpoint
    if (fromWeakpoint) {
      this.shieldBreakerCount++;
      if (this.shieldBreakerCount >= 3) {
        this.addStyleBonus('shieldBreaker', x, y);
        this.shieldBreakerCount = 0;
      }
    }
  }

  /**
   * Notify damage taken (resets flawless bonus, combo)
   */
  public onDamageTaken(): void {
    // v3.8: Use scene.time.now for consistency
    this.lastDamageTime = this.scene.time.now;
    this.resetCombo();
  }

  // ========== FLOATING SCORE DISPLAY ==========

  /**
   * Show floating score text
   */
  private showFloatingScore(
    points: number,
    x: number,
    y: number,
    type: 'coin' | 'enemy' | 'bonus' | 'combo',
    multiplier?: number
  ): void {
    // Determine font size based on points (v3.8: Type-safe)
    let fontSize: string = SCORE_DISPLAY.smallFont;
    if (points >= SCORE_DISPLAY.largeScore) {
      fontSize = SCORE_DISPLAY.largeFont;
    } else if (points >= SCORE_DISPLAY.mediumScore) {
      fontSize = SCORE_DISPLAY.mediumFont;
    }

    // Determine color (v3.8: Type-safe)
    let color: number = SCORE_DISPLAY.normalColor;
    if (type === 'bonus') {
      color = SCORE_DISPLAY.bonusColor;
    } else if (this.valorMultiplier > 1) {
      color = SCORE_DISPLAY.valorColor;
    } else if (multiplier && multiplier > 1) {
      color = SCORE_DISPLAY.comboColor;
    }

    // Create text
    let text = `+${points}`;
    if (multiplier && multiplier > 1) {
      text += ` x${multiplier.toFixed(1)}`;
    }

    const floater = this.scene.add.text(x, y, text, {
      fontSize,
      color: `#${color.toString(16).padStart(6, '0')}`,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });

    floater.setOrigin(0.5);
    floater.setDepth(10000);
    floater.setData('lifetime', 0);

    this.floatingTexts.push(floater);

    // Tween animation
    this.scene.tweens.add({
      targets: floater,
      y: y - 50,
      alpha: 0,
      duration: SCORE_DISPLAY.floaterDuration,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        floater.destroy();
        const index = this.floatingTexts.indexOf(floater);
        if (index > -1) {
          this.floatingTexts.splice(index, 1);
        }
      }
    });
  }

  /**
   * Update floating texts
   */
  private updateFloatingTexts(_dt: number): void {
    // Limit number of floating texts to prevent lag
    if (this.floatingTexts.length > 20) {
      const oldest = this.floatingTexts.shift();
      if (oldest) {
        oldest.destroy();
      }
    }
  }

  // ========== GETTERS ==========

  public getScore(): number {
    return this.score;
  }

  public getTotalKills(): number {
    return this.totalKills;
  }

  public getCombo(): { kills: number; timer: number; multiplier: number } {
    return {
      kills: this.comboKills,
      timer: this.comboTimer,
      multiplier: calculateComboMultiplier(this.comboKills)
    };
  }

  public getValorMultiplier(): number {
    return this.valorMultiplier;
  }

  // ========== SETTERS ==========

  public setPhase(phase: number): void {
    this.currentPhase = phase;
  }

  // ========== CALLBACKS ==========

  public onScoreChange(callback: (score: number) => void): void {
    this.onScoreChangeCallback = callback;
  }

  public onComboChange(callback: (kills: number, multiplier: number, timer: number) => void): void {
    this.onComboChangeCallback = callback;
  }

  public onStyleBonus(callback: (bonus: StyleBonus, points: number) => void): void {
    this.onStyleBonusCallback = callback;
  }

  // ========== CLEANUP ==========

  public destroy(): void {
    // v3.8: CRITICAL - Kill tweens BEFORE destroying texts to prevent memory leaks!
    this.floatingTexts.forEach(text => {
      this.scene.tweens.killTweensOf(text);
      text.destroy();
    });
    this.floatingTexts = [];
  }
}
