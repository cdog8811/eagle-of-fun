# ⚡ Quick Start Guide - Eagle of Fun

Get the game running in 2 minutes!

## 1. Install Dependencies

```bash
npm install
```

This will install:
- Phaser.js 3 (game engine)
- TypeScript
- Vite (build tool)

## 2. Start Development Server

```bash
npm run dev
```

The game will automatically open in your browser at `http://localhost:3000`

## 3. Play the Game!

**Controls:**
- **Click, Tap, or Space** - Make the eagle flap
- **ESC** - Return to menu (during gameplay)

**Objective:**
- Avoid obstacles (FUD clouds, rockets, bear walls)
- Collect coins ($AOL, $BURGER, $USD1)
- Survive as long as possible!

## 4. Try the Easter Eggs

- Type **"1776"** on start screen
- Reach **420 points** in game
- Enter **"Vesper"** as your name on game over

## Next Steps

### Add Custom Assets

1. Place images in `public/assets/images/`
2. Place audio in `public/assets/audio/`
3. Update `src/scenes/PreloadScene.ts` to load your assets

See [ASSETS.md](ASSETS.md) for detailed specifications.

### Customize Gameplay

Edit `src/config/GameConfig.ts` to adjust:
- Game difficulty
- Scoring values
- Power-up durations
- Colors and styling

### Build for Production

```bash
npm run build
```

Output will be in `dist/` folder ready to deploy!

See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting options.

## Project Structure

```
Eagle/
├── src/
│   ├── config/      # Game settings
│   ├── scenes/      # Game screens
│   ├── sprites/     # Game objects
│   └── main.ts      # Entry point
├── public/assets/   # Images, audio, fonts
├── index.html       # HTML template
└── package.json     # Dependencies
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | Check TypeScript errors |

## Need Help?

- **Development Guide**: [DEVELOPMENT.md](DEVELOPMENT.md)
- **Asset Guide**: [ASSETS.md](ASSETS.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Full README**: [README.md](README.md)

## Tips

### During Development

1. **Hot Reload**: Changes auto-reload in browser
2. **TypeScript**: Catch errors before runtime
3. **Debug Mode**: Set `debug: true` in physics config (src/main.ts)

### Before Release

1. Test on multiple devices
2. Optimize images and audio
3. Check all features work
4. Update credits and attribution

## Common Issues

### Game won't start
- Check browser console for errors
- Run `npm install` again
- Clear browser cache

### Port 3000 already in use
```bash
npm run dev -- --port 3001
```

### TypeScript errors
```bash
npm run type-check
```

## What's Next?

Now that you have the game running:

1. **Customize**: Change colors, speeds, scoring in GameConfig.ts
2. **Add Assets**: Replace placeholder graphics with real art
3. **Add Features**: Power-ups, new skins, levels
4. **Deploy**: Share your game with the world!

---

**Happy Coding! 🦅🎮**

Made with ❤️ by the America.Fun Community
