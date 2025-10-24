# Eagle of Fun v3.2 - Vollständige Spiel-Dokumentation

## Überblick
Eagle of Fun ist ein arcade-style Endless Runner Spiel mit Crypto/Meme-Thematik. Der Spieler steuert einen Adler, der durch verschiedene Phasen fliegt, Coins sammelt, Gegner ausweicht und Missionen erfüllt.

**Tagline:** "Avoid the FUD. Stack the $AOL. Be the Meme."

---

## Spielmechanik

### Steuerung
- **SPACE-Taste**: Kurzer Druck = Flügelschlag (Eagle fliegt nach oben)
- **SPACE-Taste gehalten (≥300ms)**: Glide Mode aktiviert
  - Eagle fliegt nach vorne (von X=300 zu X=800)
  - Animation pausiert (frozen glide pose)
  - Reduzierte Schwerkraft (20% von normal)
  - Eagle wird leicht transparent (Alpha 0.85)
  - Beim Loslassen: Eagle fliegt zurück zur Startposition (X=300)
  - Animation wird fortgesetzt

### Basis-Gameplay
- **Automatisches Scrollen**: Das Spiel scrollt automatisch von rechts nach links
- **Endloses Spiel**: Keine festgelegte Endzeit, Spiel läuft bis Game Over
- **Punktesystem**: Sammle Coins für Punkte
- **Lebenssystem**: 3 Herzen (❤️), bei 0 Herzen = Game Over
- **Invincibility Frames**: Nach einem Hit 2 Sekunden unverwundbar (blinkend)

---

## Coins System

### 1. $BONK (Standard Coin)
- **Punkte**: 5
- **Spawn Chance**: 40%
- **Beschreibung**: "The people's coin"
- **Visuals**: Bonk coin image

### 2. $AOL (Premium Coin)
- **Punkte**: 10
- **Spawn Chance**: 15%
- **Beschreibung**: "America Online coin"
- **Visuals**: AOL token image
- **Emoji in UI**: 🦅
- **Combo-System**: Sammle 3 $AOL ohne Pause für Bonus

### 3. $USD1 (Utility Coin)
- **Punkte**: 15
- **Spawn Chance**: 15%
- **Beschreibung**: "Stablecoin"
- **Visuals**: USD1 coin image

### 4. $BURGER (Rare Coin)
- **Punkte**: 20
- **Spawn Chance**: 15%
- **Beschreibung**: "Burger token"
- **Visuals**: Burger token image
- **Combo-System**: Sammle 3 $BURGER für Extra-Leben (+1 Herz, max 3)

### 5. $VALOR (Ultra-Rare Premium Coin)
- **Punkte**: 25
- **Spawn Chance**: 15%
- **Beschreibung**: "Premium coin"
- **Besonderheit**: 5% Chance auf Gold Feather Drop
- **Visuals**: Valorant coin image

---

## Power-Ups

### 1. MOD Belle (Shield)
- **Dauer**: 10 Sekunden
- **Effekt**:
  - Unverwundbarkeit gegen Gegner
  - Gegner werden bei Berührung zerstört (+50 Punkte)
  - Visueller Shield-Ring um Eagle
  - Blinkt in den letzten 3 Sekunden
- **Sound**: Shield activate + Shield active loop
- **Spawn**: Zufällig

### 2. America Hat (USA Flag)
- **Dauer**: 8 Sekunden
- **Effekt**:
  - Gegner werden bei Berührung zerstört (+50 Punkte)
  - Keine Unverwundbarkeit
  - Amerika-Flagge erscheint über Eagle
- **Sound**: Shield activate
- **Spawn**: Zufällig

### 3. Gold Feather (VALOR MODE Trigger)
- **Drop Chance**: 5% von $VALOR coins
- **Effekt**: Aktiviert VALOR MODE (siehe unten)
- **Visuals**: Goldene Feder
- **Sound**: Buyback voice

---

## VALOR MODE (v3.2 Feature)

### Übersicht
VALOR MODE ist ein 3-stufiger Power-Mode mit Gold-Eagle Transformation.

