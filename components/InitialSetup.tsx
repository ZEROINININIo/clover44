
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check, ChevronRight, Terminal, Cpu, Volume2, Eye, User, Power } from 'lucide-react';
import { Language, ReadingMode } from '../types';
import CRTToggle from './CRTToggle';
import BackgroundMusic from './BackgroundMusic';
import FullscreenToggle from './FullscreenToggle';
import FontSelector from './fonts/FontSelector';
import ReadingModeToggle from './ReadingModeToggle';
import { ReaderFont, getFontClass } from './fonts/fontConfig';
import { APP_VERSION } from '../data/version';
import { initialSetupTranslations } from '../data/uiTranslations';

interface InitialSetupProps {
  onComplete: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  crtEnabled: boolean;
  setCrtEnabled: (enabled: boolean) => void;
  bgmPlaying: boolean;
  setBgmPlaying: (val: boolean) => void;
  bgmVolume: number;
  setBgmVolume: (val: number) => void;
  readerFont: ReaderFont;
  setReaderFont: (font: ReaderFont) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  readingMode?: ReadingMode;
  setReadingMode?: (mode: ReadingMode) => void;
  pureReadingMode: boolean;
  setPureReadingMode: (val: boolean) => void;
  nickname: string;
  setNickname: (name: string) => void;
}

