
import { Moon, Cpu, CloudRain, Coffee, Terminal, Star } from 'lucide-react';

export type VNTheme = 'variable' | 'rain' | 'daily' | 'bw' | 'collab-star' | 'default';

export const detectChapterTheme = (chapterId: string): VNTheme => {
    if (chapterId.startsWith('PB') || chapterId.includes('PB-')) return 'bw';
    if (chapterId.startsWith('story-variable-') || chapterId.includes('byaki') || chapterId.includes('void')) return 'variable';
    if (chapterId.startsWith('story-frag-rain-')) return 'rain';
    if (chapterId.startsWith('story-coffee') || chapterId.startsWith('story-hotpot') || chapterId.includes('daily')) return 'daily';
    if (chapterId.startsWith('story-collab-star')) return 'collab-star';
    return 'default';
};

export const getThemeStyles = (theme: VNTheme) => {
    switch (theme) {
        case 'bw':
            return {
                bg: 'bg-black text-white',
                // Stark white grid
                grid: 'bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,transparent_77%,transparent)]',
                // Box is black with white border, very sharp
                textBox: 'bg-black border-white shadow-[0_0_0_2px_#fff]',
                accentText: 'text-white',
                border: 'border-white',
                icon: Moon
            };
        case 'variable':
            return {
                bg: 'bg-green-950 text-emerald-100',
                grid: 'bg-[linear-gradient(0deg,transparent_24%,rgba(16,185,129,.1)_25%,rgba(16,185,129,.1)_26%,transparent_27%,transparent_74%,rgba(16,185,129,.1)_75%,rgba(16,185,129,.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(16,185,129,.1)_25%,rgba(16,185,129,.1)_26%,transparent_27%,transparent_74%,rgba(16,185,129,.1)_75%,rgba(16,185,129,.1)_76%,transparent_77%,transparent)]',
                textBox: 'bg-black/95 border-emerald-500/50 shadow-[0_-10px_30px_rgba(16,185,129,0.1)]',
                accentText: 'text-emerald-500',
                border: 'border-emerald-500',
                icon: Cpu
            };
        case 'rain':
            return {
                bg: 'bg-slate-950 text-cyan-100',
                grid: 'bg-[linear-gradient(0deg,transparent_24%,rgba(6,182,212,.1)_25%,rgba(6,182,212,.1)_26%,transparent_27%,transparent_74%,rgba(6,182,212,.1)_75%,rgba(6,182,212,.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(6,182,212,.1)_25%,rgba(6,182,212,.1)_26%,transparent_27%,transparent_74%,rgba(6,182,212,.1)_75%,rgba(6,182,212,.1)_76%,transparent_77%,transparent)]',
                textBox: 'bg-slate-900/95 border-cyan-500/50 shadow-[0_-10px_30px_rgba(6,182,212,0.15)]',
                accentText: 'text-cyan-400',
                border: 'border-cyan-500',
                icon: CloudRain
            };
        case 'daily':
            return {
                bg: 'bg-[#1a1510] text-amber-100',
                grid: 'bg-[linear-gradient(0deg,transparent_24%,rgba(245,158,11,.1)_25%,rgba(245,158,11,.1)_26%,transparent_27%,transparent_74%,rgba(245,158,11,.1)_75%,rgba(245,158,11,.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(245,158,11,.1)_25%,rgba(245,158,11,.1)_26%,transparent_27%,transparent_74%,rgba(245,158,11,.1)_75%,rgba(245,158,11,.1)_76%,transparent_77%,transparent)]',
                textBox: 'bg-black/95 border-amber-500/50 shadow-[0_-10px_30px_rgba(245,158,11,0.1)]',
                accentText: 'text-amber-500',
                border: 'border-amber-500',
                icon: Coffee
            };
        case 'collab-star':
            return {
                bg: 'bg-[#0f0a15] text-purple-100',
                grid: 'bg-[linear-gradient(0deg,transparent_24%,rgba(168,85,247,.1)_25%,rgba(168,85,247,.1)_26%,transparent_27%,transparent_74%,rgba(168,85,247,.1)_75%,rgba(168,85,247,.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(168,85,247,.1)_25%,rgba(168,85,247,.1)_26%,transparent_27%,transparent_74%,rgba(168,85,247,.1)_75%,rgba(168,85,247,.1)_76%,transparent_77%,transparent)]',
                textBox: 'bg-black/95 border-purple-500/50 shadow-[0_-10px_30px_rgba(168,85,247,0.15)]',
                accentText: 'text-purple-400',
                border: 'border-purple-500',
                icon: Star
            };
        default:
            return {
                bg: 'bg-[#0a0a0c] text-ash-light',
                grid: 'bg-[linear-gradient(0deg,transparent_24%,rgba(34,211,238,.1)_25%,rgba(34,211,238,.1)_26%,transparent_27%,transparent_74%,rgba(34,211,238,.1)_75%,rgba(34,211,238,.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(34,211,238,.1)_25%,rgba(34,211,238,.1)_26%,transparent_27%,transparent_74%,rgba(34,211,238,.1)_75%,rgba(34,211,238,.1)_76%,transparent_77%,transparent)]',
                textBox: 'bg-black/95 border-ash-dark shadow-[0_-10px_30px_rgba(0,0,0,0.5)]',
                accentText: 'text-ash-light',
                border: 'border-ash-light',
                icon: Terminal
            };
    }
};

