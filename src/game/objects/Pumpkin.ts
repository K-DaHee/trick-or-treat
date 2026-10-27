import Phaser from 'phaser';

export class Pumpkin extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'pumpkin');

    scene.add.existing(this);

    this.setOrigin(0.5);
    this.setDisplaySize(84, 84);
  }
}