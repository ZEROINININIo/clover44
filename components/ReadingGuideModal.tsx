import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitBranch, GitCommit, GitMerge, Info } from 'lucide-react';
import { Language } from '../types';

import { APP_VERSION } from '../data/version';

interface ReadingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const ReadingGuideModal: React.FC<ReadingGuideModalProps> = ({ isOpen, onClose, language }) => {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const t = {
    'zh-CN': {
      title: "系统提示 // 推荐阅读路径更新",
      subtitle: `为获得最佳的剧情体验，建议您遵循以下的主线与支线交织阅读顺序。`,
      acknowledge: "确认",
      phases: [
        {
          id: 1,
          name: "阅读阶段 01",
          desc: "建议在阅读完 A-003 后，直接阅读午夜十二时前传分支 PB-001 与 PB-002。",
          main: ["A-001", "A-002", "A-003"],
          branches: [
            { name: "极密权限记录", nodes: ["PB-001", "PB-002"] }
          ]
        },
        {
          id: 2,
          name: "阅读阶段 02",
          desc: "建议在阅读完 A-006 后，连贯阅读析界分支 G-001 至 G-006。",
          main: ["A-004", "A-005", "A-006"],
          branches: [
            { name: "析界数据", nodes: ["G-001 ~ G-006"] }
          ]
        },
        {
          id: 3,
          name: "阅读阶段 03 (未公开)",
          desc: "未解锁或待发布内容，请等待后续更新。",
          main: ["A-007", "A-008"],
          branches: []
        }
      ],
      note: "注：S系列(零碎之雨)、X系列(时域日常)与Collab系列(联动)作为独立档案区块，可在此进程外随需自由访问读取。"
    },
    'zh-TW': {
      title: "系統提示 // 推薦閱讀路徑更新",
      subtitle: `為獲得最佳的劇情體驗，建議您遵循以下的主線與支線交織閱讀順序。`,
      acknowledge: "確認",
      phases: [
        {
          id: 1,
          name: "閱讀階段 01",
          desc: "建議在閱讀完 A-003 後，直接閱讀午夜十二時前傳分支 PB-001 與 PB-002。",
          main: ["A-001", "A-002", "A-003"],
          branches: [
            { name: "極密權限記錄", nodes: ["PB-001", "PB-002"] }
          ]
        },
        {
          id: 2,
          name: "閱讀階段 02",
          desc: "建議在閱讀完 A-006 後，連貫閱讀析界分支 G-001 至 G-006。",
          main: ["A-004", "A-005", "A-006"],
          branches: [
            { name: "析界數據", nodes: ["G-001 ~ G-006"] }
          ]
        },
        {
          id: 3,
          name: "閱讀階段 03 (未公開)",
          desc: "未解鎖或待發布內容，請等待後續更新。",
          main: ["A-007", "A-008"],
          branches: []
        }
      ],
      note: "注：S系列(零碎之雨)、X系列(时域日常)與Collab系列(聯動)作為獨立檔案區塊，可在此進程外隨需自由訪問讀取。"
    }
  }[language === 'en' ? 'zh-CN' : language]; // Fallback to zh-CN for EN since it's not translated yet

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      {/* Background Graphic Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none animate-drift-diagonal"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-ash-black/95 border-2 border-cyan-500/40 rounded-sm shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col font-mono"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/30 bg-cyan-950/40 relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative flex items-center justify-center w-8 h-8 rounded border border-cyan-500/50 bg-black">
                <div className="w-3 h-3 rounded-sm bg-cyan-400 animate-pulse"></div>
                <div className="absolute inset-0 border border-cyan-400/30 animate-ping"></div>
            </div>
            <h2 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500 tracking-wider drop-shadow-sm">{t.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-cyan-500/70 hover:text-cyan-300 hover:bg-cyan-900/30 transition-all rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="mb-10 p-5 border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-black rounded-sm shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500/50 line-glow"></div>
            <p className="text-cyan-100/90 text-sm sm:text-base leading-relaxed pl-2 relative z-10">
              {t.subtitle}
            </p>
          </div>

          {/* Tree Structure */}
          <div className="relative pl-6 sm:pl-10 border-l border-dashed border-cyan-500/30 space-y-10 pb-8">
            {t.phases.map((phase, index) => (
              <div 
                key={phase.id} 
                className="relative group/phase"
                onMouseEnter={() => setActivePhase(phase.id)}
                onMouseLeave={() => setActivePhase(null)}
              >
                {/* Main Node Indicator */}
                <div className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-sm border transition-all duration-300 ${activePhase === phase.id ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_15px_#22d3ee] rotate-45' : 'bg-black border-cyan-500/50 rotate-45 group-hover/phase:border-cyan-400'}`}></div>
                
                {/* Connector line to node */}
                <div className={`absolute -left-[23px] sm:-left-[39px] top-3.5 w-4 h-px transition-colors duration-300 ${activePhase === phase.id ? 'bg-cyan-400' : 'bg-cyan-500/30'}`}></div>

                {/* Phase Header */}
                <div className="mb-5 bg-ash-dark/40 border border-ash-gray/20 p-4 rounded-sm backdrop-blur-sm transition-all duration-300 group-hover/phase:border-cyan-500/30 group-hover/phase:bg-cyan-950/10">
                  <h3 className={`text-lg sm:text-xl font-bold tracking-widest transition-colors duration-300 ${activePhase === phase.id ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-cyan-500'}`}>
                    {phase.name}
                  </h3>
                  <p className="text-ash-gray text-xs sm:text-sm mt-2 flex items-center gap-2">
                    <span className="w-2 h-px bg-cyan-700/50 inline-block"></span>
                    {phase.desc}
                  </p>
                </div>

                {/* Main Branch */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mr-2 bg-cyan-950/50 px-2 py-1 rounded-sm border border-cyan-400/20">
                    <GitCommit size={14} /> MAIN
                  </div>
                  {phase.main.map(node => (
                    <div key={node} className="px-3 py-1.5 bg-black border border-cyan-500/40 text-cyan-50 rounded-sm text-sm shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-default">
                      {node}
                    </div>
                  ))}
                </div>

                {/* Side Branches */}
                {phase.branches.map((branch, bIdx) => (
                  <div key={bIdx} className="relative pl-6 sm:pl-8 mt-4 group/branch">
                    {/* Branch Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px border-l border-dashed border-purple-500/50"></div>
                    <div className="absolute left-0 top-4 w-4 sm:w-6 h-px bg-purple-500/50 group-hover/branch:bg-purple-400 transition-colors"></div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-purple-300 uppercase tracking-widest mr-2 bg-purple-950/40 px-2 py-1 rounded-sm border border-purple-500/30">
                        <GitBranch size={14} /> {branch.name}
                      </div>
                      {branch.nodes.map(node => (
                        <div key={node} className="px-2 py-1 bg-black border border-purple-500/30 text-purple-100 rounded-sm text-xs sm:text-sm hover:border-purple-400 hover:bg-purple-900/10 transition-colors cursor-default">
                          {node}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-12 flex items-start gap-3 p-4 bg-black border border-ash-gray/20 border-l-4 border-l-cyan-600 rounded-sm text-ash-gray text-sm">
            <Info size={18} className="text-cyan-500 shrink-0 mt-0.5" />
            <p className="tracking-wide leading-relaxed">{t.note}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/30 bg-black flex justify-end relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
          <button
            onClick={onClose}
            className="group relative px-8 py-2.5 bg-black hover:bg-cyan-950/40 border border-cyan-500 text-cyan-400 font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 animate-pulse rounded-full"></span>
              {t.acknowledge}
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReadingGuideModal;
