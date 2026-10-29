
import './StartScreen.css';

type StartScreenProps = {
  onStart: () => void;
};

export default function StartScreen({
  onStart,
}: StartScreenProps) {
  return (
    <main className="start-screen">
      <div className="start-screen__artwork">
        {/* Original Halloween start screen artwork */}
        <img
          className="start-screen__image"
          src="/assets/backgrounds/start-screen.png"
          alt=""
          draggable={false}
        />

        {/* Accessible game title */}
        <h1 className="start-screen__sr-only">
          Trick or Treat — Go! Pumpkin!
        </h1>

        {/* Clickable area over the START GAME button */}
        <button
          className="start-screen__start-button"
          type="button"
          onClick={onStart}
          aria-label="Start Game"
        />

        {/* Accessible game instructions */}
        <p className="start-screen__sr-only">
          Swipe left or right to change lanes.
        </p>
      </div>
    </main>
  );
}
