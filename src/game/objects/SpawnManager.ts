
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

  private spawnElapsed = 1_350;
  private spawnsSinceCandy = 0;
  private obstacleCount = 0;

  private lastCandyLane: LaneIndex | null = null;
  private lastObstacleLane: LaneIndex | null = null;

  private readonly spawnInterval = 1800;
  private readonly travelDuration = 8000;
  private readonly minimumLaneGap = 0.16;
  private readonly perspective = 3;

  // Rotate obstacles across all three lanes
  private readonly obstaclePatterns: readonly (
    readonly LaneIndex[]
  )[] = [
    [1, 0, 2, 1, 2, 0],
    [2, 1, 0, 2, 0, 1],
    [0, 2, 1, 0, 1, 2],
  ];

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

  update(
    delta: number,
    speedMultiplier = 1,
    spawnIntervalMs = this.spawnInterval
  ) {
    if (this.sceneWidth <= 0 || this.sceneHeight <= 0) {
      return;
    }

    const deltaMs = Math.min(delta, 100);

    this.spawnElapsed += deltaMs;

    // Move existing objects toward the player
    for (let index = this.objects.length - 1; index >= 0; index--) {
      const object = this.objects[index];

      // Apply the shared game speed multiplier
      object.progress +=
        (deltaMs * speedMultiplier) / this.travelDuration;

      // Remove objects after they leave the screen
      if (object.progress >= 1.2) {
        object.image.destroy();
        this.objects.splice(index, 1);
        continue;
      }

      this.updateObjectPosition(object);
    }

    // Spawn objects using the current difficulty interval
    if (this.spawnElapsed >= spawnIntervalMs) {
      this.spawnElapsed -= spawnIntervalMs;
      this.spawnObject(speedMultiplier);
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

  private getAvailableLanes(): LaneIndex[] {
    const lanes: LaneIndex[] = [0, 1, 2];

    // Prevent objects from spawning too close in one lane
    return lanes.filter((lane) =>
      this.objects.every(
        (object) =>
          object.lane !== lane ||
          object.progress >= this.minimumLaneGap
      )
    );
  }

  private getNextObstacleLane(): LaneIndex {
    const patternIndex =
      Math.floor(
        this.obstacleCount /
        this.obstaclePatterns[0].length
      ) % this.obstaclePatterns.length;

    const positionInPattern =
      this.obstacleCount %
      this.obstaclePatterns[patternIndex].length;

    return this.obstaclePatterns[patternIndex][
      positionInPattern
    ];
  }

  private spawnObject(speedMultiplier: number) {
    const availableLanes = this.getAvailableLanes();

    if (availableLanes.length === 0) {
      return;
    }

    // Reduce candy frequency at higher difficulty
    const candyEvery = speedMultiplier < 2.1
      ? 3
      : 5;

    const shouldSpawnCandy =
      this.spawnsSinceCandy >= candyEvery - 1;

    let type: SpawnType;
    let lane: LaneIndex;

    if (shouldSpawnCandy) {
      // Avoid repeating the previous candy lane
      const candyLanes = availableLanes.filter(
        (candidate) =>
          candidate !== this.lastCandyLane
      );

      if (candyLanes.length === 0) {
        return;
      }

      type = 'candy';

      lane = Phaser.Utils.Array.GetRandom(
        candyLanes
      );

      this.lastCandyLane = lane;
      this.spawnsSinceCandy = 0;
    } else {
      // Choose the next obstacle lane from a pattern
      const preferredLane = this.getNextObstacleLane();

      const alternateLanes = availableLanes.filter(
        (candidate) =>
          candidate !== this.lastObstacleLane
      );

      const candidates =
        alternateLanes.length > 0
          ? alternateLanes
          : availableLanes;

      lane = candidates.includes(preferredLane)
        ? preferredLane
        : Phaser.Utils.Array.GetRandom(candidates);

      // Never replace an unavailable obstacle with candy
      type = Phaser.Math.Between(0, 1) === 0
        ? 'bat'
        : 'ghost';

      this.lastObstacleLane = lane;
      this.obstacleCount += 1;
      this.spawnsSinceCandy += 1;
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
        ? 0.95
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
