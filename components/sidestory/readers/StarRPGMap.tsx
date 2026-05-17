
import React, { useEffect, useState, useRef } from 'react';
import { AlertTriangle, Zap } from 'lucide-react';

// Reusable 4-Point Star Shape with Glow
const StarCharacter = ({ 
    color, 
    name, 
    isGlitch = false,
    className = "" 
}: { 
    color: string, 
    name: string, 
    isGlitch?: boolean,
    className?: string
}) => (
    <div className={`relative flex flex-col items-center ${className}`}>
        {/* Glow Aura */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-xl opacity-40 ${color === 'cyan' ? 'bg-cyan-400' : 'bg-purple-500'} animate-pulse`}></div>
        
        {/* Star Body */}
        <svg viewBox="0 0 100 100" className={`w-16 h-16 relative z-10 drop-shadow-[0_0_10px_currentColor] ${color === 'cyan' ? 'text-cyan-200' : 'text-purple-200'} ${isGlitch ? 'animate-shake-violent' : 'animate-float-slow'}`}>
            <path d="M50 0 C55 35 65 45 100 50 C65 55 55 65 50 100 C45 65 35 55 0 50 C35 45 45 35 50 0 Z" fill="currentColor" />
        </svg>

        {/* Name Tag */}
        <div className={`mt-2 px-2 py-0.5 text-[10px] font-bold font-mono rounded border backdrop-blur-sm tracking-widest uppercase relative z-10
            ${color === 'cyan' 
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                : 'bg-purple-950/60 border-purple-500/50 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]'}
        `}>
            {name}
        </div>
    </div>
);

interface StarRPGMapProps {
    onComplete: () => void;
    language: 'zh-CN' | 'zh-TW' | 'en';
}

export const StarRPGMap: React.FC<StarRPGMapProps> = ({ onComplete, language }) => {
    // Steps: 
    // 0: Idle (Zelo walking)
    // 1: Alarm (Red flash)
    // 2: Rift Open (Portal appears)
    // 3: Beam Down (Energy strike)
    // 4: Materialize (Yuyuko appears + Shockwave)
    // 5: Reaction (Zelo jumps back)
    // 6: End
    const [step, setStep] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timings = [
            { s: 1, t: 1500 }, // Idle -> Alarm
            { s: 2, t: 3000 }, // Alarm -> Rift
            { s: 3, t: 4500 }, // Rift -> Beam
            { s: 4, t: 4800 }, // Beam -> Impact
            { s: 5, t: 6000 }, // Impact -> Reaction
            { s: 6, t: 8500 }, // Hold -> Complete
        ];

        let timeouts: number[] = [];

        timings.forEach(({ s, t }) => {
            const id = window.setTimeout(() => {
                if (s === 6) {
                    onComplete();
                } else {
                    setStep(s);
                }
            }, t);
            timeouts.push(id);
        });

        return () => timeouts.forEach(clearTimeout);
    }, [onComplete]);

    const names = {
        zelo: language === 'en' ? 'Zelo' : '泽洛',
        yuyuko: language === 'en' ? 'Yuyuko' : '幽幽子',
        alert: language === 'en' ? 'WARNING // ANOMALY' : '警告 // 空间震荡'
    };

    return (
        <div ref={containerRef} className="absolute inset-0 z-50 bg-[#05020a] overflow-hidden flex items-center justify-center font-mono select-none perspective-[1000px]">
            
            {/* === SCENE: 3D GRID FLOOR === */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${step >= 1 ? 'opacity-40' : 'opacity-20'}`}>
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,#0f0518_100%)] z-10 pointer-events-none"></div>
                <div className="absolute top-1/2 left-[-50%] w-[200%] h-[200%] bg-[linear-gradient(rgba(168,85,247,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.3)_1px,transparent_1px)] bg-[size:60px_60px] origin-top [transform:rotateX(70deg)_translateY(-100px)] animate-[dataRain_20s_linear_infinite]"></div>
            </div>

            {/* === FX: RED ALERT OVERLAY === */}
            <div className={`absolute inset-0 bg-red-500/10 z-0 transition-opacity duration-200 ${step === 1 ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
            
            {/* === FX: PARTICLES === */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float-up-fast" 
                        style={{ 
                            left: `${Math.random() * 100}%`, 
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: Math.random() * 0.5 
                        }} 
                    />
                ))}
            </div>

            {/* === ACTORS LAYER === */}
            <div className="relative z-10 w-full max-w-4xl h-[400px] flex items-center justify-center">

                {/* 1. RIFT PORTAL (Step 2+) */}
                <div 
                    className={`
                        absolute top-10 left-1/2 -translate-x-1/2 transition-all duration-700 ease-out
                        ${step >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                    `}
                >
                    <div className="w-32 h-8 bg-black rounded-[100%] border-2 border-purple-500 shadow-[0_0_30px_#a855f7] animate-[spin_3s_linear_infinite_reverse] relative">
                        <div className="absolute inset-0 bg-purple-900/50 blur-md rounded-[100%]"></div>
                    </div>
                    {/* Distortion Lines */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-2 bg-purple-400 blur-xl opacity-50 animate-pulse"></div>
                </div>

                {/* 2. TELEPORT BEAM (Step 3 Only) */}
                <div 
                    className={`
                        absolute top-14 bottom-20 left-1/2 -translate-x-1/2 w-16
                        bg-gradient-to-b from-white via-purple-400 to-transparent
                        origin-top transition-all duration-100
                        ${step === 3 ? 'opacity-80 scale-y-100' : 'opacity-0 scale-y-0'}
                    `}
                    style={{ filter: 'blur(4px)' }}
                ></div>

                {/* 3. IMPACT SHOCKWAVE (Step 4 Only) */}
                {step === 4 && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-20 h-4 border-2 border-white rounded-[100%] animate-[ping_0.6s_ease-out_forwards]"></div>
                )}

                {/* 4. ZELO (Blue Star) */}
                <div 
                    className={`
                        absolute transition-all duration-500 ease-in-out
                        ${step < 5 ? 'left-1/2 -translate-x-[60px]' : 'left-[20%]'} 
                        bottom-24
                    `}
                >
                    {step === 5 && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-cyan-300 text-4xl font-black animate-bounce drop-shadow-[0_0_10px_cyan]">
                            !?
                        </div>
                    )}
                    <StarCharacter 
                        color="cyan" 
                        name={names.zelo} 
                        className={step === 5 ? 'animate-shake-violent' : ''}
                    />
                </div>

                {/* 5. YUYUKO (Purple Star) - Appears at Step 4 */}
                <div 
                    className={`
                        absolute left-1/2 -translate-x-1/2 bottom-24 transition-all duration-500
                        ${step >= 4 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 -translate-y-10'}
                    `}
                >
                    <StarCharacter 
                        color="purple" 
                        name={names.yuyuko} 
                        isGlitch={step === 4} // Shake on impact
                    />
                </div>

                {/* SYSTEM ALERT UI */}
                <div 
                    className={`
                        absolute top-0 left-1/2 -translate-x-1/2 
                        flex items-center gap-2 px-6 py-2 
                        bg-red-900/80 border-2 border-red-500 text-red-100 rounded-full
                        shadow-[0_0_20px_rgba(220,38,38,0.6)]
                        transition-all duration-300
                        ${step >= 1 && step < 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}
                    `}
                >
                    <AlertTriangle size={18} className="animate-pulse" />
                    <span className="font-bold tracking-widest text-sm">{names.alert}</span>
                </div>

            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000_90%)]"></div>
        </div>
    );
};
