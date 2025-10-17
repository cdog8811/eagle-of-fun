# 🎨 Assets Guide - Eagle of Fun

## Overview

This document describes all the assets needed for the game. Currently, the game uses placeholder graphics rendered with Phaser's Graphics API. To enhance the visual quality, replace these with actual image and audio files.

## Image Assets

### Required Dimensions & Formats

- **Format**: PNG with transparency (24-bit or 32-bit)
- **Style**: Clean, minimalist, meme-patriotic

### Character Assets

#### Eagle (Default)
- **File**: `eagle-default.png`
- **Size**: 80x80px
- **Description**: White-blue body, golden wings, red bandana with America.Fun logo
- **Animation frames needed**:
  - `eagle-idle.png` (single frame)
  - `eagle-flap-1.png`, `eagle-flap-2.png`, `eagle-flap-3.png` (wing positions)

#### Skins

1. **Ogle Mode**
   - **File**: `eagle-ogle.png`
   - **Description**: Eagle in suit with sunglasses, buyback aura effect

2. **Bonk Pup**
   - **File**: `eagle-bonk.png`
   - **Description**: Mini dog character with cape

3. **Burger Beast**
   - **File**: `eagle-burger.png`
   - **Description**: Eagle wearing burger helmet

4. **WLFI Whale**
   - **File**: `eagle-whale.png`
   - **Description**: Blue whale with fun glasses

5. **Golden Wings (Vesper)**
   - **File**: `eagle-vesper.png`
   - **Description**: Eagle with golden glowing wings

### Obstacle Assets

#### FUD Cloud
- **Files**: `fud-cloud-1.png` to `fud-cloud-4.png`
- **Size**: 60x variable height
- **Description**: Gray clouds with text overlays:
  - "REKT"
  - "RUG"
  - "TAX"
  - "BEAR"

#### FUD Rocket
- **File**: `fud-rocket.png`
- **Size**: 60x100px
- **Description**: Red rocket with warning symbols

#### Bear Market Wall
- **File**: `bear-wall.png`
- **Size**: 60x variable height
- **Description**: Red candlestick with downward arrow

### Collectible Assets

#### $AOL Coin
- **File**: `coin-aol.png`
- **Size**: 40x40px
- **Description**: Gold coin with "$" or "AOL" symbol
- **Animation**: Optional rotating frames

#### $BURGER Coin
- **File**: `coin-burger.png`
- **Size**: 40x40px
- **Description**: Orange coin with burger emoji or symbol
- **Animation**: Optional rotating frames

#### $USD1 Coin
- **File**: `coin-usd1.png`
- **Size**: 40x40px
- **Description**: Green coin with "$1" symbol
- **Animation**: Optional rotating frames

### Background Assets

#### Main Background
- **File**: `background.png`
- **Size**: 800x600px or tileable
- **Description**: White to light blue gradient with subtle clouds

#### US Flag
- **File**: `flag-usa.png`
- **Size**: 200x100px
- **Description**: US flag with slight transparency for background
- **Animation**: Optional waving frames

### UI Assets

#### Button Normal
- **File**: `button-normal.png`
- **Size**: 240x50px
- **Description**: White rounded rectangle with blue border

#### Button Hover
- **File**: `button-hover.png`
- **Size**: 240x50px
- **Description**: Gold rounded rectangle with blue border

#### Medal Icons
- **Files**: `medal-gold.png`, `medal-silver.png`, `medal-bronze.png`
- **Size**: 40x40px
- **Description**: Medal icons for leaderboard

### Effects

#### Particle Effects
- `particle-star.png` (8x8px) - For coin collection
- `particle-spark.png` (8x8px) - For buyback mode
- `particle-explosion.png` (32x32px) - For game over

#### Power-up Icons
- `powerup-buyback.png` (40x40px)
- `powerup-freedom.png` (40x40px)
- `powerup-bonk.png` (40x40px)
- `powerup-burger.png` (40x40px)

## Audio Assets

### Music

#### Background Music
- **File**: `theme.mp3` or `theme.ogg`
- **Duration**: ~2-3 minutes (loopable)
- **Style**: 8-bit trap with patriotic trumpets
- **BPM**: 120-140
- **Format**: MP3 (128-192kbps) or OGG

### Sound Effects

#### Gameplay Sounds

1. **Flap/Wing Sound**
   - **File**: `flap.mp3`
   - **Duration**: ~0.2s
   - **Description**: Soft synth wing sound

2. **Coin Collection**
   - **File**: `coin.mp3`
   - **Duration**: ~0.3s
   - **Description**: "Ka-ching" sound effect
   - **Variations**: `coin-aol.mp3`, `coin-burger.mp3`, `coin-usd1.mp3`

