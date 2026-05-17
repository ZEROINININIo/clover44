
import React from 'react';
import { motion } from 'framer-motion';
import { GraphicsQuality } from '../../../types';

interface GhostAnalysisBackgroundProps {
  quality: GraphicsQuality;
}

export const GhostAnalysisBackground: React.FC<GhostAnalysisBackgroundProps> = ({ quality }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base Gradient */}
      <div className={`absolute inset-0 transition-colors duration-1000 bg-[#05080a]`}></div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>

      {/* Glitchy Grid */}
      <div className={`absolute inset-0 opacity-[0.05] bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]`}></div>

      {/* Floating "Ghost" Data Fragments */}
      {quality !== 'low' && (
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute font-mono text-[10px] md:text-xs text-slate-600`}
              initial={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.2 + Math.random() * 0.3,
                rotate: Math.random() * 360
              }}
              animate={{
                y: [0, -20 - Math.random() * 30, 0],
                x: [0, 10 - Math.random() * 20, 0],
                opacity: [0.2, 0.6, 0.2],
                rotate: [null, Math.random() * 360]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            >
              {Math.random() > 0.5 ? '0x' + Math.random().toString(16).substring(2, 6).toUpperCase() : 'GHOST_DATA'}
            </motion.div>
          ))}
        </div>
      )}

      {/* Central "Analysis" Pulse */}
      {quality !== 'low' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vmin] h-[60vmin] pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-0 border-2 rounded-full border-slate-600`} 
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-10 border border-dashed rounded-full opacity-5 border-slate-600`} 
          />
        </div>
      )}

      {/* Vertical Data Streams */}
      <motion.div 
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-slate-500/20 to-transparent -translate-x-1/2"
      />
      <motion.div 
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute top-0 bottom-0 left-[20%] w-px bg-gradient-to-b from-transparent via-slate-500/10 to-transparent -translate-x-1/2"
      />
      <motion.div 
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute top-0 bottom-0 right-[20%] w-px bg-gradient-to-b from-transparent via-slate-500/10 to-transparent translate-x-1/2"
      />
    </div>
  );
};
