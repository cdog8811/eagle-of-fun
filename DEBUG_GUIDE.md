# Debug-Anleitung für Eagle of Fun

## Problem: Keine Hindernisse oder Münzen erscheinen

### Schritte zum Debuggen:

1. **Spiel starten:**
   ```bash
   npm run dev
   ```

2. **Browser öffnen:**
   - Das Spiel sollte automatisch öffnen
   - Falls nicht, gehe zu `http://localhost:3000`

3. **Console öffnen:**
   - Chrome/Firefox: F12 oder Rechtsklick → "Untersuchen" → "Console"
   - Safari: Entwickler → JavaScript-Console

4. **Spiel starten:**
   - Klicke auf "Start Flight"
   - Klicke EINMAL im Spiel oder drücke SPACE, um das Spiel zu starten
   - Der Adler sollte flattern

5. **Console-Ausgabe beobachten:**

   Du solltest sehen:
   ```
   Spawned top obstacle, total obstacles: 1
   Spawned collectible: AOL total: 1
   Obstacles: 2 Collectibles: 1
   ```

   Wenn du diese Meldungen siehst, werden Objekte erstellt.

### Mögliche Probleme:

#### Problem 1: Keine Console-Logs
- **Ursache**: Das Spiel wurde nicht gestartet
- **Lösung**: Klicke oder drücke SPACE nach "Start Flight"

#### Problem 2: Objekte spawnen, aber sind nicht sichtbar
- **Ursache**: Grafiken werden möglicherweise außerhalb des Bildschirms gezeichnet
- **Lösung**: Überprüfe die Koordinaten in der Console

#### Problem 3: "Spawned" Meldungen erscheinen, aber keine "Obstacles: X"
- **Ursache**: Update-Loop läuft nicht
- **Lösung**: Überprüfe ob TypeScript-Fehler vorliegen

### Schnelltest:

Füge temporär diese Zeile in `GameScene.ts` in der `create()` Methode hinzu (Zeile 35):

```typescript
// Testhindernis direkt sichtbar machen
this.add.rectangle(400, 300, 60, 200, 0xFF0000);
this.add.circle(400, 300, 30, 0xFFFF00);
```

Wenn du ein rotes Rechteck und einen gelben Kreis siehst, funktioniert das Rendering.

### Änderungen die gemacht wurden:

1. **Spawn-Intervall**: Von 2000ms auf 1500ms reduziert
2. **Erstes Spawn**: Nach 500ms statt 1500ms
3. **Münz-Wahrscheinlichkeit**: Von 50% auf 80% erhöht
4. **Debug-Logs**: Hinzugefügt in spawn und update

### Nächste Schritte:

Wenn das Problem weiterhin besteht, bitte:
1. Screenshot der Browser-Console senden
2. Beschreiben, was genau passiert (oder nicht passiert)
3. Browser und Version angeben

## Sofortiger visueller Test

Ersetze temporär die `spawnObstacle()` Funktion mit dieser Version für einen visuellen Test:

```typescript
private spawnObstacle(): void {
  const height = this.cameras.main.height;
  const width = this.cameras.main.width;

  // EINFACHER TEST: Sichtbare rote Rechtecke
  const testRect1 = this.add.rectangle(width - 50, 200, 60, 150, 0xFF0000);
  const testRect2 = this.add.rectangle(width - 50, 450, 60, 150, 0xFF0000);

  console.log('TEST: Spawned visual test rectangles');
}
```

Wenn du nun rote Rechtecke von rechts nach links fliegen siehst, ist das Bewegungssystem OK.
