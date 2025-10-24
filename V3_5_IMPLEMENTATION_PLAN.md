# Eagle of Fun v3.5 - Detaillierter Implementierungsplan

## Build Tag: Eagle_of_Fun_v3_5_DynamicEdition

---

## Phase 1: Core Systems (Fundament)

### 1.1 Market Phases System ⭐ PRIORITY 1
**Files zu erstellen:**
- ✅ `/src/config/MarketPhasesConfig.ts` (DONE)

**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Add: `currentPhase: string`
  - Add: `phaseStartTime: number`
  - Add: `determineAndUpdatePhase()` Methode
  - Add: Phase transition logic in `update()`
  - Add: Visual feedback für Phase-Wechsel (Flash + Ticker)

**Features:**
- 6 Phasen: Bull Run → Correction → Bear Trap → Sideways → Valor Comeback → Endless WAGMI
- Time-based transitions
- Screen flash bei Phasenwechsel
- Ticker-Nachricht mit Phase-spezifischer Farbe
- Audio crossfade zwischen Phasen

**Testing:**
- [ ] Phase wechselt bei 60s (Bull Run → Correction)
- [ ] Phase wechselt bei 120s (Correction → Bear Trap)
- [ ] Ticker zeigt korrekte Nachricht
- [ ] Screen flash funktioniert
- [ ] Audio wechselt

---

### 1.2 Speed & Difficulty Scaling System ⭐ PRIORITY 2
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Add: `baseSpeed: number`
  - Add: `speedScalingInterval: Phaser.Time.TimerEvent`
  - Add: `difficultyScalingInterval: Phaser.Time.TimerEvent`
  - Add: `applySpeedScaling()` Methode
  - Add: `applyDifficultyScaling()` Methode

**Features:**
- Speed +3% alle 20 Sekunden (max ×2.5)
- Enemy Spawn Rate +4% alle 15 Sekunden
- Coin Spawn Rate -1% alle 20 Sekunden
- VALOR Mode -1s je Minute Spielzeit
- Glide Cooldown +0.3s je Minute

**Formeln:**
```typescript
speedMultiplier = Math.min(1 + (gameTime / 20) * 0.03, 2.5)
enemySpawnRateMultiplier = 1 + (gameTime / 15) * 0.04
coinSpawnRateMultiplier = Math.max(0.5, 1 - (gameTime / 20) * 0.01)
valorDuration = 15 - Math.floor(gameTime / 60)
glideCooldown = 300 + Math.floor(gameTime / 60) * 300
```

**Testing:**
- [ ] Speed steigt nach 20s
- [ ] Enemy Spawn Rate erhöht sich
- [ ] Coin Spawn Rate sinkt leicht
- [ ] Bei 60s Spielzeit ist VALOR kürzer
- [ ] Glide Cooldown steigt

---

### 1.3 Combo System v3.5 ⭐ PRIORITY 3
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Modify: `comboTimer` von 1.0s → 1.5s
  - Modify: `maxCombo` von 15 → 25
  - Add: `createCoinExplosion()` Methode (alle 5 Combos)
  - Add: Combo feedback text (z.B. "🔥 Combo ×10! Keep pushing!")

**Features:**
- Combo Timer 1.5 Sekunden (mehr Zeit)
- Max Combo 25x (war 15x)
- Alle 5 Combos → Coin Explosion (5 Coins spawnen)
- HUD Feedback bei Combo Milestones (×5, ×10, ×15, ×20, ×25)

**Testing:**
- [ ] Combo hält 1.5s
- [ ] Combo geht bis 25x
- [ ] Bei Combo ×5 spawnen 5 Coins
- [ ] Feedback-Text erscheint

---

## Phase 2: Combat & Enemy Systems

### 2.1 Enemy Types & Behaviors ⭐ PRIORITY 4
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Add: Enemy movement patterns (Linear, Sine, ZickZack)
  - Add: `spawnEnemyWithPattern(type, pattern)` Methode
  - Modify: `spawnEnemy()` um Pattern zu nutzen

**Enemy Patterns:**
```typescript
// Linear: Horizontal movement (current)
// Sine: Sin-wave up/down movement
// ZickZack: Diagonal zigzag pattern
```

