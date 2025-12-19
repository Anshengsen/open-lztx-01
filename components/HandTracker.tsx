
import React, { useEffect, useRef } from 'react';
import { HandData, GestureType, Landmark } from '../types';

interface HandTrackerProps {
  onHandUpdate: (data: HandData | null) => void;
  isActive: boolean;
}

const HandTracker: React.FC<HandTrackerProps> = ({ onHandUpdate, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (!isActive) return;

    const setupHands = async () => {
      // @ts-ignore
      const hands = new window.Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: any) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks: Landmark[] = results.multiHandLandmarks[0];
          
          // Gesture Detection logic
          const isFist = checkFist(landmarks);
          const isOpen = checkOpenPalm(landmarks);
          
          const center = {
            x: (1 - landmarks[9].x) * window.innerWidth, // Horizontal mirror
            y: landmarks[9].y * window.innerHeight
          };

          onHandUpdate({
            landmarks,
            gesture: isFist ? GestureType.FIST : (isOpen ? GestureType.OPEN_PALM : GestureType.NONE),
            center
          });
        } else {
          onHandUpdate(null);
        }
      });

      handsRef.current = hands;

      if (videoRef.current) {
        // @ts-ignore
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current && videoRef.current) {
              await handsRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });
        camera.start();
        cameraRef.current = camera;
      }
    };

    setupHands();

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (handsRef.current) handsRef.current.close();
    };
  }, [isActive]);

  const checkFist = (landmarks: Landmark[]) => {
    // Check if finger tips are below knuckles
    const fingerTips = [8, 12, 16, 20];
    const fingerKnuckles = [6, 10, 14, 18];
    let bentCount = 0;
    for (let i = 0; i < 4; i++) {
      if (landmarks[fingerTips[i]].y > landmarks[fingerKnuckles[i]].y) bentCount++;
    }
    return bentCount >= 3;
  };

  const checkOpenPalm = (landmarks: Landmark[]) => {
    const fingerTips = [8, 12, 16, 20];
    const fingerKnuckles = [6, 10, 14, 18];
    let straightCount = 0;
    for (let i = 0; i < 4; i++) {
      if (landmarks[fingerTips[i]].y < landmarks[fingerKnuckles[i]].y) straightCount++;
    }
    return straightCount >= 3;
  };

  return (
    <video
      ref={videoRef}
      className="hidden"
      playsInline
      muted
    />
  );
};

export default HandTracker;
