
import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';
import GameHUD from '../components/GameHUD';
import GameOverScreen from '../components/GameOverScreen';
import type { GameResult } from './objects/GameStateManager';
import './PhaserGame.css';

type ScoreUpdate = {
  score: number;
  candy: number;
};

type PhaserGameProps = {
  bgm: HTMLAudioElement;
};

export default function PhaserGame({
  bgm,
}: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const [hud, setHud] = useState<ScoreUpdate>({
    score: 0,
    candy: 0,
  });

  const [gameOverResult, setGameOverResult] =
    useState<GameResult | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

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

    gameRef.current = game;

    // Receive score updates from Phaser
    const handleScoreUpdated = (data: ScoreUpdate) => {
      setHud({
        score: data.score,
        candy: data.candy,
      });
    };

    // Stop background music when the game ends
    const handleGameOver = (result: GameResult) => {
      bgm.pause();
      bgm.currentTime = 0;

      setGameOverResult(result);
    };

    // Synchronize the Phaser mute button with React BGM
    const handleSoundMuted = (muted: boolean) => {
      bgm.muted = muted;
    };

    game.events.on(
      'score-updated',
      handleScoreUpdated
    );

    game.events.on(
      'game-over',
      handleGameOver
    );

    game.events.on(
      'sound-muted',
      handleSoundMuted
    );

    return () => {
      game.events.off(
        'score-updated',
        handleScoreUpdated
      );

      game.events.off(
        'game-over',
        handleGameOver
      );

      game.events.off(
        'sound-muted',
        handleSoundMuted
      );

      gameRef.current = null;
      game.destroy(true);
    };
  }, [bgm]);

  const handleRetry = () => {
    const game = gameRef.current;

    if (!game || !gameOverResult) {
      return;
    }

    // Restart BGM directly from the TRY AGAIN click
    bgm.currentTime = 0;

    void bgm.play().catch((error) => {
      console.warn('Unable to restart background music:', error);
    });

    // Reset React HUD
    setHud({
      score: 0,
      candy: 0,
    });

    setGameOverResult(null);

    // Restart Phaser without creating another game instance
    const scene = game.scene.getScene('MainScene');
    scene.scene.restart();
  };

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

      {gameOverResult && (
        <GameOverScreen
          result={gameOverResult}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
