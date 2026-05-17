
import React from 'react';
import { Language, TranslationRecord } from '../types';
import { Calendar, CheckCircle, Circle, Clock, ArrowRight, GitCommit, AlertCircle } from 'lucide-react';
import Reveal from '../components/Reveal';

interface RoadmapPageProps {
  language: Language;
  onBack: () => void;
}

interface RoadmapItem {
  version: string;
  date: string;
  title: TranslationRecord<string>;
  description: TranslationRecord<string>;
  status: 'completed' | 'in-progress' | 'planned' | 'delayed';
  tags?: string[];
}

const roadmapData: RoadmapItem[] = [
  {
    version: "TL.1.15",
    date: "2025-DEC",
    title: { 'zh-CN': '系统初始化', 'zh-TW': '系統初始化', 'en': 'System Initialization' },
    description: { 'zh-CN': '建立基础档案架构，实装核心人员数据。', 'zh-TW': '建立基礎檔案架構，實裝核心人員數據。', 'en': 'Established base archive architecture. Core personnel data implemented.' },
    status: 'completed',
    tags: ['CORE', 'UI']
  },
  {
    version: "TL.1.15",
    date: "2025-DEC",
    title: { 'zh-CN': '主线：序章 & 支线扩展', 'zh-TW': '主線：序章 & 支線擴展', 'en': 'Main: Prologue & Side Expansion' },
    description: { 'zh-CN': '发布主线A001-A002，解锁“零碎之雨”支线。', 'zh-TW': '發布主線A001-A002，解鎖「零碎之雨」支線。', 'en': 'Released Main A001-A002. Unlocked "Fragmented Rain" side story.' },
    status: 'completed',
    tags: ['STORY', 'CONTENT']
  },
  {
    version: "TL.1.15", 
    date: "2025-DEC",
    title: { 'zh-CN': '阅读体验优化', 'zh-TW': '閱讀體驗優化', 'en': 'Reader UX Optimization' },
    description: { 'zh-CN': '实装自动阅读、背景音乐系统、更多视觉特效。', 'zh-TW': '實裝自動閱讀、背景音樂系統、更多視覺特效。', 'en': 'Implemented auto-read, BGM system, and more visual effects.' },
    status: 'completed',
    tags: ['SYSTEM', 'UX']
  },
  {
    version: "TL.1.16-G", 
    date: "2025-DEC",
    title: { 'zh-CN': '主线 A003：边境特训', 'zh-TW': '主線 A003：邊境特訓', 'en': 'Main A003: Boundary Training' },
    description: { 'zh-CN': '更新主线 A003 剧情，推进“幽灵容器”计划。', 'zh-TW': '更新主線 A003 劇情，推進「幽靈容器」計畫。', 'en': 'Updated A003 storyline. Advancing "Ghost Vessel" project.' },
    status: 'completed',
    tags: ['STORY', 'MAIN']
  },
  {
    version: "TL.2.0.10-I", 
    date: "CURRENT", 
    title: { 'zh-CN': '系统信息更新', 'zh-TW': '系統信息更新', 'en': 'System Info Update' },
    description: { 'zh-CN': '更新了最近更新卡片信息至 G007。', 'zh-TW': '更新了最近更新卡片信息至 G007。', 'en': 'Updated latest update card info to G007.' },
    status: 'completed',
    tags: ['SYSTEM']
  },
  {
    version: "TL.2.0.10-H", 
    date: "2026-05-11", 
    title: { 'zh-CN': '系统版本更新', 'zh-TW': '系統版本更新', 'en': 'System Version Update' },
    description: { 'zh-CN': '同步系统版本号至 TL.2.0.10-H。', 'zh-TW': '同步系統版本號至 TL.2.0.10-H。', 'en': 'Synchronized system version to TL.2.0.10-H.' },
    status: 'completed',
    tags: ['SYSTEM']
  },
  {
    version: "TL.1.22.1-V", 
    date: "2026-05-11", 
    title: { 'zh-CN': '联动界面体验优化', 'zh-TW': '聯動界面體驗優化', 'en': 'Collab UI Experience Opt' },
    description: { 'zh-CN': '修复了“四十四的一半！”卡片尺寸过大的问题，使其与其他联动章节界面保持一致。更新了卡片的展示文案为“正在获取信息（待更新）”。', 'zh-TW': '修復了「四十四的一半！」卡片尺寸過大的問題，使其與其他聯動章節界面保持一致。更新了卡片的展示文案為「正在獲取信息（待更新）」。', 'en': 'Fixed the oversized card for "Half of 44!" to match other collab chapters. Updated display text to "Fetching info (to be updated)".' },
    status: 'completed',
    tags: ['UI', 'SYSTEM']
  },
  {
    version: "TL.1.22.1-U",
    date: "2026-05-11", 
    title: { 'zh-CN': '新角色档案：441/2 & 联动视觉更新', 'zh-TW': '新角色檔案：441/2 & 聯動視覺更新', 'en': 'New Character: 441/2 & Collab Visuals' },
    description: { 'zh-CN': '新增联动剧情视觉卡片“四十四的一半！”，为“被忽略的第一步”增设了明确的视觉解锁状态提示。', 'zh-TW': '新增聯動劇情視覺卡片「四十四的一半！」，為「被忽略的第一步」增設了明確的視覺解鎖狀態提示。', 'en': 'Added Collab visual card "Half of 44!" and updated visual lock state indicator for "The Ignored First Step".' },
    status: 'completed',
    tags: ['CHARACTER', 'SIDE', 'UI']
  },
  {
    version: "TL.1.22.1-T", 
    date: "2026-05-11", 
    title: { 'zh-CN': '新角色档案：441/2', 'zh-TW': '新角色檔案：441/2', 'en': 'New Character: 441/2' },
    description: { 'zh-CN': '更新支线章节G007，芷漓发现了白栖留下的U盘，成功激活了旧时代的普忧，并将其接入星研网络。', 'zh-TW': '更新支線章節G007，芷漓發現了白棲留下的U盤，成功激活了舊時代的普憂，並將其接入星研網絡。' },
    status: 'completed',
    tags: ['STORY', 'SIDE']
  },
  {
    version: "TL.1.22.1-R", 
    date: "2026-04-30", 
    title: { 'zh-CN': '时域初现 - B004', 'zh-TW': '時域初現 - B004', 'en': 'Time Origin - B004' },
    description: { 'zh-CN': '更新时域初现支线章节B004，讲述星研高级技术员白栖在析界节区边境探查时，通过量子眼与紫发少女芷漓产生同类共鸣，并将其接引至总部的故事。', 'zh-TW': '更新時域初現支線章節B004，講述星研高級技術員白棲在析界節區邊境探查時，透過量子眼與紫髮少女芷漓產生同類共鳴，並將其接引至總部的故事。', 'en': 'Updated Time Origin side story B004, detailing Senior Technician Baiqi\'s encounter with the purple-haired girl Zeri at the Analysis Sector border, their quantum resonance, and bringing her to headquarters.' },
    status: 'completed',
    tags: ['STORY', 'SIDE']
  },
  {
    version: "TL.1.22.1-P", 
    date: "2026-04-11", 
    title: { 'zh-CN': '时域日常 - 析界余痕', 'zh-TW': '時域日常 - 析界餘痕', 'en': 'Timeline Daily - Analysis Vestiges' },
    description: { 'zh-CN': '更新X-G07至X-G09，以芷漓的第三人称叙事视角，详细展开G004和G005中在星图馆内的剧情事件，主要写芷漓对普忧的好奇，触摸和对普忧本体探索。', 'zh-TW': '更新X-G07至X-G09，以芷漓的第三人稱敘事視角，詳細展開G004和G005中在星圖館內的劇情事件，主要寫芷漓對普憂的好奇，觸摸和對普憂本體探索。', 'en': 'Updated X-G07 to X-G09 with a third-person narrative perspective, detailing the events in the Astrolabe Library from G004 and G005, focusing on Zeri\'s curiosity, touching, and exploration of Puyo\'s true form.' },
    status: 'completed',
    tags: ['STORY', 'SIDE']
  },
  {
    version: "TL.1.17.65-T", 
    date: "2026-MAR", 
    title: { 'zh-CN': '阅读器组件升级', 'zh-TW': '閱讀器組件升級', 'en': 'Reader Component Upgrade' },
    description: { 'zh-CN': '实装防剧透折叠卡片与动态警告系统。预载时域初现后续内容。', 'zh-TW': '實裝防劇透折疊卡片與動態警告系統。預載時域初現後續內容。', 'en': 'Implemented spoiler-protection cards and dynamic warnings. Preloaded Time Origin content.' },
    status: 'completed',
    tags: ['UI', 'SYSTEM']
  },
  {
    version: "TL.1.17.49-V", 
    date: "BETA", 
    title: { 'zh-CN': 'AVG 模式 (技术预览)', 'zh-TW': 'AVG 模式 (技術預覽)', 'en': 'AVG Mode (Tech Preview)' },
    description: { 'zh-CN': '实装视觉小说引擎、立绘演出与特殊文本解析。目前处于技术验证阶段。', 'zh-TW': '實裝視覺小說引擎、立繪演出與特殊文本解析。目前處於技術驗證階段。', 'en': 'Implemented Visual Novel engine, character sprites, and special text parsing. Currently in technical verification.' },
    status: 'in-progress',
    tags: ['SYSTEM', 'BETA']
  },
  {
    version: "TL.1.17", 
    date: "2026-Q1", 
    title: { 'zh-CN': '新角色支线：白栖篇', 'zh-TW': '新角色支線：白棲篇', 'en': 'New Character Side: Byaki Arc' },
    description: { 'zh-CN': '完善 F 系列档案，补全白栖视角的早期故事。', 'zh-TW': '完善 F 系列檔案，補全白棲視角的早期故事。', 'en': 'Completing F-series archives. Supplementing early story from Byaki\'s perspective.' },
    status: 'planned', 
    tags: ['STORY', 'SIDE']
  },
  {
    version: "TL.1.18", 
    date: "2026-JAN", 
    title: { 'zh-CN': '主线 A004', 'zh-TW': '主線 A004', 'en': 'Main Line A004' },
    description: { 'zh-CN': '[数据删除]', 'zh-TW': '[數據刪除]', 'en': '[DATA_EXPUNGED]' }, 
    status: 'planned', 
    tags: ['MAJOR', 'MAIN']
  }
];

