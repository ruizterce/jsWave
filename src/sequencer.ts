import { Track } from "./track";
import { Notes } from "./types";

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

  setTrackNotes(trackIndex: number, newNotes: Notes): void {
    if (this._tracks[trackIndex]) {
      this._tracks[trackIndex].notes = newNotes;
    } else {
      throw new Error(`Track at index ${trackIndex} does not exist.`);
    }
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
  }
}
