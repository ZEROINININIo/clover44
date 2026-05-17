
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, User, Share2, FileText, ArrowRight, Trash2, AlertTriangle, AlertCircle, Database, Terminal, Cpu, HardDrive, ShieldAlert } from 'lucide-react';
import { Language, ReadingMode, GraphicsQuality } from '../../types';
import { ReaderFont } from '../fonts/fontConfig';
import { NavigationTranslation } from '../../data/navigationData';
import ReadingModeToggle from '../ReadingModeToggle';
import FontSelector from '../fonts/FontSelector';
import CRTToggle from '../CRTToggle';
import FullscreenToggle from '../FullscreenToggle';
import GraphicsQualitySelector from '../GraphicsQualitySelector';
import { APP_VERSION } from '../../data/version';
import { getAllReadStatus } from '../../utils/readStatus';
import { sideStoryVolumes } from '../../data/sideStories';

interface DesktopSettingsModalProps {
  show: boolean;
  onClose: () => void;
  language: Language;
  t: NavigationTranslation;
  nickname?: string;
  setNickname?: (name: string) => void;
  onCopySyncLink: () => void;
  copySuccess: boolean;
  onCycleLanguage: () => void;
  langLabel: string;
  readerFont: ReaderFont;
  setReaderFont: (font: ReaderFont) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  readingMode: ReadingMode;
  setReadingMode: (mode: ReadingMode) => void;
  pureReadingMode?: boolean;
  setPureReadingMode?: (val: boolean) => void;
  crtEnabled: boolean;
  setCrtEnabled: (val: boolean) => void;
  onOpenExporter: () => void;
  onFactoryReset: () => void;
  graphicsQuality: GraphicsQuality;
  setGraphicsQuality: (q: GraphicsQuality) => void;
  onOpenReadingGuide: () => void;
}

