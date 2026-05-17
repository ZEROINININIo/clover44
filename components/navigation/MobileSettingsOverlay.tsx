
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User, Share2, FileText, ArrowRight, ImageIcon, ExternalLink, Headphones, Globe, AlertTriangle, Heart, AlertCircle, Trash2, Database, Terminal, X, Cpu, HardDrive, ShieldAlert } from 'lucide-react';
import { Language, ReadingMode, GraphicsQuality } from '../../types';
import { ReaderFont } from '../fonts/fontConfig';
import { NavigationTranslation } from '../../data/navigationData';
import ReadingModeToggle from '../ReadingModeToggle';
import FontSelector from '../fonts/FontSelector';
import CRTToggle from '../CRTToggle';
import FullscreenToggle from '../FullscreenToggle';
import GraphicsQualitySelector from '../GraphicsQualitySelector';
import GuestbookPage from '../GuestbookPage';
import { APP_VERSION } from '../../data/version';
import { getAllReadStatus } from '../../utils/readStatus';
import { sideStoryVolumes } from '../../data/sideStories';

interface MobileSettingsOverlayProps {
  show: boolean;
  onClose: () => void;
  language: Language;
  t: NavigationTranslation;
  nickname?: string;
  setNickname?: (name: string) => void;
  onCopySyncLink: () => void;
  copySuccess: boolean;
  onOpenExporter: () => void;
  onOpenCredits: () => void; 
  onExternalLink: (e: React.MouseEvent, url: string) => void;
  onCycleLanguage: () => void;
  langLabel: string;
  readingMode: ReadingMode;
  setReadingMode: (mode: ReadingMode) => void;
  pureReadingMode?: boolean;
  setPureReadingMode?: (val: boolean) => void;
  readerFont: ReaderFont;
  setReaderFont: (font: ReaderFont) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  crtEnabled: boolean;
  setCrtEnabled: (val: boolean) => void;
  onFactoryReset: () => void;
  graphicsQuality: GraphicsQuality;
  setGraphicsQuality: (q: GraphicsQuality) => void;
  isMobileMenuVisible?: boolean;
  onOpenReadingGuide: () => void;
}

