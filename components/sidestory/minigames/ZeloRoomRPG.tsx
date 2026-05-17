import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MessageCircle, X, Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, DoorClosed, Lock } from 'lucide-react';

interface ZeloRoomRPGProps {
    onClose: () => void;
    language: 'zh-CN' | 'zh-TW' | 'en';
}

// Game Constants
const GAME_WIDTH = 700;
const GAME_HEIGHT = 500;
const PLAYER_SIZE = 40;
const SPEED = 5;
const RIGHT_LIMIT = 580; // The visual boundary line

// Reusable Star SVG Component
const StarSprite = ({ color, className }: { color: string, className?: string }) => (
    <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-[0_0_8px_currentColor] ${className}`} style={{ color }}>
        <path d="M50 0 C55 35 65 45 100 50 C65 55 55 65 50 100 C45 65 35 55 0 50 C35 45 45 35 50 0 Z" fill="currentColor" />
    </svg>
);

export const ZeloRoomRPG: React.FC<ZeloRoomRPGProps> = ({ onClose, language }) => {
    // --- State ---
    const [player, setPlayer] = useState({ x: 350, y: 350, dir: 'down', moving: false });
    const [dialogue, setDialogue] = useState<string | null>(null);
    const [activeTarget, setActiveTarget] = useState<'npc' | 'bookshelf' | 'door' | null>(null);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    
    // Viewport Size State for Camera Follow
    const [viewport, setViewport] = useState({ w: 700, h: 500 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Refs for Game Loop
    const requestRef = useRef<number | null>(null);
    const keysPressed = useRef<Record<string, boolean>>({});
    const playerRef = useRef(player); // Mutable ref for loop
    
    // Memoize building heights
    const buildingHeights = useMemo(() => {
        return Array.from({ length: 30 }).map(() => 20 + Math.random() * 80);
    }, []);
    
    // Positions
    const yuyukoPos = { x: 350, y: 150, w: 40, h: 40 };
    const bookshelfPos = { x: 40, y: 180, w: 50, h: 100 };
    const doorPos = { x: 0, y: 360, w: 20, h: 80 };

    // --- Viewport Resize Handler ---
    useEffect(() => {
        const updateViewport = () => {
            if (containerRef.current) {
                setViewport({
                    w: containerRef.current.clientWidth,
                    h: containerRef.current.clientHeight
                });
            }
        };
        
        window.addEventListener('resize', updateViewport);
        // Initial measurement
        updateViewport();
        // Delay measurement slightly to ensure layout is settled
        setTimeout(updateViewport, 100);

        return () => window.removeEventListener('resize', updateViewport);
    }, []);

    // --- Camera Transform Logic ---
    const getCameraStyle = () => {
        const mapW = GAME_WIDTH;
        const mapH = GAME_HEIGHT;
        const vpW = viewport.w;
        const vpH = viewport.h;
        
        const playerCenterX = player.x + PLAYER_SIZE / 2;
        const playerCenterY = player.y + PLAYER_SIZE / 2;
        
        let tx = 0, ty = 0;
        
        // Horizontal: Center if viewport is large, Follow if small
        if (vpW >= mapW) {
            tx = (vpW - mapW) / 2;
        } else {
            // Camera centers on player
            tx = (vpW / 2) - playerCenterX;
            // Clamp to boundaries (0 to vpW - mapW)
            // Since we translate negative, max value is 0 (left edge), min value is vpW - mapW (right edge)
            tx = Math.min(0, Math.max(vpW - mapW, tx));
        }
        
        // Vertical
        if (vpH >= mapH) {
            ty = (vpH - mapH) / 2;
        } else {
            ty = (vpH / 2) - playerCenterY;
            ty = Math.min(0, Math.max(vpH - mapH, ty));
        }
        
        return { transform: `translate3d(${tx}px, ${ty}px, 0)` };
    };

    // Map Boundaries & Obstacles
    const obstacles = [
        // Walls
        { x: -10, y: -10, w: 10, h: GAME_HEIGHT + 20 }, // Left
        { x: RIGHT_LIMIT, y: -10, w: (GAME_WIDTH - RIGHT_LIMIT) + 10, h: GAME_HEIGHT + 20 }, // Right (Virtual Barrier)
        { x: -10, y: -10, w: GAME_WIDTH + 20, h: 130 }, // Top
        { x: -10, y: GAME_HEIGHT, w: GAME_WIDTH + 20, h: 10 }, // Bottom

        // Furniture
        { x: 150, y: 250, w: 140, h: 70 }, // Sofa Left
        { x: 450, y: 250, w: 140, h: 70 }, // Sofa Right
        { x: 310, y: 270, w: 120, h: 50 }, // Coffee Table
        { x: 600, y: 130, w: 80, h: 80 },  // Plant (Note: Plant is now in restricted area, serving as visual depth)
        { x: bookshelfPos.x, y: bookshelfPos.y, w: bookshelfPos.w, h: bookshelfPos.h }, // Bookshelf
    ];

    const dialogues = {
        'zh-CN': [
            "幽幽子：这里的夜景...真的很像星星掉在了地上呢。",
            "泽洛：嘿嘿，那是当然！这可是中心节区最好的观景位！",
            "幽幽子：谢谢你收留我...泽洛。",
            "泽洛：别客气！把这当自己家就好！要喝气泡水吗？",
            "幽幽子：那个...沙发真的很软...",
            "泽洛：累了就睡一会吧，不用一直看着窗外的。"
        ],
        'zh-TW': [
            "幽幽子：這裡的夜景...真的很像星星掉在了地上呢。",
            "澤洛：嘿嘿，那是當然！這可是中心節區最好的觀景位！",
            "幽幽子：謝謝妳收留我...澤洛。",
            "澤洛：別客氣！把這當自己家就好！要喝氣泡水嗎？",
            "幽幽子：那個...沙發真的很軟...",
            "澤洛：累了就睡一會吧，不用一直看著窗外的。"
        ],
        'en': [
            "Yuyuko: The night view here... it really looks like stars fallen to the ground.",
            "Zelo: Hehe, of course! This is the best view in the Central Sector!",
            "Yuyuko: Thank you for taking me in... Zelo.",
            "Zelo: Don't mention it! Make yourself at home! Want some sparkling water?",
            "Yuyuko: Um... the sofa is really soft...",
            "Zelo: If you're tired, just sleep. You don't have to stare at the window forever."
        ]
    };

    const furnitureTexts = {
        'zh-CN': "泽洛：这是我收藏的漫画和实体游戏盘！虽然现在都云端化了，但拿在手里的重量感可是无可替代的！",
        'zh-TW': "澤洛：這是我收藏的漫畫和實體遊戲盤！雖然現在都雲端化了，但拿在手裡的重量感可是無可替代的！",
        'en': "Zelo: My collection of manga and physical game discs! Cloud gaming is fine, but nothing beats the weight of a case in your hand!"
    };

    const doorTexts = {
        'zh-CN': "泽洛：不行！现在是宵禁时间，外面有巡逻机器人，出去会被抓的！",
        'zh-TW': "澤洛：不行！現在是宵禁時間，外面有巡邏機器人，出去會被抓的！",
        'en': "Zelo: No! It's curfew time. Patrol bots are outside, I'll get caught!"
    };

    // --- Game Logic ---

    const checkCollision = (newX: number, newY: number) => {
        const pRect = { x: newX, y: newY, w: PLAYER_SIZE, h: PLAYER_SIZE };
        
        // NPC Collision
        if (
            pRect.x < yuyukoPos.x + yuyukoPos.w &&
            pRect.x + pRect.w > yuyukoPos.x &&
            pRect.y < yuyukoPos.y + yuyukoPos.h &&
            pRect.y + pRect.h > yuyukoPos.y
        ) return true;

        // Obstacles
        for (const obs of obstacles) {
            if (
                pRect.x < obs.x + obs.w &&
                pRect.x + pRect.w > obs.x &&
                pRect.y < obs.y + obs.h &&
                pRect.y + pRect.h > obs.y
            ) return true;
        }
        return false;
    };

    const update = () => {
        let dx = 0;
        let dy = 0;
        let dir = playerRef.current.dir;

        if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) { dy = -SPEED; dir = 'up'; }
        if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) { dy = SPEED; dir = 'down'; }
        if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) { dx = -SPEED; dir = 'left'; }
        if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) { dx = SPEED; dir = 'right'; }

        // Normalize diagonal speed
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        if (dx !== 0 || dy !== 0) {
            let nextX = playerRef.current.x + dx;
            let nextY = playerRef.current.y + dy;

            // Simple collision resolution (x then y)
            if (checkCollision(nextX, playerRef.current.y)) nextX = playerRef.current.x;
            if (checkCollision(nextX, nextY)) nextY = playerRef.current.y;

            // Only update if actually moved
            if (nextX !== playerRef.current.x || nextY !== playerRef.current.y) {
                 playerRef.current = { x: nextX, y: nextY, dir, moving: true };
                 setPlayer({ ...playerRef.current });
                 setDialogue(null); // Clear dialogue on move
            } else {
                 playerRef.current = { ...playerRef.current, dir, moving: true }; // Update dir even if stuck
                 setPlayer({ ...playerRef.current });
            }
        } else {
            if (playerRef.current.moving) {
                playerRef.current = { ...playerRef.current, moving: false };
                setPlayer({ ...playerRef.current });
            }
        }

        // Interaction Check
        const playerCenter = {
            x: playerRef.current.x + PLAYER_SIZE / 2,
            y: playerRef.current.y + PLAYER_SIZE / 2
        };

        const distYuyuko = Math.sqrt(
            Math.pow(playerCenter.x - (yuyukoPos.x + yuyukoPos.w/2), 2) + 
            Math.pow(playerCenter.y - (yuyukoPos.y + yuyukoPos.h/2), 2)
        );

        const distShelf = Math.sqrt(
            Math.pow(playerCenter.x - (bookshelfPos.x + bookshelfPos.w/2), 2) + 
            Math.pow(playerCenter.y - (bookshelfPos.y + bookshelfPos.h/2), 2)
        );

        const distDoor = Math.sqrt(
            Math.pow(playerCenter.x - (doorPos.x + doorPos.w/2), 2) + 
            Math.pow(playerCenter.y - (doorPos.y + doorPos.h/2), 2)
        );

        let newTarget: 'npc' | 'bookshelf' | 'door' | null = null;
        if (distYuyuko < 70) newTarget = 'npc';
        else if (distShelf < 80) newTarget = 'bookshelf';
        else if (distDoor < 80) newTarget = 'door';

        if (activeTarget !== newTarget) {
            setActiveTarget(newTarget);
        }

        requestRef.current = requestAnimationFrame(update);
    };

    // Input Listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keysPressed.current[e.key] = true;
            if (e.key === ' ' || e.key === 'Enter' || e.key === 'e') {
                handleInteract();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        requestRef.current = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [activeTarget, dialogueIndex]);

    const handleInteract = () => {
        if (activeTarget === 'npc') {
            const lines = dialogues[language] || dialogues['en'];
            setDialogue(lines[dialogueIndex]);
            setDialogueIndex(prev => (prev + 1) % lines.length);
        } else if (activeTarget === 'bookshelf') {
            setDialogue(furnitureTexts[language] || furnitureTexts['en']);
        } else if (activeTarget === 'door') {
            setDialogue(doorTexts[language] || doorTexts['en']);
        }
    };

    // Robust Mobile Controls Handlers (Pointer Events)
    const handleBtnPress = (e: React.SyntheticEvent, key: string) => {
        e.preventDefault(); // Stop scrolling/selection
        e.stopPropagation();
        keysPressed.current[key] = true;
    };

    const handleBtnRelease = (e: React.SyntheticEvent, key: string) => {
        e.preventDefault();
        e.stopPropagation();
        keysPressed.current[key] = false;
    };

    const headerTitle = {
        'zh-CN': "泽洛的客厅",
        'zh-TW': "澤洛的客廳",
        'en': "ZELO'S LIVING ROOM"
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center backdrop-blur-md animate-fade-in select-none p-4">
            <div className="w-full max-w-4xl bg-[#0a0a12] border-4 border-cyan-900 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.2)] flex flex-col relative">
                
                {/* Header */}
                <div className="bg-cyan-950/80 p-2 flex justify-between items-center border-b border-cyan-800 shrink-0 z-20 relative">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
                        <Gamepad2 size={18} />
                        <span>{headerTitle[language]}</span>
                    </div>
                    <button onClick={onClose} className="text-cyan-600 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Game Area Container (Viewport) */}
                {/* Fixed height for mobile to allow scrolling/camera movement inside */}
                <div 
                    ref={containerRef}
                    className="relative w-full h-[350px] md:h-[500px] bg-[#334155] overflow-hidden group flex items-start justify-start touch-none"
                >
                    {/* SCROLLABLE MAP LAYER - Transformed by Camera */}
                    <div 
                        className="relative shadow-2xl transition-transform duration-75 ease-linear will-change-transform shrink-0"
                        style={{ 
                            width: GAME_WIDTH, 
                            height: GAME_HEIGHT, 
                            ...getCameraStyle()
                        }}
                    >
                        {/* --- BACKGROUND LAYER --- */}
                        <div className="absolute inset-0 bg-[#475569]"></div>
                        <div className="absolute top-[35%] left-[10%] right-[10%] bottom-[10%] bg-[#64748b] rounded-xl shadow-inner border border-white/10"></div>

                        {/* Huge Window (Top) */}
                        <div className="absolute top-0 left-0 right-0 h-[32%] bg-black overflow-hidden border-b-4 border-cyan-900/50">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-2/3 flex items-end gap-1 opacity-60">
                                {buildingHeights.map((h, i) => (
                                    <div key={i} className="bg-cyan-900/60 w-full" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                            <div className="absolute top-4 left-10 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_purple]"></div>
                            <div className="absolute top-8 right-20 w-1 h-1 bg-cyan-400 rounded-full"></div>
                            <div className="absolute top-12 left-1/3 w-1 h-1 bg-white rounded-full opacity-50"></div>
                            <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-cyan-900/30"></div>
                            <div className="absolute top-0 bottom-0 left-2/4 w-1 bg-cyan-900/30"></div>
                            <div className="absolute top-0 bottom-0 left-3/4 w-1 bg-cyan-900/30"></div>
                        </div>

                        {/* --- OBJECTS LAYER --- */}

                        {/* Furniture: Bookshelf */}
                        <div 
                            className="absolute border-4 border-[#334155] bg-[#1e293b] shadow-xl flex flex-col justify-between p-1"
                            style={{ left: bookshelfPos.x, top: bookshelfPos.y, width: bookshelfPos.w, height: bookshelfPos.h }}
                        >
                            {[0, 1, 2].map(i => (
                                <div key={i} className="w-full h-[28%] bg-black/20 relative border-b border-white/5 flex items-end px-1 gap-[2px]">
                                    <div className="w-2 h-4/5 bg-red-800 rounded-sm"></div>
                                    <div className="w-1 h-3/5 bg-blue-700 rounded-sm"></div>
                                    <div className="w-3 h-5/5 bg-yellow-700 rounded-sm"></div>
                                    <div className="w-1 h-2/5 bg-green-800 rounded-sm"></div>
                                    {i === 1 && <div className="w-2 h-3/5 bg-purple-800 rounded-sm ml-auto"></div>}
                                </div>
                            ))}
                            {activeTarget === 'bookshelf' && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-1 rounded animate-bounce font-bold z-50 shadow-lg border border-cyan-500">
                                    !
                                </div>
                            )}
                        </div>

                        {/* Furniture: Exit Door */}
                        <div 
                            className="absolute bg-[#1e293b] border-2 border-black flex flex-col items-center justify-center shadow-lg"
                            style={{ left: doorPos.x, top: doorPos.y, width: doorPos.w, height: doorPos.h }}
                        >
                            <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full absolute right-1 top-1/2"></div>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-green-900/80 border border-green-500 flex items-center justify-center">
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            {activeTarget === 'door' && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-1 rounded animate-bounce font-bold z-50">
                                    !
                                </div>
                            )}
                        </div>

                        {/* Yuyuko (NPC) */}
                        <div 
                            className="absolute w-10 h-10 transition-transform duration-500"
                            style={{ left: yuyukoPos.x, top: yuyukoPos.y }}
                        >
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-[2px]"></div>
                            <div className="absolute -top-2 left-0 w-full h-full animate-float-slow">
                                <StarSprite color="#a855f7" />
                            </div>
                            {activeTarget === 'npc' && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-1 rounded animate-bounce font-bold">
                                    !
                                </div>
                            )}
                        </div>

                        {/* Furniture: Sofas */}
                        <div className="absolute shadow-lg" style={{ left: 150, top: 250, width: 140, height: 70 }}>
                            <div className="absolute top-0 left-0 w-full h-4 bg-[#334155] rounded-t-lg border-t border-white/10"></div>
                            <div className="absolute top-4 left-0 w-4 h-[54px] bg-[#334155] rounded-l-lg border-l border-white/10"></div>
                            <div className="absolute top-4 right-0 w-4 h-[54px] bg-[#334155] rounded-r-lg border-r border-white/10"></div>
                            <div className="absolute top-4 left-4 right-4 bottom-0 bg-[#475569] flex">
                                <div className="flex-1 border-r border-black/20 m-1 rounded bg-[#1e293b]"></div>
                                <div className="flex-1 m-1 rounded bg-[#1e293b]"></div>
                            </div>
                        </div>
                        <div className="absolute shadow-lg" style={{ left: 450, top: 250, width: 140, height: 70 }}>
                            <div className="absolute top-0 left-0 w-full h-4 bg-[#334155] rounded-t-lg border-t border-white/10"></div>
                            <div className="absolute top-4 left-0 w-4 h-[54px] bg-[#334155] rounded-l-lg border-l border-white/10"></div>
                            <div className="absolute top-4 right-0 w-4 h-[54px] bg-[#334155] rounded-r-lg border-r border-white/10"></div>
                            <div className="absolute top-4 left-4 right-4 bottom-0 bg-[#475569] flex">
                                <div className="flex-1 border-r border-black/20 m-1 rounded bg-[#1e293b]"></div>
                                <div className="flex-1 m-1 rounded bg-[#1e293b]"></div>
                            </div>
                        </div>

                        {/* Furniture: Coffee Table */}
                        <div 
                            className="absolute rounded-lg shadow-xl flex items-center justify-center overflow-hidden"
                            style={{ left: 310, top: 270, width: 120, height: 50, backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
                        >
                            <div className="absolute inset-0 border-2 border-cyan-500/30 bg-cyan-500/5 rounded-lg"></div>
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none"></div>
                            <div className="w-8 h-8 rounded-full bg-black/50 border border-cyan-500/50 flex items-center justify-center relative">
                                <div className="w-4 h-4 bg-cyan-400/50 rounded-full blur-sm animate-pulse"></div>
                                <div className="absolute bottom-full w-full h-12 bg-gradient-to-t from-cyan-500/20 to-transparent [clip-path:polygon(20%_100%,80%_100%,100%_0,0_0)]"></div>
                            </div>
                            <div className="absolute right-4 top-2 w-3 h-3 bg-white rounded-full shadow-sm">
                                <div className="absolute -right-1 top-1 w-1.5 h-1.5 border border-white rounded-full"></div>
                                <div className="absolute -top-2 left-1 w-2 h-4 bg-white/20 blur-[1px] animate-pulse"></div>
                            </div>
                        </div>

                        {/* Visual Boundary (Extension of the room) */}
                        <div 
                            className="absolute top-0 bottom-0 bg-black/60 backdrop-blur-[1px] z-10 flex flex-col justify-center items-center border-l border-cyan-500/30 overflow-hidden"
                            style={{ left: RIGHT_LIMIT, width: GAME_WIDTH - RIGHT_LIMIT }}
                        >
                             <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,211,238,0.05)_25%,rgba(34,211,238,0.05)_50%,transparent_50%,transparent_75%,rgba(34,211,238,0.05)_75%,rgba(34,211,238,0.05)_100%)] bg-[size:20px_20px] animate-slide-in"></div>
                             
                             <div className="flex flex-col items-center gap-4 opacity-50 relative z-10">
                                 <Lock size={24} className="text-cyan-500/50" />
                                 <div className="text-[10px] text-cyan-500/50 font-mono -rotate-90 whitespace-nowrap tracking-[0.3em] font-bold">
                                     PRIVATE_SECTOR
                                 </div>
                             </div>

                             {/* Silhouettes implying depth */}
                             <div className="absolute bottom-32 right-[-20px] w-20 h-40 bg-black/80 rounded-lg border border-white/5 transform rotate-y-12"></div>
                             <div className="absolute bottom-20 left-4 w-12 h-12 bg-cyan-900/20 rounded-full blur-xl animate-pulse"></div>
                        </div>

                        {/* Plant (Now visually in the restricted/boundary area for depth) */}
                        <div className="absolute z-0 opacity-50" style={{ left: 600, top: 130 }}>
                            <div className="w-12 h-12 bg-[#14532d] rounded-full border border-green-900/30 relative shadow-lg">
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-16 bg-green-700"></div>
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-10 h-10 bg-green-500/50 rounded-full blur-sm"></div>
                            </div>
                        </div>

                        {/* Player (Zelo) */}
                        <div 
                            className="absolute w-10 h-10 will-change-transform transition-all duration-75 ease-linear"
                            style={{ 
                                left: player.x, 
                                top: player.y,
                                zIndex: Math.floor(player.y)
                            }}
                        >
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-[2px]"></div>
                            <div className={`absolute -top-2 left-0 w-full h-full transform transition-transform ${
                                player.moving ? 'scale-105' : 'scale-100'
                            }`}>
                                <StarSprite color="#22d3ee" />
                            </div>
                            <div className={`absolute top-1/2 left-1/2 w-0 h-0 border-4 border-transparent border-t-white/80 transition-transform ${
                                player.dir === 'left' ? 'rotate-90' :
                                player.dir === 'right' ? '-rotate-90' :
                                player.dir === 'up' ? 'rotate-180' : ''
                            } -translate-x-1/2 -translate-y-1/2`}></div>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-cyan-200 font-bold bg-black/50 px-1 rounded backdrop-blur-sm">
                                ZELO
                            </div>
                        </div>
                    </div>

                    {/* UI LAYER - Fixed relative to Viewport (Not Map) */}
                    {dialogue && (
                        <div className="absolute bottom-6 left-6 right-6 bg-black/95 border-2 border-cyan-500 p-4 rounded-lg shadow-2xl animate-slide-in z-50 pointer-events-auto">
                            <div className="text-cyan-100 text-sm font-mono leading-relaxed mb-2">
                                {dialogue}
                            </div>
                            <div className="text-[10px] text-gray-500 text-right uppercase tracking-widest">
                                Press [Interact]
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Controls - Use Pointer Events for Better Touch Response */}
                <div className="p-4 grid grid-cols-3 gap-4 bg-[#0a0a12] md:hidden shrink-0 z-20 relative border-t border-cyan-900/50 touch-none select-none">
                    <div className="col-start-2 flex flex-col items-center gap-2">
                        <button 
                            className="w-12 h-12 bg-cyan-900/30 border border-cyan-500/30 rounded active:bg-cyan-500/50 flex items-center justify-center text-cyan-400 touch-none select-none"
                            onPointerDown={(e) => handleBtnPress(e, 'ArrowUp')}
                            onPointerUp={(e) => handleBtnRelease(e, 'ArrowUp')}
                            onPointerLeave={(e) => handleBtnRelease(e, 'ArrowUp')}
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <ArrowUp />
                        </button>
                        <div className="flex gap-2">
                            <button 
                                className="w-12 h-12 bg-cyan-900/30 border border-cyan-500/30 rounded active:bg-cyan-500/50 flex items-center justify-center text-cyan-400 touch-none select-none"
                                onPointerDown={(e) => handleBtnPress(e, 'ArrowLeft')}
                                onPointerUp={(e) => handleBtnRelease(e, 'ArrowLeft')}
                                onPointerLeave={(e) => handleBtnRelease(e, 'ArrowLeft')}
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                <ArrowLeft />
                            </button>
                            <button 
                                className="w-12 h-12 bg-cyan-900/30 border border-cyan-500/30 rounded active:bg-cyan-500/50 flex items-center justify-center text-cyan-400 touch-none select-none"
                                onPointerDown={(e) => handleBtnPress(e, 'ArrowDown')}
                                onPointerUp={(e) => handleBtnRelease(e, 'ArrowDown')}
                                onPointerLeave={(e) => handleBtnRelease(e, 'ArrowDown')}
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                <ArrowDown />
                            </button>
                            <button 
                                className="w-12 h-12 bg-cyan-900/30 border border-cyan-500/30 rounded active:bg-cyan-500/50 flex items-center justify-center text-cyan-400 touch-none select-none"
                                onPointerDown={(e) => handleBtnPress(e, 'ArrowRight')}
                                onPointerUp={(e) => handleBtnRelease(e, 'ArrowRight')}
                                onPointerLeave={(e) => handleBtnRelease(e, 'ArrowRight')}
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                <ArrowRight />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <button 
                            className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center transition-all touch-none select-none ${activeTarget ? 'bg-cyan-500 border-white text-black' : 'bg-gray-800 border-gray-600 text-gray-500'}`}
                            onClick={handleInteract}
                        >
                            {activeTarget === 'door' ? <DoorClosed /> : <MessageCircle />}
                            <span className="text-[8px] font-black">{activeTarget === 'door' ? 'EXIT' : 'TALK'}</span>
                        </button>
                    </div>
                </div>

                <div className="hidden md:flex p-2 bg-[#0a0a12] text-[10px] text-cyan-700 font-mono justify-center gap-8 shrink-0 z-20 relative">
                     <span>[WASD] MOVE</span>
                     <span>[E/SPACE] INTERACT</span>
                </div>
            </div>
        </div>
    );
};