const InitialSetup: React.FC<InitialSetupProps> = ({ 
    onComplete, language, setLanguage, crtEnabled, setCrtEnabled,
    bgmPlaying, setBgmPlaying, bgmVolume, setBgmVolume, readerFont, setReaderFont,
    fontSize, setFontSize,
    readingMode, setReadingMode, pureReadingMode, setPureReadingMode, nickname, setNickname
}) => {
  
  const [step, setStep] = useState(0); // 0: Lang, 1: Config
  const [isRebooting, setIsRebooting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nickError, setNickError] = useState(false);
  const [bootLog, setBootLog] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const t = initialSetupTranslations[language];

  // Simulated boot log for effect
  useEffect(() => {
    if (isRebooting) {
        const logs = [
            "INIT_SEQUENCE_START",
            "LOADING_KERNEL...",
            "MOUNTING_FILESYSTEM...",
            "CHECKING_INTEGRITY...",
            "LOADING_USER_PROFILE...",
            "APPLYING_CONFIG...",
            "STARTING_SERVICES...",
            "ESTABLISHING_CONNECTION...",
            "SYSTEM_READY"
        ];
        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                setBootLog(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0,8)}] ${logs[i]}`]);
                i++;
            }
        }, 300);
        return () => clearInterval(interval);
    }
  }, [isRebooting]);

  useEffect(() => {
    if (logEndRef.current) {
        logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [bootLog]);

  const handleReboot = () => {
    if (!nickname.trim()) {
        setNickError(true);
        return;
    }
    
    setIsRebooting(true);
    let currentProgress = 0;
    
    const interval = setInterval(() => {
        currentProgress += Math.random() * 8;
        if (currentProgress > 100) {
            currentProgress = 100;
            clearInterval(interval);
            setTimeout(onComplete, 1500); // Delay to show full logs
        }
        setProgress(currentProgress);
    }, 150);
  };

  const renderProgressBar = (percent: number) => {
      const totalBlocks = 20;
      const filledBlocks = Math.floor((percent / 100) * totalBlocks);
      return (
          <div className="font-mono text-xs md:text-sm tracking-widest">
              [{Array(totalBlocks).fill(0).map((_, i) => (
                  <span key={i} className={i < filledBlocks ? "text-amber-500" : "text-amber-900/30"}>
                      █
                  </span>
              ))}] {Math.floor(percent)}%
          </div>
      );
  };

  return (
    <div className={`min-h-screen bg-black text-amber-500 font-mono flex flex-col relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-100 ${getFontClass(readerFont)}`}>
        {/* CRT Scanline Overlay (Static for Setup) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20"></div>
        
        {/* Header Bar */}
        <header className="border-b border-amber-900/50 p-4 flex justify-between items-center bg-amber-950/10 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-amber-500 animate-pulse"></div>
                <h1 className="text-sm md:text-base font-bold tracking-widest uppercase">
                    NOVA_ARCHIVE // <span className="text-amber-700">SYS_INIT</span>
                </h1>
            </div>
            <div className="text-[10px] md:text-xs text-amber-700 font-mono">
                V.{APP_VERSION} // BUILD_{new Date().getFullYear()}
            </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
            
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

            {!isRebooting ? (
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[250px_1fr] border border-amber-900/50 bg-black/90 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
                    
                    {/* Sidebar / Status Panel */}
                    <aside className="border-b md:border-b-0 md:border-r border-amber-900/50 p-6 flex flex-col gap-6 bg-amber-950/5">
                        <div className="space-y-2">
                            <div className="text-[10px] text-amber-700 uppercase tracking-widest mb-2">System Status</div>
                            <div className="flex items-center gap-2 text-xs text-amber-500">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                KERNEL: ONLINE
                            </div>
                            <div className="flex items-center gap-2 text-xs text-amber-500">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                MEMORY: OK
                            </div>
                            <div className="flex items-center gap-2 text-xs text-amber-500">
                                <div className={`w-2 h-2 rounded-full ${step > 0 ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                CONFIG: {step > 0 ? 'LOADED' : 'PENDING'}
                            </div>
                        </div>

                        <div className="mt-auto space-y-2 hidden md:block">
                            <div className="text-[10px] text-amber-700 uppercase tracking-widest">Session ID</div>
                            <div className="text-xs font-mono text-amber-600 break-all">
                                {Math.random().toString(36).substring(2, 15).toUpperCase()}
                            </div>
                        </div>
                    </aside>

                    {/* Content Panel */}
                    <div className="p-6 md:p-10 min-h-[400px] flex flex-col">
                        
                        {/* Step 0: Language */}
                        <div className={`transition-all duration-500 ${step === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 hidden'}`}>
                            <h2 className="text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
                                <Terminal size={24} />
                                SELECT_LANGUAGE_MODULE
                            </h2>
                            
                            <div className="grid gap-4">
                                {(['zh-CN', 'zh-TW'] as Language[]).map((l, idx) => (
                                    <button
                                        key={l}
                                        onClick={() => {
                                            setLanguage(l);
                                            setStep(1);
                                        }}
                                        className={`group relative p-4 border border-amber-900/50 hover:border-amber-500 hover:bg-amber-500/10 text-left transition-all flex items-center justify-between ${language === l ? 'border-amber-500 bg-amber-500/5' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-amber-700 font-mono text-xs">0{idx + 1}</span>
                                            <span className="text-lg font-bold tracking-wider">
                                                {l === 'zh-CN' ? '简体中文' : '繁體中文'}
                                            </span>
                                        </div>
                                        <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step 1: Configuration */}
                        <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 hidden'}`}>
                            <div className="flex justify-between items-end mb-6 border-b border-amber-900/30 pb-4">
                                <h2 className="text-xl font-bold flex items-center gap-3">
                                    <Cpu size={24} />
                                    SYSTEM_CONFIGURATION
                                </h2>
                                <button onClick={() => setStep(0)} className="text-xs text-amber-700 hover:text-amber-500 uppercase hover:underline">
                                    [ CHANGE_LANGUAGE ]
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Column 1: Visuals */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-amber-700 uppercase flex items-center gap-2">
                                            <Eye size={14} /> {t.visuals}
                                        </label>
                                        
                                        <div className="space-y-3 pl-2 border-l border-amber-900/30">
                                            <FontSelector value={readerFont} onChange={setReaderFont} language={language} isSetupMode />
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] text-amber-700 uppercase">
                                                    <span>Font_Size</span>
                                                    <span>{fontSize}px</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="12" 
                                                    max="32" 
                                                    step="1" 
                                                    value={fontSize}
                                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                    className="w-full h-1 bg-amber-900/30 border border-amber-900/50 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-amber-500 rounded-none hover:[&::-webkit-slider-thumb]:bg-amber-400"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">CRT_EFFECT</span>
                                                <CRTToggle value={crtEnabled} onChange={setCrtEnabled} isSetupMode language={language} />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">FULLSCREEN</span>
                                                <FullscreenToggle isSetupMode language={language} />
                                            </div>
                                            {readingMode && setReadingMode && (
                                                <ReadingModeToggle value={readingMode} onChange={setReadingMode} language={language} isSetupMode />
                                            )}
                                            <button
                                                onClick={() => setPureReadingMode(!pureReadingMode)}
                                                className={`w-full group mt-6 relative overflow-hidden p-4 flex items-center justify-between border-2 transition-all duration-300 ${pureReadingMode ? 'border-amber-400 bg-amber-900/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-amber-900/50 bg-amber-950/20 hover:border-amber-500/80 hover:bg-amber-900/30'}`}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${pureReadingMode ? 'opacity-100' : ''}`}></div>
                                                
                                                <div className="relative z-10 flex flex-col items-start gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-base font-black tracking-widest ${pureReadingMode ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'text-amber-500'}`}>
                                                            纯净阅读模式
                                                        </span>
                                                        <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded-sm animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                                                            NEW
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-amber-600 font-mono text-left">
                                                        {language === 'en' ? 'Immersion Mode / Zero Distractions' : '完全沉浸 / 屏蔽系统UI'}
                                                    </span>
                                                </div>

                                                <div className={`relative z-10 w-12 h-6 rounded-sm border-2 transition-colors duration-300 ${pureReadingMode ? 'border-amber-300 bg-amber-900/60 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'border-amber-900 bg-black'}`}>
                                                    <div className={`absolute top-0.5 bottom-0.5 w-5 rounded-sm transition-all duration-300 ${pureReadingMode ? 'right-0.5 bg-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'left-0.5 bg-amber-900'}`}></div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Audio & User */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-amber-700 uppercase flex items-center gap-2">
                                            <Volume2 size={14} /> {t.audio}
                                        </label>
                                        <div className="pl-2 border-l border-amber-900/30">
                                            <BackgroundMusic 
                                                isSetupMode 
                                                isPlaying={bgmPlaying}
                                                onToggle={() => setBgmPlaying(!bgmPlaying)}
                                                volume={bgmVolume}
                                                onVolumeChange={setBgmVolume}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-amber-700 uppercase flex items-center gap-2">
                                            <User size={14} /> {t.identity}
                                        </label>
                                        <div className="pl-2 border-l border-amber-900/30 space-y-2">
                                            <div className="relative group">
                                                <span className="absolute left-3 top-2.5 text-amber-700 font-mono select-none">{'>'}</span>
                                                <input 
                                                    type="text" 
                                                    value={nickname}
                                                    onChange={(e) => {
                                                        setNickname(e.target.value);
                                                        if(nickError) setNickError(false);
                                                    }}
                                                    maxLength={10}
                                                    placeholder="ENTER_CODENAME..."
                                                    className={`w-full bg-amber-950/30 border ${nickError ? 'border-red-500 text-red-500' : 'border-amber-900/50 focus:border-amber-500'} p-2 pl-8 font-mono text-sm outline-none transition-all`}
                                                />
                                                <div className="absolute right-2 top-2.5 text-[10px] text-amber-700">
                                                    {nickname.length}/10
                                                </div>
                                            </div>
                                            {nickError && (
                                                <div className="text-[10px] text-red-500 font-bold animate-pulse">
                                                    [ERROR]: IDENTITY_REQUIRED
                                                </div>
                                            )}
                                            <div className="text-[9px] text-amber-700/80 leading-relaxed">
                                                {t.nickPrivacy}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-amber-900/30 flex justify-end">
                                <button
                                    onClick={handleReboot}
                                    className="group relative px-8 py-3 bg-amber-500 text-black font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors flex items-center gap-3"
                                >
                                    <Power size={18} />
                                    {t.reboot}
                                    <div className="absolute inset-0 border border-amber-500 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform pointer-events-none"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Reboot Sequence
                <div className="w-full max-w-2xl font-mono">
                    <div className="mb-8 border border-amber-900/50 bg-black p-4 h-64 overflow-y-auto custom-scrollbar shadow-inner">
                        {bootLog.map((log, i) => (
                            <div key={i} className="text-xs md:text-sm text-amber-500/80 mb-1">
                                {log}
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs uppercase text-amber-700">
                            <span>System_Reboot</span>
                            <span>{Math.floor(progress)}%</span>
                        </div>
                        {renderProgressBar(progress)}
                    </div>
                </div>
            )}
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-[10px] text-amber-900 uppercase tracking-widest z-10">
            NOVA LABS ARCHIVE // AUTHORIZED PERSONNEL ONLY
        </footer>
    </div>
  );
};

export default InitialSetup;
