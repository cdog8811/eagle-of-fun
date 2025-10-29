import Phaser from 'phaser';
import { getI18n } from '../systems/i18n';

export class DonationScene extends Phaser.Scene {
  private i18n = getI18n();
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

    // Cdog image on LEFT side (25% width), vertically centered
    this.cdogImage = this.add.image(width * 0.25, height / 2, 'cdog-pixel');
    this.cdogImage.setScale(1.0);
    this.cdogImage.setAlpha(0);

    // Fade in the image
    this.tweens.add({
      targets: this.cdogImage,
      alpha: 1,
      duration: 1500,
      ease: 'Cubic.easeOut'
    });

    // Main text on RIGHT side (52% width), vertically centered
    const messageText = `${this.i18n.t('donation.message1')}

${this.i18n.t('donation.message2')}

${this.i18n.t('donation.message3')}

${this.i18n.t('donation.solLabel')}: ${this.solAddress}
${this.i18n.t('donation.tapToCopy')}

${this.i18n.t('donation.message4')}

${this.i18n.t('donation.thanks')}`;

    this.donationText = this.add.text(width * 0.52, height / 2 - 100, messageText, {
      fontSize: '24px',
      color: '#000000',
      fontFamily: this.i18n.getFontFamily(),
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
    this.createCopyButton(width * 0.52, height / 2 + 180);

    // Two navigation buttons at the bottom
    this.createButton(width / 2 - 200, height - 150, this.i18n.t('donation.mainMenu'), () => {
      this.returnToMainMenu();
    });

    this.createButton(width / 2 + 200, height - 150, this.i18n.t('donation.hallOfDegens'), () => {
      this.goToLeaderboard();
    });

    // SPACE hint between buttons and footer
    this.add.text(
      width / 2,
      height - 90,
      this.i18n.t('donation.spaceHint'),
      {
        fontSize: '18px',
        color: '#888888',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5);

    // Legal footer at bottom
    const footerText = this.add.text(
      width / 2,
      height - 60,
      this.i18n.t('donation.footer'),
      {
        fontSize: '14px',
        color: '#999999',
        fontFamily: 'Arial',
        align: 'center',
        lineSpacing: 4,
        wordWrap: { width: width - 100 }
      }
    ).setOrigin(0.5);

    // SPACE key to go to Hall of Degens
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.goToLeaderboard();
    });

    // ESC key to return to Main Menu
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

    const buttonText = this.add.text(150, 25, this.i18n.t('donation.copyButton'), {
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

  private createButton(x: number, y: number, text: string, callback: () => void): void {
    const button = this.add.container(x, y);

    // Button background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRoundedRect(-180, -35, 360, 70, 6);

    const buttonText = this.add.text(0, 0, text, {
      fontSize: '28px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);

    button.add([bg, buttonText]);
    button.setSize(360, 70);
    button.setInteractive(
      new Phaser.Geom.Rectangle(-180, -35, 360, 70),
      Phaser.Geom.Rectangle.Contains
    );

    // Hover effect
    button.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0xE63946, 1);
      bg.fillRoundedRect(-180, -35, 360, 70, 6);
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
      bg.fillRoundedRect(-180, -35, 360, 70, 6);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      });
    });

    // Click callback
    button.on('pointerdown', () => {
      callback();
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
      this.showCopyConfirmation(this.i18n.t('donation.copyFailed'));
    }
  }

  private showCopyConfirmation(message: string = this.i18n.t('donation.copied')): void {
    const width = this.cameras.main.width;

    // Remove existing confirmation if any
    if (this.copyConfirmation) {
      this.copyConfirmation.destroy();
    }

    // Create floating confirmation text
    this.copyConfirmation = this.add.text(
      width * 0.52 + 150,
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

  private goToLeaderboard(): void {
    // Remove all event listeners
    this.input.keyboard?.off('keydown-SPACE');
    this.input.keyboard?.off('keydown-ESC');

    // Fade out to black
    this.cameras.main.fadeOut(1000, 0, 0, 0);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('LeaderboardScene');
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
