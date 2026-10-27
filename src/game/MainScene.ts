import Phaser from 'phaser';
import { HalloweenEnvironment } from './objects/HalloweenEnvironment';
import { Pumpkin } from './objects/Pumpkin';

export class MainScene extends Phaser.Scene {
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
      'halloween-road',
      '/assets/backgrounds/halloween-road.png'
    );
  }

  create() {
    this.cameras.main.setBackgroundColor('#211238');

    const environment = new HalloweenEnvironment(this);
    const pumpkin = new Pumpkin(this, 0, 0);

    const updateLayout = () => {
      const { width, height } = this.scale;

      environment.resize(width, height);

      pumpkin.setLanePosition(
        width,
        height * 0.85
      );
    };

    updateLayout();
    pumpkin.startBounce();

    const moveLeft = () => {
      pumpkin.moveLane(-1, this.scale.width);
    };

    const moveRight = () => {
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
      swipeStart = {
        x: pointer.x,
        y: pointer.y,
        pointerId: pointer.id,
      };
    };

    // Move one lane when a horizontal swipe is detected
    const onPointerUp = (pointer: Phaser.Input.Pointer) => {
      if (!swipeStart || pointer.id !== swipeStart.pointerId) {
        return;
      }

      const deltaX = pointer.x - swipeStart.x;
      const deltaY = pointer.y - swipeStart.y;

      swipeStart = null;

      const threshold = Math.max(30, this.scale.width * 0.08);

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
      }
    );
  }
}