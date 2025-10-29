import Phaser from 'phaser';

export class DonationScene extends Phaser.Scene {
  private cdogImage?: Phaser.GameObjects.Image;
  private donationText?: Phaser.GameObjects.Text;
  private solAddress: string = '8Cnaouzi4sCn4v69bgxRUtgmAZeEt93HgemtZENUVWP5';
  private copyConfirmation?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'DonationScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // White background (same as OgleScene)
    this.cameras.main.setBackgroundColor('#FFFFFF');

    // Fade in from black
    this.cameras.main.fadeIn(1500, 0, 0, 0);

    // Cdog image on RIGHT side (75% width), vertically centered
    this.cdogImage = this.add.image(width * 0.75, height / 2, 'cdog-pixel');
    this.cdogImage.setScale(1.0);
    this.cdogImage.setAlpha(0);

    // Fade in the image
    this.tweens.add({
      targets: this.cdogImage,
      alpha: 1,
      duration: 1500,
      ease: 'Cubic.easeOut'
    });

    // Main text on LEFT side (8% width), vertically centered
    const messageText = `Thanks for playing, Patriots. 🦅

If you had fun, laughed a bit, or just enjoyed the chaos, you can help keep Eagle of Fun alive.

Every bit of support goes into server costs, AI time, and new features we will build together as a community.

SOL: ${this.solAddress}
(tap or click to copy)

No pressure, this is for the culture, not for profit.

Thank you for flying with me. ❤️`;

    this.donationText = this.add.text(width * 0.08, height / 2 - 100, messageText, {
      fontSize: '24px',
      color: '#000000',
      fontFamily: 'Arial',
      lineSpacing: 8,
      align: 'left',
      wordWrap: { width: 700 }
    }).setOrigin(0, 0.5);
    this.donationText.setAlpha(0);

    // Fade in text
    this.tweens.add({
      targets: this.donationText,
      alpha: 1,
      duration: 1500,
      ease: 'Cubic.easeOut'
    });

    // Copy Address button
    this.createCopyButton(width * 0.08, height / 2 + 180);

    // Back to Main Menu button
    this.createBackButton(width / 2, height - 150);

    // Legal footer at bottom
    const footerText = this.add.text(
      width / 2,
      height - 60,
      'Private donation — voluntary support for development (no commercial purchase).\nDonations are considered private gifts under German tax law (EStG §22, Nr. 3).',
      {
        fontSize: '14px',
        color: '#999999',
        fontFamily: 'Arial',
        align: 'center',
        lineSpacing: 4,
        wordWrap: { width: width - 100 }
      }
    ).setOrigin(0.5);

    // SPACE key to return to Main Menu
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.returnToMainMenu();
    });

    // ESC key as alternative
    this.input.keyboard?.on('keydown-ESC', () => {
      this.returnToMainMenu();
    });
  }

  private createCopyButton(x: number, y: number): void {
    const button = this.add.container(x, y);

    // Button background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRoundedRect(0, 0, 300, 50, 6);

    const buttonText = this.add.text(150, 25, 'COPY ADDRESS', {
      fontSize: '20px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    button.setSize(300, 50);
    button.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 300, 50),
      Phaser.Geom.Rectangle.Contains
    );

    // Hover effect
    button.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0xE63946, 1);
      bg.fillRoundedRect(0, 0, 300, 50, 6);
      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x000000, 1);
      bg.fillRoundedRect(0, 0, 300, 50, 6);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      });
    });

    // Click to copy
    button.on('pointerdown', () => {
      this.copyAddressToClipboard();
    });
  }

  private createBackButton(x: number, y: number): void {
    const button = this.add.container(x, y);

    // Button background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRoundedRect(-180, -30, 360, 60, 6);

    const buttonText = this.add.text(0, 0, 'BACK TO MAIN MENU', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);

    // SPACE hint
    const spaceHint = this.add.text(0, 45, 'Press SPACE to continue', {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    this.add.existing(spaceHint);
    button.setSize(360, 60);
    button.setInteractive(
      new Phaser.Geom.Rectangle(-180, -30, 360, 60),
      Phaser.Geom.Rectangle.Contains
    );

    // Hover effect
    button.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0xE63946, 1);
      bg.fillRoundedRect(-180, -30, 360, 60, 6);
      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Back.easeOut'
      });
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x000000, 1);
      bg.fillRoundedRect(-180, -30, 360, 60, 6);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      });
    });

    // Click to return
    button.on('pointerdown', () => {
      this.returnToMainMenu();
    });
  }

  private async copyAddressToClipboard(): Promise<void> {
    try {
      // Modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(this.solAddress);
        this.showCopyConfirmation();
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = this.solAddress;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showCopyConfirmation();
      }
    } catch (error) {
      console.error('Failed to copy address:', error);
      // Show error message
      this.showCopyConfirmation('Failed to copy ❌');
    }
  }

  private showCopyConfirmation(message: string = 'Address copied ✅'): void {
    const width = this.cameras.main.width;

    // Remove existing confirmation if any
    if (this.copyConfirmation) {
      this.copyConfirmation.destroy();
    }

    // Create floating confirmation text
    this.copyConfirmation = this.add.text(
      width * 0.08 + 150,
      this.cameras.main.height / 2 + 240,
      message,
      {
        fontSize: '22px',
        color: '#00AA00',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Animate: fade in, float up, fade out
    this.tweens.add({
      targets: this.copyConfirmation,
      y: this.copyConfirmation.y - 30,
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: 'Cubic.easeOut'
    });

    this.tweens.add({
      targets: this.copyConfirmation,
      alpha: 0,
      duration: 500,
      delay: 700,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        if (this.copyConfirmation) {
          this.copyConfirmation.destroy();
          this.copyConfirmation = undefined;
        }
      }
    });
  }

  private returnToMainMenu(): void {
    // Remove all event listeners
    this.input.keyboard?.off('keydown-SPACE');
    this.input.keyboard?.off('keydown-ESC');

    // Fade out to black
    this.cameras.main.fadeOut(1000, 0, 0, 0);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('StartScene');
    });
  }

  shutdown(): void {
    this.input.keyboard?.off('keydown-SPACE');
    this.input.keyboard?.off('keydown-ESC');
    this.tweens.killAll();

    if (this.copyConfirmation) {
      this.copyConfirmation.destroy();
    }
  }
}
