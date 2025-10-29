import Phaser from 'phaser';

/**
 * BuilderIntroScene - Cdog Introduction
 *
 * Shows Cdog (the builder) introducing himself before the Ogle scene.
 * Layout: Cdog image on RIGHT, text on LEFT with typewriter effect
 * SPACE skips to OgleScene (IntroScene)
 */
export class BuilderIntroScene extends Phaser.Scene {
  private dialogText?: Phaser.GameObjects.Text;
  private skipHintText?: Phaser.GameObjects.Text;
  private cdogImage?: Phaser.GameObjects.Image;
  private currentCharIndex: number = 0;
  private typewriterTimer?: Phaser.Time.TimerEvent;
  private isComplete: boolean = false;
  private cdogVoice?: Phaser.Sound.BaseSound;
  private keyboardSound?: Phaser.Sound.BaseSound;
  private spacePressed: boolean = false;
  private textSkipped: boolean = false;

  private readonly fullDialog = `Hi Patriots,

Cdog here.

I'm just a creative, not a coder.
No team. No plan. No idea what I'm doing.

But I'm a small $AOL holder,
and I wanted to build something for the culture.
To connect the America.Fun communities and keep the vibes alive.

Elon banned my X account,
so I can't help with the raids anymore.
So I built a game instead.

Yeah, it's buggy. It's messy.
But it's real, and made with love for this community.

Let's make memes, not excuses. 🦅`;

  constructor() {
    super({ key: 'BuilderIntroScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // White background (same as Ogle scene)
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // Resume audio context (in case it was suspended)
    const soundManager = this.sound as any;
    if (soundManager.context && typeof soundManager.context.resume === 'function') {
      soundManager.context.resume();
      console.log('BuilderIntroScene: AudioContext state:', soundManager.context.state);
    }

    // Display Cdog-Pixel image on the RIGHT, vertically centered
    this.cdogImage = this.add.image(width * 0.75, height / 2, 'cdog-pixel');
    this.cdogImage.setScale(1.0); // v4.2: Full size to match Ogle
    this.cdogImage.setAlpha(0);

    // Fade in the image
    this.tweens.add({
      targets: this.cdogImage,
      alpha: 1,
      duration: 800,
      ease: 'Cubic.easeOut'
    });

    // Create text on the LEFT, vertically centered, left-aligned
    this.dialogText = this.add.text(width * 0.08, height / 2, '', {
      fontSize: '28px',
      color: '#000000',
      fontFamily: 'Courier New, monospace',
      lineSpacing: 10,
      align: 'left',
      wordWrap: { width: 750 }
    }).setOrigin(0, 0.5); // Left-aligned, vertically centered

    // Create skip hint text - always visible during typing
    this.skipHintText = this.add.text(width / 2, height - 40, 'Press SPACE to skip', {
      fontSize: '20px',
      color: '#888888',
      fontFamily: 'Arial',
      fontStyle: 'normal'
    }).setOrigin(0.5);
    this.skipHintText.setAlpha(0.7);

    // Start typewriter effect after short delay
    this.time.delayedCall(500, () => {
      this.startTypewriter();
    });

    // Listen for SPACE key
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.handleSpacePress();
    });
  }

  private handleSpacePress(): void {
    if (!this.isComplete && !this.textSkipped) {
      // First SPACE press - complete text immediately
      this.textSkipped = true;
      this.completeTextImmediately();
    } else if (this.isComplete && !this.spacePressed) {
      // Second SPACE press - fade out and go to OgleScene
      this.spacePressed = true;
      this.fadeToOgleScene();
    }
  }

  private completeTextImmediately(): void {
    // Stop typewriter
    if (this.typewriterTimer) {
      this.typewriterTimer.destroy();
    }

    // Stop all sounds
    if (this.keyboardSound) {
      this.keyboardSound.stop();
    }
    if (this.cdogVoice) {
      this.cdogVoice.stop();
    }

    // Show complete text
    this.dialogText?.setText(this.fullDialog);

    // Mark as complete
    this.onTypewriterComplete();
  }

  private startTypewriter(): void {
    this.currentCharIndex = 0;

    // Play Cdog's voice reading the text
    if (this.cache.audio.exists('cdog-intro')) {
      try {
        this.cdogVoice = this.sound.add('cdog-intro', { volume: 1.0 });
        this.cdogVoice.play();
      } catch (e) {
        console.log('Could not play cdog-intro:', e);
      }
    }

    // Play keyboard typing sound (loop while typing) - only if available
    if (this.cache.audio.exists('keyboard-typing')) {
      this.keyboardSound = this.sound.add('keyboard-typing', {
        volume: 0.6,
        loop: true
      });
      try {
        this.keyboardSound.play();
      } catch (e) {
        console.log('Could not play keyboard sound:', e);
      }
    }

    // Typewriter effect with character-by-character reveal
    this.typewriterTimer = this.time.addEvent({
      delay: 50, // 50ms per character (same as Ogle scene)
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

    // Change skip hint to "continue" message
    this.skipHintText?.setText('Press SPACE to continue');
    this.skipHintText?.setColor('#E63946');
    this.skipHintText?.setFontStyle('bold');

    // Blink animation
    this.tweens.add({
      targets: this.skipHintText,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  private fadeToOgleScene(): void {
    // Stop all sounds
    if (this.keyboardSound) {
      this.keyboardSound.stop();
    }
    if (this.cdogVoice) {
      this.cdogVoice.stop();
    }
    this.sound.stopAll();

    // Remove keyboard listeners
    this.input.keyboard?.removeAllListeners();

    // Stop all tweens
    this.tweens.killAll();

    // Fade out to white
    this.cameras.main.fadeOut(1000, 255, 255, 255);

    // After fade, start OgleScene (IntroScene)
    this.time.delayedCall(1000, () => {
      this.scene.start('IntroScene');
    });
  }

  /**
   * Cleanup to prevent memory leaks
   */
  shutdown(): void {
    this.input.keyboard?.off('keydown-SPACE');
    this.tweens.killAll();
    this.sound.stopAll();
  }
}
