const { sql } = require('@vercel/postgres');

// CORS headers for frontend requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  try {
    // GET: Fetch top scores
    if (req.method === 'GET') {
      const limit = parseInt(req.query.limit) || 100;

      // Create table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS leaderboard (
          id SERIAL PRIMARY KEY,
          player_name VARCHAR(50) NOT NULL,
          score INTEGER NOT NULL,
          level INTEGER DEFAULT 1,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          verification_hash VARCHAR(64)
        )
      `;

      // Create index for faster queries
      await sql`
        CREATE INDEX IF NOT EXISTS idx_score ON leaderboard(score DESC)
      `;

      // Fetch top scores
      const result = await sql`
        SELECT player_name, score, level, timestamp
        FROM leaderboard
        ORDER BY score DESC
        LIMIT ${limit}
      `;

      return res.status(200).json({
        success: true,
        leaderboard: result.rows,
        count: result.rows.length
      });
    }

    // POST: Submit new score
    if (req.method === 'POST') {
      const { playerName, score, level, verificationHash } = req.body;

      // Validation
      if (!playerName || typeof score !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: playerName, score'
        });
      }

      // Sanitize player name
      const sanitizedName = playerName.trim().substring(0, 50);

      if (sanitizedName.length < 1) {
        return res.status(400).json({
          success: false,
          error: 'Player name must be at least 1 character'
        });
      }

      // Basic anti-cheat: score must be reasonable
      if (score < 0 || score > 10000000) {
        return res.status(400).json({
          success: false,
          error: 'Invalid score'
        });
      }

      // Insert score
      const result = await sql`
        INSERT INTO leaderboard (player_name, score, level, verification_hash)
        VALUES (${sanitizedName}, ${score}, ${level || 1}, ${verificationHash || null})
        RETURNING id, player_name, score, level, timestamp
      `;

      return res.status(201).json({
        success: true,
        entry: result.rows[0]
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: String(error),
      stack: error.stack,
      envVars: {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasPostgresPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      }
    });
  }
}