**Pattern Distribution:**
- Phase 1-2: 100% Linear
- Phase 3: 70% Linear, 30% Sine
- Phase 4: 50% Linear, 30% Sine, 20% ZickZack
- Phase 5+: 40% Linear, 30% Sine, 30% ZickZack

**Testing:**
- [ ] Linear movement funktioniert
- [ ] Sine movement funktioniert
- [ ] ZickZack movement funktioniert
- [ ] Pattern Distribution korrekt

---

### 2.2 Fake Coins & Lawsuit Papers ⭐ PRIORITY 5
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Add: `spawnFakeCoin(y)` Methode
  - Add: Fake coin collision (-10 Punkte)
  - Add: Gary "Lawsuit Papers" projectile
  - Add: Lawsuit hit = 1s control lock

**Features:**
- Ab Phase 3: Paper Hands droppt Fake Coins
- Fake Coins sehen aus wie echte (aber rote Aura)
- Fake Coin Collision: -10 Punkte
- Gary schießt "Lawsuit Papers"
- Lawsuit Hit: 1 Sekunde Control Lock (kein SPACE)

**Testing:**
- [ ] Fake Coins spawnen ab Phase 3
- [ ] Fake Coin Collision -10 Punkte
- [ ] Gary schießt Projektile
- [ ] Control Lock funktioniert

---

### 2.3 Bear Boss v3.5 ⭐ PRIORITY 6
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Add: Bear Boss HP system (3 Treffer)
  - Add: Bear Boss defeat rewards (+500 XP, +1 Leben)
  - Add: Bear Boss special patterns

**Features:**
- Bear Boss erscheint bei Score > 5000
- 3 HP (3 Treffer mit Shield/Belle nötig)
- HP Bar über Boss
- Bei Defeat: +500 XP, +1 Leben
- Sound: Boss defeat

**Testing:**
- [ ] Boss spawnt bei 5000+
- [ ] 3 HP funktionieren
- [ ] HP Bar angezeigt
- [ ] Rewards vergeben

---

## Phase 3: Lives & Progression

### 3.1 Lives System v3.5 ⭐ PRIORITY 7
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Modify: `maxLives` 3 → 5
  - Add: `noLifeDropsAfterPhase3` flag
  - Modify: Burger combo Leben-Drop Logik

**Features:**
- Start: 3 Leben
- Max: 5 Leben
- Ab Phase 3 (Bear Trap): Keine Leben-Drops mehr
- Burger Combo gibt trotzdem Leben (bis max 5)

**Testing:**
- [ ] Start mit 3 Leben
- [ ] Max 5 Leben möglich
- [ ] Ab Phase 3 keine Auto-Drops
- [ ] Burger Combo funktioniert weiterhin

---

### 3.2 VALOR Mode v3.5 ⭐ PRIORITY 8
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Modify: Stage 1 duration 6s → 5s
  - Modify: Stage 2 duration 6s → 5s
  - Modify: Afterglow duration 3s → 4s
  - Add: Coin Rain bei Boss defeat während VALOR
  - Add: Valor Echo effect (0.5s glow fade)

**Features:**
- Stage 1: 5 Sekunden (war 6s)
- Stage 2: 5 Sekunden (war 6s)
- Afterglow: 4 Sekunden (war 3s)
- Total Duration: 14 Sekunden (war 15s)
- Neue Mechanik: Coin Rain wenn Boss während VALOR besiegt
- Valor Echo: 0.5s Glow Fade nach Deaktivierung

**Testing:**
- [ ] Stage 1 = 5s
- [ ] Stage 2 = 5s
- [ ] Afterglow = 4s
- [ ] Coin Rain funktioniert
- [ ] Echo Fade funktioniert

---

## Phase 4: Mission & XP System

### 4.1 Mission System v3.5 ⭐ PRIORITY 9
**Files zu erstellen:**
- `/src/config/MissionsConfigV35.ts` (erweitert MissionsConfig.ts)

