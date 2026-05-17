
import React, { useState } from 'react';
import { Chapter, Language } from '../../../types';
import Reveal from '../../Reveal';
import { Play, Monitor, Gamepad2 } from 'lucide-react';
import { ZeloRoomRPG } from '../minigames/ZeloRoomRPG';

interface StarObservationViewProps {
    language: Language;
    onSelectChapter: (index: number) => void;
    chapters: Chapter[]; 
}

export const StarObservationView: React.FC<StarObservationViewProps> = ({ chapters, language, onSelectChapter }) => {
    const [showRPG, setShowRPG] = useState(false);

    return (
        <div className="flex flex-col gap-6 relative pb-24 max-w-2xl mx-auto">
            {/* RPG Mini-Game Modal */}
            {showRPG && <ZeloRoomRPG onClose={() => setShowRPG(false)} language={language} />}

            {/* Star Trail Connector */}
            <div className={`absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent z-0`}></div>

            {chapters.map((chapter, index) => {
                const t = chapter.translations[language] || chapter.translations['zh-CN'];
                const isLocked = chapter.status === 'locked';
                
                // Calculate display index (ignoring sub-chapters)
                let displayIndex = 1;
                for (let i = 0; i < index; i++) {
                    if (!chapters[i].isSubChapter) {
                        displayIndex++;
                    }
                }
                const indexStr = chapter.isSubChapter ? `C-${String(displayIndex - 1).padStart(2, '0')}-EX` : `C-${String(displayIndex).padStart(2, '0')}`;

                return (
                    <Reveal key={chapter.id} delay={index * 150} className={`relative z-10 ${chapter.isSubChapter ? 'pl-24' : 'pl-16'}`}>
                        {/* Node Dot */}
                        <div className={`absolute ${chapter.isSubChapter ? 'left-[43px]' : 'left-[23px]'} top-8 w-3 h-3 rounded-full border-2 ${isLocked ? 'border-purple-900 bg-black' : 'border-cyan-400 bg-black shadow-[0_0_10px_#22d3ee] animate-pulse'} z-20`}></div>
                        
                        {/* Connector Line Horizontal */}
                        <div className={`absolute ${chapter.isSubChapter ? 'left-[48px]' : 'left-[28px]'} top-[38px] w-8 h-px ${isLocked ? 'bg-purple-900/30' : 'bg-cyan-500/30'}`}></div>

                        {/* Connector Line Vertical for Sub-Chapter */}
                        {chapter.isSubChapter && (
                            <div className={`absolute left-[27px] top-0 bottom-[calc(100%-38px)] w-px ${isLocked ? 'bg-purple-900/30' : 'bg-cyan-500/30'}`}></div>
                        )}
                        {chapter.isSubChapter && (
                            <div className={`absolute left-[27px] top-[38px] w-[16px] h-px ${isLocked ? 'bg-purple-900/30' : 'bg-cyan-500/30'}`}></div>
                        )}

                        <button
                            onClick={() => !isLocked && onSelectChapter(index)}
                            disabled={isLocked}
                            className={`
                                w-full text-left group relative overflow-hidden transition-all duration-500
                                border backdrop-blur-md ${chapter.isSubChapter ? 'p-4' : 'p-6'}
                                ${isLocked 
                                    ? 'border-purple-900/30 bg-black/40 opacity-50 cursor-not-allowed' 
                                    : 'border-purple-500/30 bg-[#120b1e]/60 hover:bg-[#1a102e]/80 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                                }
                            `}
                        >
                            {/* Decorative Background Glow on Hover */}
                            {!isLocked && (
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                            )}

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`${chapter.isSubChapter ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} font-black uppercase tracking-tight transition-colors ${isLocked ? 'text-purple-900' : 'text-purple-100 group-hover:text-cyan-200'}`}>
                                        {t.title}
                                    </div>
                                    <div className={`text-[10px] font-mono px-2 py-1 border ${isLocked ? 'border-purple-900/30 text-purple-900' : 'border-purple-500/30 text-purple-400 bg-black/20'}`}>
                                        {indexStr}
                                    </div>
                                </div>
                                
                                <div className={`text-xs md:text-sm font-mono line-clamp-2 ${isLocked ? 'text-purple-900/50' : 'text-purple-200/60'}`}>
                                    {t.summary || "NO_DATA"}
                                </div>

                                {/* Mode Hint - Chapter 1 (Forced) & Forced Standard Mode */}
                                {!isLocked && !chapter.isSubChapter && (
                                    <div className={`mt-3 flex items-center gap-2 text-[10px] font-mono border px-2 py-1 w-fit text-purple-300 border-purple-500/30 bg-purple-900/20`}>
                                        <Monitor size={10} />
                                        {chapter.mode === 'standard' ? (
                                            language === 'zh-TW' ? '提示：本章使用強制文檔模式' : '提示：本章使用强制文档模式'
                                        ) : chapter.id === 'story-collab-star-1' ? (
                                            language === 'en' ? 'NOTE: FORCED FULL VISUAL MODE' : '提示：本故事使用强制完全视觉模式'
                                        ) : (
                                            language === 'en' ? 'NOTE: ADAPTS TO READING PREFERENCE' : '提示：本章不强制完全视觉模式，适配您的偏好'
                                        )}
                                    </div>
                                )}

                                {/* Hover Reveal Action */}
                                {!isLocked && (
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <Play size={12} fill="currentColor" /> 
                                        {language === 'en' ? 'INITIATE_OBSERVATION' : '开始观测'}
                                    </div>
                                )}
                            </div>
                        </button>
                    </Reveal>
                );
            })}

            {/* Floating Gamepad Button (Bottom Left of the view) */}
            <div className="fixed bottom-24 right-6 md:right-12 z-40 animate-slide-in">
                <button 
                    onClick={() => setShowRPG(true)}
                    className="w-14 h-14 rounded-full bg-cyan-950/90 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center hover:scale-110 hover:bg-cyan-900 active:scale-95 transition-all group"
                    title="Enter Zelo's Room"
                >
                    <Gamepad2 size={28} className="group-hover:animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black"></div>
                </button>
            </div>
        </div>
    );
};
