import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Monitor, Type, Languages } from 'lucide-react';
import { Language } from '../types';
import { ReaderFont } from '../components/fonts/fontConfig';

interface SettingsModalProps {
    show: boolean;
    onClose: () => void;
    bgmPlaying: boolean;
    setBgmPlaying: (v: boolean) => void;
    bgmVolume: number;
    setBgmVolume: (v: number) => void;
    crtEnabled: boolean;
    setCrtEnabled: (v: boolean) => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    readerFont: ReaderFont;
    setReaderFont: (font: ReaderFont) => void;
    fontSize: number;
    setFontSize: (size: number) => void;
}

const SimplifiedSettingsModal: React.FC<SettingsModalProps> = (props) => {
    return (
        <AnimatePresence>
            {props.show && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div 
                        initial={{ y: 20, scale: 0.95 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 20, scale: 0.95 }}
                        className="w-full max-w-md bg-emerald-950 border-2 border-emerald-800 p-6 shadow-[0_0_30px_rgba(4,120,87,0.3)] text-emerald-100 flex flex-col gap-6"
                    >
                        <div className="flex justify-between items-center border-b border-emerald-900 pb-2">
                            <h2 className="text-xl font-bold tracking-widest text-emerald-400">SYSTEM SETTINGS</h2>
                            <button onClick={props.onClose} className="hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        {/* Audio */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-mono text-emerald-500 uppercase">
                                {props.bgmPlaying ? <Volume2 size={16}/> : <VolumeX size={16}/>} Audio Module
                            </label>
                            <div className="flex gap-4 items-center">
                                <button 
                                    onClick={() => props.setBgmPlaying(!props.bgmPlaying)}
                                    className={`px-4 py-2 border font-mono text-xs \${props.bgmPlaying ? 'bg-emerald-900 border-emerald-500 text-emerald-200' : 'border-emerald-900 text-emerald-700'}`}
                                >
                                    {props.bgmPlaying ? 'BGM ON' : 'BGM OFF'}
                                </button>
                                <input 
                                    type="range" 
                                    min="0" max="1" step="0.05"
                                    value={props.bgmVolume}
                                    onChange={(e) => props.setBgmVolume(parseFloat(e.target.value))}
                                    className="flex-1 accent-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Language */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-mono text-emerald-500 uppercase">
                                <Languages size={16}/> Language
                            </label>
                            <div className="flex gap-2">
                                {(["zh-CN", "zh-TW"] as Language[]).map(l => (
                                    <button 
                                        key={l}
                                        onClick={() => props.setLanguage(l)}
                                        className={`flex-1 py-2 border font-mono text-xs \${props.language === l ? 'bg-emerald-900 border-emerald-500 text-emerald-200' : 'border-emerald-900 text-emerald-700'}`}
                                    >
                                        {l === 'zh-CN' ? '简体中文' : '繁體中文'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Display */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-mono text-emerald-500 uppercase">
                                <Monitor size={16}/> Visual FX
                            </label>
                            <button 
                                onClick={() => props.setCrtEnabled(!props.crtEnabled)}
                                className={`w-full py-2 border font-mono text-xs \${props.crtEnabled ? 'bg-emerald-900 border-emerald-500 text-emerald-200' : 'border-emerald-900 text-emerald-700'}`}
                            >
                                {props.crtEnabled ? 'CRT FILTER ON' : 'CRT FILTER OFF'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SimplifiedSettingsModal;
