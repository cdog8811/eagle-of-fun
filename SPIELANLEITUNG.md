# 🦅 Eagle of Fun - Vollständige Spielanleitung

## 📖 Spielübersicht

**Eagle of Fun** ist ein actionreiches Endless-Runner-Spiel, in dem du als Adler durch den Himmel fliegst, Coins sammelst, Gegner ausweichst und verschiedene Power-Ups aktivierst. Inspiriert von der America.Fun-Plattform, bietet das Spiel ein dynamisches Levelsystem mit Missionen, verschiedene Schwierigkeitsphasen und spektakuläre Power-Up-Modi.

---

## 🎮 Grundsteuerung

### Tastatur:
- **LEERTASTE (kurz drücken)**: Flügelschlag (Fliegen)
- **LEERTASTE (300ms+ halten)**: Gleitflug aktivieren
- **LEERTASTE (loslassen)**: Gleitflug beenden

### Maus:
- Klicken für Menünavigation
- Buttons im UI anklicken

---

## 💰 Coins & Sammelsystem

### Verfügbare Coins:

| Coin | Symbol | Punkte | Spawn-Chance | Besonderheit |
|------|--------|---------|--------------|--------------|
| **$BONK** | 🐕 | 5 | 40% | Standard-Coin |
| **$AOL** | 🟣 | 10 | 30% | 3× sammeln = Buyback Mode |
| **$USD1** | 💵 | 2 | 20% | Stablecoin, sicher |
| **$BURGER** | 🍔 | 25 | 10% | 5× sammeln = 5s Multiplikator |
| **$VALOR** | 🦅 | 15 | 15% | Premium-Coin, größer |

### Coin-Counter:
Oben im HUD werden alle gesammelten Coins gezählt:
```
🐕 $BONK: 0 | 🟣 $AOL: 0 | 🍔 $BURGER: 0 | 💵 $USD1: 0 | 🦅 $VALOR: 0
```

### Combo-System:
- Sammle Coins innerhalb von 1 Sekunde für Combos
- Combo × 2, × 3, × 4... multipliziert die Punkte
- Längste Combo wird getrackt für Missionen

---

## ⚡ Power-Ups & Special Modes

### 1. 🧲 Buyback Mode (AOL Combo)
**Auslöser**: 3× $AOL-Coins hintereinander sammeln

**Effekte**:
- Magnetische Anziehung aller Coins (400px Radius)
- Dauer: 5 Sekunden
- Sound: "Buyback activated!"
- Visual: Magnet-Icon oben rechts

**HUD-Anzeige**: `🇺🇸 0/3` (zeigt AOL-Fortschritt)

---

### 2. 🍔 Burger Multiplier
**Auslöser**: 5× $BURGER-Coins sammeln

**Effekte**:
- Score × 2 für 5 Sekunden
- Alle Punkte werden verdoppelt
- Kombinierbar mit anderen Multiplikatoren

**HUD-Anzeige**: `🍔 0/5` (zeigt Burger-Fortschritt)

---

### 3. 🛡️ America Hat (Shield)
**Auslöser**: Shield Power-Up einsammeln (15% Spawn-Chance)

**Effekte**:
- Blockiert 1 Treffer
- Dauer: 8 Sekunden
- Visual: Rotes Shield um Eagle
- Sound: Shield-Loop während aktiv

**Schutz vor**:
- Gegnern
- Fake Coins
- Lawsuit Papers
- Allen Gefahren

---

### 4. ⚡ Solana Surge
**Auslöser**: Lightning Power-Up einsammeln

**Effekte**:
- Speed Boost × 1.5
- Jump Boost × 1.3
- Dauer: 4 Sekunden
- Visual: Lightning-Icon

---

### 5. 👁️ Κρόνος Belle (MOD Mode)
**Auslöser**: Belle MOD Power-Up einsammeln (12% Chance)

**Effekte**:
- Blockt alle Hits wie Shield
- "Löscht" Gegner und FUD
- Dauer: 8 Sekunden
- Visual: Belle-Sprite folgt Eagle
- Golden Aura Effect

**Spezial**: Belle ist Moderatorin und "bannt" Jeeters!

---

### 6. 💨 Speed Boost (Bandana)
**Auslöser**: Bandana Power-Up einsammeln

**Effekte**:
- Unverwundbarkeit
- Speed × 2.5
- Dauer: 5 Sekunden
- Visual: Bandana auf Eagle + Speed Trail
- Screen Shake

---

