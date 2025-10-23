import { Mission, MissionTier, MissionTiers, MissionPool } from '../config/MissionsConfig';

export interface PlayerProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentTier: number;
  completedMissions: string[];
  unlockedRewards: string[];
  totalXP: number;
}

export class MissionManager {
  private static instance: MissionManager;
  private playerProgress: PlayerProgress;
  private currentMissions: Mission[] = [];
  private dailyMissions: Mission[] = [];

  private constructor() {
    this.playerProgress = this.loadProgress();
    this.initializeMissions();
  }

  public static getInstance(): MissionManager {
    if (!MissionManager.instance) {
      MissionManager.instance = new MissionManager();
    }
    return MissionManager.instance;
  }

  private loadProgress(): PlayerProgress {
    const saved = localStorage.getItem('eagleOfFun_progress');
    if (saved) {
      return JSON.parse(saved);
    }

    // Default starting progress
    return {
      level: 1,
      xp: 0,
      xpToNextLevel: 500,
      currentTier: 1,
      completedMissions: [],
      unlockedRewards: ['skin_default', 'background_default'],
      totalXP: 0
    };
  }

  private saveProgress(): void {
    localStorage.setItem('eagleOfFun_progress', JSON.stringify(this.playerProgress));
  }

  private initializeMissions(): void {
    // Load tier missions based on current tier
    const tierData = MissionTiers.find(t => t.tier === this.playerProgress.currentTier);
    if (tierData) {
      this.currentMissions = tierData.missions.map(m => ({
        ...m,
        progress: 0,
        completed: this.playerProgress.completedMissions.includes(m.id)
      }));
    }

    // Generate daily missions
    this.generateDailyMissions();
  }

  private generateDailyMissions(): void {
    const today = new Date().toDateString();
    const savedDaily = localStorage.getItem('eagleOfFun_dailyMissions');
    const savedDate = localStorage.getItem('eagleOfFun_dailyDate');

    // Check if we need new daily missions
    if (savedDaily && savedDate === today) {
      this.dailyMissions = JSON.parse(savedDaily);
    } else {
      // Generate 3 random daily missions
      const shuffled = [...MissionPool].sort(() => Math.random() - 0.5);
      this.dailyMissions = shuffled.slice(0, 3).map(m => ({
        ...m,
        progress: 0,
        completed: false
      }));

      localStorage.setItem('eagleOfFun_dailyMissions', JSON.stringify(this.dailyMissions));
      localStorage.setItem('eagleOfFun_dailyDate', today);
    }
  }

  public updateMissionProgress(type: Mission['type'], amount: number = 1, specificId?: string): void {
    let anyCompleted = false;

    // Update tier missions
    this.currentMissions.forEach(mission => {
      if (!mission.completed && mission.type === type) {
        if (specificId && mission.id !== specificId) return;

        mission.progress = Math.min(mission.progress + amount, mission.target);

        if (mission.progress >= mission.target && !mission.completed) {
          this.completeMission(mission);
          anyCompleted = true;
        }
      }
    });

    // Update daily missions
    this.dailyMissions.forEach(mission => {
      if (!mission.completed && mission.type === type) {
        mission.progress = Math.min(mission.progress + amount, mission.target);

        if (mission.progress >= mission.target && !mission.completed) {
          this.completeMission(mission);
          anyCompleted = true;
        }
      }
    });

    if (anyCompleted) {
      this.saveProgress();
      localStorage.setItem('eagleOfFun_dailyMissions', JSON.stringify(this.dailyMissions));
    }
  }

  private completeMission(mission: Mission): void {
    mission.completed = true;
    this.playerProgress.completedMissions.push(mission.id);

    // Award XP
    this.addXP(mission.reward.xp);

    // Unlock rewards
    if (mission.reward.unlocks) {
      mission.reward.unlocks.forEach(unlock => {
        if (!this.playerProgress.unlockedRewards.includes(unlock)) {
          this.playerProgress.unlockedRewards.push(unlock);
        }
      });
    }

    // Check if tier is complete
    this.checkTierCompletion();
  }

