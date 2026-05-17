import React, { useEffect, useState, useMemo } from 'react';
import { Eye, Hexagon, Circle, Square, Triangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FirstStepBackground: React.FC = () => {
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowIntro(false);
        }, 4000); // 4 seconds intro
        return () => clearTimeout(timer);
    }, []);

    // Generate random particles for the gathering effect
    const particles = useMemo(() => {
        const items = [];
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789§∆∑Ω∞µ≈≠≡≤≥';
        for (let i = 0; i < 30; i++) {
            const isChar = Math.random() > 0.5;
            const content = isChar 
                ? chars[Math.floor(Math.random() * chars.length)]
                : null;
            
            // Initial position outside the center
            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 40; // 60vw to 100vw away
            const duration = 15 + Math.random() * 20; // 15s to 35s to reach center

            items.push({
                id: i,
                content,
                angle,
                distance,
                duration,
                delay: Math.random() * -20, // Start at different times
                size: 10 + Math.random() * 20,
                opacity: 0.1 + Math.random() * 0.3,
            });
        }
        return items;
    }, []);

    return (
        <div className={`fixed inset-0 overflow-hidden pointer-events-none ${showIntro ? 'z-[100]' : 'z-0'} bg-[#f4f4f5]`}>
            {/* Post-Entrance Gathering Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                <style>
                    {`
                        @keyframes slowGather {
                            0% {
                                transform: translate(var(--startX), var(--startY)) rotate(0deg);
                                opacity: 0;
                            }
                            10% {
                                opacity: var(--maxOpacity);
                            }
                            90% {
                                opacity: var(--maxOpacity);
                            }
                            100% {
                                transform: translate(0, 0) rotate(var(--rot));
                                opacity: 0;
                            }
                        }
                        @keyframes pulseGlow {
                            0%, 100% { transform: scale(1); opacity: 0.1; }
                            50% { transform: scale(1.05); opacity: 0.2; }
                        }
                    `}
                </style>
                
                {/* Central Gravity Well / Eye */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulseGlow will-change-transform will-change-opacity" style={{ animationDuration: '4s', animationIterationCount: 'infinite' }}>
                    <Eye size={400} strokeWidth={0.5} className="text-black" />
                </div>

                {/* Gathering Particles */}
                {particles.map(p => {
                    const startX = Math.cos(p.angle) * p.distance + 'vw';
                    const startY = Math.sin(p.angle) * p.distance + 'vh';
                    const rot = (Math.random() - 0.5) * 720 + 'deg';
                    return (
                        <div 
                            key={p.id}
                            className="absolute top-1/2 left-1/2 flex items-center justify-center text-black font-mono font-black"
                            style={{
                                '--startX': startX,
                                '--startY': startY,
                                '--rot': rot,
                                '--maxOpacity': p.opacity,
                                fontSize: p.size + 'px',
                                animation: 'slowGather ' + p.duration + 's infinite linear',
                                animationDelay: p.delay + 's',
                            } as React.CSSProperties}
                        >
                            {p.content ? p.content : (
                                p.id % 4 === 0 ? <Triangle size={p.size} strokeWidth={1} /> :
                                p.id % 4 === 1 ? <Square size={p.size} strokeWidth={1} /> :
                                p.id % 4 === 2 ? <Hexagon size={p.size} strokeWidth={1} /> :
                                <Circle size={p.size} strokeWidth={1} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Cinematic Entrance Overlay */}
            <AnimatePresence>
                {showIntro && (
                    <motion.div 
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black overflow-hidden flex-col pointer-events-auto"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: 'brightness(2) blur(10px)', scale: 1.1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                        {/* Dramatic Texts */}
                        <motion.div
                            initial={{ scale: 2, opacity: 0, letterSpacing: '0.5em' }}
                            animate={{ scale: 1, opacity: 1, letterSpacing: '0.1em' }}
                            transition={{ duration: 2, ease: "backOut" }}
                            className="text-white text-3xl md:text-5xl font-black font-mono uppercase tracking-widest text-center flex flex-col gap-4"
                        >
                            <span>TIME OBJ. -BEFORE-</span>
                            <span className="text-xl md:text-3xl text-red-500">TRUE FINALE</span>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="text-neutral-500 font-mono text-sm tracking-[0.5em] mt-4"
                        >
                            SINGULARITY / INITIALIZATION
                        </motion.div>

                        {/* Collapsing Rectangles intro effect */}
                        <motion.div 
                            className="absolute inset-0 border-[20px] border-white"
                            initial={{ scale: 1.5, opacity: 0, rotate: 45 }}
                            animate={{ scale: 0, opacity: 1, rotate: 0 }}
                            transition={{ duration: 2.5, ease: "circIn" }}
                        />
                        <motion.div 
                            className="absolute inset-0 border-[2px] border-white/50"
                            initial={{ scale: 2, opacity: 0, rotate: -45 }}
                            animate={{ scale: 0, opacity: 1, rotate: 0 }}
                            transition={{ duration: 2, ease: "circIn", delay: 0.5 }}
                        />

                        {/* Final Flash */}
                        <motion.div 
                            className="absolute inset-0 bg-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 2.5 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
