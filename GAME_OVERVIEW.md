# Eagle of Fun v3.7 - Complete Game Overview

## Table of Contents
1. [Game Concept](#game-concept)
2. [Technical Architecture](#technical-architecture)
3. [Scene Flow](#scene-flow)
4. [Core Systems](#core-systems)
5. [Gameplay Mechanics](#gameplay-mechanics)
6. [Progression Systems](#progression-systems)
7. [Enemy & Phase System](#enemy--phase-system)
8. [Weapon System](#weapon-system)
9. [Power-Ups & Special Modes](#power-ups--special-modes)
10. [UI & Visual Systems](#ui--visual-systems)
11. [Data Persistence](#data-persistence)
12. [File Structure](#file-structure)

---

## Game Concept

**Eagle of Fun** is a patriotic-themed endless runner/shooter game where players control an eagle flying through different market phases, collecting coins, defeating enemies, and completing missions to earn Meta-XP and unlock permanent upgrades.

### Theme
- **Visual Style**: America-themed with patriotic colors (Navy Blue, Crimson Red, Gold)
- **Meme Culture**: Incorporates crypto/meme coin references (BONK, AOL, BURGER, VALOR)
- **Market Phases**: Gameplay changes based on "market conditions" (Bull Run, Bear Trap, etc.)

### Core Loop
1. **Play** → Navigate eagle, collect coins, shoot enemies, complete missions
2. **Die** → Enter name, view leaderboard
3. **Upgrade Hangar** → Spend Meta-XP on permanent upgrades
4. **Repeat** → Start new run with upgraded stats

---

## Technical Architecture

### Framework & Technology
- **Engine**: Phaser 3 (JavaScript game framework)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Assets**: PNG images, audio files
- **Storage**: localStorage for persistence

### Design Patterns
- **Singleton Pattern**: Used for managers (MissionManager, XPSystem, UpgradeSystem)
- **Scene Management**: Phaser's built-in scene system for different game states
- **Event-Driven**: Callbacks for XP changes, level-ups, mission completion
- **Manager Pattern**: Separate managers for weapons, missions, power-ups, phases

### Key Directories
```
/src
  /scenes         - Game scenes (StartScene, GameScene, etc.)
  /sprites        - Game objects (Eagle, Enemy, Coin, etc.)
  /managers       - Game logic managers
  /systems        - Meta-progression systems (XP, Upgrades)
  /config         - Configuration files (missions, phases, etc.)
  /utils          - Utility functions
/assets
  /images         - Sprites and backgrounds
  /audio          - Sound effects and music
```

---

## Scene Flow

### Scene Hierarchy
```
StartScene (Main Menu)
    ↓
IntroScene (Ogle Tutorial - skippable)
    ↓
GameScene (Main Gameplay)
    ↓
GameOverScene (Results)
    ↓ (SAVE NAME)
LeaderboardScene (Hall of Degens)
    ↓ (PLAY AGAIN)
UpgradeScene (Upgrade Hangar)
    ↓ (PLAY)
GameScene (New Run)
```

### Scene Descriptions

#### 1. StartScene
- **File**: `src/scenes/StartScene.ts`
- **Purpose**: Main menu
- **Features**:
  - Game title and logo
  - START button
  - LEADERBOARD button
  - Background music
  - America.Fun branding

#### 2. IntroScene
- **File**: `src/scenes/IntroScene.ts`
- **Purpose**: Tutorial for Ogle weapon system
- **Features**:
  - Weapon controls tutorial
  - "SKIP" button (ESC key)
  - Countdown before game starts
  - Shows shooting directions (Forward/Up/Down)

#### 3. GameScene
- **File**: `src/scenes/GameScene.ts` (main gameplay, 4000+ lines)
- **Purpose**: Core gameplay loop
- **Features**:
  - Eagle movement (WASD/Arrow keys)
  - Weapon shooting (Space/Q/E)
  - Enemy spawning and AI
  - Coin collection
  - Mission tracking
  - Market phase transitions
  - Power-up system
  - Valor Mode
  - Score tracking
  - Lives system

#### 4. UIScene
- **File**: `src/scenes/UIScene.ts`
- **Purpose**: Overlay UI during gameplay
- **Features**:
  - XP bar (Meta-Level display)
  - Mission progress (3 daily missions)
  - Lives (hearts)
  - Score display
  - Weapon ammo counter
  - News ticker (market phase messages)
  - Power-up timers

#### 5. GameOverScene
- **File**: `src/scenes/GameOverScene.ts`
- **Purpose**: End-of-run results
- **Features**:
  - Final score display
  - High score tracking
  - Name input (for leaderboard)
  - TRY AGAIN button → UpgradeScene
  - HALL OF DEGENS button → LeaderboardScene
  - Share on X/Twitter button

#### 6. LeaderboardScene
- **File**: `src/scenes/LeaderboardScene.ts`
- **Purpose**: Display top scores
- **Features**:
  - Top 10 scores with names
  - Player's current rank
  - PLAY AGAIN button → UpgradeScene
  - MAIN MENU button → StartScene

#### 7. UpgradeScene
- **File**: `src/scenes/UpgradeScene.ts`
- **Purpose**: Meta-progression hub
- **Features**:
  - Display current Meta-Level and XP
  - 6 upgrade categories (cards)
  - Purchase confirmation dialogs
  - Success/error notifications
  - PLAY button → GameScene
  - RESET button (clear all upgrades)

---

## Core Systems

### 1. XP System (Meta-Progression)
**File**: `src/systems/xpSystem.ts`

#### Purpose
Unified experience point system for permanent progression across all runs.

#### Data Structure
```typescript
interface XPState {
  level: number;           // Current Meta-Level (1-20)
  xp: number;              // Current XP in this level
  xpToNextLevel: number;   // XP needed to level up
  totalXP: number;         // Total XP earned (for purchasing upgrades)
}

interface XPEvent {
  delta: number;           // XP amount to add
  source: string;          // Where XP came from (kill, coin, mission, etc.)
  meta?: any;              // Additional context
}
```

#### XP Sources
- **Enemy Kills**: 10-50 XP depending on enemy type
- **Coin Collection**: 5-20 XP depending on coin type
- **Mission Completion**: 100-500 XP
- **Tier Completion**: 1000+ XP
- **Score Milestones**: Bonus XP at certain scores

#### Level Curve
```typescript
// XP needed increases by 10% per level
xpToNextLevel = baseXP * (1.1 ^ level)
// Base: 500 XP for Level 2
// Level 10: ~1,300 XP needed
// Level 20: ~3,400 XP needed
```

#### Key Methods
- `addXP(event)`: Add XP from any source, triggers level-up if threshold met
- `spendXP(amount)`: Deduct XP for upgrade purchases
- `onLevelUp(callback)`: Register callback for level-up events
- `onXPChange(callback)`: Register callback for any XP changes
- `resetForNewProfile()`: Clear all XP (reset progress)

### 2. Upgrade System
**File**: `src/systems/upgradeSystem.ts`

#### Purpose
Manages permanent upgrades purchased with Meta-XP.

#### Upgrade Categories
1. **Firepower** - Increases damage output
2. **Shield Capacity** - More shield energy
3. **Speed Boost** - Faster eagle movement
4. **Coin Magnet** - Larger coin collection radius
5. **XP Multiplier** - Earn more XP per action
6. **Score Multiplier** - Higher scores

#### Data Structure
```typescript
interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  baseCost: number;        // Base XP cost
  costScaling: number;     // Cost multiplier per level
  effectPerLevel: number;  // How much effect increases per level
}

interface UpgradeState {
  id: string;
  currentLevel: number;
}
```

#### Cost Calculation
```typescript
// Cost increases exponentially
cost = baseCost * (costScaling ^ currentLevel)

// Example: Firepower
// Level 1: 100 XP
// Level 2: 150 XP (100 * 1.5^1)
// Level 3: 225 XP (100 * 1.5^2)
```

#### Key Methods
- `buy(upgradeId, paymentCallback)`: Purchase upgrade level
- `getCost(upgradeId, level)`: Calculate XP cost for specific level
- `getLevel(upgradeId)`: Get current level of upgrade
- `getEffect(upgradeId)`: Calculate total effect from all levels
- `getAllUpgrades()`: Get all upgrade definitions
- `resetUpgrades()`: Clear all upgrades

### 3. Mission System
**File**: `src/managers/MissionManager.ts`

#### Purpose
Daily challenges and tier-based progression that awards Meta-XP.

#### Mission Types
```typescript
type MissionType =
  | 'kill'      // Kill X enemies
  | 'collect'   // Collect X coins
  | 'score'     // Reach X score
  | 'time'      // Survive X seconds
  | 'combo'     // Achieve X combo
  | 'phase'     // Complete X phase transitions
  | 'perfect'   // Survive X seconds without damage
```

#### Tier System
```typescript
// Tiers unlock based on Meta-Level
Tier 1: Meta-Level 1-3   (Beginner missions)
Tier 2: Meta-Level 4-6   (Intermediate missions)
Tier 3: Meta-Level 7-9   (Advanced missions)
Tier 4: Meta-Level 10+   (Expert missions)
```

#### Daily Missions
- 3 random missions from the mission pool
- Reset every day (based on date)
- Can be completed multiple times per day
- Award Meta-XP on completion

#### Tier Progression
1. Complete all missions in current tier
2. Earn tier completion bonus (1000+ XP)
3. Gain Meta-XP from missions
4. When Meta-Level reaches threshold → New tier unlocks automatically

#### Key Methods
- `updateMissionProgress(type, amount)`: Track progress for mission type
- `onCoinCollected()`: Update collection missions
- `onEnemyKilled()`: Update kill missions
- `onScoreUpdate(score)`: Update score missions
- `getCurrentMissions()`: Get tier missions
- `getDailyMissions()`: Get daily missions

---

## Gameplay Mechanics

### 1. Player Controls

#### Movement (Eagle)
- **WASD** or **Arrow Keys**: Move in 8 directions
- **Speed**: Base 300 pixels/second (affected by Speed Boost upgrade)
- **Boundaries**: Cannot leave screen area
- **Collision**: Hitbox smaller than sprite for fair gameplay

#### Weapons (Ogle System)
- **SPACE**: Fire forward
- **Q**: Fire upward
- **E**: Fire downward
- **1-4 Keys**: Switch weapon types (BONK/AOL/BURGER/VALOR)
- **Ammo**: Each weapon costs specific coin type
- **Cooldown**: Small delay between shots

### 2. Lives System
- **Start**: 3 lives (hearts)
- **Take Damage**: Lose 1 heart, become invincible for 2 seconds (flashing)
- **Game Over**: When all hearts depleted
- **Gain Life**: Rare power-up or specific mission rewards
- **Shield Protection**: Shield prevents damage but doesn't add hearts

### 3. Score System
- **Coin Collection**: 1-10 points per coin
- **Enemy Kills**: 10-100 points per enemy
- **Valor Mode**: 3x score multiplier during Valor Mode
- **Combo System**: Consecutive kills increase score
- **Phase Bonuses**: Extra points for phase transitions

### 4. Collision Detection
- **Eagle vs Coins**: Collection radius (affected by Coin Magnet upgrade)
- **Eagle vs Enemies**: Damage (unless shielded/invincible)
- **Bullets vs Enemies**: Damage to enemies
- **Power-Ups vs Eagle**: Activate special effect

---

## Progression Systems

### Meta-Progression Flow
```
Play Game → Earn Meta-XP → Level Up → Unlock More Missions
     ↓                                        ↓
Collect XP → Spend in Hangar → Buy Upgrades → Stronger Runs
```

### XP Sources Breakdown
| Source | XP Amount | Frequency |
|--------|-----------|-----------|
| Small Coin (BONK) | 5 XP | Very Common |
| Medium Coin (AOL) | 10 XP | Common |
| Large Coin (BURGER) | 20 XP | Rare |
| Basic Enemy Kill | 10 XP | Common |
| Elite Enemy Kill | 50 XP | Rare |
| Mission Completion | 100-500 XP | Per mission |
| Tier Completion | 1000+ XP | Per tier |

### Upgrade Effects
| Upgrade | Effect per Level | Max Level | Total Effect |
|---------|-----------------|-----------|--------------|
| Firepower | +20% damage | 10 | +200% damage |
| Shield | +10% capacity | 10 | +100% capacity |
| Speed | +5% movement | 10 | +50% speed |
| Coin Magnet | +15% radius | 10 | +150% radius |
| XP Boost | +10% XP gain | 10 | +100% XP |
| Score Boost | +15% score | 10 | +150% score |

### Permanent vs Temporary Progression
**Permanent (Meta-Progression)**:
- Meta-Level (never resets)
- Upgrades purchased in Hangar (persist between runs)
- Mission tier unlocks (based on Meta-Level)
- Unlocked cosmetics/rewards

**Temporary (Per-Run)**:
- Score (resets each game)
- Coins collected (ammo resets)
- Power-up effects (duration-based)
- Valor Mode (cooldown per run)

---

## Enemy & Phase System

### 1. Enemy Types
**File**: `src/config/PhaseConfig.ts`

#### Enemy Definitions
```typescript
interface Enemy {
  type: string;
  sprite: string;
  health: number;
  speed: number;
  damage: number;
  points: number;
  xpReward: number;
}
```

#### Enemy Roster
1. **Gary (Basic)** - 50 HP, 200 speed, 10 XP
2. **SBF (Tank)** - 150 HP, 150 speed, 25 XP
3. **SEC Guy (Fast)** - 75 HP, 300 speed, 15 XP
4. **Do Kwon (Elite)** - 200 HP, 250 speed, 50 XP
5. **CZ (Boss)** - 300 HP, 200 speed, 100 XP

### 2. Phase System
**File**: `src/config/PhaseConfig.ts`

#### Phase Types
```typescript
// Phases determine difficulty curve
interface Phase {
  phase: number;
  duration: number;        // How long phase lasts (seconds)
  spawnRate: number;       // Enemy spawn delay (ms)
  enemyTypes: string[];    // Which enemies spawn
  scoreThreshold: number;  // Score needed to enter phase
}
```

#### Phase Progression
| Phase | Duration | Spawn Rate | Enemies | Score Threshold |
|-------|----------|------------|---------|-----------------|
| 1 | 30s | 2000ms | Gary | 0 |
| 2 | 40s | 1800ms | Gary, SEC Guy | 500 |
| 3 | 50s | 1500ms | Gary, SEC, SBF | 1500 |
| 4 | 60s | 1200ms | All except Boss | 3000 |
| 5 | Endless | 1000ms | All enemies | 5000 |

### 3. Market Phases (v3.7 Feature)
**File**: `src/config/MarketPhaseConfig.ts`

#### Market Phase Types
```typescript
enum MarketPhase {
  BULL_RUN      // More coins, fewer enemies, fast speed
  CORRECTION    // Normal coins, more enemies, slower
  BEAR_TRAP     // Few coins, many enemies, slow
  SIDEWAYS      // Balanced everything
  VALOR_COMEBACK // Post-Valor special phase
  ENDLESS_WAGMI  // Endgame phase (high score)
}
```

#### Phase Effects
```typescript
interface MarketPhaseData {
  name: string;
  theme: string;
  coinSpawnModifier: number;    // Multiplier for coin spawn rate
  enemySpawnModifier: number;   // Multiplier for enemy spawn rate
  speedModifier: number;        // Multiplier for game speed
  tickerColor: number;          // News ticker color
  tickerMessage: string;        // Message shown on ticker
  backgroundFilter?: number;    // Optional background tint
}
```

#### Example: BULL_RUN Phase
```typescript
{
  name: "Bull Run",
  theme: "🐂 TO THE MOON! 🚀",
  coinSpawnModifier: 1.5,      // 50% more coins
  enemySpawnModifier: 0.7,     // 30% fewer enemies
  speedModifier: 1.3,          // 30% faster
  tickerColor: 0x00FF00,       // Green
  tickerMessage: "BULL RUN ACTIVE! Wagmi!"
}
```

#### Phase Transition Logic
```typescript
// Market phase changes based on:
// 1. Game time (every 45-60 seconds)
// 2. Current score (unlocks new phases)
// 3. Special events (Valor Mode triggers VALOR_COMEBACK)

function determineMarketPhase(gameTime: number, score: number): MarketPhase {
  if (score > 10000) return ENDLESS_WAGMI;
  if (gameTime % 120 < 30) return BULL_RUN;
  if (gameTime % 120 < 60) return SIDEWAYS;
  if (gameTime % 120 < 90) return CORRECTION;
  return BEAR_TRAP;
}
```

---

## Weapon System

### Weapon Manager
**File**: `src/managers/WeaponManagerSimple.ts`

### Weapon Types
```typescript
interface Weapon {
  id: string;
  name: string;
  icon: string;
  coinType: 'BONK' | 'AOL' | 'BURGER' | 'VALOR';
  costPerShot: number;
  damage: number;
  bulletSpeed: number;
  bulletSprite: string;
  bulletScale: number;
}
```

### Weapon Roster
1. **BONK (Default)**
   - Cost: 1 BONK per shot
   - Damage: 25
   - Speed: 400 px/s
   - Sprite: Yellow meme coin

2. **AOL (Intermediate)**
   - Cost: 1 AOL per shot
   - Damage: 50
   - Speed: 500 px/s
   - Sprite: Blue coin

3. **BURGER (Heavy)**
   - Cost: 1 BURGER per shot
   - Damage: 100
   - Speed: 300 px/s
   - Sprite: Burger projectile

4. **VALOR (Special)**
   - Cost: FREE (only during Valor Mode)
   - Damage: 150
   - Speed: 600 px/s
   - Sprite: Golden eagle feather

### Shooting Mechanics
```typescript
// Fire weapon in direction
shoot(direction: 'forward' | 'up' | 'down'): void {
  const weapon = getCurrentWeapon();

  // Check ammo
  if (!hasEnoughAmmo(weapon.coinType, weapon.costPerShot)) {
    return; // Can't shoot
  }

  // Deduct ammo
  deductCoins(weapon.coinType, weapon.costPerShot);

  // Create bullet
  const bullet = createBullet(weapon, direction);

  // Apply upgrade bonuses
  bullet.damage *= (1 + firepowerUpgrade * 0.2);

  // Fire!
  bullets.add(bullet);
}
```

### Weapon Switching
- **1 Key**: Switch to BONK
- **2 Key**: Switch to AOL
- **3 Key**: Switch to BURGER
- **4 Key**: Switch to VALOR (only if in Valor Mode)
- **Tutorial**: Shows weapon switching in IntroScene

---

## Power-Ups & Special Modes

### 1. Power-Up System
**File**: `src/managers/PowerUpManager.ts`

#### Power-Up Types
```typescript
interface PowerUp {
  id: string;
  name: string;
  icon: string;
  duration: number;      // How long it lasts (ms)
  rarity: number;        // Spawn probability (0-1)
  effect: string;        // What it does
}
```

#### Available Power-Ups
1. **Shield** (Blue Circle)
   - Duration: 10 seconds
   - Effect: Prevents all damage
   - Rarity: Common (0.3)

2. **Double XP** (Purple Star)
   - Duration: 15 seconds
   - Effect: 2x XP gain
   - Rarity: Uncommon (0.2)

3. **Score Boost** (Gold Star)
   - Duration: 12 seconds
   - Effect: 2x score multiplier
   - Rarity: Uncommon (0.2)

4. **Bandana** (Red Bandana)
   - Duration: 20 seconds
   - Effect: Infinite ammo (all weapons free)
   - Rarity: Rare (0.1)

5. **Extra Life** (Pink Heart)
   - Duration: Instant
   - Effect: +1 life (max 3)
   - Rarity: Very Rare (0.05)

#### Power-Up Spawning
```typescript
// Power-ups spawn randomly during gameplay
spawnPowerUp() {
  const roll = Math.random();
  let cumulativeProbability = 0;

  for (const powerUp of powerUpList) {
    cumulativeProbability += powerUp.rarity;
    if (roll <= cumulativeProbability) {
      createPowerUp(powerUp);
      break;
    }
  }
}

// Spawn timer: Every 20-30 seconds
powerUpSpawnTimer = setInterval(spawnPowerUp, 25000);
```

### 2. Valor Mode (Special)
**File**: `src/scenes/GameScene.ts` (lines 3900-4100)

#### Activation
- Collect a **Gold Feather** (rare spawn)
- Spawns after specific events or randomly
- Cannot activate if on cooldown (60 second cooldown)

#### Valor Mode Stages
```typescript
// Stage 1: VALOR RISING (2 seconds)
- Screen flash gold
- Eagle transforms to valor sprite
- "VALOR MODE ACTIVATED" announcement
- Shield activates
- Slow-motion effect (0.5x speed)

// Stage 2: VALOR UNLEASHED (6 seconds)
- Full speed combat
- 3x score multiplier
- Unlimited VALOR weapon (150 damage)
- Shield remains active
- Increased coin/enemy spawn (1.5x)

// Stage 3: VALOR AFTERGLOW (5 seconds)
- Fade out effects
- 1.5x score multiplier (reduced)
- Shield still active
- Return to normal spawn rates

// Deactivation
- Eagle returns to normal sprite
- Shield deactivates
- 60 second cooldown begins
```

#### Valor Mode Effects
- **Total Duration**: 13 seconds
- **Score Bonus**: Up to 3x multiplier
- **Damage Output**: 150 damage per shot
- **Protection**: Full shield for entire duration
- **Cooldown**: 60 seconds before can activate again

---

## UI & Visual Systems

### 1. HUD Elements (UIScene)
**File**: `src/scenes/UIScene.ts`

#### XP Bar
```
┌─────────────────────────────────┐
│ LEVEL 5                     ████│ ← Progress bar
│ 750 / 1200 XP           ████    │ ← Gold bar on navy
└─────────────────────────────────┘
```
- Position: Top-right
- Colors: Navy background, red progress, gold accents
- Updates: Real-time via xpSystem callbacks

#### Mission Display
```
┌───────────────────────────────┐
│ 🎯 Kill 50 Enemies            │
│ 23 / 50  ████████░░░░░░       │ ← Progress bar
├───────────────────────────────┤
│ 💰 Collect 100 Coins          │
│ 67 / 100 █████████████░░░     │
├───────────────────────────────┤
│ ⭐ Score 1000 Points          │
│ 450 / 1000 ████░░░░░░░░░░     │
└───────────────────────────────┘
```
- Position: Bottom-right
- 3 missions shown simultaneously
- Green = in progress, Gold = completed

#### Lives Display
```
❤️ ❤️ ❤️  ← 3 lives (full opacity)
❤️ ❤️ 🖤  ← 2 lives (last heart dimmed)
```
- Position: Top-right (below XP bar)
- Red hearts = active lives
- Gray hearts = lost lives

#### Weapon Display
```
┌────────────────────────────┐
│ 🪙 BONK Blaster           │
│ 1 BONK | Ammo: 45         │ ← Ammo count
│ Energy: ████████░░ 80%    │ ← Energy bar
└────────────────────────────┘
```
- Position: Bottom-center
- Shows current weapon, cost, ammo
- Energy bar: Green (high) → Yellow (medium) → Red (low)

#### Power-Up Timers
```
┌──────────┐  ┌──────────┐
│ 🛡️       │  │ ⭐       │
│ SHIELD   │  │ XP x2    │
│ 08:42    │  │ 12:15    │ ← Time remaining
└──────────┘  └──────────┘
```
- Position: Bottom-left
- Navy boxes with gold borders
- White text, blinks red when <3 seconds
- Icons: 48px (enlarged for visibility)

#### News Ticker
```
🚨 BREAKING: Bull market active! • Wagmi! • Diamond hands! → (scrolls)
```
- Position: Top of screen (below HUD)
- Scrolls right-to-left infinitely
- Color changes based on market phase
- Messages reflect current market phase

### 2. Visual Effects

#### Screen Effects
- **Flash**: White flash on Valor activation, phase transitions
- **Shake**: Camera shake on explosions, big hits
- **Tint**: Background color changes per market phase
- **Slow-Motion**: Time dilation during Valor Rising

#### Particle Effects
- **Coin Sparkles**: When collecting coins
- **Explosion**: Enemy death animation
- **Feather Trail**: Gold feathers leave particle trail
- **Shield Glow**: Pulsing blue glow when shield active

#### Tweens & Animations
```typescript
// Example: Notification popup
this.tweens.add({
  targets: notification,
  alpha: { from: 0, to: 1 },
  y: { from: startY, to: endY },
  duration: 400,
  ease: 'Back.easeOut',
  onComplete: () => {
    // Fade out after delay
    this.tweens.add({
      targets: notification,
      alpha: 0,
      duration: 800,
      delay: 2000,
      ease: 'Cubic.easeIn'
    });
  }
});
```

### 3. Audio System

#### Music Tracks
- **StartScene**: Intro/menu music (loop)
- **GameScene**: Gameplay music (intensity based on phase)
- **GameOverScene**: Game over jingle
- **Valor Mode**: Special Valor theme (13 second duration)

#### Sound Effects
- **Coin Collect**: Ding/chime sound
- **Enemy Hit**: Impact sound
- **Enemy Death**: Explosion sound
- **Weapon Fire**: Pew/shot sound (different per weapon)
- **Power-Up Collect**: Power-up jingle
- **Level Up**: Fanfare sound
- **Phase Transition**: Whoosh/transition sound
- **Buyback Voice**: "Extra life!" voice line

---

## Data Persistence

### LocalStorage Keys
```typescript
// Meta-Progression
'eagleOfFun_xpState'          // XP system state
'eagleOfFun_upgrades'         // Upgrade levels
'eagleOfFun_missionProgress'  // Mission tier & unlocks

// Per-Session
'eagleOfFun_dailyMissions'    // Today's daily missions
'eagleOfFun_dailyDate'        // Date for daily missions

// Leaderboard
'eagleOfFun_leaderboard'      // Top 10 scores + names
'eagleOfFun_highScore'        // Player's personal best
```

### Data Structures

#### XP State
```json
{
  "level": 5,
  "xp": 750,
  "xpToNextLevel": 1200,
  "totalXP": 4500
}
```

#### Upgrades
```json
{
  "firepower": 3,
  "shield": 2,
  "speed": 1,
  "coinMagnet": 2,
  "xpBoost": 1,
  "scoreBoost": 2
}
```

#### Mission Progress
```json
{
  "currentTier": 2,
  "completedMissions": ["mission_1", "mission_2"],
  "unlockedRewards": ["skin_default", "background_default"]
}
```

#### Leaderboard
```json
{
  "entries": [
    { "name": "HODLKING", "score": 15000 },
    { "name": "DiamondHands", "score": 12500 },
    { "name": "PaperBoi", "score": 8000 }
  ]
}
```

### Save/Load Flow
```typescript
// On game events
addXP() → xpSystem.saveState() → localStorage.setItem()
buyUpgrade() → upgradeSystem.saveState() → localStorage.setItem()
completeMission() → missionManager.saveProgress() → localStorage.setItem()

// On game load
constructor() → loadState() → localStorage.getItem() → parse JSON
```

### Reset Functions
```typescript
// Reset XP only
xpSystem.resetForNewProfile()
  → Sets level=1, xp=0, totalXP=0
  → Saves to localStorage

// Reset Upgrades only
upgradeSystem.resetUpgrades()
  → Sets all upgrades to level 0
  → Saves to localStorage

// Reset Missions only
missionManager.resetProgress()
  → Sets tier=1, clears completed missions
  → Saves to localStorage

// Full Reset (clear everything)
clearAllProgress()
  → localStorage.clear()
  → Reload page
```

---

## File Structure

### Complete File Tree
```
/Eagle
├── /src
│   ├── main.ts                    # Entry point
│   ├── /scenes
│   │   ├── StartScene.ts          # Main menu
│   │   ├── IntroScene.ts          # Ogle tutorial
│   │   ├── GameScene.ts           # Main gameplay (4000+ lines)
│   │   ├── UIScene.ts             # HUD overlay
│   │   ├── GameOverScene.ts       # Results screen
│   │   ├── LeaderboardScene.ts    # Hall of Degens
│   │   └── UpgradeScene.ts        # Upgrade Hangar
│   ├── /sprites
│   │   ├── Eagle.ts               # Player character
│   │   ├── Enemy.ts               # Enemy base class
│   │   ├── Coin.ts                # Collectible coins
│   │   └── Bullet.ts              # Weapon projectiles
│   ├── /managers
│   │   ├── MissionManager.ts      # Mission system
│   │   ├── WeaponManagerSimple.ts # Weapon switching
│   │   ├── PowerUpManager.ts      # Power-up spawning
│   │   └── BandanaPowerUp.ts      # Bandana power-up
│   ├── /systems
│   │   ├── xpSystem.ts            # Meta-XP system
│   │   ├── upgradeSystem.ts       # Upgrade purchases
│   │   └── storage.ts             # LocalStorage wrapper
│   ├── /config
│   │   ├── MissionsConfig.ts      # Mission definitions
│   │   ├── PhaseConfig.ts         # Enemy phases
│   │   ├── MarketPhaseConfig.ts   # Market phases
│   │   └── UpgradeConfig.ts       # Upgrade definitions
│   └── /utils
│       └── helpers.ts             # Utility functions
├── /assets
│   ├── /images
│   │   ├── eagle-sprite.png
│   │   ├── enemy-*.png
│   │   ├── coin-*.png
│   │   ├── background-*.png
│   │   └── america-logo.png
│   └── /audio
│       ├── /music
│       │   ├── intro.mp3
│       │   ├── gameplay.mp3
│       │   └── gameover.mp3
│       └── /sfx
│           ├── coin-collect.mp3
│           ├── enemy-hit.mp3
│           ├── weapon-fire.mp3
│           └── powerup.mp3
├── index.html                     # HTML entry
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.js                 # Vite build config
└── GAME_OVERVIEW.md              # This file
```

### Key File Responsibilities

#### GameScene.ts (4000+ lines)
The core of the game. Handles:
- Eagle movement and input
- Enemy spawning and AI
- Coin spawning and collection
- Collision detection
- Weapon firing
- Power-up activation
- Valor Mode orchestration
- Market phase transitions
- Score calculation
- Lives management
- Game over trigger

#### UIScene.ts
UI overlay that runs parallel to GameScene:
- Subscribes to xpSystem for XP updates
- Displays mission progress
- Shows power-up timers
- Updates weapon ammo display
- Manages news ticker

#### UpgradeScene.ts
Meta-progression hub:
- Displays 6 upgrade cards
- Shows costs and current levels
- Confirmation dialogs for purchases
- Success/error notifications
- Integrates with xpSystem and upgradeSystem

#### xpSystem.ts
Singleton that manages Meta-XP:
- Calculates level-ups
- Tracks total XP earned
- Provides callbacks for XP changes
- Persists to localStorage

#### upgradeSystem.ts
Singleton that manages upgrades:
- Defines all upgrade types
- Calculates costs (exponential scaling)
- Calculates effects (linear per level)
- Persists upgrade levels to localStorage

#### MissionManager.ts
Singleton that manages missions:
- Loads tier missions based on Meta-Level
- Generates daily missions (reset each day)
- Tracks mission progress
- Awards Meta-XP on completion
- Unlocks new tiers based on Meta-Level

---

## Game Flow Example

### Complete Player Journey

#### 1. First Launch
```
START SCENE
  ↓ (Click START)
INTRO SCENE (Tutorial)
  ↓ (Wait or press SKIP)
GAME SCENE
```

#### 2. During Gameplay
```
Player controls eagle (WASD)
  ↓
Collect coins (BONK, AOL, BURGER)
  ↓ Gain ammo + Meta-XP (5-20 XP)
Shoot enemies (SPACE/Q/E)
  ↓ Gain score + Meta-XP (10-50 XP)
Complete missions
  ↓ Gain Meta-XP (100-500 XP)
Collect power-ups
  ↓ Activate shield/double XP/etc.
Find Gold Feather
  ↓ Activate VALOR MODE (13 seconds)
Take damage 3 times
  ↓ GAME OVER
```

#### 3. Post-Game
```
GAME OVER SCENE
  ↓ (Enter name, click SAVE NAME)
LEADERBOARD SCENE
  ↓ (Click PLAY AGAIN)
UPGRADE SCENE
```

#### 4. Upgrade Hangar
```
View Meta-Level: 5
View Total XP: 4500
  ↓
Select upgrade: "Firepower Level 3 → 4"
Cost: 225 XP
  ↓ (Click card)
Confirmation Dialog:
  "Buy Firepower Level 4 for 225 XP?"
  [✓ BUY] [✗ CANCEL]
  ↓ (Click BUY)
Success: "✅ Firepower upgraded to Level 4!"
Deduct 225 XP (4500 → 4275)
  ↓ (Click PLAY)
GAME SCENE (with upgraded damage)
```

#### 5. Mission Progression
```
Start at Tier 1 (Meta-Level 1-3)
Complete all Tier 1 missions
  ↓ Earn 1000 XP tier bonus
Meta-Level increases (3 → 4)
  ↓ Auto-unlock Tier 2
New missions appear (Tier 2)
  ↓ Harder challenges, better rewards
```

---

## Technical Details

### Performance Considerations
- **Object Pooling**: Reuse bullets/coins/enemies instead of creating new ones
- **Culling**: Destroy objects that leave screen bounds
- **Depth Sorting**: Minimize depth changes to reduce draw calls
- **Asset Loading**: Preload all assets in StartScene
- **LocalStorage**: Debounce saves to avoid excessive writes

### Debug Features
```typescript
// Console logging
console.log(`🎯 Mission completed: ${mission.title}`);
console.log(`✅ Level up! Now Level ${newLevel}`);
console.log(`💰 Collected ${coinType} coin`);

// Debug commands (in browser console)
window.debugXP = () => xpSystem.getState();
window.debugUpgrades = () => upgradeSystem.getAllUpgrades();
window.debugMissions = () => missionManager.getCurrentMissions();
```

### Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (requires WebGL)
- **Mobile**: Partial support (touch controls not implemented)

---

## Version History

### v3.7 (Current)
- **Meta-Progression System**: XP system, upgrades, Upgrade Hangar
- **Mission Integration**: Missions now award Meta-XP
- **UI Overhaul**: Patriotic design (navy, red, gold)
- **UX Improvements**: Purchase confirmations, notifications
- **Navigation Fix**: Game Over → Hangar → Game flow

### v3.6
- **Valor Mode**: 3-stage special mode
- **Market Phases**: Dynamic difficulty system
- **News Ticker**: Scrolling messages per phase
- **Weapon System**: Ogle multi-directional shooting

### v3.5
- **Mission System**: Daily missions and tier progression
- **Power-Ups**: Shield, XP boost, bandana, etc.
- **Enemy Variety**: 5+ enemy types with AI

### v3.0-3.4
- **Core Gameplay**: Eagle movement, shooting, coins
- **Phase System**: Difficulty scaling
- **Lives System**: 3 hearts with invincibility
- **Leaderboard**: Top 10 scores

---

## Future Roadmap (Ideas)

### Potential Features
- **Mobile Support**: Touch controls for iOS/Android
- **More Upgrades**: Critical hit chance, regeneration, etc.
- **Cosmetics**: Different eagle skins, backgrounds
- **Achievements**: Steam-style achievement system
- **Multiplayer**: Co-op or competitive modes
- **Boss Fights**: Special boss enemy encounters
- **Story Mode**: Campaign with levels and progression
- **Sound Options**: Volume sliders, mute button

---

## Troubleshooting

### Common Issues

#### "White screen after clicking START"
- **Cause**: Missing asset or scene initialization error
- **Fix**: Check browser console for errors, verify all assets loaded

#### "Level shows 8 instead of 1 after reset"
- **Cause**: Old mission XP system conflicting with new Meta-XP
- **Fix**: Already fixed in v3.7 (removed old updateXP calls)

#### "Can't reach Upgrade Hangar"
- **Cause**: Wrong scene navigation flow
- **Fix**: Already fixed in v3.7 (TRY AGAIN → UpgradeScene)

#### "Missions not appearing"
- **Cause**: Mission system not connected to Meta-XP
- **Fix**: Already fixed in v3.7 (missions use xpSystem)

#### "Purchase not working in Hangar"
- **Cause**: No confirmation feedback
- **Fix**: Already fixed in v3.7 (added confirmation dialogs)

### Debug Steps
1. Open browser console (F12)
2. Look for red errors
3. Check localStorage values
4. Verify asset loading
5. Test scene transitions

---

## Credits & Technologies

### Technologies Used
- **Phaser 3**: Game engine
- **TypeScript**: Programming language
- **Vite**: Build tool
- **LocalStorage API**: Data persistence

### Asset Sources
- **Eagle Sprite**: Custom America-themed eagle
- **Backgrounds**: Patriotic themed designs
- **Coins**: Meme coin references (BONK, AOL, BURGER)
- **Logo**: America.Fun branding

### Inspiration
- **Theme**: American patriotism + meme culture
- **Gameplay**: Classic endless runners/shooters
- **Progression**: Rogue-lite meta-progression

---

## Contact & Support

For issues, suggestions, or contributions:
- **Repository**: [GitHub repo if applicable]
- **Developer**: Carsten Beier
- **Version**: v3.7
- **Last Updated**: 2025-10-25

---

**END OF DOCUMENTATION**

*Eagle of Fun - Fly Free, Shoot Hard, Earn XP!*
