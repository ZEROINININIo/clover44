import React, { useState, useRef, useEffect } from 'react';
import { novelData } from '../data/novelData';
import { sideCharacters } from '../data/sideCharacters';
import { User, Activity, Shield, Sparkles, Hash, Zap, Cpu, Brain, Heart, Wind, Share2, Network, ShieldAlert, Move, Minimize2, X, ChevronRight, Terminal } from 'lucide-react';
import { CharacterStats, Language } from '../types';
import MaskedText from '../components/MaskedText';

interface CharactersPageProps {
    language: Language;
    isLightTheme?: boolean;
}

// --- Data & Helpers for Relationship Graph ---

const relationships: Record<string, string[]> = {
  'point': ['zeri', 'zelo', 'void', 'dusk-rain', 'byaki'],
  'zeri': ['point', 'zelo', 'void', 'dusk-rain', 'byaki', 'puyou'],
  'zelo': ['point', 'zeri', 'void', 'dusk-rain', 'byaki'],
  'void': ['point', 'zeri', 'zelo', 'dusk-rain', 'byaki'],
  'byaki': ['void', 'point', 'zeri', 'zelo'], 
  'puyou': ['zeri'],
};

const getCharInfo = (id: string, language: Language) => {
  // 1. Check Main Characters
  const main = novelData.characters.find(c => c.id === id);
  if (main) {
    const t = main.translations[language] || main.translations['zh-CN'];
    return {
      id: main.id,
      name: t.name,
      role: t.role,
      color: main.themeColor || 'text-ash-light',
      isMain: true
    };
  }
  
  // 2. Check Side Characters
  const side = sideCharacters.find(c => c.id === id);
  if (side) {
    const t = side.translations[language] || side.translations['zh-CN'];
    return {
      id: side.id,
      name: t.name,
      role: t.role,
      color: 'text-ash-gray',
      isMain: false
    };
  }

  return null;
};

// Helper to parse inline tags like [[MASK::...]] and [[RAINBOW::...]]
const parseTextWithMask = (text: string) => {
  const parts = text.split(/(\[\[(?:MASK|RAINBOW)::.*?\]\])/g);
  return parts.map((part, index) => {
    if (part.startsWith('[[MASK::') && part.endsWith(']]')) {
      const content = part.slice(8, -2);
      return (
        <MaskedText key={index}>{content}</MaskedText>
      );
    }
    if (part.startsWith('[[RAINBOW::') && part.endsWith(']]')) {
      const content = part.slice(11, -2);
      return (
        <span key={index} className="bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 bg-clip-text text-transparent animate-pulse font-black tracking-wide inline-block">
          {content}
        </span>
      );
    }
    return part;
  });
};

// --- Components ---

