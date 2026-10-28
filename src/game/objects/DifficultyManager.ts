
export class DifficultyManager {
  private elapsedMs = 0;

  private readonly levelDurationMs = 20_000;
  private readonly maxDifficultyTimeMs = 90_000;

  private readonly initialSpeedMultiplier = 1.3;
  private readonly maxSpeedMultiplier = 3.4;

  private readonly initialSpawnIntervalMs = 1800;
  private readonly minSpawnIntervalMs = 450;
  private readonly spawnDensityExponent = 1.65;

  // Update elapsed gameplay time
  update(delta: number) {
    if (!Number.isFinite(delta) || delta <= 0) {
      return;
    }

    this.elapsedMs += Math.min(delta, 100);
  }

  // Calculate eased difficulty progress
  private get difficultyProgress(): number {
    const progress = Math.min(
      this.elapsedMs / this.maxDifficultyTimeMs,
      1
    );

    // Increase difficulty faster at the beginning
    return 1 - Math.pow(1 - progress, 2);
  }

  // Increase difficulty level every 20 seconds
  get level(): number {
    const elapsed = Math.min(
      this.elapsedMs,
      this.maxDifficultyTimeMs
    );

    return Math.floor(
      elapsed / this.levelDurationMs
    ) + 1;
  }

  // Gradually increase road and object speed
  get speedMultiplier(): number {
    return (
      this.initialSpeedMultiplier +
      (
        this.maxSpeedMultiplier -
        this.initialSpeedMultiplier
      ) * this.difficultyProgress
    );
  }

  // Increase spawning density with movement speed
  get spawnIntervalMs(): number {
    const speedRatio =
      this.initialSpeedMultiplier /
      this.speedMultiplier;

    const interval =
      this.initialSpawnIntervalMs *
      Math.pow(
        speedRatio,
        this.spawnDensityExponent
      );

    return Math.max(
      this.minSpawnIntervalMs,
      Math.round(interval)
    );
  }

  // Get elapsed time in seconds
  get survivalSeconds(): number {
    return Math.floor(this.elapsedMs / 1000);
  }

  // Reset difficulty for a new game
  reset() {
    this.elapsedMs = 0;
  }
}
