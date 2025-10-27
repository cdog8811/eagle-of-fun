import { Mission, MissionTier, MissionTiers, MissionPool } from '../config/MissionsConfig';
import { getXPSystem } from '../systems/xpSystem';

export interface PlayerProgress {
  currentTier: number;
  completedMissions: string[];
  unlockedRewards: string[];
}

export class MissionManager {
  private static instance: MissionManager;
  private xpSystem = getXPSystem();
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

  /**
   * Refresh missions based on current Meta-Level
   * Call this when returning from UpgradeScene or when Meta-Level changes
   */
  public refreshMissions(): void {
    console.log('Refreshing missions based on current Meta-Level');
    this.initializeMissions();
  }

  private loadProgress(): PlayerProgress {
    const saved = localStorage.getItem('eagleOfFun_missionProgress');
    if (saved) {
      return JSON.parse(saved);
    }

    // Default starting progress
    return {
      currentTier: 1,
      completedMissions: [],
      unlockedRewards: ['skin_default', 'background_default']
    };
  }

  private saveProgress(): void {
    localStorage.setItem('eagleOfFun_missionProgress', JSON.stringify(this.playerProgress));
  }

  private initializeMissions(): void {
    // v3.7: Use Meta-Level to determine tier
    const metaLevel = this.xpSystem.getState().level;

    // Find appropriate tier based on Meta-Level
    let tier = 1;
    if (metaLevel >= 10) tier = 4;
    else if (metaLevel >= 7) tier = 3;
    else if (metaLevel >= 4) tier = 2;

    this.playerProgress.currentTier = tier;

    const tierData = MissionTiers.find(t => t.tier === tier);
    if (tierData) {
      this.currentMissions = tierData.missions.map(m => ({
        ...m,
        progress: 0,
        completed: this.playerProgress.completedMissions.includes(m.id)
      }));
    }

    console.log(`Missions initialized - Meta Level: ${metaLevel}, Tier: ${tier}`);

    // Generate daily missions
    this.generateDailyMissions();
  }

  private generateDailyMissions(): void {
    const today = new Date().toDateString();
    const savedDaily = localStorage.getItem('eagleOfFun_dailyMissions');
    const savedDate = localStorage.getItem('eagleOfFun_dailyDate');

    console.log('generateDailyMissions - Today:', today, 'SavedDate:', savedDate);

    // Check if we need new daily missions
    if (savedDaily && savedDate === today) {
      this.dailyMissions = JSON.parse(savedDaily);
      console.log('Loaded daily missions from localStorage:', this.dailyMissions.length, 'missions');
    } else {
      // Generate 3 random daily missions
      const shuffled = [...MissionPool].sort(() => Math.random() - 0.5);
      this.dailyMissions = shuffled.slice(0, 3).map(m => ({
        ...m,
        progress: 0,
        completed: false
      }));

      console.log('Generated new daily missions:', this.dailyMissions.length, 'missions');
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

    // v3.7: Award Meta-XP through new XP system
    this.xpSystem.addXP({
      delta: mission.reward.xp,
      source: 'mission',
      meta: { missionId: mission.id, missionName: mission.title }
    });

    console.log(`Mission completed: ${mission.title} - Rewarded ${mission.reward.xp} Meta-XP`);

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
        // v3.7: Award tier completion rewards as Meta-XP
        this.xpSystem.addXP({
          delta: tierData.tierReward.xp,
          source: 'mission',
          meta: { tierCompleted: this.playerProgress.currentTier }
        });

        console.log(`Tier ${this.playerProgress.currentTier} completed! Rewarded ${tierData.tierReward.xp} Meta-XP`);

        tierData.tierReward.unlocks.forEach(unlock => {
          if (!this.playerProgress.unlockedRewards.includes(unlock)) {
            this.playerProgress.unlockedRewards.push(unlock);
          }
        });

        // v3.7: Check if next tier should unlock based on Meta-Level
        const metaLevel = this.xpSystem.getState().level;
        let newTier = 1;
        if (metaLevel >= 10) newTier = 4;
        else if (metaLevel >= 7) newTier = 3;
        else if (metaLevel >= 4) newTier = 2;

        if (newTier > this.playerProgress.currentTier) {
          this.playerProgress.currentTier = newTier;
          this.initializeMissions();
        }
      }
    }
  }

  public getCurrentMissions(): Mission[] {
    return this.currentMissions;
  }

  public getDailyMissions(): Mission[] {
    // v3.9.2: Removed console.log - called hundreds of times per second!
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
    // v3.7: Reset mission progress only (XP is handled by xpSystem)
    this.playerProgress = {
      currentTier: 1,
      completedMissions: [],
      unlockedRewards: ['skin_default', 'background_default']
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