### Aktivierung
- Sammle Gold Feather (5% Drop von $VALOR coins)
- Kann nicht aktiviert werden während Cooldown (60 Sekunden)

### Stage 1 (6 Sekunden)
**Visuals:**
- Eagle wird GOLD (eagle-spreat-sheet-gold.png)
- Goldener Screen-Glow
- "⚡🦅 VALOR MODE STAGE 1 🦅⚡" Overlay
- HUD: "VALOR MODE - Stage 1"

**Effekte:**
- Score Multiplikator: ×2
- Speed Multiplikator: ×3 (Coins & Enemies)
- Coin Spawn Rate: ×2 (alle 750ms statt 1500ms)
- Invincibility: JA (Shield aktiv)

**Ansage:** "SPEED ×3 | COINS ×2 | SCORE ×2"

### Stage 2 (6 Sekunden)
**Visuals:**
- Eagle bleibt GOLD
- "⚡🦅 VALOR MODE STAGE 2 🦅⚡" Overlay
- HUD: "VALOR MODE - Stage 2"

**Effekte:**
- Score Multiplikator: ×3
- Speed Multiplikator: ×4.5
- Coin Spawn Rate: ×4 (alle 375ms)
- Invincibility: JA

**Ansage:** "SPEED ×4.5 | COINS ×4 | SCORE ×3"

### Afterglow (3 Sekunden)
**Visuals:**
- Eagle bleibt GOLD
- Screen-Glow faded
- HUD: "VALOR MODE - Afterglow"

**Effekte:**
- Score Multiplikator: ×1.5
- Speed Multiplikator: ×2
- Coin Spawn Rate: ×1.5
- Invincibility: JA

**Ansage:** "Fading... ×1.5 multiplier"

### Deaktivierung
- Eagle wird wieder NORMAL (eagle-spreat-sheet.png)
- Alle Multiplikatoren zurück auf ×1
- 60 Sekunden Cooldown beginnt
- Console: "VALOR MODE - Cooldown complete. Ready again!"

### Gesamtdauer
**Total: 15 Sekunden** (6s + 6s + 3s) + 60s Cooldown

---

## Gegner-System

### Phase 1: Jeeters (Score 0-500)
**Gegner: Jeeter**
- **Beschreibung**: "Paper hands seller"
- **Visuals**: Jeet image
- **Verhalten**: Fliegt horizontal
- **Spawn Rate**: Mittel

### Phase 2: Paper Hands (Score 501-1500)
**Gegner: Paper Hands Pete**
- **Beschreibung**: "Panic seller"
- **Visuals**: PaperHands-Pixel image
- **Verhalten**: Fliegt horizontal
- **Spawn Rate**: Erhöht

### Phase 3: Red Candles (Score 1501-3000)
**Gegner: Red Candles**
- **Beschreibung**: "Market downturn"
- **Visuals**: Red candles image
- **Verhalten**: Fliegt horizontal
- **Spawn Rate**: Hoch

### Phase 4: Gary/SEC (Score 3001-5000)
**Gegner: Gary/SEC**
- **Beschreibung**: "Regulation threat"
- **Visuals**: Gary-pixel image
- **Verhalten**: Fliegt horizontal
- **Spawn Rate**: Sehr hoch

### Phase 5: Bear Market Boss (Score 5000+)
**Gegner: Bear Market Boss**
- **Beschreibung**: "Ultimate FUD"
- **Visuals**: Bear market pixel image
- **Verhalten**: Fliegt horizontal
- **Spawn Rate**: Extrem hoch

### Gegner besiegen
**Mit Shield (MOD Belle):**
- Gegner wird zerstört
- +50 Punkte
- Mission counter erhöht sich

**Mit America Hat (USA Flag):**
- Gegner wird zerstört
- +50 Punkte
- Mission counter erhöht sich

**Ohne Power-Up:**
- -1 Leben
- 2 Sekunden Invincibility Frames
- Eagle blinkt

---

## Mission System v3.1

### Übersicht
- 3 tägliche Missionen gleichzeitig aktiv
- Missionen erscheinen unten rechts im Spiel
- Fortschritt wird in Echtzeit getrackt

### Mission Types

