/**
 * i18n Translation System
 * Bilingual support: English (default) + Chinese
 */

export type Language = 'en' | 'cn';

const LS_KEY_LANGUAGE = 'eagleOfFun_language';

// Translation dictionaries
const translations = {
  en: {
    // Start Scene
    'start.title': 'EAGLE OF FUN',
    'start.tagline': 'STACK. SURVIVE. DOMINATE.',
    'start.playButton': 'START FLIGHT',
    'start.leaderboardButton': 'HALL OF DEGENS',
    'start.howToPlayButton': 'HOW TO PLAY',
    'start.bestScore': 'BEST',
    'start.madeBy': 'Made by Cdog for the america.fun Community',
    'start.version': 'Eagle of Fun – Beta v1.0 (Community Build)',
    'start.telegramEN': 'Telegram (EN)',
    'start.telegramCN': 'Telegram (CN)',
    'start.website': 'America.Fun',
    'start.loading': 'loading...',

    // Game Scene
    'game.score': 'SCORE',
    'game.phase': 'PHASE',
    'game.time': 'TIME',
    'game.level': 'LEVEL',
    'game.xp': 'XP',
    'game.paused': 'GAME PAUSED',
    'game.resume': 'Press P to Resume',
    'game.gameOver': 'GAME OVER',
    'game.finalScore': 'FINAL SCORE',

    // GameOver Scene
    'gameover.title': 'GAME OVER',
    'gameover.finalScore': 'FINAL SCORE',
    'gameover.highScore': 'HIGH SCORE',
    'gameover.newRecord': 'NEW RECORD!',
    'gameover.enterName': 'ENTER YOUR NAME',
    'gameover.saveName': 'SAVE NAME',
    'gameover.tryAgain': 'TRY AGAIN',
    'gameover.hallOfDegens': 'HALL OF DEGENS',
    'gameover.shareButton': 'SHARE ON X',
    'gameover.backToMenu': 'ESC = MAIN MENU',
    'gameover.saving': 'SAVING...',
    'gameover.saved': 'SAVED!\n\nLoading Leaderboard...',
    'gameover.savedLocally': 'SAVED LOCALLY!\n\nLoading Leaderboard...',
    'gameover.upgradeButton': 'UPGRADE HANGAR',
    'gameover.playAgainButton': 'PLAY AGAIN',
    'gameover.menuButton': 'MAIN MENU',
    'gameover.meme2000': '🦅 CERTIFIED DEGEN PILOT 🦅',
    'gameover.meme1000': '🔥 FREEDOM SECURED! 🔥',
    'gameover.meme500': '💪 Not bad, Patriot!',
    'gameover.meme200': '📈 WAGMI',
    'gameover.meme100': '👀 Keep stacking!',
    'gameover.meme0': '😅 You got Jeeted, bro.',

    // Leaderboard Scene
    'leaderboard.title': 'HALL OF DEGENS',
    'leaderboard.yourScore': 'YOUR SCORE',
    'leaderboard.loading': 'Loading leaderboard...',
    'leaderboard.noScores': 'No scores yet. Be the first!',
    'leaderboard.playAgain': 'PLAY AGAIN',
    'leaderboard.mainMenu': 'MAIN MENU',
    'leaderboard.shareButton': 'SHARE ON X',

    // Upgrade Scene
    'upgrade.title': 'UPGRADE HANGAR',
    'upgrade.availableScore': 'Available Score',
    'upgrade.level': 'Level',
    'upgrade.maxLevel': 'MAX',
    'upgrade.cost': 'Cost',
    'upgrade.buyButton': 'BUY',
    'upgrade.playAgainButton': 'PLAY AGAIN',
    'upgrade.resetButton': 'RESET ALL',
    'upgrade.resetConfirm': 'RESET ALL UPGRADES?',
    'upgrade.resetWarning': 'This will reset ALL upgrades!\nYour XP will be refunded.',
    'upgrade.resetCheckbox': 'Also reset my Level and XP',
    'upgrade.resetButtonConfirm': 'RESET',
    'upgrade.cancelButton': 'CANCEL',
    'upgrade.resetSuccess': 'All upgrades reset!',
    'upgrade.resetSuccessWithXP': 'All upgrades and Level reset!',

    // Upgrade Names
    'upgrade.wingStrength': 'Wing Strength',
    'upgrade.magnetRange': 'Magnet Range',
    'upgrade.shieldDuration': 'Shield Duration',
    'upgrade.blasterCooldown': 'Blaster Cooldown',
    'upgrade.valorCooldown': 'Valor Cooldown',
    'upgrade.extraHeart': 'Extra Heart',
    'upgrade.coinValue': 'Coin Value',
    'upgrade.glideEfficiency': 'Glide Efficiency',
    'upgrade.buybackRadius': 'Buyback Radius',
    'upgrade.burgerDuration': 'Burger Duration',

    // Upgrade Descriptions
    'upgrade.wingStrengthDesc': 'Stronger flaps for better control',
    'upgrade.magnetRangeDesc': 'Pull coins from farther away',
    'upgrade.shieldDurationDesc': 'America Hat protection lasts longer',
    'upgrade.blasterCooldownDesc': 'Fire your blaster more frequently',
    'upgrade.valorCooldownDesc': 'Use VALOR mode more often',
    'upgrade.extraHeartDesc': 'Increase maximum health',
    'upgrade.coinValueDesc': 'Earn more XP from coins',
    'upgrade.glideEfficiencyDesc': 'Float more gracefully',
    'upgrade.buybackRadiusDesc': 'Magnet effect has wider range',
    'upgrade.burgerDurationDesc': 'Burger multiplier lasts longer',

    // How To Play Scene
    'howto.title': 'HOW TO PLAY',
    'howto.controls': 'CONTROLS',
    'howto.controlsText': 'SPACE = Flap Up • WASD/Arrows = Move in all directions\nP = Pause • Weapon auto-fires when unlocked',
    'howto.collectibles': 'COLLECTIBLES',
    'howto.collectiblesText': '$AOL Coin = 5pts • Belle Mod = 25pts (rare!)\nCollect for score, XP, and weapon energy!',
    'howto.enemies': 'ENEMIES',
    'howto.enemiesText': 'Jeeters = 30pts • Paper Hands = 50pts • Gary = 80pts\nBear Boss = 500pts (appears at 5000 score)',
    'howto.powerups': 'POWER-UPS',
    'howto.powerupsText': 'Bandana = Speed • Blaster = Weapon • Hat = Shield\nFeder = AOL Magnet • Rose Mod = XP Boost',
    'howto.microEvents': 'MICRO-EVENTS',
    'howto.microEventsText': 'Elon Tweet = AOL Flood • SEC Down = Immunity\nMarket Pump = Score Multiplier • Watch for events!',
    'howto.progression': 'PROGRESSION',
    'howto.progressionText': 'Earn XP → Level Up → Hangar Upgrades\nUpgrade Hall after runs for permanent bonuses!',
    'howto.onlineLeaderboard': 'ONLINE LEADERBOARD',
    'howto.onlineLeaderboardText': 'Compete globally in Hall of Degens!\nSubmit your high score and climb the ranks!',
    'howto.proTip': 'PRO TIP: COLLECT BELLE MODS & UPGRADE IN THE HANGAR!',
    'howto.backButton': 'BACK TO MENU',

    // Intro Scenes
    'intro.cdog.line1': 'Welcome, Degen.',
    'intro.cdog.line2': "I'm Cdog. Built this game with zero experience.",
    'intro.cdog.line3': 'For the memes. For the culture. For America.Fun.',
    'intro.cdog.line4': "Let's fly.",
    'intro.ogle.line1': 'Greetings, brave soul.',
    'intro.ogle.line2': "I'm Ogle. Guardian of the memes.",
    'intro.ogle.line3': 'Your mission: Stack $AOL. Avoid the FUD.',
    'intro.ogle.line4': 'Ready for takeoff?',

    // Donation Scene
    'donation.title': 'SUPPORT THE EAGLE',
    'donation.message': 'Love the game? Send some love!',
    'donation.solAddress': 'SOL Address',
    'donation.copyButton': 'COPY ADDRESS',
    'donation.copied': 'Address copied!',
    'donation.continueButton': 'CONTINUE',
    'donation.skipButton': 'SKIP',

    // MarketCap Milestones
    'milestone.freedomRising': '$AOL hit ${{mcap}}M MCAP – Freedom Rising!',
    'milestone.bullMarket': '$AOL reached ${{mcap}}M MCAP – Bull Market Unlocked!',
    'milestone.communityPump': '$AOL is pumping! ${{mcap}}M – Community Pump Mode!',
    'milestone.valorAwakening': '$AOL surpassed ${{mcap}}M – Valor Awakening!',
    'milestone.bearWhisper': '$AOL fell below ${{mcap}}M – Bear Whisper… Hold the Line!',
    'milestone.rugAlert': 'RUG ALERT! $AOL under ${{mcap}}M – Liquidity gone!',
    'milestone.recap': '$AOL currently at ${{mcap}}M MCAP – {{name}} Active!',

    // Notifications
    'notification.weaponUnlocked': 'WEAPON UNLOCKED',
    'notification.shieldActive': 'SHIELD ACTIVE',
    'notification.magnetActive': 'MAGNET ACTIVE',
    'notification.speedBoost': 'SPEED BOOST',
    'notification.freedomStrike': 'FREEDOM STRIKE',
    'notification.levelUp': 'LEVEL UP!',
    'notification.missionComplete': 'MISSION COMPLETE',
    'notification.bossDefeated': 'BOSS DEFEATED',
    'notification.valorMode': 'VALOR MODE ACTIVATED',

    // Common
    'common.yes': 'YES',
    'common.no': 'NO',
    'common.ok': 'OK',
    'common.cancel': 'CANCEL',
    'common.close': 'CLOSE',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success'
  },

  cn: {
    // Start Scene
    'start.title': '美国之鹰',
    'start.tagline': '收集。生存。主宰。',
    'start.playButton': '开始飞行',
    'start.leaderboardButton': '荣誉殿堂',
    'start.howToPlayButton': '游戏玩法',
    'start.bestScore': '最佳',
    'start.madeBy': 'Cdog 为 america.fun 社区制作',
    'start.version': '美国之鹰 – Beta v1.0 (社区版)',
    'start.telegramEN': 'Telegram (英文)',
    'start.telegramCN': 'Telegram (中文)',
    'start.website': 'America.Fun',
    'start.loading': '加载中...',

    // Game Scene
    'game.score': '得分',
    'game.phase': '阶段',
    'game.time': '时间',
    'game.level': '等级',
    'game.xp': '经验',
    'game.paused': '游戏已暂停',
    'game.resume': '按 P 继续',
    'game.gameOver': '游戏结束',
    'game.finalScore': '最终得分',

    // GameOver Scene
    'gameover.title': '游戏结束',
    'gameover.finalScore': '最终得分',
    'gameover.highScore': '最高分',
    'gameover.newRecord': '新纪录！',
    'gameover.enterName': '输入你的名字',
    'gameover.saveName': '保存名字',
    'gameover.tryAgain': '再试一次',
    'gameover.hallOfDegens': '荣誉殿堂',
    'gameover.shareButton': '分享到 X',
    'gameover.backToMenu': 'ESC = 主菜单',
    'gameover.saving': '保存中...',
    'gameover.saved': '已保存！\n\n加载排行榜中...',
    'gameover.savedLocally': '已本地保存！\n\n加载排行榜中...',
    'gameover.upgradeButton': '升级机库',
    'gameover.playAgainButton': '再玩一次',
    'gameover.menuButton': '主菜单',
    'gameover.meme2000': '🦅 认证的飞行员 🦅',
    'gameover.meme1000': '🔥 自由已保障！🔥',
    'gameover.meme500': '💪 不错，爱国者！',
    'gameover.meme200': '📈 我们都会成功',
    'gameover.meme100': '👀 继续积累！',
    'gameover.meme0': '😅 你被收割了，兄弟。',

    // Leaderboard Scene
    'leaderboard.title': '荣誉殿堂',
    'leaderboard.yourScore': '你的得分',
    'leaderboard.loading': '加载排行榜中...',
    'leaderboard.noScores': '暂无得分。成为第一个！',
    'leaderboard.playAgain': '再玩一次',
    'leaderboard.mainMenu': '主菜单',
    'leaderboard.shareButton': '分享到 X',

    // Upgrade Scene
    'upgrade.title': '升级机库',
    'upgrade.availableScore': '可用分数',
    'upgrade.level': '等级',
    'upgrade.maxLevel': '满级',
    'upgrade.cost': '花费',
    'upgrade.buyButton': '购买',
    'upgrade.playAgainButton': '再玩一次',
    'upgrade.resetButton': '重置全部',
    'upgrade.resetConfirm': '重置所有升级？',
    'upgrade.resetWarning': '这将重置所有升级！\n你的经验将被退还。',
    'upgrade.resetCheckbox': '同时重置我的等级和经验',
    'upgrade.resetButtonConfirm': '重置',
    'upgrade.cancelButton': '取消',
    'upgrade.resetSuccess': '所有升级已重置！',
    'upgrade.resetSuccessWithXP': '所有升级和等级已重置！',

    // Upgrade Names
    'upgrade.wingStrength': '翅膀力量',
    'upgrade.magnetRange': '磁铁范围',
    'upgrade.shieldDuration': '护盾持续',
    'upgrade.blasterCooldown': '武器冷却',
    'upgrade.valorCooldown': '勇气冷却',
    'upgrade.extraHeart': '额外生命',
    'upgrade.coinValue': '硬币价值',
    'upgrade.glideEfficiency': '滑翔效率',
    'upgrade.buybackRadius': '回购范围',
    'upgrade.burgerDuration': '汉堡持续',

    // Upgrade Descriptions
    'upgrade.wingStrengthDesc': '更强的扇翅获得更好控制',
    'upgrade.magnetRangeDesc': '从更远处拉取硬币',
    'upgrade.shieldDurationDesc': '美国帽子保护持续更久',
    'upgrade.blasterCooldownDesc': '更频繁地发射武器',
    'upgrade.valorCooldownDesc': '更频繁使用勇气模式',
    'upgrade.extraHeartDesc': '增加最大生命值',
    'upgrade.coinValueDesc': '从硬币获得更多经验',
    'upgrade.glideEfficiencyDesc': '更优雅地漂浮',
    'upgrade.buybackRadiusDesc': '磁铁效果范围更广',
    'upgrade.burgerDurationDesc': '汉堡倍增持续更久',

    // How To Play Scene
    'howto.title': '游戏玩法',
    'howto.controls': '控制',
    'howto.controlsText': '空格 = 向上飞 • WASD/方向键 = 全方向移动\nP = 暂停 • 解锁后武器自动开火',
    'howto.collectibles': '收集品',
    'howto.collectiblesText': '$AOL 币 = 5分 • Belle 模组 = 25分（稀有！）\n收集以获得分数、经验和武器能量！',
    'howto.enemies': '敌人',
    'howto.enemiesText': 'Jeeters = 30分 • 纸手 = 50分 • Gary = 80分\n熊市Boss = 500分（5000分时出现）',
    'howto.powerups': '道具',
    'howto.powerupsText': '头巾 = 速度 • 武器 = 射击 • 帽子 = 护盾\n羽毛 = AOL 磁铁 • Rose 模组 = 经验提升',
    'howto.microEvents': '微事件',
    'howto.microEventsText': '马斯克推文 = AOL 洪水 • SEC 关闭 = 免疫\n市场拉升 = 分数倍增 • 关注事件！',
    'howto.progression': '进度',
    'howto.progressionText': '赚取经验 → 升级 → 机库升级\n游戏后升级大厅以获得永久加成！',
    'howto.onlineLeaderboard': '在线排行榜',
    'howto.onlineLeaderboardText': '全球竞争荣誉殿堂！\n提交你的最高分并攀登排名！',
    'howto.proTip': '专业提示：收集 BELLE 模组并在机库升级！',
    'howto.backButton': '返回菜单',

    // Intro Scenes
    'intro.cdog.line1': '欢迎，Degen。',
    'intro.cdog.line2': '我是 Cdog。零经验做了这个游戏。',
    'intro.cdog.line3': '为了模因。为了文化。为了 America.Fun。',
    'intro.cdog.line4': '让我们飞吧。',
    'intro.ogle.line1': '问候，勇敢的灵魂。',
    'intro.ogle.line2': '我是 Ogle。模因的守护者。',
    'intro.ogle.line3': '你的任务：收集 $AOL。避开 FUD。',
    'intro.ogle.line4': '准备起飞了吗？',

    // Donation Scene
    'donation.title': '支持鹰',
    'donation.message': '喜欢这个游戏？送点爱！',
    'donation.solAddress': 'SOL 地址',
    'donation.copyButton': '复制地址',
    'donation.copied': '地址已复制！',
    'donation.continueButton': '继续',
    'donation.skipButton': '跳过',

    // MarketCap Milestones
    'milestone.freedomRising': '🇺🇸 $AOL 达到 ${{mcap}}M 市值 – 自由崛起！',
    'milestone.bullMarket': '🚀 $AOL 达到 ${{mcap}}M 市值 – 牛市解锁！',
    'milestone.communityPump': '🎉 $AOL 在拉升！${{mcap}}M – 社区拉升模式！',
    'milestone.valorAwakening': '🦅 $AOL 超过 ${{mcap}}M – 勇气觉醒！',
    'milestone.bearWhisper': '😴 $AOL 跌破 ${{mcap}}M – 熊市低语...坚守阵线！',
    'milestone.rugAlert': '💀 跑路警报！$AOL 低于 ${{mcap}}M – 流动性消失！',
    'milestone.recap': '$AOL 目前 ${{mcap}}M 市值 – {{name}}活跃中！',

    // Notifications
    'notification.weaponUnlocked': '武器已解锁',
    'notification.shieldActive': '护盾激活',
    'notification.magnetActive': '磁铁激活',
    'notification.speedBoost': '速度提升',
    'notification.freedomStrike': '自由打击',
    'notification.levelUp': '升级了！',
    'notification.missionComplete': '任务完成',
    'notification.bossDefeated': 'Boss 已击败',
    'notification.valorMode': '勇气模式激活',

    // Common
    'common.yes': '是',
    'common.no': '否',
    'common.ok': '确定',
    'common.cancel': '取消',
    'common.close': '关闭',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功'
  }
};