// Draggable Floating Graph Window
const FloatingTopology = ({ 
    centerId, 
    language, 
    onSelect, 
    isLightTheme,
    isOpen,
    setIsOpen
}: { 
    centerId: string, 
    language: Language, 
    onSelect: (id: string) => void, 
    isLightTheme: boolean,
    isOpen: boolean,
    setIsOpen: (val: boolean) => void
}) => {
    const relatedIds = relationships[centerId] || [];
    const centerInfo = getCharInfo(centerId, language);
    
    // Dragging State
    const [position, setPosition] = useState({ x: 20, y: 100 }); 
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const windowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (window.innerWidth > 768) {
                setPosition({ x: window.innerWidth - 450, y: 150 });
            } else {
                setPosition({ x: 20, y: 100 }); 
            }
        }
    }, [isOpen]);

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        dragStartRef.current = { 
            x: e.clientX - position.x, 
            y: e.clientY - position.y 
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const newX = e.clientX - dragStartRef.current.x;
        const newY = e.clientY - dragStartRef.current.y;
        setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-20 right-4 z-40 p-3 rounded-full border shadow-lg transition-all hover:scale-110 active:scale-95 group ${isLightTheme ? 'bg-white border-zinc-300 text-zinc-800' : 'bg-ash-black border-ash-gray/50 text-ash-light'}`}
                title="Open Relationship Topology"
            >
                <Network size={24} className="group-hover:animate-spin-slow" />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-ash-black text-ash-light text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-ash-gray">
                    TOPOLOGY_VIEW
                </span>
            </button>
        );
    }

    if (!centerInfo || relatedIds.length === 0) return null;

    const size = 600;  
    const center = size / 2;
    const radius = 200; 

    return (
        <div 
            ref={windowRef}
            className={`fixed z-50 w-[340px] md:w-[420px] shadow-2xl backdrop-blur-xl border transition-opacity duration-300 animate-zoom-in-fast ${isLightTheme ? 'bg-white/80 border-zinc-300' : 'bg-ash-black/90 border-ash-gray/30'}`}
            style={{ 
                left: position.x, 
                top: position.y, 
                touchAction: 'none' 
            }}
        >
            {/* Header / Drag Handle */}
            <div 
                className={`flex items-center justify-between p-2 border-b cursor-move select-none ${isLightTheme ? 'bg-zinc-200/50 border-zinc-300' : 'bg-ash-dark/50 border-ash-gray/30'}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <div className="flex items-center gap-2 text-[10px] font-bold font-mono uppercase px-2 tracking-widest">
                    <Network size={12} className="text-emerald-500" />
                    NEURAL_TOPOLOGY <span className="text-ash-gray">// {centerInfo.name}</span>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                    }}
                    onPointerDown={(e) => e.stopPropagation()} 
                    onTouchStart={(e) => e.stopPropagation()} 
                    className="p-1.5 hover:bg-red-500 hover:text-white text-ash-gray rounded-sm transition-colors pointer-events-auto"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Content */}
            <div className="relative aspect-square w-full overflow-hidden">
                 {/* Background Grid */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none"></div>
                 
                 {/* Scanning Line Effect */}
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent h-[20%] animate-scan pointer-events-none"></div>
                 
                 <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full p-4 relative z-10">
                     {/* Connecting Lines */}
                     {relatedIds.map((id, i) => {
                         const angle = (i * 2 * Math.PI) / relatedIds.length - Math.PI / 2;
                         const x = center + radius * Math.cos(angle);
                         const y = center + radius * Math.sin(angle);
                         const isDead = id === 'dusk-rain';
                         const isIdentity = centerId === 'void' && id === 'byaki';
                         const isNotEqual = centerId === 'byaki' && id === 'void';
                         
                         return (
                             <g key={`line-${id}`}>
                                <line 
                                    x1={center} y1={center}
                                    x2={x} y2={y}
                                    stroke="currentColor"
                                    strokeOpacity={isDead ? "0.1" : isIdentity ? "0.8" : "0.2"} 
                                    strokeWidth={isIdentity ? "2" : "1"}
                                    strokeDasharray={isDead || isNotEqual ? "4,4" : "none"}
                                    className={isIdentity ? (isLightTheme ? "text-zinc-800" : "text-white") : "text-ash-gray"}
                                />
                                {/* Animated particle on line */}
                                {!isDead && (
                                    <circle r="2" fill="currentColor" className={isIdentity ? (isLightTheme ? "text-zinc-800" : "text-white") : "text-ash-gray"}>
                                        <animateMotion dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" path={`M ${center} ${center} L ${x} ${y}`} />
                                    </circle>
                                )}
                             </g>
                         );
                     })}

                     {/* Center Node */}
                     <g className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                        <circle cx={center} cy={center} r="65" className={`${centerInfo.color} fill-current opacity-10 animate-pulse`} />
                        <circle cx={center} cy={center} r="50" className={`fill-transparent stroke-2 ${centerInfo.color}`} />
                        {/* Inner decorative ring */}
                        <circle cx={center} cy={center} r="42" className={`fill-transparent stroke-1 ${centerInfo.color} opacity-50 stroke-dashed`} />
                        <text x={center} y={center} dy="0.35em" textAnchor="middle" className={`text-[28px] font-mono font-black uppercase ${centerInfo.color} fill-current pointer-events-none select-none`}>
                            {centerInfo.name.substring(0, 1)}
                        </text>
                     </g>

                     {/* Satellite Nodes */}
                     {relatedIds.map((id, i) => {
                         const angle = (i * 2 * Math.PI) / relatedIds.length - Math.PI / 2;
                         const x = center + radius * Math.cos(angle);
                         const y = center + radius * Math.sin(angle);
                         const info = getCharInfo(id, language);
                         const isDead = id === 'dusk-rain';
                         
                         if (!info) return null;

                         return (
                             <g 
                                key={id} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(info.isMain) onSelect(id);
                                }}
                                className={`transition-all duration-300 ${info.isMain ? 'cursor-pointer hover:scale-110' : 'cursor-default opacity-80'} ${isDead ? 'grayscale opacity-40' : ''}`}
                             >
                                 <circle cx={x} cy={y} r="35" className={`fill-current ${info.color} opacity-10`} />
                                 <circle cx={x} cy={y} r="35" className={`fill-transparent stroke-[1.5px] ${info.color} ${isDead ? 'stroke-dashed' : ''}`} />
                                 
                                 {isDead ? (
                                    <>
                                        <line x1={x-12} y1={y-12} x2={x+12} y2={y+12} stroke="currentColor" className={`${info.color}`} strokeWidth="1.5" />
                                        <line x1={x+12} y1={y-12} x2={x-12} y2={y+12} stroke="currentColor" className={`${info.color}`} strokeWidth="1.5" />
                                    </>
                                 ) : (
                                     <>
                                        <text x={x} y={y} dy="0.35em" textAnchor="middle" className={`text-[11px] font-mono font-bold uppercase ${info.color} fill-current select-none tracking-wider`}>
                                            {info.name}
                                        </text>
                                     </>
                                 )}
                             </g>
                         );
                     })}
                 </svg>
            </div>
            
            {/* Footer Stats */}
            <div className={`p-2 px-3 flex justify-between items-center text-[9px] font-mono border-t ${isLightTheme ? 'border-zinc-300 text-zinc-500 bg-zinc-100/50' : 'border-ash-gray/30 text-ash-gray bg-ash-dark/50'}`}>
                <span className="flex items-center gap-1"><Activity size={10} className="text-emerald-500" /> SYNC_STABLE</span>
                <span>LINKED_NODES: {relatedIds.length}</span>
            </div>
        </div>
    );
};