#### 1. Score-Based Missions
- "Reach 500 points" → 100 XP
- "Reach 1000 points" → 200 XP
- "Reach 2500 points" → 500 XP
- "Reach 5000 points" → 1000 XP

#### 2. Coin Collection Missions
- "Collect 20 $BONK" → 100 XP
- "Collect 50 $BONK" → 250 XP
- "Collect 10 $AOL" → 150 XP
- "Collect 25 $AOL" → 400 XP
- "Collect 5 $BURGER" → 200 XP

#### 3. Survival Missions
- "Survive for 30 seconds" → 150 XP
- "Survive for 60 seconds" → 300 XP
- "Survive for 120 seconds" → 600 XP

#### 4. Combat Missions
- "Defeat 5 enemies" → 200 XP
- "Defeat 10 enemies" → 400 XP
- "Defeat 20 enemies" → 800 XP

#### 5. Combo Missions
- "Get a 3x $AOL combo" → 300 XP
- "Get a 5x coin streak" → 250 XP

#### 6. Perfect Play Missions
- "Don't get hit for 30 seconds" → 400 XP
- "Collect 10 coins without missing" → 300 XP

### Mission Completion
- **Visual**: Grüner Haken ✅ erscheint
- **Sound**: Mission complete sound
- **Reward**: XP wird sofort gutgeschrieben
- **UI Update**: XP-Bar füllt sich

---

## XP & Progression System v3.2

### Level System
- **Start Level**: 1
- **Max Level**: 50
- **XP pro Level**: 1000 XP

### XP Quellen
1. **Missionen erfüllen**: 100-1000 XP (je nach Mission)
2. **Coins sammeln**: Kleine XP-Beträge
3. **Gegner besiegen**: XP-Belohnung

### Level Up
**Effekte:**
- Sound: "Level up" sound
- Visual: Screen flash
- Console: "LEVEL UP! Now level X"
- XP-Bar reset auf 0

**Belohnungen:**
- Aktuell keine direkten Belohnungen
- Potenzial für zukünftige Updates (Speed boost, Extra leben, etc.)

### UI Display
**Position:** Top right
**Format:**
```
LVL 5
XP: 450/1000
```

---

## UI Layout (v3.2 Design)

### Top Bar (Pink Background #FFB3BA)
**Von links nach rechts:**
1. **TIME**: Spielzeit in Sekunden (z.B. "TIME: 45s")
2. **PHASE**: Aktuelle Phase (z.B. "PHASE: 2")
3. **SCORE**: Aktueller Score (z.B. "SCORE: 1234")
4. **Hearts**: 3 Herzen ❤️❤️❤️ (inline)
5. **AOL Logo**: token_aol.png (klein, scale 0.08)
6. **AOL Combo Counter**: "0/3" (für $AOL combo)

### Top Right Corner
**XP/Level Display:**
```
LVL 5
XP: 450/1000
```

### News Ticker (Red Background #C62828)
**Position:** Direkt unter Top Bar
**Format:** "🚨 BREAKING: [Nachricht]"
**Nachrichten:**
- "Gary sues another meme coin!"
- "$BONK hits new ATH"
- "Whales accumulating"
- "Bear market cancelled"
- "Diamond hands prevail"

**Verhalten:**
- Scrollt von rechts nach links
- Nachricht wiederholt sich 10x
- Infinite Loop

### Coin Counter Bar (Blue Background #1A3A8A)
**Position:** Unter News Ticker
**Coins angezeigt:**
```
💰 $BONK: 0  |  🦅 $AOL: 0  |  💵 $USD1: 0  |  🍔 $BURGER: 0
```

### Mission Panel (Bottom Right)
**Format:** 4 gestackte Boxen
**Jede Mission:**
```
┌─────────────────────────┐
│ Reach 500 points        │
│ Progress: 234/500       │
│ Reward: 100 XP          │
└─────────────────────────┘
```

**Completed Mission:**
```
┌─────────────────────────┐
│ ✅ Reach 500 points     │
│ Completed!              │
└─────────────────────────┘
```

### Power-Up Icons (Bottom)
**Position:** Unten, kein weißer Hintergrund
**Format:** Icon + Timer

