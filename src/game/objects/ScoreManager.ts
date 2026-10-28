
export class ScoreManager {
  private elapsedMs = 0;
  private candyCount = 0;

  private readonly pointsPerSecond = 1;
  private readonly candyBonus = 10;

  // Update survival time while the game is running
  update(delta: number) {
    if (!Number.isFinite(delta) || delta <= 0) {
      return;
    }

    this.elapsedMs += Math.min(delta, 100);
  }

  // Collect candy and award bonus points
  collectCandy() {
    this.candyCount += 1;
  }

  // Calculate total score
  get score(): number {
    const survivalScore =
      this.survivalSeconds * this.pointsPerSecond;

    const candyScore =
      this.candyCount * this.candyBonus;

    return survivalScore + candyScore;
  }

  // Get the total number of collected candies
  get candy(): number {
    return this.candyCount;
  }

  // Get elapsed survival time in seconds
  get survivalSeconds(): number {
    return Math.floor(this.elapsedMs / 1000);
  }

  // Reset scoring data for a new game
  reset() {
    this.elapsedMs = 0;
    this.candyCount = 0;
  }
}
