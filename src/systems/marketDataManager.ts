/**
 * MarketDataManager - Dexscreener API Integration
 *
 * Fetches real-time token data for $AOL, $VALOR, and $BURGER
 */

export interface TokenMarketData {
  symbol: string;     // Token symbol (AOL, VALOR, BURGER)
  icon: string;       // Emoji icon
  price: string;      // USD price (formatted to 6 decimals)
  change: number;     // 24h percent change
  mc: string;         // Market cap in millions
}

export class MarketDataManager {
  static readonly tokens = {
    AOL: {
      id: '2oQNkePakuPbHzrVVkQ875WHeewLHCd2cAwfwiLQbonk',
      icon: ''
    },
    VALOR: {
      id: '3wPQhXYqy861Nhoc4bahtpf7G3e89XCLfZ67ptEfZUSA',
      icon: ''
    },
    BURGER: {
      id: '632SvBrfaep51NGKnKtUHTR9J2T4uYGKEQkCgy42USA',
      icon: ''
    }
  };

  /**
   * Fetch market data for all tokens simultaneously
   */
  static async fetchAll(): Promise<TokenMarketData[]> {
    try {
      console.log('📊 Fetching all token data from Dexscreener...');

      const results = await Promise.all(
        Object.entries(this.tokens).map(async ([symbol, data]) => {
          try {
            const response = await fetch(
              `https://api.dexscreener.io/latest/dex/tokens/${data.id}`,
              {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
              }
            );

            if (!response.ok) {
              console.warn(`⚠️ ${symbol}: API returned status ${response.status}`);
              return null;
            }

            const json = await response.json();
            const pair = json.pairs?.[0];

            if (!pair) {
              console.warn(`⚠️ ${symbol}: No trading pairs found`);
              return null;
            }

            const tokenData: TokenMarketData = {
              symbol,
              icon: data.icon,
              price: parseFloat(pair.priceUsd).toFixed(6),
              change: parseFloat(pair.priceChange?.h24 || 0),
              mc: pair.fdv ? (pair.fdv / 1_000_000).toFixed(1) : '0.0'
            };

            console.log(`✅ ${symbol} Data:`, tokenData);
            return tokenData;
          } catch (error) {
            console.error(`❌ Failed to fetch ${symbol} data:`, error);
            return null;
          }
        })
      );

      return results.filter((data): data is TokenMarketData => data !== null);
    } catch (error) {
      console.error('❌ Market data fetch error:', error);
      return [];
    }
  }

  /**
   * Get color based on price change percentage
   */
  static getColorForChange(change: number): string {
    if (change > 1) return '#00FF00';     // Green for > +1%
    if (change < -1) return '#FF0000';    // Red for < -1%
    return '#FFCC00';                     // Yellow for neutral
  }

  /**
   * Format price display text for a single token (without percentage - will be colored separately)
   */
  static formatTokenDisplay(data: TokenMarketData): { main: string; percent: string } {
    const changeSign = data.change > 0 ? '+' : '';
    return {
      main: `$${data.symbol}  $${data.price}  `,
      percent: `${changeSign}${data.change.toFixed(1)}%  MC $${data.mc}M`
    };
  }
}
