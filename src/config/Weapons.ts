/**
 * Weapons Configuration v3.8
 *
 * Defines all weapon types with stats and behavior
 */

export interface WeaponDef {
  id: string;
  name: string;
  icon: string;

  // Cost
  coinType: 'BONK' | 'AOL' | 'BURGER' | 'VALOR' | 'NONE';
  costPerShot: number;

  // Stats
  damage: number;
  bulletSpeed: number;
  cooldown: number; // seconds

  // Visuals
  bulletSprite: string;
  bulletScale: number;
  bulletColor?: number;

  // Special behavior
  special?: {
    // Spread shot
    pellets?: number;
    spreadAngle?: number; // degrees

    // Piercing
    pierce?: number; // How many enemies to pierce through (0 = none)

    // Splash damage
    splashRadius?: number; // pixels
    splashDamage?: number; // damage to nearby enemies

    // Projectile behavior
    gravity?: boolean; // Ballistic arc (mortar)
    homing?: boolean;
  };

  // Role description for UI
  role: string;
}

export const WEAPON_TYPES: Record<string, WeaponDef> = {
  // === EXISTING WEAPONS (from current game) ===

  bonk: {
    id: 'bonk',
    name: 'BONK Blaster',
    icon: '🟠',
    coinType: 'BONK',
    costPerShot: 1,
    damage: 25,
    bulletSpeed: 400,
    cooldown: 0.2,
    bulletSprite: 'coin-bonk',
    bulletScale: 0.8,
    role: 'Basic all-rounder'
  },

  aol: {
    id: 'aol',
    name: 'AOL Cannon',
    icon: '🔵',
    coinType: 'AOL',
    costPerShot: 1,
    damage: 50,
    bulletSpeed: 500,
    cooldown: 0.3,
    bulletSprite: 'coin-aol',
    bulletScale: 0.9,
    role: 'Higher damage, slower fire'
  },

  burger: {
    id: 'burger',
    name: 'BURGER Heavy',
    icon: '🍔',
    coinType: 'BURGER',
    costPerShot: 1,
    damage: 100,
    bulletSpeed: 300,
    cooldown: 0.5,
    bulletSprite: 'coin-burger',
    bulletScale: 1.0,
    role: 'Slow but powerful'
  },

  valor: {
    id: 'valor',
    name: 'Valor Lance',
    icon: '🦅',
    coinType: 'VALOR',
    costPerShot: 0,
    damage: 150,
    bulletSpeed: 600,
    cooldown: 0.15,
    bulletSprite: 'feather-gold',
    bulletScale: 1.2,
    bulletColor: 0xFFD700,
    special: {
      pierce: 999 // Pierces all enemies
    },
    role: 'Valor Mode only - Ultimate power'
  },

  // === NEW WEAPONS v3.8 ===

  spread: {
    id: 'spread',
    name: 'Eagle Spread',
    icon: '🎯',
    coinType: 'BONK',
    costPerShot: 1,
    damage: 15,
    bulletSpeed: 350,
    cooldown: 0.18,
    bulletSprite: 'coin-bonk',
    bulletScale: 0.6,
    special: {
      pellets: 3,
      spreadAngle: 18 // degrees
    },
    role: 'Close-range crowd clear'
  },

  rail: {
    id: 'rail',
    name: 'Rail AOL',
    icon: '⚡',
    coinType: 'AOL',
    costPerShot: 2,
    damage: 120,
    bulletSpeed: 800,
    cooldown: 0.5,
    bulletSprite: 'coin-aol',
    bulletScale: 1.1,
    bulletColor: 0x00FFFF,
    special: {
      pierce: 3 // Pierces up to 3 enemies
    },
    role: 'Precision line damage'
  },

  mortar: {
    id: 'mortar',
    name: 'Burger Mortar',
    icon: '💣',
    coinType: 'BURGER',
    costPerShot: 2,
    damage: 80,
    bulletSpeed: 250,
    cooldown: 0.6,
    bulletSprite: 'coin-burger',
    bulletScale: 1.2,
    special: {
      gravity: true,
      splashRadius: 64,
      splashDamage: 64
    },
    role: 'Area damage with arc'
  },

  // Emergency fallback weapon
  peck: {
    id: 'peck',
    name: 'Eagle Peck',
    icon: '🦅',
    coinType: 'NONE',
    costPerShot: 0,
    damage: 8,
    bulletSpeed: 300,
    cooldown: 0.6,
    bulletSprite: 'feather-white',
    bulletScale: 0.5,
    role: 'Emergency weapon (no ammo)'
  }
};

/**
 * Weapon unlock requirements
 */
export interface WeaponUnlock {
  weaponId: string;
  requirement: {
    type: 'score' | 'level' | 'mission' | 'always';
    value?: number;
  };
}

export const WEAPON_UNLOCKS: WeaponUnlock[] = [
  { weaponId: 'bonk', requirement: { type: 'always' } },
  { weaponId: 'aol', requirement: { type: 'always' } },
  { weaponId: 'burger', requirement: { type: 'always' } },
  { weaponId: 'valor', requirement: { type: 'always' } },
  { weaponId: 'peck', requirement: { type: 'always' } },

  // New weapons require progression
  { weaponId: 'spread', requirement: { type: 'level', value: 3 } },
  { weaponId: 'rail', requirement: { type: 'level', value: 5 } },
  { weaponId: 'mortar', requirement: { type: 'level', value: 7 } }
];

/**
 * Get weapon definition by ID
 */
export function getWeaponDef(id: string): WeaponDef | undefined {
  return WEAPON_TYPES[id];
}

/**
 * Check if weapon is unlocked
 */
export function isWeaponUnlocked(weaponId: string, playerLevel: number, completedMissions: string[]): boolean {
  const unlock = WEAPON_UNLOCKS.find(u => u.weaponId === weaponId);
  if (!unlock) return false;

  switch (unlock.requirement.type) {
    case 'always':
      return true;
    case 'level':
      return playerLevel >= (unlock.requirement.value || 0);
    case 'mission':
      return completedMissions.includes(unlock.requirement.value?.toString() || '');
    default:
      return false;
  }
}

/**
 * Get all unlocked weapons
 */
export function getUnlockedWeapons(playerLevel: number, completedMissions: string[]): WeaponDef[] {
  return Object.values(WEAPON_TYPES).filter(weapon =>
    isWeaponUnlocked(weapon.id, playerLevel, completedMissions)
  );
}
