
import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';
import GameHUD from '../components/GameHUD';
import './PhaserGame.css';

type ScoreUpdate = {
  score: number;
  candy: number;
};

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [hud, setHud] = useState<ScoreUpdate>({
    score: 0,
    candy: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: 360,
        height: 640,
      },
      scene: [MainScene],
    });

    // Receive score updates from Phaser
    const handleScoreUpdated = (data: ScoreUpdate) => {
      setHud({
        score: data.score,
        candy: data.candy,
      });
    };

    game.events.on('score-updated', handleScoreUpdated);

    // Clean up listeners when the component unmounts
    return () => {
      game.events.off('score-updated', handleScoreUpdated);
      game.destroy(true);
    };
  }, []);

  return (
    <div className="phaser-game">
      <div
        ref={containerRef}
        className="phaser-game__canvas"
      />
      <GameHUD
        score={hud.score}
        candy={hud.candy}
      />
    </div>
  );
}
