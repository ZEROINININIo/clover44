import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SideStoryVolume, Language } from '../types';
import { Lock, Unlock } from 'lucide-react';

interface CloverDirectoryProps {
  volume: SideStoryVolume;
  onSelectChapter: (index: number) => void;
  language: Language;
}

const CloverDirectory: React.FC<CloverDirectoryProps> = ({ volume, onSelectChapter, language }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const chapters = volume.chapters;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '4412233') {
      setIsLocked(false);
      setErrorMsg('');
    } else {
      setErrorMsg(language === 'en' ? 'ACCESS DENIED' : '密码错误');
      setPassword('');
    }
  };

  const handleChapterClick = (index: number) => {
    if (!isLocked) {
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
        leafChapters.push(
            <button
                key={i}
                onClick={() => handleChapterClick(i)}
                disabled={isLocked}
                className={`w-full px-1 py-1 md:px-2 md:py-2 text-[10px] md:text-xs font-bold border truncate transition-all duration-300 relative z-20 ${
                    isLocked 
                        ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-800 cursor-not-allowed' 
                        : 'bg-emerald-900/80 border-emerald-600/50 text-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                }`}
            >
                {isLocked ? <span className="flex items-center justify-center gap-1"><Lock size={10} /> {language === 'en' ? 'LOCKED' : '锁定'}</span> : getChapterTitle(i)}
            </button>
        );
    }
    return leafChapters;
  };

  const leafBaseClasses = "absolute bg-emerald-950/60 border-2 border-emerald-800/50 hover:bg-emerald-900/60 hover:border-emerald-500/80 transition-colors duration-500 shadow-[0_0_30px_rgba(4,120,87,0.3)] flex flex-col items-center justify-center gap-1 md:gap-2 p-2 md:p-4 backdrop-blur-sm z-10 w-[8rem] h-[8rem] md:w-[13rem] md:h-[13rem] overflow-hidden";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-ash-black flex flex-col items-center overflow-y-auto no-scrollbar scroll-smooth"
    >
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-gradient-to-br from-emerald-900 via-emerald-950 to-black overflow-hidden h-[150vh]">
          <div className="absolute top-[10%] left-[10%] text-[60vw] text-emerald-500/10 rotate-12 blur-xl font-serif">♣</div>
          <div className="absolute bottom-[20%] right-[10%] text-[40vw] text-emerald-500/10 -rotate-12 blur-lg font-serif">♣</div>
          
          {/* Animated particles */}
          {Array.from({ length: 20 }).map((_, i) => (
             <motion.div 
               key={i}
               className="absolute text-emerald-500/20"
               initial={{ 
                 top: `${Math.random() * 100}%`, 
                 left: `${Math.random() * 100}%`,
                 scale: Math.random() * 0.5 + 0.5,
                 rotate: 0
               }}
               animate={{ 
                 top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                 rotate: 360
               }}
               transition={{ 
                 duration: Math.random() * 20 + 20, 
                 repeat: Infinity,
                 ease: "linear"
               }}
             >
               ♣
             </motion.div>
          ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 text-center mt-12 mb-8 md:mb-12 shrink-0">
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
        
        <AnimatePresence mode="wait">
            {isLocked ? (
                <motion.form 
                    key="lock-form"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleUnlock} 
                    className="flex flex-col items-center gap-4 bg-emerald-950/80 p-6 rounded-xl border border-emerald-800/50 backdrop-blur-md max-w-sm mx-auto shadow-[0_0_50px_rgba(4,120,87,0.2)]"
                >
                    <p className="text-emerald-400 font-mono text-xs tracking-widest uppercase flex items-center gap-2">
                        <Lock size={14} /> SYSTEM LOCKED
                    </p>
                    <div className="flex w-full gap-2 relative">
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="flex-1 w-full bg-black/50 border border-emerald-800 text-emerald-200 px-4 py-2 font-mono outline-none focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(52,211,153,0.3)] text-center tracking-[0.5em] transition-all"
                            placeholder="***"
                            autoFocus
                        />
                        <button type="submit" className="bg-emerald-800 text-emerald-100 px-4 py-2 border border-emerald-600 hover:bg-emerald-600 font-bold transition-colors shadow-[0_0_10px_rgba(4,120,87,0.5)]">
                            UNLOCK
                        </button>
                    </div>
                    {errorMsg && <p className="text-red-400 font-mono text-xs animate-shake-violent">{errorMsg}</p>}
                </motion.form>
            ) : (
                <motion.div 
                    key="unlocked-msg"
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-2 p-6"
                >
                    <p className="text-emerald-300 font-mono text-sm tracking-widest uppercase flex items-center gap-2 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]">
                        <Unlock size={16} /> ACCESS GRANTED
                    </p>
                    <p className="text-emerald-600 text-xs font-mono">Select a fragment to proceed.</p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* 4-Leaf Clover Layout */}
      <div className="relative w-[17rem] h-[17rem] md:w-[27rem] md:h-[27rem] shrink-0 mb-32 md:mb-12 mx-auto">
        {/* Center Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-10 md:h-10 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)] z-30 flex items-center justify-center">
            <div className="w-2 h-2 md:w-4 md:h-4 bg-emerald-950 rounded-full"></div>
        </div>

        {/* Stem */}
        <div className="absolute top-1/2 left-1/2 w-2 md:w-3 h-32 md:h-48 bg-gradient-to-b from-emerald-600 to-transparent -translate-x-1/2 origin-top rotate-12 z-0 rounded-full"></div>

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
      
    </motion.div>
  );
};
export default CloverDirectory;
