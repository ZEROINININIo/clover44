import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Settings, Check } from 'lucide-react';
import { Language } from '../types';

interface PureReadingUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const PureReadingUpdateModal: React.FC<PureReadingUpdateModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="max-w-md w-full border border-cyan-500/30 bg-ash-black p-6 md:p-8 relative shadow-[0_0_40px_rgba(0,255,255,0.1)] group"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,255,0.03)_50%,transparent_75%)] bg-[length:250%_250%] animate-gradient-xy pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 text-cyan-400">
            <BookOpen size={28} className="animate-pulse" />
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest font-mono">
              {language === 'en' ? 'SYSTEM UPDATE' : '系统更新'}
            </h2>
          </div>

          <div className="space-y-4 mb-8 text-sm md:text-base text-ash-light leading-relaxed font-mono">
            <p>
              {language === 'en' 
                ? 'We have introduced a new feature: Pure Reading Mode.' 
                : '系统已实装全新功能：纯净阅读模式。'}
            </p>
            <p className="opacity-80">
              {language === 'en' 
                ? 'This mode strips away all complex UI elements, providing a distraction-free environment solely dedicated to reading.' 
                : '该模式将摒弃原有复杂的系统全部UI元素，重构一个纯粹为阅读服务的页面。'}
            </p>
            <p className="opacity-80">
              {language === 'en' 
                ? 'Optimization: Refactored mobile rendering logic to improve performance.' 
                : '性能优化：优化手机端渲染思路，提升整体性能表现。'}
            </p>
            <div className="bg-cyan-950/20 border-l-2 border-cyan-500 p-3 mt-4 text-xs md:text-sm text-cyan-200/80">
               <div className="flex items-center gap-2 mb-1 text-cyan-400 font-bold uppercase">
                  <Settings size={14} /> 
                  {language === 'en' ? 'How to toggle' : '如何切换'}
               </div>
               {language === 'en' 
                  ? 'You can toggle Pure Reading Mode in the Initial Setup or the Settings panel (Advanced/System Prefs).' 
                  : '您可以在首次启动引导的偏好设置界面，或系统设置面板（高级设置区）中随时切换此模式。'}
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 flex items-center justify-center gap-2 border border-cyan-500 text-cyan-400 font-bold tracking-widest uppercase hover:bg-cyan-500 hover:text-black transition-colors"
          >
            <Check size={18} />
            {language === 'en' ? 'ACKNOWLEDGE' : '确认并继续'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PureReadingUpdateModal;