const DesktopSettingsModal: React.FC<DesktopSettingsModalProps> = ({
  show, onClose, language, t, nickname, setNickname, onCopySyncLink, copySuccess,
  onCycleLanguage, langLabel, readerFont, setReaderFont, fontSize, setFontSize, readingMode, setReadingMode, pureReadingMode, setPureReadingMode,
  crtEnabled, setCrtEnabled, onOpenExporter, onFactoryReset,
  graphicsQuality, setGraphicsQuality, onOpenReadingGuide
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
  }, [show]); // Recalc when modal opens

  if (!show) return null;

  const currentVersion = APP_VERSION;

  const handleClose = () => {
      // Validate nickname before closing
      if (nickname !== undefined && !nickname.trim()) {
          setError(true);
          return;
      }
      setError(false);
      setResetConfirm(false); // Reset confirmation state on close
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
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm font-mono" 
            onClick={handleClose}
        >
            {/* CRT Overlay Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-10"></div>

            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-4xl bg-black border border-ash-gray/30 shadow-[0_0_50px_rgba(0,255,255,0.1)] relative overflow-hidden flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header Bar */}
                <div className="flex items-center justify-between p-4 border-b border-ash-gray/30 bg-ash-dark/20 relative z-10">
                    <div className="flex items-center gap-3">
                        <motion.div 
                            animate={{ opacity: [1, 0.5, 1] }} 
                            transition={{ duration: 2, repeat: Infinity }} 
                            className="w-3 h-3 bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                        ></motion.div>
                        <h2 className="text-sm font-bold text-ash-light uppercase tracking-widest flex items-center gap-2">
                            <Terminal size={16} className="text-cyan-400" />
                            SYSTEM_CONFIG // <span className="text-cyan-500/50">ROOT_ACCESS</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] text-ash-gray hidden md:block">BUILD: {currentVersion}</span>
                        <motion.button 
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleClose} 
                            className="text-ash-gray hover:text-cyan-400 p-1 transition-colors"
                        >
                            <X size={20} />
                        </motion.button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 relative z-10">
                    {/* Animated Background Grid & Effects */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none animate-drift-diagonal"
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
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.08),transparent_60%)] pointer-events-none"
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
                                className="max-w-xl mx-auto space-y-6 relative"
                            >
                                {/* System Stats - Redesigned */}
                                <div className="relative z-10 p-5 border border-cyan-500/30 bg-black/60 backdrop-blur-xl overflow-hidden group shadow-[0_0_30px_rgba(0,255,255,0.1)]">
                                    {/* Animated background elements */}
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,255,0.05)_50%,transparent_75%)] bg-[length:200%_200%] animate-gradient-xy"></div>
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-400/20 transition-colors duration-700"></div>
                                    
                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
                                    
                                    <div className="relative flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-cyan-950/50 border border-cyan-500/50">
                                                <Database size={14} className="text-cyan-400 animate-pulse" />
                                                <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" style={{ animationDuration: '3s' }}></div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-cyan-400 font-mono font-bold tracking-widest uppercase">CACHE_STATUS</span>
                                                <span className="text-[10px] text-ash-gray font-mono tracking-wider">NEURAL_SYNC_LINK</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-mono font-bold text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                                                {readStats.percent}<span className="text-sm text-cyan-500">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar Container */}
                                    <div className="relative w-full h-2.5 bg-ash-dark/50 rounded-full overflow-hidden mb-3 border border-ash-gray/20">
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
                                            <span className="text-[10px] text-ash-gray font-mono uppercase">{language === 'en' ? 'Processed Nodes' : '已读存盘节点'}</span>
                                            <span className="text-xs text-ash-light font-mono font-bold">{readStats.count} <span className="text-ash-gray font-normal">/ {readStats.total}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)] animate-pulse"></div>
                                            <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-wider">LINK_STABLE</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Simple Settings View */}
                                <div className="border border-ash-gray/30 bg-ash-black/80 p-6 relative backdrop-blur-md group hover:border-cyan-500/50 transition-colors duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                    <div className="absolute -top-2.5 left-3 bg-black px-2 text-[10px] font-bold text-cyan-500 uppercase flex items-center gap-1 border border-cyan-500/30">
                                        <Settings size={10} className="group-hover:animate-spin-slow" /> {language === 'en' ? 'BASIC_PREFS' : '基础偏好设置'}
                                    </div>
                                    
                                    <div className="space-y-6 mt-2 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-ash-gray uppercase">{language === 'en' ? 'System Language' : '系统界面语言'}</span>
                                            <motion.button 
                                                whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgb(0,255,255)" }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={onCycleLanguage}
                                                className="relative px-4 py-1.5 border border-ash-gray/50 text-ash-light text-sm hover:text-cyan-400 hover:border-cyan-500 transition-all duration-300 uppercase overflow-hidden group/btn bg-black"
                                            >
                                                <div className="absolute inset-0 bg-cyan-900/40 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out"></div>
                                                <span className="relative z-10">[{langLabel}]</span>
                                            </motion.button>
                                        </div>

                                <div className="space-y-3">
                                    <FontSelector value={readerFont} onChange={setReaderFont} language={language} isSetupMode />
                                    <div className="space-y-2 px-1">
                                        <div className="flex justify-between text-xs text-ash-gray uppercase">
                                            <span>{language === 'en' ? 'Font Size' : '阅读字号偏好'}</span>
                                            <span className="text-ash-light">{fontSize}px</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="12" 
                                            max="32" 
                                            step="1" 
                                            value={fontSize}
                                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-ash-black border border-ash-gray/30 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-ash-light rounded-none hover:[&::-webkit-slider-thumb]:bg-cyan-400 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-ash-gray/10 space-y-4">
                                    <ReadingModeToggle value={readingMode} onChange={setReadingMode} language={language} isSetupMode />
                                    <GraphicsQualitySelector value={graphicsQuality} onChange={setGraphicsQuality} language={language} isSetupMode />
                                    <div className="grid grid-cols-1 gap-4">
                                        <FullscreenToggle language={language} isSetupMode />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsAdvancedMode(true)}
                            className="relative w-full py-4 mb-8 border border-ash-gray/30 bg-black text-ash-gray hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300 text-xs uppercase flex items-center justify-center gap-2 group overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:200%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:-200%_0,0_0] group-hover:duration-[1500ms]"></div>
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <Terminal size={14} className="relative z-10 group-hover:animate-pulse" />
                            <span className="relative z-10 tracking-widest">{language === 'en' ? 'Advanced Options' : '进入高级控制模式'}</span>
                        </motion.button>
                        </motion.div>
                        ) : (
                        <motion.div 
                            key="advanced"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 relative"
                        >
                    
                    {/* Left Column: User & Core Settings */}
                    <div className="space-y-8">
                        {/* Identity Module */}
                        <div className="border border-ash-gray/30 bg-ash-black/50 p-4 relative group hover:border-ash-gray/60 transition-colors">
                            <div className="absolute -top-2.5 left-3 bg-black px-2 text-[10px] font-bold text-ash-gray uppercase flex items-center gap-1">
                                <User size={10} /> IDENTITY_MATRIX
                            </div>
                            
                            {nickname !== undefined && setNickname && (
                                <div className="space-y-3 mt-1">
                                    <div className="flex gap-0 relative">
                                        <div className="bg-ash-dark/30 border-y border-l border-ash-gray/30 px-3 flex items-center text-ash-gray font-mono text-xs">
                                            UID:
                                        </div>
                                        <input 
                                            type="text"
                                            value={nickname}
                                            onChange={(e) => handleNicknameChange(e.target.value)}
                                            maxLength={10}
                                            className={`flex-1 bg-black border border-ash-gray/30 px-3 py-2 text-ash-light font-mono text-sm focus:outline-none focus:border-ash-light transition-colors ${error ? 'border-red-500 text-red-500' : ''}`}
                                            placeholder='必填'
                                        />
                                        <button 
                                            onClick={onCopySyncLink}
                                            className="px-3 bg-ash-dark/30 border border-ash-gray/30 text-ash-gray hover:text-ash-light hover:bg-ash-gray/20 transition-colors"
                                            title="复制同步链接"
                                        >
                                            {copySuccess ? <span className="text-green-500 font-bold text-xs">OK</span> : <Share2 size={14} />}
                                        </button>
                                    </div>
                                    {error && (
                                        <div className="text-[9px] text-red-500 font-bold flex items-center gap-1 animate-pulse px-1">
                                            <AlertCircle size={10} /> 错误：必须设置代号
                                        </div>
                                    )}
                                    {copySuccess && <div className="text-[9px] text-green-500 font-mono px-1 animate-pulse">&gt; LINK_COPIED_TO_CLIPBOARD</div>}
                                </div>
                            )}
                        </div>

                        {/* Language & Reading Module */}
                        <div className="border border-ash-gray/30 bg-ash-black/50 p-4 relative">
                            <div className="absolute -top-2.5 left-3 bg-black px-2 text-[10px] font-bold text-ash-gray uppercase flex items-center gap-1">
                                <Cpu size={10} /> {language === 'en' ? 'INTERFACE_PARAMS' : '系统界面环境参数'}
                            </div>
                            
                            <div className="space-y-4 mt-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-ash-gray uppercase">{language === 'en' ? 'System_Language' : '系统界面语言'}</span>
                                    <button 
                                        onClick={onCycleLanguage}
                                        className="px-4 py-1 border border-ash-gray/50 text-ash-light text-xs hover:bg-ash-light hover:text-black transition-colors uppercase"
                                    >
                                        [{langLabel}]
                                    </button>
                                </div>
                                
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
                                            className="w-full h-1 bg-ash-black border border-ash-gray/30 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-ash-light rounded-none hover:[&::-webkit-slider-thumb]:bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-ash-gray/10">
                                    <ReadingModeToggle value={readingMode} onChange={setReadingMode} language={language} isSetupMode />
                                    {pureReadingMode !== undefined && setPureReadingMode && (
                                        <button
                                            onClick={() => setPureReadingMode(!pureReadingMode)}
                                            className={`w-full group mt-4 relative overflow-hidden p-3 sm:p-4 flex items-center justify-between border-2 transition-all duration-300 ${pureReadingMode ? 'border-cyan-400 bg-cyan-900/30' : 'border-cyan-900/50 bg-cyan-950/10 hover:border-cyan-500/80 hover:bg-cyan-900/20'}`}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${pureReadingMode ? 'opacity-100' : ''}`}></div>
                                            
                                            <div className="relative z-10 flex flex-col items-start gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-base sm:text-lg font-black tracking-widest ${pureReadingMode ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-cyan-500'}`}>
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
                            </div>
                        </div>
                    </div>

                    {/* Right Column: System & Graphics */}
                    <div className="space-y-8">
                        {/* Graphics Module */}
                        <div className="border border-ash-gray/30 bg-ash-black/50 p-4 relative">
                            <div className="absolute -top-2.5 left-3 bg-black px-2 text-[10px] font-bold text-ash-gray uppercase flex items-center gap-1">
                                <HardDrive size={10} /> {language === 'en' ? 'RENDER_SETTINGS' : '渲染与显示配置'}
                            </div>

                            <div className="space-y-4 mt-1">
                                <GraphicsQualitySelector value={graphicsQuality} onChange={setGraphicsQuality} language={language} isSetupMode />
                                
                                <div className="grid grid-cols-1 gap-3">
                                    <CRTToggle value={crtEnabled} onChange={setCrtEnabled} language={language} isSetupMode />
                                    <FullscreenToggle language={language} isSetupMode />
                                </div>
                            </div>
                        </div>

                        {/* Data Management */}
                        <div className="border border-ash-gray/30 bg-ash-black/50 p-4 relative">
                            <div className="absolute -top-2.5 left-3 bg-black px-2 text-[10px] font-bold text-ash-gray uppercase flex items-center gap-1">
                                <Database size={10} /> {language === 'en' ? 'DATA_MANAGEMENT' : '数据管理中心'}
                            </div>

                            <div className="space-y-4 mt-1">
                                <motion.button 
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(6, 182, 212, 0.3)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { onOpenReadingGuide(); handleClose(); }}
                                    className="relative w-full flex items-center justify-between px-3 py-2 border border-cyan-900/30 text-cyan-400/80 hover:bg-cyan-900/10 hover:text-cyan-300 hover:border-cyan-500/50 transition-all group text-xs uppercase overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:200%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:-200%_0,0_0] group-hover:duration-[1500ms]"></div>
                                    <span className="flex items-center gap-2 relative z-10">
                                        <FileText size={12} className="group-hover:animate-pulse" />
                                        {language === 'en' ? 'Reading Guide' : '阅读指南'}
                                    </span>
                                    <ArrowRight size={12} className="opacity-50 group-hover:translate-x-1 transition-transform relative z-10" />
                                </motion.button>

                                <motion.button 
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => { onOpenExporter(); handleClose(); }}
                                    className="relative w-full flex items-center justify-between px-3 py-2 border border-blue-900/30 text-blue-400/80 hover:bg-blue-900/10 hover:text-blue-300 hover:border-blue-500/50 transition-all group text-xs uppercase overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:200%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:-200%_0,0_0] group-hover:duration-[1500ms]"></div>
                                    <span className="flex items-center gap-2 relative z-10">
                                        <FileText size={12} className="group-hover:animate-pulse" />
                                        {language === 'en' ? 'Export Book (PDF)' : '导出全卷(PDF)'}
                                    </span>
                                    <ArrowRight size={12} className="opacity-50 group-hover:translate-x-1 transition-transform relative z-10" />
                                </motion.button>

                                {/* Reset Zone */}
                                <div className="pt-2 border-t border-ash-gray/10">
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
                                                    className="flex-1 py-1 border border-ash-gray/30 text-ash-gray text-[10px] hover:text-ash-light hover:border-ash-gray transition-colors uppercase"
                                                >
                                                    取消
                                                </button>
                                                <button 
                                                    onClick={onFactoryReset}
                                                    className="flex-1 py-1 bg-red-900/20 border border-red-500/50 text-red-500 font-bold text-[10px] hover:bg-red-500 hover:text-black transition-colors uppercase"
                                                >
                                                    确认清除
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <motion.button 
                                            whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)" }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setResetConfirm(true)}
                                            className="relative w-full flex items-center justify-between px-3 py-2 border border-red-900/30 text-red-700/80 hover:bg-red-950/10 hover:text-red-500 hover:border-red-500/50 transition-all group text-xs uppercase overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(239,68,68,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:200%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:-200%_0,0_0] group-hover:duration-[1500ms]"></div>
                                            <span className="flex items-center gap-2 relative z-10">
                                                <AlertTriangle size={12} className="group-hover:animate-pulse" />
                                                重置系统依赖
                                            </span>
                                            <Trash2 size={12} className="group-hover:rotate-12 transition-transform relative z-10" />
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Return to Basic Options Button */}
                    <motion.button 
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAdvancedMode(false)}
                        className="relative w-full py-4 mb-8 col-span-1 md:col-span-2 border border-ash-gray/30 bg-black text-ash-gray hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300 text-xs uppercase flex items-center justify-center gap-2 group overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:200%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:-200%_0,0_0] group-hover:duration-[1500ms]"></div>
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <ArrowRight size={14} className="relative z-10 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <span className="relative z-10 tracking-widest">{language === 'en' ? 'Basic Options' : '返回常规设置模式'}</span>
                    </motion.button>
                </motion.div>
                )}
                    </AnimatePresence>
                </div>

                {/* Footer Status Bar */}
            <div className="border-t border-ash-gray/30 bg-ash-dark/20 p-2 px-4 flex justify-between items-center relative z-10">
                <div className="text-[10px] text-ash-gray/50 font-mono flex gap-4 items-center">
                    <span>MEM: OK</span>
                    <span className="hidden md:inline">UPTIME: {Math.floor(performance.now() / 1000)}s</span>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="relative px-6 py-1.5 bg-ash-light text-black font-bold text-xs uppercase hover:bg-cyan-400 transition-colors flex items-center gap-2 overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                    <ArrowRight size={12} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    <span className="relative z-10">{t.apply}</span>
                </motion.button>
            </div>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DesktopSettingsModal;
