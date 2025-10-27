/**
 * PhaseController v3.8 (Simplified)
 *
 * Manages game phases, market phases, and boss triggers
 */

import Phaser from 'phaser';
import { PHASE_DIFFICULTIES } from '../config/Difficulty';
import { BOSS_CZ_9000, type BossDef } from '../config/Bosses';

export interface PhaseInfo {
  number: number;
  name: string;
  isMarketPhase: boolean;
  bossActive: boolean;
}

export class PhaseController {
  private scene: Phaser.Scene;
  private currentPhase: number = 1;
  private marketPhaseActive: boolean = false;
  private bossActive: boolean = false;

  // Boss tracking
  private bossTriggered: boolean = false;
  private activeBoss?: BossDef;

  // Callbacks
  private onPhaseChangeCallback?: (phase: PhaseInfo) => void;
  private onMarketPhaseStartCallback?: () => void;
  private onMarketPhaseEndCallback?: () => void;
  private onBossTriggerCallback?: (boss: BossDef) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public init(startPhase: number = 1): void {
    this.currentPhase = startPhase;
    this.marketPhaseActive = false;
    this.bossActive = false;
    this.bossTriggered = false;

    console.log('PhaseController initialized');
  }

  /**
   * Update phase logic
   */
  public update(_dt: number, currentScore: number, currentTime: number): void {
    // Check for boss trigger
    if (!this.bossTriggered) {
      this.checkBossTrigger(currentScore, currentTime);
    }

    // Check for phase transitions (based on score thresholds)
    this.checkPhaseTransition(currentScore);
  }

  /**
   * Check if boss should be triggered
   */
  private checkBossTrigger(score: number, time: number): void {
    const boss = BOSS_CZ_9000;

    if (boss.trigger.type === 'score' && score >= boss.trigger.value) {
      this.triggerBoss(boss);
    } else if (boss.trigger.type === 'time' && time >= (boss.trigger.value || 0)) {
      this.triggerBoss(boss);
    }
  }

  /**
   * Trigger a boss encounter
   */
  private triggerBoss(boss: BossDef): void {
    this.bossTriggered = true;
    this.bossActive = true;
    this.activeBoss = boss;

    console.log(`Boss triggered: ${boss.name}`);

    if (this.onBossTriggerCallback) {
      this.onBossTriggerCallback(boss);
    }
  }

  /**
   * Boss defeated
   */
  public onBossDefeated(): void {
    this.bossActive = false;
    this.activeBoss = undefined;

    console.log('Boss defeated!');
  }

  /**
   * Check for phase transitions
   */
  private checkPhaseTransition(score: number): void {
    // Phase thresholds (example)
    const thresholds = [
      { phase: 1, score: 0 },
      { phase: 2, score: 1000 },
      { phase: 3, score: 3000 },
      { phase: 4, score: 6000 }
    ];

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (score >= thresholds[i].score && this.currentPhase !== thresholds[i].phase) {
        this.setPhase(thresholds[i].phase);
        break;
      }
    }
  }

  /**
   * Set current phase
   */
  public setPhase(phase: number): void {
    if (phase === this.currentPhase) return;

    this.currentPhase = phase;

    console.log(`Phase changed to: ${phase}`);

    if (this.onPhaseChangeCallback) {
      this.onPhaseChangeCallback(this.getPhaseInfo());
    }
  }

  /**
   * Start market phase
   */
  public startMarketPhase(): void {
    if (this.marketPhaseActive) return;

    this.marketPhaseActive = true;

    console.log('Market phase started');

    if (this.onMarketPhaseStartCallback) {
      this.onMarketPhaseStartCallback();
    }
  }

  /**
   * End market phase
   */
  public endMarketPhase(): void {
    if (!this.marketPhaseActive) return;

    this.marketPhaseActive = false;

    console.log('Market phase ended');

    if (this.onMarketPhaseEndCallback) {
      this.onMarketPhaseEndCallback();
    }
  }

  /**
   * Get current phase info
   */
  public getPhaseInfo(): PhaseInfo {
    return {
      number: this.currentPhase,
      name: this.getPhaseName(),
      isMarketPhase: this.marketPhaseActive,
      bossActive: this.bossActive
    };
  }

  /**
   * Get phase name
   */
  private getPhaseName(): string {
    const phaseDef = PHASE_DIFFICULTIES.find(p => p.phase === this.currentPhase);
    return phaseDef?.name || `Phase ${this.currentPhase}`;
  }

  /**
   * Get current phase number
   */
  public getCurrentPhase(): number {
    return this.currentPhase;
  }

  /**
   * Check if market phase is active
   */
  public isMarketPhase(): boolean {
    return this.marketPhaseActive;
  }

  /**
   * Check if boss is active
   */
  public isBossActive(): boolean {
    return this.bossActive;
  }

  /**
   * Get active boss
   */
  public getActiveBoss(): BossDef | undefined {
    return this.activeBoss;
  }

  /**
   * Callbacks
   */
  public onPhaseChange(callback: (phase: PhaseInfo) => void): void {
    this.onPhaseChangeCallback = callback;
  }

  public onMarketPhaseStart(callback: () => void): void {
    this.onMarketPhaseStartCallback = callback;
  }

  public onMarketPhaseEnd(callback: () => void): void {
    this.onMarketPhaseEndCallback = callback;
  }

  public onBossTrigger(callback: (boss: BossDef) => void): void {
    this.onBossTriggerCallback = callback;
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    // Nothing to clean up
  }
}
