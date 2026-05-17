
import React, { useState } from 'react';
import { sideCharacters } from '../../data/sideCharacters';
import { Language, SideCharacterData } from '../../types';
import { Folder, FolderOpen, Lock, ShieldAlert, X, Hash, Star, Flame, Music, CloudRain, RefreshCw, Move } from 'lucide-react';

interface SideCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  isLightTheme: boolean;
}

const SideCharacterModal: React.FC<SideCharacterModalProps> = ({ isOpen, onClose, language, isLightTheme }) => {
  const [selectedCharId, setSelectedCharId] = useState<string>(sideCharacters[0].id);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  
  if (!isOpen) return null;

  // Group characters for tree view
  const groupedCharacters = sideCharacters.reduce((acc, char) => {
    if (!acc[char.group]) acc[char.group] = [];
    acc[char.group].push(char);
    return acc;
  }, {} as Record<string, SideCharacterData[]>);

  const char = sideCharacters.find(c => c.id === selectedCharId) || sideCharacters[0];
  // Fallback to zh-CN if translation missing (e.g. for removed EN data)
  const t = char?.translations[language] || char?.translations['zh-CN'];
    
  if (!char) return null;

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-[2px] p-4 animate-fade-in" onClick={onClose}>
            <div 
                className={`w-full max-w-4xl border-2 shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh] md:h-auto md:min-h-[600px] md:max-h-[85vh] ${isLightTheme ? 'bg-white border-zinc-300' : 'bg-ash-black border-ash-dark'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Mobile Close Button (Top Right Absolute) */}
                <button 
                    onClick={onClose} 
                    className={`absolute top-2 right-2 p-2 md:hidden z-50 ${isLightTheme ? 'text-zinc-500 hover:text-black' : 'text-ash-gray hover:text-ash-light'}`}
                >
                    <X size={24} />
                </button>

                {/* Sidebar (Character List) - Fixed width, scrolls independently if needed */}
                <div className={`w-full md:w-56 lg:w-64 border-b-2 md:border-b-0 md:border-r-2 p-4 flex flex-col gap-2 overflow-y-auto shrink-0 no-scrollbar max-h-48 md:max-h-full ${isLightTheme ? 'bg-zinc-50 border-zinc-200' : 'bg-ash-dark border-ash-gray/30'}`}>
                     <div className={`text-[10px] font-mono uppercase mb-4 pb-2 border-b flex items-center gap-2 sticky top-0 z-10 ${isLightTheme ? 'text-zinc-500 border-zinc-200 bg-zinc-50' : 'text-ash-gray border-ash-gray/30 bg-ash-dark'}`}>
                        <FolderOpen size={12} /> ROOT/PERSONNEL_DB
                     </div>
                     
                     {Object.entries(groupedCharacters).map(([groupName, groupChars]) => (
                         <div key={groupName} className="mb-2">
                             <div className={`flex items-center gap-2 text-[10px] font-bold mb-1 px-1 ${isLightTheme ? 'text-zinc-600' : 'text-ash-light/70'}`}>
                                <span className="opacity-50">├─</span>
                                <Folder size={10} className="opacity-50" />
                                {groupName}
                             </div>
                             
                             <div className={`flex flex-col border-l border-dashed ml-3 pl-2 gap-1 py-1 ${isLightTheme ? 'border-zinc-300' : 'border-ash-gray/20'}`}>
                                {groupChars.map(c => {
                                    // Fallback name logic
                                    const cName = c.translations[language]?.name || c.translations['zh-CN'].name;
                                    const isSelected = selectedCharId === c.id;
                                    
                                    // Item styling based on theme
                                    let btnClass = "";
                                    if (isLightTheme) {
                                        btnClass = isSelected 
                                            ? 'text-black bg-zinc-200 font-bold pl-3' 
                                            : 'text-zinc-500 hover:text-black hover:bg-zinc-100 hover:pl-3';
                                    } else {
                                        btnClass = isSelected 
                                            ? 'text-ash-light bg-ash-gray/20 font-bold pl-3' 
                                            : 'text-ash-gray hover:text-ash-light hover:bg-ash-gray/10 hover:pl-3';
                                    }

                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => setSelectedCharId(c.id)}
                                            className={`text-left text-xs font-mono py-1 px-2 flex items-center gap-2 transition-all duration-200 relative group/item ${btnClass}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${c.isLocked ? 'bg-red-500/50' : 'bg-green-500/50'} ${isSelected ? 'animate-pulse' : ''}`} />
                                            <span className="truncate">{cName}</span>
                                            {c.isLocked && <Lock size={8} className="ml-auto opacity-50" />}
                                            
                                            {isSelected && <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${isLightTheme ? 'bg-black' : 'bg-ash-light'}`}></div>}
                                        </button>
                                    );
                                })}
                             </div>
                         </div>
                     ))}
                </div>

                {/* Main Content Wrapper (Scrollable) */}
                <div className={`flex-1 relative overflow-x-hidden ${char.id === 'collab-yuyuko' ? 'md:overflow-hidden overflow-y-auto' : 'overflow-y-auto custom-scrollbar'} ${isLightTheme ? 'bg-white' : 'bg-ash-black'}`}>
                     
                     <div className="min-h-full relative">
                        {/* --- BACKGROUND LAYER (Absolute to wrapper, sticks to corners) --- */}
                        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                            
                            {/* Standard Background Decor */}
                            {char.id !== 'collab-yuyuko' && char.id !== 'dusk-rain' && (
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <Hash size={200} strokeWidth={1} />
                                </div>
                            )}

                            {/* === DUSK RAIN SPECIAL BACKGROUND: Twilight Strings / Amber === */}
                            {char.id === 'dusk-rain' && (
                                <div className="absolute inset-0 pointer-events-none select-none">
                                    {/* 1. Twilight Gradient Base */}
                                    <div className={`absolute inset-0 bg-gradient-to-b ${isLightTheme ? 'from-amber-100 via-zinc-100 to-zinc-200' : 'from-[#3a2008] via-[#1a1a1a] to-[#09090b]'} transition-colors duration-500 h-full`}></div>
                                    
                                    {/* 2. Guitar Strings (6 Lines) */}
                                    <div className="absolute inset-0 flex flex-col justify-center gap-12 opacity-10 h-full">
                                        <style>
                                            {`
                                                @keyframes stringVibrate {
                                                    0%, 100% { transform: scaleY(1); opacity: 0.1; }
                                                    50% { transform: scaleY(1.5); opacity: 0.3; }
                                                }
                                            `}
                                        </style>
                                        {[...Array(6)].map((_, i) => (
                                            <div 
                                                key={`string-${i}`} 
                                                className={`w-full h-[1px] ${isLightTheme ? 'bg-amber-900' : 'bg-amber-500'}`}
                                                style={{ 
                                                    animation: `stringVibrate ${Math.random() * 2 + 3}s ease-in-out infinite`,
                                                    animationDelay: `${i * 0.5}s`
                                                }}
                                            ></div>
                                        ))}
                                    </div>

                                    {/* 3. Golden Rain (Slanted) */}
                                    {Array.from({ length: 20 }).map((_, i) => (
                                        <div 
                                            key={`rain-${i}`}
                                            className={`absolute w-[1px] ${isLightTheme ? 'bg-amber-800/20' : 'bg-amber-200/10'}`}
                                            style={{
                                                height: `${Math.random() * 20 + 10}%`,
                                                left: `${Math.random() * 100}%`,
                                                top: '-20%',
                                                transform: 'rotate(15deg)',
                                                animation: `dataRain ${Math.random() * 1.5 + 1}s linear infinite`,
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            )}

                            {/* === YUYUKO SPECIAL BACKGROUND: Purple-Blue Star / Abyss === */}
                            {char.id === 'collab-yuyuko' && (
                                <div className="absolute inset-0 pointer-events-none select-none">
                                    {/* 1. Deep Space/Indigo Base */}
                                    <div className={`absolute inset-0 bg-gradient-to-b ${isLightTheme ? 'from-purple-50 via-white to-blue-50' : 'from-[#1a103c] via-[#2d1b69] to-[#0f0518]'} transition-colors duration-500 h-full`}></div>
                                    
                                    {/* 2. Rising Glass Shards (Particles) - Purple/Cyan tinted */}
                                    {Array.from({ length: 15 }).map((_, i) => (
                                        <div 
                                            key={`shard-${i}`}
                                            className={`absolute border-t border-l ${isLightTheme ? 'border-purple-300 bg-white/40' : 'border-purple-400/20 bg-blue-500/5'} backdrop-blur-[1px]`}
                                            style={{
                                                width: `${Math.random() * 20 + 10}px`,
                                                height: `${Math.random() * 20 + 10}px`,
                                                left: `${Math.random() * 100}%`,
                                                top: `${Math.random() * 120}%`, // Start below
                                                opacity: Math.random() * 0.3 + 0.1,
                                                transform: `rotate(${Math.random() * 360}deg)`,
                                                animation: `floatUp ${Math.random() * 10 + 15}s linear infinite`,
                                                animationDelay: `-${Math.random() * 10}s`,
                                                clipPath: 'polygon(0 0, 100% 0, 50% 100%)' // Triangle shards
                                            }}
                                        ></div>
                                    ))}

                                    {/* 4. The Mirror/Halo Ring (Center) - Indigo Tint */}
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] max-w-[400px] max-h-[400px] border ${isLightTheme ? 'border-indigo-200' : 'border-indigo-500/10'} rounded-full animate-spin-slow pointer-events-none`}></div>
                                </div>
                            )}

                            {/* === UNKNOWN ARC03 SPECIAL BACKGROUND === */}
                            {char.id === 'unknown-arc03' && (
                                <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden opacity-30 md:opacity-50">
                                    <img 
                                        src="/arc03_bg.png" 
                                        alt="" 
                                        className={`w-[120%] max-w-[800px] h-[120%] object-contain animate-spin-slow ${isLightTheme ? 'invert contrast-200 opacity-20 mix-blend-multiply' : 'mix-blend-screen opacity-30 blur-[2px]'}`}
                                    />
                                    <img 
                                        src="/arc03_bg.png" 
                                        alt="" 
                                        className={`absolute w-[90%] max-w-[600px] h-[90%] object-contain animate-pulse ${isLightTheme ? 'invert mix-blend-multiply opacity-50' : 'mix-blend-screen'}`}
                                    />
                                </div>
                            )}

                            {/* Mobile Avatar Overlay (Background) */}
                            {char.avatar && !char.isLocked && (
                                <div 
                                    className="md:hidden absolute bottom-0 right-0 w-2/3 h-2/3 pointer-events-auto opacity-20 z-0 cursor-pointer group"
                                    onClick={() => setEnlargedImage(char.avatar!)}
                                >
                                    <img 
                                        src={char.avatar} 
                                        alt={t.name} 
                                        className="w-full h-full object-contain object-bottom mask-image-gradient-b select-none transition-transform duration-500 group-hover:scale-105"
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                </div>
                            )}
                        </div>

                        {/* --- CONTENT LAYER (Relative) --- */}
                        <div className="relative z-10 p-6 md:p-8">
                            
                            <button onClick={onClose} className={`absolute top-2 right-2 p-2 hidden md:block z-50 ${isLightTheme ? 'text-zinc-400 hover:text-zinc-900' : 'text-ash-gray hover:text-ash-light'}`}>
                                <X size={20} />
                            </button>

                            {char.isLocked ? (
                                <div className="flex flex-col items-center justify-center text-center opacity-80 min-h-[400px] relative">
                                    {/* Dynamic Color Logic */}
                                    {(() => {
                                        // Default Red Theme
                                        let borderColor = isLightTheme ? 'border-red-200' : 'border-red-900/50';
                                        let bgColor = isLightTheme ? 'bg-red-50' : 'bg-red-950/10';
                                        let cornerColor = 'border-red-800';
                                        let iconColor = 'text-red-800';
                                        let titleColor = 'text-red-700';
                                        let subColor = 'text-red-900';
                                        let mainIcon = <ShieldAlert size={48} className={`${iconColor} mx-auto mb-4 animate-pulse`} />;
                                        let titleText = 'ACCESS DENIED';
                                        let subText = 'Encrypted File // Auth Missing';

                                        return (
                                            <div className={`border p-8 max-w-xs relative z-10 backdrop-blur-sm ${borderColor} ${bgColor}`}>
                                                <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${cornerColor}`}></div>
                                                <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${cornerColor}`}></div>
                                                <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${cornerColor}`}></div>
                                                <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${cornerColor}`}></div>
                                                
                                                {mainIcon}
                                                
                                                <h2 className={`text-xl font-black uppercase tracking-widest mb-1 ${titleColor}`}>
                                                    {titleText}
                                                </h2>
                                                <p className={`text-[10px] font-mono uppercase ${subColor}`}>
                                                    {subText}
                                                </p>
                                            </div>
                                        );
                                    })()}
                                    
                                    <div className={`mt-8 font-mono text-xs z-10 ${isLightTheme ? 'text-zinc-400' : 'text-ash-gray/50'}`}>
                                        {'>'} ID: {char.id.toUpperCase()}<br/>
                                        {'>'} STATUS: {char.themeColor ? 'PREVIEW_MODE' : 'LOCKED'}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-6 pt-4 md:pt-0">
                                    
                                    {/* --- Left Column: Info --- */}
                                    <div className="flex-1 space-y-6 animate-fade-in">
                                        {/* Special Header for Dusk Rain */}
                                        {char.id === 'dusk-rain' && (
                                            <div className="absolute top-0 right-0 opacity-50 flex gap-1">
                                                <Music size={12} className="text-amber-500 animate-bounce" />
                                                <CloudRain size={12} className="text-amber-300 animate-pulse" />
                                            </div>
                                        )}

                                        <div className={`border-b pb-4 ${isLightTheme ? 'border-zinc-200' : 'border-ash-gray/30'}`}>
                                            <h2 className={`text-2xl md:text-4xl font-black uppercase tracking-tighter mb-1 
                                                ${isLightTheme ? 'text-zinc-900' : (char.themeColor || 'text-ash-light')}
                                            `}>
                                                {t.name}
                                            </h2>
                                            <div className={`flex flex-wrap items-center gap-2 text-xs font-mono ${isLightTheme ? 'text-zinc-500' : 'text-ash-gray'}`}>
                                                {t.enName && t.enName !== t.name && (
                                                    <span className={`px-1 border ${isLightTheme ? 'bg-zinc-100 border-zinc-300 text-zinc-700' : 'text-ash-light bg-ash-dark border-ash-gray/50'}`}>{t.enName}</span>
                                                )}
                                                <span>// {t.role}</span>
                                                <span className="ml-auto opacity-50">ID: {char.id.toUpperCase()}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {t.tags.map(tag => (
                                                <span key={tag} className={`px-2 py-1 border rounded-full text-[10px] font-mono ${isLightTheme ? 'border-zinc-300 text-zinc-600' : 'border-ash-gray/50 text-ash-gray'}`}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        {t.quote && (
                                            <div className={`border-l-2 pl-3 py-1 text-sm italic font-serif ${isLightTheme ? 'border-zinc-400 text-zinc-600' : 'border-ash-light text-ash-light/80'}`}>
                                                "{t.quote}"
                                            </div>
                                        )}

                                        <div className={`space-y-4 text-sm font-mono leading-relaxed border-t border-dashed pt-4 pb-8 md:pb-0 ${isLightTheme ? 'text-zinc-700 border-zinc-200' : 'text-ash-gray/90 border-ash-gray/30'}`}>
                                            {t.description.map((para, i) => {
                                                const parts = para.split('**');
                                                return (
                                                    <div key={i} className={para.startsWith('•') || para.startsWith('> ') ? "pl-4" : ""}>
                                                        {parts.map((part, idx) => 
                                                            idx % 2 === 1 
                                                            ? <span key={idx} className={`font-bold px-1 ${isLightTheme ? 'bg-zinc-200 text-black' : 'text-ash-light bg-ash-dark/50'}`}>{part}</span> 
                                                            : part
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* --- Right Column: Avatar Display (Desktop) --- */}
                                    {char.avatar && (
                                        <div 
                                            className="hidden md:flex w-1/3 flex-col justify-end items-center relative min-h-[300px] group cursor-pointer"
                                            onClick={() => setEnlargedImage(char.avatar!)}
                                        >
                                            {/* Stand Avatar - Absolute positioned at bottom of this column */}
                                            {/* Enlarged for Yuyuko */}
                                            <div className={`absolute bottom-0 right-0 ${char.id === 'collab-yuyuko' ? 'w-[140%] h-[100%] -right-10' : 'w-full h-[85%]'} flex items-end justify-center pointer-events-auto transition-transform duration-300 group-hover:scale-[1.02] origin-bottom`}>
                                                <img 
                                                    src={char.avatar} 
                                                    alt={t.name} 
                                                    className={`max-h-full max-w-full object-contain drop-shadow-2xl animate-fade-in select-none ${char.id === 'collab-yuyuko' ? 'scale-125' : ''}`}
                                                    style={{ maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)' }}
                                                    onContextMenu={(e) => e.preventDefault()}
                                                    draggable={false}
                                                />
                                                {/* Tooltip */}
                                                <div className="absolute top-[10%] right-[10%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-none">
                                                    <div className={`px-3 py-1.5 text-xs font-bold rounded-sm border backdrop-blur-md shadow-lg whitespace-nowrap flex items-center gap-2 ${isLightTheme ? 'bg-white/80 border-zinc-300 text-zinc-800' : 'bg-black/80 border-white/20 text-white'}`}>
                                                        <Move size={12} /> ENLARGE
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Visual Effects - Inside Scroll Layer so they follow avatar */}
                                            {char.id === 'collab-yuyuko' && (
                                                <div className="absolute inset-0 pointer-events-none">
                                                    <div className="absolute bottom-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-float-up-fast"></div>
                                                    <div className="absolute bottom-20 right-10 w-1 h-1 bg-cyan-400 rounded-full animate-float-up-medium"></div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                     </div>
                </div>
            </div>

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
};

export default SideCharacterModal;
