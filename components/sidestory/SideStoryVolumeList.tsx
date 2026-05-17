
import React, { useState, useEffect } from 'react';
import { SideStoryVolume, Language } from '../../types';
import { Lock, AlertTriangle, HardDrive, VenetianMask, Star, Sparkles, CloudRain, Radio, Zap, GitBranch, Link, Clock, Eye, Infinity, Key, Terminal, FileWarning, Cpu } from 'lucide-react';
import { NovaFolder } from '../icons/NovaIcons';
import Reveal from '../Reveal';
import { hasRead } from '../../utils/readStatus';

interface SideStoryVolumeListProps {
  volumes: SideStoryVolume[];
  onSelectVolume: (volume: SideStoryVolume) => void;
  onOpenCharModal: () => void;
  onOpenTerminal: () => void;
  language: Language;
}

// Inline SVG for the specific Four Point Star requirement
const FourPointStarIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M50 0 C55 35 65 45 100 50 C65 55 55 65 50 100 C45 65 35 55 0 50 C35 45 45 35 50 0 Z" />
    </svg>
);

// Inline SVG for Four Leaf Clover
const FourLeafCloverIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M50,50 C40,20 10,20 10,40 C10,60 40,50 50,50 Z" />
        <path d="M50,50 C80,40 80,10 60,10 C40,10 50,40 50,50 Z" />
        <path d="M50,50 C60,80 90,80 90,60 C90,40 60,50 50,50 Z" />
        <path d="M50,50 C20,60 20,90 40,90 C60,90 50,60 50,50 Z" />
        <path d="M50,50 L40,80 C38,85 45,95 50,90 L50,50 Z" fillOpacity="0.5" />
    </svg>
);

// Animated Status Component for First Step
const ChangingSTStatus = () => {
    const [num, setNum] = useState(1);
    useEffect(() => {
        const interval = setInterval(() => {
            setNum(prev => (prev % 9) + 1);
        }, 120);
        return () => clearInterval(interval);
    }, []);
    return <span className="font-black drop-shadow-[0_0_5px_currentColor] animate-pulse">ST.{num}</span>;
};

