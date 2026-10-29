
import Phaser from 'phaser';
import { HalloweenEnvironment } from './objects/HalloweenEnvironment';
import { Pumpkin } from './objects/Pumpkin';
import {
  SpawnManager,
  type SpawnType,
} from './objects/SpawnManager';
import { ScoreManager } from './objects/ScoreManager';
import {
  GameStateManager,
  type GameResult,
} from './objects/GameStateManager';
import { DifficultyManager } from './objects/DifficultyManager';
import { PumpkinExplosion } from './objects/PumpkinExplosion';

export class MainScene extends Phaser.Scene {
  private environment?: HalloweenEnvironment;
  private spawnManager?: SpawnManager;
  private scoreManager?: ScoreManager;
  private gameStateManager?: GameStateManager;
  private difficultyManager?: DifficultyManager;
  private pumpkin?: Pumpkin;

  private lastPublishedScore = -1;
  private lastPublishedCandy = -1;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image(
      'pumpkin',
      '/assets/sprites/pumpkin.png'
    );

    this.load.image(
      'halloween-sky',
      '/assets/backgrounds/halloween-sky.png'
    );

    this.load.image(
      'halloween-road-infinite-no-lines',
      '/assets/backgrounds/halloween-road-infinite-no-lines.png'
    );

    this.load.image(
      'halloween-candy',
      '/assets/sprites/halloween-candy.png'
    );

    this.load.image(
      'halloween-bat',
      '/assets/sprites/halloween-bat.png'
    );

    this.load.image(
      'halloween-ghost',
      '/assets/sprites/halloween-ghost.png'
    );
  }

  create() {
    this.cameras.main.setBackgroundColor('#211238');

    this.environment = new HalloweenEnvironment(this);

    const pumpkin = new Pumpkin(this, 0, 0);
    this.pumpkin = pumpkin;

    this.spawnManager = new SpawnManager(this);
    this.scoreManager = new ScoreManager();

    // Initialize game state
    this.gameStateManager = new GameStateManager();
    this.gameStateManager.start();

    // Initialize difficulty for a new game
    this.difficultyManager = new DifficultyManager();

    this.lastPublishedScore = -1;
    this.lastPublishedCandy = -1;

    // Publish initial score values
    this.publishScore();

    const updateLayout = () => {
      const { width, height } = this.scale;

      this.environment?.resize(width, height);
      this.spawnManager?.resize(width, height);

      pumpkin.setLanePosition(
        width,
        height * 0.85
      );
    };

    updateLayout();
    pumpkin.startBounce();

    const moveLeft = () => {
      if (!this.gameStateManager?.isPlaying) {
        return;
      }

      pumpkin.moveLane(-1, this.scale.width);
    };

    const moveRight = () => {
      if (!this.gameStateManager?.isPlaying) {
        return;
      }

      pumpkin.moveLane(1, this.scale.width);
    };

    // Keyboard controls
    this.input.keyboard?.on('keydown-LEFT', moveLeft);
    this.input.keyboard?.on('keydown-RIGHT', moveRight);

    let swipeStart: {
      x: number;
      y: number;
      pointerId: number;
    } | null = null;

    // Track where the swipe begins
    const onPointerDown = (pointer: Phaser.Input.Pointer) => {
      if (!this.gameStateManager?.isPlaying) {
        return;
      }

      swipeStart = {
        x: pointer.x,
        y: pointer.y,
        pointerId: pointer.id,
      };
    };

    // Move one lane when a horizontal swipe is detected
    const onPointerUp = (pointer: Phaser.Input.Pointer) => {
      if (!this.gameStateManager?.isPlaying) {
        swipeStart = null;
        return;
      }

      if (!swipeStart || pointer.id !== swipeStart.pointerId) {
        return;
      }

      const deltaX = pointer.x - swipeStart.x;
      const deltaY = pointer.y - swipeStart.y;

      swipeStart = null;

      const threshold = Math.max(
        30,
        this.scale.width * 0.08
      );

      if (
        Math.abs(deltaX) < threshold ||
        Math.abs(deltaX) <= Math.abs(deltaY)
      ) {
        return;
      }

      if (deltaX < 0) {
        moveLeft();
      } else {
        moveRight();
      }
    };

    this.input.on('pointerdown', onPointerDown);
    this.input.on('pointerup', onPointerUp);

    this.scale.on(
      Phaser.Scale.Events.RESIZE,
      updateLayout
    );

    // Clean up listeners when the scene shuts down
    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        this.scale.off(
          Phaser.Scale.Events.RESIZE,
          updateLayout
        );

        this.input.keyboard?.off('keydown-LEFT', moveLeft);
        this.input.keyboard?.off('keydown-RIGHT', moveRight);

        this.input.off('pointerdown', onPointerDown);
        this.input.off('pointerup', onPointerUp);

        this.spawnManager?.destroy();
      }
    );
  }

  private handleObjectCollision = (type: SpawnType) => {
    if (
      !this.gameStateManager?.isPlaying ||
      !this.scoreManager
    ) {
      return;
    }

    if (type === 'candy') {
      this.scoreManager.collectCandy();
      this.publishScore();
      return;
    }

    // Save the final result when an obstacle is hit
    const result: GameResult = {
      score: this.scoreManager.score,
      candy: this.scoreManager.candy,
      survivalSeconds: this.scoreManager.survivalSeconds,
    };

    // Prevent duplicate game-over events
    if (!this.gameStateManager.gameOver(result)) {
      return;
    }

    // Stop pumpkin animations and lane movement
    this.tweens.killAll();

    // Play the pumpkin explosion before showing game over
    if (this.pumpkin) {
      PumpkinExplosion.play(
        this,
        this.pumpkin,
        () => {
          this.game.events.emit('game-over', result);
        }
      );
    } else {
      this.game.events.emit('game-over', result);
    }
  };

  private publishScore() {
    if (!this.scoreManager) {
      return;
    }

    const score = this.scoreManager.score;
    const candy = this.scoreManager.candy;

    // Only publish when the displayed values change
    if (
      score === this.lastPublishedScore &&
      candy === this.lastPublishedCandy
    ) {
      return;
    }

    this.lastPublishedScore = score;
    this.lastPublishedCandy = candy;

    // Send scoring data from Phaser to React
    this.game.events.emit('score-updated', {
      score,
      candy,
    });
  }

  update(_time: number, delta: number) {
    // Stop gameplay updates after game over
    if (!this.gameStateManager?.isPlaying) {
      return;
    }

    // Update difficulty based on survival time
    this.difficultyManager?.update(delta);

    const speedMultiplier =
      this.difficultyManager?.speedMultiplier ?? 1;

    const spawnIntervalMs =
      this.difficultyManager?.spawnIntervalMs ?? 1800;

    // Apply the shared speed multiplier
    this.environment?.scroll(
      delta,
      speedMultiplier
    );

    this.spawnManager?.update(
      delta,
      speedMultiplier,
      spawnIntervalMs
    );

    this.scoreManager?.update(delta);

    // Check collisions between the pumpkin and spawned objects
    if (this.pumpkin) {
      this.spawnManager?.checkCollisions(
        this.pumpkin,
        this.handleObjectCollision
      );
    }

    this.publishScore();
  }
}
