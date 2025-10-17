# 🛠️ Development Guide - Eagle of Fun

## Project Structure

```
Eagle/
├── src/
│   ├── config/
│   │   └── GameConfig.ts          # Game configuration & constants
│   ├── scenes/
│   │   ├── BootScene.ts           # Initial boot & data initialization
│   │   ├── PreloadScene.ts        # Asset loading
│   │   ├── StartScene.ts          # Main menu
│   │   ├── GameScene.ts           # Main gameplay
│   │   ├── GameOverScene.ts       # Game over screen
│   │   ├── LeaderboardScene.ts    # Leaderboard display
│   │   ├── HowToPlayScene.ts      # Instructions
│   │   └── CreditsScene.ts        # Credits
│   ├── sprites/
│   │   ├── Eagle.ts               # Player character
│   │   ├── Obstacle.ts            # Obstacles (FUD clouds, etc.)
│   │   └── Collectible.ts         # Coins ($AOL, $BURGER, $USD1)
│   └── main.ts                    # Game entry point
├── public/
│   └── assets/                    # Game assets (to be added)
│       ├── images/
│       ├── audio/
│       └── fonts/
├── index.html                     # HTML entry point
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
└── vite.config.ts                 # Vite build config
```

## Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The game will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Game Architecture

### Scene Flow

```
BootScene (initialization)
    ↓
PreloadScene (asset loading)
    ↓
StartScene (main menu)
    ↓
GameScene ←→ GameOverScene ←→ LeaderboardScene
    ↓
HowToPlayScene / CreditsScene
```

### Key Components

#### GameConfig.ts
Central configuration file containing:
- Game dimensions
- Physics settings
- Scoring values
- Power-up durations
- Color scheme
- Easter egg codes

#### Eagle.ts
Player character with:
- Physics body
- Flap mechanics
- Wing animations
- Collision bounds

#### Obstacle.ts
Randomly generated obstacles:
- FUD clouds (gray with text)
- FUD rockets (red triangles)
- Bear market walls (red candles)

#### Collectible.ts
Coins with different values:
- $AOL (gold, 5 points)
- $BURGER (orange, 3 points)
- $USD1 (green, 2 points)

## Adding Assets

### Images

Place image files in `public/assets/images/` and load them in `PreloadScene.ts`:

```typescript
this.load.image('eagle', 'assets/images/eagle.png');
this.load.image('background', 'assets/images/background.png');
```

### Audio

Place audio files in `public/assets/audio/` and load them in `PreloadScene.ts`:

```typescript
this.load.audio('theme', 'assets/audio/theme.mp3');
this.load.audio('flap', 'assets/audio/flap.mp3');
```

Then play in game:

```typescript
this.sound.play('flap');
```

### Fonts

Place font files in `public/assets/fonts/` and load them using WebFont loader or CSS.

## Game Mechanics

### Physics

The game uses Phaser's Arcade Physics:
- Gravity: 1200 (GameConfig.gravity)
- Flap velocity: -400 (GameConfig.flapVelocity)

### Difficulty Scaling

The game speed increases over time:
- Base scroll speed: 200px/s
- Increases by 10px/s every 10 seconds
- Maximum speed: 400px/s

### Scoring System

Points are earned through:
- Time survived: +1 point per second
- Collecting coins: +2 to +5 points
- Destroying FUD walls: +10 bonus points
- Power-up multipliers

### Power-ups

#### Buyback Mode
- Duration: 5 seconds
- Effect: Invincibility + coin magnet
- Visual: Golden tint on eagle
- Voice line: "BUYBACK ACTIVATED!"

#### Freedom Flight
- Duration: 5 seconds
- Effect: Speed boost
- Voice line: "TO THE MOON!"

#### Bonk Bark
- One-time use
- Effect: Destroys next FUD wall
- Voice line: "BONK THAT FUD!"

#### Burger Fuel
- Duration: 5 seconds
- Effect: Extra jump height + 5 bonus points
- Voice line: "Stay juicy!"

## Local Storage

The game uses localStorage for persistence:

```typescript
localStorage.setItem('eagleOfFun_highScore', score);
localStorage.setItem('eagleOfFun_unlockedSkins', JSON.stringify(skins));
localStorage.setItem('eagleOfFun_currentSkin', skinId);
```

## Backend Integration (Future)

### Firebase Setup

1. Install Firebase:
```bash
npm install firebase
```

2. Create `src/utils/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your config here
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

3. Update LeaderboardScene to fetch from Firebase

### Supabase Alternative

1. Install Supabase:
```bash
npm install @supabase/supabase-js
```

2. Create `src/utils/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_KEY'
);
```

## Testing

### Manual Testing Checklist

- [ ] Eagle flaps on click/tap/space
- [ ] Obstacles spawn regularly
- [ ] Coins are collectible
- [ ] Score increases correctly
- [ ] Game over on collision
- [ ] High score saves
- [ ] Leaderboard displays
- [ ] Twitter sharing works
- [ ] Easter eggs function
- [ ] Mobile responsive

### Browser Testing

Test on:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

### Tips

1. **Object Pooling**: Reuse obstacle/coin objects instead of creating new ones
2. **Sprite Atlases**: Combine images into sprite sheets
3. **Audio Sprites**: Combine audio files
4. **Lazy Loading**: Load assets on demand
5. **Minimize Physics Bodies**: Only add physics to interactive objects

### Monitoring

Check performance with:
```typescript
console.log(this.game.loop.actualFps); // FPS
```

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages

1. Build the project
2. Push `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repo settings

## Troubleshooting

### Game Won't Start
- Check browser console for errors
- Verify Node.js and npm versions
- Clear cache and restart dev server

### Physics Issues
- Adjust gravity in GameConfig.ts
- Check collision bounds in sprite classes

### Performance Issues
- Enable physics debug mode to identify bottlenecks
- Reduce particle effects
- Optimize sprite sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Code Style

- Use TypeScript strict mode
- Follow Phaser.js best practices
- Comment complex logic
- Use meaningful variable names
- Keep functions small and focused

## Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser Examples](https://phaser.io/examples)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Happy Coding! 🦅**