export const getCharacterTheme = (id: string, vnTheme: VNTheme) => {
    // Character theme overrides based on VN Theme
    if (vnTheme === 'bw') {
        // Black and White overrides for everyone in Midnight mode
        return {
            text: 'text-white font-mono',
            border: 'border-white',
            bg: 'bg-black grayscale brightness-125 contrast-125',
            labelBg: 'bg-black border border-white',
            labelTx: 'text-white',
            initials: id.substring(0, 2).toUpperCase()
        };
    }

    const baseThemes: Record<string, any> = {
        'point': { 
            text: 'text-zinc-300',
            border: 'border-zinc-500',
            bg: 'bg-zinc-900',
            labelBg: 'bg-ash-light',
            labelTx: 'text-ash-black',
            initials: 'ZP'
        },
        'zeri': { 
            text: 'text-pink-200',
            border: 'border-pink-500/50',
            bg: 'bg-pink-950/20',
            labelBg: 'bg-pink-600',
            labelTx: 'text-white',
            initials: 'ZL'
        },
        'zelo': { 
            text: 'text-blue-200',
            border: 'border-blue-500/50',
            bg: 'bg-blue-950/20',
            labelBg: 'bg-blue-600',
            labelTx: 'text-white',
            initials: 'ZO'
        },
        'void': { 
            text: 'text-fuchsia-300 font-mono font-bold',
            border: 'border-fuchsia-500 border-dashed border-2',
            bg: 'bg-black/90 backdrop-blur-md',
            labelBg: 'bg-black border border-fuchsia-500',
            labelTx: 'text-fuchsia-500 animate-pulse',
            initials: 'VOID'
        },
        'dusk': { 
            text: 'text-amber-200',
            border: 'border-amber-500/50',
            bg: 'bg-amber-950/20',
            labelBg: 'bg-amber-600',
            labelTx: 'text-white',
            initials: 'DR'
        },
        'byaki': { 
            text: 'text-emerald-200',
            border: 'border-emerald-500/50',
            bg: 'bg-emerald-950/20',
            labelBg: 'bg-emerald-700',
            labelTx: 'text-white',
            initials: 'BK'
        },
        'system': {
            text: 'text-red-500 font-mono',
            border: 'border-red-500 border-double border-4',
            bg: 'bg-black',
            labelBg: 'bg-red-600',
            labelTx: 'text-white',
            initials: 'SYS'
        },
        'unknown': { 
            text: 'text-ash-gray',
            border: 'border-ash-gray/30',
            bg: 'bg-ash-dark/30',
            labelBg: 'bg-ash-gray',
            labelTx: 'text-white',
            initials: '??'
        }
    };

    const t = baseThemes[id] || baseThemes['unknown'];

    // Overrides for Variable Theme
    if (vnTheme === 'variable') {
        if (id === 'byaki') {
             return { ...t, text: 'text-emerald-100 font-mono tracking-wider', border: 'border-emerald-400', bg: 'bg-emerald-900/40' };
        }
        if (id === 'unknown') {
             return { ...t, text: 'text-emerald-500', border: 'border-emerald-800', bg: 'bg-black' };
        }
    }

    return t;
};