// Simple Radar Chart Component
const RadarChart = ({ stats, colorClass }: { stats: CharacterStats; colorClass: string }) => {
  const size = 120;
  const center = size / 2;
  const radius = 45;
  const maxStat = 10;
  
  const getPoint = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (value / maxStat) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  };

  const statValues = [stats.strength, stats.intelligence, stats.mental, stats.resonance, stats.agility];
  const points = statValues.map((val, i) => getPoint(val, i, 5)).join(' ');

  const labels = [
    { label: "STR", x: 60, y: 8 },
    { label: "INT", x: 110, y: 42 },
    { label: "MEN", x: 92, y: 110 },
    { label: "RES", x: 28, y: 110 },
    { label: "AGI", x: 10, y: 42 },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[200px] mx-auto group">
      {/* Decorative rotating rings */}
      <div className="absolute inset-0 rounded-full border border-ash-gray/20 border-dashed animate-spin-slow opacity-50"></div>
      <div className="absolute inset-4 rounded-full border border-ash-gray/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }}></div>

      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible relative z-10">
        {/* Background Grid (Pentagon) */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
           <polygon 
             key={scale}
             points={Array(5).fill(maxStat * scale).map((val, i) => getPoint(val, i, 5)).join(' ')}
             fill="none"
             stroke="currentColor"
             className="text-ash-gray opacity-20"
             strokeWidth="0.5"
           />
        ))}
        {/* Axes */}
        {labels.map((_, i) => (
             <line 
                key={i}
                x1={center} y1={center}
                x2={getPoint(maxStat, i, 5).split(',')[0]}
                y2={getPoint(maxStat, i, 5).split(',')[1]}
                stroke="currentColor"
                className="text-ash-gray opacity-30"
                strokeWidth="0.5"
             />
        ))}

        {/* Data Polygon */}
        <polygon 
          points={points} 
          fill="currentColor" 
          fillOpacity="0.2"
          stroke="currentColor" 
          strokeWidth="1.5"
          className={`${colorClass} transition-all duration-500`}
        />
        {/* Points */}
        {statValues.map((val, i) => {
            const [x, y] = getPoint(val, i, 5).split(',');
            return (
                <g key={i}>
                    <circle cx={x} cy={y} r="2" className={`${colorClass} fill-current transition-all duration-500`} />
                    <circle cx={x} cy={y} r="4" className={`${colorClass} fill-transparent stroke-current opacity-50 transition-all duration-500`} strokeWidth="0.5" />
                </g>
            );
        })}
        
        {/* Labels */}
        {labels.map((l, i) => (
            <text key={i} x={l.x} y={l.y} textAnchor="middle" fontSize="6" fill="currentColor" className="text-ash-gray font-mono font-bold tracking-widest">{l.label}</text>
        ))}
      </svg>
    </div>
  );
};

