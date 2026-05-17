
import { Language, TranslationRecord } from '../types';

export interface NavigationTranslation {
  home: string;
  characters: string;
  database: string;
  reader: string;
  sidestories: string;
  archives: string; // New
  config: string;
  mobileHome: string;
  mobileChars: string;
  mobileData: string;
  mobileRead: string;
  mobileSide: string;
  mobileArchives: string; // New
  settingsTitle: string;
  ost: string;
  gallery: string;
  credits: string; 
  terminal: string;
  archivesLabel: string; // "ARCHIVES"
  cfg: string;
  t04Active: string;
  system: string;
  uiLanguage: string;
  renderFonts: string;
  displayFx: string;
  apply: string;
  readingMode: string;
  modeStd: string;
  modeVN: string;
}

export interface ModalTranslation {
  speaker: string;
  message: string;
  opt1: string;
  opt2: string;
  msg2: string;
  opt3: string;
}

export const navigationData: TranslationRecord<NavigationTranslation> = {
  'zh-CN': {
    home: '根控制台',
    characters: '人员档案',
    database: '数据资料',
    reader: '主要终端档案',
    sidestories: '支线档案',
    archives: '前传档案',
    config: '系统设置',
    mobileHome: '主页',
    mobileChars: '人员',
    mobileData: '数据',
    mobileRead: '主线',
    mobileSide: '支线',
    mobileArchives: '前传',
    settingsTitle: '系统配置面板',
    ost: 'OST 鉴赏室',
    gallery: '图片鉴赏室（含社区）',
    credits: '特别鸣谢', 
    terminal: '临时终端',
    archivesLabel: 'ARCHIVES',
    cfg: 'CFG',
    t04Active: 'T-04 // ACTIVE',
    system: '[SYSTEM]',
    uiLanguage: '[UI_LANGUAGE]',
    renderFonts: '[RENDER_FONTS]',
    displayFx: '[DISPLAY_FX]',
    apply: '应用',
    readingMode: '阅读模式',
    modeStd: '文档模式',
    modeVN: 'AVG模式（技术测试中）'
  },
  'zh-TW': {
    home: '根控制台',
    characters: '人員檔案',
    database: '數據資料',
    reader: '主要終端檔案',
    sidestories: '支線檔案',
    archives: '前傳檔案',
    config: '系統設置',
    mobileHome: '主頁',
    mobileChars: '人員',
    mobileData: '數據',
    mobileRead: '主線',
    mobileSide: '支線',
    mobileArchives: '前傳',
    settingsTitle: '系統配置面板',
    ost: 'OST 鑒賞室',
    gallery: '圖片鑑賞室（含社區）',
    credits: '特別鳴謝', 
    terminal: '臨時終端',
    archivesLabel: 'ARCHIVES',
    cfg: 'CFG',
    t04Active: 'T-04 // ACTIVE',
    system: '[SYSTEM]',
    uiLanguage: '[UI_LANGUAGE]',
    renderFonts: '[RENDER_FONTS]',
    displayFx: '[DISPLAY_FX]',
    apply: '應用',
    readingMode: '閱讀模式',
    modeStd: '文檔模式',
    modeVN: 'AVG模式（技術測試中）'
  },
  'en': {
    home: 'ROOT_MENU',
    characters: 'PERSONNEL',
    database: 'DATA_BANK',
    reader: 'MAIN ARCHIVE',
    sidestories: 'FRAGMENTS',
    archives: 'PREQUEL_ARCHIVES',
    config: 'SYS_CONFIG',
    mobileHome: 'ROOT',
    mobileChars: 'TEAM',
    mobileData: 'DATA',
    mobileRead: 'MAIN',
    mobileSide: 'SIDE',
    mobileArchives: 'PREQ',
    settingsTitle: 'SYSTEM CONFIGURATION',
    ost: 'MUSIC ROOM',
    gallery: 'IMAGE GALLERY',
    credits: 'CREDITS', 
    terminal: 'TEMP_TERMINAL',
    archivesLabel: 'ARCHIVES',
    cfg: 'CFG',
    t04Active: 'T-04 // ACTIVE',
    system: '[SYSTEM]',
    uiLanguage: '[UI_LANGUAGE]',
    renderFonts: '[RENDER_FONTS]',
    displayFx: '[DISPLAY_FX]',
    apply: 'APPLY',
    readingMode: 'READING MODE',
    modeStd: 'STANDARD',
    modeVN: 'VISUAL NOVEL (BETA)'
  }
};

export const exitModalData: TranslationRecord<ModalTranslation> = {
    'zh-CN': {
        speaker: '白栖',
        message: "此操作会离开本终端系统，进入您所在世界的另一个‘网站’，确定操作吗？",
        opt1: "1. 我确认。",
        opt2: "2. 我点错了，谢谢提醒。",
        msg2: "下次注意，我不会责怪您的，感谢您能来看我们的故事。",
        opt3: "(她知道我在这？她不是已经...)"
    },
    'zh-TW': {
        speaker: '白栖',
        message: "此操作會離開本終端系統，進入您所在世界的另一個『網站』，確定操作嗎？",
        opt1: "1. 我確認。",
        opt2: "2. 我點錯了，謝謝提醒。",
        msg2: "下次注意，我不會責怪您的，感謝您能來看我們的故事。",
        opt3: "(她知道我在這？她不是已經...)"
    },
    'en': {
        speaker: 'Byaki',
        message: "This action will disconnect from the terminal system and access an external 'website' in your reality. Confirm?",
        opt1: "1. I confirm.",
        opt2: "2. Mistake, thanks for the reminder.",
        msg2: "Be careful next time. I won't blame you. Thank you for coming to see our story.",
        opt3: "(She knows I'm here? Isn't she already...)"
    }
};
