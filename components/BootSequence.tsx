
import React, { useEffect, useState, useRef } from 'react';
import { AlertTriangle, Terminal, Cpu, CheckCircle, Zap, Star } from 'lucide-react';
import { Language } from '../types';
import { APP_VERSION, LATEST_UPDATE_DATE, LATEST_CHAPTER_TITLE, LATEST_UPDATE_PART, LATEST_UPDATE_CODE } from '../data/version';

interface BootSequenceProps {
  onComplete: () => void;
  isNormalBoot?: boolean;
  language: Language;
  onJumpToLatest?: () => void;
}

// Reusable Star Component for consistent branding
const FourPointStar = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style}>
    <defs>
      <linearGradient id="bluePurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4f46e5" />   {/* indigo-600 */}
        <stop offset="50%" stopColor="#9333ea" />  {/* purple-600 */}
        <stop offset="100%" stopColor="#d946ef" /> {/* fuchsia-500 */}
      </linearGradient>
    </defs>
    <path d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z" fill="url(#bluePurpleGrad)" />
  </svg>
);

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete, isNormalBoot = false, language, onJumpToLatest }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [phase, setPhase] = useState<'INIT' | 'LOADING' | 'READY' | 'ENTER'>('INIT');
  const [progress, setProgress] = useState(0);
  
  // Audio unlock helper
  const handleInteraction = () => {
      if (phase === 'READY') {
          setPhase('ENTER');
          setTimeout(onComplete, 1200); // Wait for exit animation
      }
  };

  // Boot Logic
  useEffect(() => {
    // Phase 1: INIT (Immediate)
    setPhase('LOADING');
    
    const bootSteps = [
        { msg: "BIOS_CHECK...", time: 200 },
        { msg: "LOADING_KERNEL...", time: 500 },
        { msg: "MOUNTING_VFS...", time: 800 },
        { msg: "DECRYPTING_ASSETS...", time: 1200 },
        { msg: "SYNC_TIMELINE...", time: 1600 },
        { msg: "PREPARING_INTERFACE...", time: 2000 },
        { msg: "SYSTEM_READY.", time: 2400 }
    ];

    let timer: number;
    let currentStep = 0;

    const runStep = () => {
        if (currentStep >= bootSteps.length) {
            setPhase('READY');
            return;
        }
        
        const step = bootSteps[currentStep];
        setLogs(prev => [...prev, `> ${step.msg}`].slice(-5)); // Keep last 5 lines
        setProgress(((currentStep + 1) / bootSteps.length) * 100);
        
        currentStep++;
        if (currentStep < bootSteps.length) {
            timer = window.setTimeout(runStep, bootSteps[currentStep].time - (bootSteps[currentStep-1]?.time || 0));
        } else {
            setPhase('READY');
        }
    };

    timer = window.setTimeout(runStep, 200);

    return () => window.clearTimeout(timer);
  }, []);

  const t = {
      ready: language === 'en' ? 'ESTABLISH LINK' : '建立链接',
      sub: language === 'en' ? 'CLICK TO INITIALIZE' : '点击接入系统',
      loading: 'SYSTEM_BOOT_SEQUENCE'
  };

  // Latest Update Info
  const latestChapterTitle = LATEST_CHAPTER_TITLE[language] || LATEST_CHAPTER_TITLE['zh-CN'];
  const latestUpdatePart = LATEST_UPDATE_PART[language] || LATEST_UPDATE_PART['zh-CN'];
  
  return (
    <div 
        className={`fixed inset-0 z-[100] bg-ash-black text-ash-light overflow-hidden flex flex-col items-center justify-center font-mono select-none cursor-pointer transition-colors duration-1000 ${phase === 'ENTER' ? 'bg-ash-white' : ''}`}
        onClick={handleInteraction}
    >
        {/* Background Grid */}
        <div className={`absolute inset-0 bg-grid-hard opacity-20 pointer-events-none transition-transform duration-[2000ms] ${phase === 'ENTER' ? 'scale-150 opacity-0' : 'scale-100'}`}></div>
        
        {/* === CENTRAL VISUAL: THE STAR CORE === */}
        <div className={`relative z-10 transition-all duration-700 ${phase === 'ENTER' ? 'scale-[20] opacity-0' : 'scale-100 opacity-100'}`}>
            <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
                
                {/* Orbit Rings (Loading State) */}
                <div className={`absolute inset-0 border border-ash-gray/20 rounded-full transition-all duration-700 ${phase === 'READY' ? 'scale-110 border-indigo-500/40 shadow-[0_0_20px_rgba(79,70,229,0.2)]' : 'animate-spin-slow'}`}></div>
                <div className={`absolute inset-8 border border-ash-gray/30 rounded-full border-dashed transition-all duration-700 ${phase === 'READY' ? 'scale-90 border-purple-500/40 shadow-[0_0_15px_rgba(147,51,234,0.2)]' : 'animate-spin-reverse-slow'}`}></div>
                
                {/* The Star (Logo) */}
                <div className={`relative z-20 transition-all duration-500 ${phase === 'READY' ? 'scale-100' : 'scale-50 opacity-50 grayscale'}`}>
                    <FourPointStar className={`w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_30px_rgba(147,51,234,0.4)] ${phase === 'READY' ? 'animate-pulse' : 'text-ash-gray'}`} />
                    
                    {/* Inner Glitch Effect on Hover/Ready */}
                    {phase === 'READY' && (
                        <div className="absolute inset-0 mix-blend-screen animate-shake-violent opacity-50">
                            <FourPointStar className="w-full h-full" style={{ filter: 'opacity(50%)' }} />
                        </div>
                    )}
                </div>

                {/* Progress Ring (SVG Stroke) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                    <circle 
                        cx="50%" cy="50%" r="48%" 
                        fill="none" 
                        stroke="url(#bluePurpleGrad)" 
                        strokeWidth="1"
                        className="opacity-60"
                        strokeDasharray="300"
                        strokeDashoffset={300 - (progress / 100) * 300}
                        style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
                    />
                </svg>

                {/* Center Text Overlay (When Ready) */}
                {phase === 'READY' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center w-full animate-fade-in">
                        <div className="text-xl md:text-3xl font-black text-white mix-blend-difference tracking-widest uppercase glitch-text-heavy" data-text="LINK START">
                            {t.ready}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* === BOTTOM LOGS OR UPDATE CARD === */}
        <div className={`absolute bottom-12 left-0 right-0 text-center transition-opacity duration-500 ${phase === 'ENTER' ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col justify-end items-center gap-1 font-mono text-[10px] md:text-xs text-ash-gray/60 min-h-[100px]">
                {phase !== 'READY' ? (
                    logs.map((log, i) => (
                        <div key={i} className={`tracking-wider ${i === logs.length - 1 ? 'text-purple-400 font-bold' : 'opacity-50'}`}>
                            {log}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center w-full max-w-sm px-6 animate-slide-in">
                        {/* New Update Card */}
                        <div 
                            className={`w-full mb-4 border border-purple-500/40 bg-indigo-950/20 backdrop-blur-md p-1 relative overflow-hidden group transition-colors ${onJumpToLatest ? 'cursor-pointer hover:bg-indigo-900/40 hover:border-purple-400/60' : ''}`}
                            onClick={() => onJumpToLatest && onJumpToLatest()}
                        >
                            {/* Card Corners */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-indigo-500 transition-colors group-hover:border-purple-400"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-indigo-500 transition-colors group-hover:border-purple-400"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-indigo-500 transition-colors group-hover:border-purple-400"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-indigo-500 transition-colors group-hover:border-purple-400"></div>
                            
                            <div className="flex items-center gap-3 p-2">
                                <div className="w-10 h-10 flex items-center justify-center border border-purple-500/50 bg-purple-500/10 shrink-0 group-hover:bg-purple-500/20 transition-colors">
                                    <Star className="text-purple-400 animate-pulse" size={18} fill="currentColor" />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="text-[9px] text-indigo-400 font-bold tracking-widest uppercase group-hover:text-purple-400 transition-colors">LATEST UPDATE</span>
                                        <span className="text-[9px] text-ash-gray font-mono">{LATEST_UPDATE_DATE}</span>
                                    </div>
                                    <div className="text-[10px] text-purple-300/80 font-mono truncate mb-0.5">
                                        {latestUpdatePart} // {LATEST_UPDATE_CODE}
                                    </div>
                                    <h3 className="text-xs font-bold text-ash-light truncate uppercase flex items-center gap-2 group-hover:text-white transition-colors">
                                        {latestChapterTitle} 
                                        <span className="px-1 bg-purple-500/20 text-purple-400 text-[9px] rounded-sm">NEW</span>
                                    </h3>
                                </div>
                            </div>
                            {onJumpToLatest && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="text-[10px] font-mono text-purple-400 bg-indigo-950/80 px-2 py-1 rounded border border-purple-500/30">
                                        JUMP &gt;&gt;
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse tracking-widest uppercase font-bold">
                            {t.sub}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* === CORNER DECOR === */}
        <div className={`absolute top-4 left-4 text-[10px] font-mono text-ash-gray/30 transition-opacity duration-500 ${phase === 'ENTER' ? 'opacity-0' : 'opacity-100'}`}>
            NOVA_OS // BOOTLOADER
        </div>
        <div className={`absolute top-4 right-4 text-[10px] font-mono text-ash-gray/30 text-right transition-opacity duration-500 ${phase === 'ENTER' ? 'opacity-0' : 'opacity-100'}`}>
            VER: {APP_VERSION}<br/>
            MEM: OK
        </div>

        {/* Flash Overlay */}
        <div className={`fixed inset-0 bg-white pointer-events-none transition-opacity duration-1000 z-[110] ${phase === 'ENTER' ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
};

export default BootSequence;
