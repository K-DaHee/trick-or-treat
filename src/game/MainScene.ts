import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.svg(
      'pumpkin',
      '/assets/sprites/pumpkin-placeholder.svg'
    );
  }

  create() {
    this.cameras.main.setBackgroundColor('#211238');

    const title = this.add
      .text(0, 0, 'Phaser is ready!', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const pumpkin = this.add.image(0, 0, 'pumpkin');

    const updateLayout = () => {
      const { width, height } = this.scale;

      title.setPosition(
        width / 2,
        height * 0.4
      );

      pumpkin.setPosition(
        width / 2,
        height * 0.55
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