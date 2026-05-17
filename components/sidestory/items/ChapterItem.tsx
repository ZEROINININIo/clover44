
import React from 'react';
import { Chapter, Language } from '../../../types';
import { Star, Loader2, XCircle, History, Lock, Clock, FileText, ChevronRight } from 'lucide-react';
import { StraightStar } from '../../icons/StraightStar';

interface ChapterItemProps {
    chapter: Chapter;
    index: number;
    volumeId: string;
    onSelect: (index: number) => void;
    language: Language;
    isLightTheme: boolean;
    isTimelineNode?: boolean;
    isConnectedSubChapter?: boolean;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({ 
    chapter, index, volumeId, onSelect, language, isLightTheme, isTimelineNode = false, isConnectedSubChapter = false
}) => {
    const isLocked = chapter.status === 'locked';
    const t = chapter.translations[language] || chapter.translations['zh-CN'];
    const isLegacy = chapter.id === 'special-legacy-dusk';
    const isGarbled = t.title.includes('▞');
    const isConstructing = chapter.id === 'F_ERR';
    const isTerminalNode = chapter.id === 'special-terminal-discovery';
    
    // Extract series letter from date string (e.g., "档案记录: X-001" -> "X")
    const seriesMatch = chapter.date.match(/([A-Z]+)-\d+/);
    const seriesLetter = seriesMatch ? seriesMatch[1] : null;
    
    // X-009 Special Check: Time Retrace / Memory Construction
    const isTimeTrace = chapter.id === 'story-daily-missing-second';

    // Volume Checks
    const isPBVolume = volumeId === 'VOL_PB';
    const isTimeOriginVolume = volumeId === 'VOL_TIME_ORIGIN';
    const isCollabStarVolume = volumeId === 'VOL_COLLAB_STAR';

    // Animated ST changing component
    const ChangingSTLabel = () => {
        const [num, setNum] = React.useState(1);
        React.useEffect(() => {
            const interval = setInterval(() => {
                setNum(prev => (prev % 9) + 1);
            }, 100);
            return () => clearInterval(interval);
        }, []);
        return <span>ST.{num}</span>;
    };

    // Helper to determine World Line
    const getWorldLineInfo = (volId: string) => {
        if (volId === 'VOL_FIRST_STEP') {
            return { label: <ChangingSTLabel />, colorClass: 'text-black bg-white border-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' };
        }
        if (volId === 'VOL_TIME_ORIGIN' || volId === 'VOL_VARIABLE') {
            return { label: 'ST.0', colorClass: isLightTheme ? 'text-indigo-600 border-indigo-200 bg-indigo-50' : 'text-indigo-400 border-indigo-500/30 bg-indigo-950/30' };
        }
        return { label: 'ST.1', colorClass: isLightTheme ? 'text-zinc-500 border-zinc-200 bg-zinc-50' : 'text-ash-gray border-ash-gray/30 bg-ash-dark/30' };
    };
    const worldLineInfo = getWorldLineInfo(volumeId);

    let itemClass = "";
    if (isTerminalNode) {
        itemClass = isLightTheme 
        ? 'bg-gradient-to-r from-emerald-50 to-fuchsia-50 border-emerald-500 text-emerald-800 shadow-md border-dashed'
        : 'bg-gradient-to-r from-emerald-950/40 to-fuchsia-950/40 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] border-dashed hover:border-fuchsia-500/50 hover:text-fuchsia-300 transition-all';
    } else if (isTimeTrace) {
        itemClass = isLightTheme
        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-[0_0_10px_rgba(99,102,241,0.2)] border-dashed hover:border-indigo-500'
        : 'bg-indigo-950/30 border-indigo-500/50 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.15)] border-dashed hover:border-indigo-400 hover:bg-indigo-900/50';
    } else if (isLegacy) {
        itemClass = isLightTheme
        ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-[0_0_15px_rgba(37,99,235,0.4)] border-dashed skew-x-2'
        : 'bg-blue-950/30 border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.4)] border-dashed -skew-x-1';
    } else if (isConstructing) {
        itemClass = 'bg-emerald-950/20 border-emerald-900 text-emerald-600 animate-pulse border-dashed border-2 cursor-progress';
    } else if (isGarbled) {
        itemClass = 'bg-red-950/20 border-red-900 text-red-700 opacity-80 cursor-not-allowed animate-pulse border-dotted border-4 scale-[0.98] origin-center rotate-[0.5deg]';
    } else if (isLocked) {
        itemClass = isLightTheme 
        ? 'bg-zinc-100 border-zinc-300 text-zinc-400 opacity-60 cursor-not-allowed'
        : 'bg-ash-dark/20 border-ash-dark/50 text-ash-gray opacity-60 cursor-not-allowed';
    } else {
        // Special styling for TIME_ORIGIN items in standard list
        if (isTimeOriginVolume) {
            itemClass = isLightTheme
            ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 hover:bg-indigo-100 hover:border-indigo-400 shadow-sm'
            : 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300 hover:border-indigo-400 hover:bg-indigo-950/30 shadow-hard-sm';
        } else if (isPBVolume) {
            // PB Volume: Monochromatic, High Contrast, "Void" feel
            itemClass = isLightTheme
            ? 'bg-white border-black text-black hover:bg-black hover:text-white border-2 shadow-sm'
            : 'bg-black border-white text-white hover:bg-white hover:text-black border-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]';
        } else if (isCollabStarVolume) {
            // Collab Volume: Purple/Cyan Mystical
            itemClass = isLightTheme
            ? 'bg-white border-purple-200 text-purple-900 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
            : 'bg-purple-950/20 border-purple-500/30 text-purple-200 hover:border-cyan-400 hover:bg-purple-950/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]';
        } else {
            itemClass = isLightTheme
            ? 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-50 hover:border-zinc-500 shadow-sm'
            : 'bg-ash-black/80 border-ash-dark/50 text-ash-light hover:border-ash-light hover:bg-ash-dark/40 shadow-hard-sm';
        }
    }

    // Timeline Specific Overrides
    if (isTimelineNode) {
        // In timeline modal, we want slightly more compact but distinct items
        if (!isLocked && !isConstructing && !isGarbled && !isTerminalNode && !isLegacy && !isTimeTrace) {
            itemClass = isLightTheme
            ? 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50'
            : 'bg-black/60 border-ash-gray/30 text-ash-light hover:border-ash-light hover:bg-ash-light/10';
        }
    }

    return (
        <button
            onClick={() => {
                if (!isLocked || isConstructing) {
                    onSelect(index); // Use index passed directly or implicit logic
                }
            }}
            disabled={isLocked && !isConstructing}
            className={`
                flex items-center gap-4 p-4 border transition-all duration-300 group relative overflow-hidden
                ${isTimelineNode ? 'w-full text-left rounded-sm' : (isConnectedSubChapter ? 'ml-12 w-[calc(100%-3rem)]' : 'w-full')}
                ${itemClass}
            `}
        >
            {/* Background Series Letter Decoration */}
            {seriesLetter && !isPBVolume && (
                <div className="absolute -right-2 -bottom-6 text-[80px] font-black font-mono opacity-[0.06] pointer-events-none select-none transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12 z-0">
                    {seriesLetter}
                </div>
            )}

            {/* Index/Icon Box */}
            <div className={`shrink-0 w-8 text-center font-mono text-xs relative z-10 ${isTerminalNode ? 'text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-fuchsia-400 font-black animate-pulse' : isLegacy ? 'text-blue-500 font-bold' : isConstructing ? 'text-emerald-500 font-bold animate-pulse' : isGarbled ? 'text-red-800 font-black animate-glitch' : isTimeTrace ? 'text-indigo-400 font-black' : isTimeOriginVolume ? 'text-indigo-500 font-bold' : isCollabStarVolume ? 'text-purple-400 font-bold' : 'opacity-50'}`}>
                {isTerminalNode ? 'T-01' : isLegacy ? '!!' : isConstructing ? '>>' : isGarbled ? 'ERR' : isTimeTrace ? '<<' : String(index + 1).padStart(2, '0')}
            </div>
            
            <div className={`shrink-0 p-2 border transition-colors relative z-10 
                ${isTerminalNode ? 'bg-black/20 border-emerald-500 text-fuchsia-400' 
                : isLegacy ? 'bg-blue-950 border-blue-500 text-blue-500 animate-pulse' 
                : isConstructing ? 'bg-emerald-950/50 border-emerald-600 text-emerald-500 animate-[spin_3s_linear_infinite]' 
                : isGarbled ? 'bg-red-950 border-red-800 text-red-600 animate-[spin_2s_linear_infinite]' 
                : isTimeTrace ? 'bg-indigo-950/40 border-indigo-500 text-indigo-400' 
                : isLocked ? 'bg-transparent border-current opacity-50' 
                : isPBVolume ? (isLightTheme ? 'bg-black text-white border-black' : 'bg-white text-black border-white') // Inverted for PB
                : isTimeOriginVolume ? (isLightTheme ? 'bg-indigo-100 border-indigo-300 group-hover:bg-indigo-200' : 'bg-indigo-950/30 border-indigo-500/50 group-hover:border-indigo-400') 
                : isCollabStarVolume ? (isLightTheme ? 'bg-purple-100 border-purple-300' : 'bg-purple-950/30 border-purple-500/50 group-hover:border-cyan-400')
                : isLightTheme ? 'bg-zinc-100 border-zinc-200 group-hover:bg-zinc-800 group-hover:text-white group-hover:border-zinc-800' 
                : 'bg-ash-dark/50 border-ash-gray/30 group-hover:border-ash-light group-hover:bg-ash-light group-hover:text-ash-black'}`}>
                
                {isTerminalNode ? <StraightStar size={16} className="animate-spin-slow" /> : isLegacy ? <Star size={16} fill="currentColor" /> : isConstructing ? <Loader2 size={16} /> : isGarbled ? <XCircle size={16} /> : isTimeTrace ? <History size={16} /> : isLocked ? <Lock size={16} /> : isTimeOriginVolume ? <Clock size={16} /> : <FileText size={16} />}
            </div>
            
            <div className="flex-1 text-left relative overflow-hidden z-10">
                <div className={`font-bold font-mono text-sm md:text-base uppercase truncate ${isTerminalNode ? 'tracking-widest' : isLegacy ? 'glitch-text-heavy tracking-widest opacity-80' : isConstructing ? 'text-emerald-500 glitch-text-heavy' : isGarbled ? 'glitch-text-heavy text-red-500' : isTimeTrace ? 'italic tracking-wider' : ''}`} data-text={t.title}>{t.title}</div>
                <div className={`text-[10px] font-mono flex items-center gap-2 ${isTerminalNode ? 'text-emerald-600 font-bold' : isLegacy ? 'text-blue-500/70' : isConstructing ? 'text-emerald-600 font-bold' : isGarbled ? 'text-red-700 font-bold' : isTimeTrace ? 'text-indigo-500/80 font-bold' : isTimeOriginVolume ? 'text-indigo-400/80' : isCollabStarVolume ? 'text-purple-400/80' : 'opacity-50'}`}>
                    <span>{chapter.date}</span>
                    
                    {/* World Line Tag */}
                    {!isLocked && !isGarbled && !isConstructing && (
                        <span className={`px-1 rounded-sm border font-bold text-[8px] tracking-wider ${worldLineInfo.colorClass}`}>
                            {worldLineInfo.label}
                        </span>
                    )}

                    {isTerminalNode && <span className="font-bold border border-emerald-500/50 px-1 bg-gradient-to-r from-emerald-950/30 to-fuchsia-950/30 text-emerald-500">INTERACTIVE // SPECIAL</span>}
                    {chapter.mode === 'standard' && <span className={`font-bold border px-1 ${isLightTheme ? 'border-purple-300 bg-purple-50 text-purple-600' : 'border-purple-500/50 bg-purple-950/30 text-purple-400'}`}>{language === 'zh-TW' ? '強制文檔模式' : '强制文档模式'}</span>}
                    {isLegacy && <span className="font-bold border border-blue-500/50 px-1 bg-blue-950/30">LEGACY // CORRUPTED</span>}
                    {isConstructing && <span className="font-bold border border-emerald-500/50 px-1 bg-emerald-950/30 animate-pulse">BUILDING...</span>}
                    {isGarbled && !isConstructing && <span className="font-bold border border-red-500/50 px-1 bg-red-950/30 animate-pulse">CRITICAL_FAILURE</span>}
                    {isTimeTrace && <span className="font-bold border border-indigo-500/50 px-1 bg-indigo-950/30 text-indigo-400 animate-pulse">TIME_RETRACE // MEMORY</span>}
                </div>
            </div>
            {!isLocked && <div className="opacity-0 group-hover:opacity-100 transition-opacity z-10 relative"><ChevronRight size={16} /></div>}
        </button>
    );
};
