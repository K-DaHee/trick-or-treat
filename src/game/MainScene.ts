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

      pumpkin.setPosition(
        width / 2,
        height * 0.85
      );
    };

    updateLayout();

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
      }
    );
  }
}