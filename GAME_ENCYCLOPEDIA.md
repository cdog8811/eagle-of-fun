# 🦅 Eagle of Fun - Vollständige Spiel-Enzyklopädie

**Version:** 3.9.3
**Stand:** Oktober 2025

---

## 📋 Inhaltsverzeichnis

1. [Gegner-Übersicht](#gegner-übersicht)
2. [Bonus-Items & Power-Ups](#bonus-items--power-ups)
3. [Münzen & Sammelobjekte](#münzen--sammelobjekte)
4. [Spielphasen](#spielphasen)
5. [Waffen-System](#waffen-system)

---

## 🎯 Gegner-Übersicht

### **Basis-Gegner (Phase 1-2)**

#### 🏃 **Jeeter Joe**
- **Beschreibung:** Der klassische Verkäufer - bewegt sich horizontal
- **Verhalten:** Horizontal movement (basic enemy)
- **Geschwindigkeit:** 180 (mittel)
- **HP:** 25
- **Größe:** 100x100 Pixel
- **Meme-Spruch:** "I sold the top!"
- **Erstmalig in Phase:** 1 (Soft Launch 🚀)
- **Schwierigkeit:** Einfach

#### 👋 **Paper Hands Pete**
- **Beschreibung:** Droppt gefährliche Fake-Coins
- **Verhalten:** Wirft Fake-Coins ab, die -10 Punkte kosten
- **Geschwindigkeit:** 160 (langsam)
- **HP:** 30
- **Größe:** 85x85 Pixel
- **Meme-Spruch:** "Nooo I panic sold!"
- **Fake Coin Strafe:** -10 Punkte
- **Erstmalig in Phase:** 2 (Paper Panic 👋)
- **Schwierigkeit:** Mittel

---

### **Barrieren & Statische Gegner**

#### 📉 **Red Candles**
- **Beschreibung:** Vertikale Barrieren - Chart-Crash visualisiert
- **Verhalten:** Statische vertikale Barrieren
- **Geschwindigkeit:** 140 (sehr langsam)
- **HP:** 35
- **Größe:** 50x150 Pixel (schmal und hoch)
- **Meme-Spruch:** "Market Dump Incoming 🚨"
- **Erstmalig in Phase:** 3 (Candle Crash 📉)
- **Schwierigkeit:** Mittel

---

### **Elite-Gegner & Bosse**

#### 🧑‍💼 **Gary (SEC)**
- **Beschreibung:** Wirft Lawsuit Papers, die die Steuerung blockieren
- **Verhalten:** Schießt Projektile (Klagen), blockiert Steuerung für 2 Sekunden
- **Geschwindigkeit:** 190 (mittel)
- **HP:** 25
- **Größe:** 90x100 Pixel
- **Meme-Spruch:** "Unregistered Security!"
- **Spezial-Effekt:** Control Block für 2000ms
- **Wurf-Intervall:** 2500ms zwischen Würfen
- **Erstmalig in Phase:** 4 (Regulation Run 🧑‍💼)
- **Schwierigkeit:** Schwer

#### 🐻 **Bear Market Boss**
- **Beschreibung:** Riesiger Endgegner mit massivem HP-Pool
- **Verhalten:** Chaotische Bewegung, intimidierend
- **Geschwindigkeit:** 130 (sehr langsam)
- **HP:** 200 (Boss-Level!)
- **Größe:** 180x180 Pixel
- **Meme-Spruch:** "SELL! SELL! SELL!"
- **Boss-Status:** JA (isBoss: true)
- **Erstmalig in Phase:** 5 (Bear Market Finale 🐻)
- **Schwierigkeit:** Extrem

#### 🐻 **CZ (Boss-Tier Elite)**
- **Beschreibung:** Boss-Level Elite mit extrem hohem HP
- **Verhalten:** Boss-Tier Bewegung
- **Geschwindigkeit:** 180 (mittel)
- **HP:** 300 (höchste HP!)
- **Größe:** 140x140 Pixel
- **Meme-Spruch:** "🐻 Bear Market King!"
- **Boss-Status:** Boss-Tier (nicht echter Boss, aber Boss-Stats)
- **Erstmalig in Phase:** 5 (Bear Market Finale 🐻)
- **Schwierigkeit:** Extrem

---

### **Konkurrenz-Plattformen**

#### 🖐️ **4meme (CZ/Binance)**
- **Beschreibung:** Kontrahent zu America.Fun - gehört zu CZ/Binance
- **Verhalten:** Schnelle horizontale Bewegung
- **Geschwindigkeit:** 260 (schnell)
- **HP:** 28
- **Größe:** 95x95 Pixel
- **Meme-Spruch:** "4meme > AOL 🖐️"
- **Erstmalig in Phase:** 3 (Candle Crash 📉)
- **Schwierigkeit:** Mittel-Schwer

#### 💎 **Pump.fun**
- **Beschreibung:** Größte Memecoin-Plattform - direkter Konkurrent
- **Verhalten:** Sehr schnelle horizontale Bewegung
- **Geschwindigkeit:** 270 (sehr schnell!)
- **HP:** 30
- **Größe:** 90x90 Pixel
- **Meme-Spruch:** "Pump it or dump it! 💎"
- **Erstmalig in Phase:** 4 (Regulation Run 🧑‍💼)
- **Schwierigkeit:** Schwer

---

### **Spezial-Gegner (v3.8)**

#### 🎯 **HawkEye (Sniper)**
- **Beschreibung:** Präzisions-Schütze - feuert gezielte Laser-Schüsse
- **Verhalten:** Sniper - schießt gezielte Laser auf den Adler
- **KI-Typ:** Sniper (aimed shots)
- **Geschwindigkeit:** 150 (langsam - Präzision über Geschwindigkeit)
- **HP:** 35
- **Größe:** 95x95 Pixel
- **Sprite:** 🎯 Emoji
- **Meme-Spruch:** "🎯 Targeted strike!"
- **Projektil-Typ:** Laser
- **Feuerrate:** 3000ms zwischen Schüssen
- **Erstmalig in Phase:** 3 (Candle Crash 📉)
- **Schwierigkeit:** Schwer

#### 🚁 **Droneling (Swarm)**
- **Beschreibung:** Schwarm-Feind - spawnt in Gruppen von 5
- **Verhalten:** Swarm - kommt in Gruppen
- **KI-Typ:** Swarm (grouped movement)
- **Geschwindigkeit:** 240 (mittel-schnell)
- **HP:** 20 (niedrig, aber viele!)
- **Größe:** 70x70 Pixel
- **Sprite:** 🚁 Emoji
- **Meme-Spruch:** "🚁 Swarm incoming!"
- **Gruppen-Größe:** 5 Dronelings gleichzeitig
- **Erstmalig in Phase:** 1 (Soft Launch 🚀)
- **Schwierigkeit:** Mittel (durch Anzahl)

#### 🛡️ **Custodian (Shielded Tank)**
- **Beschreibung:** Geschützter Tank - nur von oben/unten verwundbar
- **Verhalten:** Frontschild - nur von Seiten angreifbar
- **KI-Typ:** Shielded (directional defense)
- **Geschwindigkeit:** 120 (sehr langsam)
- **HP:** 50 (hoch)
- **Größe:** 100x100 Pixel
- **Sprite:** 🛡️ Emoji
- **Meme-Spruch:** "🛡️ Protected!"
- **Schild-Richtung:** Front (vorne geschützt)
- **Erstmalig in Phase:** 4 (Regulation Run 🧑‍💼)
- **Schwierigkeit:** Mittel-Schwer

#### 💥 **FireCracker (Exploder)**
- **Beschreibung:** Explodiert bei Tod - erzeugt Splitter
- **Verhalten:** Explodiert on death - spawnt 6 Splitter
- **KI-Typ:** Exploder (death explosion)
- **Geschwindigkeit:** 220 (mittel-schnell)
- **HP:** 25
- **Größe:** 80x80 Pixel
- **Sprite:** 💥 Emoji
- **Meme-Spruch:** "💥 Boom!"
- **Explosions-Radius:** 100 Pixel
- **Splitter-Anzahl:** 6 Stück
- **Erstmalig in Phase:** 2 (Paper Panic 👋)
- **Schwierigkeit:** Mittel (gefährlich on death!)

#### 🏦 **SBF (Tank)**
- **Beschreibung:** Massiver Tank mit extrem hohem HP
- **Verhalten:** Langsame Tank-Bewegung
- **KI-Typ:** Basic (aber mit Tank-Stats)
- **Geschwindigkeit:** 100 (extrem langsam)
- **HP:** 150 (sehr hoch!)
- **Größe:** 120x120 Pixel
- **Sprite:** 🏦 Emoji
- **Meme-Spruch:** "🏦 Too big to fail!"
- **Erstmalig in Phase:** 3 (Candle Crash 📉)
- **Schwierigkeit:** Schwer (viel HP)

#### ⚡ **Do Kwon (Elite)**
- **Beschreibung:** Elite-Feind - schnell und gefährlich
- **Verhalten:** Sehr schnelle Elite-Bewegung
- **KI-Typ:** Basic (aber mit Elite-Stats)
- **Geschwindigkeit:** 320 (sehr schnell!)
- **HP:** 80 (hoch)
- **Größe:** 100x100 Pixel
- **Sprite:** ⚡ Emoji
- **Meme-Spruch:** "⚡ UST goes brr!"
- **Erstmalig in Phase:** 4 (Regulation Run 🧑‍💼)
- **Schwierigkeit:** Sehr schwer

---

### **Neue Gegner (v3.9)**

#### 🔄 **Splitter**
- **Beschreibung:** Teilt sich beim Tod in 2 kleinere Gegner
- **Verhalten:** Splitter - spawnt 2 Mini-Enemies on death
- **KI-Typ:** Splitter (division mechanic)
- **Geschwindigkeit:** 210 (mittel)
- **HP:** 40
- **Größe:** 90x90 Pixel
- **Sprite:** 🔄 Emoji
- **Meme-Spruch:** "🔄 Double trouble!"
- **Split-Anzahl:** 2 Mini-Enemies
- **Split-HP:** 15 HP pro Mini-Enemy
- **Erstmalig in Phase:** 2 (Paper Panic 👋)
- **Schwierigkeit:** Mittel-Schwer

#### 💚 **Healer**
- **Beschreibung:** Heilt nahegelegene Gegner periodisch
- **Verhalten:** Support-Unit - heilt andere Enemies
- **KI-Typ:** Healer (support mechanic)
- **Geschwindigkeit:** 110 (sehr langsam)
- **HP:** 60
- **Größe:** 95x95 Pixel
- **Sprite:** 💚 Emoji
- **Meme-Spruch:** "💚 Healing the pump!"
- **Heal-Reichweite:** 200 Pixel Radius
- **Heal-Menge:** 10 HP pro Tick
- **Heal-Intervall:** 3000ms zwischen Heals
- **Erstmalig in Phase:** 3 (Candle Crash 📉)
- **Schwierigkeit:** Schwer (macht andere stärker!)

#### 💥 **Kamikaze**
- **Beschreibung:** Stürzt sich direkt auf den Adler - extrem schnell!
- **Verhalten:** Rush Attack - rennt direkt auf den Adler zu
- **KI-Typ:** Kamikaze (rush mechanic)
- **Geschwindigkeit:** 400 (extrem schnell!)
- **Rush-Speed:** 600 (beim Charging noch schneller!)
- **HP:** 20 (niedrig)
- **Größe:** 75x75 Pixel
- **Sprite:** 💥 Emoji
- **Meme-Spruch:** "💥 All in! YOLO!"
- **Explosions-Schaden:** 2 HP bei Impact
- **Erstmalig in Phase:** 4 (Regulation Run 🧑‍💼)
- **Schwierigkeit:** Sehr schwer (sehr gefährlich!)

#### 🛡️ **Shield Bearer**
- **Beschreibung:** Hat ein rotierendes Schild - von hinten angreifen!
- **Verhalten:** Rotating Shield - Schild dreht sich konstant
- **KI-Typ:** Shielded (rotating defense)
- **Geschwindigkeit:** 145 (langsam)
- **HP:** 70
- **Größe:** 100x100 Pixel
- **Sprite:** 🛡️ Emoji
- **Meme-Spruch:** "🛡️ Protected by the shield!"
- **Schild-Rotationsgeschwindigkeit:** 2 Radians/Sekunde
- **Schild-Abdeckung:** 108 Grad (π * 0.6)
- **Erstmalig in Phase:** 4 (Regulation Run 🧑‍💼)
- **Schwierigkeit:** Mittel-Schwer

---

## 🎁 Bonus-Items & Power-Ups

### **Sammel-Power-Ups (Pickup)**

#### 🛡️ **Freedom Shield**
- **Name:** Freedom Shield
- **Icon:** 🛡️
- **Beschreibung:** Schützt vor 1 Treffer
- **Effekt:** Blockiert den nächsten Schadens-Treffer komplett
- **Dauer:** 8000ms (8 Sekunden)
- **Spawn-Chance:** 15%
- **Aktivierung:** Pickup (automatisch beim Aufsammeln)
- **Visuell:** 🛡️ Icon neben dem Adler

#### ⚡ **Freedom Strike**
- **Name:** Freedom Strike
- **Icon:** ⚡
- **Beschreibung:** Blitz zerstört ALLE Gegner auf dem Screen!
- **Effekt:** Destroys all enemies instantly
- **Dauer:** 1000ms (visuelle Effekt-Dauer)
- **Spawn-Chance:** 8%
- **Aktivierung:** Pickup
- **Visuell:** Blitz-Animation über gesamten Screen
- **Punkte:** Gibt Punkte für jeden zerstörten Gegner

#### 👁️ **Κρόνος Belle (Belle Mod)**
- **Name:** Κρόνος Belle
- **Icon:** 👁️
- **Beschreibung:** MOD-Schutz - löscht FUD und bannt Jeeters
- **Effekt:** Blockiert alle Treffer, violettes Aura
- **Dauer:** 8000ms (8 Sekunden)
- **Spawn-Chance:** 12%
- **Aktivierung:** Pickup
- **Sound:** "Moderator online."
- **Text:** "Κρόνος Belle is watching 👁️"
- **Visuell:** Violette Aura um den Adler, pulsiert bei < 3s Restzeit

#### 🦌 **Vesper0x (Extra Life)**
- **Name:** Vesper0x
- **Icon:** 🦌
- **Beschreibung:** America.Fun Team Member - gewährt Extra-Leben!
- **Effekt:** +1 Leben (max. 3 Leben)
- **Dauer:** Sofort (instant pickup)
- **Spawn-Chance:** 5% (selten!)
- **Aktivierung:** Pickup
- **Sound:** "Vesper0x appears!"
- **Text:** "Vesper0x grants you an extra life! 🦌❤️"
- **Visuell:** Grüner Glow beim Spawn (0x00FF00)

#### 🕶️ **CryptoActing's Early Entry**
- **Name:** CryptoActing's Early Entry
- **Icon:** 🕶️
- **Beschreibung:** Der Early Believer - High Risk, High Reward!
- **Effekt:**
  - **3x Score Multiplier** (alle Punkte werden verdreifacht!)
  - **+20% Gegner-Geschwindigkeit** (höheres Risiko!)
  - **Perfect Entry Bonus:** +250 XP wenn KEIN Schaden genommen wird
- **Dauer:** 12000ms (12 Sekunden)
- **Spawn-Chance:** 8% (selten, aber nicht zu selten)
- **Aktivierung:** Pickup
- **Sound:** "You got in before the rest!"
- **Collection Sound:** video-game-bonus-323603.mp3
- **Text:** "CryptoActing entered early — market goes nuts! 🕶️"
- **Visuell:**
  - Cyan/türkise Neon-Trail (0x00FFFF) alle 50ms
  - Goldener Kern (0xFFD700) für Flammen-Effekt
  - Moderne weiße Panel-Notification mit blauer Unterstreichung
- **Strategie:** Riskantes, aber sehr lohnendes Pickup - perfekt für Score-Runs!

#### 🧱 **Danxx Protocol**
- **Name:** Danxx Protocol
- **Icon:** 🧱
- **Beschreibung:** The Market Stabilizer - Bringt Ordnung ins Chaos!
- **Effekt:**
  - **-30% Coin Speed** (Coins fallen langsamer - leichter zu sammeln!)
  - **+20% XP Bonus** pro gesammelter Coin
  - **Halbierte Enemy Spawn Rate** (50% weniger Gegner spawnen)
  - **Magnet Active** (Coins werden automatisch angezogen)
- **Dauer:** 8000ms (8 Sekunden)
- **Spawn-Chance:** 5% (medium-rare)
- **Aktivierung:** Pickup
- **Sound:** "When chaos hits, he brings order to the chain!"
- **Collection Sound:** game-bonus-144751.mp3
- **Text:** "Danxx initiated the Buyback Protocol. 🧱"
- **Visuell:**
  - Grüne Blockchain-Hexagon-Schilder (0x00FF00) alle 200ms
  - Flickernde Schild-Animation um den Adler
  - Moderne weiße Panel-Notification mit grüner Unterstreichung
- **Strategie:** Defensive Power-Up - perfekt wenn das Chaos zu groß wird!

#### 🌹 **Rose's Mod Mode**
- **Name:** Rose's Mod Mode
- **Icon:** 🌹
- **Beschreibung:** The Telegram Guardian - Muted die FUD!
- **Effekt:**
  - **Freezt FUD-Enemies:** Jeeter, Paper Hands, Gary, DokWon, 4meme, Pump.fun werden eingefroren (🔇 Icon)
  - **Clear All Projectiles:** Alle feindlichen Projektile werden gelöscht
  - **Magnet Boost:** 1.3x Magnet-Reichweite
  - **+10% XP Bonus** auf alle Coins
- **Dauer:** 10000ms (10 Sekunden)
- **Spawn-Chance:** 6% (häufig, aber angenehm)
- **Aktivierung:** Pickup
- **Sound:** "She mutes the FUD and keeps the vibes high."
- **Collection Sound:** collect-points-190037.mp3
- **Text:** "Rose muted the FUD! The chat is peaceful. 🌹"
- **Visuell:**
  - Rosa-blaue Partikelwolke (Hot Pink 0xFF69B4 + Sky Blue 0x87CEEB) alle 150ms
  - Herz-Emotes (💬) floaten nach oben (30% Chance)
  - Gefrorene Enemies haben 🔇 Mute-Icon und 60% Alpha
  - Moderne weiße Panel-Notification mit rosa Unterstreichung
- **Strategie:** Feel-Good Power-Up - perfekt für entspanntes Gameplay und visuelle Freude!

---

### **Automatische Power-Ups (Triggered)**

#### 🧲 **Buyback Mode**
- **Name:** Buyback Mode
- **Icon:** 🧲
- **Beschreibung:** Zieht ALLE Coins automatisch an
- **Effekt:** Magnet-Radius 400 Pixel - Coins fliegen zum Adler
- **Dauer:** 5000ms (5 Sekunden)
- **Aktivierung:** Sammle 3x $AOL Coins
- **Sound:** "Buyback activated!"
- **Text:** "Coins fly to you like liquidity 🧲💸"

---

## 💰 Münzen & Sammelobjekte

### **Basis-Coins**

#### 🐕 **$BONK**
- **Name:** $BONK
- **Beschreibung:** Common Meme Coin
- **Punkte:** 5
- **Icon:** 🐕
- **Farbe:** Orange (#FF6B00)
- **Häufigkeit:** Sehr häufig
- **Spawn-Gewicht:** 40%

#### 🦅 **$AOL (America On-Line)**
- **Name:** $AOL
- **Beschreibung:** Main currency - America.Fun Platform Token
- **Punkte:** 10
- **Icon:** 🦅
- **Farbe:** Rot/Blau (America colors)
- **Häufigkeit:** Häufig
- **Spawn-Gewicht:** 30%
- **Spezial:** 3x $AOL = Buyback Mode (🧲 Magnet)

#### 💵 **$USD1**
- **Name:** $USD1
- **Beschreibung:** Stable Coin - niedrige Punkte, aber sicher
- **Punkte:** 2
- **Icon:** 💵
- **Farbe:** Grün
- **Häufigkeit:** Selten
- **Spawn-Gewicht:** 10%

---

### **Spezial-Coins**

#### 🍔 **$BURGER**
- **Name:** $BURGER
- **Beschreibung:** High-value power coin - 2x multiplier!
- **Punkte:** 25
- **Effekt:** 2x Score Multiplier für 5 Sekunden
- **Dauer:** 5000ms
- **Icon:** 🍔
- **Farbe:** Gelb/Braun
- **Häufigkeit:** Selten
- **Spawn-Gewicht:** 5%
- **Sound:** "Burger Power!"

#### 🦾 **$VALOR**
- **Name:** $VALOR
- **Beschreibung:** Legendary - triggert VALOR Mode!
- **Punkte:** 25
- **Effekt:**
  - Invincibility für 5 Sekunden
  - 2x Score Multiplier
  - Goldener Glow
  - Aggressive Musik
- **Dauer:** 5000ms
- **Icon:** 🦾
- **Farbe:** Gold (#FFD700)
- **Häufigkeit:** Sehr selten
- **Spawn-Gewicht:** 2%
- **Sound:** "VALOR MODE ACTIVATED!"
- **Visuell:** Goldener Glow + goldene Partikel

---

## 🎮 Spielphasen

### **Phase 1: Soft Launch 🚀**
- **Dauer:** 60 Sekunden
- **Gegner:** Jeeter, Droneling (Swarm Intro)
- **Schwierigkeit:** Easy
- **Geschwindigkeits-Multiplikator:** 1.3x
- **Spawn-Rate:** 5000ms (langsam)
- **Hintergrund:** Weiß (#FFFFFF)
- **Beschreibung:** "Get started, collect burgers!"

### **Phase 2: Paper Panic 👋**
- **Dauer:** 60 Sekunden
- **Gegner:** Jeeter, Paper Hands, Droneling, FireCracker, Splitter
- **Schwierigkeit:** Medium
- **Geschwindigkeits-Multiplikator:** 1.5x (+50% Speed!)
- **Spawn-Rate:** 4500ms
- **Hintergrund:** Alice Blue (#F0F8FF)
- **Beschreibung:** "Watch out for fake coins! Speed +50%"

### **Phase 3: Candle Crash 📉**
- **Dauer:** 60 Sekunden
- **Gegner:** Jeeter, Paper Hands, Red Candles, 4meme, HawkEye, Droneling, FireCracker, SBF, Splitter, Healer
- **Schwierigkeit:** Hard
- **Geschwindigkeits-Multiplikator:** 1.7x
- **Spawn-Rate:** 4000ms
- **Hintergrund:** Seashell (#FFF5E6)
- **Beschreibung:** "Barriers incoming! Higher difficulty"

### **Phase 4: Regulation Run 🧑‍💼**
- **Dauer:** 60 Sekunden
- **Gegner:** Jeeter, Paper Hands, Red Candles, Gary, 4meme, Pump.fun, HawkEye, Custodian, FireCracker, SBF, DokWon, Kamikaze, Shield Bearer
- **Schwierigkeit:** Very Hard
- **Geschwindigkeits-Multiplikator:** 1.9x
- **Spawn-Rate:** 3500ms
- **Hintergrund:** Linen (#FFF0E6)
- **Beschreibung:** "Lawsuit storm! Power-ups needed"

### **Phase 5: Bear Market Finale 🐻**
- **Dauer:** 60 Sekunden
- **Gegner:** Paper Hands, Red Candles, Gary, 4meme, Pump.fun, Bear Boss, HawkEye, Custodian, FireCracker, SBF, DokWon, CZ Boss, Splitter, Healer, Kamikaze, Shield Bearer
- **Schwierigkeit:** Extreme
- **Geschwindigkeits-Multiplikator:** 2.1x
- **Spawn-Rate:** 1800ms (sehr schnell!)
- **Hintergrund:** Misty Rose (#FFE6E6)
- **Beschreibung:** "Chaos + Freedom final phase"

### **Phase 6: WAGMI Mode 🦅**
- **Dauer:** Endlos (-1)
- **Gegner:** ALLE Gegner (Full Roster)
- **Schwierigkeit:** Variable (steigt kontinuierlich)
- **Geschwindigkeits-Multiplikator:** 2.3x (höchste Geschwindigkeit!)
- **Spawn-Rate:** 1500ms
- **Hintergrund:** Lavender Blush (#FFE6F0)
- **Beschreibung:** "Endless fun, meme alerts & speed boosts!"

---

## 🔫 Waffen-System

### **Basis-Waffen**

#### **Eagle Claws (Standard)**
- **Name:** Eagle Claws
- **Beschreibung:** Standard-Angriff - Adler-Krallen
- **Schaden:** 10 HP
- **Feuerrate:** 500ms
- **Kosten:** 0 (Unlocked von Anfang an)
- **Upgrades:** Keine

#### **Freedom Gun (Pistole)**
- **Name:** Freedom Gun
- **Beschreibung:** Basis-Schusswaffe - mittlerer Schaden
- **Schaden:** 15 HP
- **Feuerrate:** 400ms
- **Projektil:** Kugel
- **Kosten:** Score-basiert freischaltbar
- **Upgrades:** Damage +5, Fire Rate -50ms

---

### **Premium-Waffen**

#### **Lightning Bolt (Blitz)**
- **Name:** Lightning Bolt
- **Beschreibung:** Elektro-Schuss - hoher Schaden, langsame Rate
- **Schaden:** 35 HP
- **Feuerrate:** 1000ms
- **Projektil:** Blitz
- **Visuell:** Gelber Lightning-Strahl
- **Kosten:** 500 Score
- **Upgrades:** Damage +10, Chain Lightning (trifft 2 Ziele)

#### **Laser Cannon**
- **Name:** Laser Cannon
- **Beschreibung:** Durchgehender Laser - hoher DPS
- **Schaden:** 8 HP pro Tick (konstant)
- **Feuerrate:** Konstant (continuous beam)
- **Projektil:** Laser-Beam
- **Visuell:** Roter Laser-Strahl
- **Kosten:** 1000 Score
- **Upgrades:** Beam Width +50%, Damage +3/tick

---

## 📊 Statistiken & Meta-Info

### **Gegner nach Schwierigkeit**

**Einfach (HP < 30):**
- Jeeter (25 HP)
- Droneling (20 HP)
- Gary (25 HP)
- Kamikaze (20 HP)
- FireCracker (25 HP)

**Mittel (HP 30-50):**
- Paper Hands (30 HP)
- Red Candles (35 HP)
- 4meme (28 HP)
- Pump.fun (30 HP)
- HawkEye (35 HP)
- Splitter (40 HP)
- Custodian (50 HP)

**Schwer (HP 60-100):**
- Healer (60 HP)
- Shield Bearer (70 HP)
- DokWon (80 HP)

**Boss/Elite (HP > 100):**
- SBF (150 HP)
- Bear Boss (200 HP)
- CZ Boss (300 HP)

---

### **Power-Up Spawn-Chancen**

| Power-Up | Spawn % | Seltenheit |
|----------|---------|------------|
| Freedom Shield | 15% | Common |
| Belle Mod | 12% | Common |
| Freedom Strike | 8% | Uncommon |
| CryptoActing | 8% | Uncommon |
| Rose Mod Mode | 6% | Uncommon |
| Danxx Protocol | 5% | Rare |
| Vesper0x | 5% | Rare |

---

### **Coin Spawn-Verteilung**

| Coin | Gewicht | Relative Häufigkeit |
|------|---------|---------------------|
| $BONK | 40% | Sehr häufig |
| $AOL | 30% | Häufig |
| $USD1 | 10% | Selten |
| $BURGER | 5% | Sehr selten |
| $VALOR | 2% | Legendär |

---

## 🎯 Strategie-Tipps

### **Gegner-Prioritäten**
1. **Healer** zuerst eliminieren (macht andere stärker!)
2. **Kamikaze** sofort ausweichen (extrem gefährlich!)
3. **Splitter** vorsichtig behandeln (werden zu 2 Gegnern)
4. **Shield Bearer** von hinten angreifen
5. **HawkEye** in Deckung gehen (gezielte Schüsse)

### **Power-Up Synergien**
- **CryptoActing + VALOR Mode** = 6x Score Multiplier! (High Risk!)
- **Danxx + Belle Mod** = Ultimative Defensive (keine Gegner, kein Schaden)
- **Rose Mod Mode + Freedom Strike** = Alle Gegner frozen + Lightning Clean-Up
- **Buyback Mode + Burger** = Automatischer Coin-Collection mit 2x Multiplier

### **Phasen-Überlebens-Tipps**
- **Phase 1-2:** Fokus auf Coin-Collection, Upgrades kaufen
- **Phase 3-4:** Power-Ups sammeln, keine Risks
- **Phase 5:** Belle Mod und Shield sind essentiell
- **Phase 6 (WAGMI):** Nur mit starken Waffen + Power-Ups überleben

---

## 📝 Version History

- **v3.9.3:** Rose Mod Mode visuell komplettiert (pink-blue particles)
- **v3.9:** Neue Gegner (Splitter, Healer, Kamikaze, Shield Bearer)
- **v3.8:** CryptoActing + Danxx Protocol implementiert
- **v3.5:** XP-System deaktiviert, Score-basiertes Upgrade-System
- **v3.0:** Weapon notification fix, enemy speed variance

---

**🦅 WAGMI! We're All Gonna Make It!**
