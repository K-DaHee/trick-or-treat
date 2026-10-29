
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
import { BatSwarm } from './objects/BatSwarm';
import { GhostJumpscare } from './objects/GhostJumpscare';
import { AudioManager } from './objects/AudioManager';

export class MainScene extends Phaser.Scene {
  private environment?: HalloweenEnvironment;
  private spawnManager?: SpawnManager;
  private scoreManager?: ScoreManager;
  private gameStateManager?: GameStateManager;
  private difficultyManager?: DifficultyManager;
  private audioManager?: AudioManager;
  private pumpkin?: Pumpkin;
  private muteButton?: Phaser.GameObjects.Text;

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

    this.load.image(
      'halloween-ghost-scary',
      '/assets/sprites/halloween-ghost-scary.png'
    );

    // Sound effects
    this.load.audio(
      'candy-pickup',
      '/assets/audio/candy-pickup.wav'
    );

    this.load.audio(
      'pumpkin-explosion',
      '/assets/audio/pumpkin-explosion.wav'
    );

    this.load.audio(
      'bat-swarm',
      '/assets/audio/bat-swarm.wav'
    );

    this.load.audio(
      'ghost-jumpscare',
      '/assets/audio/ghost-jumpscare.wav'
    );

    this.load.audio(
      'game-over',
      '/assets/audio/game-over.wav'
    );
  }

  create() {
    this.cameras.main.setBackgroundColor('#211238');

    this.environment = new HalloweenEnvironment(this);

    const pumpkin = new Pumpkin(this, 0, 0);
    this.pumpkin = pumpkin;

    this.spawnManager = new SpawnManager(this);
    this.scoreManager = new ScoreManager();

    this.gameStateManager = new GameStateManager();
    this.gameStateManager.start();

    this.difficultyManager = new DifficultyManager();

    this.audioManager = new AudioManager(this);

    this.lastPublishedScore = -1;
    this.lastPublishedCandy = -1;

    this.publishScore();

    // Mute button for both BGM and sound effects
    this.muteButton = this.add.text(
      0,
      0,
      this.audioManager.isMuted ? '🔇' : '🔊',
      {
        fontSize: '28px',
        backgroundColor: '#21123899',
        padding: {
          x: 10,
          y: 8,
        },
      }
    );

    this.muteButton
      .setOrigin(1, 0)
      .setDepth(2000)
      .setInteractive({
        useHandCursor: true,
      });

    this.muteButton.on('pointerdown', () => {
      if (!this.audioManager) {
        return;
      }

      const muted = this.audioManager.toggleMute();

      this.muteButton?.setText(
        muted ? '🔇' : '🔊'
      );

      // Notify React to mute/unmute BGM too
      this.game.events.emit('sound-muted', muted);
    });

    const updateLayout = () => {
      const { width, height } = this.scale;

      this.environment?.resize(width, height);
      this.spawnManager?.resize(width, height);

      pumpkin.setLanePosition(
        width,
        height * 0.85
      );

      this.muteButton?.setPosition(
        width - 12,
        76
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
    this.input.keyboard?.on(
      'keydown-LEFT',
      moveLeft
    );

    this.input.keyboard?.on(
      'keydown-RIGHT',
      moveRight
    );

    let swipeStart: {
      x: number;
      y: number;
      pointerId: number;
    } | null = null;

    const onPointerDown = (
      pointer: Phaser.Input.Pointer
    ) => {
      if (!this.gameStateManager?.isPlaying) {
        return;
      }

      swipeStart = {
        x: pointer.x,
        y: pointer.y,
        pointerId: pointer.id,
      };
    };

    const onPointerUp = (
      pointer: Phaser.Input.Pointer
    ) => {
      if (!this.gameStateManager?.isPlaying) {
        swipeStart = null;
        return;
      }

      if (
        !swipeStart ||
        pointer.id !== swipeStart.pointerId
      ) {
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

    this.input.on(
      'pointerdown',
      onPointerDown
    );

    this.input.on(
      'pointerup',
      onPointerUp
    );

    this.scale.on(
      Phaser.Scale.Events.RESIZE,
      updateLayout
    );

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        this.scale.off(
          Phaser.Scale.Events.RESIZE,
          updateLayout
        );

        this.input.keyboard?.off(
          'keydown-LEFT',
          moveLeft
        );

        this.input.keyboard?.off(
          'keydown-RIGHT',
          moveRight
        );

        this.input.off(
          'pointerdown',
          onPointerDown
        );

        this.input.off(
          'pointerup',
          onPointerUp
        );

        this.spawnManager?.destroy();
        this.audioManager?.destroy();

        this.audioManager = undefined;
        this.muteButton = undefined;
      }
    );
  }

  private handleObjectCollision = (
    type: SpawnType
  ) => {
    if (
      !this.gameStateManager?.isPlaying ||
      !this.scoreManager
    ) {
      return;
    }

    if (type === 'candy') {
      this.scoreManager.collectCandy();
      this.audioManager?.playCandyPickup();
      this.publishScore();
      return;
    }

    const result: GameResult = {
      score: this.scoreManager.score,
      candy: this.scoreManager.candy,
      survivalSeconds:
        this.scoreManager.survivalSeconds,
    };

    if (!this.gameStateManager.gameOver(result)) {
      return;
    }

    // Stop gameplay animations
    this.tweens.killAll();

    this.audioManager?.playPumpkinExplosion();

    const finishGame = () => {
      this.audioManager?.playGameOver();
      this.game.events.emit('game-over', result);
    };

    if (!this.pumpkin) {
      finishGame();
      return;
    }

    const pumpkinX = this.pumpkin.x;
    const pumpkinY = this.pumpkin.y;

    if (type === 'bat') {
      PumpkinExplosion.play(
        this,
        this.pumpkin,
        () => {}
      );

      this.audioManager?.playBatSwarm();

      BatSwarm.play(
        this,
        pumpkinX,
        pumpkinY
      );

      this.time.delayedCall(
        1800,
        finishGame
      );
    } else if (type === 'ghost') {
      PumpkinExplosion.play(
        this,
        this.pumpkin,
        () => {}
      );

      this.audioManager?.playGhostJumpscare();

      GhostJumpscare.play(
        this,
        finishGame
      );
    } else {
      PumpkinExplosion.play(
        this,
        this.pumpkin,
        finishGame
      );
    }
  };

  private publishScore() {
    if (!this.scoreManager) {
      return;
    }

    const score = this.scoreManager.score;
    const candy = this.scoreManager.candy;

    if (
      score === this.lastPublishedScore &&
      candy === this.lastPublishedCandy
    ) {
      return;
    }

    this.lastPublishedScore = score;
    this.lastPublishedCandy = candy;

    this.game.events.emit(
      'score-updated',
      {
        score,
        candy,
      }
    );
  }

  update(
    _time: number,
    delta: number
  ) {
    if (!this.gameStateManager?.isPlaying) {
      return;
    }

    this.difficultyManager?.update(delta);

    const speedMultiplier =
      this.difficultyManager
        ?.speedMultiplier ?? 1;

    const spawnIntervalMs =
      this.difficultyManager
        ?.spawnIntervalMs ?? 1800;

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

    if (this.pumpkin) {
      this.spawnManager?.checkCollisions(
        this.pumpkin,
        this.handleObjectCollision
      );
    }

    this.publishScore();
  }
}
