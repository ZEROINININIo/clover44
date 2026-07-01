import React from 'react';
import { motion } from 'framer-motion';
import { SideStoryVolume, Language } from '../types';
import { Lock, Unlock } from 'lucide-react';

interface CloverDirectoryProps {
  volume: SideStoryVolume;
  onSelectChapter: (index: number) => void;
  language: Language;
  onOpenAbout: () => void;
}

const CloverDirectory: React.FC<CloverDirectoryProps> = ({ volume, onSelectChapter, language, onOpenAbout }) => {
  const chapters = volume.chapters;

  const handleChapterClick = (index: number) => {
    if (chapters[index].status !== 'locked') {
      onSelectChapter(index);
    }
  };

  const getChapterTitle = (index: number) => {
    const defaultLang = 'zh-CN';
    const lang = chapters[index].translations[language] ? language : defaultLang;
    return chapters[index].translations[lang].title;
  };

  const renderLeafChapters = (startIdx: number, endIdx: number) => {
    const leafChapters = [];
    for (let i = startIdx; i <= endIdx && i < chapters.length; i++) {
        const isChapterLocked = chapters[i].status === 'locked';
        leafChapters.push(
            <button
                key={i}
                onClick={() => handleChapterClick(i)}
                disabled={isChapterLocked}
                className={`w-full px-1 py-1 md:px-2 md:py-2 text-[10px] md:text-xs font-bold border truncate transition-all duration-300 relative z-20 ${
                    isChapterLocked 
                        ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-800 cursor-not-allowed' 
                        : 'bg-emerald-900/80 border-emerald-600/50 text-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                }`}
            >
                {isChapterLocked ? <span className="flex items-center justify-center gap-1"><Lock size={10} /> {language === 'en' ? 'LOCKED' : '锁定'}</span> : getChapterTitle(i)}
            </button>
        );
    }
    return leafChapters;
  };

  const leafBaseClasses = "absolute bg-emerald-950/60 border-2 border-emerald-800/50 hover:bg-emerald-900/60 hover:border-emerald-500/80 transition-colors duration-500 shadow-[0_0_30px_rgba(4,120,87,0.3)] flex flex-col items-center justify-center gap-1 md:gap-2 p-1 sm:p-2 md:p-4 backdrop-blur-sm z-10 w-[48%] h-[48%] overflow-hidden";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-ash-black flex flex-col items-center overflow-y-auto no-scrollbar scroll-smooth"
    >
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-gradient-to-br from-emerald-900 via-emerald-950 to-black overflow-hidden">
          <div className="absolute top-[10%] left-[10%] text-[60vw] text-emerald-500/10 rotate-12 blur-xl font-serif">♣</div>
          <div className="absolute bottom-[20%] right-[10%] text-[40vw] text-emerald-500/10 -rotate-12 blur-lg font-serif">♣</div>
          
          {/* Animated Star Tracks (星轨流转) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw] flex items-center justify-center opacity-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`track-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${(i + 2) * 12}%`,
                  height: `${(i + 2) * 12}%`,
                  border: `1px ${i % 2 === 0 ? 'dashed' : 'solid'} rgba(255, 255, 255, ${0.15 + (i * 0.05)})`,
                  boxShadow: i % 3 === 0 ? '0 0 15px rgba(255, 255, 255, 0.2)' : 'none',
                }}
                animate={{
                  rotate: i % 2 === 0 ? [0, 360] : [360, 0],
                }}
                transition={{
                  duration: 40 + i * 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 text-center mt-6 md:mt-12 mb-6 md:mb-12 shrink-0">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <h1 className="text-3xl md:text-5xl text-emerald-300 font-bold tracking-[0.2em] mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
            四十四又二分之一
            </h1>
            <p className="text-emerald-500 font-mono tracking-widest text-sm mb-6">FORTY-FOUR AND A HALF</p>
        </motion.div>
        
        <motion.div 
            key="unlocked-msg"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-2 p-6"
        >
            <p className="text-emerald-300 font-mono text-sm tracking-widest uppercase flex items-center gap-2 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]">
                <Unlock size={16} /> ACCESS GRANTED
            </p>
            <p className="text-emerald-600 text-xs font-mono">Select a fragment to proceed.</p>
        </motion.div>
      </div>

      {/* 4-Leaf Clover Layout */}
      <div className="relative w-[85vw] max-w-[18rem] md:max-w-[28rem] aspect-square shrink-0 mb-24 md:mb-12 mx-auto">
        {/* Center Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-10 md:h-10 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)] z-30 flex items-center justify-center">
            <div className="w-2 h-2 md:w-4 md:h-4 bg-emerald-950 rounded-full"></div>
        </div>

        {/* Stem */}
        <div className="absolute top-1/2 left-1/2 w-2 md:w-3 h-[50%] md:h-[60%] bg-gradient-to-b from-emerald-600 to-transparent -translate-x-1/2 origin-top rotate-12 z-0 rounded-full"></div>

        {/* Top Left Leaf (Index 0, 1) */}
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
            className={`top-0 left-0 ${leafBaseClasses}`}
            style={{ borderRadius: '50% 50% 0% 50%' }}
        >
            <div className="absolute inset-0 bg-emerald-400/5 mix-blend-overlay pointer-events-none rounded-inherit"></div>
            {renderLeafChapters(0, 1)}
        </motion.div>

        {/* Top Right Leaf (Index 2, 3) */}
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
            className={`top-0 right-0 ${leafBaseClasses}`}
            style={{ borderRadius: '50% 50% 50% 0%' }}
        >
            <div className="absolute inset-0 bg-emerald-400/5 mix-blend-overlay pointer-events-none rounded-inherit"></div>
            {renderLeafChapters(2, 3)}
        </motion.div>

        {/* Bottom Right Leaf (Index 4, 5) */}
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 100 }}
            className={`bottom-0 right-0 ${leafBaseClasses}`}
            style={{ borderRadius: '0% 50% 50% 50%' }}
        >
            <div className="absolute inset-0 bg-emerald-400/5 mix-blend-overlay pointer-events-none rounded-inherit"></div>
            {renderLeafChapters(4, 5)}
        </motion.div>

        {/* Bottom Left Leaf (Index 6, 7) */}
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
            className={`bottom-0 left-0 ${leafBaseClasses}`}
            style={{ borderRadius: '50% 0% 50% 50%' }}
        >
            <div className="absolute inset-0 bg-emerald-400/5 mix-blend-overlay pointer-events-none rounded-inherit"></div>
            {renderLeafChapters(6, 7)}
        </motion.div>
      </div>
      
      {/* About 44half Button */}
      <button 
          onClick={onOpenAbout}
          className="md:fixed relative mb-12 md:mb-0 md:top-6 md:right-6 z-50 px-4 py-2 bg-emerald-950/60 border border-emerald-800 text-emerald-400 hover:text-emerald-100 hover:border-emerald-500 shadow-[0_0_15px_rgba(4,120,87,0.2)] backdrop-blur transition-all flex items-center gap-2 group text-xs font-mono tracking-widest uppercase"
      >
          <span className="text-emerald-500 group-hover:text-emerald-300">?</span> 关于四四酱
      </button>

    </motion.div>
  );
};
export default CloverDirectory;
