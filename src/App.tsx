
import { useEffect, useRef, useState } from 'react';
import StartScreen from './components/StartScreen';
import PhaserGame from './game/PhaserGame';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio when leaving the application
  useEffect(() => {
    return () => {
      const bgm = bgmRef.current;

      if (bgm) {
        bgm.pause();
        bgm.src = '';
        bgm.load();
        bgmRef.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    if (!bgmRef.current) {
      const bgm = new Audio(
        '/assets/audio/halloween-arcade-loop.wav'
      );

      bgm.loop = true;
      bgm.volume = 0.15;
      bgm.preload = 'auto';

      bgmRef.current = bgm;
    }

    // Play directly inside the START GAME click handler.
    // This allows mobile browsers to unlock audio.
    bgmRef.current.currentTime = 0;

    void bgmRef.current.play().catch((error) => {
      console.warn('Unable to start background music:', error);
    });

    setIsPlaying(true);
  };

  return isPlaying && bgmRef.current ? (
    <PhaserGame bgm={bgmRef.current} />
  ) : (
    <StartScreen onStart={handleStart} />
  );
}

export default App;
