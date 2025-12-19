
import React, { useEffect, useRef, useMemo } from 'react';
import { ParticleSystem } from '../services/particleEngine';
import { HandData } from '../types';
import { PARTICLE_COUNT, COLORS } from '../constants';

interface VisualizerProps {
  handData: HandData | null;
  showDebug: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ handData, showDebug }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ParticleSystem | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      if (engineRef.current) {
        engineRef.current.resize(window.innerWidth, window.innerHeight);
      }
    };

    engineRef.current = new ParticleSystem(PARTICLE_COUNT, window.innerWidth, window.innerHeight);
    window.addEventListener('resize', resize);
    resize();

    let animationId: number;
    const render = () => {
      // Clear with slight fade for trail effect if desired, 
      // but for Xmas we want crisp snow. Deep green/black bg.
      ctx.fillStyle = COLORS.DEEP_GREEN;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      if (engineRef.current) {
        engineRef.current.update(
          handData ? handData.center : null,
          handData ? handData.gesture : 'NONE'
        );
        engineRef.current.draw(ctx);
      }

      // Draw hand indicator
      if (handData) {
        const { center, gesture } = handData;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = gesture === 'FIST' ? COLORS.XMAS_RED : 
                        gesture === 'OPEN_PALM' ? COLORS.XMAS_GOLD : 
                        COLORS.XMAS_WHITE;
        ctx.fill();
        
        // Interaction ring
        ctx.beginPath();
        ctx.arc(center.x, center.y, 150, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [handData]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full cursor-none z-0"
      style={{ touchAction: 'none' }}
    />
  );
};

export default Visualizer;