  private checkTierCompletion(): void {
    const allTierMissionsComplete = this.currentMissions.every(m => m.completed);

    if (allTierMissionsComplete) {
      const tierData = MissionTiers.find(t => t.tier === this.playerProgress.currentTier);
      if (tierData) {
        // Award tier completion rewards
        this.addXP(tierData.tierReward.xp);
        tierData.tierReward.unlocks.forEach(unlock => {
          if (!this.playerProgress.unlockedRewards.includes(unlock)) {
            this.playerProgress.unlockedRewards.push(unlock);
          }
        });

        // Advance to next tier if available
        const nextTier = MissionTiers.find(t => t.tier === this.playerProgress.currentTier + 1);
        if (nextTier && this.playerProgress.level >= nextTier.requiredLevel) {
          this.playerProgress.currentTier++;
          this.initializeMissions();
        }
      }
    }
  }

  private addXP(xp: number): void {
    this.playerProgress.xp += xp;
    this.playerProgress.totalXP += xp;

    // Check for level up
    while (this.playerProgress.xp >= this.playerProgress.xpToNextLevel) {
      this.levelUp();
    }

    this.saveProgress();
  }

  private levelUp(): void {
    this.playerProgress.xp -= this.playerProgress.xpToNextLevel;
    this.playerProgress.level++;

    // Calculate next level XP requirement (increases by 20% each level)
    this.playerProgress.xpToNextLevel = Math.floor(500 * Math.pow(1.2, this.playerProgress.level - 1));

    // Check if new tier unlocked
    const nextTier = MissionTiers.find(t =>
      t.tier === this.playerProgress.currentTier + 1 &&
      this.playerProgress.level >= t.requiredLevel
    );

    if (nextTier) {
      // Check if current tier is complete before advancing
      const allTierMissionsComplete = this.currentMissions.every(m => m.completed);
      if (allTierMissionsComplete) {
        this.playerProgress.currentTier++;
        this.initializeMissions();
      }
    }
  }

  public getCurrentMissions(): Mission[] {
    return this.currentMissions;
  }

  public getDailyMissions(): Mission[] {
    return this.dailyMissions;
  }

  public getProgress(): PlayerProgress {
    return { ...this.playerProgress };
  }

  public getCurrentTierData(): MissionTier | undefined {
    return MissionTiers.find(t => t.tier === this.playerProgress.currentTier);
  }

  public getNextTierData(): MissionTier | undefined {
    return MissionTiers.find(t => t.tier === this.playerProgress.currentTier + 1);
  }

  public isRewardUnlocked(rewardId: string): boolean {
    return this.playerProgress.unlockedRewards.includes(rewardId);
  }

  public resetProgress(): void {
    this.playerProgress = {
      level: 1,
      xp: 0,
      xpToNextLevel: 500,
      currentTier: 1,
      completedMissions: [],
      unlockedRewards: ['skin_default', 'background_default'],
      totalXP: 0
    };
    this.saveProgress();
    this.initializeMissions();
  }

  // Helper methods for specific mission types
  public onCoinCollected(coinType: string): void {
    this.updateMissionProgress('collect', 1);
  }

  public onEnemyKilled(enemyType: string): void {
    this.updateMissionProgress('kill', 1);
  }

  public onScoreUpdate(score: number): void {
    // Update score missions with current score
    this.currentMissions.forEach(mission => {
      if (mission.type === 'score' && !mission.completed) {
        mission.progress = score;
        if (mission.progress >= mission.target) {
          this.completeMission(mission);
        }
      }
    });

    this.dailyMissions.forEach(mission => {
      if (mission.type === 'score' && !mission.completed) {
        mission.progress = score;
        if (mission.progress >= mission.target) {
          this.completeMission(mission);
        }
      }
    });
  }

  public onTimeUpdate(seconds: number): void {
    // Update time-based missions
    this.currentMissions.forEach(mission => {
      if ((mission.type === 'time' || mission.type === 'perfect') && !mission.completed) {
        mission.progress = seconds;
        if (mission.progress >= mission.target) {
          this.completeMission(mission);
        }
      }
    });
  }

  public onComboAchieved(combo: number): void {
    this.currentMissions.forEach(mission => {
      if (mission.type === 'combo' && !mission.completed && combo >= mission.target) {
        mission.progress = combo;
        this.completeMission(mission);
      }
    });

    this.dailyMissions.forEach(mission => {
      if (mission.type === 'combo' && !mission.completed && combo >= mission.target) {
        mission.progress = combo;
        this.completeMission(mission);
      }
    });
  }

  public onPhaseChange(): void {
    this.updateMissionProgress('phase', 1);
  }
}
