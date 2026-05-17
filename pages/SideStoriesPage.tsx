
import React, { useState, useEffect, useCallback } from 'react';
import { sideStoryVolumes } from '../data/sideStories';
import { Language, SideStoryVolume, ReadingMode, GraphicsQuality } from '../types';
import SideStoryVolumeList from '../components/sidestory/SideStoryVolumeList';
import SideStoryChapterList from '../components/sidestory/SideStoryChapterList';
import SideStoryExtraDirectory from '../components/sidestory/SideStoryExtraDirectory';
import SideStoryReader from '../components/sidestory/SideStoryReader';
import VisualNovelPage from '../pages/VisualNovelPage'; 
import { CollabStarReader } from '../components/sidestory/readers/CollabStarReader'; 
import { PrequelArchiveView } from '../components/sidestory/views/PrequelArchiveView'; // New Import
import SideCharacterModal from '../components/sidestory/SideCharacterModal';
import SideStoryEntryAnimation from '../components/SideStoryEntryAnimation';
import { ReaderFont } from '../components/fonts/fontConfig';
import TemporaryTerminal from '../components/TemporaryTerminal';

interface SideStoriesPageProps {
  language: Language;
  onVolumeChange: (volumeId: string | null) => void;
  onChapterChange?: (chapterId: string | null) => void;
  readerFont: ReaderFont;
  fontSize: number;
  readingMode?: ReadingMode; // Accept reading mode
  onTerminalOpen?: () => void;
  onTerminalClose?: () => void;
  // Cross Navigation Props
  initialVolumeId?: string | null;
  onConsumeInitialVolume?: () => void;
  onJump?: (targetId: string) => void; 
  graphicsQuality: GraphicsQuality;
}