Beispiel: `🛡️ Shield: 7s`

### VALOR MODE HUD
**Position:** Top Center (unter Top Bar)
**Format:**
```
🦅 VALOR MODE 🦅
Stage 1
```

**Screen Glow:**
- Goldener Rahmen um gesamten Screen
- Alpha: 0.3
- Pulsiert leicht

---

## Audio System

### Menu & UI Sounds
- **Menu Music**: "Eagle of Fun _ America.Fun Anthem.mp3"
- **UI Confirm**: confirm-tap-394001.mp3
- **Hover Button**: hover-button-287656.mp3
- **Menu Button**: menu-button-88360.mp3
- **Ready for Takeoff**: readyfortakeoff.mp3 (Voice)

### Game Music
- **Background Music**: "Eagle of Fun.mp3" (Loop)
- **Background Music 2**: "Eagle of Fun Kopie.mp3" (Alternative)
- **Countdown**: 321gobradford.mp3 (Voice: "3... 2... 1... GO!")
- **Buyback Voice**: VALOR MODE activation voice
- **Level Up**: new-level.mp3

### Scene Music
- **Game Over Music**: "Game Over, America.Fun.mp3"
- **Leaderboard Music**: "Hall of Degens Theme.mp3"

### Voice Acting
- **Ogle Voice**: Intro scene voice line

### Sound Effects
- **Wing Flap**: wing-flap-1-6434.mp3 (bei jedem SPACE-Druck)
- **Coin Collect**: get-coin-351945.mp3
- **Game Start**: confirm-tap-394001.mp3
- **Shield Activate**: arcade-bleep-sound-6071.mp3
- **Shield Active Loop**: Shield_Active_subtle.mp3 (während Shield aktiv)
- **Crash**: car-crash-sound-376882.mp3 (bei Hit ohne Shield)
- **Belle Collect**: arcade-ui-2-229500.mp3
- **Phase Change**: arcade-ui-2-229500.mp3
- **Keyboard Typing**: keyboard-typing-sound-250308.mp3
- **Whoosh**: whoosh-09-410876.mp3

---

## Szenen (Screens)

### 1. PreloadScene
**Funktion:** Lädt alle Assets
**Visuals:**
- Titel: "🦅 Eagle of Fun"
- Tagline: "Avoid the FUD. Stack the $AOL. Be the Meme."
- Loading Bar: 0-100%

### 2. StartScene
**Funktion:** Hauptmenü
**Optionen:**
- **START GAME**: Startet IntroScene
- **LEADERBOARD**: Zeigt Hall of Degens
- **HOW TO PLAY**: Tutorial

**Visuals:**
- Eagle Sprite
- Titel
- Musik: Menu Music

### 3. IntroScene
**Funktion:** Story-Intro mit Ogle
**Ablauf:**
1. Ogle erscheint
2. Voice Line: Ogle-voice.mp3
3. Text wird eingetippt (Typewriter-Effekt)
4. Auto-transition zu GameScene nach 8 Sekunden
5. Oder SPACE drücken zum Überspringen

**Ogle's Nachricht:**
"Welcome, Eagle! Your mission: Collect $AOL, avoid the FUD, and become the ultimate meme legend!"

### 4. GameScene
**Funktion:** Hauptspiel
**Ablauf:**
1. Countdown: "3... 2... 1... GO!" (Voice)
2. Gameplay startet
3. Endlos bis Game Over

### 5. GameOverScene
**Funktion:** Game Over Screen
**Visuals:**
- Final Score
- High Score (gespeichert in localStorage)
- Statistiken:
  - Total Coins
  - Total Time
  - Missions Completed
  - Highest Phase Reached

**Optionen:**
- **PLAY AGAIN**: Zurück zu GameScene
- **MAIN MENU**: Zurück zu StartScene
- **LEADERBOARD**: Zu LeaderboardScene

**Musik:** Game Over Music

### 6. LeaderboardScene
**Funktion:** Hall of Degens
**Visuals:**
- Top 10 Scores (gespeichert in localStorage)
- Spielername + Score

**Musik:** Leaderboard Music

