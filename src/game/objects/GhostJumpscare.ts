
import Phaser from 'phaser';

export class GhostJumpscare {
  static play(
    scene: Phaser.Scene,
    onComplete: () => void
  ): void {
    const { width, height } = scene.scale;

    // Darken the scene during the jumpscare
    const darkness = scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x080414,
      0
    );

    darkness.setDepth(900);

    scene.tweens.add({
      targets: darkness,
      alpha: 0.7,
      duration: 150,
      ease: 'Sine.easeOut',
    });

    // Add a short flash when the ghost appears
    const flash = scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0xffffff,
      0
    );

    flash.setDepth(1100);

    const ghost = scene.add.image(
      width / 2,
      height * 0.48,
      'halloween-ghost-scary'
    );

    ghost.setDepth(1000);
    ghost.setAlpha(0);

    // Preserve the original image aspect ratio
    const initialWidth = width * 0.18;
    const aspectRatio =
      ghost.height / ghost.width;

    ghost.setDisplaySize(
      initialWidth,
      initialWidth * aspectRatio
    );

    const initialScaleX = ghost.scaleX;
    const initialScaleY = ghost.scaleY;

    // Make the scary ghost fill most of the screen
    const targetWidth = width * 1.35;
    const scaleMultiplier =
      targetWidth / initialWidth;

    // Brief anticipation before the sudden appearance
    scene.time.delayedCall(50, () => {
      ghost.setAlpha(1);

      flash.setAlpha(0.75);

      scene.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 180,
        ease: 'Cubic.easeOut',
      });

      // A small camera shake reinforces the impact
      scene.cameras.main.shake(
        180,
        0.008
      );

      // Ghost rushes toward the camera
      scene.tweens.add({
        targets: ghost,
        scaleX: initialScaleX * scaleMultiplier,
        scaleY: initialScaleY * scaleMultiplier,
        y: height * 0.5,
        duration: 580,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          // Hold the frightening face briefly
          scene.time.delayedCall(250, () => {
            onComplete();

            scene.tweens.add({
              targets: [ghost, darkness],
              alpha: 0,
              duration: 200,
              onComplete: () => {
                ghost.destroy();
                darkness.destroy();
                flash.destroy();
              },
            });
          });
        },
      });
    });

    // Clean up if the scene restarts early
    scene.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        ghost.destroy();
        darkness.destroy();
        flash.destroy();
      }
    );
  }
}
