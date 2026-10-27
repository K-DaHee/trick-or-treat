import Phaser from 'phaser';
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
  }

  create() {
    this.cameras.main.setBackgroundColor('#211238');

    const pumpkin = new Pumpkin(this, 0, 0);

    const updateLayout = () => {
      const { width, height } = this.scale;

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

    // Handle keyboard movement
    this.input.keyboard?.on('keydown-LEFT', moveLeft);
    this.input.keyboard?.on('keydown-RIGHT', moveRight);

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
      }
    );
  }
}