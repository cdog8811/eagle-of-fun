import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  private loadingText!: Phaser.GameObjects.Text;
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.createLoadingScreen();

    // === PLAYER ===
    // Load eagle sprite sheet for animations (4 frames, 2x2 grid, 512x512 each)
    // Total image size: 1024x1024
    this.load.spritesheet('eagle', 'assets/images/eagle-spreat-sheet.png', {
      frameWidth: 512,
      frameHeight: 512
    });

    // Load single eagle image for start screen
    this.load.image('player-eagle', 'assets/images/player-eagle.png');

    // === INTRO ===
    this.load.image('ogle-pixel', 'assets/images/Ogle-Pixel.png');

    // === POWER-UPS ===
    this.load.image('mod-belle', 'assets/images/MOD-Belle-pixel.png');
    this.load.image('america-hat', 'assets/images/america-hat-pixel.png');

    // === NPC ===
    this.load.image('vesper', 'assets/images/vesper0x.png');

    // === COINS ===
    this.load.image('coin-bonk', 'assets/images/bonk-coin.png');
    this.load.image('coin-aol', 'assets/images/token_aol.png');
    this.load.image('coin-usd1', 'assets/images/usd1-coin.png');
    this.load.image('coin-burger', 'assets/images/Token_Burger.png');

    // === ENEMIES ===
    this.load.image('jeet', 'assets/images/jeet.png'); // Jeeter (Phase 1)
    this.load.image('paper-hands', 'assets/images/PaperHands-Pixel.png'); // Paper Hands Pete (Phase 2)
    this.load.image('red-candles', 'assets/images/redcandles-pixel.png'); // Red Candles (Phase 3)
    this.load.image('gary', 'assets/images/gary-pixel.png'); // Gary/SEC (Phase 4)
    this.load.image('bear-boss', 'assets/images/bearmarket-pixel.png'); // Bear Market Boss (Phase 5)

    // === UI ===
    this.load.image('america-logo', 'assets/images/americalogo.png');

    // === BACKGROUNDS ===
    this.load.image('bg-phase1', 'assets/images/libertyoffreedom-background.jpg');
    this.load.image('bg-phase2', 'assets/images/city-sky-background.jpg');
    this.load.image('bg-phase3', 'assets/images/grandcanyon-background.jpg');

    // === AUDIO ===
    // Menu & UI
    this.load.audio('menu-music', 'assets/audio/Eagle of Fun _ America.Fun Anthem.mp3');
    this.load.audio('ui-confirm', 'assets/audio/confirm-tap-394001.mp3');
    this.load.audio('hover-button', 'assets/audio/hover-button-287656.mp3');
    this.load.audio('menu-button', 'assets/audio/menu-button-88360.mp3');
    this.load.audio('ready-for-takeoff', 'assets/audio/readyfortakeoff.mp3');

    // Game Music
    this.load.audio('background-music', 'assets/audio/Eagle of Fun.mp3');
    this.load.audio('background-music-2', 'assets/audio/Eagle of Fun Kopie.mp3');
    this.load.audio('countdown', 'assets/audio/321gobradford.mp3');
    this.load.audio('buyback-voice', 'assets/audio/ElevenLabs_2025-10-17T21_02_09_Drill Sergeant_pvc_sp100_s50_sb75_v3.mp3');
    this.load.audio('level-up', 'assets/audio/new-level.mp3');

    // Scene Music
    this.load.audio('game-over-music', 'assets/audio/Game Over, America.Fun.mp3');
    this.load.audio('leaderboard-music', 'assets/audio/Hall of Degens Theme.mp3');

    // Voice Acting
    this.load.audio('ogle-voice', 'assets/audio/ElevenLabs_2025-10-17T20_59_40_Bradford_pvc_sp100_s50_sb75_v3.mp3');

    // Sound Effects
    this.load.audio('wing-flap', 'assets/audio/wing-flap-1-6434.mp3');
    this.load.audio('coin-collect', 'assets/audio/get-coin-351945.mp3');
    this.load.audio('game-start', 'assets/audio/confirm-tap-394001.mp3');
    this.load.audio('shield-activate', 'assets/audio/arcade-bleep-sound-6071.mp3');
    this.load.audio('shield-active-loop', 'assets/audio/Shield_Active_subtle-1760734141916.mp3');
    this.load.audio('crash', 'assets/audio/car-crash-sound-376882.mp3');
    this.load.audio('belle-collect', 'assets/audio/arcade-ui-2-229500.mp3');
    this.load.audio('phase-change', 'assets/audio/arcade-ui-2-229500.mp3');
    this.load.audio('keyboard-typing', 'assets/audio/keyboard-typing-sound-250308.mp3');
    this.load.audio('whoosh', 'assets/audio/whoosh-09-410876.mp3');

    // Load progress
    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xFBB13C, 1);
      this.progressBar.fillRect(250, 280, 300 * value, 30);
      this.loadingText.setText(`Loading: ${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
    });
  }

  create(): void {
    // Move to start scene
    this.scene.start('StartScene');
  }

  private createLoadingScreen(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading: 0%', {
      fontSize: '24px',
      color: '#0033A0',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Progress bar background
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0xFFFFFF, 0.8);
    this.progressBox.fillRect(240, 270, 320, 50);

    // Progress bar
    this.progressBar = this.add.graphics();

    // Title
    this.add.text(width / 2, 100, '🦅 Eagle of Fun', {
      fontSize: '48px',
      color: '#E63946',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Tagline
    this.add.text(width / 2, 160, 'Avoid the FUD. Stack the $AOL. Be the Meme.', {
      fontSize: '16px',
      color: '#0033A0',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }
}