### 7. 🐂 Vesper's Blessing
**Auslöser**: Alle 500 Punkte spawnt Vesper

**Effekte**:
- +1 Leben
- +500 Bonus-Punkte
- Visual: Goldenes Vesper-Icon
- Sound: Belle-Collect

**Wichtig**: Sehr wertvoll für lange Runs!

---

### 8. ⚡🦅 VALOR MODE (Ultimate Power-Up) 🦅⚡

**Auslöser**: Goldene Feder einsammeln (5% Spawn-Chance)

**Nur verfügbar wenn**:
- VALOR MODE nicht bereits aktiv
- Kein Cooldown läuft

#### Effekte (15 Sekunden):
- ✨ **Eagle wird GOLD** (Sprite wechselt zu Gold-Version)
- 🛡️ **Unverwundbar** (alle Hits ignoriert)
- 🚀 **Speed × 6** (extrem schnell!)
- 💰 **Coins spawnen 10× schneller** (alle 150ms)
- 💯 **Score × 3 Multiplikator**
- 🌟 **Goldene Aura** mit 8 Partikel-Emittern
- 📺 **Screen Glow** (goldener Vignette-Effekt)
- 📊 **HUD**: "VALOR MODE" in Gold oben mittig

#### Visual Feedback:
```
⚡🦅 VALOR MODE ACTIVATED! 🦅⚡
INVINCIBLE | SPEED x6 | COINS x10
SCORE x3
```

#### Nach 15 Sekunden:
- Automatische Deaktivierung
- Eagle kehrt zu Normal-Sprite zurück
- Speed normalisiert sich
- "VALOR MODE ENDED" Message
- **Cooldown**: 60 Sekunden

**Strategie**: Perfekt für maximale Punkte in kurzer Zeit!

---

## 👾 Gegner & Gefahren

### Phase 1: Soft Launch 🚀
**Gegner**: Jeeter
- Horizontale Bewegung
- Meme: "I sold the top!"
- Speed: 250

### Phase 2: Paper Panic 👋
**Neue Gegner**: Paper Hands Pete
- Wellenbewegung
- Droppt Fake Coins (grau getönt)
- Bei Tod: 1-2 echte Coins

**⚠️ Fake Coins**:
- Kosten 1 Leben bei Berührung
- Grau getönt mit Wobble-Animation
- Können durch Shield/Belle MOD blockiert werden
- Geben -10 Punkte

### Phase 3: Candle Crash 📉
**Neue Gegner**:
- Red Candles (vertikal, tauchen ab)
- Pump.fun (Konkurrenz mit Boost-Dash)

### Phase 4: Regulation Run 🧑‍💼
**Neue Gegner**:
- Gary (SEC) - wirft Lawsuit Papers
- Four.meme (Copycat, spawnt in Paaren)

**Lawsuit Papers**:
- Blockieren Steuerung für 2 Sekunden
- Langsamer als Gegner
- Können ausgewichen werden

### Phase 5: Bear Market Finale 🐻
**Boss**: Bear Market Boss
- Größter Gegner
- Roar-Effekt alle 15 Sekunden (Screen Shake)
- Wellenbewegung
- Höchste Gefahr

### Phase 6: WAGMI Mode 🦅
**Endless**: Alle Gegner gleichzeitig
- Variable Schwierigkeit
- Maximale Chaos
- Speed × 2.3

---

## ❤️ Leben-System

### Standard:
- **Start**: 3 Leben
- **Maximum**: 5 Leben

### Anzeige:
Herzen oben links: ❤️❤️❤️

### Leben verlieren:
- Gegner-Kollision: -1 Leben
- Fake Coin: -1 Leben
- Bei 0 Leben: Game Over

### Leben gewinnen:
- Vesper's Blessing: +1 Leben
- Bestimmte Missionen: +1 Leben

### Invincibility Frames:
Nach Treffer kurze Unverwundbarkeit (Blink-Effekt)

---

## 📊 Missions & Levelsystem

### XP-System:
- Coins sammeln: XP
- Combos: Bonus-XP
- Missionen abschließen: Große XP-Belohnungen
- Level up: Schaltet neue Tiers frei

### Level-Anzeige:
Rechts unten: `LVL 1 – Rookie`

**XP-Bar**: Zeigt Fortschritt zum nächsten Level

### Tiers:
1. **Rookie** (Level 1-5)
2. **Explorer** (Level 6-10)
3. **Veteran** (Level 11-20)
4. **Master** (Level 21-30)
5. **Legend** (Level 31+)