const SideStoryVolumeList: React.FC<SideStoryVolumeListProps> = ({ volumes, onSelectVolume, onOpenCharModal, onOpenTerminal, language }) => {
  const [showPrereqModal, setShowPrereqModal] = useState(false);
  const [showFirstStepPrereqModal, setShowFirstStepPrereqModal] = useState(false);
  const [showFirstStepPasswordModal, setShowFirstStepPasswordModal] = useState(false);
  const [firstStepPasswordInput, setFirstStepPasswordInput] = useState('');
  const [firstStepPasswordError, setFirstStepPasswordError] = useState(false);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [debugInput, setDebugInput] = useState('');
  const [debugError, setDebugError] = useState(false);
  const [showSpoilerModal, setShowSpoilerModal] = useState(false);
  const [pendingVolume, setPendingVolume] = useState<SideStoryVolume | null>(null);

  // Grouping Logic - Updated to remove Origin/Variable since they are in PrequelPage now
  const groups = {
      // Current Timeline: PB (Midnight) is priority, then Daily
      current: volumes.filter(v => ['VOL_PB', 'VOL_GHOST_ANALYSIS', 'VOL_DAILY'].includes(v.id)),
      // Main Story Expansion: Memories (Rain) + Collab Star + Collab Half 44
      expansion: volumes.filter(v => ['VOL_MEMORIES', 'VOL_COLLAB_STAR', 'VOL_COLLAB_HALF_44'].includes(v.id)),
      firststep: volumes.filter(v => ['VOL_FIRST_STEP'].includes(v.id))
  };

  // Helper to determine Priority Label
  const getPriorityLabel = (id: string) => {
      if (id === 'VOL_PB') return 'PR_00 [SINGULARITY]';
      if (id === 'VOL_GHOST_ANALYSIS') return 'PR_01 [GHOST]';
      if (id === 'VOL_DAILY') return 'PR_02';
      if (id === 'VOL_MEMORIES') return 'PR_SP [EXT]';
      if (id === 'VOL_COLLAB_STAR') return 'PR_SP [LINK]';
      if (id === 'VOL_COLLAB_HALF_44') return 'PR_SP [LINK_B]';
      if (id === 'VOL_FIRST_STEP') return 'PR_OC [MYTHOS]';
      return `PR_NULL`; 
  };

  // Helper for Badge Text translation
  const getBadgeText = (id: string, lang: Language) => {
      if (id === 'VOL_MEMORIES') {
          if (lang === 'zh-CN') return '主线扩展';
          if (lang === 'zh-TW') return '主線擴展';
          return 'STORY_EXPANSION';
      }
      if (id === 'VOL_PB') {
          if (lang === 'zh-CN') return '必须观测';
          if (lang === 'zh-TW') return '必須觀測';
          return 'MUST_OBSERVE';
      }
      if (id === 'VOL_GHOST_ANALYSIS') {
          if (lang === 'zh-CN') return '异常扰动';
          if (lang === 'zh-TW') return '異常擾動';
          return 'ANOMALY_DETECTED';
      }
      if (id === 'VOL_DAILY') {
          if (lang === 'zh-CN') return '信号不稳定';
          if (lang === 'zh-TW') return '信號不穩定';
          return 'SIGNAL_UNSTABLE';
      }
      if (id === 'VOL_COLLAB_STAR' || id === 'VOL_COLLAB_HALF_44') {
          if (lang === 'zh-CN') return '联动收录';
          if (lang === 'zh-TW') return '聯動收錄';
          return 'COLLAB_EVENT';
      }
      if (id === 'VOL_FIRST_STEP') {
          if (lang === 'zh-CN') return '迷雾封存';
          if (lang === 'zh-TW') return '迷霧封存';
          return 'OBSCURED_DATA';
      }
      return '';
  };

  // Helper to get decorative series letter
  const getSeriesLetter = (id: string) => {
      switch(id) {
          case 'VOL_DAILY': return 'X';
          case 'VOL_MEMORIES': return 'S';
          case 'VOL_PB': return 'PB';
          case 'VOL_COLLAB_STAR': return 'C';
          case 'VOL_GHOST_ANALYSIS': return 'G';
          case 'VOL_FIRST_STEP': return 'F';
          default: return '';
      }
  };

  // Check if A003 and F-014 have been read using the new read status system
  const checkPrerequisite = () => {
      let isA003Read = hasRead('story-rematerialization');
      let isF014Read = hasRead('story-variable-end'); // F-014

      if (!isA003Read || !isF014Read) {
          try {
              const history = JSON.parse(localStorage.getItem('nova_history') || '[]');
              if (!isA003Read) isA003Read = history.some((h: any) => h.chapterId === 'story-rematerialization');
              if (!isF014Read) isF014Read = history.some((h: any) => h.chapterId === 'story-variable-end');
          } catch {
              // fail silently
          }
      }
      
      return isA003Read && isF014Read;
  };

  const checkG006Prerequisite = () => {
      let isG006Read = hasRead('story-ghost-analysis-6');

      if (!isG006Read) {
          try {
              const history = JSON.parse(localStorage.getItem('nova_history') || '[]');
              if (!isG006Read) isG006Read = history.some((h: any) => h.chapterId === 'story-ghost-analysis-6');
          } catch {
              // fail silently
          }
      }
      
      return isG006Read;
  };

  const handleVolumeClick = (volume: SideStoryVolume) => {
      if (volume.id === 'VOL_PB') {
          if (!checkPrerequisite()) {
              setShowPrereqModal(true);
              return;
          }
      }
      
      if (volume.id === 'VOL_FIRST_STEP') {
          const isPasswordEntered = localStorage.getItem('nova_first_step_password_entered') === 'true';
          if (!isPasswordEntered) {
              setPendingVolume(volume);
              setShowFirstStepPasswordModal(true);
              return;
          }

          const hasSeenSpoilerWarning = localStorage.getItem('nova_first_step_spoiler_warning_seen') === 'true';
          if (!hasSeenSpoilerWarning) {
              setPendingVolume(volume);
              setShowSpoilerModal(true);
              return;
          }
      }
      
      onSelectVolume(volume);
  };

  const handleFirstStepPasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (firstStepPasswordInput === '441/2') {
          localStorage.setItem('nova_first_step_password_entered', 'true');
          setShowFirstStepPasswordModal(false);
          setFirstStepPasswordInput('');
          if (pendingVolume) {
              const hasSeenSpoilerWarning = localStorage.getItem('nova_first_step_spoiler_warning_seen') === 'true';
              if (!hasSeenSpoilerWarning) {
                  setShowSpoilerModal(true);
              } else {
                  onSelectVolume(pendingVolume);
              }
          }
      } else {
          setFirstStepPasswordError(true);
          setTimeout(() => setFirstStepPasswordError(false), 800);
      }
  };

  const handleDebugSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (debugInput === '202602') {
          const vol = volumes.find(v => v.id === 'VOL_COLLAB_STAR');
          if (vol) {
              onSelectVolume(vol);
              setShowDebugModal(false);
              setDebugInput('');
          }
      } else {
          setDebugError(true);
          setTimeout(() => setDebugError(false), 800);
      }
  };

  const renderVolumeCard = (volume: SideStoryVolume, index: number) => {
      const isFirstStep = volume.id === 'VOL_FIRST_STEP';
      const isPasswordEntered = typeof window !== 'undefined' && localStorage.getItem('nova_first_step_password_entered') === 'true';
      const isFirstStepVisuallyLocked = isFirstStep && !isPasswordEntered;
      const isLocked = volume.status === 'locked' || (isFirstStep && !checkG006Prerequisite());
      const isCorrupted = volume.status === 'corrupted';
      const isMemories = volume.id === 'VOL_MEMORIES';
      const isPB = volume.id === 'VOL_PB';
      const isGhostAnalysis = volume.id === 'VOL_GHOST_ANALYSIS';
      const isDaily = volume.id === 'VOL_DAILY';
      const isCollabStar = volume.id === 'VOL_COLLAB_STAR';
      const isCollabHalf44 = volume.id === 'VOL_COLLAB_HALF_44';
      
      const priorityLabel = getPriorityLabel(volume.id);
      const badgeText = getBadgeText(volume.id, language);
      const seriesLetter = getSeriesLetter(volume.id);

      // --- PB Special Styling (Midnight 12:00) ---
      if (isPB) {
          return (
            <Reveal key={volume.id} delay={0} className="w-full md:col-span-3 mb-8 relative z-30">
                <button
                    onClick={() => handleVolumeClick(volume)}
                    className={`
                        w-full relative group overflow-hidden transition-all duration-700
                        bg-black text-white shadow-[0_0_60px_-15px_rgba(255,255,255,0.6)] border-white
                        border-4 hover:scale-[1.01] hover:shadow-[0_0_80px_-10px_rgba(255,255,255,0.8)]
                    `}
                    style={{ minHeight: '320px' }}
                >
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] animate-[shift_0.2s_infinite]"></div>
                    </div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-[6px] border-l-[6px] border-white z-20 group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[6px] border-r-[6px] border-white z-20 group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none overflow-hidden opacity-10">
                        <div className="text-[150px] md:text-[250px] font-black leading-none tracking-tighter uppercase whitespace-nowrap animate-glitch opacity-50">
                            MIDNIGHT
                        </div>
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 md:p-12 space-y-6">
                        <div className="flex items-center gap-3 bg-white text-black px-4 py-1 font-black font-mono text-xs md:text-sm tracking-[0.2em] border-2 border-white animate-pulse">
                            <AlertTriangle size={16} />
                            {getBadgeText(volume.id, language)}
                            <AlertTriangle size={16} />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter glitch-text-heavy bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" data-text={language === 'en' ? volume.titleEn : volume.title}>
                                {language === 'en' ? volume.titleEn : volume.title}
                            </h2>
                            <div className="h-px w-32 md:w-64 bg-white mx-auto my-4 group-hover:w-full transition-all duration-700"></div>
                            <p className="font-mono text-xs md:text-sm tracking-[0.5em] text-gray-400 uppercase">
                                {language === 'en' ? 'ZERO POINT PROTOCOL' : '零点协议 // 核心回溯'}
                            </p>
                        </div>
                        <div className="flex items-center gap-8 mt-4 opacity-80">
                            <Clock size={24} className="animate-spin-slow" />
                            <Infinity size={32} />
                            <Eye size={24} className="animate-pulse" />
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-mono text-[10px] text-gray-500">
                            <div className="flex flex-col items-start">
                                <span>PRIORITY: ALPHA-0</span>
                                <span>SIZE: UNQUANTIFIABLE</span>
                            </div>
                            <div className="flex items-center gap-2 text-white animate-pulse">
                                <span>CLICK_TO_DIVE</span>
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-white mix-blend-difference opacity-0 group-hover:opacity-10 transition-opacity duration-100 pointer-events-none"></div>
                </button>
            </Reveal>
          );
      }

      // --- Ghost Analysis Special Styling ---
      if (isGhostAnalysis) {
          return (
            <Reveal key={volume.id} delay={150} className="w-full md:col-span-3 mb-8 relative z-30">
                <button
                    onClick={() => handleVolumeClick(volume)}
                    className={`
                        w-full relative group overflow-hidden transition-all duration-700
                        bg-slate-950 text-slate-100 shadow-[0_0_60px_-15px_rgba(100,116,139,0.4)] border-slate-500/50
                        border-4 hover:scale-[1.01] hover:shadow-[0_0_80px_-10px_rgba(100,116,139,0.6)]
                    `}
                    style={{ minHeight: '320px' }}
                >
                    {/* Background Fragmented Effect */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')]"></div>
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/20 animate-pulse"></div>
                    </div>
                    
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-[6px] border-l-[6px] border-slate-400 z-20 group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[6px] border-r-[6px] border-slate-400 z-20 group-hover:w-24 group-hover:h-24 transition-all duration-300"></div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none overflow-hidden opacity-5">
                        <div className="text-[150px] md:text-[250px] font-black leading-none tracking-tighter uppercase whitespace-nowrap animate-pulse">
                            GHOST_SEC
                        </div>
                    </div>

                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 md:p-12 space-y-6">
                        <div className="flex items-center gap-3 bg-slate-800 text-slate-200 px-4 py-1 font-black font-mono text-xs md:text-sm tracking-[0.2em] border border-slate-500 animate-pulse">
                            <Cpu size={16} />
                            {getBadgeText(volume.id, language)}
                            <Cpu size={16} />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-100 via-slate-300 to-slate-600 drop-shadow-[0_0_15px_rgba(148,163,184,0.5)]">
                                {language === 'en' ? volume.titleEn : volume.title}
                            </h2>
                            <div className="h-px w-32 md:w-64 bg-slate-500 mx-auto my-4 group-hover:w-full transition-all duration-700"></div>
                            <p className="font-mono text-xs md:text-sm tracking-[0.5em] text-slate-400 uppercase">
                                {language === 'en' ? 'ANALYSIS SECTOR FRAGMENT' : '析界节区 // 异常数据片段'}
                            </p>
                        </div>
                        <div className="flex items-center gap-8 mt-4 opacity-80 text-slate-400">
                            <Cpu size={24} className="animate-pulse" />
                            <GitBranch size={32} />
                            <Terminal size={24} className="animate-pulse" />
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end font-mono text-[10px] text-slate-500">
                            <div className="flex flex-col items-start">
                                <span>SECTOR: ANALYSIS_04</span>
                                <span>STATUS: FRAGMENTED</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300 animate-pulse">
                                <span>INITIATE_RECOVERY</span>
                                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </button>
            </Reveal>
          );
      }

      // --- Collab Half 44 Special Styling ---
      if (isCollabHalf44) {
          return (
            <Reveal key={volume.id} delay={150} className="w-full h-full">
                <button
                    disabled={isLocked && false}
                    onClick={() => {
                       if (!isLocked) handleVolumeClick(volume);
                    }}
                    className={`
                        w-full h-64 justify-center relative group overflow-hidden transition-all duration-700
                        bg-emerald-950/20 text-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.15)] border-emerald-400/30
                        border items-center flex flex-col hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]
                        hover:border-emerald-300 backdrop-blur-sm
                        ${isLocked ? 'cursor-not-allowed opacity-80' : ''}
                    `}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/10 via-transparent to-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Floating Clovers Background */}
                    <div className="absolute -top-10 -right-10 text-emerald-500/10 rotate-12 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-[2s] ease-out">
                         <FourLeafCloverIcon className="w-64 h-64" />
                    </div>
                    <div className="absolute -bottom-10 -left-10 text-white/5 -rotate-12 group-hover:-rotate-45 group-hover:scale-125 transition-transform duration-[2s] ease-out">
                         <FourLeafCloverIcon className="w-48 h-48" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center p-6 space-y-4">
                        <div className="flex items-center gap-2 bg-emerald-900/30 text-emerald-200 px-3 py-1 font-black font-mono text-[10px] tracking-widest border border-emerald-500/30 backdrop-blur-md rounded-full shadow-[0_0_10px_rgba(52,211,153,0.2)] mb-auto">
                            <FourLeafCloverIcon className={`w-3 h-3 ${!isLocked ? 'animate-spin-slow' : ''}`} />
                            {getBadgeText(volume.id, language)}
                        </div>
                        
                        <div className="text-center space-y-2 relative my-auto">
                            {isLocked && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                    <Lock size={12} className="text-emerald-400" />
                                </div>
                            )}
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-emerald-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                {language === 'en' ? 'HALF OF 44!' : '四十四的一半！'}
                            </h2>
                            <p className="font-mono text-[10px] tracking-[0.2em] text-emerald-300/80 uppercase">
                                {language === 'en' ? 'FETCHING INFO (TO BE UPDATED)' : '正在获取信息（待更新）'}
                            </p>
                        </div>
                    </div>
                    
                    {/* Decorative elegant lines */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
                </button>
            </Reveal>
          );
      }

      // Styles
      const corruptedClass = 'bg-red-950/20 border-red-900 text-red-500';
      
      const lockedClass = 'bg-ash-dark/20 border-ash-dark text-ash-gray';

      const normalClass = 'bg-ash-black/90 border-ash-gray text-ash-light group-hover:border-ash-light group-hover:bg-ash-dark/80 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]';

      const memoriesClass = 'bg-cyan-950/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-cyan-900/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:-translate-y-2';

      const dailyClass = 'bg-zinc-950/90 border-emerald-600/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:bg-zinc-900/95 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:-translate-y-2';

      const ghostAnalysisClass = 'bg-slate-950/40 border-slate-600/50 text-slate-400 shadow-[0_0_15px_rgba(100,116,139,0.15)] hover:bg-slate-900/50 hover:border-slate-400 hover:shadow-[0_0_30px_rgba(100,116,139,0.3)] hover:-translate-y-2';

      const collabStarClass = 'bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border-purple-500/60 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:from-cyan-900/30 hover:to-purple-900/30 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:-translate-y-2';

      const firstStepClass = isFirstStepVisuallyLocked 
          ? 'bg-neutral-900 border-neutral-700 text-neutral-400 opacity-80 cursor-help hover:bg-neutral-800 hover:border-neutral-500 hover:text-neutral-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.6),0_0_15px_rgba(255,255,255,0.1)]' 
          : 'bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.8)] hover:bg-gray-100 hover:shadow-[0_0_50px_rgba(255,255,255,1)] hover:-translate-y-1';

      return (
          <Reveal key={volume.id} delay={index * 150} className={`w-full h-full ${isFirstStep ? 'md:col-span-3' : ''}`}> 
              <button
                  onClick={() => {
                      if (volume.id === 'VOL_COLLAB_STAR' && isLocked) {
                          setShowDebugModal(true);
                          return;
                      }
                      if (isFirstStep && isLocked) {
                          setShowFirstStepPrereqModal(true);
                          return;
                      }
                      if (!isLocked && !isCorrupted) {
                          handleVolumeClick(volume);
                      }
                  }}
                  disabled={isCorrupted || (isLocked && volume.id !== 'VOL_COLLAB_STAR' && !isFirstStep)}
                  className={`
                      w-full relative group transition-all duration-500 transform
                      flex flex-col text-left overflow-hidden
                      ${isFirstStep ? 'min-h-[320px] hover:scale-[1.02]' : 'h-64'}
                      ${isCorrupted 
                          ? 'opacity-80' 
                          : isLocked
                              ? (isCollabStar ? 'cursor-help' : 'opacity-60 cursor-not-allowed')
                              : 'cursor-pointer'
                      }
                  `}
              >
                  {/* Background Series Letter Decoration */}
                  {seriesLetter && !isLocked && !isCorrupted && (
                      <div className={`absolute -right-4 -bottom-10 text-[140px] font-black font-mono pointer-events-none select-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 z-0 text-white opacity-[0.05]`}>
                          {seriesLetter}
                      </div>
                  )}

                  {/* Completed Stamp */}
                  {volume.completed && (
                      <div className={`
                          absolute top-14 right-6 z-30 transform rotate-12
                          border-4 border-double px-4 py-2
                          font-black text-xl tracking-[0.2em] uppercase opacity-80 pointer-events-none select-none
                          border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]
                          transition-transform group-hover:scale-110 duration-300
                      `}>
                          <div className="absolute inset-0 border border-current opacity-50 m-0.5"></div>
                          {language === 'en' ? 'COMPLETED' : '已完结'}
                      </div>
                  )}

                  {/* Card Body */}
                  <div 
                      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)' }}
                      className={`
                          absolute inset-0 border-2 transition-colors duration-300
                          ${isCorrupted 
                              ? corruptedClass 
                              : isLocked
                                  ? lockedClass
                                  : isGhostAnalysis
                                      ? ghostAnalysisClass
                                      : isFirstStep
                                          ? firstStepClass
                                          : isCollabStar
                                          ? collabStarClass
                                      : isMemories
                                          ? memoriesClass
                                          : isDaily
                                              ? dailyClass
                                              : normalClass
                          }
                      `}
                  >
                      {/* Locked First Step Overlay */}
                      {isFirstStep && isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] z-40">
                              <div className={`border border-slate-500/50 bg-slate-900/80 text-slate-300 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-1 shadow-[0_0_20px_rgba(100,116,139,0.4)]`}>
                                  <Lock size={16} className="mb-1" />
                                  <span>LOCKED // MISSING PREREQUISITE</span>
                                  <span className="text-[9px] opacity-70">
                                      {language === 'en' ? 'COMPLETE G-006 FIRST' : '需先阅读G-006'}
                                  </span>
                              </div>
                          </div>
                      )}

                      {/* Locked Collab Star Overlay */}
                      {isCollabStar && isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] z-40">
                              <div className={`border border-purple-500/50 bg-purple-900/80 text-purple-200 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest flex flex-col items-center gap-1 shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-pulse`}>
                                  <Lock size={16} className="mb-1" />
                                  <span>LOCKED</span>
                                  <span className="text-[9px] opacity-70">
                                      {language === 'en' ? 'COMING IN FEB' : '二月更新'}
                                  </span>
                              </div>
                          </div>
                      )}

                      {/* Scanline Effect */}
                      <div className={`absolute inset-0 bg-transparent bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20`}></div>
                      
                      {/* Memories Highlight Effect (Rain) */}
                      {isMemories && (
                          <>
                              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none"></div>
                              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                                  {Array.from({ length: 12 }).map((_, i) => (
                                      <div 
                                          key={i}
                                          className={`absolute w-[1.5px] bg-gradient-to-b from-transparent via-cyan-300 to-transparent`}
                                          style={{
                                              height: `${20 + Math.random() * 40}%`,
                                              left: `${Math.random() * 100}%`,
                                              top: '-20%',
                                              animation: `dataRainCard ${1.5 + Math.random() * 1.5}s linear infinite`,
                                              animationDelay: `${Math.random() * 2}s`,
                                              willChange: 'transform'
                                          }}
                                      />
                                  ))}
                              </div>
                          </>
                      )}

                      {/* Daily Highlight Effect (Geometric & Sharp) */}
                      {isDaily && (
                          <>
                              {/* Architectural Grid Background */}
                              <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:opacity-[0.15] transition-opacity duration-700" style={{ backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                              
                              {/* Intersecting Vector Lines */}
                              <div className="absolute top-[-20%] left-[-10%] w-[150%] h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent transform rotate-[15deg] group-hover:rotate-[12deg] transition-transform duration-1000"></div>
                              <div className="absolute bottom-[-10%] right-[-20%] w-[150%] h-[1px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent transform -rotate-[25deg] group-hover:-rotate-[20deg] transition-transform duration-1000"></div>

                              {/* Rotating Wireframe Elements */}
                              <div className="absolute -right-12 -top-12 w-48 h-48 border-[1px] border-emerald-500/30 group-hover:border-emerald-400/50 transition-colors duration-500 animate-[spin_20s_linear_infinite]"></div>
                              <div className="absolute -right-16 -top-16 w-56 h-56 border-[1px] border-teal-500/20 group-hover:border-teal-400/40 transition-colors duration-500 rotate-45 animate-[spin_25s_linear_infinite_reverse]"></div>

                              {/* Precise Geometric Nodes */}
                              <div className="absolute left-[40px] top-[40px] w-2 h-2 bg-emerald-500/60 rotate-45 group-hover:bg-emerald-400 transition-colors shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                              <div className="absolute right-[40px] bottom-[40px] w-1.5 h-1.5 bg-teal-400/60 group-hover:scale-[2] transition-transform shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>

                              {/* Moving Scanner Vector */}
                              <div className="absolute top-0 left-1/3 w-[1px] h-full bg-emerald-500/20">
                                  <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent via-emerald-400/80 to-transparent animate-scanline"></div>
                              </div>
                          </>
                      )}

                      {/* Ghost Analysis Highlight Effect (Fragmented/Ghostly) */}
                      {isGhostAnalysis && (
                          <>
                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
                              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-500/5 to-transparent"></div>
                                  <div className="absolute top-1/2 left-0 w-full h-px bg-slate-400/20 animate-[pulse_1.5s_infinite]"></div>
                                  <div className="absolute top-0 left-1/3 w-px h-full bg-slate-400/10 animate-[pulse_3s_infinite]"></div>
                              </div>
                          </>
                      )}

                      {/* First Step Highlight Effect (Occult / Mystical) */}
                      {isFirstStep && !isLocked && (
                          <div className="absolute inset-0 overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none">
                              {/* Background Noise Subtle */}
                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHBhdGggZD0iTTAgMGg2NHY2NEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMiAzMmwxIDEuNW0tMiAzTDMwIDM1bTEuNSAzIDEuNS0yaC0ybC41IDIuNW0tMS0yTDMzIDI5bS0yIDRMIDMwIDMzbS0xLTEgMi41IDJtMi0ybDEuNSAzbC0yIDIuNW0yLTMgLTIgMS41bTMtMyAxLjUgMi41bC0yLTJNIDM1IDMwaC0ybC0xLjUgM20xLjUgLTEgLTEtMi0uNSAxLTVtMSAzLDUgMS0ybTMgMS41IC0yIDEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-10"></div>
                              
                              {/* Geometric Occult Arrays */}
                              <div className="absolute top-[20%] right-[-5%] w-64 h-64 border border-neutral-500/20 rounded-full animate-[spin_40s_linear_infinite]"></div>
                              <div className="absolute top-[20%] right-[-5%] w-56 h-56 border border-neutral-400/30 border-dashed rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                              <div className="absolute top-[20%] right-[-5%] w-48 h-48 border border-neutral-600/40 rounded-full animate-[spin_60s_linear_infinite]"></div>
                              
                              {/* Intersection lines */}
                              <div className="absolute top-[20%] right-[-5%] w-[120%] h-[1px] bg-neutral-600/20 transform rotate-45 origin-right"></div>
                              <div className="absolute top-[20%] right-[-5%] w-[120%] h-[1px] bg-neutral-600/20 transform -rotate-45 origin-right"></div>
                              <div className="absolute top-[20%] right-[-5%] w-[120%] h-[1px] bg-neutral-600/20 transform rotate-180 origin-right"></div>
                              <div className="absolute top-[20%] right-[-5%] w-[120%] h-[1px] bg-neutral-600/20 transform rotate-90 origin-bottom"></div>

                              {/* Sigils / Triangles */}
                              <div className="absolute top-[20%] right-[10%] w-32 h-32 text-neutral-500/40 animate-[pulse_4s_ease-in-out_infinite]">
                                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-[spin_40s_linear_infinite]">
                                      <polygon points="50,10 90,80 10,80" />
                                      <polygon points="50,90 10,20 90,20" />
                                      <circle cx="50" cy="50" r="30" />
                                  </svg>
                              </div>
                              
                              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 to-transparent"></div>
                          </div>
                      )}

                      {/* Collab Star Highlight Effect (Sparkles/Gradient) */}
                      {isCollabStar && (
                          <>
                              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full"></div>
                                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/20 blur-[50px] rounded-full"></div>
                                  <div className="absolute top-1/4 left-1/4 text-white/40 animate-pulse text-xs">✦</div>
                                  <div className="absolute bottom-1/3 right-1/4 text-white/30 animate-pulse text-xs" style={{animationDelay: '1s'}}>✦</div>
                              </div>
                          </>
                      )}

                      {/* Special Labels */}
                      {isMemories && (
                          <div className={`absolute top-0 right-0 z-30 px-3 py-1 text-[10px] font-bold font-mono border-b-2 border-l-2 flex items-center gap-1 bg-cyan-950 text-cyan-400 border-cyan-500/50`}>
                              <Sparkles size={10} className="animate-pulse" />
                              {badgeText}
                          </div>
                      )}
                      {isDaily && (
                          <div className={`absolute top-0 right-0 z-30 px-4 py-1.5 text-[10px] font-bold font-mono border-b border-l flex items-center gap-2 bg-zinc-950/90 text-emerald-400 border-emerald-500/50 backdrop-blur-md`}>
                              <div className="w-1.5 h-1.5 bg-emerald-400 rotate-45 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]"></div>
                              <span className="uppercase tracking-widest">{badgeText}</span>
                          </div>
                      )}
                      {isGhostAnalysis && (
                          <div className={`absolute top-0 right-0 z-30 px-3 py-1 text-[10px] font-bold font-mono border-b-2 border-l-2 flex items-center gap-1 bg-slate-900 text-slate-300 border-slate-500/50`}>
                              <Cpu size={10} className="animate-pulse" />
                              <span>{badgeText}</span>
                          </div>
                      )}
                      {isCollabStar && (
                          <div className="absolute top-0 right-0 z-30 flex flex-col items-end">
                              <div className={`px-3 py-1 text-[10px] font-bold font-mono border-b-2 border-l-2 flex items-center gap-1 bg-purple-950 text-purple-300 border-purple-500/50`}>
                                  <Star size={10} className="animate-pulse" />
                                  {badgeText}
                              </div>
                              <div className={`px-3 py-1 text-[10px] font-bold font-mono border-b-2 border-l-2 flex items-center gap-1 bg-fuchsia-900 text-fuchsia-200 border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.5)]`}>
                                  <Sparkles size={10} className="animate-pulse" />
                                  {language === 'en' ? '3.27 DLC UPDATE' : '3.27 DLC 章节更新'}
                              </div>
                          </div>
                      )}
                      {isFirstStep && !isLocked && (
                          <div className={`absolute top-0 right-0 z-30 px-4 py-1.5 text-[10px] font-bold font-mono border-b border-l flex items-center gap-2 bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.8)]`}>
                              <div className="w-1.5 h-1.5 bg-black rotate-45 animate-pulse"></div>
                              <span className="uppercase tracking-widest">{badgeText}</span>
                          </div>
                      )}
                      
                      {/* Content */}
                      <div className={`p-6 h-full flex flex-col relative z-20 ${isFirstStep ? 'items-center text-center justify-center py-12' : ''}`}>
                          <div className={`flex justify-between items-start mb-auto ${isFirstStep ? 'absolute top-6 left-0 right-0 px-6' : ''}`}>
                              {isFirstStep ? (
                                  <div className="relative">
                                      {isFirstStepVisuallyLocked ? (
                                          <Lock size={40} strokeWidth={1.5} className="text-neutral-400 relative z-10" />
                                      ) : (
                                          <>
                                              <Eye size={40} strokeWidth={1} className="text-neutral-800 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] relative z-10 animate-pulse" />
                                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-neutral-400 animate-ping opacity-30"></div>
                                          </>
                                      )}
                                  </div>
                              ) : isMemories ? (
                                  <div className="relative">
                                      <CloudRain size={32} strokeWidth={1} className="text-cyan-500 relative z-10" />
                                      <Star size={16} className="text-cyan-300 absolute -top-1 -right-1 animate-spin-slow" />
                                  </div>
                              ) : isDaily ? (
                                  <div className="relative">
                                      <FourPointStarIcon className={`w-8 h-8 relative z-10 text-indigo-400`} />
                                      <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></div>
                                  </div>
                              ) : isCollabStar ? (
                                  <div className="relative">
                                      <FourPointStarIcon className={`w-8 h-8 relative z-10 text-purple-400`} />
                                      <Star size={12} className="text-cyan-300 absolute -top-1 -right-1 animate-pulse" />
                                  </div>
                              ) : isGhostAnalysis ? (
                                  <div className="relative">
                                      <Cpu size={32} strokeWidth={1} className="text-slate-500 relative z-10" />
                                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-slate-400 rounded-full animate-ping"></div>
                                  </div>
                              ) : (
                                  <NovaFolder size={32} className={isCorrupted ? 'animate-pulse' : ''} strokeWidth={1.5} />
                              )}
                              
                              <div className={`text-[10px] font-mono border border-current px-1 ${isDaily ? 'font-black opacity-100 bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : isCollabStar ? 'font-black opacity-100 bg-purple-500/20' : 'opacity-70'}`}>
                                  {priorityLabel}
                              </div>
                          </div>

                          <div className={`space-y-1 mt-4 ${isFirstStep ? 'mt-8 flex flex-col items-center' : ''}`}>
                              <h3 className={`font-black font-mono uppercase tracking-tight leading-none ${isFirstStep ? 'text-4xl md:text-5xl tracking-[0.2em] my-4' : 'text-xl md:text-2xl'} ${isCorrupted ? 'blur-[1px]' : ''} ${isDaily ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]' : ''} ${isMemories ? 'text-cyan-100 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : isCollabStar ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.6)]' : ''} ${isFirstStepVisuallyLocked ? 'text-neutral-500 drop-shadow-none' : ''}`} data-text={language === 'en' ? volume.titleEn : volume.title}>
                                  {isFirstStepVisuallyLocked ? (language === 'en' ? 'RESTRICTED' : '权限不足') : (language === 'en' ? volume.titleEn : volume.title)}
                              </h3>
                              <div className={`font-mono uppercase tracking-widest ${isFirstStep ? 'text-xs md:text-sm tracking-[0.3em]' : 'text-[10px] opacity-50'} ${isFirstStepVisuallyLocked ? 'text-neutral-500 blur-[1px]' : isFirstStep ? 'text-neutral-800' : 'text-neutral-400'} ${isMemories || isDaily || isCollabStar ? 'opacity-80' : ''}`}>
                                  {isFirstStepVisuallyLocked ? 'ACCESS DENIED' : volume.titleEn}
                              </div>
                          </div>

                          {/* Footer Metadata */}
                          <div className={`mt-6 pt-4 border-t border-dashed border-current/30 flex justify-between items-end text-[10px] font-mono ${isFirstStep ? 'absolute bottom-6 left-6 right-6 border-current/30 w-[calc(100%-3rem)] mt-0' : ''}`}>
                              <div className="flex flex-col gap-1">
                                  <span>SIZE: {volume.chapters.length * 128}KB</span>
                                  <span className="flex items-center gap-1">
                                      STATUS: 
                                      {isCorrupted 
                                          ? 'ERR' 
                                          : isLocked 
                                              ? (isCollabStar ? 'PRE_LOAD' : 'LCK')
                                              : isDaily 
                                                  ? <span className="animate-pulse">UNSTABLE</span> 
                                                  : isGhostAnalysis
                                                      ? <span className="animate-pulse">ANALYZING</span>
                                                      : isFirstStep
                                                          ? (isFirstStepVisuallyLocked ? <span className="opacity-50 text-red-500 line-through">ST.X</span> : <ChangingSTStatus />)
                                                          : 'RDY'
                                      }
                                  </span>
                              </div>
                              {isCorrupted ? <AlertTriangle size={16} /> : isLocked ? <Lock size={16} /> : <div className="w-16 h-2 bg-current opacity-20 relative"><div className="absolute left-0 top-0 h-full bg-current w-1/2"></div></div>}
                          </div>
                      </div>
                  </div>

                  {/* Hover Corners */}
                  {!isLocked && !isCorrupted && (
                      <>
                          <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isMemories ? 'border-cyan-400' : isDaily ? 'border-amber-500' : isCollabStar ? 'border-purple-400' : 'border-ash-light'}`}></div>
                          <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isMemories ? 'border-cyan-400' : isDaily ? 'border-amber-500' : isCollabStar ? 'border-purple-400' : 'border-ash-light'}`}></div>
                      </>
                  )}
              </button>
          </Reveal>
      );
  };

  const SectionHeader = ({ title, sub, icon: Icon, colorClass }: { title: string, sub: string, icon: any, colorClass: string }) => (
      <div className={`w-full flex items-center gap-4 mb-6 mt-8 border-b pb-2 border-ash-gray/20`}>
          <div className={`p-1.5 rounded-sm border ${colorClass}`}>
              <Icon size={16} />
          </div>
          <div>
              <div className={`text-xs font-black uppercase tracking-widest text-ash-light`}>
                  {title}
              </div>
              <div className={`text-[9px] font-mono opacity-60 uppercase text-ash-gray`}>
                  {sub}
              </div>
          </div>
      </div>
  );

  return (
        <div className="h-full bg-halftone overflow-y-auto p-4 md:p-12 relative flex flex-col items-center">
            {/* Background Tech Lines */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
                <div className="absolute top-1/4 left-0 w-full h-px bg-ash-gray/50"></div>
                <div className="absolute bottom-1/4 left-0 w-full h-px bg-ash-gray/50"></div>
                <div className="absolute top-0 left-1/4 h-full w-px bg-ash-gray/50"></div>
                <div className="absolute top-0 right-1/4 h-full w-px bg-ash-gray/50"></div>
            </div>

            {/* Floating Char Modal Button */}
            <button 
                onClick={onOpenCharModal}
                className="fixed bottom-24 right-4 md:absolute md:top-4 md:right-4 z-50 bg-ash-black border border-ash-gray p-3 text-ash-gray hover:bg-ash-light hover:text-ash-black hover:border-ash-light transition-all shadow-hard group"
                title="Personnel Archive"
            >
                <VenetianMask size={20} />
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-ash-dark text-ash-light text-[10px] font-mono px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-ash-gray hidden md:block">
                    PERSONNEL_DB
                </span>
            </button>

            <header className="relative z-10 mb-8 text-center w-full max-w-2xl mx-auto mt-8 md:mt-4">
                <div className="flex flex-col items-center gap-3">
                    <HardDrive size={40} className="text-ash-light" strokeWidth={1} />
                    <h1 className="text-3xl md:text-5xl font-black text-ash-light uppercase tracking-tighter glitch-text-heavy" data-text={language === 'en' ? 'SIDE_ARCHIVES' : '支线档案库'}>
                        {language === 'en' ? 'SIDE_ARCHIVES' : '支线档案库'}
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-ash-gray border border-ash-gray/50 px-2 py-1 bg-ash-black/80">
                         <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                         STATUS: MOUNTED
                         <span className="mx-1">|</span>
                         /VAR/LIB/MEMORIES/SIDE_STORIES
                    </div>
                </div>
            </header>

            <div className="w-full max-w-6xl relative z-10 px-2 md:px-4 pb-20">
                
                {/* SECTION 1: Current Timeline */}
                <SectionHeader 
                    title={language === 'en' ? 'CURRENT TIMELINE // EXTENSIONS' : '本篇 // 支线扩展'} 
                    sub={language === 'en' ? 'ST.1_DAILY_RECORDS' : 'ST.1 时域日常'}
                    icon={GitBranch}
                    colorClass="border-amber-500 text-amber-500"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {groups.current.map((volume, idx) => renderVolumeCard(volume, idx))}
                </div>

                {/* SECTION 2: Main Story Expansion / Collab */}
                <SectionHeader 
                    title={language === 'en' ? 'MAIN STORY EXPANSION // SPECIAL' : '主线扩展 // 特别收录'} 
                    sub={language === 'en' ? 'CROSS_DIMENSIONAL_DATA' : '跨维度数据与外传'}
                    icon={Link}
                    colorClass="border-purple-500 text-purple-500"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {groups.expansion.map((volume, idx) => renderVolumeCard(volume, idx))}
                </div>

                {/* SECTION 4: First Step */}
                {groups.firststep.length > 0 && (
                    <>
                        <SectionHeader 
                            title={language === 'en' ? 'BEFORE THE BEFORE THE BEFORE' : '以前的以前的以前'} 
                            sub={language === 'en' ? 'SIDE STORY / GAIDEN' : '支线外传'}
                            icon={Sparkles}
                            colorClass="border-neutral-500 text-neutral-400"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                            {groups.firststep.map((volume, idx) => renderVolumeCard(volume, idx))}
                        </div>
                    </>
                )}

            </div>

            {/* Spoiler Warning Modal */}
            {showSpoilerModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-red-950/90 border-2 border-red-500 w-full max-w-lg p-6 flex flex-col gap-6 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                        <div className="flex items-center gap-3 text-red-500 border-b border-red-500/30 pb-4">
                            <AlertTriangle size={32} />
                            <h3 className="font-black text-xl font-mono uppercase tracking-[0.2em]">{language === 'en' ? 'SPOILER WARNING' : '严重剧透警告'}</h3>
                        </div>
                        <div className="text-red-200/90 text-sm md:text-base leading-relaxed space-y-4">
                            <p>
                                {language === 'en' 
                                    ? 'This chapter contains major spoilers for the main story. It is highly recommended to read the chapter ' 
                                    : '本章节包含对主线故事的严重剧透。强烈建议您在阅读完主线章节 '}
                                <strong className="text-white font-black bg-red-900/50 px-1 py-0.5"> G-006 </strong> 
                                {language === 'en'
                                    ? ' before proceeding. Otherwise, you may not understand the context or have major plot points revealed early.'
                                    : '后再阅读本章节。否则您将可能无法理解剧情上下文，并会被严重剧透关键剧情情节。'}
                            </p>
                            <p className="opacity-80 text-xs mt-4">
                                {language === 'en' ? 'Do you still want to proceed?' : '你确定还要继续吗？'}
                            </p>
                        </div>
                        
                        <div className="flex justify-end gap-4 mt-2">
                            <button 
                                onClick={() => {
                                    setShowSpoilerModal(false);
                                    setPendingVolume(null);
                                }}
                                className="px-6 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/20 font-bold font-mono tracking-widest text-sm transition-colors"
                            >
                                {language === 'en' ? 'ABORT' : '放弃阅读'}
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.setItem('nova_first_step_spoiler_warning_seen', 'true');
                                    setShowSpoilerModal(false);
                                    if (pendingVolume) {
                                        onSelectVolume(pendingVolume);
                                    }
                                }}
                                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-black font-mono tracking-widest text-sm transition-colors"
                            >
                                {language === 'en' ? 'PROCEED' : '确认继续'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Prerequisite Warning Modal */}
            {showPrereqModal && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in" onClick={() => setShowPrereqModal(false)}>
                    <div className="max-w-md w-full border-4 border-red-600 bg-black p-8 relative shadow-[0_0_50px_rgba(220,38,38,0.5)]" onClick={e => e.stopPropagation()}>
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,0,0,0.05)_10px,rgba(255,0,0,0.05)_20px)] pointer-events-none"></div>
                        <FileWarning size={64} className="text-red-500 mx-auto mb-6 animate-pulse" />
                        <h2 className="text-2xl md:text-3xl font-black text-red-500 uppercase tracking-widest mb-4 glitch-text-heavy" data-text="ACCESS DENIED">
                            {language === 'en' ? 'ACCESS DENIED' : '访问拒绝'}
                        </h2>
                        <div className="text-red-200 font-mono text-sm md:text-base leading-relaxed mb-8 space-y-4">
                            <p className="border-b border-red-800 pb-2">
                                {language === 'en' ? 'MISSING PREREQUISITE DATA' : '缺少前置数据节点'}
                            </p>
                            <p className="opacity-80">
                                {language === 'en' 
                                    ? 'To access the "Midnight 12:00" arc, you must first complete Main Story Chapter [A-003] and Prequel Archive [F-014].' 
                                    : '为确保时空连续性，您必须先阅读主线章节 [A-003 边境特训] 与前传档案 [F-014] 方可解锁此区域。'}
                            </p>
                            <div className="bg-red-900/30 p-2 border border-red-800 text-[10px] font-bold">
                                ERROR_CODE: TIMELINE_DEPENDENCY_MISSING
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowPrereqModal(false)}
                            className="w-full py-3 border-2 border-red-500 text-red-500 font-bold uppercase hover:bg-red-500 hover:text-black transition-all"
                        >
                            {language === 'en' ? 'ACKNOWLEDGE' : '确认'}
                        </button>
                    </div>
                </div>
            )}

            {/* First Step Prerequisite Warning Modal */}
            {showFirstStepPrereqModal && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in" onClick={() => setShowFirstStepPrereqModal(false)}>
                    <div className="max-w-md w-full border-4 border-slate-600 bg-black p-8 relative shadow-[0_0_50px_rgba(100,116,139,0.5)]" onClick={e => e.stopPropagation()}>
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)] pointer-events-none"></div>
                        <FileWarning size={64} className="text-slate-400 mx-auto mb-6 animate-pulse" />
                        <h2 className="text-2xl md:text-3xl font-black text-slate-300 uppercase tracking-widest mb-4">
                            {language === 'en' ? 'ACCESS DENIED' : '未能达成条件'}
                        </h2>
                        <div className="text-slate-400 font-mono text-sm md:text-base leading-relaxed mb-8 space-y-4">
                            <p className="border-b border-slate-700 pb-2">
                                {language === 'en' ? 'MISSING PREREQUISITE DATA' : '缺少前置数据节点'}
                            </p>
                            <p className="opacity-80">
                                {language === 'en' 
                                    ? 'To access the "First Step" archive, you must first complete G-006 "The Gift".' 
                                    : '需阅读 G-006「馈赠」后方可解锁此记录。'}
                            </p>
                            <div className="bg-slate-900/30 p-2 border border-slate-700 text-[10px] font-bold text-slate-500">
                                ERROR_CODE: GHOST_DEPENDENCY_MISSING
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowFirstStepPrereqModal(false)}
                            className="w-full py-3 border-2 border-slate-500 text-slate-300 font-bold uppercase hover:bg-slate-500 hover:text-black transition-all"
                        >
                            {language === 'en' ? 'ACKNOWLEDGE' : '确认'}
                        </button>
                    </div>
                </div>
            )}

            {/* First Step Password Auth Modal */}
            {showFirstStepPasswordModal && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in" onClick={() => setShowFirstStepPasswordModal(false)}>
                    <div className="max-w-sm w-full border-2 border-slate-500 bg-black p-6 relative shadow-[0_0_50px_rgba(100,116,139,0.3)]" onClick={e => e.stopPropagation()}>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(100,116,139,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.05)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
                        <Lock size={48} className="text-slate-500 mx-auto mb-4" />
                        <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest mb-4">
                            {language === 'en' ? 'ENTER DIRECTORY KEY' : '输入目录密码'}
                        </h2>
                        <form onSubmit={handleFirstStepPasswordSubmit} className="space-y-4">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700">
                                    <Key size={14} />
                                </div>
                                <input 
                                    type="text" 
                                    value={firstStepPasswordInput}
                                    onChange={(e) => setFirstStepPasswordInput(e.target.value)}
                                    placeholder={language === 'en' ? 'PASSWORD' : '密码'}
                                    className={`w-full bg-black border-2 px-10 py-2 text-center text-slate-200 font-mono text-xs tracking-widest focus:outline-none focus:border-slate-500 transition-all placeholder:text-slate-900/50 ${firstStepPasswordError ? 'border-red-500 animate-shake-violent text-red-500' : 'border-slate-900/50'}`}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowFirstStepPasswordModal(false)}
                                    className="flex-1 py-2 border border-slate-900/30 text-slate-600 hover:bg-slate-900/10 transition-colors text-xs font-bold uppercase"
                                >
                                    {language === 'en' ? 'CANCEL' : '取消'}
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-2 bg-slate-900/20 border border-slate-500 text-slate-400 hover:bg-slate-500 hover:text-black transition-all text-xs font-bold uppercase"
                                >
                                    {language === 'en' ? 'UNLOCK' : '解锁'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Debug Auth Modal */}
            {showDebugModal && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in" onClick={() => setShowDebugModal(false)}>
                    <div className="max-w-sm w-full border-2 border-purple-500 bg-black p-6 relative shadow-[0_0_50px_rgba(168,85,247,0.3)]" onClick={e => e.stopPropagation()}>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
                        <Terminal size={48} className="text-purple-500 mx-auto mb-4" />
                        <h2 className="text-xl font-black text-purple-500 uppercase tracking-widest mb-4">
                            DEBUG_AUTH // BYPASS
                        </h2>
                        <form onSubmit={handleDebugSubmit} className="space-y-4">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-700">
                                    <Key size={14} />
                                </div>
                                <input 
                                    type="password" 
                                    value={debugInput}
                                    onChange={(e) => setDebugInput(e.target.value)}
                                    placeholder="ENTER_DEBUG_KEY"
                                    className={`w-full bg-black border-2 px-10 py-2 text-center text-purple-200 font-mono text-xs tracking-widest focus:outline-none focus:border-purple-500 transition-all placeholder:text-purple-900/50 ${debugError ? 'border-red-500 animate-shake-violent' : 'border-purple-900/50'}`}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowDebugModal(false)}
                                    className="flex-1 py-2 border border-purple-900/30 text-purple-700 hover:bg-purple-900/10 transition-colors text-xs font-bold uppercase"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-2 bg-purple-900/20 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black transition-all text-xs font-bold uppercase"
                                >
                                    UNLOCK
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideStoryVolumeList;
