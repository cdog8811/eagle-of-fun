import Phaser from 'phaser';
import { getI18n } from '../systems/i18n';

export class IntroScene extends Phaser.Scene {
  private i18n = getI18n();
  private dialogText?: Phaser.GameObjects.Text;
  private promptText?: Phaser.GameObjects.Text;
  private skipHintText?: Phaser.GameObjects.Text;
  private ogleImage?: Phaser.GameObjects.Image;
  private currentCharIndex: number = 0;
  private typewriterTimer?: Phaser.Time.TimerEvent;
  private isComplete: boolean = false;
  private keyboardSound?: Phaser.Sound.BaseSound;
  private spacePressed: boolean = false;
  private textSkipped: boolean = false;
  private fullDialog!: string;

  constructor() {
    super({ key: 'IntroScene' });
  }

  private getFullDialog(): string {
    return `${this.i18n.t('intro.ogle.line1')}
${this.i18n.t('intro.ogle.line2')}

${this.i18n.t('intro.ogle.line3')}
${this.i18n.t('intro.ogle.line4')}
${this.i18n.t('intro.ogle.line5')}

${this.i18n.t('intro.ogle.line6')}
${this.i18n.t('intro.ogle.line7')}
${this.i18n.t('intro.ogle.line8')}

${this.i18n.t('intro.ogle.line9')}

${this.i18n.t('intro.ogle.line10')}
${this.i18n.t('intro.ogle.line11')}
${this.i18n.t('intro.ogle.line12')}

${this.i18n.t('intro.ogle.line13')}

${this.i18n.t('intro.ogle.line14')}`;
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Reset all state variables when scene restarts (Try Again)
    this.currentCharIndex = 0;
    this.isComplete = false;
    this.spacePressed = false;
    this.textSkipped = false;

    // Initialize dialog text
    this.fullDialog = this.getFullDialog();

    // White background
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // Resume audio context (in case it was suspended)
    // v3.8 FIX: Type guard for WebAudioSoundManager
    const soundManager = this.sound as any;
    if (soundManager.context && typeof soundManager.context.resume === 'function') {
      soundManager.context.resume();
      console.log('IntroScene: AudioContext state:', soundManager.context.state);
    }

    // Display Ogle-Pixel image on the RIGHT, vertically centered
    this.ogleImage = this.add.image(width * 0.75, height / 2, 'ogle-pixel');
    this.ogleImage.setScale(1.0); // v4.2: Full size to match Cdog

    // Create text on the LEFT, vertically centered, left-aligned
    this.dialogText = this.add.text(width * 0.08, height / 2, '', {
      fontSize: '28px',
      color: '#000000',
      fontFamily: this.i18n.getFontFamily(),
      lineSpacing: 10,
      align: 'left',
      wordWrap: { width: 750 }
    }).setOrigin(0, 0.5); // Left-aligned, vertically centered

    // Create prompt text at bottom center (hidden initially)
    this.promptText = this.add.text(width / 2, height - 80, this.i18n.t('intro.launch'), {
      fontSize: '36px',
      color: '#E63946',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.promptText.setVisible(false);

    // Create skip hint text - always visible during typing
    this.skipHintText = this.add.text(width / 2, height - 40, this.i18n.t('intro.skip'), {
      fontSize: '20px',
      color: '#888888',
      fontFamily: 'Arial',
      fontStyle: 'normal'
    }).setOrigin(0.5);
    this.skipHintText.setAlpha(0.7);

    // Start typewriter effect
    this.startTypewriter();

    // Listen for SPACE key - two-step skip
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.handleSpacePress();
    });

    // Listen for click/touch anywhere on screen - same as SPACE
    this.input.on('pointerdown', () => {
      this.handleSpacePress();
    });
  }

  private handleSpacePress(): void {
    if (!this.isComplete && !this.textSkipped) {
      // First SPACE press - complete text immediately
      this.textSkipped = true;
      this.completeTextImmediately();
    } else if (this.isComplete && !this.spacePressed) {
      // Second SPACE press - start game
      this.spacePressed = true;
      this.showRPCMessages();
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
    this.sound.stopByKey('ogle-voice');

    // Show complete text
    this.dialogText?.setText(this.fullDialog);

    // Mark as complete
    this.onTypewriterComplete();
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

    // Hide skip hint
    this.skipHintText?.setVisible(false);

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

  private skipIntro(): void {
    // Stop all sounds and timers
    if (this.keyboardSound) {
      this.keyboardSound.stop();
    }
    if (this.typewriterTimer) {
      this.typewriterTimer.destroy();
    }
    this.sound.stopAll();

    // Remove keyboard listeners to prevent conflicts
    this.input.keyboard?.removeAllListeners();

    // Go directly to game
    this.scene.start('GameScene', { autoStart: true });
  }

  private showRPCMessages(): void {
    // Stop blinking
    // v3.8 FIX: Check if promptText exists before using
    if (this.promptText) {
      this.tweens.killTweensOf(this.promptText);
      this.promptText.setVisible(false);
    }

    // Remove keyboard listeners to prevent conflicts
    this.input.keyboard?.removeAllListeners();

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Hide Ogle image and dialog text
    this.ogleImage?.setVisible(false);
    this.dialogText?.setVisible(false);

    // Show RPC messages with faster timing
    const rpcText1 = this.add.text(width / 2, height / 2, this.i18n.t('intro.connecting'), {
      fontSize: '36px',
      color: '#0033A0',
      fontFamily: 'Courier New, monospace',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // After 1 second, show error
    this.time.delayedCall(1000, () => {
      rpcText1.setText(this.i18n.t('intro.error'));
      rpcText1.setColor('#E63946');

      // After another 0.8 seconds, show "Start Flight"
      this.time.delayedCall(800, () => {
        rpcText1.setText(this.i18n.t('intro.startFlight'));
        rpcText1.setColor('#00AA00');

        // Fade out effect instead of flash
        this.cameras.main.fadeOut(400, 255, 255, 255);

        // Start game after fade
        this.time.delayedCall(400, () => {
          // Stop all sounds before switching
          this.sound.stopAll();
          // Switch to GameScene with auto-start flag
          this.scene.start('GameScene', { autoStart: true });
        });
      });
    });
  }

  /**
   * v3.8: Cleanup to prevent memory leaks
   */
  shutdown(): void {
    this.input.keyboard?.off('keydown-SPACE');
    this.input.off('pointerdown');
    this.tweens.killAll();
    this.sound.stopAll();
  }
}
