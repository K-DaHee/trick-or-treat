import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';
import GameHUD from '../components/GameHUD';
import './PhaserGame.css';

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);

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

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="phaser-game">
      <div
        ref={containerRef}
        className="phaser-game__canvas"
      />
      <GameHUD score={0} candy={0} />
    </div>
  );
}