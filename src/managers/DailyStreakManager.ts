// ============================
// Eagle of Fun v3.0 - Daily Streak Manager
// ============================

export interface DailyStreak {
  day: number;
  lastLoginDate: string;
  currentStreak: number;
  totalDays: number;
  rewards: {
    day1: boolean;
    day3: boolean;
    day7: boolean;
  };
}

export class DailyStreakManager {
  private static instance: DailyStreakManager;
  private streak: DailyStreak;

  private constructor() {
    this.streak = this.loadStreak();
    this.checkDailyLogin();
  }

  public static getInstance(): DailyStreakManager {
    if (!DailyStreakManager.instance) {
      DailyStreakManager.instance = new DailyStreakManager();
    }
    return DailyStreakManager.instance;
  }

  private loadStreak(): DailyStreak {
    const saved = localStorage.getItem('eagleOfFun_dailyStreak');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load daily streak:', e);
      }
    }

    return {
      day: 0,
      lastLoginDate: '',
      currentStreak: 0,
      totalDays: 0,
      rewards: {
        day1: false,
        day3: false,
        day7: false
      }
    };
  }

  private saveStreak(): void {
    localStorage.setItem('eagleOfFun_dailyStreak', JSON.stringify(this.streak));
  }

  private getTodayString(): string {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  private checkDailyLogin(): void {
    const today = this.getTodayString();

    if (this.streak.lastLoginDate === today) {
      // Already logged in today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

    if (this.streak.lastLoginDate === yesterdayString) {
      // Consecutive day
      this.streak.currentStreak++;
    } else if (this.streak.lastLoginDate !== '') {
      // Streak broken
      this.streak.currentStreak = 1;
      this.streak.rewards = {
        day1: false,
        day3: false,
        day7: false
      };
    } else {
      // First login
      this.streak.currentStreak = 1;
    }

    this.streak.lastLoginDate = today;
    this.streak.totalDays++;
    this.saveStreak();

    // Check for rewards
    this.checkRewards();
  }

  private checkRewards(): void {
    if (this.streak.currentStreak >= 1 && !this.streak.rewards.day1) {
      this.grantDayReward(1);
    }

    if (this.streak.currentStreak >= 3 && !this.streak.rewards.day3) {
      this.grantDayReward(3);
    }

    if (this.streak.currentStreak >= 7 && !this.streak.rewards.day7) {
      this.grantDayReward(7);
    }
  }

  private grantDayReward(day: number): void {
    switch (day) {
      case 1:
        // +100 XP
        const currentXP = parseInt(localStorage.getItem('eagleOfFun_totalXP') || '0');
        localStorage.setItem('eagleOfFun_totalXP', (currentXP + 100).toString());
        this.streak.rewards.day1 = true;
        break;

      case 3:
        // +1 Skin Fragment
        const fragments = parseInt(localStorage.getItem('eagleOfFun_skinFragments') || '0');
        localStorage.setItem('eagleOfFun_skinFragments', (fragments + 1).toString());
        this.streak.rewards.day3 = true;
        break;

      case 7:
        // Golden Feather guaranteed drop
        localStorage.setItem('eagleOfFun_goldenFeather', 'true');
        this.streak.rewards.day7 = true;
        break;
    }

    this.saveStreak();
  }

  public getCurrentStreak(): number {
    return this.streak.currentStreak;
  }

  public getTotalDays(): number {
    return this.streak.totalDays;
  }

  public getRewards(): { day1: boolean; day3: boolean; day7: boolean } {
    return this.streak.rewards;
  }

  public getTodayReward(): string | null {
    const streak = this.streak.currentStreak;

    if (streak === 1 && !this.streak.rewards.day1) return 'Day 1: +100 XP';
    if (streak === 3 && !this.streak.rewards.day3) return 'Day 3: +1 Skin Fragment';
    if (streak === 7 && !this.streak.rewards.day7) return 'Day 7: Golden Feather Drop Guaranteed';

    return null;
  }

  public reset(): void {
    this.streak = {
      day: 0,
      lastLoginDate: '',
      currentStreak: 0,
      totalDays: 0,
      rewards: {
        day1: false,
        day3: false,
        day7: false
      }
    };
    this.saveStreak();
  }
}
