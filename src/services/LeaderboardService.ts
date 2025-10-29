/**
 * LeaderboardService - Handles API communication with Vercel Postgres backend
 * v4.2: Online leaderboard integration
 */

export interface LeaderboardEntry {
  player_name: string;
  score: number;
  level: number;
  timestamp: string;
}

export interface SubmitScoreResponse {
  success: boolean;
  entry?: LeaderboardEntry;
  error?: string;
}

export interface FetchLeaderboardResponse {
  success: boolean;
  leaderboard?: LeaderboardEntry[];
  count?: number;
  error?: string;
}

export class LeaderboardService {
  private static API_BASE_URL = '/api';

  /**
   * Submit a score to the online leaderboard
   */
  static async submitScore(
    playerName: string,
    score: number,
    level: number = 1
  ): Promise<SubmitScoreResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName,
          score,
          level,
          verificationHash: this.generateVerificationHash(score, level),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to submit score:', data.error);
        return {
          success: false,
          error: data.error || 'Failed to submit score',
        };
      }

      return data;
    } catch (error) {
      console.error('Error submitting score:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Fetch top scores from the leaderboard
   */
  static async fetchLeaderboard(limit: number = 100): Promise<FetchLeaderboardResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/leaderboard?limit=${limit}`);
      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to fetch leaderboard:', data.error);
        return {
          success: false,
          error: data.error || 'Failed to fetch leaderboard',
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  /**
   * Generate a simple verification hash (basic anti-cheat)
   */
  private static generateVerificationHash(score: number, level: number): string {
    // Simple hash using score + level + timestamp + secret
    const secret = 'eagle-of-fun-2024'; // In production, use env variable
    const timestamp = Date.now();
    const data = `${score}-${level}-${timestamp}-${secret}`;

    // Simple hash function (for demonstration)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash).toString(16);
  }

  /**
   * Check if the API is available
   */
  static async checkAPIHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/leaderboard?limit=1`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
