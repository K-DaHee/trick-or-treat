import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.svg('pumpkin', '/assets/sprites/pumpkin-placeholder.svg');
  }

  create() {
    this.cameras.main.setBackgroundColor('#211238');

    this.add
      .text(180, 240, 'Phaser is ready!', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add.image(180, 340, 'pumpkin');
  }
}