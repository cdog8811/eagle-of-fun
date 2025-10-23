// ============================
// Eagle of Fun v3.0 - Weapons Config
// ============================

export interface Weapon {
  id: string;
  name: string;
  description: string;
  cooldown: number; // milliseconds
  damage: number;
  unlockLevel: number;
  coinCost: number; // Cost to reload/reset cooldown
  tier: number; // I-V (1-5)
  special?: string;
}

export interface WeaponUpgrade {
  tier: number;
  cooldownReduction: number; // percentage
  damageMultiplier: number;
  specialEffect?: string;
  xpRequired: number;
}

export const WEAPONS: Weapon[] = [
  {
    id: 'feather-blaster',
    name: 'Feather Blaster',
    description: 'Fires 3 golden feathers in a straight line',
    cooldown: 2000,
    damage: 10,
    unlockLevel: 0,
    coinCost: 5,
    tier: 1,
    special: 'Accurate baseline weapon'
  },
  {
    id: 'aol-pulse',
    name: 'AOL Pulse',
    description: 'Energy wave in US colors, spreads horizontally',
    cooldown: 4000,
    damage: 15,
    unlockLevel: 3,
    coinCost: 10,
    tier: 1,
    special: 'Hits multiple enemies, destroys projectiles'
  },
  {
    id: 'burger-bomb',
    name: 'Burger Bomb',
    description: 'Explosive burger with splash damage',
    cooldown: 6000,
    damage: 25,
    unlockLevel: 5,
    coinCost: 15,
    tier: 1,
    special: 'Perfect vs groups, +10% coin drop'
  },
  {
    id: 'valor-beam',
    name: 'Valor Beam',
    description: 'Golden laser beam, 2s duration',
    cooldown: 10000,
    damage: 50,
    unlockLevel: 8,
    coinCost: 25,
    tier: 1,
    special: '3x damage vs bosses, screen glow'
  },
  {
    id: 'buyback-nova',
    name: 'Buyback Nova (Ultimate)',
    description: 'Patriotic explosion around the eagle',
    cooldown: 30000,
    damage: 100,
    unlockLevel: 10,
    coinCost: 50,
    tier: 1,
    special: 'Requires 100% AOL meter, destroys everything on screen'
  }
];

export const WEAPON_UPGRADES: { [key: string]: WeaponUpgrade[] } = {
  'feather-blaster': [
    { tier: 1, cooldownReduction: 0, damageMultiplier: 1, xpRequired: 0 },
    { tier: 2, cooldownReduction: 10, damageMultiplier: 1.2, xpRequired: 500 },
    { tier: 3, cooldownReduction: 20, damageMultiplier: 1.5, xpRequired: 1500 },
    { tier: 4, cooldownReduction: 30, damageMultiplier: 2, xpRequired: 3000, specialEffect: 'Fires 5 feathers' },
    { tier: 5, cooldownReduction: 40, damageMultiplier: 2.5, xpRequired: 5000, specialEffect: 'Homing feathers' }
  ],
  'aol-pulse': [
    { tier: 1, cooldownReduction: 0, damageMultiplier: 1, xpRequired: 0 },
    { tier: 2, cooldownReduction: 15, damageMultiplier: 1.3, xpRequired: 800 },
    { tier: 3, cooldownReduction: 25, damageMultiplier: 1.6, xpRequired: 2000 },
    { tier: 4, cooldownReduction: 35, damageMultiplier: 2.2, xpRequired: 4000, specialEffect: 'Wider spread' },
    { tier: 5, cooldownReduction: 45, damageMultiplier: 3, xpRequired: 6000, specialEffect: 'Double pulse' }
  ],
  'burger-bomb': [
    { tier: 1, cooldownReduction: 0, damageMultiplier: 1, xpRequired: 0 },
    { tier: 2, cooldownReduction: 12, damageMultiplier: 1.25, xpRequired: 1000 },
    { tier: 3, cooldownReduction: 22, damageMultiplier: 1.5, xpRequired: 2500 },
    { tier: 4, cooldownReduction: 32, damageMultiplier: 2, xpRequired: 5000, specialEffect: 'Larger explosion' },
    { tier: 5, cooldownReduction: 42, damageMultiplier: 2.8, xpRequired: 7500, specialEffect: 'Chain explosions' }
  ],
  'valor-beam': [
    { tier: 1, cooldownReduction: 0, damageMultiplier: 1, xpRequired: 0 },
    { tier: 2, cooldownReduction: 10, damageMultiplier: 1.5, xpRequired: 1500 },
    { tier: 3, cooldownReduction: 20, damageMultiplier: 2, xpRequired: 3500 },
    { tier: 4, cooldownReduction: 30, damageMultiplier: 3, xpRequired: 6000, specialEffect: '3s duration' },
    { tier: 5, cooldownReduction: 40, damageMultiplier: 4, xpRequired: 10000, specialEffect: 'Piercing beam' }
  ],
  'buyback-nova': [
    { tier: 1, cooldownReduction: 0, damageMultiplier: 1, xpRequired: 0 },
    { tier: 2, cooldownReduction: 15, damageMultiplier: 1.5, xpRequired: 2000 },
    { tier: 3, cooldownReduction: 25, damageMultiplier: 2, xpRequired: 5000 },
    { tier: 4, cooldownReduction: 35, damageMultiplier: 3, xpRequired: 8000, specialEffect: 'Larger radius' },
    { tier: 5, cooldownReduction: 45, damageMultiplier: 5, xpRequired: 12000, specialEffect: 'Time freeze 2s' }
  ]
};

// Weapon charge rate: 5% per coin collected
export const WEAPON_CHARGE_PER_COIN = 5; // percent
export const COINS_FOR_FULL_CHARGE = 20; // 100% / 5% = 20 coins
export const BUYBACK_NOVA_AOL_REQUIREMENT = 100; // 100 AOL coins