### 7. HowToPlayScene
**Funktion:** Tutorial/Anleitung
**Inhalt:**
- Steuerung erklärt
- Coins erklärt
- Power-Ups erklärt
- Gegner erklärt

---

## Hintergrund-System

### Background Images
1. **Phase 1**: libertyoffreedom-background.jpg
2. **Phase 2**: city-sky-background.jpg
3. **Phase 3**: grandcanyon-background.jpg

### Parallax Scrolling
- Background scrollt langsamer als Spielelemente
- Erstellt Tiefeneffekt

---

## Combo-Systeme

### $AOL Combo
**Bedingung:** Sammle 3 $AOL Coins in Folge ohne andere Coins
**Effekt:**
- Bonus Punkte
- Mission "Get a 3x $AOL combo" completed
- Visual Feedback

**UI:** "AOL Combo: 0/3" (Top Bar)

### $BURGER Extra-Leben
**Bedingung:** Sammle 3 $BURGER Coins in Folge
**Effekt:**
- +1 Leben (max 3 Herzen)
- Sound: Level up sound
- Visual: Herz erscheint

**UI:** Herzen in Top Bar

---

## Technische Details

### Spielgröße
- **Breite**: 800px
- **Höhe**: 600px

### Eagle Sprites
- **Normal Sprite**: eagle-spreat-sheet.png (1024x1024, 4 frames 2x2 grid)
- **Gold Sprite**: eagle-spreat-sheet-gold.png (1024x1024, 4 frames 2x2 grid)

### Animationen
**Normal Eagle:**
- `eagle_fly`: Frames 0-3, 6 FPS, Loop
- `eagle_dive`: Frames 0-3, 10 FPS, Loop (schneller)
- `eagle_hit`: Frame 3, 1 FPS, No Loop

**Gold Eagle:**
- `eagleGold_fly`: Frames 0-3, 6 FPS, Loop
- `eagleGold_dive`: Frames 0-3, 10 FPS, Loop
- `eagleGold_hit`: Frame 3, 1 FPS, No Loop

### Physics
- **Gravity**: 800 (normal)
- **Glide Gravity**: 160 (20% von normal)
- **Flap Velocity**: -350 (nach oben)

### Spawn-Raten
- **Coins**: Alle 1500ms (normal), schneller im VALOR MODE
- **Enemies**: Variiert je nach Phase
- **Power-Ups**: Zufällig, niedrige Rate

---

## Persistente Daten (localStorage)

### Gespeichert
1. **High Score**: Höchster Score je erreicht
2. **Leaderboard**: Top 10 Scores mit Namen
3. **Total Games Played**: Anzahl Spiele
4. **Total Coins Collected**: Gesamte Coins gesammelt

### Nicht gespeichert
- Aktuelle Mission Progress
- VALOR MODE Cooldown
- Power-Up Status

---

## Bekannte Features & Besonderheiten

### Glide System
- Innovatives Bewegungssystem für präzises Ausweichen
- Erlaubt temporäres Vorwärtsfliegen
- Animation friert ein für visuelles Feedback

### VALOR MODE
- 3-stufiges Progression-System
- Gold-Transformation des Eagles
- Extrem hohe Multiplikatoren
- Balanciert durch Cooldown

### Mission System
- Dynamische Aufgaben
- Mehrere gleichzeitig
- Sofortige Belohnungen

### XP System
- Progression über Spiele hinweg
- Level-basiert
- Vorbereitet für zukünftige Unlocks

---

## Zitate & Voice Lines

### Countdown
- "3... 2... 1... GO Bradford!" (321gobradford.mp3)

### Ogle Intro
- "Welcome, Eagle! Your mission: Collect $AOL, avoid the FUD, and become the ultimate meme legend!"

### VALOR MODE
- "BUYBACK!" (buyback-voice.mp3 - Drill Sergeant voice)

### News Ticker Nachrichten
1. "Gary sues another meme coin!"
2. "$BONK hits new ATH"
3. "Whales accumulating"
4. "Bear market cancelled"
5. "Diamond hands prevail"

---

## Console Messages (Developer Info)

