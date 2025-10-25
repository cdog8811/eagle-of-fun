# GameScene v3.8 Refactoring

## Overview

GameScene wurde von **5023 Zeilen auf 666 Zeilen** reduziert (**87% Reduktion**) durch Auslagerung der Logik in Core-Systeme.

## Neue Datei

- **GameScene_v38.ts** (666 Zeilen) - Die neue, schlanke GameScene
- **GameScene.ts** (5023 Zeilen) - Die alte Version (bleibt erstmal erhalten für Referenz)

## Architektur

### Core Systems (src/core/)

1. **EagleController** - Player-Steuerung
   - Bewegung (WASD/Arrows)
   - Lives-System (3 Leben)
   - Invincibility nach Schaden (2s mit Blink-Animation)
   - Shield-System
   - Speed-Boosts (Upgrades + Power-ups)
   - Callbacks: onDamage, onDeath, onLifeGain

2. **ProjectileManager** - Projektil-Verwaltung
   - Object Pooling (max 100 Bullets)
   - Spread Shots (Eagle Spread: 3 Pellets, 18°)
   - Pierce Mechanics (Rail AOL: 3 Enemies)
   - Splash Damage (Burger Mortar)
   - Auto-Cleanup bei Out-of-Bounds

3. **EnemyManager** - Enemy-Spawning & AI
   - Phase-basierte Spawn-Pools
   - HP-Scaling mit Difficulty-Multiplier
   - Elite-System (2x HP, rote Färbung)
   - 6 AI-Typen: straight, zigzag, sniper, swarm, shielded, exploder
   - Particle-Explosionen bei Tod
   - Callbacks: onEnemyDeath

4. **PowerUpSystem** - Power-up-Verwaltung
   - 6 Typen: shield, damage, speed, magnet, invincibility, valor
   - Active Effects Tracking mit Timern
   - Pulsing-Animationen
   - Auto-Removal nach 10s
   - Callbacks: onPowerUpCollected, onEffectExpired

5. **ScoringSystem** - Punkteverwaltung
   - Coin-Scoring (BONK: 2, AOL: 6, BURGER: 12)
   - Enemy-Scoring mit Difficulty-Multiplier
   - Combo-System (4s base timer, +0.25s pro Kill, max 8s)
   - Style-Bonuses (Aerial Ace, Flawless30, Shield Breaker, etc.)
   - Valor-Multipliers (Rising 1.5x, Unleashed 3.0x, Afterglow 1.5x)
   - Floating Score Texts
   - Callbacks: onScoreChange, onComboChange, onStyleBonus

6. **PhaseController** - Phasen-Verwaltung
   - Score-basierte Phase-Transitions
   - Market-Phase-Toggle
   - Boss-Trigger (Score/Zeit-basiert)
   - Callbacks: onPhaseChange, onMarketPhaseStart, onMarketPhaseEnd, onBossTrigger

7. **AudioSystem** - Audio-Verwaltung
   - SFX: Weapon Fire, Hits, Deaths, Coins, Power-ups, UI
   - Music: Looping mit Fade In/Out
   - Separate Volume-Controls (SFX/Music)
   - Mute-Toggle mit localStorage-Persistenz
   - Auto-Cleanup nach Sound Complete

8. **UIHooks** - UI-Event-Bridge
   - Verbindung zwischen GameScene und UIScene
   - Update-Methoden für: Score, XP, Coins, Combo, Lives, Shield
   - Power-up-Display-Sync
   - Mission-Progress-Updates
   - Boss-HP-Bar
   - Phase-Notifications
   - Style-Bonus-Popups

### Legacy Systems (bleiben vorerst erhalten)

- **MissionManager** - Missions-System (Singleton)
- **WeaponManagerSimple** - Waffen-Wechsel
- **BossManagerV37** - Boss-Logik
- **BandanaPowerUp** - Spezielle Power-up-Logik
- **XPSystem** - Level-System (Singleton)
- **UpgradeSystem** - Upgrade-Verwaltung (Singleton)

## Vorteile

✅ **Wartbarkeit** - Jedes System <400 Zeilen, klare Verantwortlichkeiten
✅ **Testbarkeit** - Systeme können isoliert getestet werden
✅ **Performance** - Object Pooling, Debouncing, optimierte Updates
✅ **Erweiterbarkeit** - Neue Features einfach in entsprechendem System
✅ **Lesbarkeit** - GameScene zeigt klaren Spielablauf ohne Details

## Migration Path

### Jetzt (Phase 0 Part 3)
1. GameScene_v38.ts erstellt
2. Core-Systeme fertiggestellt
3. Alte GameScene.ts bleibt als Referenz

### Nächste Schritte
1. GameScene_v38.ts testen
2. Fehlende Features aus alter GameScene portieren
3. GameScene.ts → GameScene_old.ts umbenennen
4. GameScene_v38.ts → GameScene.ts umbenennen
5. main.ts anpassen

## Verwendung

```typescript
// Core Systems initialisieren
this.eagleController = new EagleController(this);
this.projectileManager = new ProjectileManager(this);
this.enemyManager = new EnemyManager(this);
// ... etc

// Init aufrufen
this.eagleController.init(3); // 3 lives
this.projectileManager.init();
// ... etc

// Callbacks setup
this.eagleController.onDamage(() => {
  this.audioSystem.playDamage();
});

this.enemyManager.onEnemyDeath((enemy, x, y) => {
  this.scoringSystem.addEnemyScore(enemy.enemyId, x, y, false);
});

// Update loop
update(time: number, delta: number): void {
  this.eagleController.update(delta);
  this.projectileManager.update(delta);
  this.enemyManager.update(delta);
  // ... etc
}

// Cleanup
shutdown(): void {
  this.eagleController.destroy();
  this.projectileManager.destroy();
  // ... etc
}
```

## Nächste Phase

**Phase 1**: Neue Enemy-Typen implementieren
- HawkEye (Sniper)
- Droneling (Swarm)
- Custodian (Shielded)
- FireCracker (Exploder)

Alle Configs sind bereits in `src/config/Enemies.ts` vorhanden!
