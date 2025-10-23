# 🦅 Eagle of Fun - Vollständige Spiel-Dokumentation

**Version**: 2.0.0
**Letzte Aktualisierung**: 2025-10-22
**Entwickler**: America.Fun Team
**Engine**: Phaser 3 (TypeScript)

---

## 📑 Inhaltsverzeichnis

1. [Spielkonzept & Story](#spielkonzept--story)
2. [Alle Szenen & Menüs](#alle-szenen--menüs)
3. [Komplette UI-Elemente](#komplette-ui-elemente)
4. [Alle Spielmechaniken](#alle-spielmechaniken)
5. [Coins & Collectibles](#coins--collectibles)
6. [Power-Ups System](#power-ups-system)
7. [Gegner & Feinde](#gegner--feinde)
8. [Missions & Levelsystem](#missions--levelsystem)
9. [Alle Texte & Dialoge](#alle-texte--dialoge)
10. [Sound & Musik](#sound--musik)
11. [Visuelle Effekte](#visuelle-effekte)
12. [Technische Spezifikationen](#technische-spezifikationen)

---

# 1. Spielkonzept & Story

## Grundidee
**Eagle of Fun** ist ein 2D-Endless-Runner im Crypto/Meme-Stil. Der Spieler steuert einen Adler (Symbol für America.Fun) durch einen endlosen Himmel, sammelt Crypto-Coins ($BONK, $AOL, $BURGER, $USD1, $VALOR), weicht Gegnern aus und aktiviert Power-Ups.

## Thema
Das Spiel ist inspiriert von der America.Fun-Plattform - einem Meme-Coin-Launchpad. Gegner repräsentieren typische Crypto-Probleme:
- **Jeeters**: Paper Hands, die zu früh verkaufen
- **FUD-Spreader**: Fake News und Panik
- **Regulatoren**: SEC (Gary Gensler)
- **Konkurrenz**: Pump.fun, Four.meme
- **Bear Market**: Der ultimative Boss

## Ziel
- Überlebe so lange wie möglich
- Sammle maximale Punkte
- Schalte Missionen frei
- Erreiche höhere Level-Tiers
- Aktiviere den legendären VALOR MODE

---

# 2. Alle Szenen & Menüs

## 2.1 PreloadScene (Ladebildschirm)

### Layout:
```
┌─────────────────────────────┐
│                             │
│    🦅 Eagle of Fun          │
│                             │
│  Avoid the FUD. Stack      │
│  the $AOL. Be the Meme.    │
│                             │
│      Loading: 0%           │
│  ▓▓▓▓▓░░░░░░░░░░░░░░░      │
│                             │
└─────────────────────────────┘
```

### Elemente:
- **Titel**: "🦅 Eagle of Fun" (48px, Rot #E63946)
- **Tagline**: "Avoid the FUD. Stack the $AOL. Be the Meme." (16px, Blau #0033A0)
- **Loading Text**: "Loading: X%" (24px, Blau)
- **Progress Bar**: Weiße Box mit goldenem Fortschritt (320×50px)

### Assets geladen:
- Eagle Spritesheet (normal & gold)
- Alle Coin-Images
- Alle Enemy-Images
- Power-Up-Images
- UI-Elemente
- Sounds & Musik

---

## 2.2 StartScene (Hauptmenü)

### Layout:
```
┌─────────────────────────────────────┐
│                                     │
│         🦅 EAGLE OF FUN             │
│     Soar. Collect. Dominate.       │
│                                     │
│         [Eagle Animation]           │
│                                     │
│         ┌─────────────┐             │
│         │  ▶️ PLAY     │             │
│         └─────────────┘             │
│                                     │
│         ┌─────────────┐             │
│         │  📋 HOW TO   │             │
│         └─────────────┘             │
│                                     │
│         ┌─────────────┐             │
│         │  🏆 LEADERBD │             │
│         └─────────────┘             │
│                                     │
│         ┌─────────────┐             │
│         │  ℹ️ CREDITS  │             │
│         └─────────────┘             │
│                                     │
│  HIGH SCORE: 0                      │
│                                     │
└─────────────────────────────────────┘
```

### Elemente:

#### Titel:
- **Text**: "🦅 EAGLE OF FUN"
- **Font**: Arial Bold, 72px
- **Farbe**: Rot (#E63946)
- **Stroke**: Weiß, 6px
- **Position**: Zentriert oben

#### Tagline:
- **Text**: "Soar. Collect. Dominate."
- **Font**: Arial, 24px
- **Farbe**: Blau (#0033A0)
- **Position**: Unter Titel

#### Eagle Animation:
- Animierter Eagle-Sprite (fliegend)
- Bobbing-Animation
- Position: Bildmitte

#### Buttons:

**PLAY Button**:
- Text: "▶️ PLAY"
- Größe: 300×60px
- Farbe: Rot (#E63946)
- Hover: Scale 1.05, heller
- Sound: ui-confirm

**HOW TO PLAY Button**:
- Text: "📋 HOW TO PLAY"
- Größe: 300×60px
- Farbe: Blau (#0033A0)
- Hover: Scale 1.05
- Sound: hover-button

**LEADERBOARD Button**:
- Text: "🏆 LEADERBOARD"
- Größe: 300×60px
- Farbe: Gold (#FBB13C)
- Hover: Scale 1.05
- Sound: hover-button

**CREDITS Button**:
- Text: "ℹ️ CREDITS"
- Größe: 300×60px
- Farbe: Grau (#888888)
- Hover: Scale 1.05
- Sound: hover-button

#### High Score:
- **Text**: "HIGH SCORE: {score}"
- **Font**: Arial, 20px
- **Farbe**: Weiß
- **Position**: Unten links

#### Hintergrund:
- Gradient: Hellblau → Weiß
- Wolken-Animation (optional)

### Musik:
- **Track**: "Eagle of Fun _ America.Fun Anthem.mp3"
- **Loop**: Ja
- **Volume**: 0.7

---

## 2.3 IntroScene (Ogle-Intro)

### Story-Ablauf:

#### Szene 1: Ogle erscheint
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         [Ogle Pixel-Art]            │
│                                     │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  "Eagle, the mission is     │   │
│   │   clear: Collect coins,     │   │
│   │   dodge the FUD, and        │   │
│   │   keep America.Fun alive!"  │   │
│   └─────────────────────────────┘   │
│                                     │
│        [Klicke zum Fortfahren]      │
│                                     │
└─────────────────────────────────────┘
```

#### Szene 2: Ogle's Briefing
```
"The meme economy is under attack.
Paper hands, jeeters, and SEC lawyers
are trying to bring us down.

Your mission: Fly high, stack $AOL,
and show them what WAGMI means!"
```

#### Szene 3: Countdown
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│              READY?                 │
│                                     │
│                3                    │
│                                     │
│                                     │
└─────────────────────────────────────┘
```
Dann: 2... 1... GO!

### Elemente:
- **Ogle Sprite**: Pixel-Art Charakter (Maskottchen)
- **Dialog-Box**: Weiße Box mit schwarzem Border
- **Text**: Arial, 20px, schwarz
- **Voice**: "ElevenLabs_2025-10-17T20_59_40_Bradford_pvc_sp100_s50_sb75_v3.mp3"
- **Countdown**: "321gobradford.mp3"

### Skip:
- ESC oder Klick: Überspringe Intro
- Geht direkt zu GameScene

---

## 2.4 GameScene (Hauptspiel)

### Komplettes HUD-Layout:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ SCORE: 0    ⏱️ 0:00    PHASE 1              ❤️❤️❤️        🇺🇸 0/3  🍔 0/5 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ 🐕 $BONK: 0  |  🟣 $AOL: 0  |  🍔 $BURGER: 0  |  💵 $USD1: 0  |  🦅 $VALOR: 0 │
│                                                                         │
│                                                                         │
│                                [Eagle]                                  │
│                                                                         │
│                                                                         │
│                                                                         │
│                                                                         │
│                                                    🏆 LVL 1 – Rookie    │
│                                                    ▓▓▓░░░░░░░ 30%      │
│                                                                         │
│                                                    🎯 Collect 50: 25/50 │
│                                                    💰 Score 500: 250/500│
│                                                    ⏱️ Survive 60s: 30/60 │
│                                                                         │
│                                  [America.Fun Logo]                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### HUD-Elemente im Detail:

#### Oben Links (Score-Bereich):
**Position**: (20, 30)

1. **Score Text**:
   - Text: "SCORE: {score}"
   - Font: Arial Bold, 28px
   - Farbe: Rot (#E63946)
   - Stroke: Weiß, 4px
   - Depth: 1000

2. **Timer Text**:
   - Text: "⏱️ {minutes}:{seconds}"
   - Font: Arial Bold, 28px
   - Farbe: Weiß
   - Stroke: Schwarz, 4px
   - Format: "0:00"
   - Depth: 1000

3. **Phase Text**:
   - Text: "PHASE {number}"
   - Font: Arial Bold, 28px
   - Farbe: Weiß
   - Stroke: Schwarz, 4px
   - Depth: 1000

#### Oben Mitte (Leben):
**Position**: Zentriert bei Y=30

**Herzen**:
- Symbol: ❤️ (Emoji)
- Größe: 36px
- Spacing: 45px zwischen Herzen
- Depth: 1001
- Sichtbarkeit: Nur aktive Leben werden angezeigt
- Animation: Blinken bei Schaden

**Anzeige**:
- 3 Leben: ❤️❤️❤️
- 2 Leben: ❤️❤️
- 1 Leben: ❤️

#### Oben Rechts (Combos):
**Position**: (width * 0.78, 30)

1. **AOL Combo**:
   - Icon: 🇺🇸 (32px Emoji, ersetzt lila Kreis)
   - Text: "0/3"
   - Font: Arial Bold, 24px
   - Farbe: Rot (#E63946)
   - Bedeutung: 3 AOL = Buyback Mode

2. **Burger Combo**:
   - Icon: 🍔 (Burger-Coin-Image, Scale 0.08)
   - Text: "0/5"
   - Font: Arial Bold, 24px
   - Farbe: Rot (#E63946)
   - Bedeutung: 5 Burger = Multiplier

#### Coin Counter (Unten vom Top HUD):
**Position**: Y=100, gestreckt über Breite

**Background**:
- Farbe: Blau (#0033A0, Alpha 0.85)
- Größe: Full-Width minus 80px Margin
- Höhe: 45px
- Rounded Corners: 8px

**Coins** (5 Stück, gleichmäßig verteilt):

1. **$BONK Counter**:
   - Text: "🐕 $BONK: {count}"
   - Font: Arial, 18px
   - Farbe: Weiß
   - Stroke: Schwarz, 2px

2. **$AOL Counter**:
   - Text: "🟣 $AOL: {count}"
   - Font: Arial, 18px
   - Farbe: Weiß
   - Stroke: Schwarz, 2px

3. **$BURGER Counter**:
   - Text: "🍔 $BURGER: {count}"
   - Font: Arial, 18px
   - Farbe: Weiß
   - Stroke: Schwarz, 2px

4. **$USD1 Counter**:
   - Text: "💵 $USD1: {count}"
   - Font: Arial, 18px
   - Farbe: Weiß
   - Stroke: Schwarz, 2px

5. **$VALOR Counter**:
   - Text: "🦅 $VALOR: {count}"
   - Font: Arial, 18px
   - Farbe: Weiß
   - Stroke: Schwarz, 2px
   - Animation bei +1: Scale Pulse (1.2 für 100ms)

#### Rechts Unten (Level & Missionen):

**Level-Anzeige**:
- **Position**: 51px vom rechten Rand, 15% von oben
- **Text**: "LVL {level} – {tierName}"
- **Font**: Arial Bold, 18px
- **Farbe**: Weiß
- **Stroke**: Schwarz, 2px
- **Shadow**: Schwarz, Blur 2px

**XP-Bar**:
- **Position**: Unter Level-Text
- **Größe**: 250×9px
- **Background**: Weiß (Alpha 0.95)
- **Progress**: Rot (#E63946)
- **Border**: Schwarz, 2px
- **Container**: Dunkel (0x000000, Alpha 0.25), abgerundet

**Mission-Boxen** (3 Stück):
- **Position**: Rechts unten, 260px vom unteren Rand
- **Größe**: 280×32px (Base), Scale 1.35
- **Background**: Schwarz (Alpha 0.35), Rounded 5px
- **Spacing**: 12px zwischen Boxen
- **Stack**: Von unten nach oben

**Mission-Text-Format**:
- Text: "{emoji} {title}: {progress}/{target}"
- Font: Arial Bold, 17px
- Farbe: Weiß
- Shadow: Schwarz mit Blur

**Beispiele**:
```
🎯 Collect 50 coins: 25/50
💰 Score 1000 points: 500/1000
⏱️ Survive 120s: 60/120
```

#### Power-Up Icons (Rechts Oben):
**Position**: (width - 120, height - 45)

**Magnet (Buyback Mode)**:
- Icon: 🧲 (48px)
- Timer: "5s" darunter
- Sichtbar nur wenn aktiv
- Pulsing Animation

**Lightning (Solana Surge)**:
- Icon: ⚡ (48px)
- Timer: "4s"
- Sichtbar nur wenn aktiv

**Shield (America Hat)**:
- Visual: Roter Circle um Eagle (Radius 80px)
- Rotating Animation
- Timer-Text rechts oben

**Belle MOD**:
- Belle-Sprite folgt Eagle
- Golden Aura um Belle
- Timer-Text

**Speed Boost (Bandana)**:
- Bandana-Sprite auf Eagle
- Trail-Effekt hinter Eagle
- Timer-Text

#### VALOR MODE HUD:
**Nur sichtbar während VALOR MODE aktiv**

**Position**: Oben Mitte, Y=150

**Text**: "VALOR MODE"
- Font: Arial Bold, 48px
- Farbe: Gold (#FFD700)
- Stroke: Schwarz, 6px
- Shadow: Gold Glow, Blur 20px
- Animation: Pulse (Scale 1.0 → 1.1, 500ms Loop)
- Depth: 10000

**Screen Glow**:
- Goldener Vignette über ganzen Screen
- Farbe: Gold (#FFD700, Alpha 0.15)
- Pulsing: Alpha 0.15 → 0.3
- Depth: 9999

**Goldene Partikel**:
- 8 Emitter rund um Eagle
- Partikel: VALOR-Coin-Image
- Scale: 0.15 → 0
- Lifespan: 800ms
- Frequency: 50ms
- Blend: ADD

#### America.Fun Logo:
**Position**: (width - 100, height - 30)
- Image: america-logo.png
- Scale: 0.3
- Alpha: 0.9
- Depth: 1000
- Animation: Subtle Pulse

---

## 2.5 HowToPlayScene (Anleitung)

### Layout mit allen Screens:

#### Screen 1: Grundsteuerung
```
┌─────────────────────────────────────┐
│        HOW TO PLAY - 1/5            │
├─────────────────────────────────────┤
│                                     │
│        🎮 CONTROLS                  │
│                                     │
│   ⌨️ SPACE (tap):                   │
│      Flap wings to fly up           │
│                                     │
│   ⌨️ SPACE (hold 300ms+):           │
│      Activate glide mode            │
│                                     │
│   🖱️ CLICK:                         │
│      Navigate menus                 │
│                                     │
│                                     │
│         [< BACK]    [NEXT >]        │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 2: Coins
```
┌─────────────────────────────────────┐
│        HOW TO PLAY - 2/5            │
├─────────────────────────────────────┤
│                                     │
│        💰 COLLECT COINS             │
│                                     │
│   🐕 $BONK: 5 points (40%)          │
│   🟣 $AOL: 10 points (30%)          │
│      → 3x = Buyback Mode 🧲         │
│                                     │
│   💵 $USD1: 2 points (20%)          │
│                                     │
│   🍔 $BURGER: 25 points (10%)       │
│      → 5x = Score Multiplier        │
│                                     │
│   🦅 $VALOR: 15 points (15%)        │
│      → Premium coin                 │
│                                     │
│         [< BACK]    [NEXT >]        │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 3: Power-Ups
```
┌─────────────────────────────────────┐
│        HOW TO PLAY - 3/5            │
├─────────────────────────────────────┤
│                                     │
│        ⚡ POWER-UPS                 │
│                                     │
│   🛡️ America Hat:                   │
│      Shields from 1 hit (8s)        │
│                                     │
│   👁️ Belle MOD:                     │
│      Deletes enemies (8s)           │
│                                     │
│   💨 Bandana:                        │
│      Speed boost + invincible (5s)  │
│                                     │
│   🐂 Vesper:                         │
│      +1 Life + 500 points           │
│      (Spawns every 500 points)      │
│                                     │
│         [< BACK]    [NEXT >]        │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 4: VALOR MODE
```
┌─────────────────────────────────────┐
│        HOW TO PLAY - 4/5            │
├─────────────────────────────────────┤
│                                     │
│    ⚡🦅 VALOR MODE 🦅⚡               │
│                                     │
│   Collect Gold Feather (5% drop)   │
│                                     │
│   EFFECTS (15 seconds):             │
│   ✨ Turn into GOLD EAGLE           │
│   🛡️ Invincible                     │
│   🚀 Speed x6                       │
│   💰 Coins spawn x10 faster         │
│   💯 Score x3 multiplier            │
│                                     │
│   Cooldown: 60 seconds              │
│                                     │
│   The ultimate power moment!        │
│                                     │
│         [< BACK]    [NEXT >]        │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 5: Gegner
```
┌─────────────────────────────────────┐
│        HOW TO PLAY - 5/5            │
├─────────────────────────────────────┤
│                                     │
│        👾 AVOID ENEMIES             │
│                                     │
│   🤡 Jeeter: Paper hands seller     │
│   👋 Paper Pete: Drops fake coins   │
│   📉 Red Candles: Market crash      │
│   🧑‍💼 Gary (SEC): Lawsuit papers    │
│   🐻 Bear Boss: Final challenge     │
│                                     │
│   💔 Each hit = -1 life             │
│   ⚠️ Fake coins = -1 life           │
│                                     │
│   SURVIVE AS LONG AS POSSIBLE!      │
│                                     │
│         [< BACK]    [DONE]          │
│                                     │
└─────────────────────────────────────┘
```

### Navigation:
- **< BACK**: Vorherige Seite
- **NEXT >**: Nächste Seite
- **DONE**: Zurück zum Hauptmenü
- **ESC**: Zurück zum Hauptmenü

---

## 2.6 LeaderboardScene

### Layout:
```
┌─────────────────────────────────────┐
│      🏆 HALL OF DEGENS              │
├─────────────────────────────────────┤
│                                     │
│   RANK  NAME          SCORE         │
│   ───────────────────────────       │
│   🥇 1.  EAGLE_GOD    15,420        │
│   🥈 2.  DIAMOND_HANDS 12,850       │
│   🥉 3.  WAGMI_KING   10,200        │
│   4.     HODL_MASTER   8,950        │
│   5.     MOON_SHOT     7,600        │
│   6.     DEGEN_LORD    6,420        │
│   7.     APE_STRONG    5,800        │
│   8.     PUMP_IT       5,200        │
│   9.     TO_THE_MOON   4,850        │
│   10.    BULLISH_AF    4,200        │
│                                     │
│   YOUR BEST: 2,450 (Rank #42)      │
│                                     │
│         [🔄 REFRESH]                │
│         [⬅️ BACK TO MENU]           │
│                                     │
└─────────────────────────────────────┘
```

### Elemente:

**Titel**:
- Text: "🏆 HALL OF DEGENS"
- Font: Arial Bold, 48px
- Farbe: Gold (#FBB13C)
- Stroke: Schwarz, 4px

**Leaderboard-Tabelle**:
- Header: "RANK | NAME | SCORE"
- Font: Arial, 24px
- Top 3 Highlights:
  - 🥇 Platz 1: Gold
  - 🥈 Platz 2: Silber
  - 🥉 Platz 3: Bronze

**Deine Position**:
- Text: "YOUR BEST: {score} (Rank #{rank})"
- Font: Arial Bold, 20px
- Farbe: Grün wenn Top 10, Weiß sonst

**Buttons**:
- 🔄 REFRESH: Lädt Leaderboard neu
- ⬅️ BACK: Zurück zum Hauptmenü

### Musik:
- Track: "Hall of Degens Theme.mp3"
- Loop: Ja
- Volume: 0.6

---

## 2.7 CreditsScene

### Layout:
```
┌─────────────────────────────────────┐
│           ℹ️ CREDITS                │
├─────────────────────────────────────┤
│                                     │
│   🦅 EAGLE OF FUN                   │
│                                     │
│   Made with ❤️ by America.Fun       │
│                                     │
│   ─────────────────────             │
│                                     │
│   GAME DESIGN:                      │
│   America.Fun Team                  │
│                                     │
│   DEVELOPMENT:                      │
│   Claude & Development Team         │
│                                     │
│   ART & SPRITES:                    │
│   Pixel Art Team                    │
│                                     │
│   MUSIC & SOUND:                    │
│   Licensed Audio Assets             │
│                                     │
│   TESTING:                          │
│   Community Champions               │
│                                     │
│   ─────────────────────             │
│                                     │
│   Special Thanks:                   │
│   • Ogle - Mascot & Guide           │
│   • Vesper0x - Bull Market Spirit   │
│   • Κρόνος Belle - MOD Queen        │
│   • All $AOL Holders                │
│                                     │
│   Version: 2.0.0                    │
│   Built with Phaser 3               │
│                                     │
│         [⬅️ BACK TO MENU]           │
│                                     │
└─────────────────────────────────────┘
```

### Links:
- Website: america.fun
- Twitter: @AmericaDotFun
- GitHub: [Repository Link]

---

## 2.8 GameOverScene

### Layout:
```
┌─────────────────────────────────────┐
│                                     │
│          💀 GAME OVER               │
│                                     │
│    ─────────────────────────        │
│                                     │
│         FINAL SCORE                 │
│            2,450                    │
│                                     │
│         HIGH SCORE                  │
│            5,820                    │
│                                     │
│    ─────────────────────────        │
│                                     │
│    📊 STATS:                        │
│    Time Survived: 3:42              │
│    Coins Collected: 85              │
│    Longest Combo: 8x                │
│    Enemies Dodged: 156              │
│    Level Reached: 3                 │
│                                     │
│    🏆 ACHIEVEMENTS:                 │
│    ✅ First 100 Points              │
│    ✅ Combo Master (5x)             │
│    ❌ Survive 5 Minutes             │
│                                     │
│    ─────────────────────────        │
│                                     │
│       [🔄 RETRY]  [🏠 MENU]         │
│                                     │
└─────────────────────────────────────┘
```

### Elemente:

**Game Over Text**:
- Text: "💀 GAME OVER"
- Font: Arial Bold, 56px
- Farbe: Rot (#E63946)
- Animation: Fade in mit Scale

**Final Score**:
- Label: "FINAL SCORE"
- Score: {score}
- Font: Arial Bold, 48px
- Farbe: Weiß
- Animation: Count-up von 0

**High Score**:
- Label: "HIGH SCORE"
- Score: {highScore}
- Font: Arial, 32px
- Farbe: Gold wenn neuer Record, Weiß sonst

**Stats**:
- Zeit: Format "M:SS"
- Coins: Anzahl gesammelt
- Combo: Längste erreicht
- Enemies: Anzahl ausgewichen
- Level: Höchstes erreichtes Level

**Achievements** (wenn freigeschaltet):
- ✅ Grün wenn erreicht
- ❌ Grau wenn nicht erreicht
- Liste der erreichten Meilensteine

**Buttons**:
- 🔄 RETRY: Neustart (zu IntroScene)
- 🏠 MENU: Hauptmenü (zu StartScene)

### Sounds:
- Crash-Sound beim Anzeigen
- Game Over Music: "Game Over, America.Fun.mp3"

---

# 3. Komplette UI-Elemente

## 3.1 Alle Text-Styles

### Titel (Large):
```typescript
{
  fontSize: '72px',
  fontFamily: 'Arial',
  fontStyle: 'bold',
  color: '#E63946',
  stroke: '#FFFFFF',
  strokeThickness: 6
}
```

### Untertitel (Medium):
```typescript
{
  fontSize: '48px',
  fontFamily: 'Arial',
  fontStyle: 'bold',
  color: '#0033A0',
  stroke: '#FFFFFF',
  strokeThickness: 4
}
```

### HUD-Text (Standard):
```typescript
{
  fontSize: '28px',
  fontFamily: 'Arial',
  fontStyle: 'bold',
  color: '#FFFFFF',
  stroke: '#000000',
  strokeThickness: 4,
  shadow: {
    offsetX: 2,
    offsetY: 2,
    color: 'rgba(0,0,0,0.7)',
    blur: 3,
    fill: true
  }
}
```

### Button-Text:
```typescript
{
  fontSize: '32px',
  fontFamily: 'Arial',
  fontStyle: 'bold',
  color: '#FFFFFF',
  stroke: '#000000',
  strokeThickness: 3
}
```

### Coin-Counter-Text:
```typescript
{
  fontSize: '18px',
  fontFamily: 'Arial',
  color: '#FFFFFF',
  stroke: '#000000',
  strokeThickness: 2
}
```

### Mission-Text:
```typescript
{
  fontSize: '17px',
  fontFamily: 'Arial',
  fontStyle: 'bold',
  color: '#FFFFFF',
  shadow: {
    offsetX: 1,
    offsetY: 1,
    color: 'rgba(0,0,0,0.6)',
    blur: 2,
    fill: true
  }
}
```

### VALOR MODE Text:
```typescript
{
  fontSize: '48px',
  fontFamily: 'Arial',
  fontStyle: 'bold',
  color: '#FFD700',
  stroke: '#000000',
  strokeThickness: 6,
  shadow: {
    offsetX: 0,
    offsetY: 0,
    color: '#FFD700',
    blur: 20,
    fill: true
  }
}
```

---

## 3.2 Alle Overlay-Nachrichten

### Format:
Zentriert auf dem Bildschirm, temporär eingeblendet

### Power-Up Aktivierungen:

**Buyback Mode**:
```
🧲 BUYBACK MODE!
COINS FLY TO YOU!
```
- Farbe: #FFD94A (Gold)
- Größe: 26px
- Dauer: 1.5s

**Shield**:
```
🇺🇸 AMERICA HAT PROTECTION ACTIVATED!
```
- Farbe: #FF2D2D (Rot)
- Größe: 26px
- Dauer: 1.5s

**Belle MOD**:
```
👁️ ΚΡΌΝΟΣ BELLE IS WATCHING
FUD DELETED!
```
- Farbe: #FFD700 (Gold)
- Größe: 26px
- Dauer: 1.5s

**Solana Surge**:
```
⚡ SOLANA SURGE!
SPEED BOOST ACTIVE!
```
- Farbe: #A020F0 (Lila)
- Größe: 26px
- Dauer: 1.5s

**Speed Boost**:
```
💨 SPEED BOOST!
LIGHTSPEED MODE!
```
- Farbe: #FFD94A (Gold)
- Größe: 26px
- Dauer: 1.5s

**Vesper's Blessing**:
```
🐂 VESPER'S BLESSING!
+1 LIFE | +500 Points
```
- Farbe: #FFD94A (Gold)
- Größe: 26px
- Dauer: 1.5s

**VALOR MODE**:
```
⚡🦅 VALOR MODE ACTIVATED! 🦅⚡
INVINCIBLE | SPEED x6 | COINS x10
SCORE x3
```
- Farbe: #FFD700 (Gold)
- Größe: 32px
- Dauer: 2.5s

**VALOR MODE Ende**:
```
VALOR MODE ENDED
```
- Farbe: #FFD700 (Gold)
- Größe: 26px
- Dauer: 1.5s

### Combo-Nachrichten:

**Combo erreicht**:
```
COMBO x{number}!
```
- Farbe: #FBB13C (Gold)
- Größe: 32px
- Dauer: 1s
- Ab Combo 3+

### Mission Complete:

```
MISSION COMPLETE!
{Mission Title}
+{xp} XP
```
- Farbe: #FFD700 (Gold)
- Größe: 32px
- Dauer: 2s
- Mit Coin-Rain-Effekt

### Level Up:

```
🎊 LEVEL UP! 🎊
LEVEL {level}
{Tier Name}
```
- Farbe: #FFD700 (Gold)
- Größe: 36px
- Dauer: 2s
- Mit Konfetti-Effekt

### Coin-Sammeln Feedback:

```
{COIN_NAME} +{points}
```
Beispiele:
- "$BONK +5" (Orange #FF6B00)
- "$AOL +10" (Lila #9370DB)
- "$USD1 +2" (Grün #4CAF50)
- "$BURGER +25" (Gold #FBB13C)
- "$VALOR +15" (Gold #FFD700)

- Größe: 32px
- Dauer: 1s
- Animation: Schwebt nach oben, faded aus

---

# 4. Alle Spielmechaniken

## 4.1 Bewegungssteuerung

### Flügelschlag (Tap):
**Input**: SPACE (< 300ms)

**Effekte**:
- Eagle Y-Velocity: -600 (GameConfig.flapVelocity)
- Sound: "wing-flap.mp3" (Volume 0.5)
- Animation: Wechsel zu "eagle_dive" für 200ms
- Tilt: Angle -15° für 100ms (yoyo)
- Sprite: ScaleY 0.20 squeeze (100ms, yoyo)

### Gleitflug (Hold):
**Input**: SPACE (≥ 300ms gehalten)

**Effekte**:
- Eagle X-Position: +300px nach rechts (400ms smooth)
- Eagle Angle: -25° (200ms)
- Sound: "whoosh.mp3" (Volume 0.4)
- Dauer: Solange SPACE gehalten

**Bei Loslassen**:
- Eagle X-Position: Zurück zur Original-Position (300ms)
- Eagle Angle: 0° (200ms)

### Idle-Animation (Passiv):
**Immer aktiv**:
- Y-Bobbing: ±2px (800ms, loop)
- Rotation: ±2° (1500ms, loop)
- Ease: Sine.easeInOut

### Gravitation:
- Konstante Gravity: 800 (GameConfig.gravity)
- Eagle fällt wenn keine Eingabe

---

## 4.2 Collision-System

### Coin-Collision:
**Detection**: Distance < 80px

**Ablauf**:
1. Coin wird "collected" markiert
2. Sound: "coin-collect.mp3" (Volume 0.4)
3. Punkte werden berechnet:
   - Base Points von Coin-Typ
   - × Combo-Multiplikator
   - × Burger Multiplier (wenn aktiv)
   - × Bull Market (wenn aktiv)
   - × Eagle Mode (wenn aktiv)
   - × VALOR MODE (wenn aktiv)
4. Score wird aktualisiert
5. Counter wird erhöht
6. Feedback-Text erscheint: "{NAME} +{points}"
7. Combo-System wird aktualisiert
8. Special Effects:
   - VALOR: 8 goldene Partikel (radial)
   - Andere: Standard-Disappear

**Animation**:
- Coin: Scale 1.5, Alpha 0 (200ms)
- Feedback: Schwebt +80px hoch, faded aus (1000ms)

### Enemy-Collision:
**Detection**: Distance < 60px

**Wenn Shield/Belle MOD aktiv**:
- Enemy wird zerstört
- Kein Schaden
- Feedback: "BLOCKED!" oder "DELETED!"
- Sound: "explosion.mp3"

**Wenn kein Schutz**:
1. Invincibility-Check (nach letztem Hit?)
2. Wenn vulnerabel:
   - Leben -1
   - Eagle.playHitAnimation() (Blink)
   - Sound: "crash.mp3" (Volume 0.5)
   - Invincibility: 2 Sekunden
   - Camera Shake: 300ms, Intensity 0.01
   - Herzen-Update im HUD
3. Wenn Leben = 0:
   - gameOver()

### Fake Coin Collision:
**Detection**: Distance < 80px

**Wenn Shield/Belle MOD aktiv**:
- Fake Coin zerstört
- Feedback: "BLOCKED!" oder "DELETED!"
- Kein Schaden

**Wenn kein Schutz**:
1. Leben -1
2. Feedback: "FAKE!" (rot, groß)
3. Screen Shake: 400ms, Intensity 0.01
4. Sound: "crash.mp3"
5. Fake Coin verschwindet
6. Wenn Leben = 0: gameOver()

### Lawsuit Paper Collision:
**Detection**: Distance < 60px

**Effekt**:
- Control Block: 2 Sekunden
- Keine Steuerung möglich
- Visual: Paper-Icon auf Eagle
- Kein Lebensverlust

### Power-Up Collision:
**Detection**: Distance < 70px

**Ablauf**:
1. Power-Up wird zerstört
2. Entsprechende activate-Funktion wird aufgerufen
3. Sound je nach Typ
4. Overlay-Message
5. Icon im HUD erscheint

---

## 4.3 Spawn-System

### Coin-Spawn:
**Timer**: Alle 1500ms (Base)

**VALOR MODE**: Alle 150ms (10× schneller)

**Spawn-Position**:
- X: Screen Width + 100
- Y: Random zwischen 150 und (Height - 150)

**Spawn-Wahrscheinlichkeiten**:
```typescript
const roll = Random(1, 100);

if (roll <= 40) {
  spawn('$BONK'); // 1-40
} else if (roll <= 70) {
  spawn('$AOL'); // 41-70
} else if (roll <= 90) {
  spawn('$USD1'); // 71-90
} else if (roll <= 105) {
  spawn('$VALOR'); // 91-105 (mit Wrapping)
} else {
  spawn('$BURGER'); // 106-100 (Restliche)
}
```

**Coin-Properties**:
- Container mit Image
- Rotation: 360° (3000ms, loop)
- Movement: Scroll nach links (coinSpeed)
- Destruction: Bei X < -100

**Scale-Größen**:
- $BONK: 0.12
- $AOL: 0.16 (größer, wichtiger)
- $USD1: 0.12
- $BURGER: 0.12
- $VALOR: 0.18 (größter)

### Enemy-Spawn:
**Timer**: Variabel je nach Phase

**Phase-Spawn-Rates**:
- Phase 1: 3500ms
- Phase 2: 3000ms
- Phase 3: 2500ms
- Phase 4: 2200ms
- Phase 5: 1800ms
- Phase 6: 1500ms

**Spawn-Position**:
- X: Screen Width + 100
- Y: Random zwischen 100 und (Height - 100)
- Alternativ: Oben, Mitte, Unten (je nach Typ)

**Enemy-Types nach Phase**:
- Phase 1: Jeeter
- Phase 2: Jeeter, Paper Hands
- Phase 3: +Red Candles, +Pump.fun
- Phase 4: +Gary, +Four.meme
- Phase 5: +Bear Boss
- Phase 6: Alle

**Enemy-Bewegung**:
- Linear: Konstante Geschwindigkeit nach links
- Wave: Sinuswelle (Y-Achse)
- Dive: Warten → Schnell runter
- Hover: Folgt Eagle Y-Position
- Zigzag: Scharf hoch/runter alternierend

**Special Behaviors**:
- Paper Hands: Spawnt Fake Coins (alle 2-4s)
- Gary: Wirft Lawsuit Papers (alle 3-5s)
- Pump.fun: Dash-Boost (30% Chance)
- Four.meme: Spawnt in Paaren (150px Y-Offset)
- Bear Boss: Roar-Effekt (alle 15s)

### Power-Up Spawn:
**Timer**: Alle 15 Sekunden

**Gold Feather (VALOR MODE)**:
- Chance: 5%
- Nur wenn VALOR MODE nicht aktiv
- Nur wenn kein Cooldown läuft

**Vesper**:
- Special Spawn: Bei Score 500, 1000, 1500...
- Überschreibt normalen Power-Up-Spawn

**Normale Power-Ups**:
Random aus: Shield, Solana Surge, Belle MOD, Lightning, Bandana

**Spawn-Position**:
- X: Screen Width + 100
- Y: Random zwischen 150 und (Height - 150)

**Visual**:
- Glow-Circle (50-60px radius)
- Icon (Image oder Emoji)
- Pulse Animation (Scale 1.0 → 1.1-1.3)
- Für Gold Feather: Extra Sparkle Ring

---

## 4.4 Scoring-System Details

### Basis-Scoring:

**Zeit-Bonus**:
- +1 Punkt pro Sekunde Spielzeit
- Wird im Update-Loop inkrementiert

**Coin-Punkte**:
```typescript
const basePoints = {
  'bonk': 5,
  'aol': 10,
  'usd1': 2,
  'burger': 25,
  'valor': 15
};
```

### Multiplikator-System:

**1. Combo-Multiplikator**:
```typescript
if (timeSinceLastCoin < 1000ms) {
  comboCount++;
  multiplier = comboCount; // 2x, 3x, 4x...
} else {
  comboCount = 0;
  multiplier = 1;
}
```

**2. Burger Multiplier**:
```typescript
if (burgerMultiplierActive) {
  points *= 2;
}
```
Dauer: 5 Sekunden nach 5. Burger

**3. Bull Market (Vesper)**:
```typescript
if (bullMarketActive) {
  points *= 2;
}
```
Dauer: 30 Sekunden

**4. Eagle Mode**:
```typescript
if (eagleModeActive) {
  points *= 3;
}
```
(Special Mode, selten)

**5. VALOR MODE**:
```typescript
if (valorModeActive) {
  points *= 3;
}
```
Dauer: 15 Sekunden

### Berechnung:
```typescript
let finalPoints = basePoints;

// Combo
finalPoints *= comboMultiplier;

// Burger
if (burgerMultiplierActive) {
  finalPoints *= 2;
}

// Bull Market
if (bullMarketActive) {
  finalPoints *= 2;
}

// Eagle Mode
if (eagleModeActive) {
  finalPoints *= 3;
}

// VALOR MODE
if (valorModeActive) {
  finalPoints *= 3;
}

score += finalPoints;
```

**Maximaler Multiplikator**:
Combo 10× × Burger × Bull × Eagle × VALOR
= 10 × 2 × 2 × 3 × 3 = **360×**

Beispiel mit $BURGER (25 Punkte):
25 × 360 = **9,000 Punkte** für einen Coin!

---

## 4.5 Combo-System

### Mechanik:
```typescript
private comboCount: number = 0;
private lastCoinTime: number = 0;
private comboWindow: number = 1000; // ms
```

### Ablauf beim Coin-Sammeln:
```typescript
const currentTime = Date.now();
const timeSinceLastCoin = currentTime - lastCoinTime;

if (timeSinceLastCoin <= comboWindow && lastCoinTime > 0) {
  // Combo fortsetzen
  comboCount++;

  if (comboCount >= 3) {
    // Zeige Combo-Overlay
    showOverlay(`COMBO x${comboCount}!`);
  }

  // Update Mission: Longest Combo
  if (comboCount > longestCombo) {
    longestCombo = comboCount;
    missionManager.onComboAchieved(comboCount);
  }
} else {
  // Combo unterbrochen
  comboCount = 1;
}

lastCoinTime = currentTime;
```

### Visual Feedback:
- Ab Combo 3+: Overlay-Message
- Combo-Text blinkt/pulsiert
- Farbe: Gold (#FBB13C)
- Animation: Scale Pulse

---

# 5. Coins & Collectibles

## 5.1 Alle Coin-Definitionen

### $BONK (Standard-Coin)
**Visual**:
- Image: bonk-coin.png (Hund-Logo)
- Scale: 0.12
- Farbe: Orange

**Stats**:
- Punkte: 5
- Spawn-Chance: 40%
- Spezial-Effekt: Keine

**Config**:
```typescript
BONK: {
  name: '$BONK',
  description: 'Meme-Dog Token',
  points: 5,
  icon: '🟠',
  spawnChance: 40,
  effect: 'none'
}
```

### $AOL (Combo-Coin)
**Visual**:
- Image: token_aol.png (Lila Token)
- Scale: 0.16 (größer!)
- Farbe: Lila

**Stats**:
- Punkte: 10
- Spawn-Chance: 30%
- Spezial-Effekt: 3× sammeln = Buyback Mode

**Config**:
```typescript
AOL: {
  name: '$AOL',
  description: 'Launchpad-Token',
  points: 10,
  icon: '🟣',
  spawnChance: 30,
  effect: 'buyback_boost',
  comboRequired: 3
}
```

**Combo-Mechanik**:
```typescript
if (type === 'aol') {
  aolCombo++;
  updateAOLCombo(); // HUD: 🇺🇸 {combo}/3

  if (aolCombo >= 3) {
    activateMagnet(); // Buyback Mode!
    aolCombo = 0;
  }
} else {
  aolCombo = 0; // Reset bei anderen Coins
}
```

### $USD1 (Stablecoin)
**Visual**:
- Image: usd1-coin.png (Dollar-Symbol)
- Scale: 0.12
- Farbe: Grün

**Stats**:
- Punkte: 2
- Spawn-Chance: 20%
- Spezial-Effekt: Keine

**Config**:
```typescript
USD1: {
  name: '$USD1',
  description: 'Stablecoin',
  points: 2,
  icon: '💵',
  spawnChance: 20,
  effect: 'none'
}
```

### $BURGER (Multiplier-Coin)
**Visual**:
- Image: Token_Burger.png (Burger-Logo)
- Scale: 0.12
- Farbe: Gold

**Stats**:
- Punkte: 25 (höchste Base-Points!)
- Spawn-Chance: 10%
- Spezial-Effekt: 5× sammeln = Score Multiplier (5s)

**Config**:
```typescript
BURGER: {
  name: '$BURGER',
  description: 'Erster America.Fun-Launch',
  points: 25,
  icon: '🍔',
  spawnChance: 10,
  effect: 'score_multiplier',
  multiplierDuration: 5000 // ms
}
```

**Combo-Mechanik**:
```typescript
if (type === 'burger') {
  burgerCount++;
  burgerCombo++;

  // HUD Update: 🍔 {combo}/5
  updateBurgerCombo();

  if (burgerCombo >= 5) {
    activateBurgerMultiplier(); // × 2 für 5s
    burgerCombo = 0; // Reset
  }
}
```

### $VALOR (Premium-Coin)
**Visual**:
- Image: valorant-coin.png (Gold Eagle Symbol)
- Scale: 0.18 (größter Coin!)
- Farbe: Gold

**Stats**:
- Punkte: 15
- Spawn-Chance: 15%
- Spezial-Effekt: Premium, zählt für Missionen

**Config**:
```typescript
VALOR: {
  name: '$VALOR',
  description: 'Eagle Valor Token',
  points: 15,
  icon: '🦅',
  spawnChance: 15,
  effect: 'valor_mode',
  comboRequired: 5 // Geplant für zukünftiges Feature
}
```

**Collection Effect**:
```typescript
if (type === 'valor') {
  valorCount++;

  // Counter Animation
  tweens.add({
    targets: valorCountText,
    scale: 1.2,
    duration: 100,
    yoyo: true
  });

  // Gold Sparkle Effect
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    spawnGoldParticle(coinX, coinY, angle);
  }
}
```

---

## 5.2 Fake Coins

**Visual**:
- Basiert auf USD1-Coin
- Tint: Grau (0x888888)
- Wobble-Animation (±15°, 300ms, loop)

**Stats**:
- Punkte: -10 (wenn mit Shield gesammelt)
- Leben: -1 (wenn ohne Schutz berührt)

**Spawn**:
- Von Paper Hands Pete gedroppt
- Alle 2-4 Sekunden (während Pete lebt)
- Position: Bei Pete's Position

**Detection**:
- Distance < 80px zu Eagle
- Wenn Shield/Belle aktiv: Blocked
- Wenn nicht: Leben -1, "FAKE!" Message

---

# 6. Power-Ups System

## 6.1 Buyback Mode (🧲 Magnet)

**Auslöser**: 3× $AOL-Coins hintereinander

**Dauer**: 5 Sekunden

**Effekte**:
```typescript
magnetActive = true;
magnetRadius = 400; // Pixel

// Für jeden Coin in Radius:
if (distance(coin, eagle) < magnetRadius) {
  // Bewege Coin zu Eagle
  tweens.add({
    targets: coin,
    x: eagle.x,
    y: eagle.y,
    duration: 200,
    ease: 'Power2'
  });
}
```

**Visuals**:
- Icon oben rechts: 🧲 (48px)
- Timer-Text: "5s", "4s", "3s"...
- Coins fliegen zum Eagle

**Sound**:
- Activation: "buyback-voice.mp3" (Volume 0.9)
- Loop: Keiner

**Overlay**:
```
🧲 BUYBACK MODE!
COINS FLY TO YOU!
```

---

## 6.2 America Hat (🛡️ Shield)

**Auslöser**: Shield Power-Up einsammeln (15% Spawn-Chance)

**Dauer**: 8 Sekunden

**Effekte**:
```typescript
shieldActive = true;

// Blockiert ALLE Schäden:
if (shieldActive) {
  // Kein Leben-Verlust
  // Enemy wird trotzdem zerstört
  return;
}
```

**Visuals**:
- Roter Circle um Eagle (80px radius)
- Rotating Animation (720°/s)
- Pulsierendes Alpha (0.3 → 0.6)
- Icon rechts oben

**Sound**:
- Activation: "shield-activate.mp3"
- Loop: "shield-active-loop.mp3" (leise)

**Overlay**:
```
🇺🇸 AMERICA HAT PROTECTION ACTIVATED!
```

---

## 6.3 Belle MOD (👁️)

**Auslöser**: Belle MOD Power-Up einsammeln (12% Spawn-Chance)

**Dauer**: 8 Sekunden

**Effekte**:
```typescript
belleModActive = true;

// Blockiert alle Hits wie Shield
// Plus: Löscht Enemies bei Berührung

if (enemyCollision && belleModActive) {
  enemy.destroy();
  showFeedback("DELETED!");
}
```

**Visuals**:
- Belle-Sprite folgt Eagle
- Belle-Sprite Position: (eagle.x + 50, eagle.y - 30)
- Golden Aura um Belle
- Icon rechts oben

**Sound**:
- Activation: "belle-collect.mp3" (Volume 0.8)

**Overlay**:
```
👁️ ΚΡΌΝΟΣ BELLE IS WATCHING
FUD DELETED!
```

---

## 6.4 Solana Surge (⚡)

**Auslöser**: Lightning Power-Up einsammeln

**Dauer**: 4 Sekunden

**Effekte**:
```typescript
solanaSurgeActive = true;
speedBoost = 1.5;
jumpBoost = 1.3;

// Flap wird stärker
const boostedVelocity = flapVelocity * jumpBoost;
```

**Visuals**:
- Lightning-Icon rechts oben: ⚡ (48px)
- Sprite leicht gelblich getinted
- Speed-Lines hinter Eagle

**Sound**:
- Activation: "lightning.mp3" (Volume 0.7)

**Overlay**:
```
⚡ SOLANA SURGE!
SPEED BOOST ACTIVE!
```

---

## 6.5 Speed Boost (💨 Bandana)

**Auslöser**: Bandana Power-Up einsammeln

**Dauer**: 5 Sekunden

**Effekte**:
```typescript
speedBoostActive = true;
isInvincible = true;

coinSpeed *= 2.5;
enemySpeed *= 2.5;
```

**Visuals**:
- Bandana-Sprite auf Eagle-Kopf
- Position: (eagle.x, eagle.y - 30)
- Scale: 0.15
- Speed Trail hinter Eagle (Graphics, faded lines)

**Sound**:
- Activation: "whoosh.mp3" (Volume 0.8)
- Screen Shake: 500ms, Intensity 0.005

**Overlay**:
```
💨 SPEED BOOST!
LIGHTSPEED MODE!
```

---

## 6.6 Vesper's Blessing (🐂)

**Auslöser**: Spawnt automatisch bei Score 500, 1000, 1500...

**Effekte**:
```typescript
// Bei Collection:
addLife(); // +1 Leben (max 5)
score += 500;
bullMarketActive = true; // 30s Score × 2

setTimeout(() => {
  bullMarketActive = false;
}, 30000);
```

**Visuals**:
- Vesper-Icon: vesper0x.png
- Scale: 0.2
- Golden Glow (größer als andere Power-Ups)
- Pulse Animation: Scale 1.2 → 1.4

**Sound**:
- Activation: "belle-collect.mp3" (Volume 0.8)

**Overlay**:
```
🐂 VESPER'S BLESSING!
+1 LIFE | +500 Points
```

---

## 6.7 Lightning Bolt (⚡ Special)

**Auslöser**: Lightning Power-Up einsammeln

**Effekt**: Zerstört ALLE Enemies auf dem Screen

**Ablauf**:
```typescript
private activateLightningBolt(): void {
  // Visual: Blitz-Effekte über ganzen Screen
  for (let i = 0; i < 5; i++) {
    const x = Phaser.Math.Between(0, width);
    spawnLightningBolt(x, 0, x, height);
  }

  // Zerstöre alle Enemies
  enemies.forEach(enemy => {
    if (enemy.active) {
      enemy.destroy();
      spawnExplosion(enemy.x, enemy.y);
    }
  });

  // Sound & Shake
  sound.play('lightning');
  cameras.main.shake(500, 0.015);
}
```

**Visuals**:
- Blitz-Linien von oben nach unten
- Explosionen bei jedem Enemy
- Screen Flash (weiß)
- Screen Shake

**Sound**:
- "lightning.mp3" (Volume 0.8)
- "explosion.mp3" für jeden Enemy

---

## 6.8 VALOR MODE (⚡🦅 Ultimate)

**Auslöser**: Gold Feather einsammeln (5% Power-Up Chance)

**Verfügbarkeit**:
- Nur wenn nicht bereits aktiv
- Nur wenn kein Cooldown (60s) läuft

**Dauer**: 15 Sekunden

### Effekte:

#### 1. Gold Eagle Sprite
```typescript
eagle.switchToGoldSprite();
// Texture: 'eagle-gold'
// Animation: 'eagle_gold_fly' (8 fps)
// Tint: 0xFFD700
// Scale: 0.30 → 0.35
```

#### 2. Unverwundbarkeit
```typescript
isInvincible = true;
eagle.setInvincible(true);
```

#### 3. Speed × 6
```typescript
const originalCoinSpeed = coinSpeed;
const originalEnemySpeed = enemySpeed;

coinSpeed *= 6;
enemySpeed *= 6;
```

#### 4. Coin Spawn × 10
```typescript
// Normal: 1500ms
// VALOR MODE: 150ms

coinSpawnTimer.delay = 150;
```

#### 5. Score × 3
```typescript
valorScoreMultiplier = 3;

// In Scoring-Berechnung:
if (valorModeActive) {
  finalPoints *= valorScoreMultiplier;
}
```

#### 6. Goldene Aura
```typescript
// 8 Particle Emitters rund um Eagle
for (let i = 0; i < 8; i++) {
  const angle = (360 / 8) * i;

  const particles = this.add.particles(0, 0, 'coin-valor', {
    speed: { min: 20, max: 50 },
    scale: { start: 0.15, end: 0 },
    alpha: { start: 0.8, end: 0 },
    lifespan: 800,
    frequency: 50,
    angle: { min: angle - 20, max: angle + 20 },
    tint: 0xFFD700,
    blendMode: 'ADD'
  });

  particles.setDepth(1499);
  valorAuraParticles.push(particles);
}

// Update: Folgen Eagle-Position
valorAuraParticles.forEach(emitter => {
  emitter.setPosition(eagle.x, eagle.y);
});
```

#### 7. Screen Glow
```typescript
valorScreenGlow = this.add.graphics();
valorScreenGlow.setDepth(9999);

// Goldener Vignette-Effekt
valorScreenGlow.fillStyle(0xFFD700, 0.15);
valorScreenGlow.fillRect(0, 0, width, height);

// Pulsing Animation
tweens.add({
  targets: valorScreenGlow,
  alpha: 0.3,
  duration: 1000,
  yoyo: true,
  repeat: -1,
  ease: 'Sine.easeInOut'
});
```

#### 8. HUD
```typescript
valorModeText = this.add.text(width / 2, 150, 'VALOR MODE', {
  fontSize: '48px',
  color: '#FFD700',
  fontFamily: 'Arial',
  fontStyle: 'bold',
  stroke: '#000000',
  strokeThickness: 6,
  shadow: {
    offsetX: 0,
    offsetY: 0,
    color: '#FFD700',
    blur: 20,
    fill: true
  }
});

// Pulsing
tweens.add({
  targets: valorModeText,
  scale: 1.1,
  duration: 500,
  yoyo: true,
  repeat: -1,
  ease: 'Sine.easeInOut'
});
```

### Visuals:
- **Overlay**:
```
⚡🦅 VALOR MODE ACTIVATED! 🦅⚡
INVINCIBLE | SPEED x6 | COINS x10
SCORE x3
```
- **Camera Shake**: 800ms, Intensity 0.008
- **Flash**: Gold (255, 215, 0), 500ms

### Sound:
- "buyback-voice.mp3" (Volume 0.9)

### Deaktivierung (nach 15s):
```typescript
// Eagle zurück zu Normal
eagle.switchToNormalSprite();
eagle.setInvincible(false);
isInvincible = false;

// Speed zurück
coinSpeed = originalCoinSpeed;
enemySpeed = originalEnemySpeed;

// Coin Spawn zurück
coinSpawnTimer.delay = 1500;

// Partikel entfernen
valorAuraParticles.forEach(emitter => {
  emitter.stop();
  emitter.remove();
});
valorAuraParticles = [];

// Screen Glow ausblenden
tweens.add({
  targets: valorScreenGlow,
  alpha: 0,
  duration: 1000,
  onComplete: () => {
    valorScreenGlow.destroy();
  }
});

// HUD entfernen
valorModeText.destroy();
valorModeBar.destroy();

// Overlay
showOverlay('VALOR MODE ENDED', '#FFD700');

// Cooldown starten (60s)
valorModeCooldown = true;
setTimeout(() => {
  valorModeCooldown = false;
}, 60000);
```

### Gold Feather Spawn:
```typescript
private spawnGoldFeather(y: number): void {
  const powerup = this.add.container(width + 100, y);

  // Feather Icon
  const feather = this.add.image(0, 0, 'gold-feather');
  feather.setScale(0.12);

  // Gold Glow
  const glow = this.add.graphics();
  glow.fillStyle(0xFFD700, 0.5);
  glow.fillCircle(0, 0, 40);

  // Sparkle Ring
  const sparkleRing = this.add.graphics();
  sparkleRing.lineStyle(2, 0xFFD700, 0.8);
  sparkleRing.strokeCircle(0, 0, 50);

  powerup.add([sparkleRing, glow, feather]);
  powerup.setData('type', 'goldFeather');
  powerup.setSize(100, 100);

  // Epic Pulse
  tweens.add({
    targets: powerup,
    scale: 1.2,
    duration: 600,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });

  // Rotating Sparkle
  tweens.add({
    targets: sparkleRing,
    angle: 360,
    duration: 3000,
    repeat: -1
  });
}
```

---

# 7. Gegner & Feinde

## 7.1 Phase-System

### Phasen-Übersicht:
```typescript
const phases = [
  {
    id: 1,
    name: 'Soft Launch 🚀',
    duration: 60, // Sekunden
    enemies: ['jeeter'],
    speedMultiplier: 1.3,
    spawnRate: 3500 // ms
  },
  {
    id: 2,
    name: 'Paper Panic 👋',
    duration: 60,
    enemies: ['jeeter', 'paperHands'],
    speedMultiplier: 1.5,
    spawnRate: 3000
  },
  {
    id: 3,
    name: 'Candle Crash 📉',
    duration: 60,
    enemies: ['jeeter', 'paperHands', 'redCandles', 'pumpFun'],
    speedMultiplier: 1.7,
    spawnRate: 2500
  },
  {
    id: 4,
    name: 'Regulation Run 🧑‍💼',
    duration: 60,
    enemies: ['jeeter', 'paperHands', 'redCandles', 'gary', 'pumpFun', 'fourMeme'],
    speedMultiplier: 1.9,
    spawnRate: 2200
  },
  {
    id: 5,
    name: 'Bear Market Finale 🐻',
    duration: 60,
    enemies: ['jeeter', 'paperHands', 'redCandles', 'gary', 'bearBoss', 'pumpFun', 'fourMeme'],
    speedMultiplier: 2.1,
    spawnRate: 1800
  },
  {
    id: 6,
    name: 'WAGMI Mode 🦅',
    duration: -1, // Endless
    enemies: ['jeeter', 'paperHands', 'redCandles', 'gary', 'bearBoss', 'pumpFun', 'fourMeme'],
    speedMultiplier: 2.3,
    spawnRate: 1500
  }
];
```

---

## 7.2 Alle Gegner-Definitionen

### Jeeter (🤡)
**Phase**: 1+

**Visual**:
- Image: jeet.png
- Scale: 0.22
- Hitbox: 100×100

**Bewegung**:
- Pattern: Linear (horizontal)
- Speed: 250
- Keine Spezial-Bewegung

**Memes** (Random bei Spawn):
- "I sold the top!"
- "Exit liquidity secured! 📉"
- "Paper hands forever!"
- "Took profits at -80%"
- "Should have held... nah! 🏃"

**Verhalten**:
- Fliegt von rechts nach links
- Konstante Geschwindigkeit
- Keine Special-Attacks

---

### Paper Hands Pete (👋)
**Phase**: 2+

**Visual**:
- Image: PaperHands-Pixel.png
- Scale: 0.18
- Hitbox: 85×85

**Bewegung**:
- Pattern: Wave (Sinuswelle)
- Speed: 200
- Wave Amplitude: 40px
- Wave Frequency: 0.003

**Memes**:
- "Nooo I panic sold!"
- "It was going to zero!"
- "Buy high, sell low! 📉"
- "Weak hands activated!"
- "I believed the FUD! 😱"

**Special Behavior**:
- Droppt Fake Coins
- Frequenz: Alle 2-4 Sekunden
- Bei Tod: Droppt 1-2 echte Coins

**Fake Coin**:
- Penalty: -10 Punkte (wenn mit Shield)
- Visual: Grau getönter USD1-Coin
- Animation: Wobble (±15°)

---

### Red Candles (📉)
**Phase**: 3+

**Visual**:
- Image: redcandles-pixel.png
- Scale: 0.25
- Hitbox: 50×150 (vertikal!)

**Bewegung**:
- Pattern: Dive (Wartet, dann stürzt ab)
- Dive Delay: 1000ms
- Dive Speed: 600
- Normal Speed: 180

**Memes**:
- "Market Dump Incoming 🚨"
- "Red candles everywhere!"
- "Support? What support? 📉"
- "Liquidation cascade! 🔴"
- "The dump never ends!"

**Special Behavior**:
- Wartet kurz nach Spawn
- Dann schneller Dive nach unten
- Bei Tod: Spawnt Flame Particles (5× rot)

---

### Gary (SEC) (🧑‍💼)
**Phase**: 4+

**Visual**:
- Image: gary-pixel.png
- Scale: 0.22
- Hitbox: 90×100

**Bewegung**:
- Pattern: Hover (folgt Eagle Y-Position)
- Hover Speed: 150
- Normal Speed: 220

**Memes**:
- "Unregistered Security!"
- "Compliance needed! 📄"
- "You have been served!"
- "Regulations incoming!"
- "Lawsuit party! 🧑‍💼"

**Special Behavior**:
- Wirft Lawsuit Papers
- Frequenz: Alle 3-5 Sekunden
- Papers blockieren Steuerung für 2s

**Lawsuit Paper**:
- Visual: Weißes Rechteck (40×60)
- Speed: 300 (langsamer als Gary)
- Effect: Control Block (2000ms)
- Kein Lebensverlust

---

### Bear Market Boss (🐻)
**Phase**: 5+

**Visual**:
- Image: bearmarket-pixel.png
- Scale: 0.35 (groß!)
- Hitbox: 180×180

**Bewegung**:
- Pattern: Wave (langsam, bedrohlich)
- Speed: 150
- Wave Amplitude: 60px
- Wave Frequency: 0.002

**Memes**:
- "SELL! SELL! SELL!"
- "Bear market forever! 🐻"
- "Winter is here!"
- "Hope? Not allowed!"
- "Capitulation time! 📉"

**Special Behavior**:
- **Roar-Effekt** alle 15 Sekunden:
  - Screen Shake: 1000ms, Intensity 0.02
  - Slow-Motion-Effekt (optional)
  - Sound: Tiefes Brüllen

**Boss Flag**:
- `isBoss: true`
- Mehr Leben / schwerer zu zerstören

---

### Pump.fun (💊)
**Phase**: 3+

**Visual**:
- Image: pumpfun-pixel.png
- Scale: 0.2
- Hitbox: 95×95

**Bewegung**:
- Pattern: Wave
- Speed: 230
- Wave Amplitude: 35px
- Wave Frequency: 0.004

**Memes**:
- "Mint. Dump. Repeat. 💊"
- "We print, you cope. 💊"
- "Too early? Never heard of it. 💊"
- "Devs still minting... probably. 💊"
- "Low effort, high volume. 💊"
- "Launched before coffee. 💊"
- "Liquidity? Optional. 💊"

**Special Behavior**:
- **Boost Dash**: 30% Chance bei Spawn
- Wenn aktiv:
  - Speed × 2.17 (500 statt 230)
  - Duration: 800ms
  - Visual: Speed-Lines

---

### Four.meme (🤡)
**Phase**: 4+

**Visual**:
- Image: fourmeme-pixel.png
- Scale: 0.19
- Hitbox: 90×90

**Bewegung**:
- Pattern: Zigzag (scharfe Kurven)
- Speed: 240
- Zigzag Amplitude: 50px
- Zigzag Frequency: 0.005

**Memes**:
- "Copy. Paste. Rug. 🤡"
- "Fork it till you make it. 🤡"
- "Original? Never heard of it. 🤡"
- "100% same vibe, 0% innovation. 🤡"
- "Made in five minutes. 🤡"
- "AI said it's different. 🤡"
- "Derivative enjoyer. 🤡"

**Special Behavior**:
- **Spawnt in Paaren**
- Pair Offset: 150px Y-Distance
- Beide Four.meme bewegen sich synchron

---

## 7.3 Enemy-Movement-Patterns

### Linear (Basic):
```typescript
enemy.x -= enemySpeed * delta;
```

### Wave (Sinuswelle):
```typescript
const baseY = enemy.getData('baseY');
const time = Date.now();

enemy.y = baseY + Math.sin(time * frequency) * amplitude;
enemy.x -= enemySpeed * delta;
```

### Dive (Wartet, dann fällt):
```typescript
const spawnTime = enemy.getData('spawnTime');
const diveStarted = enemy.getData('diveStarted');

if (!diveStarted && (Date.now() - spawnTime > diveDelay)) {
  enemy.setData('diveStarted', true);
}

if (diveStarted) {
  enemy.y += diveSpeed * delta;
}

enemy.x -= enemySpeed * delta;
```

### Hover (Folgt Eagle Y):
```typescript
const targetY = eagle.y;
const currentY = enemy.y;
const difference = targetY - currentY;

// Smooth Follow
enemy.y += difference * hoverSpeed * delta;
enemy.x -= enemySpeed * delta;
```

### Zigzag (Scharf hoch/runter):
```typescript
const baseY = enemy.getData('baseY');
const time = Date.now();

// Sawtooth Wave statt Sine
const zigzag = Math.floor((time * frequency) % 2) === 0 ? 1 : -1;
enemy.y = baseY + (zigzag * amplitude);
enemy.x -= enemySpeed * delta;
```

---

## 7.4 Enemy Death & Effects

### Bei Zerstörung:

**Points Award**:
```typescript
const killPoints = 50; // Base
score += killPoints;
```

**Explosion Effect**:
```typescript
// Particles
for (let i = 0; i < 10; i++) {
  const particle = this.add.circle(
    enemy.x,
    enemy.y,
    5,
    0xFF0000
  );

  const angle = (Math.PI * 2 * i) / 10;
  const speed = 150;

  tweens.add({
    targets: particle,
    x: particle.x + Math.cos(angle) * speed,
    y: particle.y + Math.sin(angle) * speed,
    alpha: 0,
    duration: 500,
    onComplete: () => particle.destroy()
  });
}
```

**Sound**:
- "explosion.mp3" (Volume 0.6)

**Meme-Text verschwindet**:
- Fade out mit Enemy

---

# 8. Missions & Levelsystem

## 8.1 XP-System

### XP-Quellen:

**Coins sammeln**:
- Jeder Coin gibt kleine XP
- Höherwertiger Coin = mehr XP

**Combos**:
- Bonus-XP für Combos
- Je höher Combo, desto mehr Bonus

**Missionen abschließen**:
```typescript
const missions = [
  {
    id: 'collect_50_coins',
    title: 'Collect 50 coins',
    emoji: '🎯',
    target: 50,
    reward: { xp: 100 }
  },
  {
    id: 'score_1000',
    title: 'Score 1000 points',
    emoji: '💰',
    target: 1000,
    reward: { xp: 150 }
  },
  {
    id: 'survive_120s',
    title: 'Survive 120 seconds',
    emoji: '⏱️',
    target: 120,
    reward: { xp: 200 }
  }
];
```

### Level-Up:
```typescript
if (xp >= xpToNextLevel) {
  level++;
  xp = xp - xpToNextLevel;
  xpToNextLevel = calculateXPRequired(level);

  // Tier Check
  const newTier = getTierForLevel(level);
  if (newTier !== currentTier) {
    unlockNewTier(newTier);
  }

  // Overlay
  showLevelUpNotification(level);
}
```

### XP Required per Level:
```typescript
function calculateXPRequired(level: number): number {
  return 100 + (level * 50); // Linear scaling
}
```

Beispiele:
- Level 1→2: 100 XP
- Level 2→3: 150 XP
- Level 3→4: 200 XP
- Level 10→11: 500 XP

---

## 8.2 Tier-System

### Tier-Definitionen:

**Rookie** (Level 1-5):
- Basis-Missionen
- Standard-Belohnungen
- Farbe: Weiß

**Explorer** (Level 6-10):
- Mehr Coins spawnen
- Bessere Mission-Rewards
- Farbe: Grün

**Veteran** (Level 11-20):
- Power-Ups häufiger
- Schwierigere Missionen
- Höhere Rewards
- Farbe: Blau

**Master** (Level 21-30):
- Seltene Missionen
- Premium-Rewards
- Farbe: Lila

**Legend** (Level 31+):
- Maximale Rewards
- Spezial-Challenges
- Farbe: Gold

### Tier-Benefits:

```typescript
const tierBenefits = {
  Rookie: {
    coinSpawnRate: 1.0,
    powerUpChance: 1.0,
    xpMultiplier: 1.0
  },
  Explorer: {
    coinSpawnRate: 1.1,
    powerUpChance: 1.1,
    xpMultiplier: 1.1
  },
  Veteran: {
    coinSpawnRate: 1.2,
    powerUpChance: 1.25,
    xpMultiplier: 1.2
  },
  Master: {
    coinSpawnRate: 1.3,
    powerUpChance: 1.5,
    xpMultiplier: 1.5
  },
  Legend: {
    coinSpawnRate: 1.5,
    powerUpChance: 2.0,
    xpMultiplier: 2.0
  }
};
```

---

## 8.3 Mission-Types

### Daily Missions (3 aktiv):

**Collection Missions**:
```typescript
{
  id: 'collect_coins',
  type: 'collect',
  title: 'Collect {target} coins',
  emoji: '🎯',
  target: [20, 50, 100], // Steigend
  reward: { xp: [50, 100, 200] }
}
```

**Score Missions**:
```typescript
{
  id: 'reach_score',
  type: 'score',
  title: 'Score {target} points',
  emoji: '💰',
  target: [500, 1000, 2000],
  reward: { xp: [75, 150, 300] }
}
```

**Time Missions**:
```typescript
{
  id: 'survive_time',
  type: 'survival',
  title: 'Survive {target} seconds',
  emoji: '⏱️',
  target: [60, 120, 300],
  reward: { xp: [100, 200, 400] }
}
```

**Combo Missions**:
```typescript
{
  id: 'combo_master',
  type: 'combo',
  title: 'Reach combo of {target}',
  emoji: '🔥',
  target: [3, 5, 10],
  reward: { xp: [50, 100, 250] }
}
```

**Special Coin Missions**:
```typescript
{
  id: 'collect_valor',
  type: 'collect_specific',
  title: 'Collect {target} $VALOR',
  emoji: '🦅',
  target: [5, 10, 25],
  reward: { xp: [100, 200, 500] }
}
```

**Power-Up Missions**:
```typescript
{
  id: 'activate_valor_mode',
  type: 'powerup',
  title: 'Activate VALOR MODE',
  emoji: '⚡',
  target: 1,
  reward: { xp: 500 }
}
```

### Mission-Generation:
```typescript
function generateDailyMissions(level: number): Mission[] {
  const missions: Mission[] = [];
  const tier = getTierForLevel(level);

  // 3 Random Missions
  const missionPool = getAllMissions(tier);

  for (let i = 0; i < 3; i++) {
    const random = Phaser.Math.Between(0, missionPool.length - 1);
    missions.push(missionPool[random]);
    missionPool.splice(random, 1); // Keine Duplikate
  }

  return missions;
}
```

---

## 8.4 Mission-Tracking

### Coin-Collection:
```typescript
onCoinCollected(type: string, count: number): void {
  // Generelle Coin-Mission
  updateMission('collect_coins', count);

  // Spezifische Coin-Mission
  if (type === 'valor') {
    updateMission('collect_valor', count);
  }
}
```

### Score-Tracking:
```typescript
onScoreUpdate(score: number): void {
  updateMission('reach_score', score);
}
```

### Time-Tracking:
```typescript
onTimeUpdate(seconds: number): void {
  updateMission('survive_time', seconds);
}
```

### Combo-Tracking:
```typescript
onComboAchieved(combo: number): void {
  updateMission('combo_master', combo);

  // Check für höchste Combo
  if (combo > longestCombo) {
    longestCombo = combo;
  }
}
```

### Mission-Completion:
```typescript
private checkMissionCompletion(mission: Mission): void {
  if (mission.progress >= mission.target && !mission.completed) {
    mission.completed = true;

    // Reward
    addXP(mission.reward.xp);

    // Notification
    showMissionCompleteNotification(mission.title, mission.reward.xp);

    // Visual Effect
    spawnCoinRain(eagle.x, eagle.y);
  }
}
```

---

# 9. Alle Texte & Dialoge

## 9.1 Intro-Dialoge (Ogle)

### Dialog 1:
```
"Eagle, the mission is clear: Collect coins,
dodge the FUD, and keep America.Fun alive!"
```

### Dialog 2:
```
"The meme economy is under attack.
Paper hands, jeeters, and SEC lawyers
are trying to bring us down.

Your mission: Fly high, stack $AOL,
and show them what WAGMI means!"
```

### Dialog 3:
```
"Remember: Shield protects you,
Belle deletes the FUD,
and VALOR MODE makes you unstoppable.

Now GO! 🦅"
```

---

## 9.2 Enemy Meme-Texte

### Jeeter:
- "I sold the top!"
- "Exit liquidity secured! 📉"
- "Paper hands forever!"
- "Took profits at -80%"
- "Should have held... nah! 🏃"

### Paper Hands Pete:
- "Nooo I panic sold!"
- "It was going to zero!"
- "Buy high, sell low! 📉"
- "Weak hands activated!"
- "I believed the FUD! 😱"

### Red Candles:
- "Market Dump Incoming 🚨"
- "Red candles everywhere!"
- "Support? What support? 📉"
- "Liquidation cascade! 🔴"
- "The dump never ends!"

### Gary (SEC):
- "Unregistered Security!"
- "Compliance needed! 📄"
- "You have been served!"
- "Regulations incoming!"
- "Lawsuit party! 🧑‍💼"

### Bear Market Boss:
- "SELL! SELL! SELL!"
- "Bear market forever! 🐻"
- "Winter is here!"
- "Hope? Not allowed!"
- "Capitulation time! 📉"

### Pump.fun:
- "Mint. Dump. Repeat. 💊"
- "We print, you cope. 💊"
- "Too early? Never heard of it. 💊"
- "Devs still minting... probably. 💊"
- "Low effort, high volume. 💊"
- "Launched before coffee. 💊"
- "Liquidity? Optional. 💊"

### Four.meme:
- "Copy. Paste. Rug. 🤡"
- "Fork it till you make it. 🤡"
- "Original? Never heard of it. 🤡"
- "100% same vibe, 0% innovation. 🤡"
- "Made in five minutes. 🤡"
- "AI said it's different. 🤡"
- "Derivative enjoyer. 🤡"

---

## 9.3 Mission-Texte

### Collection:
- "Collect 20 coins"
- "Collect 50 coins"
- "Collect 100 coins"
- "Collect 5 $VALOR"
- "Collect 10 $VALOR"

### Score:
- "Score 500 points"
- "Score 1000 points"
- "Score 2000 points"
- "Score 5000 points"

### Time:
- "Survive 60 seconds"
- "Survive 120 seconds"
- "Survive 300 seconds"

### Combo:
- "Reach combo of 3"
- "Reach combo of 5"
- "Reach combo of 10"

### Special:
- "Activate VALOR MODE"
- "Collect 5 $BURGER"
- "Trigger Buyback Mode"
- "Defeat 50 enemies"

---

## 9.4 UI-Texte

### Buttons:
- "▶️ PLAY"
- "📋 HOW TO PLAY"
- "🏆 LEADERBOARD"
- "ℹ️ CREDITS"
- "🔄 RETRY"
- "🏠 MENU"
- "⬅️ BACK"
- "NEXT >"
- "[DONE]"
- "🔄 REFRESH"

### HUD:
- "SCORE: {score}"
- "⏱️ {minutes}:{seconds}"
- "PHASE {number}"
- "🐕 $BONK: {count}"
- "🟣 $AOL: {count}"
- "🍔 $BURGER: {count}"
- "💵 $USD1: {count}"
- "🦅 $VALOR: {count}"
- "LVL {level} – {tier}"
- "🇺🇸 {combo}/3"
- "🍔 {combo}/5"

### Overlays:
- "💀 GAME OVER"
- "FINAL SCORE"
- "HIGH SCORE"
- "NEW HIGH SCORE!"
- "🎊 LEVEL UP! 🎊"
- "MISSION COMPLETE!"
- "COMBO x{number}!"
- "⚡🦅 VALOR MODE ACTIVATED! 🦅⚡"
- "VALOR MODE ENDED"

---

## 9.5 Taglines

### Start Screen:
- "Soar. Collect. Dominate."

### Loading Screen:
- "Avoid the FUD. Stack the $AOL. Be the Meme."

### In-Game (wechselnd):
- "HODL strong!"
- "To the moon! 🚀"
- "Diamond hands! 💎"
- "WAGMI"
- "Stack $AOL!"
- "Avoid the FUD!"
- "America.Fun forever!"

---

# 10. Sound & Musik

## 10.1 Musik-Tracks

### Menu Music:
- **File**: "Eagle of Fun _ America.Fun Anthem.mp3"
- **Scenes**: StartScene
- **Loop**: Ja
- **Volume**: 0.7

### Game Music (Main):
- **File**: "Eagle of Fun.mp3"
- **Scenes**: GameScene
- **Loop**: Ja
- **Volume**: 0.6

### Game Music (Alternative):
- **File**: "Eagle of Fun Kopie.mp3"
- **Scenes**: GameScene (variiert)
- **Loop**: Ja
- **Volume**: 0.6

### Game Over Music:
- **File**: "Game Over, America.Fun.mp3"
- **Scenes**: GameOverScene
- **Loop**: Nein
- **Volume**: 0.7

### Leaderboard Music:
- **File**: "Hall of Degens Theme.mp3"
- **Scenes**: LeaderboardScene
- **Loop**: Ja
- **Volume**: 0.6

---

## 10.2 Sound Effects

### Player Actions:

**Wing Flap**:
- **File**: "wing-flap-1-6434.mp3"
- **Trigger**: SPACE gedrückt
- **Volume**: 0.5

**Glide Start**:
- **File**: "whoosh-09-410876.mp3"
- **Trigger**: SPACE 300ms+ gehalten
- **Volume**: 0.4

### Coin Collection:

**Coin Collect**:
- **File**: "get-coin-351945.mp3"
- **Trigger**: Coin eingesammelt
- **Volume**: 0.4

### Combat:

**Crash/Hit**:
- **File**: "car-crash-sound-376882.mp3"
- **Trigger**: Enemy-Kollision, Fake Coin
- **Volume**: 0.5

**Explosion**:
- **File**: "explosion-312361.mp3"
- **Trigger**: Enemy zerstört
- **Volume**: 0.6

### Power-Ups:

**Shield Activate**:
- **File**: "arcade-bleep-sound-6071.mp3"
- **Trigger**: Shield eingesammelt
- **Volume**: 0.7

**Shield Active Loop**:
- **File**: "Shield_Active_subtle-1760734141916.mp3"
- **Trigger**: Während Shield aktiv
- **Volume**: 0.3
- **Loop**: Ja

**Belle Collect**:
- **File**: "arcade-ui-2-229500.mp3"
- **Trigger**: Belle MOD / Vesper eingesammelt
- **Volume**: 0.8

**Buyback Voice**:
- **File**: "ElevenLabs_2025-10-17T21_02_09_Drill Sergeant_pvc_sp100_s50_sb75_v3.mp3"
- **Trigger**: Buyback Mode / VALOR MODE aktiviert
- **Volume**: 0.9

**Lightning**:
- **File**: "lightening-bang-impact-40580.mp3"
- **Trigger**: Lightning Bolt aktiviert
- **Volume**: 0.8

**Whoosh**:
- **File**: "whoosh-09-410876.mp3"
- **Trigger**: Speed Boost aktiviert
- **Volume**: 0.8

### UI:

**UI Confirm**:
- **File**: "confirm-tap-394001.mp3"
- **Trigger**: Button geklickt (wichtig)
- **Volume**: 0.6

**Hover Button**:
- **File**: "hover-button-287656.mp3"
- **Trigger**: Button Hover
- **Volume**: 0.4

**Menu Button**:
- **File**: "menu-button-88360.mp3"
- **Trigger**: Menu-Navigation
- **Volume**: 0.5

### Special Events:

**Ready for Takeoff**:
- **File**: "readyfortakeoff.mp3"
- **Trigger**: Game Start (nach Countdown)
- **Volume**: 0.8

**Countdown**:
- **File**: "321gobradford.mp3"
- **Trigger**: 3-2-1 Countdown vor Spielstart
- **Volume**: 0.7

**Level Up**:
- **File**: "new-level.mp3"
- **Trigger**: Level erreicht
- **Volume**: 0.7

**Ogle Voice**:
- **File**: "ElevenLabs_2025-10-17T20_59_40_Bradford_pvc_sp100_s50_sb75_v3.mp3"
- **Trigger**: Intro-Dialog
- **Volume**: 0.8

**Keyboard Typing**:
- **File**: "keyboard-typing-sound-250308.mp3"
- **Trigger**: Text-Animation (optional)
- **Volume**: 0.3

---

# 11. Visuelle Effekte

## 11.1 Partikel-Effekte

### Gold Sparkles (VALOR Collection):
```typescript
// 8 Partikel radial um Coin
for (let p = 0; p < 8; p++) {
  const particle = this.add.circle(x, y, 4, 0xFFD700);
  const angle = (Math.PI * 2 * p) / 8;
  const distance = 50;

  this.tweens.add({
    targets: particle,
    x: x + Math.cos(angle) * distance,
    y: y + Math.sin(angle) * distance,
    alpha: 0,
    duration: 400,
    ease: 'Power2',
    onComplete: () => particle.destroy()
  });
}
```

### VALOR Aura:
```typescript
// 8 Emitter rund um Eagle
const particles = this.add.particles(eagle.x, eagle.y, 'coin-valor', {
  speed: { min: 20, max: 50 },
  scale: { start: 0.15, end: 0 },
  alpha: { start: 0.8, end: 0 },
  lifespan: 800,
  frequency: 50,
  angle: { min: angle - 20, max: angle + 20 },
  tint: 0xFFD700,
  blendMode: 'ADD'
});
```

### Explosion (Enemy Death):
```typescript
// 10 Partikel radial
for (let i = 0; i < 10; i++) {
  const particle = this.add.circle(x, y, 5, 0xFF0000);
  const angle = (Math.PI * 2 * i) / 10;

  this.tweens.add({
    targets: particle,
    x: particle.x + Math.cos(angle) * 150,
    y: particle.y + Math.sin(angle) * 150,
    alpha: 0,
    duration: 500
  });
}
```

### Coin Rain (Mission Complete):
```typescript
// Spawnt 20-30 Coins von oben
for (let i = 0; i < 25; i++) {
  const coin = this.add.image(
    Phaser.Math.Between(x - 200, x + 200),
    y - 300,
    'coin-aol'
  );
  coin.setScale(0.1);

  this.tweens.add({
    targets: coin,
    y: coin.y + 400,
    angle: 360,
    alpha: 0,
    duration: 1500,
    delay: i * 50,
    ease: 'Cubic.easeIn',
    onComplete: () => coin.destroy()
  });
}
```

---

## 11.2 Screen-Effekte

### Screen Shake:
```typescript
// Parameter: duration (ms), intensity
this.cameras.main.shake(duration, intensity);
```

**Verwendung**:
- Hit: 300ms, 0.01
- Fake Coin: 400ms, 0.01
- Roar: 1000ms, 0.02
- Lightning: 500ms, 0.015
- VALOR Activation: 800ms, 0.008
- Speed Boost: 500ms, 0.005

### Flash:
```typescript
// Parameter: duration (ms), r, g, b, force
this.cameras.main.flash(duration, r, g, b, force);
```

**Verwendung**:
- VALOR Activation: 500ms, Gold (255, 215, 0)
- Level Up: 300ms, White (255, 255, 255)
- Lightning: 200ms, Yellow (255, 255, 0)

### Fade:
```typescript
// Fade to black (Scene-Transition)
this.cameras.main.fadeOut(duration);
this.cameras.main.fadeIn(duration);
```

---

## 11.3 Animations

### Eagle Animations:

**eagle_fly** (Normal):
- Frames: 0-3
- Frame Rate: 6 fps
- Loop: Ja

**eagle_dive** (Flap):
- Frames: 0-3
- Frame Rate: 10 fps
- Loop: Ja
- Duration: 200ms beim Flap

**eagle_hit** (Damage):
- Frame: 3 (single)
- Frame Rate: 1 fps
- Loop: Nein
- Blink: Alpha 0.3 ↔ 1.0 (3× 200ms)

**eagle_gold_fly** (VALOR MODE):
- Frames: 0-3
- Frame Rate: 8 fps
- Loop: Ja
- Texture: 'eagle-gold'

**eagle_gold_dive** (VALOR Flap):
- Frames: 0-3
- Frame Rate: 12 fps
- Loop: Ja
- Texture: 'eagle-gold'

### Idle Animations:

**Bobbing**:
```typescript
this.tweens.add({
  targets: eagleSprite,
  y: -2,
  duration: 800,
  yoyo: true,
  repeat: -1,
  ease: 'Sine.easeInOut'
});
```

**Rotation**:
```typescript
this.tweens.add({
  targets: eagle,
  angle: 2,
  duration: 1500,
  yoyo: true,
  repeat: -1,
  ease: 'Sine.easeInOut'
});
```

### UI Animations:

**Button Hover**:
```typescript
this.tweens.add({
  targets: button,
  scale: 1.05,
  duration: 100
});
```

**Score Blink**:
```typescript
this.tweens.add({
  targets: scoreText,
  scale: 1.1,
  duration: 100,
  yoyo: true
});
```

**Mission Complete Pulse**:
```typescript
this.tweens.add({
  targets: missionBox,
  scale: 1.3,
  alpha: 0,
  duration: 500,
  ease: 'Back.easeOut',
  onComplete: () => missionBox.destroy()
});
```

---

# 12. Technische Spezifikationen

## 12.1 Projekt-Struktur

```
Eagle/
├── public/
│   └── assets/
│       ├── images/
│       │   ├── eagle-spreat-sheet.png
│       │   ├── eagle-spreat-sheet-gold.png
│       │   ├── feder-pixel.png
│       │   ├── bonk-coin.png
│       │   ├── token_aol.png
│       │   ├── usd1-coin.png
│       │   ├── Token_Burger.png
│       │   ├── valorant-coin.png
│       │   ├── jeet.png
│       │   ├── PaperHands-Pixel.png
│       │   ├── redcandles-pixel.png
│       │   ├── gary-pixel.png
│       │   ├── bearmarket-pixel.png
│       │   ├── pumpfun-pixel.png
│       │   ├── fourmeme-pixel.png
│       │   ├── america-hat-pixel.png
│       │   ├── MOD-Belle-pixel.png
│       │   ├── bandana-pixel.png
│       │   ├── vesper0x.png
│       │   ├── Ogle-Pixel.png
│       │   ├── americalogo.png
│       │   └── backgrounds/
│       └── audio/
│           ├── Eagle of Fun.mp3
│           ├── Game Over, America.Fun.mp3
│           ├── Hall of Degens Theme.mp3
│           └── [alle Sound-Dateien]
├── src/
│   ├── config/
│   │   ├── GameConfig.ts
│   │   └── MissionsConfig.ts
│   ├── managers/
│   │   └── MissionManager.ts
│   ├── scenes/
│   │   ├── PreloadScene.ts
│   │   ├── StartScene.ts
│   │   ├── IntroScene.ts
│   │   ├── GameScene.ts
│   │   ├── HowToPlayScene.ts
│   │   ├── LeaderboardScene.ts
│   │   ├── CreditsScene.ts
│   │   └── GameOverScene.ts
│   ├── sprites/
│   │   └── Eagle.ts
│   └── main.ts
├── dist/ (Build-Output)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── SPIELANLEITUNG.md
```

---

## 12.2 Technologie-Stack

**Engine**: Phaser 3 (v3.55+)
**Language**: TypeScript
**Build Tool**: Vite
**Package Manager**: npm

**Dependencies**:
```json
{
  "phaser": "^3.55.2",
  "typescript": "^4.9.0",
  "vite": "^5.4.20"
}
```

---

## 12.3 GameConfig

**Resolution**:
- Width: 1920
- Height: 1080
- Type: Phaser.AUTO

**Physics**:
- System: Arcade
- Gravity: 800
- Flap Velocity: -600

**Performance**:
- FPS Target: 60
- Render: WebGL (fallback Canvas)

---

## 12.4 Datei-Größen

**Total Build Size**: ~1.6 MB (gzipped: ~372 KB)

**Assets**:
- Images: ~500 KB
- Audio: ~15 MB (vor Kompression)
- Code: ~100 KB (minified)

---

## 12.5 Browser-Kompatibilität

**Supported**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile**:
- iOS Safari 14+
- Chrome Mobile 90+

---

## 12.6 Speicher-System

**localStorage Keys**:
- `eagleOfFun_highScore`: High Score (Number)
- `eagleOfFun_unlockedSkins`: Freigeschaltete Skins (JSON Array)
- `eagleOfFun_settings`: Einstellungen (JSON Object)

**Session Data**:
- Current Run Stats
- Active Missions
- Temporary Buffs

---

## 12.7 Performance-Optimierungen

**Sprite-Sheets**: Alle Animationen in Sheets (512×512 Frames)
**Object Pooling**: Coins, Enemies, Particles werden gepoolt
**Depth Sorting**: Z-Index für korrekte Render-Reihenfolge
**Sound Pre-Loading**: Alle Sounds beim Start geladen
**Texture Atlases**: Geplant für zukünftige Optimierung

---

## 12.8 Debug-Informationen

**Console Logs**:
- Score-Updates
- Mission-Completions
- Level-Ups
- Fehler und Warnungen

**Debug-Modus** (geplant):
- FPS-Counter
- Collision-Boxes anzeigen
- Enemy-Paths visualisieren
- Spawn-Triggers anzeigen

---

# 13. Anhänge

## 13.1 Alle Farb-Codes

```typescript
const colors = {
  primary: '#E63946',    // Rot (America.Fun)
  secondary: '#0033A0',  // Blau (America)
  gold: '#FBB13C',       // Gold (Highlights)
  white: '#FFFFFF',      // Weiß (Text)
  lightBlue: '#E8F4FF',  // Hellblau (BG)
  bonkOrange: '#FF6B00', // Orange ($BONK)
  aolPurple: '#9370DB',  // Lila ($AOL)
  usd1Green: '#4CAF50',  // Grün ($USD1)
  valorGold: '#FFD700',  // Gold ($VALOR)
  black: '#000000'       // Schwarz (Outlines)
};
```

---

## 13.2 Keyboard-Shortcuts

**Gameplay**:
- SPACE: Flap / Glide
- ESC: Pause / Skip Intro

**Debug** (falls implementiert):
- F1: Toggle FPS
- F2: Toggle Collision Boxes
- F3: Toggle Debug Info

---

## 13.3 Cheat-Codes (Easter Eggs)

**Geplant**:
- `1776`: Special Declaration Mode
- `420`: Bonk Party Mode
- `WAGMI`: Instant Max Level

---

## 13.4 Credits & Acknowledgments

**Game Design**: America.Fun Team
**Development**: Claude & Development Team
**Art**: Pixel Art Team
**Music**: Licensed Audio Assets
**Testing**: Community Champions

**Special Thanks**:
- Ogle - Maskottchen & Guide
- Vesper0x - Bull Market Spirit
- Κρόνος Belle - MOD Queen
- Alle $AOL Holders

**Tools Used**:
- Phaser 3 Engine
- TypeScript
- Vite Build Tool
- Aseprite (Pixel Art)
- Audacity (Audio)

---

## 13.5 Version History

**v2.0.0** (2025-10-22):
- ✨ VALOR MODE hinzugefügt
- ✨ $VALOR Coin hinzugefügt
- ✨ Gold Eagle Sprite
- 🐛 Fake Coin Bug behoben (nur 1 Leben statt Tod)
- 🎨 UI-Anpassungen (XP-Bar, Missionen)
- ⚡ Performance-Verbesserungen

**v1.5.0**:
- Mission-System implementiert
- Level & Tier-System
- Neue Enemies (Pump.fun, Four.meme)

**v1.0.0**:
- Initial Release
- Core Gameplay
- 5 Phasen
- Basis Power-Ups

---

# Ende der Dokumentation

**Diese Dokumentation enthält ALLES über Eagle of Fun:**
- ✅ Alle Szenen & Menüs
- ✅ Komplettes UI-Layout
- ✅ Alle Spielmechaniken
- ✅ Alle Coins & Collectibles
- ✅ Alle Power-Ups (inkl. VALOR MODE)
- ✅ Alle Gegner mit Memes
- ✅ Mission-System
- ✅ Alle Texte & Dialoge
- ✅ Alle Sounds & Musik
- ✅ Alle visuellen Effekte
- ✅ Technische Spezifikationen
- ✅ Code-Snippets & Beispiele

**Für Updates und Support**:
- GitHub: [Repository]
- Discord: [Community]
- Twitter: @AmericaDotFun

---

**🦅 Eagle of Fun - Made with ❤️ by America.Fun 🦅**

*Let's keep memeing to the moon! 🚀*
