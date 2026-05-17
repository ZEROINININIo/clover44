
import React, { useState, useEffect } from 'react';
import { SideStoryVolume, Language, GraphicsQuality } from '../../types';
import { ArrowLeft, Cpu, AlertTriangle, Database, GitCommit, CornerDownRight, GitGraph, List, Clock, ArrowDown, ChevronRight } from 'lucide-react';
import { StraightStar } from '../icons/StraightStar';
import Reveal from '../Reveal';

// Backgrounds
import { CollabStarBackground } from './backgrounds/CollabStarBackground';
import { MidnightBackground } from './backgrounds/MidnightBackground';
import { RainBackground } from './backgrounds/RainBackground';
import { GhostAnalysisBackground } from './backgrounds/GhostAnalysisBackground';
import { FirstStepBackground } from './backgrounds/FirstStepBackground';

// Views & Items
import { ChapterItem } from './items/ChapterItem';
import { TimelineView } from './views/TimelineView';
import { StarObservationView } from './views/StarObservationView';
import { GhostAnalysisView } from './views/GhostAnalysisView';
import { WordDocView } from './views/WordDocView';

interface SideStoryChapterListProps {
  volume: SideStoryVolume;
  onBack: () => void;
  onSelectChapter: (index: number) => void;
  onEnterExtra?: () => void; 
  onOpenTerminal?: (scriptId: string) => void;
  language: Language;
  graphicsQuality: GraphicsQuality;
}

