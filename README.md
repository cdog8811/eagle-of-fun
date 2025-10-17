# 🦅 Eagle of Fun

A Flappy Bird-style meme game by the America.Fun Community

**"Avoid the FUD. Stack the $AOL. Be the Meme."**

## 🎮 About

Eagle of Fun is an arcade-style game where you control an American Eagle through a world of memecoin obstacles. Collect $AOL, $BURGER, and $USD1 coins while avoiding FUD clouds, rockets, and bear market walls!

## ✨ Features

- **Flappy Bird Mechanics**: Easy to learn, hard to master
- **Collectibles**: Three types of crypto coins with different point values
- **Obstacles**: FUD clouds, rockets, and bear market walls
- **Power-ups**: Buyback Mode, Freedom Flight, Bonk Bark, and Burger Fuel
- **Unlockable Skins**: Ogle Mode, Bonk Pup, Burger Beast, WLFI Whale, and secret Golden Wings
- **Easter Eggs**: Hidden surprises including "1776" code and Bonk Party mode
- **Leaderboard**: Compete with other players
- **Social Sharing**: Share your scores on X (Twitter)
- **Responsive Design**: Works on desktop and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 🎯 How to Play

- **Click, Tap, or Press SPACE** to make the eagle flap
- **Avoid obstacles** (FUD clouds, rockets, bear market walls)
- **Collect coins** for points:
  - 💸 $AOL = 5 points
  - 🍔 $BURGER = 3 points
  - 💵 $USD1 = 2 points
- **Survive as long as possible** and beat the high score!

## 🎨 Game Structure

```
src/
├── config/          # Game configuration
├── scenes/          # Game scenes (Start, Game, GameOver, etc.)
├── sprites/         # Game objects (Eagle, Obstacles, Collectibles)
├── ui/             # UI components
└── utils/          # Utility functions

public/
└── assets/         # Images, audio, and fonts
```

## 🔧 Technology Stack

- **Engine**: Phaser.js 3
- **Language**: TypeScript
- **Build Tool**: Vite
- **Physics**: Arcade Physics
- **Backend**: Ready for Firebase/Supabase integration

## 🎭 Skins & Unlockables

| Skin | How to Unlock |
|------|---------------|
| Classic Eagle | Default |
| 🧢 Ogle Mode | Score 1,000 points |
| 🐕 Bonk Pup | Score 2,000 points |
| 🍔 Burger Beast | Score 3,000 points |
| 🐋 WLFI Whale | Score 5,000 points |
| ✨ Golden Wings | Enter "Vesper" as your name |

## 🥚 Easter Eggs

- Type **"1776"** on the start screen for a surprise
- Reach **420 points** to activate Bonk Party Mode
- Enter **"Vesper"** as your name to unlock Golden Wings

## 📱 Mobile Support

The game automatically scales to fit your device and supports touch controls!

## 🛠️ Future Roadmap

- **v1.1**: Wallet login + on-chain score saving
- **v1.2**: NFT skins (Eagle Collection)
- **v2.0**: Multiplayer "Degen Race Mode"
- **v3.0**: Special event editions

## 🎵 Audio

Audio files need to be added to `public/assets/audio/`:
- `theme.mp3` - 8-bit trap background music
- `flap.mp3` - Wing flap sound
- `coin.mp3` - Coin collection sound
- `gameOver.mp3` - Game over sound
- `buyback.mp3` - Buyback mode activation

## 🖼️ Assets

Image files need to be added to `public/assets/images/` for enhanced visuals. Currently using placeholder graphics.

## 🤝 Contributing

Built by the America.Fun Community. Contributions welcome!

## 📄 License

MIT License

---

**Built with ❤️ by degens, for degens**

🦅 *"Fly high, dodge FUD, stack fun."* 🦅
