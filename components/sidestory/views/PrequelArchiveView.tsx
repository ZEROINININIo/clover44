
import React from 'react';
import { Chapter, Language } from '../../../types';
import { FileText, ArrowLeft, Archive, Stamp } from 'lucide-react';
import Reveal from '../../Reveal';

interface PrequelArchiveViewProps {
    chapters: Chapter[];
    onBack: () => void;
    onSelectChapter: (index: number) => void;
    language: Language;
}

export const PrequelArchiveView: React.FC<PrequelArchiveViewProps> = ({ 
    chapters, onBack, onSelectChapter, language 
}) => {
    
    // Retro colors (Dark Theme Only)
    const colors = {
        bg: 'bg-[#1e1e1e]',
        text: 'text-[#ebdbb2]',
        border: 'border-[#a89984]',
        accent: 'text-[#fabd2f]',
        paper: 'bg-[#282828]'
    };

    return (
        <div className={`h-full overflow-y-auto p-4 md:p-12 relative flex flex-col items-center custom-scrollbar pb-24 ${colors.bg} transition-colors duration-500`}>
            
            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] z-0"></div>

            <div className="w-full max-w-3xl relative z-10 animate-fade-in mt-8 md:mt-0">
                {/* Header */}
                <div className={`flex items-center justify-between mb-12 border-b-2 pb-4 ${colors.border}`}>
                    <button 
                        onClick={onBack}
                        className={`flex items-center gap-2 px-4 py-2 border font-mono text-xs font-bold uppercase transition-all hover:opacity-70 ${colors.border} ${colors.text}`}
                    >
                        <ArrowLeft size={14} />
                        {language === 'en' ? 'RETURN' : '返回索引'}
                    </button>
                    
                    <div className="text-right">
                        <div className={`text-2xl font-black font-serif tracking-widest uppercase ${colors.text}`}>
                            {language === 'en' ? 'ARCHIVE ZERO' : '零号档案'}
                        </div>
                        <div className={`text-[10px] font-mono opacity-60 uppercase ${colors.text}`}>
                            TOP SECRET // EYES ONLY
                        </div>
                    </div>
                </div>

                {/* File List */}
                <div className="flex flex-col gap-6 relative">
                    {/* Vertical Line */}
                    <div className={`absolute left-4 md:left-8 top-0 bottom-0 w-0.5 ${colors.border} opacity-50`}></div>

                    {chapters.map((chapter, index) => {
                        const t = chapter.translations[language] || chapter.translations['zh-CN'];
                        const isLocked = chapter.status === 'locked';
                        
                        return (
                            <Reveal key={chapter.id} delay={index * 150} className="relative pl-12 md:pl-20">
                                {/* Connector */}
                                <div className={`absolute left-4 md:left-8 top-8 w-8 md:w-12 h-0.5 ${colors.border}`}></div>
                                <div className={`absolute left-[13px] md:left-[29px] top-[29px] w-2 h-2 rounded-full border-2 ${colors.border} ${colors.bg} z-10`}></div>

                                <button
                                    onClick={() => !isLocked && onSelectChapter(index)}
                                    disabled={isLocked}
                                    className={`
                                        w-full text-left p-6 md:p-8 border-2 transition-all duration-300 relative group
                                        ${isLocked 
                                            ? 'opacity-50 cursor-not-allowed grayscale' 
                                            : 'hover:-translate-y-1 hover:shadow-lg cursor-pointer'
                                        }
                                        ${colors.paper} ${colors.border}
                                    `}
                                >
                                    {/* Paper Clip Visual */}
                                    <div className={`absolute -top-3 right-8 w-4 h-8 border-2 rounded-full ${colors.border} bg-transparent`}></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`font-mono text-xs font-bold border px-2 py-1 ${colors.border} ${colors.accent}`}>
                                            CONFIDENTIAL // {chapter.date}
                                        </div>
                                        <Archive size={20} className={`${colors.text} opacity-30`} />
                                    </div>

                                    <h3 className={`text-xl md:text-3xl font-bold font-serif mb-2 ${colors.text} group-hover:underline decoration-1 underline-offset-4`}>
                                        {t.title}
                                    </h3>
                                    
                                    <p className={`font-mono text-xs md:text-sm opacity-70 leading-relaxed ${colors.text}`}>
                                        {t.summary}
                                    </p>

                                    {/* Stamp */}
                                    <div className={`absolute bottom-4 right-4 opacity-10 transform -rotate-12 group-hover:opacity-20 transition-opacity ${colors.text}`}>
                                        <Stamp size={64} />
                                    </div>
                                </button>
                            </Reveal>
                        );
                    })}
                </div>

                <div className={`mt-16 text-center text-[10px] font-mono opacity-40 ${colors.text}`}>
                    -- END OF RECORD --
                </div>
            </div>
        </div>
    );
};
