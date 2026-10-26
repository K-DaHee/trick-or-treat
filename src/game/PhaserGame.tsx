import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 360,
      height: 640,
      scene: [MainScene],
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={containerRef} />;
}