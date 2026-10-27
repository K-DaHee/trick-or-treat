import './StartScreen.css';

type StartScreenProps = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section className="start-screen">
      <div className="start-screen__content">
        <header className="start-screen__header">
          <h1 className="start-screen__title">
            🍬 Trick or Treat 🍬
          </h1>
          <p className="start-screen__subtitle">
            G🎃! Pumpkin!
          </p>
        </header>

        <img
          className="start-screen__pumpkin"
          src="/assets/sprites/pumpkin.png"
          alt="Pumpkin character"
        />

        <p className="start-screen__description">
          Collect candy, dodge spooky obstacles,
          and beat your best score!
        </p>

        <button
          className="start-screen__button"
          type="button"
          onClick={onStart}
        >
          START GAME
        </button>

        <p className="start-screen__instructions">
          Swipe left or right to change lanes
        </p>
      </div>
    </section>
  );
}