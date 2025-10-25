// ============================
// Eagle of Fun - Storage Utility
// Centralized localStorage management
// ============================

export const Storage = {
  save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  },

  load<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch (error) {
      console.warn(`Failed to load ${key}, using fallback:`, error);
      return fallback;
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
};

// Centralized keys
export const LS_KEYS = {
  XP: 'eof_xp_state',
  UPGRADES: 'eof_upgrades',
  SETTINGS: 'eof_settings',
  HIGH_SCORE: 'eof_high_score'
};
