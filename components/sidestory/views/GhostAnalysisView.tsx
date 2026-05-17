
import React from 'react';
import { motion } from 'framer-motion';
import { Chapter, Language } from '../../../types';
import { Activity, AlertTriangle, Lock } from 'lucide-react';
import { StraightStar } from '../../icons/StraightStar';

interface GhostAnalysisViewProps {
  chapters: Chapter[];
  language: Language;
  onSelectChapter: (index: number) => void;
}

export const GhostAnalysisView: React.FC<GhostAnalysisViewProps> = ({ chapters, language, onSelectChapter }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 px-4">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -30, 0], 
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] bg-slate-800/30`}
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0], 
            x: [0, -20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] bg-slate-700/20`}
        />
      </div>

      {/* Fragmented Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
        {chapters.map((chapter, index) => {
          const isLocked = chapter.status === 'locked';
          const isCorrupted = chapter.status === 'corrupted';

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, x: index % 2 === 0 ? 5 : -5 }}
              className="relative"
            >
              {/* Connector Line (Visual Only) */}
              {index > 0 && (
                <div className={`absolute -top-6 left-1/2 w-px h-6 border-l border-dashed border-slate-700 hidden md:block`}></div>
              )}

              <button
                onClick={() => onSelectChapter(index)}
                disabled={isLocked || isCorrupted}
                className={`
                  w-full text-left p-6 border-2 transition-all duration-300 relative group overflow-hidden
                  bg-slate-900/40 border-slate-800 text-slate-100 hover:border-slate-600 hover:shadow-2xl
                  ${(isLocked || isCorrupted) ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
                `}
              >
                {/* Glitch Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                {/* Status Icon */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  {isLocked ? <Lock size={16} /> : isCorrupted ? <AlertTriangle size={16} /> : <Activity size={16} className="text-slate-400" />}
                </div>

                {/* Chapter Metadata */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 flex items-center justify-center border border-slate-700 bg-slate-800/50`}>
                    <StraightStar size={20} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest opacity-60">FRAG_ID: {chapter.id.split('-').pop()}</div>
                    <div className="text-[10px] font-mono opacity-40">{chapter.date}</div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-2 group-hover:translate-x-1 transition-transform">
                  {chapter.translations[language]?.title || "UNKNOWN_FILE"}
                </h3>

                {/* Summary */}
                <p className="text-xs font-mono opacity-60 line-clamp-2 italic">
                  {chapter.translations[language]?.summary}
                </p>

                {/* Bottom Decor */}
                <div className="mt-4 flex items-center justify-between">
                  <div className={`h-1 flex-1 bg-slate-800 mr-4 overflow-hidden`}>
                    <motion.div 
                      className="h-full bg-slate-400"
                      initial={{ width: 0 }}
                      animate={{ width: isLocked ? '0%' : '100%' }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    ></motion.div>
                  </div>
                  <div className="text-[10px] font-mono opacity-40">SYNC_LVL: {isLocked ? '00%' : '99%'}</div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Decor */}
      <div className="mt-16 text-center">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] opacity-40">
          ANALYSIS_SECTOR // GHOST_PROTOCOL // DATA_RECOVERY_IN_PROGRESS
        </p>
      </div>
    </div>
  );
};
