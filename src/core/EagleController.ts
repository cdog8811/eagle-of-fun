/**
 * EagleController v3.8
 *
 * Handles player movement, input, invincibility, and state
 */

import Phaser from 'phaser';
import { Eagle } from '../sprites/Eagle';

export interface EagleState {
  lives: number;
  maxLives: number;
  invincible: boolean;
  shielded: boolean;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

export class EagleController {
  private scene: Phaser.Scene;
  private eagle?: Eagle;

  // State
  private lives: number = 3;
  private maxLives: number = 3;
  private invincible: boolean = false;
  private shielded: boolean = false;

  // Input
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  // Movement
  private baseSpeed: number = 300;
  private currentSpeed: number = 300;
  private speedBonus: number = 0; // From upgrades
  private speedBoostMultiplier: number = 1.0; // Temporary boost from power-ups

  // Invincibility timing
  private invincibilityTimer?: Phaser.Time.TimerEvent;
  private invincibilityDuration: number = 2000; // ms

  // Callbacks
  private onDamageCallback?: () => void;
  private onDeathCallback?: () => void;
  private onLifeGainCallback?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Set the eagle sprite to control
   */
  public setEagle(eagle: Eagle, speedBonus: number = 0): void {
    this.eagle = eagle;
    this.speedBonus = speedBonus;
    this.updateSpeed();
  }

  /**
   * Initialize the controller
   */
  public init(startingLives: number = 3): void {
    // Setup input
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasd = {
        W: this.scene.input.keyboard.addKey('W'),
        A: this.scene.input.keyboard.addKey('A'),
        S: this.scene.input.keyboard.addKey('S'),
        D: this.scene.input.keyboard.addKey('D')
      };
    }

    // Reset state
    this.maxLives = startingLives;
    this.lives = startingLives;
    this.invincible = false;
    this.shielded = false;

    console.log('🦅 EagleController initialized');
  }

  /**
   * Update speed based on bonus and boost
   */
  private updateSpeed(): void {
    this.currentSpeed = (this.baseSpeed + this.speedBonus) * this.speedBoostMultiplier;
  }

  /**
   * Update movement and state (call every frame)
   */
  public update(dt: number): void {
    if (!this.eagle || !this.eagle.active) return;

    this.handleMovement(dt);
  }

  // ========== MOVEMENT ==========

  /**
   * Handle player input and movement
   */
  private handleMovement(dt: number): void {
    if (!this.cursors || !this.wasd) return;

    const eagle = this.eagle as any; // Access underlying Phaser sprite
    let velocityX = 0;
    let velocityY = 0;

    // Get input directions
    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    // Calculate velocity
    if (left) velocityX = -1;
    if (right) velocityX = 1;
    if (up) velocityY = -1;
    if (down) velocityY = 1;

    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707; // 1/√2
      velocityY *= 0.707;
    }

