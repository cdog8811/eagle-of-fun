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
    'gameover.upgradeButton': 'UPGRADE HANGAR',
    'gameover.playAgainButton': 'PLAY AGAIN',
    'gameover.menuButton': 'MAIN MENU',
    'gameover.shareButton': 'SHARE ON X',

    // Leaderboard Scene
    'leaderboard.title': 'HALL OF DEGENS',
    'leaderboard.yourScore': 'YOUR SCORE',
    'leaderboard.loading': 'Loading leaderboard...',
    'leaderboard.noScores': 'No scores yet. Be the first!',
    'leaderboard.submitButton': 'SUBMIT SCORE',
    'leaderboard.backButton': 'BACK',
    'leaderboard.shareButton': 'SHARE ON X',

    // Upgrade Scene
    'upgrade.title': 'UPGRADE HANGAR',
    'upgrade.availableScore': 'Available Score',
    'upgrade.level': 'Level',
    'upgrade.maxLevel': 'MAX LEVEL',
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

    // How To Play Scene
    'howto.title': 'HOW TO PLAY',
    'howto.controls': 'CONTROLS',
    'howto.controlsText': 'SPACE = Flap Up • WASD/Arrows = Move in all directions\nP = Pause • Weapon auto-fires when unlocked',
    'howto.collectibles': 'COLLECTIBLES',
    'howto.collectiblesText': '$AOL Coin = 5pts • Belle Mod = 25pts (rare!)\nCollect for score, XP, and weapon energy!',
    'howto.enemies': 'ENEMIES',
    'howto.enemiesText': 'Jeeters = 30pts • Paper Hands = 50pts • Gary = 80pts\nBear Boss = 500pts (appears at 5000 score)',
    'howto.powerups': 'POWER-UPS',
    'howto.powerupsText': 'Shield • Magnet • Speed Boost • Freedom Strike\nCollect to gain temporary advantages!',
    'howto.microEvents': 'MICRO-EVENTS',
    'howto.microEventsText': 'Random events like "Elon Tweeted!" or "Market Pump!"\nBonus coins and score multipliers!',
    'howto.progression': 'PROGRESSION',
    'howto.progressionText': 'Earn XP → Level Up → Unlock Upgrades\nSpend score on permanent stat boosts!',
    'howto.onlineLeaderboard': 'ONLINE LEADERBOARD',
    'howto.onlineLeaderboardText': 'Compete globally! Submit your score to the\nHall of Degens and claim your spot!',
    'howto.backButton': 'BACK',

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
    'gameover.upgradeButton': '升级机库',
    'gameover.playAgainButton': '再玩一次',
    'gameover.menuButton': '主菜单',
    'gameover.shareButton': '分享到 X',

    // Leaderboard Scene
    'leaderboard.title': '荣誉殿堂',
    'leaderboard.yourScore': '你的得分',
    'leaderboard.loading': '加载排行榜中...',
    'leaderboard.noScores': '暂无得分。成为第一个！',
    'leaderboard.submitButton': '提交得分',
    'leaderboard.backButton': '返回',
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

    // How To Play Scene
    'howto.title': '游戏玩法',
    'howto.controls': '控制',
    'howto.controlsText': '空格 = 向上飞 • WASD/方向键 = 全方向移动\nP = 暂停 • 解锁后武器自动开火',
    'howto.collectibles': '收集品',
    'howto.collectiblesText': '$AOL 币 = 5分 • Belle 模组 = 25分（稀有！）\n收集以获得分数、经验和武器能量！',
    'howto.enemies': '敌人',
    'howto.enemiesText': 'Jeeters = 30分 • 纸手 = 50分 • Gary = 80分\n熊市Boss = 500分（5000分时出现）',
    'howto.powerups': '道具',
    'howto.powerupsText': '护盾 • 磁铁 • 速度提升 • 自由打击\n收集以获得临时优势！',
    'howto.microEvents': '微事件',
    'howto.microEventsText': '随机事件如"马斯克发推了！"或"市场拉升！"\n奖励币和分数倍数！',
    'howto.progression': '进度',
    'howto.progressionText': '赚取经验 → 升级 → 解锁升级\n花费分数购买永久属性提升！',
    'howto.onlineLeaderboard': '在线排行榜',
    'howto.onlineLeaderboardText': '全球竞争！提交你的分数到\n荣誉殿堂并占据你的位置！',
    'howto.backButton': '返回',

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
