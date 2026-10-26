import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#211238');

    this.add
      .text(180, 320, 'Phaser is ready! 🎃', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);
  }
}