3. **Game Over**
   - **File**: `game-over.mp3`
   - **Duration**: ~1-2s
   - **Description**: Sad trumpet + eagle screech

4. **Button Click**
   - **File**: `button-click.mp3`
   - **Duration**: ~0.1s
   - **Description**: Subtle click sound

#### Power-up Sounds

1. **Buyback Mode**
   - **File**: `buyback.mp3`
   - **Duration**: ~1s
   - **Description**: Bass drop + "Buyback initiated!" voice line

2. **Freedom Flight**
   - **File**: `freedom.mp3`
   - **Duration**: ~0.5s
   - **Description**: Whoosh + "TO THE MOON!" voice line

3. **Bonk Bark**
   - **File**: `bonk.mp3`
   - **Duration**: ~0.5s
   - **Description**: Dog bark + "BONK THAT FUD!" voice line

4. **Burger Fuel**
   - **File**: `burger.mp3`
   - **Duration**: ~0.5s
   - **Description**: Eating sound + "Stay juicy!" voice line

#### Easter Egg Sounds

1. **Declaration of Memependence**
   - **File**: `declaration.mp3`
   - **Duration**: ~1s
   - **Description**: Patriotic fanfare

2. **Bonk Party**
   - **File**: `bonk-party.mp3`
   - **Duration**: ~3s
   - **Description**: Party music with beat drop

## Font Assets

### Display Font
- **File**: `arcade-classic.ttf` or `pixel-sans.ttf`
- **Style**: Pixel/arcade style for UI text
- **Weights**: Regular, Bold
- **License**: Make sure it's free for commercial use

### Alternative
Use web-safe fonts:
- Arial (currently used)
- Helvetica
- Impact (for titles)

## File Organization

```
public/assets/
├── images/
│   ├── characters/
│   │   ├── eagle-default.png
│   │   ├── eagle-ogle.png
│   │   ├── eagle-bonk.png
│   │   ├── eagle-burger.png
│   │   ├── eagle-whale.png
│   │   └── eagle-vesper.png
│   ├── obstacles/
│   │   ├── fud-cloud-1.png
│   │   ├── fud-rocket.png
│   │   └── bear-wall.png
│   ├── collectibles/
│   │   ├── coin-aol.png
│   │   ├── coin-burger.png
│   │   └── coin-usd1.png
│   ├── ui/
│   │   ├── button-normal.png
│   │   ├── button-hover.png
│   │   └── medals/
│   ├── effects/
│   │   └── particles/
│   └── backgrounds/
│       ├── background.png
│       └── flag-usa.png
├── audio/
│   ├── music/
│   │   └── theme.mp3
│   └── sfx/
│       ├── flap.mp3
│       ├── coin.mp3
│       ├── game-over.mp3
│       ├── buyback.mp3
│       └── ...
└── fonts/
    └── arcade-classic.ttf
```

## Asset Creation Tools

### Graphics
- **Aseprite**: Pixel art and sprites
- **GIMP**: Free image editing
- **Photoshop**: Professional graphics
- **Figma**: Vector graphics and UI design

### Audio
- **Audacity**: Free audio editing
- **BFXR**: 8-bit sound effect generator
- **Bosca Ceoil**: Simple music creation
- **FL Studio / Ableton**: Professional audio production

### AI Tools (Optional)
- **Midjourney / DALL-E**: AI image generation
- **ElevenLabs**: Voice line generation
- **Suno / Udio**: AI music generation

## Asset Integration

Once you have the assets, update `PreloadScene.ts`:

```typescript
preload(): void {
  // Characters
  this.load.image('eagle-default', 'assets/images/characters/eagle-default.png');
  this.load.image('eagle-ogle', 'assets/images/characters/eagle-ogle.png');

  // Obstacles
  this.load.image('fud-cloud', 'assets/images/obstacles/fud-cloud-1.png');

  // Collectibles
  this.load.image('coin-aol', 'assets/images/collectibles/coin-aol.png');

  // Audio
  this.load.audio('theme', 'assets/audio/music/theme.mp3');
  this.load.audio('flap', 'assets/audio/sfx/flap.mp3');
}
```

Then update sprite classes to use loaded images instead of graphics.

## Color Palette

Based on GameConfig:

- **Primary Red**: `#E63946`
- **Secondary Blue**: `#0033A0`
- **Gold**: `#FBB13C`
- **White**: `#FFFFFF`
- **Light Blue**: `#E8F4FF`
- **Gray (FUD)**: `#808080`

## License & Attribution

Ensure all assets are:
- Created by you, or
- Licensed for commercial use, or
- Public domain / CC0

Include attribution in `CreditsScene.ts` if required.

---

**Need help creating assets? Reach out to the America.Fun community!** 🎨
