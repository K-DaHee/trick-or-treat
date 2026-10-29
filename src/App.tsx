
import { useEffect, useRef, useState } from 'react';
import StartScreen from './components/StartScreen';
import PhaserGame from './game/PhaserGame';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);

  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // Release background music when the app unmounts
  useEffect(() => {
    return () => {
      const bgm = bgmRef.current;

      if (bgm) {
        bgm.pause();
        bgm.src = '';
        bgmRef.current = null;
      }
    };
  }, []);

  // Fade out the start screen after Phaser is ready
  useEffect(() => {
    if (!isGameReady) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowStartScreen(false);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isGameReady]);

  const handleStart = () => {
    if (isPlaying) {
      return;
    }

    if (!bgmRef.current) {
      const bgm = new Audio(
        '/assets/audio/halloween-arcade-loop.wav'
      );

      bgm.loop = true;
      bgm.volume = 0.15;
      bgm.preload = 'auto';

      bgmRef.current = bgm;
    }

    // Unlock audio directly from the START GAME click
    bgmRef.current.currentTime = 0;

    void bgmRef.current.play().catch((error) => {
      console.warn(
        'Unable to start background music:',
        error
      );
    });

    // Mount Phaser while keeping the start screen visible
    setIsGameReady(false);
    setIsPlaying(true);
  };

  return (
    <>
      {isPlaying && bgmRef.current && (
        <PhaserGame
          bgm={bgmRef.current}
          onReady={() => setIsGameReady(true)}
        />
      )}

      {showStartScreen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            opacity: isGameReady ? 0 : 1,
            transition: 'opacity 250ms ease-out',
            pointerEvents: isPlaying ? 'none' : 'auto',
          }}
        >
          <StartScreen onStart={handleStart} />
        </div>
      )}
    </>
  );
}

export default App;
