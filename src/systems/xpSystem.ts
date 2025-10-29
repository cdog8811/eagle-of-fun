// ============================
// Eagle of Fun - XP System
// Meta progression: XP, Levels, Progress curve
// ============================

import { GameConfig } from '../config/GameConfig';
import { Storage, LS_KEYS } from './storage';

export interface XPState {
  level: number;          // current player level (starts at 1)
  xp: number;             // current XP in this level
  xpToNext: number;       // XP needed to reach next level
  totalXP: number;        // cumulative XP (for statistics/costs)
}

export type XPSource =
  | 'coin'
  | 'enemyKill'
  | 'mission'
  | 'timeAlive'
  | 'bossKill'
  | 'eventBonus';

export interface XPEvent {
  delta: number;
  source: XPSource;
  meta?: Record<string, any>;
}

type LevelUpCallback = (newLevel: number) => void;
type XPChangeCallback = (state: XPState) => void;

export interface XPPublicAPI {
  getState(): XPState;
  addXP(evt: XPEvent): void;
  spendXP(amount: number): boolean;
  resetForNewProfile(): void;
  onLevelUp(cb: LevelUpCallback): void;
  onXPChange(cb: XPChangeCallback): void;
  flush(): void; // v3.9.2: Force immediate save (for game over, etc.)
}

// XP curve calculation - smooth scaling
function calcXPToNext(level: number): number {
  return 300 + Math.floor(Math.pow(level, 1.35) * 120);
}

// Default state for new players
function getDefaultState(): XPState {
  return {
    level: 1,
    xp: 0,
    xpToNext: calcXPToNext(1),
    totalXP: 0
  };
}

// XP System Implementation
class XPSystemImpl implements XPPublicAPI {
  private state: XPState;
  private levelUpCallbacks: LevelUpCallback[] = [];
  private xpChangeCallbacks: XPChangeCallback[] = [];

  // v3.9.2 CRITICAL PERFORMANCE FIX: Debounce localStorage writes
  // PROBLEM: Every coin collection calls addXP() → saveState() → localStorage.setItem()
  // localStorage writes are SYNCHRONOUS and BLOCK the main thread!
  // With 50 coins = 50 localStorage writes per frame = 250ms = 4 FPS!
  // SOLUTION: Only save once per second, or immediately on level up
  private saveTimer: NodeJS.Timeout | null = null;
  private pendingSave: boolean = false;

  constructor() {
    // Load from storage or create new
    const saved = Storage.load<XPState>(LS_KEYS.XP, getDefaultState());

    console.log('Loaded XP state from localStorage:', saved);

    // Check if this is truly first time (check localStorage directly to be sure)
    const hasPlayedBefore = localStorage.getItem('eof_has_played_before');

    // First-time bonus: 600 XP for testing (ONLY on first ever load)
    if (!hasPlayedBefore && saved.totalXP === 0 && saved.level === 1 && saved.xp === 0) {
      console.log('FIRST TIME PLAYER - Bonus: +600 XP for testing');
      saved.totalXP = 600;
      saved.xp = 600;
      localStorage.setItem('eof_has_played_before', 'true');
      // Check if we level up from bonus
      this.state = saved;
      this.processLevelUps();
      this.saveState(); // Save immediately
    } else {
      this.state = saved;
      console.log('Welcome back! Current XP:', this.state.totalXP);
    }

    console.log('XP System initialized:', this.state);
  }

  getState(): XPState {
    return { ...this.state };
  }

