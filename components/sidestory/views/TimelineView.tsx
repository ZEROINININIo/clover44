
import React, { useState } from 'react';
import { TIMELINE_GROUPS } from '../../../data/timelineData';
import { Language, SideStoryVolume } from '../../../types';
import Reveal from '../../Reveal';
import { ChevronsDown, X, ShieldAlert, EyeOff, CornerDownRight } from 'lucide-react';
import { ChapterItem } from '../items/ChapterItem';

interface TimelineViewProps {
    volume: SideStoryVolume;
    language: Language;
    onSelectChapter: (index: number) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ volume, language, onSelectChapter }) => {
    const [activePhase, setActivePhase] = useState<string | null>(null);
    const [spoilerWarning, setSpoilerWarning] = useState<string | null>(null);

    const getActiveGroup = () => TIMELINE_GROUPS.find(g => g.id === activePhase);

    const handlePhaseSelect = (groupId: string) => {
        // Configuration for phases that require spoiler warnings
        const SPOILER_PHASES = ['phase-2'];
  
        if (SPOILER_PHASES.includes(groupId)) {
            // Check local storage for existing acknowledgement
            const cacheKey = `nova_spoiler_ack_${groupId}`;
            const hasAck = localStorage.getItem(cacheKey);
            
            if (!hasAck) {
                setSpoilerWarning(groupId);
                return;
            }
        }
        
        // Proceed if no warning needed or already acknowledged
        setActivePhase(groupId);
    };
  
    const confirmSpoiler = () => {
        if (spoilerWarning) {
            // Save acknowledgement to local storage
            localStorage.setItem(`nova_spoiler_ack_${spoilerWarning}`, 'true');
            
            setActivePhase(spoilerWarning);
            setSpoilerWarning(null);
        }
    };

    return (
        <div className="relative py-8 max-w-4xl mx-auto flex flex-col gap-16 md:gap-24">
            
            {/* Interactive Phase Nodes */}
            {TIMELINE_GROUPS.map((group, groupIndex) => {
                const isLeft = groupIndex % 2 === 0;
                return (
                    <Reveal key={group.id} delay={groupIndex * 150} className={`relative flex items-center ${isLeft ? 'md:justify-start' : 'md:justify-end'} pl-16 md:pl-0`}>
                        
                        {/* Timeline Node Icon (Centered on Spine) */}
                        <button 
                            onClick={() => handlePhaseSelect(group.id)}
                            className={`
                                absolute left-8 md:left-1/2 -translate-x-1/2 z-20 w-12 h-12 md:w-16 md:h-16 rounded-full border-4 transition-all duration-300 group/node
                                flex items-center justify-center bg-ash-black
                                ${group.borderColor} ${group.color} hover:scale-110 hover:shadow-[0_0_30px_currentColor]
                            `}
                        >
                            <group.icon size={24} className="group-hover/node:animate-pulse" />
                            {/* Pulse Ring */}
                            <div className={`absolute inset-0 rounded-full border border-current opacity-30 animate-ping`}></div>
                        </button>

                        {/* Connector Line */}
                        <div className={`absolute top-1/2 h-0.5 bg-current opacity-30 w-8 md:w-24 ${isLeft ? 'left-8 md:left-[50%]' : 'left-8 md:right-[50%] md:left-auto'} ${group.color}`}></div>

                        {/* Card Content */}
                        <button 
                            onClick={() => handlePhaseSelect(group.id)}
                            className={`
                                w-full md:w-[42%] text-left relative overflow-hidden group/card
                                p-6 border-l-4 ${group.borderColor}
                                bg-gradient-to-r ${group.bgGradient} to-transparent
                                backdrop-blur-md shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl
                                ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}
                                ${group.id === 'phase-0' ? 'animate-pulse-slow border-dashed opacity-80 hover:opacity-100' : ''}
                            `}
                        >
                            {/* Shatter/Glitch overlay for phase-0 */}
                            {group.id === 'phase-0' && (
                                <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay opacity-30 group-hover/card:opacity-50 transition-opacity">
                                    <div className="absolute top-0 left-1/4 w-px h-full bg-white transform rotate-12 translate-x-4"></div>
                                    <div className="absolute top-1/3 left-0 w-full h-px bg-white transform -rotate-6 -translate-y-2"></div>
                                    <div className="absolute top-1/2 right-1/4 w-px h-full bg-white transform -rotate-12 -translate-x-8"></div>
                                    <div className="absolute bottom-1/4 left-0 w-full h-px bg-white transform rotate-3 translate-y-4"></div>
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-difference"></div>
                                </div>
                            )}

                            <div className={`absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover/card:scale-150 transition-transform duration-700 ${group.id === 'phase-0' ? 'animate-spin-slow' : ''}`}>
                                <group.icon size={100} />
                            </div>

                            <div className={`text-xs font-black uppercase tracking-widest mb-1 opacity-70 ${group.color} ${group.id === 'phase-0' ? 'glitch-text-heavy' : ''}`} data-text={`PHASE_0${groupIndex + 1}`}>
                                PHASE_0{groupIndex + 1}
                            </div>
                            <h3 className={`text-lg md:text-2xl font-black font-mono uppercase tracking-tight mb-2 text-ash-light group-hover/card:text-white transition-colors ${group.id === 'phase-0' ? 'blur-[0.5px]' : ''}`}>
                                {group.label[language] || group.label['en']}
                            </h3>
                            <p className={`text-xs md:text-sm font-mono opacity-60 flex items-center gap-2 ${group.id === 'phase-0' ? 'italic' : ''}`}>
                                <CornerDownRight size={12} />
                                {group.subLabel[language] || group.subLabel['en']}
                            </p>
                            <div className={`mt-4 text-[10px] font-bold border border-current px-2 py-1 inline-block opacity-50 group-hover/card:opacity-100 transition-opacity uppercase ${group.id === 'phase-0' ? 'border-dashed' : ''}`}>
                                {group.chapterIds.length} RECORDS DETECTED
                            </div>
                        </button>
                    </Reveal>
                );
            })}

            {/* Bottom Anchor */}
            <div className="absolute -bottom-12 left-8 md:left-1/2 -translate-x-1/2 text-ash-gray/20 animate-bounce">
                <ChevronsDown size={24} />
            </div>

            {/* === SUSPENDED MODAL (CHAPTER LIST) === */}
            {activePhase && getActiveGroup() && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setActivePhase(null)}>
                    <div 
                        className={`
                            w-full max-w-2xl max-h-[80vh] flex flex-col relative overflow-hidden shadow-2xl animate-zoom-in-fast
                            bg-[#0a0a0a]/90 border-ash-gray/20
                            border-2 backdrop-blur-md
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className={`p-6 border-b flex justify-between items-start shrink-0 border-ash-gray/20 bg-ash-dark/50`}>
                            <div>
                                <div className={`text-xs font-black uppercase tracking-widest mb-1 opacity-70 ${getActiveGroup()?.color}`}>
                                    TIMELINE_NODE // {activePhase.toUpperCase()}
                                </div>
                                <h2 className={`text-xl md:text-2xl font-black font-mono uppercase text-ash-light`}>
                                    {getActiveGroup()?.label[language] || getActiveGroup()?.label['en']}
                                </h2>
                            </div>
                            <button 
                                onClick={() => setActivePhase(null)}
                                className={`p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${getActiveGroup()?.color}`}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content (Chapters) */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-3 bg-halftone">
                            {getActiveGroup()?.chapterIds.map((chapterId, idx) => {
                                // Find the original index in the volume
                                const originalIndex = volume.chapters.findIndex(c => c.id === chapterId);
                                if (originalIndex === -1) return null;
                                const chapter = volume.chapters[originalIndex];

                                return (
                                    <div key={chapterId} className="animate-slide-in" style={{ animationDelay: `${idx * 50}ms` }}>
                                        <ChapterItem 
                                            chapter={chapter}
                                            index={originalIndex}
                                            volumeId={volume.id}
                                            onSelect={onSelectChapter}
                                            language={language}
                                            isTimelineNode={true}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Modal Footer */}
                        <div className={`p-3 text-[10px] font-mono text-center opacity-50 uppercase bg-black text-ash-gray`}>
                            SECURE_CONNECTION // {getActiveGroup()?.id}
                        </div>
                    </div>
                </div>
            )}

            {/* === SPOILER WARNING MODAL === */}
            {spoilerWarning && (
                <div className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in" onClick={() => setSpoilerWarning(null)}>
                    <div className="max-w-md w-full border-4 border-red-600 bg-black p-8 relative shadow-[0_0_50px_rgba(220,38,38,0.5)]" onClick={e => e.stopPropagation()}>
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,0,0,0.05)_10px,rgba(255,0,0,0.05)_20px)] pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-red-600"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-red-600"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-red-600"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-red-600"></div>

                        <ShieldAlert size={64} className="text-red-500 mx-auto mb-6 animate-pulse" />
                        
                        <h2 className="text-2xl md:text-3xl font-black text-red-500 uppercase tracking-widest mb-4 glitch-text-heavy" data-text="SPOILER WARNING">
                            {language === 'en' ? 'SPOILER WARNING' : '严重剧透警告'}
                        </h2>
                        
                        <div className="text-red-200 font-mono text-sm md:text-base leading-relaxed mb-8 space-y-4">
                            <p>
                                {language === 'en' 
                                    ? 'This section (P-02) contains major spoilers for the "Midnight 12:00" arc.' 
                                    : language === 'zh-TW'
                                        ? '該階段 (P-02) 包含「午夜十二時」支線的核心劇透。'
                                        : '该阶段 (P-02) 包含“午夜十二时”支线的核心剧透。'}
                            </p>
                            <p className="font-bold bg-red-900/30 p-2 border border-red-800 flex items-center justify-center gap-2">
                                <EyeOff size={16} />
                                {language === 'en' 
                                    ? 'Strongly recommended to read "Midnight 12:00" (PB Series) first.' 
                                    : language === 'zh-TW'
                                        ? '強烈建議先閱讀 [午夜十二時] (PB系列) 章節。'
                                        : '强烈建议先阅读 [午夜十二时] (PB系列) 章节。'}
                            </p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4 relative z-10">
                            <button 
                                onClick={() => setSpoilerWarning(null)}
                                className="flex-1 py-3 border-2 border-red-500 text-red-500 font-bold uppercase hover:bg-red-500 hover:text-black transition-all"
                            >
                                {language === 'en' ? 'RETURN' : '返回'}
                            </button>
                            <button 
                                onClick={confirmSpoiler}
                                className="flex-1 py-3 bg-red-900/50 border-2 border-red-800 text-red-400 font-bold uppercase hover:bg-red-800 hover:text-white transition-all text-xs"
                            >
                                {language === 'en' ? 'I HAVE READ IT / PROCEED' : '我已阅读 / 继续'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