### Mission-Typen:

#### Daily Missions (3 aktiv):
- "Collect X coins"
- "Reach combo of X"
- "Survive X seconds"
- "Score X points"
- "Collect X $VALOR"

**Anzeige**: Rechts unten als Boxen
```
🎯 Collect 50 coins: 25/50
💰 Score 1000 points: 500/1000
⏱️ Survive 120s: 60/120
```

**Completion**:
- Mission-Complete-Overlay
- XP-Reward Animation
- Coin-Rain-Effekt

---

## 🎨 HUD & UI-Elemente

### Oben Links:
- Score: `SCORE: 0`
- Timer: `⏱️ 0:00`
- Phase: `PHASE 1`

### Oben Mitte:
- Leben: ❤️❤️❤️

### Oben Rechts:
- AOL Combo: 🇺🇸 0/3
- Burger Combo: 🍔 0/5

### Unten (Coin Counter):
```
🐕 $BONK: 0 | 🟣 $AOL: 0 | 🍔 $BURGER: 0 | 💵 $USD1: 0 | 🦅 $VALOR: 0
```

### Rechts Oben:
- Magnet-Icon (wenn aktiv)
- Lightning (Solana Surge)
- Shield (America Hat)

### Rechts Unten:
- Level & XP-Bar: `LVL 1 – Rookie`
- Mission-Boxen (3 Stück)

### Bei VALOR MODE:
- Oben Mittig: **"VALOR MODE"** (48px Gold)
- Goldener Screen-Glow
- Partikel um Eagle

---

## 🎵 Sound & Musik

### Musik:
- **Menu**: America.Fun Anthem
- **Game**: Eagle of Fun (Loop)
- **Game Over**: Game Over Theme
- **Leaderboard**: Hall of Degens Theme

### Sound Effects:
- Wing Flap (bei Flügelschlag)
- Coin Collect (süßer Ping)
- Crash (bei Tod)
- Shield Activate (Bleep)
- Shield Loop (während aktiv)
- Belle Collect (UI-Sound)
- Buyback Voice (Epic)
- Lightning (Blitz)
- Explosion (Gegner-Tod)
- Whoosh (Speed, Glide)

---

## 🎯 Scoring-System

### Basis-Punkte:
- Zeit: +1 Punkt pro Sekunde
- Coins: Je nach Typ (2-25 Punkte)

### Multiplikatoren (stapelbar!):

1. **Combo**: × 2, × 3, × 4...
2. **Burger Multiplier**: × 2 (5 Sekunden)
3. **Bull Market**: × 2 (Vesper-Effekt)
4. **Eagle Mode**: × 3 (spezieller Modus)
5. **VALOR MODE**: × 3 (15 Sekunden)

**Maximaler Multiplikator**: Theoretisch unbegrenzt durch Stacking!

**Beispiel**:
```
$BONK (5 Punkte)
× Combo 4
× Burger Multiplier
× VALOR MODE
= 5 × 4 × 2 × 3 = 120 Punkte!
```

### High Score:
- Wird lokal gespeichert (localStorage)
- Anzeige im Game Over Screen
- Leaderboard-Integration

---

## 🏆 Achievements & Unlocks

### Skins (geplant):
- Classic Eagle (Standard)
- Ogle Mode (1000 Punkte)
- Bonk Pup (2000 Punkte)
- Burger Beast (3000 Punkte)
- WLFI Whale (5000 Punkte)
- Golden Wings (Secret)

---

## 💡 Pro-Tipps & Strategien

### Für Anfänger:
1. **Fokus auf Überleben**: Sammle Coins nur wenn sicher
2. **Nutze Gleitflug**: Präzisere Kontrolle
3. **Priorisiere $AOL**: Buyback Mode ist lebensrettend
4. **Sammle Vesper**: +1 Leben ist Gold wert

### Für Fortgeschrittene:
1. **Combo-Hunting**: Sammle schnell für hohe Multiplikatoren
2. **Power-Up-Timing**: Speichere für schwierige Phasen
3. **$BURGER-Stacking**: 5× sammeln für Multiplier
4. **Mission-Focus**: XP für bessere Belohnungen

### Für Profis:
1. **Multiplikator-Stacking**: Kombiniere alle aktiven Boosts
2. **VALOR MODE nutzen**: In dichten Coin-Phasen aktivieren
3. **Fake Coins mit Shield**: Nutze Schilde strategisch
4. **Belle MOD für Bosses**: Unverwundbar durch Bear Market

