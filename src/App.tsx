import { useState } from 'react';
import StartScreen from './components/StartScreen';
import PhaserGame from './game/PhaserGame';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return isPlaying ? (
    <PhaserGame />
  ) : (
    <StartScreen onStart={() => setIsPlaying(true)} />
  );
}

export default App;