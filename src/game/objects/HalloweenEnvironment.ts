import Phaser from 'phaser';

export class HalloweenEnvironment extends Phaser.GameObjects.Container {
  private readonly sky: Phaser.GameObjects.Image;
  private readonly road: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    // Halloween background
    this.sky = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      'halloween-sky'
    ).setOrigin(0);

    // Three-lane road
    this.road = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      'halloween-road'
    ).setOrigin(0);

    this.add([this.sky, this.road]);

    scene.add.existing(this);
    this.setDepth(-10);
  }

  resize(width: number, height: number) {
    this.sky.setDisplaySize(width, height);
    this.road.setDisplaySize(width, height);
  }
}