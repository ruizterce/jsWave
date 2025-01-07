import { Time } from "tone/build/esm/core/type/Units";
import { Track } from "./track";
import { Notes } from "../types";

export class Sequencer {
  private _name: string;
  private _tracks: Track[];
  private _events: boolean[];

  constructor(name: string, length: number, tracks: Track[]) {
    this._name = name;
    this._tracks = tracks;
    this._events = Array.from({ length }, () => false);
  }

  get name(): string {
    return this._name;
  }

  set name(newName: string) {
    this._name = newName;
  }

  set length(newLength: number) {
    if (newLength > this._events.length) {
      const newEvents = this._events.concat(
        Array(newLength - this._events.length).fill(false)
      );
      this._events = newEvents;
    } else {
      const newEvents = this._events.slice(0, newLength);
      this._events = newEvents;
    }
  }

  get tracks(): Track[] {
    return this._tracks;
  }

  get events(): boolean[] {
    return this._events;
  }

  set events(newEvents: boolean[]) {
    this._events = newEvents;
  }

  start(time: Time, startTime: number | undefined): void {
    this.tracks.forEach((track) => {
      track.startSequence(time, startTime);
    });
  }

  stop(stopTime: number | string = 0): void {
    this.tracks.forEach((track) => track.stopSequence(stopTime));
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
      new Track(name, instrumentType, Array(16).fill(null) as Notes, sampleUrl)
    );
  }

  removeTrack(trackIndex: number): void {
    this._tracks[trackIndex].dispose();
    this._tracks.splice(trackIndex, 1);
  }

  moveTrackUp(trackIndex: number): void {
    if (trackIndex > 0) {
      const temp = this._tracks[trackIndex];
      this._tracks[trackIndex] = this._tracks[trackIndex - 1];
      this._tracks[trackIndex - 1] = temp;
    }
  }

  moveTrackDown(trackIndex: number): void {
    if (trackIndex < this._tracks.length - 1) {
      const temp = this._tracks[trackIndex];
      this._tracks[trackIndex] = this._tracks[trackIndex + 1];
      this._tracks[trackIndex + 1] = temp;
    }
  }
}
