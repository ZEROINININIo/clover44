import React, { useState, useEffect } from 'react';
import { Chapter, Language, SideStoryVolume } from '../../../types';
import { ChevronLeft, ChevronRight, BookOpen, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WordDocViewProps {
    chapters: Chapter[];
    language: Language;
    onSelectChapter: (index: number) => void;
    volume: SideStoryVolume;
}

const GatheringAnimation = () => {
    const isClient = typeof window !== 'undefined';
    if (!isClient) return null;

    return (
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center z-50 overflow-hidden" style={{ perspective: '1000px' }}>
            {[...Array(20)].map((_, i) => {
                const isDoc = i < 8;
                const isText = i >= 8 && i < 14;
                const isLine = i >= 14;
                
                return (
                    <motion.div
                        key={i}
                        initial={{
                            opacity: 0,
                            x: (Math.random() - 0.5) * 2000,
                            y: (Math.random() - 0.5) * 2000,
                            z: Math.random() * 1000,
                            rotateZ: Math.random() * 720 - 360,
                            rotateX: Math.random() * 360,
                            rotateY: Math.random() * 360,
                            scale: Math.random() * 3 + 0.5,
                        }}
                        animate={{
                            opacity: [0, 0.8, 0],
                            x: 0,
                            y: 0,
                            z: 0,
                            rotateZ: 0,
                            rotateX: 0,
                            rotateY: 0,
                            scale: 0.9,
                        }}
                        transition={{
                            duration: 2 + Math.random() * 1,
                            ease: "easeInOut",
                        }}
                        className={`absolute will-change-transform will-change-opacity ${
                            isDoc 
                                ? 'bg-white/90 border border-gray-300' 
                                : isText 
                                    ? 'bg-black text-white text-xs font-mono font-bold px-2 py-1' 
                                    : 'bg-gray-400'
                        }`}
                        style={{
                            width: isDoc ? `${Math.random() * 200 + 100}px` : isLine ? `${Math.random() * 300 + 100}px` : 'auto',
                            height: isDoc ? `${Math.random() * 300 + 150}px` : isLine ? '2px' : 'auto',
                        }}
                    >
                        {isText && "FRAGMENT_RESTORE..."}
                    </motion.div>
                );
            })}
            
            {/* Central flash */}
            <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 4] }}
                transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
                className="absolute w-64 h-64 rounded-full mix-blend-overlay pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)'
                }}
            />
        </div>
    );
};

const ExitingAnimation = () => {
    return (
        <div className="fixed inset-0 z-[200] pointer-events-none flex justify-center items-center overflow-hidden">
            {/* White flash that covers everything */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 bg-white"
            />
            
            {/* Gathering Elements */}
            {[...Array(40)].map((_, i) => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 1500 + Math.random() * 1000;
                const startX = Math.cos(angle) * distance;
                const startY = Math.sin(angle) * distance;
                const rotation = Math.random() * 720 - 360;
                
                const isText = i < 15;
                const texts = ['FRAGMENT', 'INIT', 'LOAD', '0x00F8', 'SYS_REQ', 'OVERRIDE', 'TIME', 'OBJ', 'BEFORE'];

                return (
                    <motion.div
                        key={i}
                        initial={{ 
                            x: startX, 
                            y: startY, 
                            rotate: rotation,
                            opacity: 0,
                            scale: Math.random() * 2 + 0.5
                        }}
                        animate={{ 
                            x: 0, 
                            y: 0, 
                            rotate: 0,
                            opacity: [0, 0.8, 0],
                            scale: 0.5
                        }}
                        transition={{ 
                            duration: 2 + Math.random() * 1.5,
                            ease: "easeInOut",
                        }}
                        className={`absolute flex justify-center items-center will-change-transform will-change-opacity ${
                            isText 
                                ? 'text-black font-mono font-bold text-xs md:text-sm drop-shadow-sm' 
                                : 'bg-black border border-gray-400'
                        }`}
                        style={{
                            width: isText ? 'auto' : `${Math.random() * 40 + 10}px`,
                            height: isText ? 'auto' : `${Math.random() * 40 + 10}px`,
                            borderWidth: isText ? 0 : `${Math.random() * 4 + 1}px`
                        }}
                    >
                        {isText ? texts[i % texts.length] : ''}
                    </motion.div>
                );
            })}

            {/* Central Typography Gathering */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5, letterSpacing: '2em', filter: 'blur(10px)' }}
                animate={{ opacity: [0, 1, 1], scale: 1, letterSpacing: '0.1em', filter: 'blur(0px)' }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                className="absolute text-2xl md:text-5xl font-black text-black font-mono uppercase tracking-widest text-center flex flex-col gap-2 md:gap-4 z-10"
            >
                <span>时域终末(time obj.)</span>
                <span className="text-xl md:text-4xl text-red-600">-BEFORE- TRUE FINALE</span>
            </motion.div>

            {/* Final Black hole expanding at the end to transition to reader */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 200 }}
                transition={{ duration: 0.8, delay: 2.2, ease: "circIn" }}
                className="absolute w-8 h-8 bg-[#0a0a0c] rounded-full z-20"
            />
        </div>
    );
};