  addXP(evt: XPEvent): void {
    // FEATURE FLAG: Skip all XP processing if XP system is disabled
    if (!GameConfig.ENABLE_XP_SYSTEM) {
      return;
    }

    if (evt.delta <= 0) return;

    const before = this.state.level;

    this.state.xp += evt.delta;
    this.state.totalXP += evt.delta;

    // Debug logging
    if (evt.meta?.debug) {
      console.log(`[XP DEBUG] +${evt.delta} from ${evt.source}`, evt.meta);
    }

    // Check for level ups
    this.processLevelUps();

    // v3.9.2 CRITICAL PERFORMANCE FIX: Debounced save
    // Don't save immediately - schedule a delayed save
    // This prevents 50 localStorage writes per frame (250ms overhead!)
    this.scheduleSave();

    // Notify callbacks
    this.notifyXPChange();

    // Check if we leveled up
    if (this.state.level > before) {
      this.notifyLevelUp(this.state.level);
      // v3.9.2: On level up, save IMMEDIATELY (important milestone)
      this.saveStateImmediate();
    }
  }

  private processLevelUps(): void {
    let leveledUp = false;

    while (this.state.xp >= this.state.xpToNext) {
      this.state.xp -= this.state.xpToNext;
      this.state.level++;
      this.state.xpToNext = calcXPToNext(this.state.level);
      leveledUp = true;
    }

    if (leveledUp) {
      console.log(`LEVEL UP! Now Level ${this.state.level}`);
    }
  }

  spendXP(amount: number): boolean {
    if (this.state.totalXP < amount) {
      console.warn(`Cannot spend ${amount} XP - only have ${this.state.totalXP}`);
      return false;
    }

    // Deduct from totalXP
    this.state.totalXP -= amount;

    // Also deduct from current level XP if possible
    if (this.state.xp >= amount) {
      this.state.xp -= amount;
    } else {
      // Not enough in current level, just zero it out
      this.state.xp = 0;
    }

    // Save and notify
    this.saveState();
    this.notifyXPChange();

    console.log(`Spent ${amount} XP. Remaining: ${this.state.totalXP} XP`);
    return true;
  }

  resetForNewProfile(): void {
    this.state = getDefaultState();
    this.saveState();
    this.notifyXPChange();
    console.log('XP System reset to defaults');
  }

  // v3.9.2: Force immediate save (important for game over, scene transitions)
  flush(): void {
    // FEATURE FLAG: Skip flush if XP system is disabled
    if (!GameConfig.ENABLE_XP_SYSTEM) {
      return;
    }

    if (this.pendingSave) {
      this.saveStateImmediate();
      console.log('[XP] Flushed pending save to localStorage');
    }
  }

  onLevelUp(cb: LevelUpCallback): void {
    this.levelUpCallbacks.push(cb);
  }

  onXPChange(cb: XPChangeCallback): void {
    this.xpChangeCallbacks.push(cb);
  }

  private notifyLevelUp(newLevel: number): void {
    this.levelUpCallbacks.forEach(cb => cb(newLevel));
  }

  private notifyXPChange(): void {
    const state = this.getState();
    this.xpChangeCallbacks.forEach(cb => cb(state));
  }

  // v3.9.2 CRITICAL PERFORMANCE FIX: Debounced save scheduling
  private scheduleSave(): void {
    this.pendingSave = true;

    // Clear existing timer if any
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }

    // Schedule save after 1 second of inactivity
    this.saveTimer = setTimeout(() => {
      if (this.pendingSave) {
        this.saveStateImmediate();
      }
    }, 1000);
  }

  // v3.9.2: Immediate save (for important events like level up, game over, etc.)
  private saveStateImmediate(): void {
    Storage.save(LS_KEYS.XP, this.state);
    this.pendingSave = false;

    // Clear timer
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
  }

  // Legacy method - now uses immediate save (called by spendXP which is rare)
  private saveState(): void {
    this.saveStateImmediate();
  }
}

// Singleton instance
let xpSystemInstance: XPSystemImpl | null = null;

export function getXPSystem(): XPPublicAPI {
  if (!xpSystemInstance) {
    xpSystemInstance = new XPSystemImpl();
  }
  return xpSystemInstance;
}

// Helper: Calculate XP for coin type
export function getXPForCoin(coinType: string): number {
  switch (coinType) {
    case 'bonk':
    case 'us1':
      return 1;
    case 'aol':
    case 'valor':
      return 2;
    case 'burger':
      return 3;
    default:
      return 1;
  }
}