**Files zu modifizieren:**
- `/src/managers/MissionManager.ts`
  - Add: +20 neue Missionen
  - Add: Daily/Weekly Rotation System
  - Add: Mission reward scaling mit Level

**Neue Mission-Kategorien:**
1. **Phase-Based**: "Survive Bull Run", "Reach Bear Trap"
2. **Combo-Based**: "Get 15x Combo", "Get 25x Combo"
3. **Boss-Based**: "Defeat Bear Boss", "Defeat 3 Bosses"
4. **Perfect-Play**: "No hits for 60s", "100% coin collection"
5. **Speed-Based**: "Survive 5 min", "Survive 10 min"

**Daily/Weekly System:**
- Daily Missions: Reset nach 24h
- Weekly Missions: Reset nach 7d
- Gespeichert in localStorage mit Timestamp

**Testing:**
- [ ] Neue Missionen verfügbar
- [ ] Daily Reset funktioniert
- [ ] Weekly Reset funktioniert
- [ ] Reward Scaling funktioniert

---

### 4.2 XP System Bonus ⭐ PRIORITY 10
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Add: Survival Bonus (+10% XP bei >300s)
  - Add: XP multiplier events

**Features:**
- Überleben > 300s = +10% XP Bonus
- Burger Friday Event = ×2 XP für 10s
- Level 20+ = Revive Token Mission unlock

**Testing:**
- [ ] Survival Bonus funktioniert
- [ ] Event XP multiplier funktioniert
- [ ] Revive Token Mission erscheint

---

## Phase 5: UI & Feedback

### 5.1 Dynamic Ticker v3.5 ⭐ PRIORITY 11
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Modify: Ticker background color = Phase-abhängig
  - Add: Zufällige News alle 15s
  - Add: Ticker color transitions