const MobileSettingsOverlay: React.FC<MobileSettingsOverlayProps> = ({
  show, onClose, language, t, nickname, setNickname, onCopySyncLink, copySuccess,
  onOpenExporter, onOpenCredits, onExternalLink, onCycleLanguage, langLabel,
  readingMode, setReadingMode, pureReadingMode, setPureReadingMode, readerFont, setReaderFont, fontSize, setFontSize, crtEnabled, setCrtEnabled,
  onFactoryReset, graphicsQuality, setGraphicsQuality, isMobileMenuVisible = true, onOpenReadingGuide
}) => {
  const [error, setError] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  // Calculate Reading Progress
  const readStats = useMemo(() => {
      const ids = new Set<string>();
      sideStoryVolumes.forEach(v => v.chapters.forEach(c => ids.add(c.id)));
      
      const readIds = getAllReadStatus();
      const validReadCount = readIds.filter(id => ids.has(id)).length;
      
      return {
          count: validReadCount,
          total: ids.size,
          percent: ids.size > 0 ? Math.round((validReadCount / ids.size) * 100) : 0
      };
  }, [show]);

  if (!show) return null;

  const currentVersion = APP_VERSION;

  const handleClose = () => {
      // Validate nickname before closing
      if (nickname !== undefined && !nickname.trim()) {
          setError(true);
          return;
      }
      setError(false);
      setResetConfirm(false);
      onClose();
  };

  const handleNicknameChange = (val: string) => {
      if (setNickname) {
          setNickname(val);
          if (val.trim()) setError(false);
      }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm font-mono" 
            onClick={handleClose}
        >
            {/* CRT Overlay Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-10"></div>

            <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`absolute left-0 right-0 top-12 bg-black border-t border-ash-gray/30 shadow-[0_-10px_40px_rgba(0,255,255,0.1)] z-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMobileMenuVisible ? 'bottom-[90px] landscape:bottom-[80px]' : 'bottom-0'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-ash-gray/30 bg-ash-dark/20 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <motion.div 
                                animate={{ opacity: [1, 0.5, 1] }} 
                                transition={{ duration: 2, repeat: Infinity }} 
                                className="w-2 h-2 bg-cyan-500 shadow-[0_0_8px_rgba(0,255,255,0.8)]"
                            ></motion.div>
                            <span className="text-xs font-bold text-ash-light font-mono uppercase tracking-wider flex items-center gap-2">
                                <Terminal size={14} className="text-cyan-400" />
                                {t.config}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                            className="relative flex items-center bg-black border border-cyan-500/40 rounded-sm overflow-hidden h-6 cursor-pointer group"
                        >
                            {/* Active background slider */}
                            <motion.div
                                className="absolute inset-y-0 w-1/2 bg-cyan-500/30 border border-cyan-400 group-hover:bg-cyan-500/40"
                                initial={false}
                                animate={{ left: isAdvancedMode ? '50%' : '0%' }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                            
                            <div className={`relative z-10 w-[70px] text-center text-[10px] font-mono font-bold tracking-wider transition-colors duration-300 ${!isAdvancedMode ? 'text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'text-ash-gray/60'}`}>
                                {language === 'en' ? 'BASIC' : '常规模式'}
                            </div>
                            <div className={`relative z-10 w-[70px] text-center text-[10px] font-mono font-bold tracking-wider transition-colors duration-300 ${isAdvancedMode ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]' : 'text-ash-gray/60'}`}>
                                {language === 'en' ? 'ADV!' : '高级控制'}
                            </div>
                        </button>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose} 
                        className="text-ash-gray hover:text-cyan-400 p-1 transition-colors"
                    >
                        <X size={18} />
                    </motion.button>
                </div>
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar relative">
                     {/* Animated Background Grid & Effects */}
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none animate-drift-diagonal h-full"
                    ></motion.div>
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.08),transparent_60%)] pointer-events-none h-full"
                    ></motion.div>
                     <div className="absolute top-0 bottom-0 w-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[10%] pointer-events-none animate-scanline-vertical"></div>

                    <AnimatePresence mode="wait">
                        {!isAdvancedMode ? (
                            <motion.div 
                                key="simple"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10 space-y-6"
                            >
                                {/* System Stats - Redesigned */}
                                <div className="relative z-10 p-4 border border-cyan-500/30 bg-black/60 backdrop-blur-xl overflow-hidden group shadow-[0_0_30px_rgba(0,255,255,0.1)]">
                                    {/* Animated background elements */}
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,255,0.05)_50%,transparent_75%)] bg-[length:200%_200%] animate-gradient-xy"></div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-400/20 transition-colors duration-700"></div>
                                    
                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>
                                    
                                    <div className="relative flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-cyan-950/50 border border-cyan-500/50">
                                                <Database size={12} className="text-cyan-400 animate-pulse" />
                                                <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" style={{ animationDuration: '3s' }}></div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-widest uppercase">CACHE_STATUS</span>
                                                <span className="text-[8px] text-ash-gray font-mono tracking-wider">NEURAL_SYNC_LINK</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-mono font-bold text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                                                {readStats.percent}<span className="text-xs text-cyan-500">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar Container */}
                                    <div className="relative w-full h-2 bg-ash-dark/50 rounded-full overflow-hidden mb-2 border border-ash-gray/20">
                                        {/* Animated gradient fill */}
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${readStats.percent}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-white shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                                        >
                                            {/* Inner scanning line */}
                                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] w-[200%] animate-scanline-horizontal mix-blend-overlay"></div>
                                        </motion.div>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-ash-gray font-mono uppercase">Processed Nodes</span>
                                            <span className="text-[10px] text-ash-light font-mono font-bold">{readStats.count} <span className="text-ash-gray font-normal">/ {readStats.total}</span></span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)] animate-pulse"></div>
                                            <span className="text-[8px] text-emerald-400 font-mono font-bold tracking-wider">LINK_STABLE</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Guestbook Widget */}
                                <div className="relative z-10 w-full transform -skew-x-[2deg]">
                                    <GuestbookPage 
                                        language={language} 
                                        nickname={nickname} 
                                        isLightTheme={false}
                                        isWidget={true}
                                        className="w-full text-left"
                                    />
                                </div>

                                <div className="space-y-4 bg-ash-black/80 p-4 border border-ash-gray/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] group hover:border-cyan-500/50 transition-colors duration-500">
                                    <div className="text-[10px] font-bold text-cyan-500 uppercase flex items-center gap-1 border-b border-cyan-500/30 pb-2">
                                        <Settings size={10} className="group-hover:animate-spin-slow" /> {language === 'en' ? 'BASIC_PREFS' : '基础偏好设置'}
                                    </div>

                                    <motion.button 
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => { onOpenReadingGuide(); handleClose(); }}
                                        className="relative flex items-center justify-between w-full px-3 py-2 border border-cyan-900/50 bg-cyan-950/20 text-cyan-400 active:bg-cyan-900/40 transition-all overflow-hidden group/btn"
                                    >
                                        <div className="absolute inset-0 bg-cyan-900/40 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out"></div>
                                        <div className="flex items-center gap-2 relative z-10">
                                            <FileText size={14} />
                                            <span className="text-[10px] font-mono font-bold uppercase">{language === 'en' ? 'Reading Guide' : '阅读指南'}</span>
                                        </div>
                                        <ArrowRight size={12} className="opacity-50 relative z-10" />
                                    </motion.button>

                                    <motion.button 
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onCycleLanguage}
                                        className="relative flex items-center justify-between w-full px-3 py-2 border border-ash-gray/50 bg-black text-ash-gray active:text-cyan-400 active:border-cyan-500 transition-all overflow-hidden group/btn"
                                    >
                                        <div className="absolute inset-0 bg-cyan-900/40 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out"></div>
                                        <div className="flex items-center gap-2 relative z-10">
                                            <Globe size={14} />
                                            <span className="text-[10px] font-mono font-bold uppercase">{language === 'en' ? 'System Language' : '系统界面语言'}</span>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold relative z-10">[{langLabel}]</span>
                                    </motion.button>

                            <div className="space-y-2">
                                <FontSelector value={readerFont} onChange={setReaderFont} language={language} isSetupMode />
                                <div className="space-y-2 px-1">
                                    <div className="flex justify-between text-[10px] text-ash-gray uppercase">
                                        <span>{language === 'en' ? 'Font_Size' : '阅读字号大小'}</span>
                                        <span className="text-ash-light">{fontSize}px</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="12" 
                                        max="32" 
                                        step="1" 
                                        value={fontSize}
                                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                                        className="w-full h-1 bg-ash-black border border-ash-gray/30 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-ash-light rounded-none active:[&::-webkit-slider-thumb]:bg-cyan-400 transition-colors"
                                    />
                                </div>
                            </div>

                            <ReadingModeToggle value={readingMode} onChange={setReadingMode} language={language} isSetupMode />
                            {pureReadingMode !== undefined && setPureReadingMode && (
                                <button
                                    onClick={() => setPureReadingMode(!pureReadingMode)}
                                    className={`w-full group mt-6 relative overflow-hidden p-4 flex items-center justify-between border-2 transition-all duration-300 ${pureReadingMode ? 'border-cyan-400 bg-cyan-900/30' : 'border-cyan-900/50 bg-cyan-950/10 hover:border-cyan-500/80 hover:bg-cyan-900/20'}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${pureReadingMode ? 'opacity-100' : ''}`}></div>
                                    
                                    <div className="relative z-10 flex flex-col items-start gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-base font-black tracking-widest ${pureReadingMode ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-cyan-500'}`}>
                                                纯净阅读模式
                                            </span>
                                            <span className="text-[10px] font-bold bg-cyan-500 text-black px-1.5 py-0.5 rounded-sm animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                                                NEW
                                            </span>
                                        </div>
                                        <span className="text-xs text-cyan-600 font-mono text-left">
                                            {language === 'en' ? 'Immersion Mode / Zero Distractions' : '完全沉浸 / 屏蔽系统UI'}
                                        </span>
                                    </div>

                                    <div className={`relative z-10 w-12 h-6 rounded-sm border-2 transition-colors duration-300 ${pureReadingMode ? 'border-cyan-300 bg-cyan-900/60 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'border-cyan-900 bg-black'}`}>
                                        <div className={`absolute top-0.5 bottom-0.5 w-5 rounded-sm transition-all duration-300 ${pureReadingMode ? 'right-0.5 bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'left-0.5 bg-cyan-900'}`}></div>
                                    </div>
                                </button>
                            )}
                            <GraphicsQualitySelector value={graphicsQuality} onChange={setGraphicsQuality} language={language} isSetupMode />
                            
                            <div className="grid grid-cols-1 gap-2">
                                <FullscreenToggle language={language} isSetupMode />
                            </div>
                        </div>
                        </motion.div>
                        ) : (
                        <motion.div 
                            key="advanced"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10 space-y-6"
                        >
                    <>
                {/* Identity Module */}
                {nickname !== undefined && setNickname && (
                    <div className="relative z-10 space-y-2">
                        <div className="text-[10px] font-bold text-ash-gray uppercase flex items-center gap-1 border-b border-ash-gray/20 pb-1">
                            <User size={10} /> IDENTITY_MATRIX
                        </div>
                        <div className="flex gap-0">
                            <div className="bg-ash-dark/30 border-y border-l border-ash-gray/30 px-2 flex items-center text-ash-gray font-mono text-[10px]">
                                UID:
                            </div>
                            <input 
                                type="text"
                                value={nickname}
                                onChange={(e) => handleNicknameChange(e.target.value)}
                                maxLength={10}
                                className={`flex-1 bg-black border border-ash-gray/30 px-2 py-2 text-ash-light font-mono text-xs focus:outline-none focus:border-ash-light transition-colors ${error ? 'border-red-500 text-red-500' : ''}`}
                                placeholder='必填'
                            />
                            <button 
                                onClick={onCopySyncLink}
                                className="px-3 bg-ash-dark/30 border border-ash-gray/30 text-ash-gray hover:text-ash-light"
                                title="Copy Sync Link"
                            >
                                {copySuccess ? <span className="text-green-500 font-bold text-[10px]">OK</span> : <Share2 size={12} />}
                            </button>
                        </div>
                        {error && (
                            <div className="text-[9px] text-red-500 font-bold flex items-center gap-1 animate-pulse">
                                <AlertCircle size={10} /> 必须设置代号
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Actions Grid */}
                <div className="relative z-10 grid grid-cols-2 gap-2">
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { onOpenExporter(); handleClose(); }}
                        className="flex flex-col items-center justify-center p-3 border border-blue-900/30 bg-blue-950/10 text-blue-400 hover:bg-blue-900/20 active:bg-blue-900/30 transition-all gap-2 group"
                    >
                        <FileText size={16} className="group-active:scale-110 transition-transform" />
                        <span className="text-[9px] font-mono font-bold uppercase">{language === 'en' ? 'Export Book (PDF)' : '导出全卷(PDF)'}</span>
                    </motion.button>

                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { onOpenCredits(); handleClose(); }}
                        className="flex flex-col items-center justify-center p-3 border border-rose-900/30 bg-rose-950/10 text-rose-500 hover:bg-rose-900/20 active:bg-rose-900/30 transition-all gap-2 group"
                    >
                        <Heart size={16} className="group-active:scale-110 transition-transform" />
                        <span className="text-[9px] font-mono font-bold uppercase">{t.credits}</span>
                    </motion.button>
                </div>

                {/* Settings Modules */}
                <div className="relative z-10 space-y-4 pt-4 border-t border-ash-gray/20">
                    <div className="text-[10px] font-bold text-ash-gray uppercase flex items-center gap-1">
                        <Cpu size={10} /> {language === 'en' ? 'SYSTEM_PREFS' : '系统界面环境参数'}
                    </div>

                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={onCycleLanguage}
                        className="flex items-center justify-between w-full px-3 py-2 border border-ash-gray/30 bg-ash-dark/20 text-ash-gray active:bg-ash-light active:text-black transition-all group"
                    >
                        <div className="flex items-center gap-2">
                            <Globe size={14} className="group-active:rotate-180 transition-transform duration-500" />
                            <span className="text-[10px] font-mono font-bold uppercase">{language === 'en' ? 'System Language' : '系统界面语言'}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold">[{langLabel}]</span>
                    </motion.button>

                    <GraphicsQualitySelector value={graphicsQuality} onChange={setGraphicsQuality} language={language} isSetupMode />
                    <div className="space-y-4">
                        <ReadingModeToggle value={readingMode} onChange={setReadingMode} language={language} isSetupMode />
                        {pureReadingMode !== undefined && setPureReadingMode && (
                            <button
                                onClick={() => setPureReadingMode(!pureReadingMode)}
                                className={`w-full group mt-6 relative overflow-hidden p-4 flex items-center justify-between border-2 transition-all duration-300 ${pureReadingMode ? 'border-cyan-400 bg-cyan-900/30' : 'border-cyan-900/50 bg-cyan-950/10 hover:border-cyan-500/80 hover:bg-cyan-900/20'}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${pureReadingMode ? 'opacity-100' : ''}`}></div>
                                
                                <div className="relative z-10 flex flex-col items-start gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-base font-black tracking-widest ${pureReadingMode ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-cyan-500'}`}>
                                            纯净阅读模式
                                        </span>
                                        <span className="text-[10px] font-bold bg-cyan-500 text-black px-1.5 py-0.5 rounded-sm animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                                            NEW
                                        </span>
                                    </div>
                                    <span className="text-xs text-cyan-600 font-mono text-left">
                                        {language === 'en' ? 'Immersion Mode / Zero Distractions' : '完全沉浸 / 屏蔽系统UI'}
                                    </span>
                                </div>

                                <div className={`relative z-10 w-12 h-6 rounded-sm border-2 transition-colors duration-300 ${pureReadingMode ? 'border-cyan-300 bg-cyan-900/60 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'border-cyan-900 bg-black'}`}>
                                    <div className={`absolute top-0.5 bottom-0.5 w-5 rounded-sm transition-all duration-300 ${pureReadingMode ? 'right-0.5 bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'left-0.5 bg-cyan-900'}`}></div>
                                </div>
                            </button>
                        )}
                    </div>
                    <div className="space-y-2">
                        <FontSelector value={readerFont} onChange={setReaderFont} language={language} isSetupMode />
                        <div className="space-y-2 px-1">
                            <div className="flex justify-between text-[10px] text-ash-gray uppercase">
                                <span>{language === 'en' ? 'Font_Size' : '全屏字号大小'}</span>
                                <span className="text-ash-light">{fontSize}px</span>
                            </div>
                            <input 
                                type="range" 
                                min="12" 
                                max="32" 
                                step="1" 
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full h-1 bg-ash-black border border-ash-gray/30 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-ash-light rounded-none active:[&::-webkit-slider-thumb]:bg-white"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                        <CRTToggle value={crtEnabled} onChange={setCrtEnabled} language={language} isSetupMode />
                        <FullscreenToggle language={language} isSetupMode />
                    </div>
                </div>

                {/* Reset Zone */}
                <div className="relative z-10 pt-4 border-t border-ash-gray/20 pb-4">
                    {resetConfirm ? (
                        <div className="p-3 border border-red-500/50 bg-red-950/10 animate-fade-in">
                            <div className="text-red-500 font-bold text-[10px] uppercase mb-2 flex items-center gap-2">
                                <ShieldAlert size={12} />
                                警告：此操作不可逆
                            </div>
                            <p className="text-[10px] text-red-400/70 mb-3 leading-tight font-mono">
                                确认清除系统数据？所有本地进度将丢失。
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setResetConfirm(false)}
                                    className="flex-1 py-2 border border-ash-gray/30 text-ash-gray text-[10px] active:bg-ash-gray/20 transition-colors uppercase"
                                >
                                    取消
                                </button>
                                <button 
                                    onClick={onFactoryReset}
                                    className="flex-1 py-2 bg-red-900/20 border border-red-500/50 text-red-500 font-bold text-[10px] active:bg-red-500 active:text-black transition-colors uppercase"
                                >
                                    确认清除
                                </button>
                            </div>
                        </div>
                    ) : (
                        <motion.button 
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setResetConfirm(true)}
                            className="relative flex items-center justify-center gap-2 w-full px-3 py-3 border border-red-900/30 bg-red-950/10 text-red-700/80 active:bg-red-950/30 active:text-red-500 active:border-red-500/50 transition-all font-mono font-bold text-[10px] uppercase group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(239,68,68,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:200%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] group-active:bg-[position:-200%_0,0_0] group-active:duration-[1500ms]"></div>
                            <Trash2 size={14} className="group-active:rotate-12 transition-transform relative z-10" />
                            <span className="relative z-10">重置系统依赖</span>
                        </motion.button>
                    )}
                </div>
                </>
                </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Links for Mobile (Always Visible) */}
            <div className="grid grid-cols-2 gap-2 mt-auto pt-6 relative z-10">
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { onExternalLink(e, 'https://ost.zeroxv.cn'); handleClose(); }}
                    className="flex flex-col items-center justify-center p-3 border border-purple-900/30 bg-purple-950/20 text-purple-400 hover:bg-purple-900/30 active:bg-purple-900/40 transition-all gap-2 group shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                >
                    <Headphones size={16} className="group-active:scale-110 transition-transform" />
                    <span className="text-[9px] font-mono font-bold uppercase">{t.ost}</span>
                </motion.button>

                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { onExternalLink(e, 'https://pic.zeroxv.cn'); handleClose(); }}
                    className="flex flex-col items-center justify-center p-3 border border-emerald-900/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/30 active:bg-emerald-900/40 transition-all gap-2 group shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                >
                    <ImageIcon size={16} className="group-active:scale-110 transition-transform" />
                    <span className="text-[9px] font-mono font-bold uppercase">{t.gallery}</span>
                </motion.button>
            </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-ash-gray/30 bg-ash-dark/20 p-2 shrink-0 flex justify-between items-center relative z-10">
                <div className="text-[9px] text-ash-gray/40 font-mono">
                    NOVA_OS // BUILD_{currentVersion}
                </div>
            </div>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSettingsOverlay;
