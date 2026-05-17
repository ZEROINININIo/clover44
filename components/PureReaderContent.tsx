import React, { useState } from 'react';
import { Chapter, Language, ReaderFont } from '../types';
import { getFontClass } from './fonts/fontConfig';
import { ChevronLeft, ChevronRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import MaskedText from './MaskedText';

interface PureReaderContentProps {
  chapter: Chapter | any; // allow sidestory chapters too
  language: Language;
  readerFont: ReaderFont;
  fontSize: number;
  onBack: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const parseRichText = (text: string) => {
  const parts = text.split(/(\[\[(?:MASK|GLITCH_GREEN|GREEN|VOID_VISION|VOID|GREY_MYSTIC|DANGER|BLUE|WHITE)::.*?\]\])/g);
  return parts.map((part, index) => {
    if (part.startsWith('[[MASK::') && part.endsWith(']]')) {
      const content = part.slice(8, -2);
      return <MaskedText key={index}>{content}</MaskedText>;
    } else if (part.startsWith('[[GLITCH_GREEN::') && part.endsWith(']]')) {
      const content = part.slice(16, -2);
      return <span key={index} className="text-green-400 font-bold drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">{content}</span>;
    } else if (part.startsWith('[[GREEN::') && part.endsWith(']]')) {
      const content = part.slice(9, -2);
      return <span key={index} className="text-green-400 font-medium">{content}</span>;
    } else if (part.startsWith('[[VOID::') && part.endsWith(']]')) {
      const content = part.slice(8, -2);
      return <span key={index} className="text-purple-400 font-bold">{content}</span>;
    } else if (part.startsWith('[[GREY_MYSTIC::') && part.endsWith(']]')) {
      const content = part.slice(15, -2);
      return <span key={index} className="text-neutral-400 font-bold drop-shadow-[0_0_8px_rgba(163,163,163,0.5)]">{content}</span>;
    } else if (part.startsWith('[[VOID_VISION::') && part.endsWith(']]')) {
      const content = part.slice(15, -2);
      return (
        <span key={index} className="block my-6 p-4 border-l-4 border-purple-500 bg-purple-900/20 text-purple-200 italic shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            {content}
        </span>
      );
    } else if (part.startsWith('[[DANGER::') && part.endsWith(']]')) {
      const content = part.slice(10, -2);
      return <span key={index} className="text-red-500 font-bold drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">{content}</span>;
    } else if (part.startsWith('[[BLUE::') && part.endsWith(']]')) {
      const content = part.slice(8, -2);
      return <span key={index} className="text-blue-400 font-bold">{content}</span>;
    } else if (part.startsWith('[[WHITE::') && part.endsWith(']]')) {
      const content = part.slice(9, -2);
      return <span key={index} className="text-white font-bold">{content}</span>;
    }
    return part;
  });
};

const PureVoidLog: React.FC<{ lines: string[]; language: Language }> = ({ lines, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hint = language === 'zh-CN' ? '[点击解码]' : language === 'zh-TW' ? '[點擊解碼]' : '[CLICK_TO_DECODE]';
  
  const idMatch = lines.length > 0 ? lines[0].match(/(\d{4}\.\d)Void>>/) : null;
  const voidId = idMatch ? idMatch[1] : '0000.2';

  return (
    <div className="my-6 border-l-4 border-purple-500 bg-purple-900/5 font-mono text-sm leading-relaxed text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-3 hover:bg-purple-900/10 text-purple-400 font-bold flex items-center justify-between transition-all group focus:outline-none"
      >
        <div className="flex items-center gap-3">
            <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
               <AlertTriangle size={16} />
            </div>
            <span className="tracking-widest opacity-80">&gt;&gt;&gt; SYSTEM_INTERCEPT // {voidId}_VOID</span>
        </div>
        <span className="opacity-50 text-xs group-hover:opacity-100 transition-opacity">{hint}</span>
      </button>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 text-gray-300 space-y-2 border-t border-purple-500/20">
            {lines.map((line, i) => {
                const cleanLine = line.replace(/\d{4}\.\dVoid>>/, '').replace(/【插入结束】|【插入結束】|\[INSERTION_END\]/g, '');
                if (!cleanLine.trim()) return <br key={i}/>;
                return (
                  <p key={i} className="border-l-2 border-purple-500/30 pl-3">
                      {cleanLine}
                  </p>
                );
            })}
        </div>
      </div>
    </div>
  );
};

const PureReaderContent: React.FC<PureReaderContentProps> = ({
  chapter,
  language,
  readerFont,
  fontSize,
  onBack,
  hasPrev,
  hasNext,
  onPrev,
  onNext
}) => {
  const t = chapter.translations[language] || chapter.translations['zh-CN'];
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapter]);

  const renderContent = (text: string) => {
      const lines = text.split('\n');
      const nodes = [];
      let textBuffer: string[] = [];
      let inVoidBlock = false;
      let voidBuffer: string[] = [];

      const flushTextBuffer = () => {
          if (textBuffer.length > 0) {
              const paragraph = textBuffer.join('\n');
              const className = "mb-6 text-justify indent-8 leading-relaxed text-[#c0c0c0]";
              nodes.push(<p key={`text-${nodes.length}`} className={className} style={{ fontSize: `${fontSize}px` }}>{parseRichText(paragraph)}</p>);
              textBuffer = [];
          }
      };

      for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmed = line.trim();

          if (!trimmed) {
              if (!inVoidBlock) {
                  flushTextBuffer();
                  nodes.push(<div key={`space-${i}`} className="h-4" />);
              } else {
                  voidBuffer.push(line);
              }
              continue;
          }

          const isVoidStart = trimmed.includes('Void>>');
          const isVoidEnd = trimmed.includes('[INSERTION_END]') || trimmed.includes('【插入结束】') || trimmed.includes('【插入結束】');

          if (isVoidStart) {
              flushTextBuffer();
              inVoidBlock = true;
              voidBuffer.push(line);
              if (isVoidEnd) {
                  inVoidBlock = false;
                  nodes.push(<PureVoidLog key={`void-${i}`} lines={[...voidBuffer]} language={language} />);
                  voidBuffer = [];
              }
              continue;
          }

          if (inVoidBlock) {
              voidBuffer.push(line);
              if (isVoidEnd) {
                  inVoidBlock = false;
                  nodes.push(<PureVoidLog key={`void-${i}`} lines={[...voidBuffer]} language={language} />);
                  voidBuffer = [];
              }
              continue;
          }

          if (trimmed === '[[DIVIDER]]') {
              flushTextBuffer();
              nodes.push(<div key={`div-${i}`} className="my-12 text-center text-gray-500 tracking-[0.5em]">///</div>);
              continue;
          }

          if (trimmed.startsWith('[[JUMP::') || trimmed.startsWith('[[IMAGE::')) {
              flushTextBuffer();
              continue;
          }

          textBuffer.push(line);
      }
      
      flushTextBuffer();
      return nodes;
  };

  return (
    <div className={`min-h-screen bg-ash-black text-ash-light ${getFontClass(readerFont)}`}>
        {/* Fixed Header */}
        <div className="sticky top-0 z-50 bg-ash-black/90 backdrop-blur-sm border-b border-ash-gray/30">
            <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
                <button 
                   onClick={onBack}
                   className="flex items-center gap-2 text-ash-gray hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                >
                    <ArrowLeft size={16} />
                    {language === 'en' ? 'Back to Directory' : '返回目录'}
                </button>
            </div>
        </div>

        {/* Content */}
        <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
            <header className="mb-16 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight tracking-tight">
                    {t.title}
                </h1>
                <div className="text-sm text-ash-gray font-mono">
                    {chapter.date && <span>{chapter.date}</span>}
                </div>
            </header>

            <article className="max-w-none text-ash-light">
                {renderContent(t.content)}
            </article>

            {/* Footer Navigation */}
            <footer className="mt-20 pt-10 border-t border-ash-gray/30 flex justify-between items-center">
                <button
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className={`flex items-center gap-2 px-6 py-3 rounded-md transition-colors border border-transparent ${
                        hasPrev ? 'hover:bg-ash-dark hover:border-ash-gray/30 text-white' : 'text-ash-dark border-transparent cursor-not-allowed'
                    }`}
                >
                    <ChevronLeft size={20} />
                    <span className="font-bold text-sm md:text-base uppercase tracking-widest">{language === 'en' ? 'Previous' : '上一章'}</span>
                </button>
                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={`flex items-center gap-2 px-6 py-3 rounded-md transition-colors border border-transparent ${
                        hasNext ? 'hover:bg-ash-dark hover:border-ash-gray/30 text-white' : 'text-ash-dark border-transparent cursor-not-allowed'
                    }`}
                >
                    <span className="font-bold text-sm md:text-base uppercase tracking-widest">{language === 'en' ? 'Next' : '下一章'}</span>
                    <ChevronRight size={20} />
                </button>
            </footer>
        </main>
    </div>
  );
};

export default PureReaderContent;
