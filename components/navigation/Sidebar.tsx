
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, ImageIcon, Headphones, Heart, ChevronDown, AlignJustify, Menu, ChevronUp } from 'lucide-react';
import { NovaConfig } from '../icons/NovaIcons';
import { NavigationTranslation } from '../../data/navigationData';
import BackgroundMusic from '../BackgroundMusic';
import GuestbookPage from '../GuestbookPage'; 
import { APP_VERSION } from '../../data/version';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showMobileSettings: boolean;
  setShowMobileSettings: (val: boolean) => void;
  isMobileMenuVisible: boolean;
  setIsMobileMenuVisible: (val: boolean) => void;
  showDesktopSettings: boolean;
  setShowDesktopSettings: (val: boolean) => void;
  navItems: Array<{ id: string; label: string; mobileLabel: string; icon: any; isExternal?: boolean; url?: string }>;
  t: NavigationTranslation;
  onOpenCredits: () => void; 
  onExternalLink: (e: React.MouseEvent, url: string) => void;
  bgmPlaying: boolean;
  setBgmPlaying: (val: boolean) => void;
  bgmVolume: number;
  setBgmVolume: (val: number) => void;
  audioSources: string[];
  trackTitle: string;
  trackComposer: string;
  volumeScale?: number; // Added
  language?: any; 
  nickname?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, showMobileSettings, setShowMobileSettings,
  isMobileMenuVisible, setIsMobileMenuVisible,
  showDesktopSettings, setShowDesktopSettings, navItems, t,
  onOpenCredits, onExternalLink,
  bgmPlaying, setBgmPlaying, bgmVolume, setBgmVolume, audioSources, trackTitle, trackComposer, volumeScale = 1.0,
  language = 'zh-CN', nickname = 'GUEST'
}) => {
  const currentVersion = APP_VERSION;

  const handleMobileCollapse = () => {
      setIsMobileMenuVisible(false);
      // Removed setShowMobileSettings(false) to allow settings to adapt
  };

  return (
    <>
      {/* Mobile: Floating Restore Button (Visible when menu is collapsed) */}
      <button
        onClick={() => setIsMobileMenuVisible(true)}
        className={`lg:hidden fixed bottom-6 right-6 z-[60] w-12 h-12 bg-ash-black border-2 border-ash-light text-ash-light flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) hover:scale-110 active:scale-95 ${
          isMobileMenuVisible ? 'translate-y-32 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
        aria-label="Open Menu"
      >
        <ChevronUp size={24} />
      </button>

      <nav 
        className={`
            fixed bottom-0 left-0 right-0 lg:relative lg:w-72 lg:h-full 
            bg-[#0a0a0c]/95 backdrop-blur-xl lg:bg-[#050505]
            border-t lg:border-t-0 lg:border-r border-white/5 
            z-50 flex flex-col transform
            shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-none transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) lg:transform-none lg:transition-colors lg:overflow-hidden 
            ${!isMobileMenuVisible ? 'translate-y-full' : 'translate-y-0'}
        `}
      >
        
        {/* Mobile: Collapse Handle Strip */}
        <div 
            className="lg:hidden w-full flex flex-col items-center justify-center py-1.5 cursor-pointer active:bg-white/5 active:scale-[0.99] border-b border-white/5 group transition-all"
            onClick={handleMobileCollapse}
            title="Tap to collapse"
        >
             <div className="w-10 h-1 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors mb-0.5"></div>
             <ChevronDown size={12} className="text-white/30 group-hover:text-white/70 transition-colors" />
        </div>

        {/* === PC: Header Section === */}
        <div className="hidden lg:flex flex-col p-8 pb-6 relative z-10">
          {/* Logo Box */}
          <div className="mb-8">
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none">
                {APP_VERSION}
                <span className="text-white/40 block text-xs tracking-widest font-medium mt-1 uppercase">Project Nova</span>
              </h1>
          </div>
          
          {/* System Status / Guestbook Widget */}
          <div className="relative">
              <GuestbookPage 
                  language={language} 
                  nickname={nickname} 
                  isLightTheme={false}
                  isWidget={true}
                  className="w-full text-left"
              />
          </div>
        </div>

        {/* === Navigation Items Container === */}
        <div className="flex flex-row lg:flex-col justify-between lg:justify-start w-full gap-1 lg:gap-2 lg:mb-auto shrink-0 landscape:gap-1 md:max-w-2xl md:mx-auto lg:max-w-none lg:mx-0 relative z-10 lg:px-4 p-2 lg:p-0">
          
          {/* PC Nav Title */}
          <div className="hidden lg:flex items-center px-4 py-2 text-[10px] font-medium text-white/40 uppercase tracking-widest mb-2">
              Directory
          </div>

          {navItems.map((item, index) => {
            const isExternal = item.isExternal;
            const isActive = activeTab === item.id && !isExternal;
            const isEmphasized = item.id === 'reader' || item.id === 'sidestories';

            return (
              <React.Fragment key={item.id}>
                <button
                  onClick={(e) => {
                    if (isExternal && item.url) {
                        onExternalLink(e, item.url);
                    } else {
                        setActiveTab(item.id);
                        setShowMobileSettings(false);
                    }
                  }}
                  className={`
                    /* Mobile Styles */
                    ${isExternal ? 'hidden lg:flex' : 'flex-1 flex'} flex-col items-center justify-center py-2 lg:py-3 transition-all duration-200 relative group overflow-hidden landscape:py-1 rounded-lg
                    ${isActive 
                        ? (isEmphasized ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-white')
                        : (isEmphasized ? 'bg-amber-500/5 text-amber-200/70 hover:bg-amber-500/10 hover:text-amber-300' : 'bg-transparent text-white/60 hover:bg-white/5 hover:text-white')}
                    ${isEmphasized ? 'ring-1 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : ''}
                    
                    /* Desktop Styles (Overriding Mobile) */
                    lg:w-full lg:flex-row lg:justify-start lg:px-4 lg:h-auto
                  `}
                >
                  {/* Icon */}
                  <item.icon 
                    size={isExternal ? 16 : 18} 
                    className={`
                        mb-1 lg:mb-0 lg:mr-3 z-10 transition-colors duration-200
                        ${isActive 
                            ? (isEmphasized ? 'text-amber-300' : 'text-white')
                            : (isEmphasized ? 'text-amber-200/70 group-hover:text-amber-300' : 'text-white/60 group-hover:text-white')} 
                    `}
                    strokeWidth={isActive ? 2 : 1.5} 
                  />
                  
                  {/* Label Desktop */}
                  <div className="hidden lg:flex flex-col items-start z-10">
                      <span className={`text-sm font-medium tracking-wide ${isActive 
                          ? (isEmphasized ? 'text-amber-300' : 'text-white')
                          : (isEmphasized ? 'text-amber-200/80 group-hover:text-amber-300' : 'text-white/80 group-hover:text-white')}`}>
                        {item.label}
                      </span>
                  </div>
                  
                  {/* Label Mobile */}
                  <span className={`lg:hidden font-medium tracking-wide z-10 whitespace-nowrap landscape:text-[8px] ${isExternal ? 'text-[9px] md:text-[10px]' : 'text-[10px] md:text-xs'} ${isActive ? 'font-bold' : ''} ${isEmphasized ? (isActive ? 'text-amber-300' : 'text-amber-200/80 group-hover:text-amber-300') : ''}`}>{item.mobileLabel}</span>
                  
                  {/* External Link Icon */}
                  {isExternal && (
                      <ExternalLink size={14} className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 transition-opacity text-white" />
                  )}
                </button>
              </React.Fragment>
            );
          })}
          
          {/* Mobile Settings Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileSettings(!showMobileSettings)}
            className={`flex-1 lg:hidden flex flex-col items-center justify-center py-2 transition-all duration-200 group relative overflow-hidden landscape:py-1 ml-1 rounded-lg ${
              showMobileSettings
                ? 'bg-white/10 text-white'
                : 'bg-transparent text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <NovaConfig size={18} className="mb-1 z-10 landscape:mb-0.5 landscape:size-4 md:size-6" strokeWidth={1.5} />
            <span className="text-[10px] md:text-xs font-medium tracking-wide z-10 landscape:text-[8px]">{t.cfg}</span>
          </motion.button>
        </div>

        {/* === PC: Footer / Control Deck === */}
        <div className="hidden lg:flex flex-col mt-auto relative z-10 pt-6 px-4 pb-6 space-y-2">
          
          {/* Resource Grid (Credits) */}
          <button 
            onClick={onOpenCredits}
            className="flex items-center px-4 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors group w-full"
          >
             <Heart size={16} className="mr-3 group-hover:text-rose-400 transition-colors" />
             <span>Credits</span>
          </button>

          {/* Music Player Integration */}
          <div className="px-4 py-2">
              <BackgroundMusic 
                  isPlaying={bgmPlaying} 
                  onToggle={() => setBgmPlaying(!bgmPlaying)}
                  volume={bgmVolume}
                  onVolumeChange={setBgmVolume}
                  audioSources={audioSources}
                  trackTitle={trackTitle}
                  trackComposer={trackComposer}
                  volumeScale={volumeScale}
                  className="w-full"
              />
          </div>

          {/* Config Button */}
          <button
              onClick={() => setShowDesktopSettings(true)}
              className={`
                  w-full flex items-center px-4 py-3 rounded-lg transition-colors group
                  ${showDesktopSettings ? 'bg-white/10 text-white' : 'bg-transparent text-white/60 hover:bg-white/5 hover:text-white'}
              `}
          >
              <NovaConfig size={16} className={`mr-3 transition-transform duration-500 ${showDesktopSettings ? 'rotate-180 text-white' : ''}`} />
              <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
    </nav>
    </>
  );
};

export default Sidebar;
