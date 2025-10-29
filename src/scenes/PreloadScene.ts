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

    // Add error handler for load failures
    this.load.on('loaderror', (file: any) => {
      console.error('❌ Failed to load file:', file.key, file.src);
    });

    // === PLAYER ===
    // Load eagle sprite sheet for animations (4 frames, 2x2 grid, 512x512 each)
    // Total image size: 1024x1024
    this.load.spritesheet('eagle', 'assets/images/eagle-spreat-sheet.png', {
      frameWidth: 512,
      frameHeight: 512
    });

    // Load single eagle image for start screen
    this.load.image('player-eagle', 'assets/images/player-eagle.png');

    // v3.2: Gold Eagle Sprite for Valor Mode
    this.load.spritesheet('eagleGold', 'assets/images/eagle-spreat-sheet-gold.png', {
      frameWidth: 512,
      frameHeight: 512
    });
    console.log('🔄 Loading eagleGold spritesheet from: assets/images/eagle-spreat-sheet-gold.png');

    // === INTRO ===
    this.load.image('ogle-pixel', 'assets/images/Ogle-Pixel.png');
    this.load.image('cdog-pixel', 'assets/images/cdog-pixel.png'); // v4.2: Builder intro

    // === POWER-UPS ===
    this.load.image('mod-belle', 'assets/images/MOD-Belle-pixel.png');
    this.load.image('america-hat', 'assets/images/america-hat-pixel.png');
    this.load.image('feder-pixel', 'assets/images/feder-pixel.png'); // v3.2: Gold Feather
    this.load.image('bandana', 'assets/images/bandana-pixel.png'); // v3.7: Bandana Power-Up
    this.load.image('cryptoacting', 'assets/images/CryptoActing-pixel.png'); // v3.9.3: CryptoActing Early Entry
    this.load.image('danxx', 'assets/images/Danxx-Pixel.png'); // v3.9.3: Danxx Protocol
    this.load.image('rose', 'assets/images/rose-pixel.png'); // v3.9.3: Rose Mod Mode

    // === NPC ===
    this.load.image('vesper', 'assets/images/vesper0x.png');

    // === COINS ===
    this.load.image('coin-bonk', 'assets/images/bonk-coin.png');
    this.load.image('coin-aol', 'assets/images/token_aol.png');
    this.load.image('coin-usd1', 'assets/images/usd1-coin.png');
    this.load.image('coin-burger', 'assets/images/Token_Burger.png');
    this.load.image('coin-valor', 'assets/images/valorant-coin.png'); // v3.2

    // === ENEMIES (v4.2 - Updated roster) ===
    // Core enemies (kept from v3.9)
    this.load.image('jeet', 'assets/images/jeet.png'); // Jeeter Joe
    this.load.image('paper-hands', 'assets/images/PaperHands-Pixel.png'); // Paper Hands Pete
    this.load.image('red-candles', 'assets/images/redcandles-pixel.png'); // Red Candles
    this.load.image('gary', 'assets/images/gary-pixel.png'); // Gary (SEC)
    this.load.image('pumpfun', 'assets/images/pumpfun-pixel.png'); // Pump.fun
    this.load.image('fourmeme', 'assets/images/fourmeme-pixel.png'); // 4meme

    // Boss enemies
    this.load.image('bear-boss', 'assets/images/bearmarket-pixel.png'); // Bear Boss
    this.load.image('emoji-cz', 'assets/images/bearmarket-pixel.png'); // CZ Boss (placeholder)

    // v4.2: New enemies
    this.load.image('emoji-robot', 'assets/images/jeet.png'); // FUD Bot (placeholder)
    this.load.image('rugpull-kevin', 'assets/images/rugpull-kevin-pixel.png'); // Rugpull Kevin (custom sprite!)
    this.load.image('emoji-chart', 'assets/images/gary-pixel.png'); // Analyst Chad (placeholder)
    this.load.image('emoji-wizard', 'assets/images/MOD-Belle-pixel.png'); // Rekt Wizard (placeholder)
    this.load.image('emoji-whale', 'assets/images/bearmarket-pixel.png'); // Whale Manipulator (placeholder)
    this.load.image('emoji-astronaut', 'assets/images/jeet.png'); // Moon Chad (placeholder)

    // === UI ===
    this.load.image('america-logo', 'assets/images/americalogo.png');

    // === WEAPONS ===
    this.load.image('weapon-blaster', 'assets/images/blaster-pixel.png'); // Dual-shot blaster upgrade

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
    this.load.audio('burgercombo', 'assets/audio/burgercombo.mp3'); // v3.7: Eat the Dip combo sound
    this.load.audio('missioncleared', 'assets/audio/missioncleared.mp3'); // v3.7: Mission completed sound
    this.load.audio('newrecord', 'assets/audio/newrecord.mp3'); // v3.7: New highscore sound
    this.load.audio('valorawakens', 'assets/audio/valor awakens.mp3'); // v3.7: VALOR mode activation sound
    this.load.audio('blastershot', 'assets/audio/blaster-shot.mp3'); // v3.7: Weapon fire sound
    this.load.audio('enemyhit', 'assets/audio/attack-fire-384913.mp3'); // v3.7: Enemy hit sound
    this.load.audio('level-up', 'assets/audio/new-level.mp3');

    // Scene Music
    this.load.audio('game-over-music', 'assets/audio/Game Over, America.Fun.mp3');
    this.load.audio('leaderboard-music', 'assets/audio/Hall of Degens Theme.mp3');

    // Voice Acting
    this.load.audio('ogle-voice', 'assets/audio/ElevenLabs_2025-10-17T20_59_40_Bradford_pvc_sp100_s50_sb75_v3.mp3');
    this.load.audio('cdog-intro', 'assets/audio/Cdog-Intro.mp3'); // v4.2: Builder intro voice

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
    this.load.audio('explosion', 'assets/audio/explosion-312361.mp3'); // v3.5: Enemy defeat sound
    this.load.audio('lightning-strike', 'assets/audio/lightning-strike-386161.mp3'); // v3.5: Freedom Strike

    // v3.7: Bandana Power-Up sounds (use existing sounds as placeholders for now)
    this.load.audio('bandana-activate', 'assets/audio/shield-activate.mp3'); // Placeholder
    this.load.audio('bandana-loop', 'assets/audio/shield-active-loop.mp3'); // Placeholder
    this.load.audio('bandana-end', 'assets/audio/whoosh-09-410876.mp3'); // Placeholder

    // v3.9.3: CryptoActing Early Entry sounds
    this.load.audio('cryptoacting-voice', 'assets/audio/yougotinbeforetherest.mp3'); // "You got in before the rest!"
    this.load.audio('cryptoacting-collect', 'assets/audio/video-game-bonus-323603.mp3'); // Collection sound

    // v3.9.3: Danxx Protocol sounds
    this.load.audio('danxx-voice', 'assets/audio/WhenChaoshits.mp3'); // "When chaos hits, he brings order to the chain!"
    this.load.audio('danxx-collect', 'assets/audio/game-bonus-144751.mp3'); // Collection sound

    // v3.9.3: Rose Mod Mode sounds
    this.load.audio('rose-voice', 'assets/audio/ShemutestheFUD.mp3'); // "She mutes the FUD and keeps the vibes high."
    this.load.audio('rose-collect', 'assets/audio/collect-points-190037.mp3'); // Collection sound

    // v4.2: Micro-Event sounds
    this.load.audio('elon-tweet', 'assets/audio/Elontweeted.mp3');
    this.load.audio('market-pump', 'assets/audio/Marketpump.mp3');
    this.load.audio('sec-down', 'assets/audio/SEC.mp3');
    this.load.audio('valor-drop', 'assets/audio/valor drop.mp3');
    this.load.audio('burger-friday', 'assets/audio/xp2.mp3');

    // v4.2: Weapon pickup sound
    this.load.audio('weapon-drill', 'assets/audio/weapondrill.mp3');

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
    // DEBUG: Check if eagleGold loaded successfully
    const eagleGoldLoaded = this.textures.exists('eagleGold');
    console.log('🔍 PreloadScene.create() - eagleGold texture loaded:', eagleGoldLoaded);
    if (!eagleGoldLoaded) {
      console.error('❌ CRITICAL: eagleGold texture failed to load!');
      console.log('   Checking if file exists at: assets/images/eagle-spreat-sheet-gold.png');
    }

    // v3.8: Create emoji textures for new enemies using canvas rendering
    this.createEmojiTexture('emoji-hawkeye', '🎯', 80);
    this.createEmojiTexture('emoji-droneling', '🚁', 70);
    this.createEmojiTexture('emoji-custodian', '🛡️', 80);
    this.createEmojiTexture('emoji-firecracker', '💥', 70);
    this.createEmojiTexture('emoji-sbf', '🏦', 90);
    this.createEmojiTexture('emoji-dokwon', '⚡', 80);
    this.createEmojiTexture('emoji-cz', '🐻', 100);

    // Move to start scene
    this.scene.start('StartScene');
  }

  /**
   * v3.8: Create emoji texture from text using canvas
   * Creates a dynamic texture from emoji that can be used as a sprite
   */
  private createEmojiTexture(key: string, emoji: string, size: number): void {
    try {
      // Create canvas for rendering emoji
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.warn(`Failed to create canvas context for ${key}`);
        return;
      }

      // Draw emoji on canvas
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${size * 0.8}px Arial`; // Slightly smaller to fit
      ctx.fillText(emoji, size / 2, size / 2);

      // Create texture from canvas
      this.textures.addCanvas(key, canvas);
    } catch (error) {
      console.error(`Failed to create emoji texture for ${key}:`, error);
    }
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
