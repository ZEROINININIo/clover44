import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CloverEntryAnimationProps {
  onComplete: () => void;
}

const CloverEntryAnimation: React.FC<CloverEntryAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'falling' | 'expanding' | 'done'>('falling');

  useEffect(() => {
    // Phase 1: Clovers falling and gathering (2s)
    const t1 = setTimeout(() => setPhase('expanding'), 2000);
    // Phase 2: Expanding into the background (1.5s)
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  // Generate some random clovers
  const clovers = Array.from({ length: 44 }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 1.5;
    const duration = 1 + Math.random() * 2;
    const size = 10 + Math.random() * 20;

    return (
      <motion.div
        key={i}
        className="absolute text-emerald-400 opacity-60"
        initial={{ top: '-10%', left: `${left}%`, rotate: 0, scale: 1 }}
        animate={{
          top: phase === 'expanding' ? '50%' : '110%',
          left: phase === 'expanding' ? '50%' : `${left + (Math.random() * 20 - 10)}%`,
          rotate: 360,
          scale: phase === 'expanding' ? 0 : 1
        }}
        transition={{
          duration: phase === 'expanding' ? 1.5 : duration,
          delay: phase === 'expanding' ? 0 : delay,
          ease: phase === 'expanding' ? "easeInOut" : "linear"
        }}
        style={{ fontSize: size }}
      >
        ♣
      </motion.div>
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-ash-black flex items-center justify-center overflow-hidden">
      {clovers}
      
      {phase === 'expanding' && (
        <motion.div
          className="absolute bg-emerald-950 rounded-full"
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{ width: '300vw', height: '300vw', opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      )}

      <motion.div
        className="relative z-10 font-serif text-3xl text-emerald-200 tracking-widest font-black text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: phase === 'expanding' ? 0 : 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="mb-4">四十四又二分之一</div>
        <div className="text-sm font-mono text-emerald-400 opacity-80">Forty-Four and a Half</div>
      </motion.div>
    </div>
  );
};

export default CloverEntryAnimation;
