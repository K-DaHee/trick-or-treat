import Phaser from 'phaser';

type LaneIndex = 0 | 1 | 2;

export class Pumpkin extends Phaser.GameObjects.Image {
  private groundY: number;
  private readonly baseScaleX: number;
  private readonly baseScaleY: number;

  private laneIndex: LaneIndex = 1;
  private laneTween?: Phaser.Tweens.Tween;

  private readonly bounceState = {
    offsetY: 0,
    scaleX: 1,
    scaleY: 1,
  };

  private bounceTween?: Phaser.Tweens.TweenChain;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'pumpkin');

    scene.add.existing(this);

    this.setOrigin(0.5);
    this.setDisplaySize(84, 84);

    this.groundY = y;
    this.baseScaleX = this.scaleX;
    this.baseScaleY = this.scaleY;
  }

  setGroundPosition(x: number, y: number) {
    this.groundY = y;
    this.setPosition(x, y + this.bounceState.offsetY);
  }

  setLanePosition(sceneWidth: number, groundY: number) {
    this.laneTween?.stop();

    const laneWidth = sceneWidth / 3;
    const x = laneWidth * (this.laneIndex + 0.5);

    this.setGroundPosition(x, groundY);
  }

  moveLane(direction: -1 | 1, sceneWidth: number) {
    const nextLane = Phaser.Math.Clamp(
      this.laneIndex + direction,
      0,
      2
    ) as LaneIndex;

    if (nextLane === this.laneIndex) return;

    this.laneIndex = nextLane;
    this.laneTween?.stop();

    const laneWidth = sceneWidth / 3;

    this.laneTween = this.scene.tweens.add({
      targets: this,
      x: laneWidth * (nextLane + 0.5),
      duration: 160,
      ease: 'Sine.easeInOut',
    });
  }

  startBounce() {
    if (this.bounceTween) return;

    const updateBounce = () => {
      const { offsetY, scaleX, scaleY } = this.bounceState;

      this.y = this.groundY + offsetY;

      this.setScale(
        this.baseScaleX * scaleX,
        this.baseScaleY * scaleY
      );
    };

    this.bounceTween = this.scene.tweens.chain({
      targets: this.bounceState,
      loop: -1,
      tweens: [
        // Prepare to jump
        {
          offsetY: 0,
          scaleX: 1.12,
          scaleY: 0.88,
          duration: 110,
          ease: 'Sine.easeOut',
          onUpdate: updateBounce,
        },

        // Jump upward
        {
          offsetY: -28,
          scaleX: 0.9,
          scaleY: 1.12,
          duration: 170,
          ease: 'Sine.easeOut',
          onUpdate: updateBounce,
        },

        // Reach the highest point
        {
          offsetY: -40,
          scaleX: 1,
          scaleY: 1,
          duration: 130,
          ease: 'Sine.easeOut',
          onUpdate: updateBounce,
        },

        // Land and squash
        {
          offsetY: 0,
          scaleX: 1.12,
          scaleY: 0.88,
          duration: 190,
          ease: 'Sine.easeIn',
          onUpdate: updateBounce,
        },

        // Return to normal
        {
          offsetY: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 110,
          ease: 'Sine.easeOut',
          onUpdate: updateBounce,
        },
      ],
    });
  }
}