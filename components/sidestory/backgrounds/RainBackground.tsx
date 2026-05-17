
import React, { useEffect, useRef } from 'react';
import { GraphicsQuality } from '../../../types';

export const RainBackground = ({ quality = 'high' }: { quality?: GraphicsQuality }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (quality === 'low') return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        let animationFrame: number;

        // Rain Drops
        const drops: {x: number, y: number, speed: number, len: number, opacity: number}[] = [];
        const dropCount = quality === 'medium' ? 60 : 150;

        for (let i = 0; i < dropCount; i++) {
            drops.push({
                x: Math.random() * w,
                y: Math.random() * h,
                speed: Math.random() * 5 + 5, // Fast falling
                len: Math.random() * 20 + 10,
                opacity: Math.random() * 0.3 + 0.1
            });
        }

        // "Fragment" Particles (Slow floating squares)
        const fragments: {x: number, y: number, size: number, speed: number, rotation: number}[] = [];
        const fragCount = quality === 'medium' ? 10 : 25;
        
        for (let i = 0; i < fragCount; i++) {
            fragments.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 4 + 1,
                speed: (Math.random() - 0.5) * 0.5, // Drift slowly up or down
                rotation: Math.random() * Math.PI * 2
            });
        }

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            
            const rainColor = '34, 211, 238'; // Cyan-400
            
            // Draw Rain
            ctx.lineWidth = 1;
            drops.forEach(d => {
                d.y += d.speed;
                if (d.y > h) {
                    d.y = -d.len;
                    d.x = Math.random() * w;
                }

                ctx.strokeStyle = `rgba(${rainColor}, ${d.opacity})`;
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x, d.y + d.len);
                ctx.stroke();
            });

            // Draw Fragments
            const fragFill = 'rgba(34, 211, 238, 0.1)';
            const fragStroke = 'rgba(34, 211, 238, 0.3)';
            
            fragments.forEach(f => {
                f.y += f.speed;
                f.rotation += 0.01;
                
                if (f.y > h + 10) f.y = -10;
                if (f.y < -10) f.y = h + 10;

                ctx.save();
                ctx.translate(f.x, f.y);
                ctx.rotate(f.rotation);
                ctx.fillStyle = fragFill;
                ctx.strokeStyle = fragStroke;
                ctx.fillRect(-f.size/2, -f.size/2, f.size, f.size);
                ctx.strokeRect(-f.size/2, -f.size/2, f.size, f.size);
                ctx.restore();
            });

            animationFrame = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, [quality]);

    // Background Gradients
    const bgGradient = 'bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#082f49]';

    if (quality === 'low') {
        return <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${bgGradient}`} />;
    }

    return (
        <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${bgGradient}`}>
            {/* Ambient Glow at bottom */}
            <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-50`}></div>
            
            {/* Canvas Layer */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.3)_100%)]"></div>
        </div>
    );
};
