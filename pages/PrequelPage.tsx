
import React, { useState, useEffect, useCallback } from 'react';
import { prequelVolumes } from '../data/sideStories';
import { Language, SideStoryVolume, ReadingMode } from '../types';
import SideStoryReader from '../components/sidestory/SideStoryReader';
import VisualNovelPage from '../pages/VisualNovelPage';
import { PrequelArchiveView } from '../components/sidestory/views/PrequelArchiveView';
import SideStoryEntryAnimation from '../components/SideStoryEntryAnimation';
import { ReaderFont } from '../components/fonts/fontConfig';
import TemporaryTerminal from '../components/TemporaryTerminal';

interface PrequelPageProps {
  language: Language;
  isLightTheme: boolean;
  onVolumeChange: (volumeId: string | null) => void;
  readerFont: ReaderFont;
  fontSize: number;
  readingMode?: ReadingMode;
  onTerminalOpen?: () => void;
  onTerminalClose?: () => void;
}

const PrequelPage: React.FC<PrequelPageProps> = ({ 
    language, isLightTheme, onVolumeChange, readerFont, fontSize, readingMode = 'standard', 
    onTerminalOpen, onTerminalClose 
}) => {
  // Mode: 'archive_list' -> 'chapter_list' -> 'reader' | 'game' -> 'extra'
  const [viewMode, setViewMode] = useState<'archive_list' | 'chapter_list' | 'reader' | 'game' | 'extra'>('archive_list');
  
  const [activeVolume, setActiveVolume] = useState<SideStoryVolume | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTerminalId, setActiveTerminalId] = useState<string | null>(null);

  const handleVolumeSelect = (volumeId: string) => {
      const vol = prequelVolumes.find(v => v.id === volumeId);
      if (vol) {
          setActiveVolume(vol);
          setCurrentChapterIndex(0);
          onVolumeChange(vol.id);
          setIsAnimating(true);
      }
  };

  const handleAnimationComplete = () => {
      setIsAnimating(false);
      setViewMode('chapter_list');
  };

  const handleChapterSelect = (index: number) => {
      setCurrentChapterIndex(index);
      
      // Special Logic
      if (activeVolume && activeVolume.chapters[index].id === 'special-terminal-discovery') {
         handleOpenTerminal('T001');
         return; 
      }

      setViewMode(readingMode === 'visual_novel' ? 'game' : 'reader');
  };

  const handleBackToArchives = () => {
      setActiveVolume(null);
      onVolumeChange(null);
      setViewMode('archive_list');
  };

  const handleOpenTerminal = useCallback((scriptId: string) => {
      setActiveTerminalId(scriptId);
      if (onTerminalOpen) onTerminalOpen();
  }, [onTerminalOpen]);

  const handleCloseTerminal = useCallback(() => {
      setActiveTerminalId(null);
      if (onTerminalClose) onTerminalClose();
  }, [onTerminalClose]);

  const handleTerminalComplete = useCallback(() => {
      handleCloseTerminal();
      if (activeVolume) {
          const termIndex = activeVolume.chapters.findIndex(c => c.id === 'special-terminal-discovery');
          const nextIndex = termIndex + 1;
          if (termIndex !== -1 && nextIndex < activeVolume.chapters.length) {
              const nextChapter = activeVolume.chapters[nextIndex];
              if (nextChapter.id !== 'story-byaki-diary' && nextChapter.status !== 'locked') {
                  setCurrentChapterIndex(nextIndex);
              }
          }
      }
  }, [activeVolume, handleCloseTerminal]);

  // Animation render
  if (isAnimating && activeVolume) {
      return (
          <SideStoryEntryAnimation 
              onComplete={handleAnimationComplete}
              language={language}
              volumeId={activeVolume.id}
          />
      );
  }

  // --- 1. Archive Root (Select Volume) ---
  if (viewMode === 'archive_list') {
      return (
          <div className={`h-full overflow-y-auto p-4 pb-28 md:p-12 md:pb-12 flex flex-col items-center justify-center relative ${isLightTheme ? 'bg-[#fdf6e3]' : 'bg-[#121212]'}`}>
              {/* Retro Background Texture */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]"></div>
              
              <div className="max-w-5xl w-full z-10 space-y-16">
                  <header className="text-center space-y-4 relative">
                      <h1 className={`text-4xl md:text-6xl font-black font-serif tracking-tight uppercase ${isLightTheme ? 'text-[#5c5346]' : 'text-[#d4c4a8]'}`}>
                          {language === 'en' ? 'THE PAST OF THE PAST' : '以前的以前'}
                      </h1>
                      <div className="flex items-center justify-center gap-4 opacity-60">
                          <div className="h-px w-8 bg-current hidden md:block"></div>
                          <p className="font-mono text-[10px] md:text-xs tracking-widest uppercase max-w-[90%] md:max-w-[80%] leading-relaxed">
                              {language === 'en' 
                                ? 'Variable Arc connects to Main Story; Time Origin Arc connects to Daily Life.' 
                                : '被保留的变量章节对应主线，时域初现章节对应日常支线'}
                          </p>
                          <div className="h-px w-8 bg-current hidden md:block"></div>
                      </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                      {prequelVolumes.map((vol) => {
                          const isCompleted = vol.id === 'VOL_VARIABLE';
                          const volNumber = vol.id === 'VOL_VARIABLE' ? '01' : '00';
                          
                          // Dynamic Theme Colors for Card
                          const cardBg = isLightTheme ? 'bg-[#f4f4f0]' : 'bg-[#1c1c1c]';
                          const cardBorder = isLightTheme ? 'border-[#d3c6aa]' : 'border-[#3c3836]';
                          const textColor = isLightTheme ? 'text-[#5c5346]' : 'text-[#ebdbb2]';
                          const numColor = isLightTheme ? 'text-[#8c7b6c]' : 'text-[#504945]';
                          
                          return (
                              <button
                                  key={vol.id}
                                  onClick={() => handleVolumeSelect(vol.id)}
                                  className={`
                                      group relative p-2 transition-all duration-500 hover:-translate-y-2
                                      outline-none focus:outline-none
                                  `}
                              >
                                  {/* Shadow Element */}
                                  <div className={`absolute inset-0 transform translate-x-2 translate-y-2 ${isLightTheme ? 'bg-[#d3c6aa]/50' : 'bg-black/50'} transition-transform group-hover:translate-x-4 group-hover:translate-y-4`}></div>

                                  {/* Main Card */}
                                  <div className={`relative h-full w-full border-4 ${cardBg} ${cardBorder} p-6 md:p-10 flex flex-col items-center justify-center overflow-hidden`}>
                                      
                                      {/* Tape Effect */}
                                      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#e5e5e5]/90 backdrop-blur-sm shadow-sm rotate-1 z-30 opacity-80`}></div>

                                      {/* Stamp (Positioned Absolute Top Right) */}
                                      {isCompleted && (
                                          <div className={`
                                              absolute top-8 right-8 z-40
                                              border-4 border-double
                                              text-red-700 border-red-700
                                              px-3 py-1 rotate-[15deg]
                                              font-black text-sm md:text-base tracking-widest uppercase
                                              opacity-80 select-none
                                              ${isLightTheme ? 'mix-blend-multiply' : ''}
                                              group-hover:scale-110 group-hover:opacity-100 transition-all duration-300
                                          `}>
                                              <div className="absolute inset-0 border border-current opacity-30 m-0.5"></div>
                                              {language === 'en' ? 'COMPLETED' : '已完结'}
                                          </div>
                                      )}

                                      {/* Inner Dashed Box Container */}
                                      <div className={`w-full h-full border-2 border-dashed ${isLightTheme ? 'border-[#8c7b6c]/30' : 'border-[#504945]'} p-6 flex flex-col items-center relative z-10`}>
                                          
                                          {/* Top Tab Decor */}
                                          <div className={`w-12 h-1.5 ${isLightTheme ? 'bg-[#d3c6aa]' : 'bg-[#504945]'} mb-6`}></div>

                                          {/* Big Number */}
                                          <div className={`text-6xl md:text-8xl font-serif font-bold leading-none mb-2 ${numColor} opacity-40 group-hover:opacity-80 transition-opacity`}>
                                              {volNumber}
                                          </div>

                                          {/* Title */}
                                          <h2 className={`text-xl md:text-3xl font-black font-serif uppercase tracking-wide mb-2 ${textColor}`}>
                                              {language === 'en' ? vol.titleEn : vol.title}
                                          </h2>

                                          {/* Dotted Separator */}
                                          <div className={`text-xs tracking-[0.5em] font-black opacity-30 mb-6 ${textColor}`}>
                                              ....................
                                          </div>

                                          {/* Info Box */}
                                          <div className={`
                                              text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest border px-4 py-2 mt-auto
                                              ${isLightTheme ? 'border-[#8c7b6c] text-[#8c7b6c]' : 'border-[#a89984] text-[#a89984]'}
                                              group-hover:bg-current group-hover:text-white transition-colors
                                          `}>
                                              {vol.id} // {vol.chapters.length} FILES
                                          </div>
                                      </div>
                                  </div>
                              </button>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  }

  // --- 2. Chapter List (Retro Folder View) ---
  if (viewMode === 'chapter_list' && activeVolume) {
      return (
          <>
            <PrequelArchiveView 
                chapters={activeVolume.chapters}
                onBack={handleBackToArchives}
                onSelectChapter={handleChapterSelect}
                language={language}
                isLightTheme={isLightTheme}
            />
            {activeTerminalId && (
                <TemporaryTerminal 
                    language={language}
                    onClose={handleCloseTerminal}
                    onComplete={handleTerminalComplete}
                    scriptId={activeTerminalId}
                />
            )}
          </>
      );
  }

  // --- 3. Reader / Game ---
  if (activeVolume) {
      const chapter = activeVolume.chapters[currentChapterIndex];
      if (!chapter) return null;

      if (viewMode === 'game') {
          return (
            <VisualNovelPage 
                chapter={chapter}
                onNextChapter={() => {
                    if (currentChapterIndex < activeVolume.chapters.length - 1) {
                        setCurrentChapterIndex(prev => prev + 1);
                    }
                }}
                onPrevChapter={() => {
                    if (currentChapterIndex > 0) {
                        setCurrentChapterIndex(prev => prev - 1);
                    }
                }}
                onExit={() => setViewMode('chapter_list')}
                language={language}
                isLightTheme={isLightTheme}
            />
          );
      }

      if (viewMode === 'reader') {
          return (
            <>
                <SideStoryReader 
                    volume={activeVolume}
                    currentIndex={currentChapterIndex} 
                    onBack={() => setViewMode('chapter_list')}
                    language={language}
                    isLightTheme={isLightTheme}
                    readerFont={readerFont}
                    fontSize={fontSize}
                    onOpenTerminal={handleOpenTerminal}
                />
                {activeTerminalId && (
                    <TemporaryTerminal 
                        language={language}
                        onClose={handleCloseTerminal}
                        onComplete={handleTerminalComplete}
                        scriptId={activeTerminalId}
                    />
                )}
            </>
          );
      }
  }

  return null;
};

export default PrequelPage;
