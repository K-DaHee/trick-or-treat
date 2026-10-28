
export type GameState = 'ready' | 'playing' | 'game-over';

export interface GameResult {
  score: number;
  candy: number;
  survivalSeconds: number;
}

export class GameStateManager {
  private currentState: GameState = 'ready';
  private finalResult: GameResult | null = null;

  // Get the current game state
  get state(): GameState {
    return this.currentState;
  }

  // Check whether gameplay is active
  get isPlaying(): boolean {
    return this.currentState === 'playing';
  }

  // Get the final result after game over
  get result(): GameResult | null {
    return this.finalResult;
  }

  // Start a new game
  start(): boolean {
    if (this.currentState !== 'ready') {
      return false;
    }

    this.currentState = 'playing';
    return true;
  }

  // End the game only once
  gameOver(result: GameResult): boolean {
    if (!this.isPlaying) {
      return false;
    }

    this.currentState = 'game-over';
    this.finalResult = { ...result };

    return true;
  }

  // Reset state before restarting
  reset() {
    this.currentState = 'ready';
    this.finalResult = null;
  }
}
