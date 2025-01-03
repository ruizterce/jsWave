import * as Tone from "tone";
import { Track } from "./track";

export class Sequencer {
  private _name: string;
  private _tracks: Track[];
  private isPlaying: boolean;

  constructor(name: string, tracks: Track[]) {
    this._name = name;
    this.isPlaying = false;
    this._tracks = tracks;
  }

  get name(): string {
    return this._name;
  }

  get tracks(): Track[] {
    return this._tracks;
  }

  start(startTime: number | string = 0): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.tracks.forEach((track) => track.startSequence(startTime));
  }

  stop(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    this.tracks.forEach((track) => track.stopSequence());
  }

  toggle(): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  dispose(): void {
    // Cleanup resources
    this.tracks.forEach((track) => track.dispose());
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
  }
}
