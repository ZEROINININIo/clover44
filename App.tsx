import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import SideStoryReader from './components/sidestory/SideStoryReader';
import CloverEntryAnimation from './components/CloverEntryAnimation';
import CloverDirectory from './components/CloverDirectory';
import BackgroundMusic from './components/BackgroundMusic';
import SimplifiedSettingsModal from './components/SimplifiedSettingsModal';
import { Language, ReadingMode, AppConfig, GraphicsQuality } from './types';
import { ReaderFont } from './components/fonts/fontConfig';
import { CONFIG_STORAGE_KEY, DEFAULT_CONFIG } from './config/constants';
import { sideStoryVolumes } from './data/sideStories';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const loadConfig = (): AppConfig => {
    let config = DEFAULT_CONFIG;
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn("Failed to load config", e);
    }
    return config;
  };

  const initialConfig = loadConfig();

  // App State: 'BOOT' -> 'DIRECTORY' -> 'READER'
  const [appState, setAppState] = useState<'BOOT' | 'DIRECTORY' | 'READER'>('BOOT');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  // Global Preference State
  const [language, setLanguage] = useState<Language>(initialConfig.language);
  const [readerFont, setReaderFont] = useState<ReaderFont>(initialConfig.readerFont || 'sans');
  const [fontSize, setFontSize] = useState<number>(initialConfig.fontSize || 18);
  const [crtEnabled, setCrtEnabled] = useState(initialConfig.crtEnabled);
  const [bgmPlaying, setBgmPlaying] = useState<boolean>(initialConfig.bgmPlaying !== false);
  const [bgmVolume, setBgmVolume] = useState<number>(initialConfig.bgmVolume ?? 0.05);
  const [showSettings, setShowSettings] = useState(false);

  // Handle the HTML loader removal with 100% completion effect
  useEffect(() => {
    const loader = document.getElementById('initial-loader');
    const bar = document.getElementById('progress-fill');
    const txt = document.getElementById('progress-text');
    
    // Stop the simulation interval
    if ((window as any)._loaderInterval) {
        clearInterval((window as any)._loaderInterval);
    }

    const removeLoader = () => {
        if (loader) {
            // Force 100% state
            if (bar) bar.style.width = '100%';
            if (txt) txt.innerText = 'LOADING_RESOURCES // 100%';
            
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.pointerEvents = 'none';
                setTimeout(() => loader.remove(), 800);
            }, 600);
        }
    };

    const waitForResources = Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 3000)) // 3s fallback timeout
    ]);

    waitForResources.then(() => {
        removeLoader();
    }).catch(() => {
        removeLoader();
    });

  }, []);

  useEffect(() => {
    const config = { language, readerFont, fontSize, crtEnabled, bgmPlaying, bgmVolume };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    
    if (crtEnabled) {
      document.body.classList.add('crt-enabled');
    } else {
      document.body.classList.remove('crt-enabled');
    }
  }, [language, readerFont, fontSize, crtEnabled, bgmPlaying, bgmVolume]);

  return (
    <>
      <CustomCursor />
      <BackgroundMusic isPlaying={bgmPlaying} volume={bgmVolume} />
      
      <AnimatePresence mode="wait">
        {appState === 'BOOT' && (
          <CloverEntryAnimation key="boot" onComplete={() => setAppState('DIRECTORY')} />
        )}
        
        {appState === 'DIRECTORY' && (
            <CloverDirectory
                key="directory"
                volume={sideStoryVolumes.find(v => v.id === "VOL_COLLAB_HALF_44")!}
                language={language}
                onSelectChapter={(index) => {
                    setCurrentChapterIndex(index);
                    setAppState('READER');
                }}
            />
        )}
        
        {appState === 'READER' && (
          <SideStoryReader
            key="reader"
            volume={sideStoryVolumes.find(v => v.id === "VOL_COLLAB_HALF_44")!}
            currentIndex={currentChapterIndex}
            onBack={() => setAppState('DIRECTORY')}
            language={language}
            readerFont={readerFont}
            fontSize={fontSize}
          />
        )}
      </AnimatePresence>

      {/* Settings Button */}
      {appState !== 'BOOT' && (
        <button
          onClick={() => setShowSettings(true)}
          className="fixed bottom-6 right-6 z-50 p-4 border-2 border-emerald-800 bg-emerald-950/80 backdrop-blur text-emerald-400 hover:text-emerald-100 hover:border-emerald-500 hover:bg-emerald-900 shadow-[0_0_15px_rgba(4,120,87,0.3)] transition-all group cursor-pointer"
        >
          <Settings size={24} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      )}

      {/* Settings Modal */}
      <SimplifiedSettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        bgmPlaying={bgmPlaying}
        setBgmPlaying={setBgmPlaying}
        bgmVolume={bgmVolume}
        setBgmVolume={setBgmVolume}
        crtEnabled={crtEnabled}
        setCrtEnabled={setCrtEnabled}
        language={language}
        setLanguage={setLanguage}
        readerFont={readerFont}
        setReaderFont={setReaderFont}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
    </>
  );
};

export default App;
