# Eagle Sprite Animation Guide für Buildbox

## Übersicht
Dein Eagle-Charakter benötigt verschiedene Animationszustände für ein professionelles Spielerlebnis in Buildbox.

## Empfohlene Sprite-Größe
**512×512 Pixel** pro Frame (mit transparentem Hintergrund)
- Gibt genug Platz für Flügelbewegungen
- Verhindert Abschneiden der Animation
- Optimale Qualität für Mobile und Desktop
- Power-of-2 Größe (besser für Performance)

Alternative: **256×256 Pixel** (für kleinere Dateigröße, immer noch gut)

## Benötigte Animationen

### 1. IDLE Animation (Schwebend)
**Frames benötigt: 4-6 Frames**
**Dateinamen:**
- `eagle_idle_01.png`
- `eagle_idle_02.png`
- `eagle_idle_03.png`
- `eagle_idle_04.png`

**Beschreibung:**
- Eagle schwebt in der Luft
- Flügel in neutraler Position (leicht ausgebreitet)
- Minimale Auf-/Ab-Bewegung des Körpers
- Flügel bewegen sich sanft (kleiner Flügelschlag)

**Animation Loop:** 0.8-1.2 Sekunden für kompletten Zyklus

---

### 2. FLAP UP Animation (Hochfliegen)
**Frames benötigt: 3-4 Frames**
**Dateinamen:**
- `eagle_flap_01.png`
- `eagle_flap_02.png`
- `eagle_flap_03.png`

**Beschreibung:**
- Frame 1: Flügel nach oben ausgebreitet (voller Flügelschlag nach oben)
- Frame 2: Flügel in mittlerer Position (Übergang)
- Frame 3: Flügel nach unten gezogen (kraftvoller Schlag nach unten)
- Körper leicht nach oben geneigt (ca. 10-15°)

**Animation Geschwindigkeit:** 0.15-0.2 Sekunden pro Frame
**Trigger:** Wenn Spieler tippt/klickt

---

### 3. FLAP DOWN / DIVE Animation (Sturzflug)
**Frames benötigt: 2-3 Frames**
**Dateinamen:**
- `eagle_dive_01.png`
- `eagle_dive_02.png`

**Beschreibung:**
- Flügel angelegt/zusammengefaltet
- Körper nach unten geneigt (ca. 20-30°)
- Kopf zeigt nach unten
- Stromlinienförmige Haltung

**Animation Geschwindigkeit:** 0.2 Sekunden pro Frame
**Trigger:** Wenn Eagle fällt (keine Eingabe)

---

### 4. CRASH Animation (Kollision)
**Frames benötigt: 3-4 Frames**
**Dateinamen:**
- `eagle_crash_01.png`
- `eagle_crash_02.png`
- `eagle_crash_03.png`

**Beschreibung:**
- Frame 1: Normaler Zustand
- Frame 2: Eagle wird getroffen (Augen geschlossen, Körper zusammengezogen)
- Frame 3: Eagle trudelt/rotiert
- Optional Frame 4: Eagle fällt komplett

**Animation Geschwindigkeit:** 0.1-0.15 Sekunden pro Frame
**Trigger:** Bei Kollision mit Jeeter

---

## Schritt-für-Schritt Anleitung

### Phase 1: Sprite-Erstellung

#### Option A: Mit Bildbearbeitungssoftware (Photoshop/GIMP/Figma)

1. **Basis-Template erstellen:**
   - Erstelle eine neue Datei: 512×512px
   - Hintergrund: Transparent (PNG)
   - Importiere dein aktuelles Eagle-Bild

2. **Für jeden Frame:**
   - Dupliziere die Ebene
   - Rotiere/transformiere die Flügel
   - Neige den Körper je nach Animation
   - Exportiere als PNG (512×512px)

3. **Flügel-Positionen:**
   - **Idle:** Flügel 20-30° von Körper weg
   - **Flap Up:** Flügel 60-80° nach oben
   - **Flap Down:** Flügel 0-10° (fast geschlossen)
   - **Crash:** Flügel chaotisch/asymmetrisch

#### Option B: Mit Online Sprite-Tools