**Ticker Colors by Phase:**
- Bull Run: Green (#00FF00)
- Correction: Yellow (#FFFF00)
- Bear Trap: Red (#FF0000)
- Sideways: Light Blue (#ADD8E6)
- Valor Comeback: Gold (#FFD700)
- Endless WAGMI: Magenta (#FF00FF)

**News Pool (zufällig):**
```typescript
const marketNews = [
  "🐂 BULL RUN ACTIVE – Traders in euphoria!",
  "📉 Correction Phase – Market cooling down.",
  "🐻 Bear Trap – Jeeters everywhere!",
  "↔️ Sideways Phase – Market consolidating.",
  "🦅 Valor Comeback – America rises again!",
  "🌟 ENDLESS WAGMI MODE – Pure chaos!",
  "💎 Diamond hands prevail!",
  "🐋 Whales accumulating!",
  "⚡ Massive pump incoming!",
  "🔥 Market on fire!"
];
```

**Testing:**
- [ ] Ticker Farbe ändert sich mit Phase
- [ ] News wechseln alle 15s
- [ ] Transitions smooth

---

### 5.2 Micro-Events System ⭐ PRIORITY 12
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Add: `microEventTimer` (check alle 30s)
  - Add: `triggerMicroEvent(event)` Methode
  - Add: Event effects (coinSpawn3x, enemyPause, etc.)
  - Add: Event notification (top-center, 2s)

**Events & Effects:**

1. **Elon Tweet** (5% chance)
   - Effekt: Coin Spawn ×3 für 5s
   - Message: "🚀 Elon tweeted! Coins flooding in!"

2. **SEC Down** (3% chance)
   - Effekt: Enemy Pause für 5s
   - Message: "😴 SEC servers down! Enemy pause!"

3. **Market Pump** (4% chance)
   - Effekt: Coin Rain für 10s
   - Message: "💰 Market Pump! Coin rain!"

4. **Burger Friday** (6% chance)
   - Effekt: XP ×2 für 10s
   - Message: "🍔 Burger Friday! XP ×2!"

5. **Valor Drop** (2% chance)
   - Effekt: Garantierte Feather Spawn in 10s
   - Message: "🦅 Valor Drop incoming! Get ready!"

**Testing:**
- [ ] Events triggern zufällig
- [ ] Effekte funktionieren
- [ ] Notifications erscheinen
- [ ] Timings korrekt

---

## Phase 6: Audio & Performance

### 6.1 Audio System v3.5 ⭐ PRIORITY 13
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Add: Audio crossfade zwischen Phasen (0.4s)
  - Add: Coin pitch variation (±15%)
  - Add: Combo ×10 = Publikums-Cheer Sound
  - Add: Phase-Change aufsteigender Ton
  - Add: Game Over Voice: "Liquidated in style!"

**Neue Sounds benötigt:**
- `phase-change.mp3` (aufsteigender Ton)
- `crowd-cheer.mp3` (für Combo ×10)
- `liquidated-voice.mp3` (Game Over)

**Testing:**
- [ ] Crossfade funktioniert
- [ ] Coin Pitch variiert
- [ ] Cheer bei Combo ×10
- [ ] Phase Change Sound
- [ ] Game Over Voice

---

### 6.2 Performance Optimizations ⭐ PRIORITY 14
**Files zu modifizieren:**
- `/src/scenes/GameScene.ts`
  - Add: Object Pooling für Enemies
  - Add: Object Pooling für Coins
  - Add: Particle Emitter Limit (max 4)
  - Optimize: Update loop

**Optimierungen:**
- Object Pooling für Enemies (reuse statt destroy/create)
- Object Pooling für Coins
- Max 4 Particle Emitter gleichzeitig
- Frame Target: 60 FPS
- Cleanup inactive objects

**Debug Keys:**
- F9: God Mode toggle
- F10: Force next Phase
- F11: Spawn Boss
- F12: +1000 XP

**Testing:**
- [ ] FPS stabil bei 60
- [ ] Kein Memory Leak
- [ ] Debug Keys funktionieren
- [ ] Object Pools funktionieren

---

## Implementation Order (Reihenfolge)

### Sprint 1: Core (2-3h)
1. ✅ Market Phases Config erstellt
2. Market Phases in GameScene integrieren
3. Speed & Difficulty Scaling
4. Combo System v3.5

### Sprint 2: Combat (2h)
5. Enemy Patterns (Linear, Sine, ZickZack)
6. Fake Coins & Lawsuit Papers
7. Bear Boss v3.5

### Sprint 3: Progression (1-2h)
8. Lives System v3.5
9. VALOR Mode v3.5
10. Mission System v3.5
11. XP Bonus System

### Sprint 4: UI & Events (2h)
12. Dynamic Ticker
13. Micro-Events System

### Sprint 5: Polish (1h)
14. Audio System v3.5
15. Performance Optimizations
16. Testing & Bugfixes

**Total Estimated Time: 8-10 Stunden**

---

## Testing Checklist (Final)

### Market Phases
- [ ] All 6 phases trigger correctly
- [ ] Transitions smooth with flash
- [ ] Ticker updates with phase
- [ ] Speed modifiers apply
- [ ] Audio crossfades

### Scaling
- [ ] Speed increases every 20s
- [ ] Enemy spawn rate increases
- [ ] Coin spawn rate decreases slightly
- [ ] VALOR duration shortens
- [ ] Glide cooldown increases

### Combat
- [ ] 3 enemy patterns work
- [ ] Fake coins spawn & penalize
- [ ] Lawsuit papers lock controls
- [ ] Bear Boss has 3 HP
- [ ] Boss rewards work

### Progression
- [ ] Lives max 5
- [ ] No drops after Phase 3
- [ ] VALOR timings correct (5s/5s/4s)
- [ ] Coin Rain on Boss defeat
- [ ] Missions rotate daily/weekly

### UI & Events
- [ ] Ticker color changes
- [ ] Micro-events trigger
- [ ] Event effects work
- [ ] Notifications appear

### Audio & Performance
- [ ] Crossfade smooth
- [ ] Coin pitch varies
- [ ] Combo cheer plays
- [ ] 60 FPS stable
- [ ] No memory leaks

---

## Build Command

```bash
npm run build
# Output: dist/index.html
# Tag: Eagle_of_Fun_v3_5_DynamicEdition
```

---

**Version:** v3.5 Dynamic Edition
**Goal:** Schneller, schwieriger, belohnender – jede Runde ein neuer Marktzyklus.
**Status:** Ready for Implementation
