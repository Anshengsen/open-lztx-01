
import React from 'react';
import { HandData, GestureType } from '../types';
import { Music, Camera, Info, Hand, Play, Pause, Sparkles, Wand2 } from 'lucide-react';

interface HUDProps {
  handData: HandData | null;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onScreenshot: () => void;
  isStarted: boolean;
  onStart: () => void;
}

const HUD: React.FC<HUDProps> = ({ 
  handData, 
  isMusicPlaying, 
  onToggleMusic, 
  onScreenshot, 
  isStarted,
  onStart 
}) => {
  if (!isStarted) {
    return (
      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-6 text-center">
        <h1 className="text-6xl md:text-8xl font-xmas text-red-500 mb-4 animate-pulse">XmasMotion</h1>
        <p className="text-white text-xl md:text-2xl mb-8 max-w-lg font-light">
          Unlock the holiday magic! Enable your camera to control snowflakes and stars with your gestures.
        </p>
        <button 
          onClick={onStart}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-2xl transition-all transform hover:scale-105 shadow-xl flex items-center gap-3"
        >
          <Play size={28} /> Start Magic
        </button>
        <p className="text-gray-400 mt-12 text-sm flex items-center gap-2">
           <Info size={16} /> Privacy: All video processing happens locally on your device.
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white shadow-2xl">
          <h2 className="font-xmas text-3xl text-red-400">XmasMotion</h2>
          <div className="flex items-center gap-4 mt-2">
             <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${handData ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {handData ? 'Hand Detected' : 'Detecting Hands...'}
             </div>
             {handData && (
               <div className="flex items-center gap-2 text-sm text-gold-400 bg-gold-400/10 px-2 py-1 rounded">
                 <Wand2 size={14} />
                 {handData.gesture === GestureType.FIST ? 'Attracting (Fist)' : 
                  handData.gesture === GestureType.OPEN_PALM ? 'Repelling (Palm)' : 
                  'Floating'}
               </div>
             )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onToggleMusic}
            className="p-4 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/20 transition-all"
            title="Toggle Music"
          >
            {isMusicPlaying ? <Music size={24} className="animate-spin-slow" /> : <Pause size={24} />}
          </button>
          <button 
            onClick={onScreenshot}
            className="p-4 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/20 transition-all"
            title="Take Screenshot"
          >
            <Camera size={24} />
          </button>
        </div>
      </div>

      {/* Bottom Help */}
      {!handData && (
        <div className="flex flex-col items-center gap-4 mb-20 animate-bounce">
           <div className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl text-white text-center border border-white/20">
              <Hand size={48} className="mx-auto mb-2 text-gold-400" />
              <p className="font-medium text-lg">Raise your hand to start!</p>
              <p className="text-xs text-white/60">Try Fist to pull, Palm to push</p>
           </div>
        </div>
      )}

      {/* Seasonal Footer */}
      <div className="flex justify-center">
         <div className="bg-white/5 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 text-white/40 text-xs flex items-center gap-2">
            <Sparkles size={12} /> Merry Christmas & Happy Coding 2024
         </div>
      </div>
    </div>
  );
};

export default HUD;
