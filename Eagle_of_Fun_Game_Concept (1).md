# 🦅 **Eagle of Fun**
### A Meme Game by the America.Fun Community

---

## 🎬 **1. Startscreen**

**Look & Feel:**
- Weißer Hintergrund mit leichtem Glanz-Gradient (hellblau nach weiß)  
- Im Vordergrund: der **American Eagle** mit rotem Bandana (America.Fun-Logo drauf)  
- US-Flagge dezent animiert im oberen Bereich  
- Schwebende $AOL-, $BURGER- und $USD1-Coins fallen langsam nach unten  
- 8-bit Drum-Loop im Hintergrund mit “patriotic trap” Vibe  

**Text:**
> 🦅 *Eagle of Fun*  
> “Avoid the FUD. Stack the $AOL. Be the Meme.”  

**Buttons:**
- ▶️ **Start Flight**
- 🏆 **Leaderboard**
- ℹ️ **How to Play**
- ❤️ **Credits**

---

## 🦅 **2. Charakter**

**The Eagle**  
- Weiß-blauer Körper, goldene Flügel, rote Bandana  
- Augen mit leichter Glow-Animation (determined look)  
- Idle Animation: flattert leicht, Bandana weht  
- Bewegung: „flappy“ physics mit smoother easing

**Skins (freischaltbar):**
| Skin | Beschreibung |
|------|---------------|
| 🧢 **Ogle Mode** | Anzug + Sonnenbrille + Buyback Aura |
| 🐕 **Bonk Pup** | Mini Dog mit Cape |
| 🍔 **Burger Beast** | Eagle mit Burger-Helm |
| 🐋 **WLFI Whale** | Blauer Wal mit Fun-Glasses |

---

## 🎮 **3. Gameplay**

**Mechanik:**  
Wie Flappy Bird, aber:
- du fliegst **durch Memecoin-Obstacles**  
- Ziel: **Coins sammeln**, **FUD vermeiden**, **Buybacks triggern**

**Steuerung:**  
- Klick / Tap / Space = kurzer Auftrieb  
- Je länger du überlebst, desto schneller wird’s  

**Hindernisse:**  
- **FUD Clouds** (grau mit Texten wie “REKT”, “RUG”, “TAX”, “BEAR”)  
- **FUD Rockets** (kommen von der Seite, weichen aus)  
- **Bear Market Walls** (rote Candles als Pfeiler)  

**Collectibles:**
- 💸 $AOL Coin = +5 Punkte  
- 🍔 $BURGER Coin = +3 Punkte  
- 💵 $USD1 Coin = +2 Punkte  
- 🦴 BONK Bone = Power-Up  

---

## ⚡ **4. Powerups / Super Moves**

| Powerup | Effekt | Voice Line |
|----------|---------|-------------|
| 💰 **Buyback Mode (Ogle)** | 5 Sekunden Unverwundbarkeit, Coins werden magnetisch eingesaugt | “BUYBACK ACTIVATED!” |
| 🦅 **Freedom Flight** | Kurzzeitiger Speed-Boost | “TO THE MOON!” |
| 🐕 **Bonk Bark** | Zerstört nächste FUD-Wand | “BONK THAT FUD!” |
| 🍔 **Burger Fuel** | Extra Sprunghöhe +5 Punkte | “Stay juicy!” |

---

## 📊 **5. Score & Game Over**

**Score Breakdown:**
- +1 pro überlebter Sekunde  
- +2–5 pro Coin (je nach Typ)  
- +10 Bonus für jede zerstörte FUD-Wand  
- Multiplikatoren durch Power-Ups  

**Game Over Screen:**
> “You got REKT, Patriot!”  
> “Your final score: {{score}}”  
> “Enter your name for glory 🇺🇸”

Formular:
- Eingabefeld (Name max. 15 Zeichen)  
- Button: „Save & Share“  

---

## 🏆 **6. Leaderboard**

**Design:**  
Saubere Tabelle auf weißem Hintergrund mit glänzenden Gold-, Silber-, Bronze-Rahmen.  

| Platz | Name | Punkte | Title |
|-------|------|---------|--------|
| 1 | OgleGod | 17890 | Buyback Emperor |
| 2 | FunDegen | 16120 | FUD Survivor |
| 3 | BurgerLord | 14500 | Juicy Patriot |

CTA:  
> “Think you can beat the Buyback Emperor? Prove it, degen.”

Buttons:  
- 🔁 „Try Again“  
- 🐦 „Share Score on X“

---

## 🐦 **7. X-Share-Feature**

**Automatischer Posttext:**
> 🦅 Just scored **{{score}}** in **Eagle of Fun!**  
> Avoided FUD & stacked $AOL like a real patriot 🇺🇸  
> Can you beat me? 👉 [america.fun]  
> #EagleOfFun #AmericaIsForFun #WAGMI #AOL #BURGER #USD1  

---

## 🎨 **8. Visual Style**

| Element | Stilbeschreibung |
|----------|------------------|
| Hintergrund | Weiß / leichtes Hellblau, clean, minimalistisch |
| Farben | Rot (#E63946), Blau (#0033A0), Gold (#FBB13C) |
| Typo | Pixel Sans oder Arcade Classic |
| UI | Runde Buttons mit sanftem 3D-Shadow |
| Animation | Smooth easing, kein hektisches Blinken |
| Stimmung | Sauber, meme-patriotisch, high-energy |

---

## 🎧 **9. Sounddesign**

- **Intro-Theme:** 8-bit Trap mit patriotischen Trompeten  
- **Coin Collect:** „Ka-ching“  
- **Buyback:** Bass-Drop + “Buyback initiated!”  
- **Game Over:** Traurige Trompete + Adler-Schrei  
- **Flap:** softer Synth-Wing-Sound  

---

## 👾 **10. Easter Eggs**

- Tippe „1776“ → „Declaration of Memependence“ Pop-Up  
- Erreiche 420 Punkte → Bonk Party Mode (bunter Filter, Beat drop)  
- Wenn du in Buyback Mode 10 Coins in Folge einsaugst → „Infinite Ogle“ freischalten  
- Eingabename „Vesper“ → bekommt geheimen Skin mit goldenen Flügeln  

---

## 🔗 **11. Tech / Integration**

| Komponente | Beschreibung |
|-------------|---------------|
| Engine | Buildbox oder WebGL/Phaser.js |
| Backend | Firebase oder Supabase (Leaderboard, Scores) |
| Sharing | X (Twitter) Intent-URL |
| Responsive | Fullscreen Browser + Mobile Support |
| Speicherung | LocalStorage + optional WalletConnect (Web3 später) |

---

## 🚀 **12. Erweiterungen / Roadmap**

| Version | Feature |
|----------|----------|
| v1.0 | Core Game + Leaderboard + X-Share |
| v1.1 | Wallet-Login + On-Chain Score Save |
| v1.2 | NFT-Skins (Eagle Collection) |
| v2.0 | Multiplayer “Degen Race Mode” |
| v3.0 | Event-Edition ($BURGER Launch Special) |

---

## 💬 **13. Taglines für Marketing**

> 🦅 *“Fly high, dodge FUD, stack fun.”*  
> 💸 *“Every tap is a buyback.”*  
> 🇺🇸 *“Eagle of Fun — proudly built by degens.”*  
> 🍔 *“When in doubt, buy the burger.”*
