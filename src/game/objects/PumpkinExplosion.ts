
import Phaser from 'phaser';

export class PumpkinExplosion {
  static play(
    scene: Phaser.Scene,
    pumpkin: Phaser.GameObjects.Image,
    onComplete: () => void
  ) {
    const centerX = pumpkin.x;
    const centerY = pumpkin.y;

    const width = pumpkin.displayWidth;
    const height = pumpkin.displayHeight;

    const textureWidth = pumpkin.frame.width;
    const textureHeight = pumpkin.frame.height;

    const rows = 3;
    const columns = 3;
    const duration = 1000;

    let remainingPieces = rows * columns;

    // Hide the original pumpkin
    pumpkin.setVisible(false);

    // Split the pumpkin texture into fragments
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const cropX = Math.floor(
          (column * textureWidth) / columns
        );

        const cropY = Math.floor(
          (row * textureHeight) / rows
        );

        const cropRight = Math.floor(
          ((column + 1) * textureWidth) / columns
        );

        const cropBottom = Math.floor(
          ((row + 1) * textureHeight) / rows
        );

        const fragment = scene.add.image(
          centerX,
          centerY,
          pumpkin.texture.key,
          pumpkin.frame.name
        );

        fragment.setOrigin(
          pumpkin.originX,
          pumpkin.originY
        );

        fragment.setDisplaySize(width, height);

        fragment.setCrop(
          cropX,
          cropY,
          cropRight - cropX,
          cropBottom - cropY
        );

        fragment.setDepth(pumpkin.depth + 1);

        // Calculate the direction of each fragment
        const directionX =
          column - 1 + Phaser.Math.FloatBetween(-0.3, 0.3);

        const directionY =
          row - 1 + Phaser.Math.FloatBetween(-0.3, 0.3);

        const angle = Math.atan2(
          directionY,
          directionX
        );

        // Scatter fragments across a larger area
        const distance = Phaser.Math.Between(
          Math.round(width * 1.5),
          Math.round(width * 3.2)
        );

        const targetX =
          centerX + Math.cos(angle) * distance;

        const targetY =
          centerY + Math.sin(angle) * distance - 30;

        scene.tweens.add({
          targets: fragment,
          x: targetX,
          y: targetY,
          angle: Phaser.Math.Between(-180, 180),
          alpha: 0,
          scaleX: fragment.scaleX * 0.5,
          scaleY: fragment.scaleY * 0.5,
          duration,
          ease: 'Cubic.easeOut',

          onComplete: () => {
            fragment.destroy();

            remainingPieces--;

            // Finish after all fragments disappear
            if (remainingPieces === 0) {
              onComplete();
            }
          },
        });
      }
    }

    // Create a larger orange explosion flash
    const flash = scene.add.circle(
      centerX,
      centerY,
      width * 0.55,
      0xffb347,
      0.7
    );

    flash.setDepth(pumpkin.depth + 2);
    flash.setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
      targets: flash,
      scale: 3.5,
      alpha: 0,
      duration: 300,
      ease: 'Cubic.easeOut',
      onComplete: () => flash.destroy(),
    });

    // Create glowing orange particles
    const particleColors = [
      0xff9635,
      0xffb347,
      0xffd166,
      0xff6b35,
      0xffe8a0,
    ];

    for (let i = 0; i < 28; i++) {
      const color = Phaser.Utils.Array.GetRandom(
        particleColors
      );

      const particle = scene.add.circle(
        centerX,
        centerY,
        Phaser.Math.Between(3, 7),
        color,
        1
      );

      particle.setDepth(pumpkin.depth + 3);

      const angle = Phaser.Math.FloatBetween(
        0,
        Math.PI * 2
      );

      const distance = Phaser.Math.Between(
        Math.round(width),
        Math.round(width * 3.5)
      );

      scene.tweens.add({
        targets: particle,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0.15,
        duration: Phaser.Math.Between(450, 800),
        ease: 'Cubic.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }
}