export default function CharactersPage({ language, isLightTheme = false }: CharactersPageProps) {
  const [selectedId, setSelectedId] = useState<string>(novelData.characters[0].id);
  const [isGraphOpen, setIsGraphOpen] = useState(false); 
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const selectedChar = novelData.characters.find(c => c.id === selectedId) || novelData.characters[0];
  const tChar = selectedChar.translations[language] || selectedChar.translations['zh-CN'];

  // Identify censored characters: Zeri, Byaki, Void, Puyou
  const isStatsEncrypted = ['zeri', 'byaki', 'void', 'puyou'].includes(selectedId);

  const getIcon = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('支援') || r.includes('重装') || r.includes('support') || r.includes('heavy')) return <Shield className="w-5 h-5" />;
    if (r.includes('科研') || r.includes('前线') || r.includes('research') || r.includes('frontline')) return <Activity className="w-5 h-5" />;
    if (r.includes('？？？') || r.includes('???')) return <Sparkles className="w-5 h-5" />;
    return <User className="w-5 h-5" />;
  };

  const statsList = [
      { label: "STRENGTH", val: selectedChar.stats.strength, icon: Zap },
      { label: "INTELLIGENCE", val: selectedChar.stats.intelligence, icon: Brain },
      { label: "AGILITY", val: selectedChar.stats.agility, icon: Wind },
      { label: "MENTAL", val: selectedChar.stats.mental, icon: Heart },
      { label: "RESONANCE", val: selectedChar.stats.resonance, icon: Cpu },
  ];

  return (
    <div className="flex flex-col h-full bg-halftone overflow-hidden relative">
      
      {/* Top Header */}
      <header className={`p-4 md:p-6 border-b z-20 flex justify-between items-center shrink-0 ${isLightTheme ? 'bg-white border-zinc-200' : 'bg-ash-black border-ash-dark'}`}>
        <div>
            <h2 className={`text-xl md:text-2xl font-black mb-1 uppercase tracking-tighter flex items-center gap-3 ${isLightTheme ? 'text-zinc-900' : 'text-ash-light'}`}>
                <User size={24} className="md:w-6 md:h-6" />
                {language === 'en' ? 'Personnel_File' : '人员档案'}
            </h2>
            <div className={`text-[10px] font-mono flex gap-2 ${isLightTheme ? 'text-zinc-500' : 'text-ash-gray'}`}>
                <span className={`px-1 ${isLightTheme ? 'bg-zinc-200' : 'bg-ash-dark'}`}>CONFIDENTIAL</span>
                <span>// AUTH_REQ_LEVEL_5</span>
            </div>
        </div>
        <div className="hidden md:block text-right">
             <div className={`text-xs font-bold font-mono border px-2 py-1 inline-block ${isLightTheme ? 'text-zinc-700 border-zinc-300 bg-zinc-50' : 'text-ash-light border-ash-gray bg-ash-dark/50'}`}>
                DB_STATUS: ONLINE
             </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
         
         {/* List Selection (Left Sidebar) */}
         <aside className={`w-full md:w-64 border-b md:border-b-0 md:border-r overflow-x-auto md:overflow-y-auto shrink-0 z-20 flex flex-row md:flex-col no-scrollbar ${isLightTheme ? 'bg-zinc-50 border-zinc-200' : 'bg-ash-black border-ash-dark'}`}>
             <div className="flex flex-row md:flex-col min-w-max md:min-w-0">
                 {novelData.characters.map(char => {
                     const charT = char.translations[language] || char.translations['zh-CN'];
                     return (
                        <button
                            key={char.id}
                            onClick={() => setSelectedId(char.id)}
                            className={`w-36 md:w-full text-left p-3 md:p-4 transition-all relative overflow-hidden group shrink-0 border-b ${isLightTheme ? 'border-zinc-200' : 'border-ash-gray/10'} ${
                                selectedId === char.id 
                                ? (isLightTheme ? 'bg-zinc-200/50' : 'bg-ash-dark/50') 
                                : (isLightTheme ? 'hover:bg-zinc-100' : 'hover:bg-ash-gray/5')
                            }`}
                        >
                            {/* Active Indicator Line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${selectedId === char.id ? (char.themeColor?.replace('text-', 'bg-') || 'bg-ash-light') : 'bg-transparent group-hover:bg-ash-gray/30'}`} />
                            
                            <div className="flex justify-between items-center z-10 relative pl-2">
                                <div>
                                    <div className={`font-black uppercase tracking-widest text-xs md:text-sm transition-colors ${selectedId === char.id ? (isLightTheme ? 'text-zinc-900' : 'text-white') : (isLightTheme ? 'text-zinc-500 group-hover:text-zinc-800' : 'text-ash-gray group-hover:text-ash-light')}`}>
                                        {charT.name}
                                    </div>
                                    <div className={`text-[9px] font-mono opacity-60 mt-0.5 tracking-wider ${isLightTheme ? 'text-zinc-600' : 'text-ash-gray'}`}>
                                        ID: {char.id.toUpperCase()}
                                    </div>
                                </div>
                                <div className={`transition-transform duration-300 ${selectedId === char.id ? 'scale-110 opacity-100' : 'scale-90 opacity-40 group-hover:opacity-80'} ${selectedId === char.id ? (char.themeColor || 'text-ash-light') : (isLightTheme ? 'text-zinc-500' : 'text-ash-gray')}`}>
                                    {getIcon(charT.role)}
                                </div>
                            </div>
                            
                            {/* Decorative Background for active */}
                            {selectedId === char.id && (
                                <div className={`absolute right-0 top-1/2 -translate-y-1/2 text-[60px] font-black opacity-[0.03] pointer-events-none select-none ${isLightTheme ? 'text-zinc-900' : 'text-white'}`}>
                                    {char.id.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                        </button>
                     );
                 })}
             </div>
         </aside>

         {/* Content View: Info, Stats, Dossier (Scrollable) */}
         <main key={selectedChar.id} className={`flex-1 flex flex-col h-full overflow-hidden relative ${isLightTheme ? 'bg-zinc-100' : 'bg-ash-black'}`}>
             
             {/* Huge Background Text */}
             <div className={`absolute -right-10 md:-right-20 top-20 text-[120px] md:text-[250px] font-black uppercase tracking-tighter opacity-[0.02] pointer-events-none select-none leading-none z-0 whitespace-nowrap ${isLightTheme ? 'text-zinc-900' : 'text-white'}`} style={{ writingMode: 'vertical-rl' }}>
                 {selectedChar.id}
             </div>

             <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 space-y-8 relative custom-scrollbar z-10">
                 
                 {/* Top Section: Name & Basic Info */}
                 <div className="flex flex-col lg:flex-row gap-8 items-start">
                     
                     {/* Left: Identity */}
                     <div className="flex-1 space-y-6 w-full">
                         {/* Header Block */}
                         <div className="relative">
                             <div className={`absolute -left-4 top-2 bottom-2 w-1 ${selectedChar.themeColor?.replace('text-', 'bg-') || 'bg-ash-light'}`}></div>
                             <div className="flex items-baseline gap-4 mb-2">
                                 <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none ${isLightTheme ? 'text-zinc-900' : 'text-white'}`}>
                                     {tChar.name}
                                 </h1>
                                 <span className={`text-sm md:text-lg font-mono font-bold ${selectedChar.themeColor || 'text-ash-light'}`}>
                                     {selectedChar.id.toUpperCase()}
                                 </span>
                             </div>
                             
                             <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-mono mt-4">
                                 <span className={`px-2 py-1 font-bold uppercase ${isLightTheme ? 'bg-zinc-800 text-white' : 'bg-ash-light text-ash-black'}`}>
                                     {parseTextWithMask(selectedChar.alias || "UNKNOWN")}
                                 </span>
                                 <span className={`flex items-center gap-1 ${isLightTheme ? 'text-zinc-500' : 'text-ash-gray'}`}>
                                     <ChevronRight size={14} /> ROLE: <span className={isLightTheme ? 'text-zinc-700' : 'text-white'}>{tChar.role}</span>
                                 </span>
                             </div>
                         </div>

                         {/* Avatar Frame (Always rendered) */}
                         <div 
                             className={`relative w-full max-w-sm overflow-hidden border ${isLightTheme ? 'border-zinc-300 bg-zinc-200/50' : 'border-ash-gray/30 bg-ash-dark/30'} ${selectedChar.avatar ? 'cursor-pointer group' : 'aspect-square flex items-center justify-center'}`}
                             onClick={() => selectedChar.avatar && setEnlargedImage(selectedChar.avatar)}
                         >
                             {selectedChar.avatar ? (
                                 <>
                                     <img 
                                         src={selectedChar.avatar} 
                                         alt={tChar.name} 
                                         className="w-full h-auto object-cover select-none transition-transform duration-500 group-hover:scale-105" 
                                         onContextMenu={(e) => e.preventDefault()} 
                                         draggable={false} 
                                     />
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                         <div className="flex items-center gap-2 text-white font-bold tracking-widest uppercase text-sm">
                                             <Move size={18} /> ENLARGE
                                         </div>
                                     </div>
                                 </>
                             ) : (
                                 <div className="flex flex-col items-center justify-center opacity-40 select-none">
                                     <User size={48} className={`mb-3 ${isLightTheme ? 'text-zinc-500' : 'text-ash-gray'}`} />
                                     <span className={`text-xs font-mono font-bold tracking-widest uppercase ${isLightTheme ? 'text-zinc-500' : 'text-ash-gray'}`}>
                                         NO IMAGE DATA
                                     </span>
                                 </div>
                             )}
                         </div>

                         {/* Quote */}
                         {tChar.quote && (
                             <div className={`relative p-4 md:p-6 border-l-2 backdrop-blur-sm ${isLightTheme ? 'bg-zinc-200/50 border-zinc-400' : 'bg-ash-dark/30 border-ash-gray/30'}`}>
                                 <div className={`absolute -top-4 -left-3 text-5xl opacity-20 font-serif ${isLightTheme ? 'text-zinc-800' : 'text-white'}`}>"</div>
                                 <div className={`italic font-serif text-base md:text-lg leading-relaxed ${isLightTheme ? 'text-zinc-700' : 'text-ash-light'}`}>
                                     {tChar.quote}
                                 </div>
                             </div>
                         )}

                         {/* Tags */}
                         <div className="flex flex-wrap gap-2 pt-2">
                             {tChar.tags.map(tag => (
                                 <span key={tag} className={`px-3 py-1 text-[10px] md:text-xs font-mono uppercase tracking-widest border ${isLightTheme ? 'border-zinc-300 text-zinc-600 bg-white' : 'border-ash-gray/30 text-ash-gray bg-ash-dark/50'}`}>
                                     {tag}
                                 </span>
                             ))}
                         </div>
                     </div>

                     {/* Right: Stats Box */}
                     <div className={`w-full lg:w-[320px] shrink-0 relative p-1 ${isLightTheme ? 'bg-zinc-200' : 'bg-ash-gray/20'}`}>
                         {/* Inner container for border effect */}
                         <div className={`p-5 h-full relative ${isLightTheme ? 'bg-white' : 'bg-ash-black'}`}>
                             {/* Decorative corners */}
                             <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-50"></div>
                             <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current opacity-50"></div>
                             <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current opacity-50"></div>
                             <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-50"></div>

                             {/* Encrypted Overlay */}
                             {isStatsEncrypted && (
                                 <div className="absolute inset-0 z-20 backdrop-blur-md flex flex-col items-center justify-center border border-red-500/30 bg-black/40">
                                     <ShieldAlert size={40} className="text-red-500 mb-3 animate-pulse" />
                                     <div className="text-lg font-black text-red-500 tracking-widest uppercase">Classified</div>
                                     <div className="text-[10px] font-mono text-red-400/80 mt-1 uppercase text-center">
                                         Clearance Level Insufficient<br/>Data Redacted
                                     </div>
                                 </div>
                             )}

                             <div className={`transition-all duration-500 ${isStatsEncrypted ? 'opacity-10 blur-sm grayscale pointer-events-none' : ''}`}>
                                 <div className="flex items-center justify-between mb-6">
                                     <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isLightTheme ? 'text-zinc-800' : 'text-white'}`}>
                                         <Activity size={14} className={selectedChar.themeColor || 'text-ash-light'} /> 
                                         {language === 'en' ? 'Combat_Data' : '战斗数据'}
                                     </h3>
                                     <div className={`text-[10px] font-mono px-1.5 py-0.5 ${isLightTheme ? 'bg-zinc-100 text-zinc-600' : 'bg-ash-dark text-ash-gray'}`}>
                                         SYNC: {selectedChar.stats.resonance * 10}%
                                     </div>
                                 </div>
                                 
                                 <div className="mb-6">
                                     <RadarChart stats={selectedChar.stats} colorClass={selectedChar.themeColor || 'text-ash-light'} />
                                 </div>
                                 
                                 <div className="space-y-3">
                                     {statsList.map((stat) => (
                                         <div key={stat.label} className="flex flex-col gap-1">
                                             <div className={`flex justify-between items-center text-[9px] font-mono uppercase tracking-wider ${isLightTheme ? 'text-zinc-500' : 'text-ash-gray'}`}>
                                                 <span className="flex items-center gap-1.5">
                                                     <stat.icon size={10} /> {stat.label}
                                                 </span>
                                                 <span>{stat.val}/10</span>
                                             </div>
                                             <div className={`h-1.5 w-full flex gap-[2px] ${isLightTheme ? 'bg-zinc-100' : 'bg-ash-dark'}`}>
                                                 {Array(10).fill(0).map((_, i) => (
                                                     <div 
                                                         key={i} 
                                                         className={`flex-1 transition-all duration-500 ${i < stat.val ? (selectedChar.themeColor?.replace('text-', 'bg-') || 'bg-ash-light') : 'opacity-0'}`} 
                                                     />
                                                 ))}
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Bottom Section: Dossier */}
                 <div className={`mt-8 md:mt-12 relative p-6 md:p-8 border ${isLightTheme ? 'bg-white border-zinc-200 shadow-sm' : 'bg-ash-dark/40 border-ash-gray/20'}`}>
                     {/* Decorative Header */}
                     <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent ${isLightTheme ? 'via-zinc-300' : 'via-ash-gray/20'}`}></div>
                     
                     <div className={`flex items-center gap-3 mb-6 border-b pb-4 ${isLightTheme ? 'border-zinc-200' : 'border-ash-gray/20'}`}>
                         <Terminal size={18} className={selectedChar.themeColor || 'text-ash-light'} />
                         <h3 className={`text-sm md:text-base font-black uppercase tracking-widest ${isLightTheme ? 'text-zinc-800' : 'text-white'}`}>
                             Field Analysis Report
                         </h3>
                     </div>

                     <div className="space-y-6 font-mono text-xs md:text-sm leading-relaxed">
                         {tChar.description.map((para, idx) => {
                             const parts = para.split('**');
                             return (
                                 <div key={idx} className="flex gap-4 group">
                                     <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
                                         <span className={`text-[10px] font-bold transition-colors ${isLightTheme ? 'text-zinc-400 group-hover:text-zinc-800' : 'text-ash-gray group-hover:text-white'}`}>
                                             {String(idx + 1).padStart(2, '0')}
                                         </span>
                                         {idx !== tChar.description.length - 1 && (
                                             <div className={`w-px h-full transition-colors ${isLightTheme ? 'bg-zinc-200 group-hover:bg-zinc-400' : 'bg-ash-gray/20 group-hover:bg-ash-gray/50'}`}></div>
                                         )}
                                     </div>
                                     <p className={`pb-4 ${isLightTheme ? 'text-zinc-700' : 'text-ash-light/90'}`}>
                                         {parts.map((part, i) => 
                                             i % 2 === 1 
                                             ? <strong key={i} className={`font-black px-1 mx-0.5 ${isLightTheme ? 'bg-zinc-200 text-zinc-900' : 'bg-ash-light/10 text-white'}`}>{part}</strong> 
                                             : parseTextWithMask(part)
                                         )}
                                     </p>
                                 </div>
                             );
                         })}
                     </div>
                 </div>
                 
                 {/* Spacer for floating button */}
                 <div className="h-24"></div>
             </div>
         </main>
      </div>

      {/* Floating Topology Window */}
      <FloatingTopology 
          centerId={selectedChar.id} 
          language={language} 
          onSelect={setSelectedId} 
          isLightTheme={isLightTheme} 
          isOpen={isGraphOpen}
          setIsOpen={setIsGraphOpen}
      />

      {/* Image Enlargement Modal */}
      {enlargedImage && (
          <div 
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
              onClick={() => setEnlargedImage(null)}
          >
              <img 
                  src={enlargedImage} 
                  alt="Enlarged Avatar" 
                  className="max-w-full max-h-full object-contain select-none shadow-2xl" 
                  onContextMenu={(e) => e.preventDefault()} 
                  draggable={false} 
              />
              <button 
                  className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                  onClick={(e) => { e.stopPropagation(); setEnlargedImage(null); }}
              >
                  <X size={24} />
              </button>
          </div>
      )}

    </div>
    );
}
