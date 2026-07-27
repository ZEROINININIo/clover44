
import React, { useState, useEffect, useRef } from 'react';
import { Chapter, Language, VNNode, GraphicsQuality } from '../../../types';
import { parseChapterToVN } from '../../../utils/vnParser';
import { ArrowLeft, Play, Pause, FastForward, RotateCcw, Sparkles, Star, Zap, Eye, ChevronDown, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { CollabStarBackground } from '../backgrounds/CollabStarBackground';
import Reveal from '../../Reveal';
import MaskedText from '../../MaskedText';
import { StarRPGMap } from './StarRPGMap'; 

interface CollabStarReaderProps {
  chapter: Chapter;
  onNextChapter: () => void;
  onPrevChapter: () => void;
  onBack: () => void;
  language: Language;
  graphicsQuality: GraphicsQuality;
}

// --- Soul Prism: Abstract Character Representation ---
const SoulPrism = ({ speaker }: { speaker: string }) => {
    const isYuyuko = speaker.toLowerCase().includes('yuyuko') || speaker.includes('幽幽子');
    const isPoint = speaker.toLowerCase().includes('point') || speaker.includes('零点') || speaker.includes('零點');
    const isZelo = speaker.toLowerCase().includes('zelo') || speaker.includes('泽洛') || speaker.includes('澤洛');
    const isSystem = speaker.toLowerCase().includes('system') || speaker.includes('系统');

    if (isSystem) return null;

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none transition-all duration-1000">
            {isYuyuko && (
                <div className="relative w-64 h-64 animate-float-slow">
                    {/* Yuyuko's Soul: A fragile, purple star */}
                    <div className="absolute inset-0 bg-purple-500/10 blur-[60px] rounded-full animate-pulse-slow"></div>
                    <svg viewBox="0 0 100 100" className="w-full h-full text-purple-200/50 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" fill="currentColor" className="animate-spin-slow" style={{ animationDuration: '60s' }} />
                    </svg>
                    <div className="absolute inset-[30%] border border-cyan-400/30 rotate-45 animate-pulse"></div>
                </div>
            )}
            {isPoint && (
                <div className="relative w-64 h-64 animate-float-slow">
                    {/* Point's Soul: A stable, white/grey circle */}
                    <div className="absolute inset-0 bg-white/5 blur-[50px] rounded-full"></div>
                    <div className="absolute inset-10 border-2 border-white/20 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-16 border border-dashed border-white/40 rounded-full animate-[spin_20s_linear_infinite]"></div>
                </div>
            )}
            {isZelo && (
                <div className="relative w-64 h-64 animate-float-slow">
                    {/* Zelo's Soul: Energetic Blue Squares */}
                    <div className="absolute inset-0 bg-cyan-500/10 blur-[50px] rounded-full"></div>
                    <div className="absolute inset-12 border-2 border-cyan-400/30 rotate-45 animate-spin-slow"></div>
                    <div className="absolute inset-20 bg-cyan-400/10 animate-pulse"></div>
                </div>
            )}
        </div>
    );
};

// --- Star Void Vision Card: Collapsible Info Block ---
const StarVoidVisionCard: React.FC<{ content: string }> = ({ content }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="my-4 relative group z-50 w-full">
             <div 
                className={`
                    border border-purple-500/30 transition-all duration-500 relative overflow-hidden flex flex-col
                    bg-[#1a103c]/80 text-purple-100 backdrop-blur-md rounded-sm
                    ${isExpanded ? 'shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer'}
                `}
                onClick={() => !isExpanded && setIsExpanded(true)}
             >
                {/* Header */}
                <div className={`flex items-center justify-between p-3 border-b border-purple-500/30 ${!isExpanded && 'bg-purple-900/20'}`}>
                    <div className="flex items-center gap-2">
                        <Eye size={16} className={isExpanded ? "text-cyan-400" : "text-purple-400 animate-pulse"} />
                        <span className="font-mono text-xs font-bold tracking-widest text-cyan-300 uppercase">
                            VOID_VISION
                        </span>
                    </div>
                    {isExpanded && (
                        <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}>
                            <ChevronDown size={14} className="rotate-180 text-purple-300 hover:text-white" />
                        </button>
                    )}
                </div>
                
                {/* Content */}
                <div className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-4 text-xs md:text-sm font-mono leading-relaxed text-purple-50 border-l-2 border-cyan-500/30 ml-2 my-2 whitespace-pre-wrap">
                        {content}
                    </div>
                </div>

                {!isExpanded && (
                    <div className="p-4 text-center text-[10px] font-mono text-purple-300/60 uppercase tracking-widest animate-pulse">
                        [HIDDEN_DATA // CLICK_TO_DECRYPT]
                    </div>
                )}
             </div>
        </div>
    );
};

