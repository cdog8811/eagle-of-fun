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

    // UI
    'ui.level': 'LEVEL {{level}}',
    'ui.levelLabel': 'Level',
    'ui.xp': 'XP',
    'ui.noMission': '⏸️ No Mission',
    'ui.missionDone': '✅ Done',
    'ui.noWeapon': 'No Weapon',

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
    'upgrade.subtitle': 'SPEND XP TO ENHANCE YOUR EAGLE',
    'upgrade.availableXP': 'Available XP',
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
    'howto.powerupsText': 'Bandana = Speed • Blaster = Weapon • Hat = Shield • Valor = Eagle Power\nRose 🌹 = FUD Immunity • CryptoActing = Early Entry • Danxx = Market Stabilizer • Vesper 🦌 = Extra Life',
    'howto.microEvents': 'MICRO-EVENTS',
    'howto.microEventsText': 'Elon Tweet = AOL Flood • SEC Down = Immunity\nMarket Pump = Score Multiplier • Watch for events!',
    'howto.progression': 'PROGRESSION',
    'howto.progressionText': 'Earn XP → Level Up → Hangar Upgrades\nUpgrade Hall after runs for permanent bonuses!',
    'howto.onlineLeaderboard': 'ONLINE LEADERBOARD',
    'howto.onlineLeaderboardText': 'Compete globally in Hall of Degens!\nSubmit your high score and climb the ranks!',
    'howto.proTip': 'PRO TIP: COLLECT BELLE MODS & UPGRADE IN THE HANGAR!',
    'howto.disclaimer': 'Eagle of Fun is a fan-made meme game inspired by the America.Fun community and crypto culture.\nAll characters, logos, and references are parodies made for entertainment only.\nNo affiliation with any company, token, or project. Built by a supporter for fun — not for profit.',
    'howto.backButton': 'BACK TO MENU',

    // Intro Scenes - Cdog
    'intro.cdog.line1': 'Hi Patriots,',
    'intro.cdog.line2': 'Cdog here.',
    'intro.cdog.line3': "I'm just a creative, not a coder.",
    'intro.cdog.line4': 'No team. No plan. No idea what I\'m doing.',
    'intro.cdog.line5': "But I'm a small $AOL holder,",
    'intro.cdog.line6': 'and I wanted to build something for the culture.',
    'intro.cdog.line7': 'To connect the America.Fun communities and keep the vibes alive.',
    'intro.cdog.line8': 'Elon banned my X account,',
    'intro.cdog.line9': "so I can't help with the raids anymore.",
    'intro.cdog.line10': 'So I built a game instead.',
    'intro.cdog.line11': "Yeah, it's buggy. It's messy.",
    'intro.cdog.line12': "But it's real, and made with love for this community.",
    'intro.cdog.line13': "Let's make memes, not excuses. 🦅",
    'intro.skip': 'Tap anywhere to skip',
    'intro.continue': 'Tap anywhere to continue',

    // Intro Scenes - Ogle
    'intro.ogle.line1': 'Ogle: Hi, Degen.',
    'intro.ogle.line2': 'Glad you showed up.',
    'intro.ogle.line3': 'The markets are a mess...',
    'intro.ogle.line4': 'Jeeters are dumping, Paper Hands are crying,',
    'intro.ogle.line5': 'and the Bear is waking up again.',
    'intro.ogle.line6': 'We need someone brave.',
    'intro.ogle.line7': 'Someone fast.',
    'intro.ogle.line8': 'Someone who can fly through FUD and buy back the Fun.',
    'intro.ogle.line9': "That's you, Eagle.",
    'intro.ogle.line10': 'Collect the tokens.',
    'intro.ogle.line11': 'Avoid the Paperhands.',
    'intro.ogle.line12': 'Save the market.',
    'intro.ogle.line13': "Let's rebuild America.Fun together.",
    'intro.ogle.line14': 'Ready to fly?',
    'intro.launch': '[TAP TO LAUNCH 🚀]',
    'intro.connecting': 'Connecting to America.fun RPC...',
    'intro.error': 'Error 404 – FUD detected.',
    'intro.startFlight': 'Start Flight',

    // Donation Scene
    'donation.message1': 'Thanks for playing, Patriots. 🦅',
    'donation.message2': 'If you had fun, laughed a bit, or just enjoyed the chaos, you can help keep Eagle of Fun alive.',
    'donation.message3': 'Every bit of support goes into server costs, AI time, and new features we will build together as a community.',
    'donation.solLabel': 'SOL',
    'donation.tapToCopy': '(tap or click to copy)',
    'donation.message4': 'No pressure, this is for the culture, not for profit.',
    'donation.thanks': 'Thank you for flying with me. ❤️',
    'donation.copyButton': 'COPY ADDRESS',
    'donation.copied': 'Address copied ✅',
    'donation.copyFailed': 'Failed to copy ❌',
    'donation.mainMenu': 'MAIN MENU',
    'donation.hallOfDegens': 'HALL OF DEGENS',
    'donation.spaceHint': 'Press SPACE to view Hall of Degens',
    'donation.footer': 'Private donation — voluntary support for development (no commercial purchase).\nDonations are considered private gifts under German tax law (EStG §22, Nr. 3).',

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
    'notification.buybackActive': 'BUYBACK ACTIVE',
    'notification.americaHatActive': 'AMERICA HAT ACTIVE',
    'notification.belleModActive': 'BELLE MOD ACTIVE',
    'notification.burgerActive': 'BURGER MULTIPLIER ACTIVE',
    'notification.eatTheDip': 'EAT THE DIP',
    'notification.bullMarket': 'BULL MARKET',
    'notification.blasterUnlocked': 'NEW WEAPON UNLOCKED - BLASTER',
    'notification.valorStage1': 'VALOR MODE - STAGE 1',
    'notification.valorStage2': 'VALOR ASCENSION - STAGE 2',
    'notification.extraLife': '+1 LIFE',
    'notification.cryptoActingActive': 'CRYPTO ACTING ACTIVE',
    'notification.perfectEntry': 'PERFECT ENTRY',
    'notification.danxxActive': 'DANXX PROTOCOL ACTIVE',
    'notification.roseModActive': 'ROSE MOD ACTIVE',
    'notification.modEnded': 'MOD MODE ENDED',
    'notification.vibesKept': 'Vibes Kept High',
    'notification.pointsDestroyed': 'POINTS - {{count}} DESTROYED',
    'notification.combo': 'COMBO',

    // Floating Text
    'floating.banned': '🚫 BANNED',
    'floating.protected': '🛡️ PROTECTED',
    'floating.fake': '⚠️ FAKE!',
    'floating.hodl': '💎 HODL',
    'floating.gm': '☀️ GM',
    'floating.wagmi': '🚀 WAGMI',
    'floating.ngmi': '📉 NGMI',

    // Market Phases
    'marketPhase.bullRun': '🐂 BULL RUN ACTIVE – Traders in euphoria!',
    'marketPhase.correction': '📉 Correction Phase – Market cooling down.',
    'marketPhase.bearTrap': '🐻 Bear Trap – Jeeters everywhere!',
    'marketPhase.sideways': '↔️ Sideways Phase – Market consolidating.',
    'marketPhase.valorComeback': '🦅 Valor Comeback – America rises again!',
    'marketPhase.endlessWagmi': '🌟 ENDLESS WAGMI MODE – Pure chaos!',

    // Micro Events
    'microEvent.elonTweet': '🚀 Elon tweeted! Coins flooding in!',
    'microEvent.secDown': '😴 SEC servers down! Enemy pause!',
    'microEvent.marketPump': '💰 Market Pump! Coin rain!',
    'microEvent.burgerFriday': '🍔 Burger Friday! XP ×2!',
    'microEvent.valorDrop': '🦅 Valor Drop incoming! Get ready!',

    // Mission Tiers
    'mission.tier1.name': 'Rookie Eagle 🦅',
    'mission.tier1.desc': 'Learn to fly, collect, and survive',
    'mission.tier1.reward': 'Tier 1 Complete: Ready to Soar!',

    'mission.tier2.name': 'Degen Flyer 🚀',
    'mission.tier2.desc': 'Master the basics and face tougher challenges',
    'mission.tier2.reward': 'Tier 2 Complete: True Degen Unlocked!',

    'mission.tier3.name': 'Market Guardian 💎',
    'mission.tier3.desc': 'Advanced challenges for experienced players',
    'mission.tier3.reward': 'Tier 3 Complete: Guardian Status Achieved!',

    // Mission Titles & Descriptions (Tier 1)
    'mission.rookieCollect.title': 'First Haul',
    'mission.rookieCollect.desc': '💰 Collect 50 Tokens',

    'mission.rookieTime.title': 'Survival Basics',
    'mission.rookieTime.desc': '⏱️ Survive 2 Minutes',

    'mission.rookieShield.title': 'Shield Master',
    'mission.rookieShield.desc': '🛡️ Destroy 10 enemies with Belle/Shield',

    // Mission Titles & Descriptions (Tier 2)
    'mission.degenCollect.title': 'Token Hoarder',
    'mission.degenCollect.desc': '💎 Collect 100 Tokens',

    'mission.degenBelleKills.title': 'Belle Mod Hunter',
    'mission.degenBelleKills.desc': '⚔️ Kill 25 enemies with Belle Mod',

    'mission.degenCombo.title': 'Combo Master',
    'mission.degenCombo.desc': '🔥 Achieve a 5x combo',

    'mission.degenScore.title': 'Score Hunter',
    'mission.degenScore.desc': '⭐ Reach 15,000 points',

    // Mission Titles & Descriptions (Tier 3)
    'mission.commanderScore.title': 'High Flyer',
    'mission.commanderScore.desc': '🎯 Reach 50,000 points',

    'mission.commanderBear.title': 'Bear Slayer',
    'mission.commanderBear.desc': '🐻 Survive the Bear Trap phase',

    'mission.commanderPerfect.title': 'Perfect Run',
    'mission.commanderPerfect.desc': '💯 Survive 3 minutes without damage',

    'mission.commanderEnemies.title': 'Enemy Crusher',
    'mission.commanderEnemies.desc': '💥 Kill 50 enemies',

    // Mission Titles & Descriptions (Tier 4)
    'mission.tier4.name': 'Launch Patriot 🚀',
    'mission.tier4.desc': 'Elite challenges for skilled pilots',
    'mission.tier4.reward': 'Tier 4 Complete: Patriot Status!',

    'mission.patriotPerfectKills.title': 'Flawless Fighter',
    'mission.patriotPerfectKills.desc': '🎖️ Kill 10 enemies without taking damage',

    'mission.patriotScore.title': 'Score Legend',
    'mission.patriotScore.desc': '💫 Reach 100,000 points',

    'mission.patriotPhases.title': 'Phase Master',
    'mission.patriotPhases.desc': '🔄 Complete all phases',

    'mission.patriotCombo.title': 'Combo King',
    'mission.patriotCombo.desc': '⚡ Achieve a 30x combo',

    // Mission Titles & Descriptions (Tier 5)
    'mission.tier5.name': 'America Legend 🦅',
    'mission.tier5.desc': 'Ultimate challenges for legends',
    'mission.tier5.reward': 'Tier 5 Complete: Legend Achieved!',

    'mission.legendMillion.title': 'Million Point Club',
    'mission.legendMillion.desc': '🌟 Reach 1,000,000 points',

    'mission.legendFlawless.title': 'Flawless Legend',
    'mission.legendFlawless.desc': '👑 Survive 5 minutes without damage',

    'mission.legendEnemies.title': 'Mass Destroyer',
    'mission.legendEnemies.desc': '💣 Kill 200 enemies',

    // Daily Mission Titles & Descriptions
    'mission.dailyBonk.title': 'Bonk Collector',
    'mission.dailyBonk.desc': '🟠 Collect 30 BONK coins',

    'mission.dailyBurger.title': 'Burger Run',
    'mission.dailyBurger.desc': '🍔 Collect 5 Burgers',

    'mission.dailyPumpfun.title': 'Pump Hunter',
    'mission.dailyPumpfun.desc': '💊 Kill 5 Pump.fun enemies',

    'mission.dailyFourmeme.title': 'Meme Slayer',
    'mission.dailyFourmeme.desc': '🤡 Kill 5 4Chan Meme enemies',

    'mission.dailyQuick.title': 'Quick Score',
    'mission.dailyQuick.desc': '⚡ Reach 10,000 points',

    'mission.dailyBear.title': 'Bear Hunter',
    'mission.dailyBear.desc': '🐻 Kill 3 Bears',

    // Phase Names
    'phase.softLaunch': 'Soft Launch 🚀',
    'phase.paperPanic': 'Paper Panic 👋',
    'phase.candleCrash': 'Candle Crash 📉',
    'phase.regulationRun': 'Regulation Run 🧑‍💼',
    'phase.bearMarket': 'Bear Market Finale 🐻',

    // Phase Descriptions
    'phase.softLaunch.desc': 'Get started, collect burgers! Easy enemies only.',
    'phase.paperPanic.desc': 'Watch out for fake coins!',
    'phase.candleCrash.desc': 'Red candles everywhere!',
    'phase.regulationRun.desc': 'Government crackdown!',
    'phase.bearMarket.desc': 'Survive the bears!',
    'phase.wagmi': 'WAGMI Mode 🦅',

    // Market Phase Names
    'marketPhaseName.bullRun': 'Bull Run',
    'marketPhaseName.correction': 'Correction',
    'marketPhaseName.bearTrap': 'Bear Trap',
    'marketPhaseName.sideways': 'Sideways Phase',
    'marketPhaseName.valorComeback': 'Valor Comeback',
    'marketPhaseName.endlessWagmi': 'Endless WAGMI',

    // Market Phase Themes
    'marketPhaseTheme.euphoria': 'Euphoria',
    'marketPhaseTheme.realitySetsIn': 'Reality sets in',
    'marketPhaseTheme.panic': 'Panic',
    'marketPhaseTheme.marketBreathes': 'Market breathes',
    'marketPhaseTheme.heroic': 'Heroic',
    'marketPhaseTheme.chaos': 'Chaos',

    // Power-up Names
    'powerup.bandana': 'BANDANA MODE ACTIVE',
    'powerup.bandanaTimer': 'BANDANA',
    'powerup.shield': 'SHIELD',
    'powerup.belle': 'BELLE',
    'powerup.magnet': 'MAGNET',
    'powerup.valor': 'VALOR',
    'powerup.weapon': 'WEAPON',
    'powerup.vesper0x': 'EXTRA LIFE',

    // Weapons
    'weapon.basicBlaster': 'Basic Blaster',
    'weapon.rapidCannon': 'Rapid Cannon',
    'weapon.powerLaser': 'Power Laser',
    'weapon.eagleSpread': 'Eagle Spread',
    'weapon.railAol': 'Rail AOL',
    'weapon.burgerMortar': 'Burger Mortar',
    'weapon.laserEyes': 'LASER EYES 👀⚡',

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

    // UI
    'ui.level': '等级 {{level}}',
    'ui.levelLabel': '等级',
    'ui.xp': '经验',
    'ui.noMission': '⏸️ 无任务',
    'ui.missionDone': '✅ 完成',
    'ui.noWeapon': '无武器',

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
    'upgrade.subtitle': '花费 XP 强化你的鹰',
    'upgrade.availableXP': '可用 XP',
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
    'howto.powerupsText': '头巾 = 速度 • 武器 = 射击 • 帽子 = 护盾 • Valor = 鹰之力\nRose 🌹 = FUD免疫 • CryptoActing = 早期进入 • Danxx = 市场稳定器 • Vesper 🦌 = 额外生命',
    'howto.microEvents': '微事件',
    'howto.microEventsText': '马斯克推文 = AOL 洪水 • SEC 关闭 = 免疫\n市场拉升 = 分数倍增 • 关注事件！',
    'howto.progression': '进度',
    'howto.progressionText': '赚取经验 → 升级 → 机库升级\n游戏后升级大厅以获得永久加成！',
    'howto.onlineLeaderboard': '在线排行榜',
    'howto.onlineLeaderboardText': '全球竞争荣誉殿堂！\n提交你的最高分并攀登排名！',
    'howto.proTip': '专业提示：收集 BELLE 模组并在机库升级！',
    'howto.disclaimer': 'Eagle of Fun 是一款粉丝制作的模因游戏，灵感来自 America.Fun 社区和加密文化。\n所有角色、标志和引用都是为娱乐目的而制作的恶搞。\n与任何公司、代币或项目无关。由支持者为乐趣而建 — 非营利。',
    'howto.backButton': '返回菜单',

    // Intro Scenes - Cdog
    'intro.cdog.line1': '嗨，爱国者们，',
    'intro.cdog.line2': '我是 Cdog。',
    'intro.cdog.line3': '我只是个创意人，不是程序员。',
    'intro.cdog.line4': '没有团队。没有计划。不知道在做什么。',
    'intro.cdog.line5': '但我是个小 $AOL 持有者，',
    'intro.cdog.line6': '我想为文化建造点什么。',
    'intro.cdog.line7': '连接 America.Fun 社区并保持氛围。',
    'intro.cdog.line8': '马斯克封了我的 X 账号，',
    'intro.cdog.line9': '所以我不能再帮助突袭了。',
    'intro.cdog.line10': '所以我做了个游戏。',
    'intro.cdog.line11': '是的，它有bug。它很乱。',
    'intro.cdog.line12': '但它是真实的，为这个社区用心制作。',
    'intro.cdog.line13': '让我们做模因，不找借口。🦅',
    'intro.skip': '点击任意位置跳过',
    'intro.continue': '点击任意位置继续',

    // Intro Scenes - Ogle
    'intro.ogle.line1': 'Ogle：嗨，Degen。',
    'intro.ogle.line2': '很高兴你来了。',
    'intro.ogle.line3': '市场一团糟...',
    'intro.ogle.line4': 'Jeeters 在砸盘，纸手在哭泣，',
    'intro.ogle.line5': '熊又醒了。',
    'intro.ogle.line6': '我们需要一个勇敢的人。',
    'intro.ogle.line7': '一个快速的人。',
    'intro.ogle.line8': '一个能飞过 FUD 并回购 Fun 的人。',
    'intro.ogle.line9': '那就是你，Eagle。',
    'intro.ogle.line10': '收集代币。',
    'intro.ogle.line11': '避开纸手。',
    'intro.ogle.line12': '拯救市场。',
    'intro.ogle.line13': '让我们一起重建 America.Fun。',
    'intro.ogle.line14': '准备飞了吗？',
    'intro.launch': '[点击启动 🚀]',
    'intro.connecting': '连接到 America.fun RPC...',
    'intro.error': '错误 404 – 检测到 FUD。',
    'intro.startFlight': '开始飞行',

    // Donation Scene
    'donation.message1': '感谢游玩，爱国者们。🦅',
    'donation.message2': '如果你玩得开心，笑了一会儿，或者只是享受了混乱，你可以帮助保持 Eagle of Fun 的活力。',
    'donation.message3': '每一点支持都用于服务器成本、AI 时间和我们作为社区共同建设的新功能。',
    'donation.solLabel': 'SOL',
    'donation.tapToCopy': '(点击复制)',
    'donation.message4': '没有压力，这是为了文化，不是为了利润。',
    'donation.thanks': '谢谢你和我一起飞。❤️',
    'donation.copyButton': '复制地址',
    'donation.copied': '地址已复制 ✅',
    'donation.copyFailed': '复制失败 ❌',
    'donation.mainMenu': '主菜单',
    'donation.hallOfDegens': '荣誉殿堂',
    'donation.spaceHint': '按空格查看荣誉殿堂',
    'donation.footer': '私人捐赠 — 自愿支持开发（非商业购买）。\n根据德国税法（EStG §22, Nr. 3），捐赠被视为私人赠与。',

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
    'notification.buybackActive': '回购激活',
    'notification.americaHatActive': '美国帽子激活',
    'notification.belleModActive': 'BELLE 模组激活',
    'notification.burgerActive': '汉堡倍增激活',
    'notification.eatTheDip': '抄底时机',
    'notification.bullMarket': '牛市',
    'notification.blasterUnlocked': '新武器已解锁 - 射击器',
    'notification.valorStage1': '勇气模式 - 阶段 1',
    'notification.valorStage2': '勇气飞升 - 阶段 2',
    'notification.extraLife': '+1 生命',
    'notification.cryptoActingActive': '加密行动激活',
    'notification.perfectEntry': '完美入场',
    'notification.danxxActive': 'DANXX 协议激活',
    'notification.roseModActive': 'ROSE 模组激活',
    'notification.modEnded': '模组模式结束',
    'notification.vibesKept': '氛围保持良好',
    'notification.pointsDestroyed': '分数 - {{count}} 已摧毁',
    'notification.combo': '连击',

    // Floating Text
    'floating.banned': '🚫 封禁',
    'floating.protected': '🛡️ 受保护',
    'floating.fake': '⚠️ 假的！',
    'floating.hodl': '💎 持有',
    'floating.gm': '☀️ 早上好',
    'floating.wagmi': '🚀 我们都会成功',
    'floating.ngmi': '📉 不会成功',

    // Market Phases
    'marketPhase.bullRun': '🐂 牛市活跃中 – 交易者陷入狂欢！',
    'marketPhase.correction': '📉 调整阶段 – 市场降温中。',
    'marketPhase.bearTrap': '🐻 熊市陷阱 – Jeeters 无处不在！',
    'marketPhase.sideways': '↔️ 横盘阶段 – 市场整固中。',
    'marketPhase.valorComeback': '🦅 勇气反击 – 美国再次崛起！',
    'marketPhase.endlessWagmi': '🌟 无尽WAGMI模式 – 纯粹混沌！',

    // Micro Events
    'microEvent.elonTweet': '🚀 马斯克发推了！代币涌入！',
    'microEvent.secDown': '😴 SEC 服务器宕机！敌人暂停！',
    'microEvent.marketPump': '💰 市场拉升！代币雨！',
    'microEvent.burgerFriday': '🍔 汉堡星期五！经验 ×2！',
    'microEvent.valorDrop': '🦅 勇气空投来袭！准备好！',

    // Mission Tiers
    'mission.tier1.name': '新手之鹰 🦅',
    'mission.tier1.desc': '学习飞行、收集和生存',
    'mission.tier1.reward': '第一层完成：准备翱翔！',

    'mission.tier2.name': '狂热飞行员 🚀',
    'mission.tier2.desc': '掌握基础并面对更艰难的挑战',
    'mission.tier2.reward': '第二层完成：真正的玩家已解锁！',

    'mission.tier3.name': '市场守护者 💎',
    'mission.tier3.desc': '为有经验玩家准备的高级挑战',
    'mission.tier3.reward': '第三层完成：守护者地位已达成！',

    // Mission Titles & Descriptions (Tier 1)
    'mission.rookieCollect.title': '首次收获',
    'mission.rookieCollect.desc': '💰 收集 50 代币',

    'mission.rookieTime.title': '生存基础',
    'mission.rookieTime.desc': '⏱️ 生存 2 分钟',

    'mission.rookieShield.title': '护盾大师',
    'mission.rookieShield.desc': '🛡️ 用 Belle/护盾摧毁 10 个敌人',

    // Mission Titles & Descriptions (Tier 2)
    'mission.degenCollect.title': '代币囤积者',
    'mission.degenCollect.desc': '💎 收集 100 代币',

    'mission.degenBelleKills.title': 'Belle 模组猎手',
    'mission.degenBelleKills.desc': '⚔️ 用 Belle 模组击杀 25 个敌人',

    'mission.degenCombo.title': '连击大师',
    'mission.degenCombo.desc': '🔥 达成 5 连击',

    'mission.degenScore.title': '得分猎手',
    'mission.degenScore.desc': '⭐ 达到 15,000 分',

    // Mission Titles & Descriptions (Tier 3)
    'mission.commanderScore.title': '高空飞行',
    'mission.commanderScore.desc': '🎯 达到 50,000 分',

    'mission.commanderBear.title': '熊杀手',
    'mission.commanderBear.desc': '🐻 在熊市陷阱阶段生存',

    'mission.commanderPerfect.title': '完美运行',
    'mission.commanderPerfect.desc': '💯 生存 3 分钟不受伤',

    'mission.commanderEnemies.title': '敌人粉碎者',
    'mission.commanderEnemies.desc': '💥 击杀 50 个敌人',

    // Mission Titles & Descriptions (Tier 4)
    'mission.tier4.name': '发射爱国者 🚀',
    'mission.tier4.desc': '熟练飞行员的精英挑战',
    'mission.tier4.reward': '第四层完成：爱国者地位！',

    'mission.patriotPerfectKills.title': '完美战士',
    'mission.patriotPerfectKills.desc': '🎖️ 击杀 10 个敌人不受伤',

    'mission.patriotScore.title': '得分传奇',
    'mission.patriotScore.desc': '💫 达到 100,000 分',

    'mission.patriotPhases.title': '阶段大师',
    'mission.patriotPhases.desc': '🔄 完成所有阶段',

    'mission.patriotCombo.title': '连击之王',
    'mission.patriotCombo.desc': '⚡ 达成 30 连击',

    // Mission Titles & Descriptions (Tier 5)
    'mission.tier5.name': '美国传奇 🦅',
    'mission.tier5.desc': '传奇的终极挑战',
    'mission.tier5.reward': '第五层完成：传奇成就！',

    'mission.legendMillion.title': '百万分俱乐部',
    'mission.legendMillion.desc': '🌟 达到 1,000,000 分',

    'mission.legendFlawless.title': '完美传奇',
    'mission.legendFlawless.desc': '👑 生存 5 分钟不受伤',

    'mission.legendEnemies.title': '大规模破坏者',
    'mission.legendEnemies.desc': '💣 击杀 200 个敌人',

    // Daily Mission Titles & Descriptions
    'mission.dailyBonk.title': 'Bonk 收集者',
    'mission.dailyBonk.desc': '🟠 收集 30 个 BONK 币',

    'mission.dailyBurger.title': '汉堡奔跑',
    'mission.dailyBurger.desc': '🍔 收集 5 个汉堡',

    'mission.dailyPumpfun.title': 'Pump 猎手',
    'mission.dailyPumpfun.desc': '💊 击杀 5 个 Pump.fun 敌人',

    'mission.dailyFourmeme.title': '迷因杀手',
    'mission.dailyFourmeme.desc': '🤡 击杀 5 个 4Chan 迷因敌人',

    'mission.dailyQuick.title': '快速得分',
    'mission.dailyQuick.desc': '⚡ 达到 10,000 分',

    'mission.dailyBear.title': '熊猎人',
    'mission.dailyBear.desc': '🐻 击杀 3 只熊',

    // Phase Names
    'phase.softLaunch': '软启动 🚀',
    'phase.paperPanic': '纸手恐慌 👋',
    'phase.candleCrash': '红烛崩盘 📉',
    'phase.regulationRun': '监管风暴 🧑‍💼',
    'phase.bearMarket': '熊市终局 🐻',

    // Phase Descriptions
    'phase.softLaunch.desc': '开始游戏，收集汉堡！只有简单的敌人。',
    'phase.paperPanic.desc': '小心假币！',
    'phase.candleCrash.desc': '到处都是红蜡烛！',
    'phase.regulationRun.desc': '政府打击！',
    'phase.bearMarket.desc': '活下来！',
    'phase.wagmi': 'WAGMI 模式 🦅',

    // Market Phase Names
    'marketPhaseName.bullRun': '牛市',
    'marketPhaseName.correction': '调整',
    'marketPhaseName.bearTrap': '熊市陷阱',
    'marketPhaseName.sideways': '横盘阶段',
    'marketPhaseName.valorComeback': '勇气反击',
    'marketPhaseName.endlessWagmi': '无尽WAGMI',

    // Market Phase Themes
    'marketPhaseTheme.euphoria': '狂喜',
    'marketPhaseTheme.realitySetsIn': '现实降临',
    'marketPhaseTheme.panic': '恐慌',
    'marketPhaseTheme.marketBreathes': '市场喘息',
    'marketPhaseTheme.heroic': '英雄归来',
    'marketPhaseTheme.chaos': '混乱',

    // Power-up Names
    'powerup.bandana': '头巾模式激活',
    'powerup.bandanaTimer': '头巾',
    'powerup.shield': '护盾',
    'powerup.belle': 'BELLE',
    'powerup.magnet': '磁铁',
    'powerup.valor': 'VALOR',
    'powerup.weapon': '武器',
    'powerup.vesper0x': '额外生命',

    // Weapons
    'weapon.basicBlaster': '基础冲击波',
    'weapon.rapidCannon': '快速加农炮',
    'weapon.powerLaser': '能量激光',
    'weapon.eagleSpread': '鹰式散射',
    'weapon.railAol': 'AOL 穿透炮',
    'weapon.burgerMortar': '汉堡迫击炮',
    'weapon.laserEyes': '激光眼 👀⚡',

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