    // Apply speed
    const speed = this.currentSpeed + this.speedBonus;
    const body = eagle.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setVelocity(velocityX * speed, velocityY * speed);
    }

    // Keep within bounds
    this.clampToBounds();
  }

  /**
   * Keep eagle within screen bounds
   */
  private clampToBounds(): void {
    const eagle = this.eagle as any;
    const { width, height } = this.scene.cameras.main;

    const padding = 30;
    eagle.x = Phaser.Math.Clamp(eagle.x, padding, width - padding);
    eagle.y = Phaser.Math.Clamp(eagle.y, padding, height - padding);
  }

  // ========== DAMAGE SYSTEM ==========

  /**
   * Take damage (if not invincible/shielded)
   */
  public takeDamage(): boolean {
    // Check protection
    if (this.invincible || this.shielded) {
      return false;
    }

    // Lose life
    this.lives--;

    // Play hit animation
    this.eagle.playHitAnimation();

    // Start invincibility
    this.startInvincibility();

    // Notify callback
    if (this.onDamageCallback) {
      this.onDamageCallback();
    }

    console.log(`💔 Damage taken! Lives: ${this.lives}/${this.maxLives}`);

    // Check for death
    if (this.lives <= 0) {
      this.die();
      return true;
    }

    return true;
  }

  /**
   * Start invincibility period
   */
  private startInvincibility(): void {
    this.invincible = true;

    // Clear existing timer
    if (this.invincibilityTimer) {
      this.invincibilityTimer.destroy();
    }

    // Flash animation
    this.createFlashAnimation();

    // Set timer
    this.invincibilityTimer = this.scene.time.delayedCall(
      this.invincibilityDuration,
      () => {
        this.invincible = false;
        (this.eagle as any).setAlpha(1);
      }
    );
  }

  /**
   * Create flashing effect during invincibility
   */
  private createFlashAnimation(): void {
    const eagle = this.eagle as any;
    let flashCount = 0;

    const flashTimer = this.scene.time.addEvent({
      delay: 150,
      repeat: Math.floor(this.invincibilityDuration / 150),
      callback: () => {
        eagle.setAlpha(flashCount % 2 === 0 ? 0.3 : 1);
        flashCount++;
      }
    });

    // Clean up flash timer when invincibility ends
    this.scene.time.delayedCall(this.invincibilityDuration, () => {
      flashTimer.destroy();
      eagle.setAlpha(1);
    });
  }

  /**
   * Gain a life (from power-up)
   */
  public gainLife(): void {
    if (this.lives >= this.maxLives) {
      console.log('💚 Already at max lives');
      return;
    }

    this.lives++;

    if (this.onLifeGainCallback) {
      this.onLifeGainCallback();
    }

    console.log(`💚 Life gained! Lives: ${this.lives}/${this.maxLives}`);
  }

  /**
   * Die
   */
  private die(): void {
    console.log('💀 Eagle died');

    if (this.onDeathCallback) {
      this.onDeathCallback();
    }
  }

  // ========== SHIELD SYSTEM ==========

  /**
   * Activate shield
   */
  public activateShield(): void {
    this.shielded = true;
    console.log('🛡️ Shield activated');
  }

  /**
   * Deactivate shield
   */
  public deactivateShield(): void {
    this.shielded = false;
    console.log('🛡️ Shield deactivated');
  }

  /**
   * Set shield state (for power-ups)
   */
  public setShield(active: boolean): void {
    this.shielded = active;
    console.log(`🛡️ Shield ${active ? 'activated' : 'deactivated'}`);
  }

  // ========== POWER-UPS ==========

  /**
   * Set invincibility (for power-ups)
   */
  public setInvincibility(durationSeconds: number): void {
    this.invincible = true;

    // Clear existing timer
    if (this.invincibilityTimer) {
      this.invincibilityTimer.destroy();
    }

    // Flash animation
    this.createFlashAnimation();

    // Set timer
    this.invincibilityTimer = this.scene.time.delayedCall(
      durationSeconds * 1000,
      () => {
        this.invincible = false;
        (this.eagle as any).setAlpha(1);
      }
    );

    console.log(`⚡ Invincibility activated for ${durationSeconds}s`);
  }

  /**
   * Set speed boost multiplier (for power-ups)
   */
  public setSpeedBoost(multiplier: number): void {
    this.speedBoostMultiplier = multiplier;
    this.updateSpeed();
    console.log(`⚡ Speed boost: ${multiplier}x`);
  }

  // ========== UPGRADES ==========

  /**
   * Apply speed bonus from upgrades
   */
  public setSpeedBonus(bonus: number): void {
    this.speedBonus = bonus;
    this.updateSpeed();
    console.log(`⚡ Speed bonus: +${bonus}`);
  }

  /**
   * Set max lives (from upgrades)
   */
  public setMaxLives(max: number): void {
    this.maxLives = max;
    console.log(`❤️ Max lives: ${max}`);
  }

  // ========== GETTERS ==========

  public getEagle(): Eagle {
    return this.eagle;
  }

  public getState(): EagleState {
    const eagle = this.eagle as any;
    return {
      lives: this.lives,
      maxLives: this.maxLives,
      invincible: this.invincible,
      shielded: this.shielded,
      position: { x: eagle.x, y: eagle.y },
      velocity: { x: eagle.body?.velocity.x || 0, y: eagle.body?.velocity.y || 0 }
    };
  }

  public getLives(): number {
    return this.lives;
  }

  public getMaxLives(): number {
    return this.maxLives;
  }

  public isInvincible(): boolean {
    return this.invincible;
  }

  public isShielded(): boolean {
    return this.shielded;
  }

  public getPosition(): { x: number; y: number } {
    const eagle = this.eagle as any;
    return { x: eagle.x, y: eagle.y };
  }

  // ========== CALLBACKS ==========

  public onDamage(callback: () => void): void {
    this.onDamageCallback = callback;
  }

  public onDeath(callback: () => void): void {
    this.onDeathCallback = callback;
  }

  public onLifeGain(callback: () => void): void {
    this.onLifeGainCallback = callback;
  }

  // ========== CLEANUP ==========

  public destroy(): void {
    if (this.invincibilityTimer) {
      this.invincibilityTimer.destroy();
    }
    if (this.eagle) {
      this.eagle.destroy();
    }
  }
}
