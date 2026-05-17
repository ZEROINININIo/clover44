
import { Language, TranslationRecord } from '../types';

export const initialSetupTranslations = {
    'zh-CN': {
        title: '系统恢复控制台',
        subtitle: '检测到非核心设置丢失。请重新配置用户偏好。',
        langSelect: '选择界面语言 // SELECT_LANGUAGE',
        visuals: '视觉子系统',
        audio: '音频子系统',
        theme: '主题模式',
        continue: '应用设置',
        reboot: '重新启动系统',
        safeMode: '安全模式已激活',
        back: '返回',
        rebooting: '正在重启系统...',
        applying: '应用配置...',
        identity: '身份验证',
        nickPlaceholder: '输入操作员代号...',
        nickDesc: '该代号将作为您的访问凭证显示在世界数据库中。',
        nickRequired: '必须设置代号才能继续',
        nickPrivacy: '隐私提示：此设置仅用于本地显示及留言板署名（设置昵称），并非注册账号。本站纯静态运行，绝不收集您的手机号、邮箱或任何个人隐私信息。'
    },
    'zh-TW': {
        title: '系統恢復控制台',
        subtitle: '檢測到非核心設置丟失。請重新配置用戶偏好。',
        langSelect: '選擇界面語言 // SELECT_LANGUAGE',
        visuals: '視覺子系統',
        audio: '音頻子系統',
        theme: '主題模式',
        continue: '應用設置',
        reboot: '重新啟動系統',
        safeMode: '安全模式已激活',
        back: '返回',
        rebooting: '正在重啟系統...',
        applying: '應用配置...',
        identity: '身分驗證',
        nickPlaceholder: '輸入操作員代號...',
        nickDesc: '該代號將作為您的訪問憑證顯示在世界數據庫中。',
        nickRequired: '必須設置代號才能繼續',
        nickPrivacy: '隱私提示：此設置僅用於本地顯示及留言板署名，並非註冊賬號。本站純靜態運行，絕不收集您的手機號、郵箱或任何個人隱私信息。'
    }
};

export const homePageTranslations = (language: Language) => {
    return {
        start: '接入终端',
        database: '数据资料',
        sidestory: '支线档案',
        subtitle: "TIME OBJ. -BEFORE",
        system: "SYSTEM_READY",
        online: "ONLINE"
    };
};

export const databasePageTranslations = {
    'zh-CN': {
      access: "访问档案",
      inspect: "检查源数据",
      close: "关闭连接",
      guide: "使用 WASD 或 触摸屏幕左侧 移动",
      near: "检测到信号源",
      locked: "加密区域",
      dbTitle: "世界数据库",
      crashTitle: "严重系统错误",
      crashWarn: "警告：检测到该数据节点存在不可逆的逻辑崩坏。",
      crashWarn2: "强制交互可能导致系统核心转储甚至宕机。是否继续？",
      crashProceed: "我不在乎 (强制交互)",
      crashCancel: "断开连接 (安全)",
      crashHeader: "SYSTEM_FAILURE // FATAL_EXCEPTION",
      crashReboot: "尝试强制重启"
    },
    'zh-TW': {
      access: "訪問檔案",
      inspect: "檢查源數據",
      close: "關閉連接",
      guide: "使用 WASD 或 觸摸屏幕左側 移動",
      near: "檢測到信號源",
      locked: "加密區域",
      dbTitle: "世界數據庫",
      crashTitle: "嚴重系統錯誤",
      crashWarn: "警告：檢測到該數據節點存在不可逆的邏輯崩壞。",
      crashWarn2: "強制交互可能導致系統核心轉儲甚至宕機。是否繼續？",
      crashProceed: "我不在乎 (強制交互)",
      crashCancel: "斷開連接 (安全)",
      crashHeader: "SYSTEM_FAILURE // FATAL_EXCEPTION",
      crashReboot: "嘗試強制重啟"
    }
};

export const nodeLabels: Record<string, TranslationRecord<string>> = {
    'All': { 'zh-CN': '综合枢纽', 'zh-TW': '綜合樞紐' },
    'World': { 'zh-CN': '世界构造', 'zh-TW': '世界構造' },
    'Organization': { 'zh-CN': '组织档案', 'zh-TW': '組織檔案' },
    'Technology': { 'zh-CN': '技术图谱', 'zh-TW': '技術圖譜' },
    'Society': { 'zh-CN': '社会网络', 'zh-TW': '社會網絡' },
    'Setting': { 'zh-CN': '深度设定', 'zh-TW': '深度設定' },
};