const RoadmapPage: React.FC<RoadmapPageProps> = ({ language, onBack }) => {
  const t = {
    title: language === 'zh-CN' ? '更新展望 // 时间线' : language === 'zh-TW' ? '更新展望 // 時間線' : 'DEV_ROADMAP // TIMELINE',
    subtitle: language === 'zh-CN' ? '查看档案库的构建进度与未来计划' : language === 'zh-TW' ? '查看檔案庫的構建進度與未來計畫' : 'View archive construction progress and future plans',
    back: language === 'en' ? 'RETURN' : '返回'
  };

  return (
    <div className="fixed inset-0 z-[200] bg-ash-black flex flex-col animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b-2 border-ash-gray/30 bg-ash-dark/50 backdrop-blur-md flex justify-between items-center shrink-0">
            <div>
                <h2 className="text-2xl font-black text-ash-light uppercase tracking-tight flex items-center gap-3">
                    <GitCommit className="text-amber-500" />
                    {t.title}
                </h2>
                <p className="text-xs font-mono text-ash-gray mt-1">{t.subtitle}</p>
            </div>
            <button 
                onClick={onBack}
                className="px-4 py-2 border border-ash-gray text-ash-gray hover:text-ash-light hover:border-ash-light hover:bg-ash-dark transition-all font-mono text-xs font-bold uppercase flex items-center gap-2"
            >
                {t.back} <ArrowRight size={14} />
            </button>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 relative custom-scrollbar bg-halftone">
            <div className="max-w-4xl mx-auto relative">
                {/* Central Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-ash-gray/30 -translate-x-1/2 md:translate-x-0"></div>

                <div className="space-y-12 pb-20">
                    {roadmapData.map((item, index) => {
                        const isLeft = index % 2 === 0;
                        const statusColor = item.status === 'completed' ? 'text-green-500 border-green-500/50 bg-green-950/10' 
                                          : item.status === 'in-progress' ? 'text-amber-500 border-amber-500/50 bg-amber-950/10'
                                          : item.status === 'delayed' ? 'text-red-500 border-red-500/50 bg-red-950/10'
                                          : 'text-ash-gray border-ash-gray/30 bg-ash-black';
                        
                        const icon = item.status === 'completed' ? <CheckCircle size={16} />
                                   : item.status === 'in-progress' ? <Clock size={16} className="animate-spin-slow" />
                                   : item.status === 'delayed' ? <AlertCircle size={16} />
                                   : <Circle size={16} />;

                        return (
                            <Reveal key={index} delay={index * 100} className={`relative flex items-center ${isLeft ? 'md:justify-end' : 'md:justify-start'} pl-16 md:pl-0`}>
                                {/* Timeline Dot */}
                                <div className={`absolute left-8 md:left-1/2 w-4 h-4 rounded-full border-2 -translate-x-1/2 z-10 bg-ash-black ${statusColor.split(' ')[0].replace('text-', 'border-')}`}>
                                    {item.status === 'in-progress' && <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-20"></div>}
                                </div>

                                {/* Content Card */}
                                <div className={`w-full md:w-[45%] relative border-l-2 md:border-l-0 ${isLeft ? 'md:border-r-2 md:text-right md:pr-8' : 'md:border-l-2 md:pl-8'} border-ash-gray/30 pl-6 md:pl-0 py-2`}>
                                    <div className={`p-4 border ${statusColor} relative group transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]`}>
                                        {/* Status Badge */}
                                        <div className={`absolute -top-3 ${isLeft ? 'md:right-4 left-4' : 'left-4'} px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-ash-black border ${statusColor.split(' ')[1]}`}>
                                            <span className="flex items-center gap-1">
                                                {icon} {item.status}
                                            </span>
                                        </div>

                                        <div className="mb-2 font-mono text-[10px] opacity-70 flex flex-col md:flex-row gap-1 md:gap-4 md:items-center justify-between">
                                            <span>VER: {item.version}</span>
                                            <span><Calendar size={10} className="inline mr-1" />{item.date}</span>
                                        </div>
                                        
                                        <h3 className={`text-lg font-black uppercase mb-2 ${statusColor.split(' ')[0]}`}>
                                            {item.title[language] || item.title['en']}
                                        </h3>
                                        
                                        <p className="text-xs font-mono text-ash-light/80 leading-relaxed mb-3">
                                            {item.description[language] || item.description['en']}
                                        </p>

                                        <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                                            {item.tags?.map(tag => (
                                                <span key={tag} className="text-[8px] border border-current px-1 py-0.5 opacity-50 uppercase">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
                
                {/* Bottom Anchor */}
                <div className="absolute bottom-0 left-8 md:left-1/2 -translate-x-1/2 text-ash-gray opacity-20 pb-8">
                    <Circle size={8} fill="currentColor" />
                </div>
            </div>
        </div>
    </div>
  );
};

export default RoadmapPage;
