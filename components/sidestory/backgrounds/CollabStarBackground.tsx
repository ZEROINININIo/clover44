
import React, { useEffect, useRef } from 'react';
import { GraphicsQuality } from '../../../types';

export const CollabStarBackground = ({ quality = 'high' }: { quality?: GraphicsQuality }) => {
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

        // Particle system for star dust
        const particles: {x: number, y: number, r: number, alpha: number, speed: number, offset: number}[] = [];
        const starCount = quality === 'medium' ? 50 : 100;

        for (let i = 0; i < starCount; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.5,
                alpha: Math.random(),
                speed: Math.random() * 0.2 + 0.05,
                offset: Math.random() * 100
            });
        }

        // Shooting star system
        let shootingStar = {
            active: false,
            x: 0,
            y: 0,
            len: 0,
            speed: 0,
            angle: 0
        };

        const resetShootingStar = () => {
            shootingStar.active = true;
            shootingStar.x = Math.random() * w;
            shootingStar.y = Math.random() * (h / 2);
            shootingStar.len = Math.random() * 80 + 10;
            shootingStar.speed = Math.random() * 10 + 5;
            shootingStar.angle = Math.PI / 4; // 45 degrees
        };

        // Trigger shooting star randomly
        const triggerInterval = setInterval(() => {
            if (!shootingStar.active && Math.random() > 0.7) {
                resetShootingStar();
            }
        }, 2000);

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            
            // Draw Dust Particles
            particles.forEach((p, i) => {
                p.y -= p.speed;
                // Wrap around
                if (p.y < 0) {
                    p.y = h;
                    p.x = Math.random() * w;
                }

                // Twinkle effect
                const twinkle = Math.abs(Math.sin((Date.now() / 1000) + p.offset));
                const currentAlpha = p.alpha * twinkle * 0.8;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                
                // Color variation: White vs Cyan vs Purple
                if (i % 5 === 0) ctx.fillStyle = `rgba(167, 139, 250, ${currentAlpha})`; // Purple
                else if (i % 7 === 0) ctx.fillStyle = `rgba(34, 211, 238, ${currentAlpha})`; // Cyan
                else ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
                
                ctx.fill();
            });

            // Draw Shooting Star
            if (shootingStar.active) {
                const tailX = shootingStar.x - shootingStar.len * Math.cos(shootingStar.angle);
                const tailY = shootingStar.y - shootingStar.len * Math.sin(shootingStar.angle);

                const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
                grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
                grad.addColorStop(1, 'rgba(168, 85, 247, 0)'); // Purple trail

                ctx.beginPath();
                ctx.moveTo(shootingStar.x, shootingStar.y);
                ctx.lineTo(tailX, tailY);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Move
                shootingStar.x += shootingStar.speed * Math.cos(shootingStar.angle);
                shootingStar.y += shootingStar.speed * Math.sin(shootingStar.angle);

                // Reset if out of bounds
                if (shootingStar.x > w || shootingStar.y > h) {
                    shootingStar.active = false;
                }
            }

            animationFrame = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
            clearInterval(triggerInterval);
        };
    }, [quality]);

    if (quality === 'low') {
        return (
            <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#090014] via-[#1a0b2e] to-[#050505]`} />
        );
    }

    return (
        <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#090014] via-[#1a0b2e] to-[#050505]`}>
            {/* Ambient Aurora Glow */}
            <>
                <div className="absolute -bottom-1/2 -left-1/4 w-[150%] h-[80%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute -top-1/2 -right-1/4 w-[150%] h-[80%] bg-cyan-600/5 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </>

            {/* Central Star Structure */}
            {quality === 'high' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
                    <div className="absolute inset-0 border border-purple-500/20 rounded-full animate-[spin_120s_linear_infinite]"></div>
                    <div className="absolute inset-20 border border-dashed border-cyan-500/20 rounded-full animate-[spin_80s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-[30%] border border-dotted border-white/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
                </div>
            )}

            {/* Canvas Layer */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
        </div>
    );
};
