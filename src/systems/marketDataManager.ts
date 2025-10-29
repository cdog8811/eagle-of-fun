/**
 * MarketDataManager - Dexscreener API Integration
 *
 * Fetches real-time $AOL token data from Dexscreener API
 * Token Address: 2oQNkePakuPbHzrVVkQ875WHeewLHCd2cAwfwiLQbonk
 */

export interface AOLMarketData {
  price: string;      // USD price (formatted to 6 decimals)
  change: number;     // 24h percent change
  mc: string;         // Market cap in millions
}

export class MarketDataManager {
  private static readonly API_URL = 'https://api.dexscreener.io/latest/dex/tokens/2oQNkePakuPbHzrVVkQ875WHeewLHCd2cAwfwiLQbonk';

  /**
   * Fetch current $AOL market data from Dexscreener
   * Returns null if API request fails
   */
  static async getAOLData(): Promise<AOLMarketData | null> {
    try {
      console.log('📊 Fetching $AOL data from Dexscreener...');

      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('⚠️ Dexscreener API returned non-OK status:', response.status);
        return null;
      }

      const data = await response.json();

      // Get first pair (should be the main liquidity pool)
      if (!data.pairs || data.pairs.length === 0) {
        console.warn('⚠️ No trading pairs found for $AOL token');
        return null;
      }

      const pair = data.pairs[0];

      // Parse and format data
      const price = parseFloat(pair.priceUsd).toFixed(6);
      const change = parseFloat(pair.priceChange?.h24 || 0);
      const mc = pair.fdv ? (pair.fdv / 1_000_000).toFixed(1) : '0.0';

      console.log('✅ $AOL Data:', { price, change, mc });

      return {
        price,
        change,
        mc
      };
    } catch (error) {
      console.error('❌ Failed to fetch $AOL data:', error);
      return null;
    }
  }

  /**
   * Get color based on price change percentage
   * Green for positive, Red for negative, Yellow for neutral
   */
  static getColorForChange(change: number): string {
    if (change > 1) return '#00FF00';     // Green for > +1%
    if (change < -1) return '#FF0000';    // Red for < -1%
    return '#FFCC00';                     // Yellow/Orange for neutral
  }

  /**
   * Format price display text
   */
  static formatPriceDisplay(data: AOLMarketData): string {
    const changeSign = data.change > 0 ? '+' : '';
    return `$AOL  $${data.price}   ${changeSign}${data.change.toFixed(2)}%   MC $${data.mc}M`;
  }
}
