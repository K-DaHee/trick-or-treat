import './GameHUD.css';

type GameHUDProps = {
  score: number;
  candy: number;
};

export default function GameHUD({ score, candy }: GameHUDProps) {
  return (
    <div className="game-hud">
      <div className="game-hud__stat">
        <span className="game-hud__label">SCORE</span>
        <span className="game-hud__value">
          {score.toLocaleString()}
        </span>
      </div>

      <div className="game-hud__stat">
        <span className="game-hud__label">CANDY</span>
        <span className="game-hud__value">
          🍬 {candy.toLocaleString()}
        </span>
      </div>
    </div>
  );
}