const SideStoriesPage: React.FC<SideStoriesPageProps> = ({ 
    language, onVolumeChange, onChapterChange, readerFont, fontSize, readingMode = 'standard', 
    onTerminalOpen, onTerminalClose, initialVolumeId, onConsumeInitialVolume, onJump,
    graphicsQuality
}) => {
  // Navigation State: 'volumes' -> 'chapters' -> 'extra_directory' (optional) -> 'reader' | 'game' | 'collab_reader' | 'prequel_view'
  const [viewMode, setViewMode] = useState<'volumes' | 'chapters' | 'extra_directory' | 'reader' | 'game' | 'collab_reader' | 'prequel_view'>('volumes');
  const [activeVolume, setActiveVolume] = useState<SideStoryVolume | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showCharModal, setShowCharModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  // Terminal State: Stores the ID of the script to play, null if closed
  const [activeTerminalId, setActiveTerminalId] = useState<string | null>(null);

  // Auto-jump to volume if ID provided via props
  useEffect(() => {
      if (initialVolumeId) {
          const vol = sideStoryVolumes.find(v => v.id === initialVolumeId);
          if (vol) {
              handleVolumeSelect(vol);
          }
          // Reset the prop trigger
          if (onConsumeInitialVolume) onConsumeInitialVolume();
      }
  }, [initialVolumeId]);

  // Trigger animation when entering a folder (Volume)
  const handleVolumeSelect = (vol: SideStoryVolume) => {
    setActiveVolume(vol);
    setCurrentChapterIndex(0); // Reset index to prevent out-of-bounds errors on volume switch
    onVolumeChange(vol.id); // Notify App.tsx to potentially play music
    if (onChapterChange) onChapterChange(null);
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    
    // Custom View Routing
    if (activeVolume?.id === 'VOL_ORIGIN') {
        setViewMode('prequel_view');
    } else {
        setViewMode('chapters');
    }
  };

  const handleChapterSelect = (index: number) => {
    setCurrentChapterIndex(index);
    if (onChapterChange && activeVolume) {
        onChapterChange(activeVolume.chapters[index].id);
    }
    
    // Check if it's the special terminal chapter
    if (activeVolume && activeVolume.chapters[index].id === 'special-terminal-discovery') {
       handleOpenTerminal('T001');
       return; 
    }

    // SPECIAL ROUTING: Collab Star Volume Logic
    if (activeVolume?.id === 'VOL_COLLAB_STAR') {
        const chapter = activeVolume.chapters[index];
        const chapterId = chapter.id;
        const chapterMode = chapter.mode;
        
        // Chapter 1 (C-001) is FORCE AVG MODE (unless overridden by mode property)
        if (chapterId === 'story-collab-star-1' && !chapterMode) {
            setViewMode('collab_reader');
            return;
        }

        // Respect explicit chapter mode if set
        if (chapterMode === 'standard') {
            setViewMode('reader');
            return;
        } else if (chapterMode === 'visual_novel') {
            setViewMode('collab_reader');
            return;
        }

        // Chapter 2+ respects User Preference
        if (readingMode === 'visual_novel') {
            setViewMode('collab_reader');
        } else {
            setViewMode('reader'); // Standard Text Reader
        }
        return;
    }

    // Logic: Respect Reading Mode preference, but allow override for specific highly-interactive volumes like DAILY if we want (Currently unified)
    const chapter = activeVolume.chapters[index];
    const effectiveMode = chapter.mode || readingMode;

    if (effectiveMode === 'visual_novel') {
        setViewMode('game');
    } else {
        setViewMode('reader');
    }
  };

  const handleEnterExtraDirectory = () => {
    setViewMode('extra_directory');
  };

  const handleExtraChapterSelect = (chapterId: string) => {
      if (!activeVolume) return;
      const index = activeVolume.chapters.findIndex(c => c.id === chapterId);
      if (index !== -1) {
          setCurrentChapterIndex(index);
          if (onChapterChange) onChapterChange(chapterId);
          // Extra chapters (like the diary) often look better as text, but let's respect preference
          setViewMode(readingMode === 'visual_novel' ? 'game' : 'reader');
      }
  };
  
  const handleBackToVolumes = () => {
      setActiveVolume(null);
      onVolumeChange(null); // Notify App.tsx we left the volume
      if (onChapterChange) onChapterChange(null);
      setViewMode('volumes');
  };

  // Wrap with useCallback to stabilize reference
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
      // Auto-advance logic
      if (activeVolume) {
          // Find the index of the terminal chapter (usually via ID special-terminal-discovery)
          const termIndex = activeVolume.chapters.findIndex(c => c.id === 'special-terminal-discovery');
          const nextIndex = termIndex + 1;
          
          if (termIndex !== -1 && nextIndex < activeVolume.chapters.length) {
              const nextChapter = activeVolume.chapters[nextIndex];
              
              // HARD STOP: Explicitly prevent jumping to the secret diary chapter
              if (nextChapter.id === 'story-byaki-diary') {
                  return;
              }

              // Only advance if the next chapter is NOT locked/corrupted
              // This prevents the "jumping to locked chapter error"
              if (nextChapter.status !== 'locked' && nextChapter.status !== 'corrupted') {
                  setCurrentChapterIndex(nextIndex);
                  if (onChapterChange) onChapterChange(nextChapter.id);
              } else {
                  console.log("Next chapter is locked, staying on current view.");
              }
          }
      }
  }, [activeVolume, handleCloseTerminal]);

  // Monitor chapter changes to trigger terminal if navigated to (e.g. from previous chapter in Game Mode)
  useEffect(() => {
      if (activeVolume && (viewMode === 'game' || viewMode === 'reader')) {
          const chapter = activeVolume.chapters[currentChapterIndex];
          if (chapter && chapter.id === 'special-terminal-discovery') {
              handleOpenTerminal('T001');
          }
      }
  }, [currentChapterIndex, activeVolume, viewMode, handleOpenTerminal]);

  // Render Animation if active
  if (isAnimating && activeVolume) {
    return (
        <SideStoryEntryAnimation 
            onComplete={handleAnimationComplete}
            language={language}
            volumeId={activeVolume.id}
        />
    );
  }

  // --- View 1: Volume Index (Directory) ---
  if (viewMode === 'volumes') {
    return (
        <>
            <SideStoryVolumeList 
                volumes={sideStoryVolumes}
                onSelectVolume={handleVolumeSelect}
                onOpenCharModal={() => setShowCharModal(true)}
                onOpenTerminal={() => handleOpenTerminal('T001')} // Default fallback if triggered here
                language={language}
            />
            <SideCharacterModal 
                isOpen={showCharModal}
                onClose={() => setShowCharModal(false)}
                language={language}
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

  // --- View 1.5: Prequel Archive View ---
  if (viewMode === 'prequel_view' && activeVolume) {
      return (
          <PrequelArchiveView 
              chapters={activeVolume.chapters}
              onBack={handleBackToVolumes}
              onSelectChapter={handleChapterSelect}
              language={language}
          />
      );
  }

  // --- View 2: Chapter List (File Browser) ---
  if (viewMode === 'chapters' && activeVolume) {
      return (
        <>
            <SideStoryChapterList 
                key={activeVolume.id} // Ensure remount when volume changes to reset local state (e.g. timeline toggle)
                volume={activeVolume}
                onBack={handleBackToVolumes}
                onSelectChapter={handleChapterSelect}
                onEnterExtra={handleEnterExtraDirectory}
                onOpenTerminal={handleOpenTerminal}
                language={language}
                graphicsQuality={graphicsQuality}
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

  // --- View 2.5: Extra Fragmented Directory ---
  if (viewMode === 'extra_directory' && activeVolume) {
      const extraChapters = activeVolume.chapters.filter(c => c.id === 'story-byaki-diary');
      return (
          <SideStoryExtraDirectory 
            chapters={extraChapters}
            onBack={() => {
                if (onChapterChange) onChapterChange(null);
                setViewMode('chapters');
            }}
            onSelectChapter={handleExtraChapterSelect}
            language={language}
          />
      );
  }

  // --- View 3: Reader (Standard) ---
  if (viewMode === 'reader' && activeVolume) {
      // Ensure chapter exists before rendering
      const chapterExists = activeVolume.chapters[currentChapterIndex];
      if (!chapterExists) {
          // Fallback or error state
          return <div className="p-8 text-center text-red-500 font-mono">ERROR: CHAPTER_INDEX_OUT_OF_BOUNDS</div>;
      }

      return (
        <>
            <SideStoryReader 
                volume={activeVolume}
                currentIndex={currentChapterIndex} 
                onBack={() => {
                    if (onChapterChange) onChapterChange(null);
                    if (activeVolume.id === 'VOL_ORIGIN') {
                        setViewMode('prequel_view');
                        return;
                    }
                    const isExtra = activeVolume.chapters[currentChapterIndex]?.id === 'story-byaki-diary';
                    setViewMode(isExtra ? 'extra_directory' : 'chapters');
                }}
                language={language}
                readerFont={readerFont}
                fontSize={fontSize}
                onOpenTerminal={handleOpenTerminal}
                onJump={onJump} // Pass down the jump handler
                onChapterChange={(index) => {
                    setCurrentChapterIndex(index);
                    if (onChapterChange) onChapterChange(activeVolume.chapters[index].id);
                    // Special Check: If navigating to Collab Star Ch 1, force AVG mode
                    if (activeVolume.id === 'VOL_COLLAB_STAR') {
                        const chapter = activeVolume.chapters[index];
                        const chapterId = chapter.id;
                        const chapterMode = chapter.mode;

                        if (chapterMode === 'standard') {
                            setViewMode('reader');
                        } else if (chapterMode === 'visual_novel') {
                            setViewMode('collab_reader');
                        } else if (chapterId === 'story-collab-star-1') {
                            setViewMode('collab_reader');
                        }
                    } else {
                        const chapter = activeVolume.chapters[index];
                        const effectiveMode = chapter.mode || readingMode;
                        if (effectiveMode === 'visual_novel') {
                            setViewMode('game');
                        } else {
                            setViewMode('reader');
                        }
                    }
                }}
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

  // --- View 4: Game Engine (Visual Novel) ---
  if (viewMode === 'game' && activeVolume) {
      const chapter = activeVolume.chapters[currentChapterIndex];
      if (!chapter) {
          return <div className="p-8 text-center text-red-500 font-mono">ERROR: CHAPTER_DATA_MISSING</div>;
      }

      return (
          <>
            <VisualNovelPage 
                chapter={chapter}
                onNextChapter={() => {
                    if (currentChapterIndex < activeVolume.chapters.length - 1) {
                        const nextIndex = currentChapterIndex + 1;
                        setCurrentChapterIndex(nextIndex);
                        const nextChapter = activeVolume.chapters[nextIndex];
                        if (onChapterChange) onChapterChange(nextChapter.id);
                        
                        const effectiveMode = nextChapter.mode || readingMode;
                        
                        if (effectiveMode === 'standard') {
                            setViewMode('reader');
                        } else {
                            setViewMode('game');
                        }
                    }
                }}
                onPrevChapter={() => {
                    if (currentChapterIndex > 0) {
                        const prevIndex = currentChapterIndex - 1;
                        setCurrentChapterIndex(prevIndex);
                        const prevChapter = activeVolume.chapters[prevIndex];
                        if (onChapterChange) onChapterChange(prevChapter.id);

                        const effectiveMode = prevChapter.mode || readingMode;

                        if (effectiveMode === 'standard') {
                            setViewMode('reader');
                        } else {
                            setViewMode('game');
                        }
                    }
                }}
                onExit={() => {
                    if (onChapterChange) onChapterChange(null);
                    if (activeVolume.id === 'VOL_ORIGIN') {
                        setViewMode('prequel_view');
                    } else {
                        setViewMode('chapters');
                    }
                }}
                language={language}
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

  // --- View 5: Collab Star Reader (Special) ---
  if (viewMode === 'collab_reader' && activeVolume) {
      const chapter = activeVolume.chapters[currentChapterIndex];
      if (!chapter) {
          return <div className="p-8 text-center text-purple-500 font-mono">ERROR: SIGNAL_LOST</div>;
      }

      return (
          <CollabStarReader 
              chapter={chapter}
              onNextChapter={() => {
                  if (currentChapterIndex < activeVolume.chapters.length - 1) {
                      const nextIndex = currentChapterIndex + 1;
                      setCurrentChapterIndex(nextIndex);
                      const nextChapter = activeVolume.chapters[nextIndex];
                      if (onChapterChange) onChapterChange(nextChapter.id);
                      
                      const chapterMode = nextChapter.mode;

                      // Auto-switch back to Reader if next chapter prefers Standard mode
                      if (chapterMode === 'standard' || (readingMode === 'standard' && !chapterMode)) {
                          setViewMode('reader');
                      }
                  }
              }}
              onPrevChapter={() => {
                  if (currentChapterIndex > 0) {
                      const prevIndex = currentChapterIndex - 1;
                      setCurrentChapterIndex(prevIndex);
                      const prevChapter = activeVolume.chapters[prevIndex];
                      if (onChapterChange) onChapterChange(prevChapter.id);

                      const chapterMode = prevChapter.mode;

                      if (chapterMode === 'standard' || (readingMode === 'standard' && !chapterMode)) {
                          setViewMode('reader');
                      }
                  }
              }}
              onBack={() => {
                  if (onChapterChange) onChapterChange(null);
                  setViewMode('chapters');
              }}
              language={language}
              graphicsQuality={graphicsQuality}
          />
      );
  }

  return null;
};

export default SideStoriesPage;