class I18nManager {
  private currentLanguage: Language = 'en';

  constructor() {
    // Load saved language from localStorage
    const saved = localStorage.getItem(LS_KEY_LANGUAGE) as Language | null;
    if (saved && (saved === 'en' || saved === 'cn')) {
      this.currentLanguage = saved;
    }
  }

  /**
   * Get current language
   */
  getLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Set language and save to localStorage
   */
  setLanguage(lang: Language): void {
    this.currentLanguage = lang;
    localStorage.setItem(LS_KEY_LANGUAGE, lang);
    console.log(`🌐 Language changed to: ${lang}`);
  }

  /**
   * Toggle between EN and CN
   */
  toggleLanguage(): Language {
    const newLang: Language = this.currentLanguage === 'en' ? 'cn' : 'en';
    this.setLanguage(newLang);
    return newLang;
  }

  /**
   * Translate a key with optional interpolation
   * Example: t('milestone.freedomRising', { mcap: '5.0' })
   */
  t(key: string, vars?: Record<string, string | number>): string {
    const dict = translations[this.currentLanguage];
    let text = dict[key as keyof typeof dict] || key;

    // Interpolate variables
    if (vars) {
      Object.keys(vars).forEach(varKey => {
        text = text.replace(`{{${varKey}}}`, String(vars[varKey]));
      });
    }

    return text;
  }

  /**
   * Get font family based on current language
   */
  getFontFamily(): string {
    return this.currentLanguage === 'cn' ? 'Noto Sans SC, Arial, sans-serif' : 'Arial';
  }
}

// Singleton instance
let i18nInstance: I18nManager | null = null;

export function getI18n(): I18nManager {
  if (!i18nInstance) {
    i18nInstance = new I18nManager();
  }
  return i18nInstance;
}

export const t = (key: string, vars?: Record<string, string | number>): string => {
  return getI18n().t(key, vars);
};