export const WordDocView: React.FC<WordDocViewProps> = ({ chapters, language, onSelectChapter, volume }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isEntering, setIsEntering] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsEntering(false);
        }, 2200);
        return () => clearTimeout(timer);
    }, []);

    const paginate = (newDirection: number) => {
        if (currentPage + newDirection >= 0 && currentPage + newDirection < chapters.length) {
            setDirection(newDirection);
            setCurrentPage(prev => prev + newDirection);
        }
    };

    const handleSelect = (index: number) => {
        setIsExiting(true);
        setTimeout(() => {
            onSelectChapter(index);
        }, 3000);
    };

    const chapter = chapters[currentPage];
    const t = chapter.translations[language] || chapter.translations['zh-CN'];
    const realIndex = volume.chapters.findIndex(c => c.id === chapter.id);
    const isLocked = chapter.status === 'locked';

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 150 : -150,
            opacity: 0,
            scale: 0.95,
            rotateY: direction > 0 ? 15 : -15,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 150 : -150,
            opacity: 0,
            scale: 0.95,
            rotateY: direction < 0 ? 15 : -15,
        })
    };

    return (
        <div className="w-full flex justify-center items-center py-6 md:py-12 relative overflow-visible" style={{ perspective: '2000px' }}>
            
            <AnimatePresence>
                {isEntering && <GatheringAnimation key="gathering" />}
                {isExiting && <ExitingAnimation key="exiting" />}
            </AnimatePresence>

            <motion.button 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: isEntering ? 0 : 1, x: isEntering ? -50 : 0 }}
                transition={{ duration: 0.5, delay: 2.5 }}
                onClick={() => paginate(-1)}
                disabled={currentPage === 0 || isEntering}
                className="absolute left-2 md:left-8 z-20 p-2 md:p-4 border-2 border-gray-300 bg-white/90 shadow-xl text-black rounded-full disabled:opacity-0 transition-opacity hover:bg-gray-100 hover:scale-105"
            >
                <ChevronLeft size={28} />
            </motion.button>

            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isEntering ? 0 : 1, scale: isEntering ? 0.8 : 1 }}
                transition={{ duration: 1, delay: 2.2, type: "spring", stiffness: 100 }}
                className="relative w-full max-w-xl h-[550px] shadow-2xl bg-transparent flex justify-center"
            >
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={currentPage}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                            rotateY: { type: "spring", stiffness: 200, damping: 30 }
                        }}
                        className="absolute w-full h-full bg-[#fdfcf8] text-black flex flex-col overflow-hidden origin-center"
                        style={{
                            boxShadow: 'inset -20px 0 30px -20px rgba(0,0,0,0.1), inset 20px 0 30px -20px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.15)',
                            backgroundImage: 'radial-gradient(circle, #00000008 1px, transparent 1px)',
                            backgroundSize: '16px 16px'
                        }}
                    >
                        {/* Page Content */}
                        <div className="flex-1 p-8 md:p-12 flex flex-col">
                            {/* Page Header */}
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
                                <div className="text-xs font-mono text-gray-400 font-bold tracking-widest uppercase">
                                    {volume.titleEn}
                                </div>
                                <div className="text-xs font-mono text-gray-400 font-bold">
                                    PAGE. {String(currentPage + 1).padStart(2, '0')}
                                </div>
                            </div>

                            {/* Chapter Title & Info */}
                            <div className="flex-1 flex flex-col justify-center mb-12">
                                <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight tracking-tight text-gray-900">
                                    {t.title}
                                </h1>
                                <p className="text-sm text-gray-600 leading-relaxed font-serif relative">
                                    <span className="absolute -left-3 top-0 bottom-0 w-1 bg-gray-300"></span>
                                    {t.summary}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="mt-auto mb-4 flex justify-center">
                                <button
                                    onClick={() => handleSelect(realIndex)}
                                    disabled={isLocked || isExiting}
                                    className={`
                                        w-full py-4 px-6 flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all
                                        ${isLocked 
                                            ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed' 
                                            : 'bg-black text-white hover:bg-gray-800 shadow-xl hover:shadow-2xl hover:-translate-y-1'
                                        }
                                    `}
                                >
                                    {isLocked ? (
                                        <>
                                            <Lock size={18} />
                                            {language === 'en' ? 'LOCKED / UPDATING' : '待更新'}
                                        </>
                                    ) : (
                                        <>
                                            <BookOpen size={18} />
                                            {language === 'en' ? 'READ CHAPTER' : '阅读本章'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Page Spine effect (left side shading) */}
                        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <motion.button 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: isEntering ? 0 : 1, x: isEntering ? 50 : 0 }}
                transition={{ duration: 0.5, delay: 2.5 }}
                onClick={() => paginate(1)}
                disabled={currentPage === chapters.length - 1 || isEntering}
                className="absolute right-2 md:right-8 z-20 p-2 md:p-4 border-2 border-gray-300 bg-white/90 shadow-xl text-black rounded-full disabled:opacity-0 transition-opacity hover:bg-gray-100 hover:scale-105"
            >
                <ChevronRight size={28} />
            </motion.button>
        </div>
    );
};


