# GameScene v3.8 Migration TODOs

## Bekannte Probleme

### 1. Fehlende Asset-Keys
Die neue GameScene verwendet diese Asset-Keys, die möglicherweise nicht existieren:
- `particle-white` (für Explosionen)
- `coin-bonk`, `coin-aol`, `coin-burger` (Münz-Sprites)
- `powerup-shield`, `powerup-damage`, `powerup-speed`, `powerup-magnet`, `powerup-invincibility`, `powerup-valor`
- `music-game` (Hintergrundmusik)
- SFX: `sfx-weapon-*`, `sfx-enemy-hit`, `sfx-enemy-death`, `sfx-coin-*`, `sfx-powerup-collect`, `sfx-damage`, `sfx-levelup`, `sfx-ui-click`, `sfx-ui-hover`, `sfx-boss-warning`

### 2. Eagle Sprite Methoden
- `playHitAnimation()` - Muss in Eagle.ts existieren oder implementiert werden

### 3. Fehlende Funktionalität aus alter GameScene
Muss noch portiert werden:
- Countdown-System beim Start
- Pause-Funktionalität
- Weapon-Tutorial
- Fake Coins (FTC)
- Lawsuit Papers
- Umfassenderes Collision-System
- Market Phases
- Micro-Events
- Boss-Integration
- USD1 Coins
- Valor Coins

### 4. Config-Anpassungen
- Weapon sprite keys müssen in Weapons.ts config passen
- Enemy sprite keys müssen in Enemies.ts config passen

## Schrittweise Migration

### Phase 1: Minimal lauffähig (JETZT)
- [ ] Assets-Keys prüfen und Fallbacks einbauen
- [ ] Eagle.playHitAnimation() implementieren oder Fallback
- [ ] Testen ob Spiel startet ohne Crash
- [ ] Basic Gameplay testen (Bewegung, Münzen sammeln)

### Phase 2: Core Features portieren
- [ ] Weapon-System vollständig integrieren
- [ ] Enemy AI aus alter GameScene übernehmen
- [ ] Power-up Effekte vervollständigen
- [ ] Scoring exakt wie alte Version

### Phase 3: Advanced Features
- [ ] Market Phases
- [ ] Micro-Events
- [ ] Boss-System
- [ ] Fake Coins & Lawsuit Papers
- [ ] Countdown & Tutorial

### Phase 4: Polish
- [ ] Alle SFX
- [ ] Alle UI-Updates
- [ ] Performance-Tests
- [ ] Bug-Fixes

## Strategie

**Für jetzt**: Fallbacks einbauen, damit das Spiel startet ohne Crash.
**Dann**: Feature für Feature aus alter GameScene portieren.
