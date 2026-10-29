
import Phaser from 'phaser';

export class AudioManager {
  private scene: Phaser.Scene;

  // Preserve mute state across scene restarts
  private static muted = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.scene.sound.mute = AudioManager.muted;
  }

  playCandyPickup(): void {
    this.playEffect('candy-pickup', 0.35);
  }

  playPumpkinExplosion(): void {
    this.playEffect('pumpkin-explosion', 0.45);
  }

  playBatSwarm(): void {
    this.playEffect('bat-swarm', 0.45);
  }

  playGhostJumpscare(): void {
    this.playEffect('ghost-jumpscare', 0.55);
  }

  playGameOver(): void {
    this.playEffect('game-over', 0.35);
  }

  toggleMute(): boolean {
    AudioManager.muted = !AudioManager.muted;

    this.scene.sound.mute = AudioManager.muted;

    return AudioManager.muted;
  }

  get isMuted(): boolean {
    return AudioManager.muted;
  }

  private playEffect(
    key: string,
    volume: number
  ): void {
    if (!this.scene.cache.audio.exists(key)) {
      return;
    }

    this.scene.sound.play(key, {
      volume,
    });
  }

  destroy(): void {
    // Sound effects are managed by Phaser.
    // Background music is managed by React.
  }
}
