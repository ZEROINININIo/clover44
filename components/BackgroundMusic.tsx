import React, { useState, useRef, useEffect } from 'react';
import { AUDIO_MAP } from '../config/constants';

interface BackgroundMusicProps {
  isPlaying: boolean;
  volume: number;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ isPlaying, volume }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const sources = AUDIO_MAP.collab_star || AUDIO_MAP.main;
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.error("Autoplay prevented:", e);
                // Autoplay policy prevented playback, wait for interaction
                const onInteract = () => {
                   if (isPlaying && audioRef.current) {
                       audioRef.current.play().catch(console.error);
                   }
                   document.removeEventListener('click', onInteract);
                   document.removeEventListener('keydown', onInteract);
                };
                document.addEventListener('click', onInteract);
                document.addEventListener('keydown', onInteract);
            });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentUrlIndex]);

  const handleError = () => {
    if (currentUrlIndex < sources.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
    }
  };

  return (
    <audio 
        ref={audioRef}
        src={sources[currentUrlIndex]}
        loop
        onError={handleError}
    />
  );
};
export default BackgroundMusic;
