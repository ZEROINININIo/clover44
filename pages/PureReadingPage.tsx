import React, { useState, useMemo, useEffect } from 'react';
import { novelData } from '../data/novelData';
import { sideStoryVolumes, prequelVolumes } from '../data/sideStories';
import { TIMELINE_GROUPS } from '../data/timelineData';
import { Chapter, Language, ReaderFont } from '../types';
import { FileText, ArrowLeft, BookOpen, ChevronRight, Settings } from 'lucide-react';
import { getFontClass } from '../components/fonts/fontConfig';
import PureReaderContent from '../components/PureReaderContent';
import VisualNovelPage from './VisualNovelPage';
import { hasRead } from '../utils/readStatus';

interface PureReadingPageProps {
  language: Language;
  readerFont: ReaderFont;
  fontSize: number;
  onExit: () => void;
}

const PureReadingPage: React.FC<PureReadingPageProps> = ({
  language,
  readerFont,
  fontSize,
  onExit
}) => {
  const [readingContext, setReadingContext] = useState<{ list: Chapter[], index: number } | null>(null);
  
  // Check PB prerequisite
  const [hasPrereq, setHasPrereq] = useState(false);
  useEffect(() => {
      let isA003Read = hasRead('story-rematerialization');
      let isF014Read = hasRead('story-variable-end');
      if (!isA003Read || !isF014Read) {
          try {
              const history = JSON.parse(localStorage.getItem('nova_history') || '[]');
              if (!isA003Read) isA003Read = history.some((h: any) => h.chapterId === 'story-rematerialization');
              if (!isF014Read) isF014Read = history.some((h: any) => h.chapterId === 'story-variable-end');
          } catch {
              // ignore
          }
      }
      setHasPrereq(isA003Read && isF014Read);
  }, []);

  const allChaptersMap = useMemo(() => {
      const map = new Map<string, Chapter>();
      novelData.chapters.forEach(c => map.set(c.id, c));
      sideStoryVolumes.forEach(vol => vol.chapters.forEach(c => map.set(c.id, c)));
      prequelVolumes.forEach(vol => vol.chapters.forEach(c => map.set(c.id, c)));
      return map;
  }, []);

  const recommendedChapters = useMemo(() => {
      const ids = [
          "story-rare-vacation",
          "story-overtime-bad-civ",
          "story-rematerialization",
          "PB-001",
          "PB-002",
          "story-main-004-debt",
          "story-main-005-departure",
          "story-main-006-reunion",
          "story-ghost-analysis-1",
          "story-ghost-analysis-2",
          "story-ghost-analysis-3",
          "story-ghost-analysis-4",
          "story-ghost-analysis-5",
          "story-ghost-analysis-6",
          "story-ghost-analysis-7",
          "story-gr-001",
          ...TIMELINE_GROUPS[0].chapterIds, // Analysis Vestiges (P-00)
          "locked-chapter-007",
          "locked-chapter-008",
      ];
      return ids.map(id => allChaptersMap.get(id)).filter(Boolean) as Chapter[];
  }, [allChaptersMap]);

  const otherSideStories = useMemo(() => {
      return [
          ...sideStoryVolumes.filter(v => ['VOL_GHOST_ANALYSIS', 'VOL_PB'].indexOf(v.id) === -1),
          ...prequelVolumes
      ];
  }, []);

  if (readingContext !== null) {
      const chapter = readingContext.list[readingContext.index];
      
      const handleNext = () => setReadingContext({ list: readingContext.list, index: readingContext.index + 1 });
      const handlePrev = () => setReadingContext({ list: readingContext.list, index: readingContext.index - 1 });
      const handleBack = () => setReadingContext(null);

      if (chapter.mode === 'visual_novel') {
          return (
              <div className="h-full w-full absolute inset-0 z-50 bg-black">
                  <VisualNovelPage
                      chapter={chapter}
                      onNextChapter={readingContext.index < readingContext.list.length - 1 ? handleNext : handleBack}
                      onPrevChapter={readingContext.index > 0 ? handlePrev : handleBack}
                      onExit={handleBack}
                      language={language}
                  />
              </div>
          );
      }

      return (
          <PureReaderContent
              chapter={chapter}
              language={language}
              readerFont={readerFont}
              fontSize={fontSize}
              onBack={handleBack}
              hasPrev={readingContext.index > 0}
              hasNext={readingContext.index < readingContext.list.length - 1}
              onPrev={handlePrev}
              onNext={handleNext}
          />
      );
  }

  // Otherwise, show the pure directory
  return (
    <div className={`min-h-screen bg-ash-black text-ash-light ${getFontClass(readerFont)}`}>
      <header className="max-w-4xl mx-auto px-6 py-8 border-b border-ash-gray/30 flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
               <BookOpen size={28} className="text-cyan-400" />
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  {language === 'en' ? 'PURE READING' : '纯净阅读'}
               </span>
           </h1>
           <p className="text-sm text-ash-gray mt-2 tracking-widest uppercase font-mono">
               {language === 'en' ? 'A distraction-free reading experience' : '沉浸式纯文字阅读体验'}
           </p>
        </div>
        <button 
           onClick={onExit}
           className="px-5 py-2.5 flex items-center gap-2 text-sm font-bold border border-cyan-500/50 text-cyan-400 bg-cyan-950/20 rounded shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-cyan-500 hover:text-ash-black transition-all"
        >
           <Settings size={16} />
           {language === 'en' ? 'EXIT PURE MODE' : '退出纯净模式'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="space-y-16">
              {/* Main Story Directory (Recommended Order) */}
              <section>
                  <div className="border-b-2 border-ash-gray/50 pb-2 mb-6 uppercase tracking-wider flex items-center gap-3">
                      <div className="p-2 bg-ash-dark border border-ash-gray/30 rounded">
                         <FileText size={20} className="text-cyan-400" />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                         <div>
                             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                 {language === 'en' ? 'Timeline Sequence' : '主轴阅读序列'}
                             </h2>
                             <div className="text-xs font-mono text-ash-gray mt-0.5">
                                 {language === 'en' ? 'Recommended intertwined reading order' : '推荐交织阅读顺序 (含析界、午夜十二时)'}
                             </div>
                         </div>
                         <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/50 text-cyan-400 bg-cyan-500/10 self-start mt-1">
                             {language === 'en' ? 'ONGOING' : '连载中'}
                         </span>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {recommendedChapters.map((chapter, index) => {
                          const isGhost = chapter.id.startsWith('story-ghost-analysis');
                          const isPB = chapter.id.startsWith('PB');
                          const isP00 = TIMELINE_GROUPS[0].chapterIds.includes(chapter.id);
                          const isSideStory = isGhost || isPB || isP00;
                          
                          let isLocked = chapter.status === 'locked';
                          if (isPB && !hasPrereq) {
                              isLocked = true;
                          }

                          const t = chapter.translations[language] || chapter.translations['zh-CN'];
                          
                          const isFirstP00 = isP00 && chapter.id === TIMELINE_GROUPS[0].chapterIds[0];

                          let bgOverride = '';
                          if (!isLocked) {
                              if (isGhost) bgOverride = 'border-slate-500/30 bg-slate-900/40 hover:border-slate-400/50 hover:bg-slate-800/60 hover:shadow-[0_0_15px_rgba(148,163,184,0.1)]';
                              else if (isPB) bgOverride = 'border-indigo-500/30 bg-indigo-900/20 hover:border-indigo-400/50 hover:bg-indigo-900/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]';
                              else if (isP00) bgOverride = 'border-slate-500/30 bg-slate-900/20 hover:border-slate-400/50 hover:bg-slate-900/40 hover:shadow-[0_0_15px_rgba(148,163,184,0.1)]';
                              else bgOverride = 'border-ash-gray/30 bg-ash-dark/40 hover:border-cyan-500/50 hover:bg-ash-dark hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]';
                          }

                          let IndicatorColor = '';
                          if (isGhost || isP00) IndicatorColor = 'bg-slate-500/50';
                          else if (isPB) IndicatorColor = 'bg-indigo-500/50';

                          let TextColor = 'text-ash-light group-hover:text-white';
                          if (isGhost) TextColor = 'text-slate-300 group-hover:text-slate-200';
                          else if (isPB) TextColor = 'text-indigo-300 group-hover:text-indigo-200';
                          else if (isP00) TextColor = 'text-slate-400 group-hover:text-slate-300';
                          
                          let IconColor = 'text-ash-gray group-hover:text-cyan-400';
                          if (isGhost || isP00) IconColor = 'text-slate-500 group-hover:text-slate-400';
                          else if (isPB) IconColor = 'text-indigo-500 group-hover:text-indigo-400';

                          return (
                              <React.Fragment key={chapter.id}>
                                  {isFirstP00 && (
                                     <div className="col-span-1 md:col-span-2 flex items-center gap-4 py-4 opacity-70">
                                         <div className="flex flex-col h-full ml-4 w-4 relative">
                                            <div className="absolute bottom-1/2 left-0 w-full border-t-2 border-slate-500/50 rounded-tl-lg"></div>
                                            <div className="absolute bottom-1/2 left-0 h-[200px] border-l-2 border-slate-500/50"></div>
                                         </div>
                                         <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">{language === 'en' ? 'BRANCH: P-00_ANALYSIS_VESTIGES' : '并行支线连接: 析界余痕 P-00'}</span>
                                         <div className="flex-1 border-t-2 border-dashed border-slate-500/30"></div>
                                     </div>
                                  )}
                                  <button
                                      onClick={() => !isLocked && setReadingContext({ list: recommendedChapters, index })}
                                      disabled={isLocked}
                                      className={`w-full text-left py-3 px-4 ${isP00 ? 'ml-0 md:ml-8 w-full md:w-[calc(100%-2rem)]' : ''} rounded border transition-colors flex items-center justify-between group relative overflow-hidden backdrop-blur-sm
                                          ${isLocked 
                                              ? 'border-red-900/30 bg-red-950/10 text-red-900/50 cursor-not-allowed' 
                                              : bgOverride
                                          }`}
                                  >
                                      {isSideStory && !isLocked && IndicatorColor && (
                                         <div className={`absolute left-0 top-0 bottom-0 w-1 ${IndicatorColor}`}></div>
                                      )}
                                      <div className="flex-1 truncate pl-1 flex items-center gap-3">
                                          <div className="flex flex-col items-center justify-center min-w-[24px]">
                                              <span className="text-xs font-mono opacity-50 text-ash-gray">
                                                  {String(index + 1).padStart(2, '0')}
                                              </span>
                                              {isP00 && <span className="text-[8px] font-mono font-bold mt-0.5 opacity-70 text-slate-400">P-00</span>}
                                          </div>
                                          <span className={`font-medium text-base ${isLocked ? '' : TextColor}`}>
                                              {isLocked ? (language === 'en' ? '[ CORRUPTED ]' : '[ 数据受损 ]') : t.title}
                                          </span>
                                      </div>
                                      {!isLocked && <ChevronRight size={16} className={`transition-colors ${IconColor}`} />}
                                  </button>
                              </React.Fragment>
                          );
                      })}
                  </div>
              </section>

              {/* Side Stories Directory */}
              <section>
                  <div className="border-b-2 border-ash-gray/50 pb-2 mb-6 uppercase tracking-wider flex items-center gap-3">
                      <div className="p-2 bg-ash-dark border border-ash-gray/30 rounded">
                         <FileText size={20} className="text-purple-400" />
                      </div>
                      <div>
                         <h2 className="text-xl font-bold text-white">
                             {language === 'en' ? 'Archives & Sidestories' : '其他档案与支线'}
                         </h2>
                         <div className="text-xs font-mono text-ash-gray mt-0.5">
                             {language === 'en' ? 'Independent or branching records' : '独立记录与分支档案'}
                         </div>
                      </div>
                  </div>
                  <div className="space-y-8">
                     {otherSideStories.map(vol => {
                         const volTitle = language === 'en' && vol.titleEn ? vol.titleEn : vol.title;
                         return (
                             <div key={vol.id} className="bg-ash-dark/30 rounded-lg p-6 border border-ash-gray/20">
                                 <div className="flex items-center justify-between mb-4">
                                     <h3 className="text-lg font-bold text-ash-light flex items-center gap-2">
                                         {volTitle}
                                     </h3>
                                     {vol.completed !== undefined ? (
                                         <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${vol.completed ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' : 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'}`}>
                                             {vol.completed 
                                                ? (language === 'en' ? 'COMPLETED' : '已完结') 
                                                : (language === 'en' ? 'ONGOING' : '连载中')}
                                         </span>
                                     ) : (
                                         <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/50 text-cyan-400 bg-cyan-500/10">
                                             {language === 'en' ? 'ONGOING' : '连载中'}
                                         </span>
                                     )}
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-t border-ash-gray/20 pt-4">
                                     {vol.chapters.map((chap, chapIndex) => {
                                         const isLocked = chap.status === 'locked';
                                         const t = chap.translations[language] || chap.translations['zh-CN'];
                                         
                                         const isDaily = vol.id === 'VOL_DAILY';
                                         let dailyStyles = '';
                                         let IndicatorColor = '';
                                         let phaseLabel = '';
                                         
                                         if (isDaily && !isLocked) {
                                             const group = TIMELINE_GROUPS.find(g => g.chapterIds.includes(chap.id));
                                             if (group) {
                                                 if (group.id === 'phase-0') {
                                                     dailyStyles = 'border-slate-500/30 bg-slate-900/20 hover:border-slate-400/50 hover:bg-slate-900/40 hover:shadow-[0_0_15px_rgba(148,163,184,0.1)]';
                                                     IndicatorColor = 'bg-slate-500/50';
                                                     phaseLabel = 'P-00';
                                                 } else if (group.id === 'phase-1') {
                                                     dailyStyles = 'border-fuchsia-500/30 bg-fuchsia-900/20 hover:border-fuchsia-400/50 hover:bg-fuchsia-900/40 hover:shadow-[0_0_15px_rgba(217,70,239,0.15)]';
                                                     IndicatorColor = 'bg-fuchsia-500/50';
                                                     phaseLabel = 'P-01';
                                                 } else if (group.id === 'phase-2') {
                                                     dailyStyles = 'border-emerald-500/30 bg-emerald-900/20 hover:border-emerald-400/50 hover:bg-emerald-900/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]';
                                                     IndicatorColor = 'bg-emerald-500/50';
                                                     phaseLabel = 'P-02';
                                                 } else {
                                                     dailyStyles = 'border-purple-500/30 bg-purple-900/20 hover:border-purple-400/50 hover:bg-purple-900/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]';
                                                     IndicatorColor = 'bg-purple-500/50';
                                                     phaseLabel = 'P-??';
                                                 }
                                             }
                                         }
                                         
                                         return (
                                            <button
                                                key={chap.id}
                                                onClick={() => !isLocked && setReadingContext({ list: vol.chapters, index: chapIndex })}
                                                disabled={isLocked}
                                                className={`w-full text-left flex items-center justify-between py-3 px-4 rounded transition-colors group relative overflow-hidden backdrop-blur-sm border
                                                    ${isLocked ? 'border-red-900/30 bg-red-950/10 text-red-900/50 cursor-not-allowed' : 
                                                    (isDaily && dailyStyles ? dailyStyles : 'border-ash-gray/30 bg-ash-dark/40 hover:border-cyan-500/50 hover:bg-ash-dark hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]')}`}
                                            >
                                                {isDaily && !isLocked && IndicatorColor && (
                                                   <div className={`absolute left-0 top-0 bottom-0 w-1 ${IndicatorColor}`}></div>
                                                )}
                                                <div className="flex items-center gap-3 truncate pl-1">
                                                   <div className="flex flex-col items-center justify-center min-w-[24px]">
                                                       <span className="text-xs font-mono opacity-50 text-ash-gray">{String(chapIndex + 1).padStart(2, '0')}</span>
                                                       {phaseLabel && <span className={`text-[8px] font-mono font-bold mt-0.5 opacity-70 ${
                                                            phaseLabel === 'P-00' ? 'text-slate-400' :
                                                            phaseLabel === 'P-01' ? 'text-fuchsia-400' :
                                                            phaseLabel === 'P-02' ? 'text-emerald-400' :
                                                            'text-purple-400'
                                                       }`}>{phaseLabel}</span>}
                                                   </div>
                                                   <span className={`font-medium ${
                                                     isLocked ? '' : 
                                                     (phaseLabel === 'P-00' ? 'text-slate-300 group-hover:text-slate-200' :
                                                      phaseLabel === 'P-01' ? 'text-fuchsia-300 group-hover:text-fuchsia-200' :
                                                      phaseLabel === 'P-02' ? 'text-emerald-300 group-hover:text-emerald-200' :
                                                      phaseLabel === 'P-??' ? 'text-purple-300 group-hover:text-purple-200' :
                                                      'text-ash-light group-hover:text-white')
                                                   }`}>{isLocked ? (language === 'en' ? '[ CORRUPTED ]' : '[ 数据受损 ]') : t.title}</span>
                                                </div>
                                                {!isLocked && <ChevronRight size={16} className={`transition-colors ${
                                                     phaseLabel === 'P-00' ? 'text-slate-500 group-hover:text-slate-400' :
                                                     phaseLabel === 'P-01' ? 'text-fuchsia-500 group-hover:text-fuchsia-400' :
                                                     phaseLabel === 'P-02' ? 'text-emerald-500 group-hover:text-emerald-400' :
                                                     phaseLabel === 'P-??' ? 'text-purple-500 group-hover:text-purple-400' :
                                                     'text-ash-gray group-hover:text-cyan-400'
                                                }`} />}
                                            </button>
                                         );
                                     })}
                                 </div>
                             </div>
                         )
                     })}
                  </div>
              </section>
          </div>
      </main>
    </div>
  );
};

export default PureReadingPage;
