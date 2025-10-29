# Bilingual System Implementation Plan

## ✅ COMPLETED
1. Created i18n.ts translation system with EN/CN dictionaries
2. Added Noto Sans SC font to index.html
3. localStorage support for language persistence

## 🔄 NEXT STEPS (Manual Implementation Needed)

### 1. StartScene.ts
Add at top:
```typescript
import { getI18n } from '../systems/i18n';
```

Add to class:
```typescript
private i18n = getI18n();
```

Add language toggle button in create() after logo:
```typescript
// Language toggle button (top right)
const langButton = this.add.container(width - 80, 50);
const langBg = this.add.graphics();
langBg.fillStyle(0x000000, 1);
langBg.fillRoundedRect(-35, -20, 70, 40, 6);
const langText = this.add.text(0, 0, this.i18n.getLanguage() === 'en' ? '🇺🇸 EN' : '🇨🇳 CN', {
  fontSize: '16px',
  color: '#FFFFFF',
  fontFamily: 'Arial',
  fontStyle: 'bold'
}).setOrigin(0.5);
langButton.add([langBg, langText]);
langButton.setSize(70, 40);
langButton.setInteractive(new Phaser.Geom.Rectangle(-35, -20, 70, 40), Phaser.Geom.Rectangle.Contains);
langButton.on('pointerdown', () => {
  this.i18n.toggleLanguage();
  this.scene.restart(); // Reload scene with new language
});
```

Replace all hardcoded strings with:
```typescript
this.i18n.t('start.title') // instead of 'EAGLE OF FUN'
```

### 2. Update all Text objects to use getFontFamily():
```typescript
fontFamily: this.i18n.getFontFamily() // instead of 'Arial'
```

### 3. Other Scenes to Update:
- GameScene.ts
- GameOverScene.ts
- LeaderboardScene.ts
- UpgradeScene.ts
- HowToPlayScene.ts
- IntroScene.ts
- BuilderIntroScene.ts
- DonationScene.ts (if exists)

### 4. MarketCapManager.ts
Update milestone notifications to use i18n.t()

## Translation Keys Reference
See src/systems/i18n.ts for all available keys.

Format: `this.i18n.t('key.name', { var: 'value' })`
