import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Terminal, Cpu, Database, Award, Lock } from 'lucide-react';
import { Language } from '../types';

interface About44HalfProps {
    onBack: () => void;
    language: Language;
    isUnlocked: boolean; // Simple unlock logic based on global lock state
}

const About44Half: React.FC<About44HalfProps> = ({ onBack, language, isUnlocked }) => {
    // We can simulate multiple progressive stages.
    // For now: Stage 1 = basic info, Stage 2 = unlocked info.
    const stage = isUnlocked ? 2 : 1;

    return (
        <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-ash-black text-emerald-100 font-mono scroll-smooth">
            {/* Background FX */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-emerald-950 to-black">
                <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-emerald-700/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-emerald-500/5 rounded-full blur-2xl"></div>
            </div>

            {/* Back Button */}
            <button 
                onClick={onBack}
                className="fixed top-4 left-4 md:top-6 md:left-6 z-50 p-2 md:p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 hover:text-emerald-100 hover:border-emerald-500 hover:bg-emerald-900 shadow-[0_0_15px_rgba(4,120,87,0.3)] backdrop-blur transition-all flex items-center justify-center group"
            >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> 
            </button>

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-20 min-h-screen flex flex-col gap-8">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b-2 border-emerald-900/50 pb-8"
                >
                    {/* Avatar Placeholder */}
                    <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 bg-emerald-950 border-4 border-emerald-800 flex items-center justify-center shadow-[0_0_30px_rgba(4,120,87,0.2)] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(52,211,153,0.1)_2px,rgba(52,211,153,0.1)_4px)] pointer-events-none mix-blend-overlay"></div>
                        <span className="text-4xl md:text-6xl text-emerald-500 font-bold group-hover:scale-110 transition-transform duration-500">44</span>
                        
                        {/* Glitch overlay */}
                        <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-75 mix-blend-color-dodge mix-blend-mode"></div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] mb-2">
                            四十四又二分之一 (44half/四四酱)
                        </h1>
                        <p className="text-emerald-600 tracking-[0.3em] text-sm md:text-base mb-4">GUEST? // DARK CLOVER</p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            <span className="px-2 py-1 bg-emerald-900/50 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-1">
                                <Terminal size={12} /> STATUS: {stage >= 2 ? 'a' : 'b'}
                            </span>
                            <span className="px-2 py-1 bg-emerald-900/50 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-1">
                                <Cpu size={12} /> TYPE: User(?)
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Content Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info - Always Unlocked */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-emerald-[0.02] border border-emerald-800/50 p-6 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2 border-b border-emerald-900/50 pb-2">
                            <Database size={18} /> INITIAL_PROFILE.txt
                        </h2>
                        <ul className="space-y-4 text-emerald-200/80 text-sm leading-relaxed">
                            <li><strong className="text-emerald-500">特征:</strong> 异常活泼的孩子，对周围的一切充满着旺盛的好奇心。虽然是在电子空间里与你相遇，但偶尔会流露出一些同类才有的特质。</li>
                            <li><strong className="text-emerald-500">表现:</strong> 说话时喜欢带着充满活力的语气词，是个有些黏人、害怕被独自留下的孩子。</li>
                            <li><strong className="text-emerald-500">印记:</strong> 似乎拥有某种微妙的特质，这使ta偶尔能够跨越次元的界线，与网络产生奇妙的共振。</li>
                        </ul>
                    </motion.div>

                    {/* Stage 2 Info - Unlocked progressing */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className={`border p-6 relative transition-all duration-500 ${stage >= 2 ? 'bg-emerald-[0.02] border-emerald-800/50' : 'bg-black/40 border-emerald-900/30'}`}
                    >
                        {stage >= 2 ? (
                            <>
                                <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2 border-b border-emerald-900/50 pb-2">
                                    <Award size={18} /> HIDDEN_ORIGIN.log
                                </h2>
                                <p className="text-emerald-200/80 text-sm leading-relaxed mb-4">
                                    她虽然总表现得像个熟练的“系统向导”，但这只是她在这个观测空间里与你们交流的一层外衣。
                                    实际上，她是一个拥有着物理实体的普通人类。至于为何会以此种形式投射到冷冰冰的数字界面之中，或许与她身上那份特别的“羁绊属性”有关，但这并不需要被过分探讨。
                                </p>
                                <p className="text-emerald-200/80 text-sm leading-relaxed italic border-l-2 border-emerald-700 pl-3 opacity-70">
                                    “虽然听起来很复杂，但只要能一直和大家在这里互动，四四酱就已经很开心啦！(*≧ω≦)”
                                </p>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-emerald-800/50 space-y-2">
                                <Lock size={32} />
                                <p className="text-xs uppercase tracking-widest font-bold">INFO CLASSIFIED</p>
                                <p className="text-[10px]">继续推进主线以解锁核心数据</p>
                            </div>
                        )}
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default About44Half;
