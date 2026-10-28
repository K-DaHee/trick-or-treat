
import type { GameResult } from '../game/objects/GameStateManager';
import './GameOverScreen.css';

type GameOverScreenProps = {
  result: GameResult;
  onRetry: () => void;
};

export default function GameOverScreen({
  result,
  onRetry,
}: GameOverScreenProps) {
  return (
    <section
      className="game-over-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
    >
      <div className="game-over-screen__content">
        <header className="game-over-screen__header">
          <h1
            id="game-over-title"
            className="game-over-screen__title"
          >
            🎃 GAME OVER 🎃
          </h1>
        </header>

        <div className="game-over-screen__results">
          <div className="game-over-screen__score">
            <span className="game-over-screen__label">
              FINAL SCORE
            </span>

            <strong className="game-over-screen__score-value">
              {result.score.toLocaleString()}
            </strong>
          </div>

          <div className="game-over-screen__stats">
            <div className="game-over-screen__stat">
              <span className="game-over-screen__label">
                CANDY
              </span>

              <strong className="game-over-screen__stat-value">
                🍬 {result.candy.toLocaleString()}
              </strong>
            </div>

            <div className="game-over-screen__stat">
              <span className="game-over-screen__label">
                TIME
              </span>

              <strong className="game-over-screen__stat-value">
                ⏱️ {result.survivalSeconds}s
              </strong>
            </div>
          </div>
        </div>

        <button
          className="game-over-screen__button"
          type="button"
          onClick={onRetry}
          autoFocus
        >
          TRY AGAIN
        </button>
      </div>
    </section>
  );
}
