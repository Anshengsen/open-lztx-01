
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Visualizer from './components/Visualizer';
import HandTracker from './components/HandTracker';
import HUD from './components/HUD';
import { HandData } from './types';
import { AUDIO_ASSETS } from './constants';

const App: React.FC = () => {
  const [handData, setHandData] = useState<HandData | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sfxChimeRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(AUDIO_ASSETS.BGM);
    audioRef.current.loop = true;
    sfxChimeRef.current = new Audio(AUDIO_ASSETS.SFX_CHIME);
    
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const handleStart = useCallback(() => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio autoplay prevented"));
      setIsMusicPlaying(true);
    }
  }, []);

  const handleToggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  }, [isMusicPlaying]);

  const handleScreenshot = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `xmas-motion-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      // Play chime SFX
      if (sfxChimeRef.current) {
        sfxChimeRef.current.currentTime = 0;
        sfxChimeRef.current.play();
      }
    }
  }, []);

  const handleHandUpdate = useCallback((data: HandData | null) => {
    setHandData(data);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      {/* Background/Base Layer */}
      <div className="absolute inset-0 bg-[#051b11]" />

      {/* Interactive Visualizer Layer */}
      <Visualizer 
        handData={handData} 
        showDebug={false} 
      />

      {/* Invisible CV Tracking Layer */}
      <HandTracker 
        onHandUpdate={handleHandUpdate} 
        isActive={isStarted} 
      />

      {/* UI Controls Layer */}
      <HUD 
        handData={handData}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onScreenshot={handleScreenshot}
        isStarted={isStarted}
        onStart={handleStart}
      />

      {/* Festive Overlay Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
    </div>
  );
};

export default App;