### VALOR MODE
```
🦅 VALOR MODE v3.2 ACTIVATED - Stage 1 Begin
⚡ VALOR MODE - Stage 2 Begin (ASCENSION)
✨ VALOR MODE - Afterglow (fade out)
VALOR MODE v3.2 - Complete Deactivation
VALOR MODE - Cooldown complete. Ready again!
```

### Glide System
```
GLIDE START - Moving forward to position: 800
Forward glide tween completed at x: [position]
SPACE RELEASED - isGliding: true/false
GLIDE END - Flying back to position: 300
Fly-back tween completed
```

### Level Up
```
LEVEL UP! Now level X
```

---

## Asset Liste

### Images
- eagle-spreat-sheet.png (Normal eagle, 1024x1024)
- eagle-spreat-sheet-gold.png (Gold eagle, 1024x1024)
- player-eagle.png (Start screen)
- Ogle-Pixel.png (Intro character)
- MOD-Belle-pixel.png (Shield power-up)
- america-hat-pixel.png (USA flag power-up)
- feder-pixel.png (Gold feather)
- vesper0x.png (NPC)
- bonk-coin.png ($BONK)
- token_aol.png ($AOL)
- usd1-coin.png ($USD1)
- Token_Burger.png ($BURGER)
- valorant-coin.png ($VALOR)
- jeet.png (Enemy Phase 1)
- PaperHands-Pixel.png (Enemy Phase 2)
- redcandles-pixel.png (Enemy Phase 3)
- gary-pixel.png (Enemy Phase 4)
- bearmarket-pixel.png (Enemy Phase 5)
- americalogo.png (UI element)
- libertyoffreedom-background.jpg (BG Phase 1)
- city-sky-background.jpg (BG Phase 2)
- grandcanyon-background.jpg (BG Phase 3)

### Audio
**Total:** 20+ Audiodateien (siehe Audio System oben)

---

## Entwickler-Features

### Debug-Mode
- Console Logs für VALOR MODE
- Console Logs für Glide System
- FPS Counter (falls aktiviert)

### Erweiterbarkeit
- Modularer Code (TypeScript)
- Phaser 3 Framework
- Vite Build System
- Einfach neue Missions hinzufügen
- Einfach neue Coins hinzufügen
- Einfach neue Gegner hinzufügen

---

## Version History

### v3.2 (Current)
- ✅ VALOR MODE (3 Stages)
- ✅ Life System (3 Hearts)
- ✅ Mission System v3.1
- ✅ XP & Progression System
- ✅ News Ticker
- ✅ Glide Controls
- ✅ Gold Eagle Sprite
- ✅ UI Redesign (Pink top bar, red ticker, blue coin bar)
- ✅ AOL Logo in top bar
- ✅ Enemy kill points (+50)
- ✅ Fly-back glide mechanic

### v2.0
- Gameplay improvements
- Sound system
- UI updates

### v1.0
- Initial release
- Basic gameplay
- Coin system
- Enemy system

---

## Credits

**Entwickelt mit:**
- Phaser 3 (Game Engine)
- TypeScript (Programmierung)
- Vite (Build Tool)
- Claude Code (AI Assistant)

**Musik & Sounds:**
- "Eagle of Fun _ America.Fun Anthem.mp3"
- "Eagle of Fun.mp3"
- Diverse Freesound.org Samples

**Art:**
- Eagle sprites (Custom)
- Coin tokens (Custom)
- Enemy sprites (Custom)
- Backgrounds (Licensed/Custom)

---

## Spieltipps

### Anfänger
1. Lerne die Glide-Mechanik (SPACE ≥300ms)
2. Priorisiere $AOL für Combos
3. Nutze Shield gegen schwere Phasen
4. Fokus auf einfache Missionen zuerst

### Fortgeschritten
1. Master Glide für präzises Dodging
2. Farme Gold Feathers für VALOR MODE
3. Chain Missionen für maximale XP
4. Lerne Enemy-Patterns je Phase

### Experte
1. Perfekte $AOL Combos (keine anderen Coins)
2. VALOR MODE optimal nutzen (alle Coins sammeln)
3. Alle 3 Missionen parallel erfüllen
4. Zero-Hit Runs für Perfect Play Missionen

---

**Ende der Dokumentation**
