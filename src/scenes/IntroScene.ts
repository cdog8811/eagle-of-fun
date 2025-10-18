import Phaser from 'phaser';

export class IntroScene extends Phaser.Scene {
  private dialogText?: Phaser.GameObjects.Text;
  private promptText?: Phaser.GameObjects.Text;
  private ogleImage?: Phaser.GameObjects.Image;
  private currentCharIndex: number = 0;
  private typewriterTimer?: Phaser.Time.TimerEvent;
  private isComplete: boolean = false;
  private keyboardSound?: Phaser.Sound.BaseSound;
  private spacePressed: boolean = false;

  private readonly fullDialog = `Ogle: Hi, Degen.
Glad you showed up.

The markets are a mess...
Jeeters are dumping, Paper Hands are crying,
and the Bear is waking up again.

We need someone brave.
Someone fast.
Someone who can fly through FUD and buy back the Fun.

That's you, Eagle.

Collect the tokens.
Avoid the Paperhands.
Save the market.

Let's rebuild America.Fun together.

Ready to fly?`;

  constructor() {
    super({ key: 'IntroScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // White background
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // Resume audio context (in case it was suspended)
    if (this.sound.context) {
      this.sound.context.resume();
      console.log('IntroScene: AudioContext state:', this.sound.context.state);
    }

    // Display Ogle-Pixel image on the LEFT, vertically centered
    this.ogleImage = this.add.image(width * 0.25, height / 2, 'ogle-pixel');
    this.ogleImage.setScale(0.7);

    // Create text on the RIGHT, vertically centered, left-aligned
    this.dialogText = this.add.text(width * 0.52, height / 2, '', {
      fontSize: '28px',
      color: '#000000',
      fontFamily: 'Courier New, monospace',
      lineSpacing: 10,
      align: 'left',
      wordWrap: { width: 800 }
    }).setOrigin(0, 0.5); // Left-aligned, vertically centered

    // Create prompt text at bottom center (hidden initially)
    this.promptText = this.add.text(width / 2, height - 80, '[PRESS SPACE TO LAUNCH 🚀]', {
      fontSize: '36px',
      color: '#E63946',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.promptText.setVisible(false);

    // Start typewriter effect
    this.startTypewriter();

    // Listen for SPACE key
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.isComplete && !this.spacePressed) {
        this.spacePressed = true;
        this.showRPCMessages();
      }
    });
  }

  private startTypewriter(): void {
    this.currentCharIndex = 0;

    // Play Ogle's voice reading the text
    if (this.cache.audio.exists('ogle-voice')) {
      try {
        this.sound.play('ogle-voice', {
          volume: 0.7
        });
      } catch (e) {
        console.log('Could not play ogle-voice:', e);
      }
    }

    // Play keyboard typing sound (loop while typing) - only if available
    console.log('Checking for keyboard-typing sound, cache exists:', this.cache.audio.exists('keyboard-typing'));
    if (this.cache.audio.exists('keyboard-typing')) {
      console.log('Playing keyboard typing sound');
      this.keyboardSound = this.sound.add('keyboard-typing', {
        volume: 0.6,  // Increased from 0.3
        loop: true
      });
      // Try to play, but don't fail if AudioContext is not allowed yet
      try {
        const result = this.keyboardSound.play();
        console.log('Keyboard sound started, result:', result);
        console.log('Keyboard sound isPlaying:', this.keyboardSound.isPlaying);
        console.log('Sound manager volume:', this.sound.volume);
      } catch (e) {
        console.log('Could not play keyboard sound:', e);
      }
    } else {
      console.log('keyboard-typing sound not in cache');
    }

    this.typewriterTimer = this.time.addEvent({
      delay: 50, // 0.05 seconds per character
      callback: () => {
        if (this.currentCharIndex < this.fullDialog.length) {
          this.currentCharIndex++;
          const currentText = this.fullDialog.substring(0, this.currentCharIndex);
          this.dialogText?.setText(currentText);
        } else {
          // Typewriter complete
          this.typewriterTimer?.destroy();
          this.onTypewriterComplete();
        }
      },
      loop: true
    });
  }

  private onTypewriterComplete(): void {
    this.isComplete = true;

    // Stop keyboard typing sound
    if (this.keyboardSound) {
      this.keyboardSound.stop();
    }

    // Show blinking prompt directly below text
    this.promptText?.setVisible(true);

    // Blink animation
    this.tweens.add({
      targets: this.promptText,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  private showRPCMessages(): void {
    // Stop blinking
    this.tweens.killTweensOf(this.promptText);
    this.promptText?.setVisible(false);

    // Remove keyboard listeners to prevent conflicts
    this.input.keyboard?.removeAllListeners();

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Hide Ogle image and dialog text
    this.ogleImage?.setVisible(false);
    this.dialogText?.setVisible(false);

    // Show RPC messages
    const rpcText1 = this.add.text(width / 2, height / 2, 'Connecting to America.fun RPC...', {
      fontSize: '36px',
      color: '#0033A0',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // After 1.5 seconds, show error
    this.time.delayedCall(1500, () => {
      rpcText1.setText('Error 404 – FUD detected.');
      rpcText1.setColor('#E63946');

      // After another 1 second, show "Start Flight"
      this.time.delayedCall(1000, () => {
        rpcText1.setText('Start Flight');
        rpcText1.setColor('#00AA00');

        // Flash effect
        this.cameras.main.flash(500, 255, 255, 255);

        // Start game after 0.5 seconds
        this.time.delayedCall(500, () => {
          // Stop all sounds before switching
          this.sound.stopAll();
          // Switch to GameScene with auto-start flag
          this.scene.start('GameScene', { autoStart: true });
        });
      });
    });
  }
}
