
import React, { useState } from 'react';
// Replaced generic Lucide imports with custom Nova Icons
import { NovaRoot, NovaPersonnel, NovaData, NovaTerminal, NovaFragments, NovaArchive } from './icons/NovaIcons';
import { ImageIcon, Headphones } from 'lucide-react';
import BackgroundMusic from './BackgroundMusic';
import { Language, ReadingMode, GraphicsQuality } from '../types';
import { ReaderFont } from './fonts/fontConfig';
import ScriptExporter from './ScriptExporter';
import CreditsPage from '../pages/CreditsPage'; 
import { navigationData } from '../data/navigationData';

// Modular Components
import ExitModal from './navigation/ExitModal';
import MobileSettingsOverlay from './navigation/MobileSettingsOverlay';
import DesktopSettingsModal from './navigation/DesktopSettingsModal';
import Sidebar from './navigation/Sidebar';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  crtEnabled: boolean;
  setCrtEnabled: (val: boolean) => void;
  bgmPlaying: boolean;
  setBgmPlaying: (val: boolean) => void;
  bgmVolume: number;
  setBgmVolume: (val: number) => void;
  readerFont: ReaderFont;
  setReaderFont: (font: ReaderFont) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  readingMode: ReadingMode;
  setReadingMode: (mode: ReadingMode) => void;
  pureReadingMode: boolean;
  setPureReadingMode: (val: boolean) => void;
  nickname?: string;
  setNickname?: (name: string) => void;
  // Audio Props
  audioSources: string[];
  trackTitle: string;
  trackComposer: string;
  volumeScale?: number; 
  // Terminal Handlers
  onTerminalOpen?: () => void;
  onTerminalClose?: () => void;
  // Graphics
  graphicsQuality: GraphicsQuality;
  setGraphicsQuality: (q: GraphicsQuality) => void;
  onOpenReadingGuide: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
    activeTab, setActiveTab, language, setLanguage,
    crtEnabled, setCrtEnabled,
    bgmPlaying, setBgmPlaying, bgmVolume, setBgmVolume,
    readerFont, setReaderFont, fontSize, setFontSize, readingMode, setReadingMode, pureReadingMode, setPureReadingMode,
    nickname, setNickname,
    audioSources, trackTitle, trackComposer, volumeScale = 1.0,
    onTerminalOpen, onTerminalClose,
    graphicsQuality, setGraphicsQuality, onOpenReadingGuide
}) => {
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [showDesktopSettings, setShowDesktopSettings] = useState(false);
  const [showCredits, setShowCredits] = useState(false); 
  const [showExporter, setShowExporter] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(true);
  
  // Modal Step: 0 = Closed, 1 = Confirm, 2 = Follow-up
  const [exitModalStep, setExitModalStep] = useState<0 | 1 | 2>(0);
  const [exitTargetUrl, setExitTargetUrl] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);

  const t = navigationData[language];

  // Updated Nav Items with Custom Icons
  const navItems = [
    { id: 'home', label: t.home, mobileLabel: t.mobileHome, icon: NovaRoot },
    { id: 'characters', label: t.characters, mobileLabel: t.mobileChars, icon: NovaPersonnel },
    { id: 'database', label: t.database, mobileLabel: t.mobileData, icon: NovaData },
    { id: 'reader', label: t.reader, mobileLabel: t.mobileRead, icon: NovaTerminal },
    { id: 'sidestories', label: t.sidestories, mobileLabel: t.mobileSide, icon: NovaFragments },
    { id: 'archives', label: t.archives, mobileLabel: t.mobileArchives, icon: NovaArchive },
    { id: 'ost', label: t.ost, mobileLabel: 'OST', icon: Headphones, isExternal: true, url: 'https://ost.zeroxv.cn' },
    { id: 'gallery', label: t.gallery, mobileLabel: 'GALLERY', icon: ImageIcon, isExternal: true, url: 'https://pic.zeroxv.cn' },
  ];

  const cycleLanguage = () => {
    if (language === 'zh-CN') setLanguage('zh-TW');
    else setLanguage('zh-CN');
  };

  const getLangLabel = () => {
    if (language === 'zh-CN') return '简';
    return '繁';
  };

  const handleExternalLink = (e: React.MouseEvent, url: string) => {
      e.preventDefault();
      let target = url;
      
      // Auto-append nickname for identity sync
      if (nickname) {
          try {
              const urlObj = new URL(url);
              urlObj.searchParams.set('nickname', nickname);
              target = urlObj.toString();
          } catch (err) {
              // Fallback for relative URLs or if parsing fails
              const separator = url.includes('?') ? '&' : '?';
              target = `${url}${separator}nickname=${encodeURIComponent(nickname)}`;
          }
      }

      setExitTargetUrl(target);
      setExitModalStep(1); // Open to Step 1
  };

  const confirmExit = () => {
      if (exitTargetUrl) {
          window.open(exitTargetUrl, "_blank");
      }
      setExitModalStep(0);
      setExitTargetUrl("");
  };

  const handleMistake = () => {
      setExitModalStep(2); // Go to Step 2
  };

  const handleFactoryReset = () => {
      // UI already handles confirmation (double-check pattern)
      try {
          localStorage.clear();
          sessionStorage.clear();
          // Reset to root path to clear any query params that might affect initialization
          window.location.href = window.location.pathname;
      } catch (e) {
          console.error("Reset failed:", e);
          window.location.reload();
      }
  };

  const copySyncLink = () => {
      const url = new URL(window.location.href);
      if (nickname) {
          url.searchParams.set('nickname', nickname);
      }
      navigator.clipboard.writeText(url.toString()).then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
      });
  };

  return (
    <>
      {showExporter && (
          <ScriptExporter language={language} onClose={() => setShowExporter(false)} />
      )}

      {showCredits && (
          <CreditsPage 
            language={language} 
            onBack={() => setShowCredits(false)} 
            graphicsQuality={graphicsQuality}
          />
      )}

      {/* Mobile Floating BGM */}
      <div className="lg:hidden">
          <BackgroundMusic 
              floating
              isPlaying={bgmPlaying} 
              onToggle={() => setBgmPlaying(!bgmPlaying)}
              volume={bgmVolume}
              onVolumeChange={setBgmVolume}
              audioSources={audioSources}
              trackTitle={trackTitle}
              trackComposer={trackComposer}
              volumeScale={volumeScale}
              className="opacity-90 scale-90 origin-top-right"
          />
      </div>

      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showMobileSettings={showMobileSettings}
        setShowMobileSettings={setShowMobileSettings}
        isMobileMenuVisible={isMobileMenuVisible}
        setIsMobileMenuVisible={setIsMobileMenuVisible}
        showDesktopSettings={showDesktopSettings}
        setShowDesktopSettings={setShowDesktopSettings}
        navItems={navItems}
        t={t}
        onOpenCredits={() => setShowCredits(true)} // Passed down
        onExternalLink={handleExternalLink}
        bgmPlaying={bgmPlaying}
        setBgmPlaying={setBgmPlaying}
        bgmVolume={bgmVolume}
        setBgmVolume={setBgmVolume}
        audioSources={audioSources}
        trackTitle={trackTitle}
        trackComposer={trackComposer}
        volumeScale={volumeScale}
        // Pass identity props to Sidebar for Guestbook
        language={language}
        nickname={nickname}
      />

      <MobileSettingsOverlay
        show={showMobileSettings}
        onClose={() => setShowMobileSettings(false)}
        language={language}
        t={t}
        nickname={nickname}
        setNickname={setNickname}
        onCopySyncLink={copySyncLink}
        copySuccess={copySuccess}
        onOpenExporter={() => setShowExporter(true)}
        onOpenCredits={() => setShowCredits(true)} // Passed down
        onExternalLink={handleExternalLink}
        onCycleLanguage={cycleLanguage}
        langLabel={getLangLabel()}
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        pureReadingMode={pureReadingMode}
        setPureReadingMode={setPureReadingMode}
        readerFont={readerFont}
        setReaderFont={setReaderFont}
        fontSize={fontSize}
        setFontSize={setFontSize}
        crtEnabled={crtEnabled}
        setCrtEnabled={setCrtEnabled}
        onFactoryReset={handleFactoryReset}
        graphicsQuality={graphicsQuality}
        setGraphicsQuality={setGraphicsQuality}
        isMobileMenuVisible={isMobileMenuVisible}
        onOpenReadingGuide={onOpenReadingGuide}
      />

      <DesktopSettingsModal
        show={showDesktopSettings}
        onClose={() => setShowDesktopSettings(false)}
        language={language}
        t={t}
        nickname={nickname}
        setNickname={setNickname}
        onCopySyncLink={copySyncLink}
        copySuccess={copySuccess}
        onCycleLanguage={cycleLanguage}
        langLabel={getLangLabel()}
        readerFont={readerFont}
        setReaderFont={setReaderFont}
        fontSize={fontSize}
        setFontSize={setFontSize}
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        pureReadingMode={pureReadingMode}
        setPureReadingMode={setPureReadingMode}
        crtEnabled={crtEnabled}
        setCrtEnabled={setCrtEnabled}
        onOpenExporter={() => setShowExporter(true)}
        onFactoryReset={handleFactoryReset}
        graphicsQuality={graphicsQuality}
        setGraphicsQuality={setGraphicsQuality}
        onOpenReadingGuide={onOpenReadingGuide}
      />

      <ExitModal 
        step={exitModalStep}
        onClose={() => setExitModalStep(0)}
        onConfirm={confirmExit}
        onMistake={handleMistake}
        language={language}
      />
    </>
  );
};

export default Navigation;