const SideStoryChapterList: React.FC<SideStoryChapterListProps> = ({ volume, onBack, onSelectChapter, onEnterExtra, onOpenTerminal, language, graphicsQuality }) => {
  const isDailyVolume = volume.id === 'VOL_DAILY';
  const isTimeOriginVolume = volume.id === 'VOL_TIME_ORIGIN'; 
  const isPBVolume = volume.id === 'VOL_PB'; 
  const isCollabStarVolume = volume.id === 'VOL_COLLAB_STAR'; 
  const isMemoriesVolume = volume.id === 'VOL_MEMORIES';
  const isGhostAnalysisVolume = volume.id === 'VOL_GHOST_ANALYSIS';
  const isFirstStepVolume = volume.id === 'VOL_FIRST_STEP';

  // Default to timeline if it's the Daily volume, otherwise list
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>(isDailyVolume ? 'timeline' : 'list');

  // Ensure view resets to timeline when entering Daily volume
  useEffect(() => {
      if (isDailyVolume) {
          setViewMode('timeline');
      } else {
          setViewMode('list');
      }
  }, [volume.id, isDailyVolume]);

  const isVariableVolume = volume.id === 'VOL_VARIABLE';
  
  // Separate main chapters from extra chapters
  const mainChapters = isVariableVolume 
    ? volume.chapters.filter(c => c.id !== 'story-byaki-diary')
    : volume.chapters;
  
  const hasExtra = isVariableVolume && volume.chapters.some(c => c.id === 'story-byaki-diary');

  const extraTitle = {
    'zh-CN': '秘密日记',
    'zh-TW': '秘密日記',
    'en': 'SECRET_DIARY'
  }[language];

  const extraSummary = {
    'zh-CN': '▞▞▞ ▞▞▞ 0x76 0x6F 0x69 0x64 ▞▞▞ ▞▞▞',
    'zh-TW': '▞▞▞ ▞▞▞ 0x76 0x6F 0x69 0x64 ▞▞▞ ▞▞▞',
    'en': '▞▞▞ ▞▞▞ ERROR_RESIDUAL ▞▞▞ ▞▞▞'
  }[language];

  // Background Container Logic
  // If a dedicated background component exists (Rain, Midnight, Collab), use transparent bg
  const containerBg = isDailyVolume && viewMode === 'timeline' 
    ? 'bg-[#080810]' 
    : isTimeOriginVolume || isPBVolume || isCollabStarVolume || isMemoriesVolume || isGhostAnalysisVolume || isFirstStepVolume
        ? 'bg-transparent' // Let fixed background show
        : 'bg-halftone';

  return (
        <div className={`h-full overflow-y-auto p-4 md:p-12 relative flex flex-col items-center custom-scrollbar pb-24 transition-colors duration-500 ${containerBg}`}>
             
             {/* Background for Timeline Mode (Daily) */}
             {isDailyVolume && viewMode === 'timeline' && (
                 <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                     {/* Space Texture - Disable on Low */}
                     {graphicsQuality !== 'low' && (
                         <>
                            <div className={`absolute inset-0 opacity-20 bg-[url("https://www.transparenttextures.com/patterns/stardust.png")]`}></div>
                            
                            {/* Central Time Stream Spine */}
                            <div className="absolute top-0 bottom-0 left-8 md:left-1/2 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent -translate-x-1/2"></div>
                            
                            {/* Floating Particles */}
                            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] animate-pulse"></div>
                            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                         </>
                     )}
                     {graphicsQuality === 'low' && <div className="absolute inset-0 bg-[#080810]"></div>}
                 </div>
             )}

             {/* Background for Time Origin Volume */}
             {isTimeOriginVolume && (
                 <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                     {/* Deep Time Gradient */}
                     <div className={`absolute inset-0 opacity-30 bg-[#050510]`}></div>
                     
                     {/* Giant Rotating Clock Faces / Time Rings - Static on Low */}
                     {graphicsQuality !== 'low' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] opacity-10 text-indigo-500">
                            <div className="absolute inset-0 border border-current rounded-full animate-[spin_60s_linear_infinite]"></div>
                            <div className="absolute inset-12 border border-dashed border-current rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                            <div className="absolute inset-24 border-2 border-current rounded-full animate-[spin_100s_linear_infinite]"></div>
                        </div>
                     )}

                     {/* Floating Time Motes */}
                     {graphicsQuality !== 'low' && (
                        <div className="absolute top-0 left-0 w-full h-full">
                            {/* CSS-only particles */}
                            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                            <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
                            <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse"></div>
                        </div>
                     )}
                     
                     {/* Central Beam */}
                     <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent -translate-x-1/2"></div>
                 </div>
             )}

             {/* Background for Midnight 12:00 (PB) Volume */}
             {isPBVolume && <MidnightBackground quality={graphicsQuality} />}

             {/* Background for Collab Star Volume */}
             {isCollabStarVolume && <CollabStarBackground quality={graphicsQuality} />}
            
             {/* Background for Memories (Rain) Volume */}
             {isMemoriesVolume && <RainBackground quality={graphicsQuality} />}

             {/* Background for Ghost Analysis Volume */}
             {isGhostAnalysisVolume && <GhostAnalysisBackground quality={graphicsQuality} />}

             {/* Background for First Step Volume */}
             {isFirstStepVolume && <FirstStepBackground />}

             <div className="w-full max-w-4xl relative z-10 animate-fade-in mt-8 md:mt-0">
                {/* Header / Breadcrumb */}
                <div className={`flex flex-col md:flex-row md:items-center justify-between mb-8 border-b-2 pb-4 gap-4 backdrop-blur-sm rounded-lg p-4 ${isFirstStepVolume ? 'bg-white/90 border-gray-300 text-black' : isPBVolume ? 'bg-black/50 border-white' : isCollabStarVolume ? 'bg-[#0f0518]/60 border-purple-500/30' : isMemoriesVolume ? 'bg-[#082f49]/40 border-cyan-800' : isGhostAnalysisVolume ? 'bg-slate-900/40 border-slate-700' : 'bg-ash-black/5 border-ash-gray/30'}`}>
                     <div className="flex items-center gap-4">
                        <button 
                            onClick={onBack}
                            className={`p-2 border transition-all ${isFirstStepVolume ? 'border-gray-400 text-gray-600 hover:bg-gray-200 hover:text-black hover:border-gray-600' : isPBVolume ? 'border-current hover:bg-current hover:text-black' : isCollabStarVolume ? 'border-purple-400 text-purple-400 hover:bg-purple-500 hover:text-white' : isMemoriesVolume ? 'border-cyan-500 text-cyan-500 hover:bg-cyan-600 hover:text-white' : isGhostAnalysisVolume ? 'border-slate-500 text-slate-500 hover:bg-slate-600 hover:text-white' : 'border-ash-gray text-ash-gray hover:text-ash-light hover:border-ash-light hover:bg-ash-dark'}`}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className={`text-[10px] font-mono uppercase ${isFirstStepVolume ? 'text-gray-500' : isPBVolume ? 'opacity-60' : isCollabStarVolume ? 'text-purple-300/60' : isMemoriesVolume ? 'text-cyan-300/60' : isGhostAnalysisVolume ? 'text-slate-400/60' : 'text-ash-gray'}`}>ROOT / {volume.id}</div>
                            <h2 className={`text-2xl font-black uppercase tracking-tight ${isFirstStepVolume ? 'text-black' : isPBVolume ? '' : isCollabStarVolume ? 'text-purple-100 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]' : isMemoriesVolume ? 'text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]' : isGhostAnalysisVolume ? 'text-slate-100 drop-shadow-[0_0_10px_rgba(148,163,184,0.4)]' : 'text-ash-light'}`}>{language === 'en' ? volume.titleEn : volume.title}</h2>
                        </div>
                     </div>

                     {/* View Toggle for Daily Volume */}
                     {isDailyVolume && (
                         <div className="flex bg-ash-dark/30 border border-ash-gray/30 p-1 gap-1 self-start md:self-center rounded-sm">
                             <button 
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase transition-all ${viewMode === 'list' ? 'bg-ash-light text-ash-black shadow-sm' : 'text-ash-gray hover:text-ash-light'}`}
                             >
                                 <List size={14} />
                                 {language === 'en' ? 'LIST' : '列表'}
                             </button>
                             <button 
                                onClick={() => setViewMode('timeline')}
                                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase transition-all ${viewMode === 'timeline' ? 'bg-ash-light text-ash-black shadow-sm' : 'text-ash-gray hover:text-ash-light'}`}
                             >
                                 <GitGraph size={14} />
                                 {language === 'en' ? 'TIMELINE' : '时间线'}
                             </button>
                         </div>
                     )}

                     <div className="hidden md:block">
                         <Cpu size={24} className={`${isFirstStepVolume ? 'text-gray-400' : isPBVolume ? (graphicsQuality !== 'low' ? 'animate-spin-slow' : '') : isCollabStarVolume ? 'text-purple-400 animate-pulse' : isMemoriesVolume ? 'text-cyan-400 animate-pulse' : isGhostAnalysisVolume ? 'text-slate-400 animate-pulse' : 'text-ash-dark animate-pulse'}`} />
                     </div>
                </div>

                {/* Relationship Notice for Memories Volume */}
                {isMemoriesVolume && (
                    <Reveal>
                        <div className={`mb-6 p-3 border-l-4 text-xs md:text-sm font-bold flex items-start gap-3 backdrop-blur-sm bg-amber-950/40 border-amber-500 text-amber-500`}>
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            <span>
                                {language === 'en' 
                                    ? "OFFICIAL_NOTE: Dusk and Point are NOT lovers! It's a sibling-like bond. Don't get the wrong idea!" 
                                    : language === 'zh-TW'
                                        ? "官方提示：暮雨和零點不是戀人關係！是類似於兄妹的關係，不要想到那邊去啊！"
                                        : "官方提示：暮雨和零点不是恋人关系！是类似于兄妹的关系，不要想到那边去啊！"
                                }
                            </span>
                        </div>
                    </Reveal>
                )}

                {/* Notice for Daily Volume */}
                {isDailyVolume && (
                    <Reveal>
                        <div className={`mb-6 p-3 border-l-4 text-xs md:text-sm font-bold flex items-start gap-3 backdrop-blur-sm bg-blue-950/40 border-blue-500 text-blue-400`}>
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            <span>
                                {language === 'en' 
                                    ? "NOTE: This series consists of Timeline Daily chapters attached to the main storyline. Except for the Analysis Sector part, it may be updated permanently, until I....." 
                                    : language === 'zh-TW'
                                        ? "提示：本系列為主線附屬時域日常，除析界部分外，可能會永久進行更新，直到我....."
                                        : "提示：本系列为主线附属时域日常，除析界部分外，可能会永久进行更新，直到我....."
                                }
                            </span>
                        </div>
                    </Reveal>
                )}

                {/* === TIMELINE VIEW (Daily Volume Only) === */}
                {isDailyVolume && viewMode === 'timeline' ? (
                    <TimelineView 
                        volume={volume}
                        language={language}
                        onSelectChapter={onSelectChapter}
                    />
                ) : isCollabStarVolume ? (
                    /* === COLLAB STAR OBSERVATION VIEW === */
                    <StarObservationView 
                        chapters={mainChapters}
                        language={language}
                        onSelectChapter={onSelectChapter}
                    />
                ) : isGhostAnalysisVolume ? (
                    /* === GHOST ANALYSIS FRAGMENTED VIEW === */
                    <GhostAnalysisView 
                        chapters={mainChapters}
                        language={language}
                        onSelectChapter={onSelectChapter}
                    />
                ) : isFirstStepVolume ? (
                    /* === WORD DOC VIEW (First Step) === */
                    <WordDocView 
                        chapters={mainChapters}
                        language={language}
                        onSelectChapter={onSelectChapter}
                        volume={volume}
                    />
                ) : (
                    /* === LIST VIEW (Standard) === */
                    <div className="flex flex-col w-full max-w-2xl mx-auto">
                        {mainChapters.map((chapter, index) => {
                            // Find actual index in original volume if mainChapters is filtered
                            const realIndex = volume.chapters.findIndex(c => c.id === chapter.id);
                            
                            // Check if this chapter connects to the next one visually (Standard flow)
                            const isLast = index === mainChapters.length - 1;
                            
                            // Special check for sub-chapter visual flow (e.g. Variable Volume T-01)
                            // If the NEXT chapter is a sub-chapter (T-01), we don't want a centered arrow,
                            // because T-01 has a specific L-shape connector in renderChapterButton.
                            const nextChapter = mainChapters[index + 1];
                            const isNextSubChapter = nextChapter?.id === 'special-terminal-discovery' && chapter.id === 'story-variable-home';
                            const isConnectedSubChapter = !isDailyVolume && chapter.id === 'special-terminal-discovery';

                            return (
                                <div key={chapter.id} className="flex flex-col items-center w-full">
                                    <div className="w-full relative z-10">
                                        <Reveal delay={index * 50}>
                                            {isConnectedSubChapter && (
                                                <div className="flex items-end h-6 ml-6 -mt-3 mb-0 relative z-0">
                                                    <div className="w-px h-full bg-emerald-500/30 border-l-2 border-dashed border-emerald-500/30"></div>
                                                    <div className="w-6 h-px bg-emerald-500/30 border-t-2 border-dashed border-emerald-500/30 mb-3"></div>
                                                    <CornerDownRight size={14} className="text-emerald-500/50 mb-1.5 -ml-1" />
                                                </div>
                                            )}
                                            <ChapterItem 
                                                chapter={chapter}
                                                index={realIndex}
                                                volumeId={volume.id}
                                                onSelect={onSelectChapter}
                                                language={language}
                                                isConnectedSubChapter={isConnectedSubChapter}
                                            />
                                        </Reveal>
                                    </div>
                                    
                                    {!isLast && !isNextSubChapter && (
                                        <div className="h-8 flex flex-col items-center justify-center relative my-1 opacity-50">
                                            {/* Vertical Line */}
                                            <div className={`w-px h-full bg-ash-gray/20`}></div>
                                            {/* Arrow Head */}
                                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 rounded-full border bg-ash-black border-ash-gray/30 text-ash-gray`}>
                                                <ArrowDown size={10} className="animate-bounce" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Independent Extra Entry Point */}
                {hasExtra && (
                    <div className="mt-16 animate-slide-in">
                        <div className="flex items-center gap-2 mb-6 opacity-60">
                             <div className="h-px bg-ash-gray flex-1"></div>
                             <div className="text-[10px] font-black font-mono text-ash-gray uppercase tracking-[0.3em] flex items-center gap-2">
                                <div className="flex -space-x-1">
                                    <AlertTriangle size={14} className="text-fuchsia-600 animate-pulse" />
                                    <StraightStar size={14} className="text-emerald-600 animate-ping" />
                                </div>
                                DUALITY_SECTOR // FUSION
                             </div>
                             <div className="h-px bg-ash-gray flex-1"></div>
                        </div>

                        <Reveal>
                            <button
                                onClick={onEnterExtra}
                                className={`
                                    w-full flex items-center gap-6 p-6 border-2 transition-all duration-500 group relative overflow-hidden
                                    bg-fuchsia-950/10 border-fuchsia-900/50 text-fuchsia-200 shadow-lg hover:border-emerald-500 hover:bg-emerald-950/20
                                `}
                            >
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHRleHQgeD0iMCIgeT0iMjAiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iY3VycmVudENvbG9yIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBvcGFjaXR5PSIwLjMiPkVSUk9SPC90ZXh0Pjwvc3ZnPg==')]"></div>

                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-fuchsia-600 to-emerald-600 animate-pulse"></div>
                                
                                <div className="shrink-0 relative">
                                    <Database size={32} strokeWidth={1} className="text-fuchsia-800 group-hover:text-emerald-500 transition-colors" />
                                    <GitCommit size={14} className="absolute -top-1 -right-1 text-emerald-500 animate-pulse" />
                                </div>

                                <div className="flex-1 text-left">
                                    <div className="text-[9px] font-black font-mono text-fuchsia-500 mb-1 tracking-tighter uppercase flex items-center gap-1">
                                        <span className="animate-pulse">[ACCESS_ST.1_FRAGMENTS]</span>
                                        <span className="text-emerald-500">// SYNC: EVOLVING</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-ash-light drop-shadow-[0_0_8px_rgba(192,38,211,0.2)] group-hover:translate-x-1 transition-transform group-hover:text-emerald-400">
                                        {extraTitle}
                                    </h3>
                                    <p className="text-[10px] md:text-xs font-mono opacity-60 mt-1 italic">
                                        {extraSummary}
                                    </p>
                                </div>

                                <div className="shrink-0 flex items-center justify-center p-2 border border-fuchsia-500/30 group-hover:border-emerald-500/80 transition-all">
                                    <ChevronRight size={20} className="text-fuchsia-500 group-hover:text-emerald-500 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        </Reveal>
                        
                        <div className="mt-8 text-center">
                             <p className="text-[8px] font-mono text-ash-gray uppercase tracking-widest opacity-40">
                                Warning: st.1 data interference detected. Do not interfere with origin timeline.
                             </p>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
};

export default SideStoryChapterList;
