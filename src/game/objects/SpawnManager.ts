import Phaser from 'phaser';

type LaneIndex = 0 | 1 | 2;
export type SpawnType = 'candy' | 'bat' | 'ghost';

interface SpawnedObject {
  image: Phaser.GameObjects.Image;
  lane: LaneIndex;
  type: SpawnType;
  progress: number;
}

export class SpawnManager {
  private readonly scene: Phaser.Scene;
  private readonly objects: SpawnedObject[] = [];

  private sceneWidth = 0;
  private sceneHeight = 0;

  private spawnElapsed = 0;

  private readonly spawnInterval = 1800;
  private readonly travelDuration = 8000;
  private readonly minimumLaneGap = 0.28;
  private readonly perspective = 3;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.resize(
      scene.scale.width,
      scene.scale.height
    );
  }

  resize(width: number, height: number) {
    this.sceneWidth = width;
    this.sceneHeight = height;

    for (const object of this.objects) {
      this.updateObjectPosition(object);
    }
  }

  update(delta: number) {
    if (this.sceneWidth <= 0 || this.sceneHeight <= 0) {
      return;
    }

    const deltaMs = Math.min(delta, 100);

    this.spawnElapsed += deltaMs;

    // Move existing objects toward the player
    for (let index = this.objects.length - 1; index >= 0; index--) {
      const object = this.objects[index];

      object.progress += deltaMs / this.travelDuration;

      // Remove objects when they reach the player's position
      if (object.progress >= 1.2) {
        object.image.destroy();
        this.objects.splice(index, 1);
        continue;
      }

      this.updateObjectPosition(object);
    }

    // Spawn new objects at regular intervals
    if (this.spawnElapsed >= this.spawnInterval) {
      this.spawnElapsed -= this.spawnInterval;
      this.spawnObject();
    }
  }

  checkCollisions(
    pumpkin: Phaser.GameObjects.Image,
    onCollision: (type: SpawnType) => void
  ) {
    for (let index = this.objects.length - 1; index >= 0; index--) {
        const object = this.objects[index];

        // Use smaller hitboxes to avoid false collisions
        const hitboxX =
        pumpkin.displayWidth * 0.3 +
        object.image.displayWidth * 0.22;

        const hitboxY =
        pumpkin.displayHeight * 0.3 +
        object.image.displayHeight * 0.22;

        const distanceX = Math.abs(
        pumpkin.x - object.image.x
        );

        const distanceY = Math.abs(
        pumpkin.y - object.image.y
        );

        if (distanceX > hitboxX || distanceY > hitboxY) {
        continue;
        }

        // Remove the object after a collision
        object.image.destroy();
        this.objects.splice(index, 1);

        onCollision(object.type);
    }
  }

  private spawnObject() {
    const lanes: LaneIndex[] = [0, 1, 2];

    // Avoid spawning objects too close in the same lane
    const availableLanes = lanes.filter((lane) =>
      this.objects.every(
        (object) =>
          object.lane !== lane ||
          object.progress >= this.minimumLaneGap
      )
    );

    if (availableLanes.length === 0) {
      return;
    }

    const lane = Phaser.Utils.Array.GetRandom(
      availableLanes
    );

    const random = Math.random();

    let type: SpawnType;

    // Candy appears more frequently than obstacles
    if (random < 0.5) {
      type = 'candy';
    } else if (random < 0.75) {
      type = 'bat';
    } else {
      type = 'ghost';
    }

    const image = this.scene.add.image(
      0,
      0,
      `halloween-${type}`
    );

    // Keep approaching objects behind the pumpkin
    image.setDepth(-1);

    const object: SpawnedObject = {
      image,
      lane,
      type,
      progress: 0,
    };

    this.objects.push(object);

    this.updateObjectPosition(object);
  }

  private updateObjectPosition(object: SpawnedObject) {
    const { sceneWidth: width, sceneHeight: height } = this;

    // Accelerate visually as the object approaches
    const movementProgress =
      (
        Math.pow(1 + this.perspective, object.progress) - 1
      ) / this.perspective;

    const y = height * (
      0.24 + movementProgress * 0.61
    );

    // Match the road's perspective and pumpkin lanes
    const roadDepth = Phaser.Math.Clamp(
      (y - height * 0.24) / (height * 0.76),
      0,
      1
    );

    const laneOffset = 0.06 + 0.34 * roadDepth;

    const x = width * (
      0.5 + (object.lane - 1) * laneOffset
    );

    // Scale objects relative to the lane width
    const laneWidth = width / 3;
    const baseSize = Math.min(laneWidth * 0.92, 140);

    const sizeProgress =
      0.25 + 0.75 * movementProgress;

    const typeScale =
      object.type === 'candy'
        ? 1.0
        : object.type === 'bat'
          ? 1.3
          : 1.0;

    const size = baseSize * sizeProgress * typeScale;

    object.image.setPosition(x, y);
    object.image.setDisplaySize(size, size);
  }

  destroy() {
    for (const object of this.objects) {
      object.image.destroy();
    }

    this.objects.length = 0;
  }
}