1. **Piskel App** (https://www.piskelapp.com/)
   - Kostenlos, browser-basiert
   - Perfekt für Pixel-Art
   - Kann Sprite-Sheets erstellen

2. **Aseprite** (Kostenpflichtig, ~$20)
   - Professionelles Pixel-Art Tool
   - Beste Option für detaillierte Animationen

---

### Phase 2: Buildbox Integration

#### Schritt 1: Sprite-Sheet vorbereiten

**Option 1: Einzelne Frames (Einfacher)**
- Alle Frames als separate PNG-Dateien
- Buildbox importiert sie einzeln

**Option 2: Sprite-Sheet (Professioneller)**
- Alle Frames in einer Datei anordnen
- Beispiel Layout für 512px Frames:
  ```
  Idle 1  | Idle 2  | Idle 3  | Idle 4
  Flap 1  | Flap 2  | Flap 3  | Dive 1
  Dive 2  | Crash 1 | Crash 2 | Crash 3
  ```
- Gesamtgröße: 2048×1536px (4 Spalten × 3 Reihen)

#### Schritt 2: In Buildbox importieren

1. **Asset Import:**
   - Öffne dein Buildbox-Projekt
   - Gehe zu "Assets" → "Characters"
   - Klicke "Import" oder ziehe PNG-Dateien hinein

2. **Animation Setup:**
   - Wähle deinen Character
   - Öffne "Animation Editor"
   - Für jede Animation:
     - Erstelle neue Animation (z.B. "Idle")
     - Füge Frames hinzu (in richtiger Reihenfolge)
     - Stelle FPS ein (meist 8-12 FPS)
     - Setze Loop (Ja für Idle/Flap, Nein für Crash)

3. **Animation States einrichten:**
   - **Default State:** Idle
   - **On Input State:** Flap Up
   - **On Fall State:** Dive
   - **On Collision State:** Crash

#### Schritt 3: Timing einstellen

```
Animation Settings in Buildbox:

IDLE:
- FPS: 10
- Loop: Yes
- Duration: ~0.4-0.6s pro Zyklus

FLAP UP:
- FPS: 15
- Loop: No (spielt einmal bei Input)
- Duration: ~0.2s total

DIVE:
- FPS: 8
- Loop: Yes
- Duration: kontinuierlich während Fall

CRASH:
- FPS: 12
- Loop: No
- Duration: ~0.3s
- Trigger: Game Over nach Animation
```

---

## Detaillierte Frame-Spezifikationen

### IDLE Frames (Beispiel für 512×512px)

**Frame 1:**
```
- Eagle zentral positioniert
- Flügel: 25° Winkel vom Körper
- Y-Position: Zentriert (256px von oben)
- Rotation: 0°
```

**Frame 2:**
```
- Flügel: 30° Winkel (leicht höher)
- Y-Position: 250px (leicht höher)
- Rotation: 2° nach oben
```

**Frame 3:**
```
- Flügel: 25° Winkel (zurück zu neutral)
- Y-Position: 256px
- Rotation: 0°
```

**Frame 4:**
```
- Flügel: 20° Winkel (leicht tiefer)
- Y-Position: 262px (leicht tiefer)
- Rotation: -2° nach unten
```

### FLAP UP Frames

**Frame 1 (Vorbereitung):**
```
- Flügel: 40° nach oben
- Körper: 0° Rotation
- Beide Flügel symmetrisch hoch
```

**Frame 2 (Kraft):**
```
- Flügel: 75° nach oben (maximale Ausdehnung)
- Körper: 10° nach oben geneigt
- Höchster Punkt der Flügel
```

**Frame 3 (Durchzug):**
```
- Flügel: 10° (nach unten gezogen)
- Körper: 15° nach oben geneigt
- Kraftvoller Schlag nach unten
```

### DIVE Frames

**Frame 1:**
```
- Flügel: 15° angelegt
- Körper: 20° nach unten
- Kopf zeigt nach unten
```

**Frame 2:**
```
- Flügel: 5° fast geschlossen
- Körper: 30° nach unten
- Stromlinienförmig
```

---

## Tools & Ressourcen

### Empfohlene Software:

1. **Kostenlos:**
   - GIMP (https://www.gimp.org/)
   - Krita (https://krita.org/)
   - Piskel (https://www.piskelapp.com/)
   - Paint.NET (Windows)

2. **Kostenpflichtig:**
   - Aseprite ($19.99) - Beste für Pixel Art
   - Adobe Photoshop
   - Affinity Designer

### Nützliche Tutorials:

- Buildbox Animation Tutorial: https://www.buildbox.com/tutorials/
- Sprite Animation Basics: YouTube "2D game character animation"
- Flappy Bird style animations (ähnliches Gameplay)

---

## Buildbox-Spezifische Tipps

### Performance Optimierung:
1. **Sprite-Größe:**
   - Mobile: 256×256px oder 512×512px
   - Desktop: 512×512px oder 1024×1024px

2. **Dateiformat:**
   - PNG-24 mit Transparenz
   - Komprimiere mit TinyPNG vor Import

3. **Frame-Anzahl:**
   - Halte Animationen kurz (3-6 Frames)
   - Mehr Frames = größere App-Größe

### State Machine Setup:

```
Buildbox Character States:

START
  ↓
IDLE (Loop)
  ↓ (On Touch)
FLAP UP (Once)
  ↓ (Auto return)
IDLE or DIVE (basierend auf Velocity)
  ↓ (On Collision)
CRASH (Once)
  ↓
GAME OVER
```

---

## Schnellstart: Minimale Version

Wenn du schnell starten willst, erstelle nur:

1. **2 Idle Frames** (hin und her schweben)
2. **2 Flap Frames** (Flügel hoch, Flügel runter)
3. **1 Dive Frame** (Flügel angelegt)
4. **1 Crash Frame** (zusammengezuckt)

**= 6 Frames total** bei 512×512px

---

## Wichtige Hinweise

✅ **DO:**
- Verwende transparente Hintergründe (PNG)
- Halte den Eagle zentral im Frame
- Nutze Power-of-2 Größen (256, 512, 1024)
- Teste Animationen mit niedriger FPS zuerst

❌ **DON'T:**
- Schneide Flügel nicht ab am Rand
- Ändere die Eagle-Größe zwischen Frames nicht drastisch
- Nutze keine zu hohen Auflösungen (>1024px meist unnötig)
- Vergiss nicht den transparenten Hintergrund

---

## Nächste Schritte

1. **Wähle Software** (GIMP für kostenlos, Aseprite für professionell)
2. **Erstelle Template** (512×512px, transparent)
3. **Zeichne 2-3 Test-Frames** für Idle
4. **Importiere in Buildbox** und teste
5. **Erweitere** mit restlichen Animationen

---

## Support & Fragen

Falls du Hilfe brauchst:
- Buildbox Community: https://www.buildbox.com/forum/
- Discord: Buildbox Official Server
- YouTube: "Buildbox character animation tutorial"

Viel Erfolg mit deinem Eagle of Fun Game! 🦅
