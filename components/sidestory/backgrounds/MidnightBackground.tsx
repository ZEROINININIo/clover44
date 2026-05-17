
import React, { useEffect, useRef } from 'react';
import { GraphicsQuality } from '../../../types';

export const MidnightBackground = ({ quality = 'high' }: { quality?: GraphicsQuality }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Particle System
    useEffect(() => {
        if (quality === 'low') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        let animationFrame: number;

        const particles: {x: number, y: number, r: number, vy: number, alpha: number}[] = [];
        // Create fewer, slower particles for a suspended time feel
        const count = quality === 'medium' ? 30 : 60;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.5 + 0.5,
                vy: -(Math.random() * 0.2 + 0.05), // Very slow upward float
                alpha: Math.random() * 0.5 + 0.1
            });
        }

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            
            // Draw Particles
            ctx.fillStyle = '#fff';
            particles.forEach(p => {
                p.y += p.vy;
                if (p.y < -10) {
                    p.y = h + 10;
                    p.x = Math.random() * w;
                }
                
                ctx.globalAlpha = p.alpha * 0.5; // Faint
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            animationFrame = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, [quality]);

    const baseColor = 'text-white';
    const borderColor = 'border-white';
    const bgGradient = 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black';

    if (quality === 'low') {
        return <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${bgGradient}`} />;
    }

    return (
        <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${bgGradient}`}>
            {/* Grain Noise Overlay */}
            {quality === 'high' && (
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            )}

            {/* Central Singularity Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-10 bg-white`}></div>

            {/* Orbital Rings - The "Clock" of Zero Point */}
            {quality === 'high' && (
                <>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${baseColor} opacity-20`}>
                        {/* Ring 1: Slow Rotation */}
                        <svg className="w-[800px] h-[800px] animate-[spin_120s_linear_infinite]" viewBox="0 0 800 800">
                            <circle cx="400" cy="400" r="398" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
                        </svg>
                    </div>
                    
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${baseColor} opacity-10`}>
                        {/* Ring 2: Counter Rotation */}
                        <svg className="w-[600px] h-[600px] animate-[spin_80s_linear_infinite_reverse]" viewBox="0 0 600 600">
                            <circle cx="300" cy="300" r="298" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="1 10" />
                            <circle cx="300" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </svg>
                    </div>
                </>
            )}

            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${baseColor} opacity-30`}>
                {/* Ring 3: Static Center Focus */}
                <div className={`w-[300px] h-[300px] rounded-full border border-dashed ${borderColor} flex items-center justify-center`}>
                    <div className={`w-[280px] h-[280px] rounded-full border border-dotted ${borderColor} ${quality === 'high' ? 'animate-spin-slow' : ''}`}></div>
                </div>
            </div>

            {/* Floating Particles Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Giant "00:00" Watermark */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black font-mono leading-none tracking-tighter opacity-[0.03] select-none ${baseColor}`}>
                00:00
            </div>
            
            {/* Vertical Axis Line */}
            <div className={`absolute top-0 bottom-0 left-1/2 w-px bg-white opacity-10`}></div>
        </div>
    );
};
