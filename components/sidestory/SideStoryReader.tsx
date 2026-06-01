
import React, { useState, useRef, useEffect } from 'react';
import { SideStoryVolume, Language, ChapterTranslation } from '../../types';
import { ArrowLeft, List, FileText, ChevronLeft, ChevronRight, Image as ImageIcon, AlertTriangle, Radio, ArrowRight as ArrowRightIcon, Lock, Eye, ChevronDown } from 'lucide-react';
import Reveal from '../Reveal';
import MaskedText from '../MaskedText';
import { ReaderFont, getFontClass } from '../fonts/fontConfig';
// No read status to track

// --- Helper Components & Functions (Moved Outside) ---

const VoidVisionCard: React.FC<{ content: string; language: Language }> = ({ content, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Localization for the warning message
  const warningText = {
      'zh-CN': '剧透警告：涉及关键剧情信息，请确认后查看',
      'zh-TW': '剧透警告：涉及关键剧情信息，请确认后查看',
      'en': 'SPOILER ALERT: Contains critical plot information.'
  }[language] || 'SPOILER ALERT';

  const expandText = {
      'zh-CN': '点击展开',
      'zh-TW': '点击展开',
      'en': 'CLICK TO EXPAND'
  }[language] || 'CLICK TO EXPAND';

  return (
    <div className="my-8 md:my-10 relative group">
      {/* Container */}
      <div 
        className={`
            border-2 border-dashed transition-all duration-500 relative overflow-hidden flex flex-col
            border-indigo-500/60 bg-[#0c0a1f] text-indigo-200
            ${isExpanded ? 'shadow-[0_0_30px_rgba(99,102,241,0.15)]' : 'hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] cursor-pointer'}
        `}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        
        {/* Header Bar */}
        <div className={`
            flex items-center justify-between p-3 md:p-4 border-b border-indigo-500/20
            ${!isExpanded && 'bg-indigo-950/30'}
        `}>
            <div className="flex items-center gap-3">
                <Eye size={18} className={isExpanded ? "text-indigo-500" : "text-indigo-400 animate-pulse"} />
                <span className="font-mono text-xs md:text-sm font-black tracking-widest text-indigo-500 uppercase">
                    VOID_VISION // INTERCEPT
                </span>
            </div>
            
            {isExpanded && (
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                    className="p-1 hover:bg-indigo-500/10 rounded transition-colors"
                >
                    <ChevronDown size={16} className="rotate-180 text-indigo-400" />
                </button>
            )}
        </div>

        {/* Content Area (Collapsible) */}
        <div className={`
            transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
            ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
            <div className={`p-4 md:p-6 font-mono text-xs md:text-sm leading-relaxed tracking-wide bg-black/20`}>
                {/* Decorative Icon Background */}
                <div className="absolute right-0 bottom-0 p-4 opacity-[0.03] pointer-events-none">
                    <Eye size={120} />
                </div>
                
                <div className="relative z-10 whitespace-pre-wrap border-l-2 border-indigo-500/30 pl-4">
                    {content}
                </div>
                
                <div className="mt-4 pt-4 border-t border-dashed border-indigo-500/20 text-[10px] opacity-50 text-right uppercase">
                    // END OF VISION
                </div>
            </div>
        </div>

        {/* Collapsed Hint Overlay */}
        {!isExpanded && (
            <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center gap-2">
                <div className={`flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest animate-pulse text-indigo-300`}>
                    <AlertTriangle size={14} />
                    {warningText}
                </div>
                <div className={`text-[10px] font-mono opacity-60 uppercase tracking-[0.2em] mt-1 text-indigo-400`}>
                    [{expandText}]
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const parseRichText = (text: string, language: Language) => {
  const parts = text.split(/(\[\[(?:MASK|GLITCH_GREEN|GREEN|VOID|GREY_MYSTIC|DANGER|BLUE|WHITE|VOID_VISION)::.*?\]\])/g);
  return parts.map((part, index) => {
    if (part.startsWith('[[MASK::') && part.endsWith(']]')) {
      const content = part.slice(8, -2);
      return <MaskedText key={index}>{content}</MaskedText>;
    } else if (part.startsWith('[[GLITCH_GREEN::') && part.endsWith(']]')) {
      const content = part.slice(16, -2);
      return (
        <span key={index} className="text-emerald-400 font-black tracking-widest drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] inline-block animate-pulse relative px-1">
            <span className="absolute inset-0 animate-ping opacity-30 blur-sm bg-emerald-500/20 rounded-full"></span>
            <span className="relative z-10">{content}</span>
        </span>
      );
    } else if (part.startsWith('[[GREEN::') && part.endsWith(']]')) {
      const content = part.slice(9, -2);
      return (
        <span key={index} className="text-emerald-500 font-mono font-bold tracking-wide">
            {content}
        </span>
      );
    } else if (part.startsWith('[[VOID::') && part.endsWith(']]')) {
      const content = part.slice(8, -2);
      return (
        <span key={index} className="text-fuchsia-500 font-black tracking-widest drop-shadow-[0_0_10px_rgba(192,38,211,0.8)] inline-block animate-pulse relative px-1">
            <span className="absolute inset-0 animate-ping opacity-30 blur-sm bg-fuchsia-500/20 rounded-full"></span>
            <span className="relative z-10">{content}</span>
        </span>
      );
    } else if (part.startsWith('[[GREY_MYSTIC::') && part.endsWith(']]')) {
      const content = part.slice(15, -2);
      return (
        <span key={index} className="text-neutral-400 font-black tracking-widest drop-shadow-[0_0_10px_rgba(163,163,163,0.8)] inline-block animate-pulse relative px-1">
            <span className="absolute inset-0 animate-ping opacity-30 blur-sm bg-neutral-400/20 rounded-full"></span>
            <span className="relative z-10">{content}</span>
        </span>
      );
    } else if (part.startsWith('[[VOID_VISION::') && part.endsWith(']]')) {
      const content = part.slice(15, -2);
      return <VoidVisionCard key={index} content={content} language={language} />;
    } else if (part.startsWith('[[DANGER::') && part.endsWith(']]')) {
      const content = part.slice(10, -2);
      return (
        <span key={index} className="text-red-600 font-black animate-crash origin-left inline-block px-1">
            {content}
        </span>
      );
    } else if (part.startsWith('[[BLUE::') && part.endsWith(']]')) {
      const content = part.slice(8, -2);
      return (
        <span key={index} className="text-blue-400 font-bold px-1">
            {content}
        </span>
      );
    } else if (part.startsWith('[[WHITE::') && part.endsWith(']]')) {
      const content = part.slice(9, -2);
      return (
        <span key={index} className="text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse">
            {content}
        </span>
      );
    }
    
    // Bold Text Parsing (**text**)
    const boldParts = part.split(/(\*\*.*?\*\*)/g);
    if (boldParts.length > 1) {
         return (
            <span key={index}>
                {boldParts.map((bp, bIdx) => {
                    if (bp.startsWith('**') && bp.endsWith('**')) {
                        return <strong key={bIdx} className="font-black text-current">{bp.slice(2, -2)}</strong>;
                    }
                    return bp;
                })}
            </span>
         );
    }

    return part;
  });
};

const VoidLog: React.FC<{ lines: string[]; language: Language }> = ({ lines, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hint = language === 'zh-CN' ? '[点击解码]' : language === 'zh-TW' ? '[點擊解碼]' : '[CLICK_TO_DECODE]';
  
  // Extract ID from the first line (e.g., 0000.2, 0600.0)
  const idMatch = lines.length > 0 ? lines[0].match(/(\d{4}\.\d)Void>>/) : null;
  const voidId = idMatch ? idMatch[1] : '0000.2';

  return (
    <Reveal>
      <div className="my-6 md:my-10 border-l-4 border-fuchsia-600 bg-fuchsia-950/10 font-mono text-xs md:text-sm shadow-[0_0_15px_-3px_rgba(192,38,211,0.2)]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-3 md:p-4 bg-fuchsia-950/20 hover:bg-fuchsia-900/30 text-fuchsia-300 font-bold flex items-center gap-3 transition-all group border-b border-fuchsia-500/20 focus:outline-none"
        >
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
             <AlertTriangle size={16} />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
             <span className="animate-pulse tracking-widest text-fuchsia-400 text-[10px] md:text-xs">&gt;&gt;&gt; SYSTEM_INTERCEPT // {voidId}_VOID</span>
             <span className="text-[10px] bg-fuchsia-900/50 px-1 border border-fuchsia-500/30 text-fuchsia-200/70">
                SOURCE: UNKNOWN
             </span>
          </div>
          <span className="ml-auto opacity-50 text-[10px] group-hover:opacity-100 transition-opacity font-mono">{hint}</span>
        </button>
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 md:p-6 text-fuchsia-100/90 space-y-2 leading-relaxed tracking-wide font-medium bg-black/20 backdrop-blur-sm">
              {lines.map((line, i) => {
                  const cleaned = line.replace(/\d{4}\.\dVoid>>|【插入结束】|【插入結束】|\[INSERTION_END\]/g, '');
                  if (!cleaned.trim()) return <div key={i} className="h-4"></div>;
                  return (
                    <div key={i} className="border-l border-fuchsia-500/20 pl-3 hover:border-fuchsia-500 hover:bg-fuchsia-500/5 transition-colors duration-300">
                        {parseRichText(cleaned, language)}
                    </div>
                  );
              })}
          </div>
        </div>
      </div>
    </Reveal>
  );
};

// --- Main Component ---

interface SideStoryReaderProps {
  volume: SideStoryVolume;
  currentIndex: number;
  onBack: () => void;
  language: Language;
  readerFont: ReaderFont;
  fontSize: number;
  onOpenTerminal?: (scriptId: string) => void;
  onJump?: (targetId: string) => void;
  onChapterChange?: (index: number) => void;
}

const SideStoryReader: React.FC<SideStoryReaderProps> = ({ volume, currentIndex, onBack, language, readerFont, fontSize, onOpenTerminal, onJump, onChapterChange }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(currentIndex);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    setCurrentChapterIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [currentChapterIndex]);

  const currentChapter = volume.chapters[currentChapterIndex];
  
  // Register Read Status
  useEffect(() => {
      // Do nothing
  }, [currentChapter]);

  // Auto-trigger terminal if special chapter is loaded
  useEffect(() => {
      // Use optional chaining to safely access id
      if (currentChapter?.id === 'special-terminal-discovery' && onOpenTerminal) {
          onOpenTerminal('T001');
      }
  }, [currentChapter?.id, onOpenTerminal]); // Depend on optional ID

  // Guard against undefined chapter
  if (!currentChapter) {
      return (
        <div className="flex h-full items-center justify-center bg-ash-black text-ash-gray font-mono flex-col gap-4">
            <AlertTriangle size={48} className="text-red-500 mb-2" />
            <div>Error: Chapter not found (Index: {currentChapterIndex})</div>
            <button onClick={onBack} className="border border-ash-gray px-4 py-2 hover:bg-ash-gray hover:text-ash-black transition-colors">
                RETURN TO LIST
            </button>
        </div>
      );
  }

  const translation: ChapterTranslation = currentChapter.translations[language] || currentChapter.translations['zh-CN'];
  const isLegacy = currentChapter.id === 'special-legacy-dusk';
  const isDiary = currentChapter.id === 'story-byaki-diary'; 

  const handleNext = () => {
      if (currentChapterIndex < volume.chapters.length - 1) {
          const nextIndex = currentChapterIndex + 1;
          if (onChapterChange) {
              onChapterChange(nextIndex);
          } else {
              setCurrentChapterIndex(nextIndex);
          }
      }
  };

  const handlePrev = () => {
      if (currentChapterIndex > 0) {
          const prevIndex = currentChapterIndex - 1;
          if (onChapterChange) {
              onChapterChange(prevIndex);
          } else {
              setCurrentChapterIndex(prevIndex);
          }
      }
  };

  const renderContent = (text: string) => {
    const smartJoin = (lines: string[]) => {
      if (lines.length === 0) return '';
      return lines.reduce((acc, curr, idx) => {
        if (idx === 0) return curr;
        const prev = lines[idx - 1];
        const prevChar = prev[prev.length - 1];
        const currChar = curr[0];
        const cjkRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
        if (cjkRegex.test(prevChar) || cjkRegex.test(currChar)) return acc + curr;
        return acc + ' ' + curr;
      }, '');
    };

    const lines = text.split('\n');
    const nodes: React.ReactNode[] = [];
    let textBuffer: string[] = [];
    let inVoidBlock = false;
    let voidBuffer: string[] = [];

    const flushTextBuffer = () => {
        if (textBuffer.length > 0) {
            const joinedText = smartJoin(textBuffer);
            
            // --- Feature: Comms Channel Card Detection ---
            const commsMatch = joinedText.match(/^(.+?)[（\(](?:通信频道|Comms Channel|通信頻道)[）\)](?:[:：])\s*(.*)/);
            if (commsMatch) {
                const speaker = commsMatch[1].trim();
                const content = commsMatch[2].trim();
                nodes.push(
                    <Reveal key={`comms-${nodes.length}`}>
                        <div className={`my-6 md:my-8 border-l-2 bg-ash-dark/50 border-ash-light text-ash-light p-4 relative overflow-hidden font-mono text-xs md:text-sm`}>
                            {/* Decorative Background */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,currentColor_5px,currentColor_10px)] pointer-events-none"></div>
                            
                            {/* Header */}
                            <div className={`flex items-center gap-2 mb-2 opacity-70 border-b border-dashed pb-2 border-ash-gray`}>
                                <Radio size={14} className="animate-pulse" />
                                <span className="font-bold tracking-widest uppercase">INCOMING // {speaker}</span>
                                <div className="ml-auto flex gap-1">
                                    <span className="w-1 h-3 bg-current opacity-30 animate-[pulse_1s_infinite]"></span>
                                    <span className="w-1 h-3 bg-current opacity-60 animate-[pulse_1.2s_infinite]"></span>
                                    <span className="w-1 h-3 bg-current opacity-90 animate-[pulse_0.8s_infinite]"></span>
                                </div>
                            </div>
                            
                            {/* Message */}
                            <div className="leading-relaxed whitespace-pre-wrap relative z-10">
                                {parseRichText(content, language)}
                            </div>
                        </div>
                    </Reveal>
                );
                textBuffer = [];
                return;
            }
            // ---------------------------------------------

            // --- Feature: Network Chat Card Detection ---
            const chatMatch = joinedText.match(/^【(.+?)】(?:[:：])\s*(.*)/);
            if (chatMatch) {
                const speaker = chatMatch[1].trim();
                const content = chatMatch[2].trim();
                
                let speakerColor = 'text-ash-light';
                let borderColor = 'border-ash-gray';
                let bgColor = 'bg-ash-dark/50';
                
                if (speaker === '芷漓' || speaker === 'Zeri') {
                    speakerColor = 'text-pink-400';
                    borderColor = 'border-pink-500/50';
                    bgColor = 'bg-pink-950/20';
                } else if (speaker === '泽洛' || speaker === 'Zelo' || speaker === '澤洛') {
                    speakerColor = 'text-blue-400';
                    borderColor = 'border-blue-500/50';
                    bgColor = 'bg-blue-950/20';
                } else if (speaker === '零点' || speaker === 'Point' || speaker === '零點') {
                    speakerColor = 'text-white';
                    borderColor = 'border-white/50';
                    bgColor = 'bg-white/5';
                } else if (speaker === '白栖' || speaker === 'Byaki' || speaker === '白棲') {
                    speakerColor = 'text-emerald-400';
                    borderColor = 'border-emerald-500/50';
                    bgColor = 'bg-emerald-950/20';
                }

                nodes.push(
                    <Reveal key={`chat-${nodes.length}`}>
                        <div className={`my-2 md:my-3 border-l-4 ${borderColor} ${bgColor} text-ash-light p-3 md:p-4 relative overflow-hidden font-mono text-xs md:text-sm rounded-r-md`}>
                            {/* Decorative Background */}
                            <div className="absolute inset-0 opacity-[0.02] bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,currentColor_5px,currentColor_10px)] pointer-events-none"></div>
                            
                            {/* Header */}
                            <div className={`flex items-center gap-2 mb-1`}>
                                <span className={`font-bold tracking-widest ${speakerColor}`}>[{speaker}]</span>
                            </div>
                            
                            {/* Message */}
                            <div className="leading-relaxed whitespace-pre-wrap relative z-10 pl-2">
                                {parseRichText(content, language)}
                            </div>
                        </div>
                    </Reveal>
                );
                textBuffer = [];
                return;
            }
            // ---------------------------------------------

            let className = `mb-4 md:mb-8 text-justify indent-6 md:indent-12 text-xs md:text-base leading-relaxed text-white transition-colors ${getFontClass(readerFont)}`;
            
            if (isLegacy) {
                className = "mb-4 md:mb-8 text-justify indent-6 md:indent-12 font-mono text-xs md:text-base leading-relaxed text-blue-200 legacy-text";
            } else if (isDiary) {
                className = `mb-4 md:mb-8 text-justify indent-6 md:indent-12 text-xs md:text-base leading-relaxed text-emerald-100 drop-shadow-[0_0_8px_rgba(192,38,211,0.6)] ${getFontClass(readerFont)}`;
            } else {
                if (/^(零点|Point|零點)(:|：|\(|（)/.test(joinedText)) {
                    className = `mb-4 md:mb-8 text-justify indent-6 md:indent-12 text-xs md:text-base leading-relaxed text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] ${getFontClass(readerFont)}`;
                } else if (/^(芷漓|Zeri)(:|：|\(|（)/.test(joinedText)) {
                    className = `mb-4 md:mb-8 text-justify indent-6 md:indent-12 text-xs md:text-base leading-relaxed text-pink-400 drop-shadow-[0_0_2px_rgba(244,114,182,0.4)] ${getFontClass(readerFont)}`;
                } else if (/^(泽洛|Zelo|澤洛)(:|：|\(|（)/.test(joinedText)) {
                    className = `mb-4 md:mb-8 text-justify indent-6 md:indent-12 text-xs md:text-base leading-relaxed text-blue-400 drop-shadow-[0_0_2px_rgba(96,165,250,0.4)] ${getFontClass(readerFont)}`;
                } else if (/^(白栖|Byaki|白棲)(:|：|\(|（)/.test(joinedText)) {
                    className = `mb-4 md:mb-8 text-justify indent-6 md:indent-12 text-xs md:text-base leading-relaxed text-emerald-400 drop-shadow-[0_0_2px_rgba(52,211,153,0.4)] ${getFontClass(readerFont)}`;
                } else if (/^(\?\?\?|Void|void)(:|：|\(|（|>)/.test(joinedText)) {
                    className = `mb-4 md:mb-8 text-justify indent-6 md:indent-12 text-xs md:text-base leading-relaxed text-white drop-shadow-[0_0_5px_rgba(192,38,211,0.5)] ${getFontClass(readerFont)}`;
                }
            }

            nodes.push(
                <Reveal key={`p-${nodes.length}`}>
                    <div className={className} style={{ fontSize: `${fontSize}px` }}>
                        {parseRichText(joinedText, language)}
                    </div>
                </Reveal>
            );
            textBuffer = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Use regex for flexible detection of interference level (0000.2, 0600.0, etc)
        const isVoidStart = /\d{4}\.\dVoid>>/.test(trimmed);
        const isVoidEnd = /【插入结束】|【插入結束】|\[INSERTION_END\]/.test(trimmed);

        // 1. Check for VOID block
        if (isVoidStart) {
            flushTextBuffer();
            
            // Fix: If already inside a void block and hitting a new start, flush the previous one.
            if (inVoidBlock && voidBuffer.length > 0) {
                 nodes.push(<VoidLog key={`void-${i}-prev`} lines={[...voidBuffer]} language={language} />);
                 voidBuffer = [];
            }

            inVoidBlock = true;
            voidBuffer = [line];
            
            // Check for closing tag on the same line
            if (isVoidEnd) { 
                inVoidBlock = false; 
                nodes.push(<VoidLog key={`void-${i}`} lines={[...voidBuffer]} language={language} />); 
                voidBuffer = []; 
            }
            continue;
        }
        if (inVoidBlock) {
            voidBuffer.push(line);
            if (isVoidEnd) { 
                inVoidBlock = false; 
                nodes.push(<VoidLog key={`void-${i}`} lines={[...voidBuffer]} language={language} />); 
                voidBuffer = []; 
            }
            continue;
        }

        // 2. Check for Divider (New)
        if (trimmed === '[[DIVIDER]]') {
            flushTextBuffer();
            nodes.push(
                <Reveal key={`div-${i}`} className="py-8 md:py-12 w-full flex items-center justify-center opacity-40 select-none">
                     <div className="h-px bg-gradient-to-r from-transparent via-current to-transparent w-1/3 md:w-1/4"></div>
                     <div className="mx-4 font-mono text-[10px] tracking-[0.5em] text-current">///</div>
                     <div className="h-px bg-gradient-to-r from-transparent via-current to-transparent w-1/3 md:w-1/4"></div>
                </Reveal>
            );
            continue;
        }

        // 3. Check for Jump Tag
        const isJump = trimmed.startsWith('[[JUMP::') && trimmed.endsWith(']]');
        if (isJump) {
            flushTextBuffer();
            const content = trimmed.slice(8, -2);
            const [volId, label] = content.split('::');
            nodes.push(
                <Reveal key={`jump-${i}`} className="my-8 md:my-12 flex justify-center w-full">
                    <button 
                        onClick={() => onJump && onJump(volId)}
                        className={`
                            group relative px-8 py-4 border-2 transition-all duration-300 overflow-hidden shadow-hard hover:-translate-y-1
                            bg-ash-black border-ash-light text-ash-light hover:bg-ash-light hover:text-ash-black
                        `}
                    >
                        <div className="relative z-10 flex items-center gap-3 font-black uppercase tracking-widest text-sm md:text-base font-mono">
                            <AlertTriangle size={18} className="animate-pulse" />
                            {label}
                            <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                        {/* Decorative Grid Overlay */}
                        <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none group-hover:opacity-10 transition-opacity"></div>
                    </button>
                </Reveal>
            );
            continue;
        }

        // 4. Check for Image Tag (Improved Detection)
        const isImage = trimmed.startsWith('[[IMAGE::') && trimmed.endsWith(']]');
        if (isImage) {
            flushTextBuffer();
            const content = trimmed.slice(9, -2);
            const [src, ...captionParts] = content.split('::');
            const caption = captionParts.join('::'); // Re-join in case caption has ::
            
            nodes.push(
                <Reveal key={`img-${i}`} className="my-8 md:my-12 flex flex-col items-center w-full">
                    <div className="relative border-2 md:border-4 border-ash-light p-1 md:p-2 bg-ash-dark max-w-full shadow-hard">
                        <img 
                            src={src} 
                            alt={caption} 
                            className="relative max-h-[400px] md:max-h-[600px] w-auto object-cover block grayscale-[20%] hover:grayscale-0 transition-all duration-500 select-none" 
                            onContextMenu={(e) => e.preventDefault()}
                            draggable={false}
                        />
                        <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>
                        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-ash-light text-ash-black px-2 md:px-3 py-0.5 md:py-1 text-[8px] md:text-[10px] font-mono font-bold border border-ash-black flex items-center gap-1 md:gap-2 uppercase">
                            <ImageIcon size={10} /> {caption}
                        </div>
                    </div>
                </Reveal>
            );
            continue;
        }

        // 5. Check if the current line starts a new chat or comms message
        const isChatStart = /^【.+?】(?:[:：])/.test(trimmed);
        const isCommsStart = /^.+?[（\(](?:通信频道|Comms Channel|通信頻道)[）\)](?:[:：])/.test(trimmed);

        if (isChatStart || isCommsStart) {
            flushTextBuffer();
        }

        // 6. Regular text processing (Empty line or normal text)
        if (!trimmed) { flushTextBuffer(); continue; }
        
        textBuffer.push(trimmed);
    }
    flushTextBuffer();
    // Flush remaining void buffer if file ends unexpectedly
    if (inVoidBlock && voidBuffer.length > 0) {
         nodes.push(<VoidLog key={`void-eof`} lines={[...voidBuffer]} language={language} />);
    }
    return nodes;
  };

  return (
    <div className={`flex fixed inset-0 overflow-hidden bg-retro-paper text-ash-light`}>
      {/* Clover Theme Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-5 bg-gradient-to-br from-emerald-900 to-emerald-950">
        <div className="absolute top-[-10%] left-[-10%] text-[40vw] text-emerald-400 rotate-12">♣</div>
        <div className="absolute bottom-[-10%] right-[-10%] text-[30vw] text-emerald-500 rotate-[-15deg]">♣</div>
        <div className="absolute top-[30%] right-[20%] text-[10vw] text-emerald-300 rotate-45">♣</div>
      </div>
      
      {/* Return Button */}
      <button 
          onClick={onBack}
          className="fixed top-4 left-4 md:top-6 md:left-6 z-50 p-2 md:p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 hover:text-emerald-100 hover:border-emerald-500 hover:bg-emerald-900 shadow-[0_0_15px_rgba(4,120,87,0.3)] backdrop-blur transition-all flex items-center justify-center group"
      >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> 
      </button>

      <main ref={mainRef} className="flex-1 w-full overflow-y-auto scroll-smooth relative z-10 custom-scrollbar pb-24 lg:pb-0">
        <div key={currentChapterIndex} className="max-w-4xl mx-auto min-h-full bg-emerald-950/80 backdrop-blur-sm border-l-0 md:border-l-2 md:border-r-2 border-emerald-900/50 shadow-[0_0_50px_rgba(4,120,87,0.1)] relative animate-slide-in">
          {currentChapter.status === 'locked' ? (
              <div className="h-[80vh] flex flex-col items-center justify-center text-ash-gray p-8 text-center"><h2 className="text-xl font-black uppercase text-red-700 tracking-widest mb-2">Access Denied</h2></div>
          ) : (
            <>
                <div className="px-4 py-8 md:px-16 md:py-12 border-b-4 border-double border-emerald-900/50 bg-emerald-950 text-emerald-100 mt-8 md:mt-0 landscape:py-6 relative overflow-hidden">
                    {/* Floating Clover in Header */}
                    <div className="absolute top-4 right-4 text-emerald-800/30 text-6xl rotate-12 pointer-events-none">♣</div>
                    
                    <Reveal>
                    <div className="flex justify-between items-start mb-3 md:mb-6 font-mono text-[8px] md:text-[10px] text-emerald-500 uppercase tracking-widest relative z-10">
                        <span>NOVA_ARCHIVE // {currentChapter.id}</span>
                        <span>PG_INDEX: {currentChapterIndex + 1}</span>
                    </div>
                    <h1 className={`text-2xl md:text-5xl font-black mb-3 md:mb-6 uppercase tracking-tighter leading-tight ${getFontClass(readerFont)} landscape:text-xl relative z-10`}>{translation.title}</h1>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-900/50 px-3 py-0.5 border border-emerald-800 relative z-10 inline-flex"><FileText size={12} /><span>{currentChapter.date}</span></div>
                    </Reveal>
                </div>
                <article className={`px-4 py-8 md:px-16 md:py-12 max-w-none text-emerald-50/90 leading-loose tracking-wide ${getFontClass(readerFont)} landscape:py-6`}>{renderContent(translation.content)}</article>
                
                <div className="p-4 md:p-16 border-t-4 border-double border-emerald-900/50 bg-emerald-950/50 landscape:p-4">
                    <div className="flex justify-between items-center gap-2 md:gap-4">
                        <button onClick={handlePrev} disabled={currentChapterIndex === 0} className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 py-3 md:px-6 md:py-4 border-2 border-emerald-900 text-emerald-600 hover:bg-emerald-900 hover:text-emerald-100 transition-colors uppercase font-bold text-[10px] md:text-sm font-mono disabled:opacity-30"><ChevronLeft size={14} /> PREV</button>
                        <button onClick={handleNext} disabled={currentChapterIndex === volume.chapters.length - 1} className="flex-1 flex items-center justify-center gap-1 md:gap-2 px-3 py-3 md:px-6 md:py-4 border-2 border-emerald-900 text-emerald-600 hover:bg-emerald-900 hover:text-emerald-100 transition-colors uppercase font-bold text-[10px] md:text-sm font-mono disabled:opacity-30">NEXT <ChevronRight size={14} /></button>
                    </div>
                </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SideStoryReader;
