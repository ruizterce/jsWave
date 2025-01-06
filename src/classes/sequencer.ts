import { Time } from "tone/build/esm/core/type/Units";
import { Track } from "./track";
import { Notes } from "../types";

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

  start(time: Time, startTime: number | undefined): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.tracks.forEach((track) => {
      track.startSequence(time, startTime);
    });
  }

  stop(stopTime: number | string = 0): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    this.tracks.forEach((track) => track.stopSequence(stopTime));
  }

  toggle(time: Time): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start(time, 0);
    }
  }

  dispose(): void {
    // Cleanup resources
    this.tracks.forEach((track) => track.dispose());
  }

  setTrackNotes(trackIndex: number, newNotes: Notes): void {
    if (this._tracks[trackIndex]) {
      this._tracks[trackIndex].notes = newNotes;
    } else {
      throw new Error(`Track at index ${trackIndex} does not exist.`);
    }
  }

  resetSequences(): void {
    this.tracks.forEach((track) => track.resetSequence());
  }

  addTrack(name: string, instrumentType: string, sampleUrl?: string): void {
    this._tracks.push(
      new Track(
        name,
        instrumentType,
        [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        sampleUrl
      )
    );
  }

  removeTrack(trackIndex: number): void {
    this._tracks[trackIndex].dispose();
    this._tracks.splice(trackIndex, 1);
  }
}
