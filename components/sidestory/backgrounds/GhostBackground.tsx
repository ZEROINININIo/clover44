import React, { useEffect, useRef } from 'react';
import { GraphicsQuality } from '../../../types';

export const GhostBackground = ({ quality = 'high' }: { quality?: GraphicsQuality }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Glitch / Noise Effect
    useEffect(() => {
        if (quality === 'low') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        let animationFrame: number;
        let frameCount = 0;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);

        const draw = () => {
            frameCount++;
            
            // Clear with trail effect
            ctx.fillStyle = 'rgba(10, 5, 10, 0.1)';
            ctx.fillRect(0, 0, w, h);

            // Random Glitch Lines
            if (frameCount % 10 === 0) {
                const y = Math.random() * h;
                const height = Math.random() * 20 + 1;
                ctx.fillStyle = `rgba(255, 0, 50, ${Math.random() * 0.2})`;
                ctx.fillRect(0, y, w, height);
            }

            // Digital Noise Blocks
            if (frameCount % 5 === 0) {
                for (let i = 0; i < 5; i++) {
                    const x = Math.random() * w;
                    const y = Math.random() * h;
                    const size = Math.random() * 50 + 10;
                    ctx.fillStyle = `rgba(200, 0, 50, ${Math.random() * 0.1})`;
                    ctx.fillRect(x, y, size, size / 4);
                }
            }

            // Scanline
            const scanY = (frameCount * 2) % h;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.fillRect(0, scanY, w, 2);

            animationFrame = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, [quality]);

    const bgGradient = 'bg-gradient-to-br from-[#0f0505] via-[#1a0505] to-[#0a0000]';

    return (
        <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${bgGradient}`}>
            {/* Static Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Central Glitch Circle */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vmin] h-[50vmin] rounded-full border-2 border-red-900/30 opacity-50`}>
                <div className={`absolute inset-0 rounded-full border border-dashed border-red-800/50 animate-[spin_10s_linear_infinite]`}></div>
                <div className={`absolute inset-4 rounded-full border border-dotted border-red-700/50 animate-[spin_15s_linear_infinite_reverse]`}></div>
            </div>

            {/* Canvas for dynamic effects */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Floating Text Fragments */}
            <div className={`absolute top-1/4 left-1/4 text-xs font-mono text-red-500/10 rotate-12`}>
                ERROR::BOUNDARY_BREACH
            </div>
            <div className={`absolute bottom-1/3 right-1/4 text-xs font-mono text-red-500/10 -rotate-6`}>
                SIGNAL_LOST...
            </div>
             <div className={`absolute top-2/3 left-1/3 text-4xl font-black font-mono text-red-500/5 tracking-widest select-none`}>
                GHOST
            </div>
        </div>
    );
};
