import Phaser from 'phaser';

const ROAD_TEXTURE_KEY = 'halloween-road-runtime';

export class HalloweenEnvironment extends Phaser.GameObjects.Container {
  private readonly sky: Phaser.GameObjects.Image;
  private readonly road: Phaser.GameObjects.Image;

  private readonly roadTexture: Phaser.Textures.CanvasTexture;
  private readonly roadSource: HTMLImageElement;

  private sceneWidth = 0;
  private sceneHeight = 0;

  private scrollOffset = 0;
  private frameElapsed = 0;

  private readonly scrollSpeed = 200;
  private readonly roadTop = 0.24;
  private readonly perspective = 3;
  private readonly repeatCount = 2.7;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    // Keep the Halloween background fixed
    this.sky = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      'halloween-sky'
    ).setOrigin(0);

    // Use the original road artwork without lane markings
    this.roadSource = scene.textures
      .get('halloween-road-infinite-no-lines')
      .getSourceImage() as HTMLImageElement;

    // Create a canvas for the moving road and lane markings
    const roadTexture = scene.textures.createCanvas(
      ROAD_TEXTURE_KEY,
      2,
      2
    );

    if (!roadTexture) {
      throw new Error('Failed to create the road canvas texture');
    }

    this.roadTexture = roadTexture;

    this.road = new Phaser.GameObjects.Image(
      scene,
      0,
      0,
      ROAD_TEXTURE_KEY
    ).setOrigin(0);

    this.add([this.sky, this.road]);

    scene.add.existing(this);
    this.setDepth(-10);

    // Clean up listeners when the scene shuts down
    scene.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        scene.textures.remove(ROAD_TEXTURE_KEY);
      }
    );
  }

  resize(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      return;
    }

    this.sceneWidth = width;
    this.sceneHeight = height;

    this.sky.setDisplaySize(width, height);

    // Limit canvas resolution for mobile performance
    const renderScale = Math.min(1, 480 / width);

    const renderWidth = Math.max(
      1,
      Math.round(width * renderScale)
    );

    const renderHeight = Math.max(
      1,
      Math.round(height * renderScale)
    );

    this.roadTexture.setSize(renderWidth, renderHeight);
    this.road.setDisplaySize(width, height);

    this.renderRoad();
  }

  
  scroll(delta: number, speedMultiplier = 1) {
    if (this.sceneWidth === 0 || this.sceneHeight === 0) {
        return;
    }

    const deltaSeconds = Math.min(delta, 100) / 1000;

    // Move the road and lane markings together
    this.scrollOffset = (
        this.scrollOffset +
        this.scrollSpeed * deltaSeconds * speedMultiplier
    ) % this.roadSource.height;

    // Render at approximately 30 FPS
    this.frameElapsed += delta;

    const frameInterval = 1000 / 30;

    if (this.frameElapsed < frameInterval) {
        return;
    }

    this.frameElapsed %= frameInterval;

    this.renderRoad();
  }

  private renderRoad() {
    const texture = this.roadTexture;
    const context = texture.getContext();

    const width = texture.width;
    const height = texture.height;

    const sourceWidth = this.roadSource.width;
    const sourceHeight = this.roadSource.height;

    const roadTopY = height * this.roadTop;
    const roadHeight = height - roadTopY;

    const dashPeriod = sourceHeight / 6;
    const dashLength = dashPeriod * 0.6;

    context.clearRect(0, 0, width, height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    // Render the road and lane markings using shared coordinates
    for (let y = Math.floor(roadTopY); y < height; y++) {
      const depth = Phaser.Math.Clamp(
        (y - roadTopY) / roadHeight,
        0,
        1
      );

      const perspectiveProgress =
        Math.log1p(this.perspective * depth) /
        Math.log1p(this.perspective);

      const textureDistance =
        perspectiveProgress *
        this.repeatCount *
        sourceHeight;

      const sourceY = (
        (
          textureDistance - this.scrollOffset
        ) % sourceHeight +
        sourceHeight
      ) % sourceHeight;

      const roadWidth = width * (
        0.3 + 1.2 * depth
      );

      const roadX = (width - roadWidth) / 2;

      const fadeIn = Phaser.Math.Clamp(
        (y - roadTopY) / (height * 0.025),
        0,
        1
      );

      context.globalAlpha = fadeIn;

      // Draw the moving cobblestone road
      context.drawImage(
        this.roadSource,
        0,
        Math.min(sourceHeight - 2, sourceY),
        sourceWidth,
        2,
        roadX,
        y,
        roadWidth,
        1.8
      );

      // Draw lane markings with the same scrolling position
      if (sourceY % dashPeriod < dashLength) {
        context.fillStyle = '#d9a3d3';

        for (const side of [-1, 1] as const) {
          // Preserve the previously adjusted perspective
          const x = width * (
            0.5 + side * (0.03 + 0.18 * depth)
          );

          const halfWidth = width * (
            0.004 + 0.018 * depth
          );

          context.fillRect(
            x - halfWidth,
            y,
            halfWidth * 2,
            1.8
          );
        }
      }
    }

    context.globalAlpha = 1;

    texture.refresh();
  }
}