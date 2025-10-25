/**
 * SaveManager v3.8
 *
 * Centralized save system with:
 * - Automatic debouncing (500ms)
 * - Error handling with fallbacks
 * - Corruption detection and repair
 */

type SaveData = Record<string, any>;

export class SaveManager {
  private static instance: SaveManager;
  private saveQueue: Map<string, { data: SaveData; timestamp: number }> = new Map();
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly DEBOUNCE_MS = 500;

  private constructor() {
    console.log('💾 SaveManager initialized');
  }

  public static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  /**
   * Save data with automatic debouncing
   * Multiple rapid calls to same key will be batched
   */
  public save(key: string, data: SaveData): void {
    // Clear existing timer for this key
    const existingTimer = this.debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Queue the save
    this.saveQueue.set(key, {
      data: { ...data }, // Clone to avoid reference issues
      timestamp: Date.now()
    });

    // Set new debounced timer
    const timer = setTimeout(() => {
      this.flushSave(key);
    }, this.DEBOUNCE_MS);

    this.debounceTimers.set(key, timer);
  }

  /**
   * Immediately flush a specific save (bypass debounce)
   */
  public flush(key: string): void {
    const timer = this.debounceTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.debounceTimers.delete(key);
    }
    this.flushSave(key);
  }

  /**
   * Flush all pending saves
   */
  public flushAll(): void {
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();

    this.saveQueue.forEach((_, key) => {
      this.flushSave(key);
    });
  }

  /**
   * Actually perform the save to localStorage
   */
  private flushSave(key: string): void {
    const queuedSave = this.saveQueue.get(key);
    if (!queuedSave) return;

    try {
      const json = JSON.stringify(queuedSave.data);
      localStorage.setItem(key, json);

      // Verify save was successful
      const verification = localStorage.getItem(key);
      if (verification !== json) {
        throw new Error('Save verification failed');
      }

      console.log(`💾 Saved: ${key} (${json.length} bytes)`);
      this.saveQueue.delete(key);
    } catch (error) {
      console.error(`❌ Save failed for ${key}:`, error);

      // Try to free up space by removing oldest saves
      this.emergencyCleanup();

      // Retry once
      try {
        localStorage.setItem(key, JSON.stringify(queuedSave.data));
        console.log(`💾 Retry successful: ${key}`);
        this.saveQueue.delete(key);
      } catch (retryError) {
        console.error(`❌ Retry failed for ${key}:`, retryError);
      }
    }
  }

  /**
   * Load data with fallback on corruption
   */
  public load<T = SaveData>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        console.log(`📂 No save found for ${key}, using fallback`);
        return fallback;
      }

      const parsed = JSON.parse(stored);

      // Validate parsed data
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Invalid save data structure');
      }

      console.log(`📂 Loaded: ${key}`);
      return parsed as T;
    } catch (error) {
      console.error(`❌ Load failed for ${key}, using fallback:`, error);

      // Repair corrupted save with fallback
      this.repair(key, fallback);

      return fallback;
    }
  }

  /**
   * Check if a key exists
   */
  public has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Delete a save
   */
  public delete(key: string): void {
    localStorage.removeItem(key);
    this.saveQueue.delete(key);

    const timer = this.debounceTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.debounceTimers.delete(key);
    }

    console.log(`🗑️ Deleted: ${key}`);
  }

  /**
   * Repair corrupted save by writing fallback
   */
  private repair(key: string, fallback: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(fallback));
      console.log(`🔧 Repaired corrupted save: ${key}`);
    } catch (error) {
      console.error(`❌ Repair failed for ${key}:`, error);
    }
  }

  /**
   * Emergency cleanup when storage is full
   * Removes temporary/cache keys first
   */
  private emergencyCleanup(): void {
    console.warn('⚠️ Emergency cleanup triggered');

    const tempKeys = [
      'eagleOfFun_temp',
      'eagleOfFun_cache',
      'eagleOfFun_analytics'
    ];

    tempKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Emergency removed: ${key}`);
      }
    });
  }

  /**
   * Get storage usage statistics
   */
  public getStats(): { used: number; total: number; keys: number } {
    let used = 0;
    let keys = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('eagleOfFun_')) {
        const value = localStorage.getItem(key);
        if (value) {
          used += value.length;
          keys++;
        }
      }
    }

    // Most browsers: 5-10 MB
    const total = 5 * 1024 * 1024; // 5 MB estimate

    return { used, total, keys };
  }

  /**
   * Clear all Eagle of Fun saves (for reset)
   */
  public clearAll(): void {
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('eagleOfFun_')) {
        keys.push(key);
      }
    }

    keys.forEach(key => {
      localStorage.removeItem(key);
    });

    this.saveQueue.clear();
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();

    console.log(`🗑️ Cleared ${keys.length} saves`);
  }
}

// Singleton instance
export const saveManager = SaveManager.getInstance();
