/**
 * AudioSystem v3.8 (Simplified)
 *
 * Centralized audio management for SFX and music
 */

import Phaser from 'phaser';

export class AudioSystem {
  private scene: Phaser.Scene;

  // Volume settings
  private sfxVolume: number = 0.7;
  private musicVolume: number = 0.5;
  private muted: boolean = false;

  // Currently playing music
  private currentMusic?: Phaser.Sound.BaseSound;

  // SFX cache
  private sfxCache: Map<string, Phaser.Sound.BaseSound> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public init(): void {
    // Load volume settings from localStorage
    const savedSfxVolume = localStorage.getItem('sfxVolume');
    const savedMusicVolume = localStorage.getItem('musicVolume');
    const savedMuted = localStorage.getItem('muted');

    if (savedSfxVolume) this.sfxVolume = parseFloat(savedSfxVolume);
    if (savedMusicVolume) this.musicVolume = parseFloat(savedMusicVolume);
    if (savedMuted) this.muted = savedMuted === 'true';

    console.log('🔊 AudioSystem initialized');
  }

  // ========== SFX ==========

  /**
   * Play a sound effect
   */
  public playSFX(key: string, config?: Phaser.Types.Sound.SoundConfig): void {
    if (this.muted) return;

    try {
      const sound = this.scene.sound.add(key, {
        volume: this.sfxVolume,
        ...config
      });

      sound.play();

      // Clean up after playing
      sound.once('complete', () => {
        sound.destroy();
      });
    } catch (error) {
      console.warn(`⚠️ Failed to play SFX: ${key}`, error);
    }
  }

  /**
   * Play weapon fire sound
   */
  public playWeaponFire(weaponId: string): void {
    this.playSFX(`sfx-weapon-${weaponId}`, { volume: this.sfxVolume * 0.8 });
  }

  /**
   * Play enemy hit sound
   */
  public playEnemyHit(): void {
    this.playSFX('sfx-enemy-hit', { volume: this.sfxVolume * 0.6 });
  }

  /**
   * Play enemy death sound
   */
  public playEnemyDeath(): void {
    this.playSFX('sfx-enemy-death', { volume: this.sfxVolume * 0.7 });
  }

  /**
   * Play coin collect sound
   */
  public playCoinCollect(coinType: string): void {
    this.playSFX(`sfx-coin-${coinType.toLowerCase()}`, { volume: this.sfxVolume * 0.5 });
  }

  /**
   * Play power-up collect sound
   */
  public playPowerUpCollect(): void {
    this.playSFX('sfx-powerup-collect', { volume: this.sfxVolume });
  }

  /**
   * Play damage sound
   */
  public playDamage(): void {
    this.playSFX('sfx-damage', { volume: this.sfxVolume * 0.9 });
  }

  /**
   * Play level up sound
   */
  public playLevelUp(): void {
    this.playSFX('sfx-levelup', { volume: this.sfxVolume });
  }

  /**
   * Play UI click sound
   */
  public playUIClick(): void {
    this.playSFX('sfx-ui-click', { volume: this.sfxVolume * 0.4 });
  }

  /**
   * Play UI hover sound
   */
  public playUIHover(): void {
    this.playSFX('sfx-ui-hover', { volume: this.sfxVolume * 0.3 });
  }

  // ========== MUSIC ==========

  /**
   * Play music (looping)
   */
  public playMusic(key: string, fadeIn: boolean = false): void {
    if (this.muted) return;

    // Stop current music
    if (this.currentMusic) {
      if (fadeIn) {
        this.scene.tweens.add({
          targets: this.currentMusic,
          volume: 0,
          duration: 1000,
          onComplete: () => {
            this.currentMusic?.stop();
            this.startMusic(key, fadeIn);
          }
        });
      } else {
        this.currentMusic.stop();
        this.startMusic(key, fadeIn);
      }
    } else {
      this.startMusic(key, fadeIn);
    }
  }

  /**
   * Start music playback
   */
  private startMusic(key: string, fadeIn: boolean): void {
    try {
      this.currentMusic = this.scene.sound.add(key, {
        volume: fadeIn ? 0 : this.musicVolume,
        loop: true
      });

      this.currentMusic.play();

      // Fade in
      if (fadeIn) {
        this.scene.tweens.add({
          targets: this.currentMusic,
          volume: this.musicVolume,
          duration: 1000
        });
      }
    } catch (error) {
      console.warn(`⚠️ Failed to play music: ${key}`, error);
    }
  }

  /**
   * Stop current music
   */
  public stopMusic(fadeOut: boolean = false): void {
    if (!this.currentMusic) return;

    if (fadeOut) {
      this.scene.tweens.add({
        targets: this.currentMusic,
        volume: 0,
        duration: 1000,
        onComplete: () => {
          this.currentMusic?.stop();
          this.currentMusic = undefined;
        }
      });
    } else {
      this.currentMusic.stop();
      this.currentMusic = undefined;
    }
  }

  // ========== VOLUME CONTROL ==========

  /**
   * Set SFX volume
   */
  public setSFXVolume(volume: number): void {
    this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
    localStorage.setItem('sfxVolume', this.sfxVolume.toString());
  }

  /**
   * Set music volume
   */
  public setMusicVolume(volume: number): void {
    this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
    localStorage.setItem('musicVolume', this.musicVolume.toString());

    // Update current music
    if (this.currentMusic) {
      this.currentMusic.setVolume(this.musicVolume);
    }
  }

  /**
   * Toggle mute
   */
  public toggleMute(): void {
    this.muted = !this.muted;
    localStorage.setItem('muted', this.muted.toString());

    if (this.muted) {
      this.scene.sound.setMute(true);
    } else {
      this.scene.sound.setMute(false);
    }
  }

  /**
   * Set mute state
   */
  public setMuted(muted: boolean): void {
    this.muted = muted;
    localStorage.setItem('muted', this.muted.toString());
    this.scene.sound.setMute(muted);
  }

  /**
   * Get volume settings
   */
  public getVolumes(): { sfx: number; music: number; muted: boolean } {
    return {
      sfx: this.sfxVolume,
      music: this.musicVolume,
      muted: this.muted
    };
  }

  // ========== CLEANUP ==========

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = undefined;
    }

    this.sfxCache.forEach(sound => sound.destroy());
    this.sfxCache.clear();
  }
}