export const CollabStarReader: React.FC<CollabStarReaderProps> = ({ 
    chapter, onNextChapter, onPrevChapter, onBack, language, graphicsQuality 
}) => {
    // --- HOOKS SECTION (Must be top level, no early returns before all hooks) ---
    const [nodes, setNodes] = useState<VNNode[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const [showLog, setShowLog] = useState(false);
    const [viewMode, setViewMode] = useState<'vn' | 'rpg'>('vn'); // Control visualization mode
    const [showEndModal, setShowEndModal] = useState(false);

    // Refs for intervals
    const typeIntervalRef = useRef<number | null>(null);
    const autoPlayTimeoutRef = useRef<number | null>(null);

    // Load Script
    useEffect(() => {
        // Reset state when chapter changes
        if (chapter.status !== 'locked') {
            const parsed = parseChapterToVN(chapter.translations[language].content || chapter.translations['zh-CN'].content);
            setNodes(parsed);
            setCurrentIndex(0);
            setDisplayedText('');
            setShowEndModal(false);
        } else {
            // Reset for locked state to avoid stale data
            setNodes([]);
        }
    }, [chapter, language]);

    const currentNode = nodes[currentIndex];

    // RPG Trigger Logic (Cinematic)
    useEffect(() => {
        if (!currentNode) return;
        
        // Use a hidden tag [[RPG_START]] in the content to trigger logic
        if (currentNode.type === 'narration' && currentNode.text.includes('[[RPG_START]]')) {
            setViewMode('rpg');
        }
    }, [currentIndex, currentNode]);

    const handleRPGComplete = () => {
        setViewMode('vn');
        // Auto advance past the trigger node
        setCurrentIndex(prev => prev + 1);
    };

    const handleAutoPlayNext = (delay: number) => {
        autoPlayTimeoutRef.current = window.setTimeout(() => {
            handleNext();
        }, delay);
    };

    const handleNext = () => {
        if (viewMode === 'rpg' || showEndModal) return; // Disable controls during special modes

        if (isTyping && currentNode) {
            // Instant finish
            if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
            setDisplayedText(currentNode.text.replace('[[RPG_START]]', ''));
            setIsTyping(false);
            if (autoPlay) handleAutoPlayNext(2000); 
            return;
        }

        if (currentIndex < nodes.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // End of chapter
            setAutoPlay(false);
            setShowEndModal(true);
        }
    };

    // Typing Logic
    useEffect(() => {
        if (!currentNode || viewMode === 'rpg' || chapter.status === 'locked') return;

        // Reset
        setDisplayedText('');
        setIsTyping(true);
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);

        const fullText = currentNode.text.replace('[[RPG_START]]', '').trim(); // Hide trigger tag from UI
        let charIdx = 0;

        // Instant render for rich text tags to avoid breaking markup during typing
        if (fullText.includes('[[')) {
             setDisplayedText(fullText);
             setIsTyping(false);
             if (autoPlay) handleAutoPlayNext(2000 + fullText.length * 20);
             return;
        }

        typeIntervalRef.current = window.setInterval(() => {
            if (charIdx < fullText.length) {
                setDisplayedText(fullText.substring(0, charIdx + 1));
                charIdx++;
            } else {
                setIsTyping(false);
                if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
                if (autoPlay) handleAutoPlayNext(1000 + fullText.length * 50);
            }
        }, 40); // Slower typing for atmospheric feel

        return () => {
            if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        };
    }, [currentIndex, currentNode, autoPlay, viewMode, chapter.status]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === ' ' || e.key === 'Enter') && viewMode === 'vn' && chapter.status !== 'locked') {
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isTyping, currentIndex, viewMode, showEndModal, chapter.status]); 

    // --- End of Hooks ---

    // Rich Text Parser adapted for Collab Theme
    const parseRichText = (text: string) => {
        const parts = text.split(/(\[\[(?:MASK|GLITCH_GREEN|GREEN|DARK_GREEN|VOID|GREY_MYSTIC|DANGER|BLUE|WHITE|VOID_VISION)::.*?\]\])/g);
        return parts.map((part, index) => {
            if (part.startsWith('[[MASK::') && part.endsWith(']]')) {
                return <MaskedText key={index}>{part.slice(8, -2)}</MaskedText>;
            }
            if (part.startsWith('[[GLITCH_GREEN::')) {
                return <span key={index} className="text-emerald-400 font-black tracking-widest glitch-text-heavy inline-block" data-text={part.slice(16, -2)}>{part.slice(16, -2)}</span>;
            }
            if (part.startsWith('[[GREEN::')) {
                return <span key={index} className="text-emerald-400 font-mono">{part.slice(9, -2)}</span>;
            }
            if (part.startsWith('[[VOID::')) {
                return <span key={index} className="text-fuchsia-400 font-black drop-shadow-[0_0_5px_currentColor] animate-pulse">{part.slice(8, -2)}</span>;
            }
            if (part.startsWith('[[GREY_MYSTIC::')) {
                return <span key={index} className="text-neutral-400 font-black drop-shadow-[0_0_8px_currentColor] animate-pulse">{part.slice(15, -2)}</span>;
            }
            if (part.startsWith('[[DANGER::')) {
                return <span key={index} className="text-red-500 font-bold animate-shake-violent inline-block">{part.slice(10, -2)}</span>;
            }
            if (part.startsWith('[[DARK_GREEN::')) {
                return <span key={index} className="text-emerald-800 font-black drop-shadow-[0_0_8px_rgba(4,120,87,0.5)] tracking-wide">{part.slice(14, -2)}</span>;
            }
            if (part.startsWith('[[BLUE::')) {
                return <span key={index} className="text-cyan-400 font-bold">{part.slice(8, -2)}</span>;
            }
            if (part.startsWith('[[WHITE::')) {
                return <span key={index} className="text-white font-bold drop-shadow-[0_0_10px_white]">{part.slice(9, -2)}</span>;
            }
            if (part.startsWith('[[VOID_VISION::')) {
                return <StarVoidVisionCard key={index} content={part.slice(15, -2)} />;
            }
            
            // Handle Bold (**text**)
            const boldParts = part.split(/(\*\*.*?\*\*)/g);
            if (boldParts.length > 1) {
                return (
                    <span key={index}>
                        {boldParts.map((bp, bIdx) => {
                            if (bp.startsWith('**') && bp.endsWith('**')) {
                                return <strong key={bIdx} className="text-cyan-100 font-bold">{bp.slice(2, -2)}</strong>;
                            }
                            return bp;
                        })}
                    </span>
                );
            }

            return part;
        });
    };

    // --- Render Logic ---

    // 1. Locked State Render
    if (chapter.status === 'locked') {
        return (
            <div className="relative w-full h-full bg-[#0f0518] flex flex-col items-center justify-center text-purple-200 overflow-hidden">
                <CollabStarBackground quality={graphicsQuality} />
                <div className="absolute inset-0 bg-[#0f0518]/50 z-0"></div>
                
                <div className="z-10 text-center p-8 border border-purple-500/30 bg-black/50 backdrop-blur-md animate-fade-in max-w-sm w-full mx-4">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 border-2 border-purple-500/50 rounded-full flex items-center justify-center bg-purple-900/20">
                            <Lock size={32} className="text-purple-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mb-2 tracking-widest text-cyan-200 uppercase">
                        {language === 'en' ? 'CHAPTER LOCKED' : '章节未解锁'}
                    </h2>
                    <p className="text-xs font-mono text-purple-300/60 mb-8">
                        {language === 'en' ? 'Signal source pending...' : '信号源等待接入中...'}
                    </p>
                    <button 
                        onClick={onBack} 
                        className="w-full py-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 text-purple-200 text-xs font-bold uppercase transition-all"
                    >
                        {language === 'en' ? 'RETURN TO STAR MAP' : '返回星图'}
                    </button>
                </div>
            </div>
        );
    }

    // 2. Loading State (Valid Chapter but no nodes yet)
    if (!currentNode) return <div className="bg-[#0f0518] h-full flex items-center justify-center text-purple-200 font-mono">INITIALIZING...</div>;

    const isNarration = currentNode.type === 'narration' || currentNode.type === 'system';
    const cleanSpeaker = currentNode.speakerName?.replace('：', '').replace(':', '') || '';

    // 3. Main Reader Render
    return (
        <div className="relative w-full h-full overflow-hidden font-sans select-none text-white">
            
            {/* Background Layer */}
            <CollabStarBackground quality={graphicsQuality} /> 
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f0518]/90 pointer-events-none z-0"></div>

            {/* Cinematic RPG Cutscene */}
            {viewMode === 'rpg' && (
                <div className="absolute inset-0 z-[100]">
                    <StarRPGMap onComplete={handleRPGComplete} language={language} />
                </div>
            )}

            {viewMode === 'vn' && (
                <>
                    {/* Soul Prism (Visualizer) */}
                    <SoulPrism speaker={currentNode.speaker || ''} />

                    {/* Top HUD */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                        <button 
                            onClick={onBack}
                            className="flex items-center gap-2 px-4 py-2 border border-purple-500/30 bg-[#0f0518]/50 backdrop-blur-md text-purple-200 text-xs font-mono hover:bg-purple-900/50 hover:border-cyan-400/50 transition-all rounded-full group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            <span>BACK_TO_STAR_MAP</span>
                        </button>

                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2 text-cyan-300 text-xs font-black tracking-widest uppercase mb-1">
                                <Sparkles size={12} className="animate-spin-slow" />
                                SYNC_RATE: {(90 + (currentIndex / nodes.length) * 10).toFixed(2)}%
                            </div>
                            <div className="w-32 h-0.5 bg-purple-900/50 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 animate-pulse" style={{ width: `${(90 + (currentIndex / nodes.length) * 10)}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Center Stage (For Narration/System) */}
                    {isNarration && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 p-12 pointer-events-auto" onClick={handleNext}>
                            <div 
                                className={`
                                    max-w-2xl text-center leading-loose tracking-normal font-serif pointer-events-auto cursor-pointer
                                    ${currentNode.type === 'system' ? 'text-red-300 font-mono text-sm border-y border-red-900/50 py-4 bg-black/50' : 'text-purple-100/90 text-lg md:text-2xl italic shadow-black drop-shadow-md text-justify'}
                                    animate-fade-in
                                `}
                            >
                                {parseRichText(displayedText)}
                            </div>
                        </div>
                    )}

                    {/* Dialogue Interface (Glass Style) */}
                    {!isNarration && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12 z-30 flex flex-col items-center">
                            <div 
                                className="w-full max-w-4xl relative group cursor-pointer"
                                onClick={handleNext}
                            >
                                {/* Name Tag (Floating) */}
                                {cleanSpeaker && (
                                    <div className="absolute -top-6 left-0 md:-left-4 z-40">
                                        <div className="relative px-6 py-1.5">
                                            {/* Glass Shape */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/80 to-purple-900/80 backdrop-blur-xl -skew-x-12 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]"></div>
                                            <span className="relative text-cyan-100 font-bold font-mono tracking-widest text-sm md:text-base uppercase flex items-center gap-2">
                                                <Star size={10} fill="currentColor" /> {cleanSpeaker}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Dialogue Box (Glass Shard) */}
                                <div className={`
                                    relative min-h-[160px] md:min-h-[200px] w-full
                                    bg-gradient-to-b from-[#1a103c]/80 to-[#0f0518]/95 backdrop-blur-md
                                    border-t border-b border-purple-500/20
                                    p-6 md:p-10
                                    clip-path-polygon
                                    transition-all duration-300
                                    hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]
                                `}>
                                    {/* Corner Decorations */}
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400"></div>
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400"></div>
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400"></div>
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400"></div>

                                    {/* Text Content */}
                                    <div className="text-base md:text-xl text-purple-50/90 font-medium leading-loose tracking-normal text-justify font-sans relative z-10">
                                        {parseRichText(displayedText)}
                                        {isTyping && <span className="inline-block w-1.5 h-5 bg-cyan-400 ml-1 animate-pulse align-middle shadow-[0_0_8px_cyan]"></span>}
                                    </div>

                                    {/* Next Indicator */}
                                    {!isTyping && (
                                        <div className="absolute bottom-4 right-6 animate-bounce">
                                            <Zap size={18} className="text-cyan-400 fill-cyan-400/50" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Controls Bar */}
                            <div className="mt-4 flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
                                <button onClick={() => setShowLog(!showLog)} className="flex items-center gap-1 text-[10px] font-mono hover:text-cyan-400 transition-colors">
                                    <RotateCcw size={12} /> LOG
                                </button>
                                <button onClick={() => setAutoPlay(!autoPlay)} className={`flex items-center gap-1 text-[10px] font-mono transition-colors ${autoPlay ? 'text-cyan-400' : 'hover:text-cyan-400'}`}>
                                    {autoPlay ? <Pause size={12} /> : <Play size={12} />} AUTO
                                </button>
                                <button onClick={onNextChapter} className="flex items-center gap-1 text-[10px] font-mono hover:text-cyan-400 transition-colors">
                                    <FastForward size={12} /> SKIP
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Log Modal */}
                    {showLog && (
                        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md p-8 overflow-y-auto animate-fade-in" onClick={() => setShowLog(false)}>
                            <div className="max-w-3xl mx-auto space-y-6 pt-12" onClick={e => e.stopPropagation()}>
                                <h2 className="text-xl font-bold font-mono text-cyan-400 border-b border-purple-500/30 pb-4 mb-8">MEMORY_LOG</h2>
                                {nodes.slice(0, currentIndex + 1).map((node, i) => (
                                    <div key={i} className="flex flex-col gap-1 border-l border-purple-500/30 pl-4 opacity-70 hover:opacity-100 transition-opacity">
                                        <div className="text-xs font-bold text-purple-300 uppercase">{node.speakerName || 'SYSTEM'}</div>
                                        <div className="text-sm text-purple-100">{parseRichText(node.text.replace('[[RPG_START]]', ''))}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* End Chapter Modal */}
                    {showEndModal && (
                        <div className="absolute inset-0 z-[100] bg-[#0f0518]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                            <div className="w-full max-w-md border border-purple-500/50 bg-[#1a103c] p-8 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex flex-col gap-6 relative text-center">
                                {/* Decor */}
                                <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 bg-purple-500"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-500"></div>

                                <div className="flex justify-center mb-2">
                                    <CheckCircle size={48} className="text-cyan-400 animate-pulse" />
                                </div>

                                <div>
                                    <div className="text-purple-300 font-mono text-xs uppercase tracking-widest mb-2">MEMORY_SEQUENCE_COMPLETE</div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                        {language === 'en' ? 'CHAPTER COMPLETED' : '本章阅读完毕'}
                                    </h2>
                                    <p className="text-purple-200/60 text-sm mt-2 font-mono">
                                        {language === 'en' ? 'Signal transmission ended. Proceed to next coordinate?' : '信号传输中断。是否前往下一坐标？'}
                                    </p>
                                </div>
                                
                                <div className="flex flex-col gap-3 mt-4">
                                    <button 
                                        onClick={() => { setShowEndModal(false); onNextChapter(); }}
                                        className="w-full py-3 bg-cyan-600/20 border border-cyan-500/50 text-cyan-300 font-bold uppercase hover:bg-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <Play size={16} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                                        {language === 'en' ? 'NEXT CHAPTER' : '下一章'}
                                    </button>
                                    <button 
                                        onClick={onBack}
                                        className="w-full py-3 border border-purple-500/30 text-purple-400 font-bold uppercase hover:bg-purple-500/10 hover:text-purple-300 transition-all"
                                    >
                                        {language === 'en' ? 'RETURN TO STAR MAP' : '返回星图'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

        </div>
    );
};