### VALOR MODE Mastery:
1. **Warte auf guten Moment**: Nutze wenn viele Coins da sind
2. **Sammle ALLES**: 10× Coin-Rate + Score × 3 = massiv!
3. **60s Cooldown beachten**: Plane nächste Aktivierung
4. **Kombiniere mit Burger Multiplier**: × 2 × 3 = × 6 Score!

---

## ⚠️ Häufige Fehler

### 1. Zu aggressiv Coins sammeln
→ **Lösung**: Überleben > Punkte

### 2. Shield zu früh nutzen
→ **Lösung**: Spare für schwierige Situationen

### 3. Fake Coins übersehen
→ **Lösung**: Achte auf graue Tönung + Wobble

### 4. VALOR MODE verschwenden
→ **Lösung**: Aktiviere in Coin-reichen Phasen

### 5. Missionen ignorieren
→ **Lösung**: XP = bessere Belohnungen langfristig

---

## 🐛 Bekannte Features

### Progressive Difficulty:
- Spawn-Rate erhöht sich über Zeit
- Mehr Gegner pro Minute
- Schnellere Bewegung
- Neue Gegner-Typen freigeschaltet

### Market Phases:
- Bear Market (rot, härter)
- Bull Market (grün, Vesper)
- Sideways (normal)

### Speed Mechanics:
- Base Speed erhöht sich mit Zeit
- Power-Ups modifizieren temporär
- VALOR MODE überschreibt alles

---

## 📱 Technische Details

### Auflösung:
- **Native**: 1920×1080 (Full HD)
- **Responsive**: Skaliert auf kleinere Bildschirme

### Performance:
- 60 FPS Target
- Particle-System optimiert
- Sprite-Sheets für Animationen

### Speichersystem:
- LocalStorage für High Score
- Session für aktuelle Run-Daten
- Cloud-Save (geplant)

---

## 🎮 Game Over & Restart

### Game Over auslösen:
- 0 Leben übrig
- Alle Herzen verloren

### Game Over Screen zeigt:
- Final Score
- High Score
- Stats (Zeit, Coins, Combos)
- "Retry" Button
- "Main Menu" Button

### Was wird gespeichert:
- High Score (persistent)
- Unlocked Skins (persistent)
- Mission Progress (session)

---

## 🔄 Updates & Roadmap

### Geplante Features:
- [ ] Multiplayer-Leaderboard
- [ ] Tägliche Herausforderungen
- [ ] Mehr Skins
- [ ] Boss-Fights
- [ ] Story-Mode
- [ ] Achievement-System
- [ ] Cloud-Saves

---

## 📞 Support & Community

### Bei Problemen:
- GitHub Issues: [Link]
- Discord: [Link]
- Twitter: @AmericaDotFun

### Credits:
- **Game Design**: America.Fun Team
- **Development**: Claude + Team
- **Art**: Pixel Artists
- **Sound**: Licensed Audio
- **Testing**: Community

---

## 🎊 Easter Eggs

### Geheime Codes:
- `1776` → Special Declaration Mode (geplant)
- `420` → Bonk Party (geplant)

### Hidden Features:
- Vesper spawnt bei exakt 500/1000/1500... Punkten
- Gold Eagle ist 15% größer als Normal
- VALOR Feather hat 5% Chance (1 in 20)

---

## 📈 Progression-Tabelle

| Level | XP Required | Tier | Belohnungen |
|-------|-------------|------|-------------|
| 1-5 | 100-500 | Rookie | Basis-Missionen |
| 6-10 | 600-1000 | Explorer | Mehr Coins |
| 11-20 | 1100-2000 | Veteran | Power-Ups häufiger |
| 21-30 | 2100-3000 | Master | Seltene Missionen |
| 31+ | 3100+ | Legend | Max Rewards |

---

## 🎯 Mission-Beispiele

### Beginner:
- Collect 20 coins
- Reach combo of 3
- Survive 60 seconds

### Intermediate:
- Collect 50 coins
- Reach combo of 5
- Score 500 points
- Collect 5 $VALOR

### Advanced:
- Collect 100 coins
- Reach combo of 10
- Survive 300 seconds
- Score 2000 points
- Activate VALOR MODE

---

**Version**: 2.0.0
**Letztes Update**: 2025-10-22
**Status**: Release

---

**🦅 Viel Spaß beim Spielen von Eagle of Fun! 🦅**

*Made with ❤️ by America.Fun*
