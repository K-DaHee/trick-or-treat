
import Phaser from 'phaser';

export class BatSwarm {
  static play(
    scene: Phaser.Scene,
    x: number,
    y: number
  ) {
    const batCount = 15;
    const width = scene.scale.width;
    const height = scene.scale.height;

    for (let index = 0; index < batCount; index++) {
      const delay = Phaser.Math.Between(0, 120);
      const duration = Phaser.Math.Between(1600, 2000);

      const startX = x + Phaser.Math.Between(-45, 45);
      const startY = y + Phaser.Math.Between(-50, 20);

      const bat = scene.add.image(
        startX,
        startY,
        'halloween-bat'
      );

      // Start large enough to be visible immediately
      bat.setDisplaySize(30, 30);
      bat.setDepth(40);
      bat.setAlpha(1);
      bat.setAngle(Phaser.Math.Between(-15, 15));

      const direction = index % 2 === 0 ? -1 : 1;

      const targetX =
        width * 0.5 +
        direction *
          width *
          Phaser.Math.FloatBetween(0.15, 0.55);

      const targetY =
        height *
        Phaser.Math.FloatBetween(0.15, 0.8);

      const targetSize = Phaser.Math.Between(170, 260);

      // Preserve the texture's aspect ratio
      const scaleFactor = targetSize / 30;

      scene.tweens.add({
        targets: bat,
        x: targetX,
        y: targetY,
        scaleX: bat.scaleX * scaleFactor,
        scaleY: bat.scaleY * scaleFactor,
        angle: Phaser.Math.Between(-25, 25),
        delay,
        duration,
        ease: 'Sine.easeOut',
        onComplete: () => {
          scene.tweens.add({
            targets: bat,
            alpha: 0,
            duration: 250,
            onComplete: () => bat.destroy(),
          });
        },
      });
    }
  }
}
