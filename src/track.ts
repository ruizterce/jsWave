import * as Tone from "tone";
import { InstrumentType, Notes } from "./types";
import { Time } from "tone/build/esm/core/type/Units";

export class Track {
  private _name: string;
  private _instrument: InstrumentType;
  private _notes: Notes;
  private _sequence: Tone.Sequence;
  private _sampleUrl: string | undefined;

  constructor(
    name: string,
    instrumentType: string,
    notes: Notes,
    sampleUrl?: string
  ) {
    this._name = name;
    this._sampleUrl = sampleUrl;
    this._instrument = this.createInstrument(instrumentType);
    this._notes = notes;
    this._sequence = this.createSequence(notes);
    console.log(`Track "${name}" created`);
  }

  get name(): string {
    return this._name;
  }

  get notes(): Notes {
    return this._notes;
  }

  set notes(newNotes: Notes) {
    this._notes = newNotes;
    this.updateSequence(newNotes);
  }

  get sequence(): Tone.Sequence {
    return this._sequence;
  }

  startSequence(time: Time, startTime: number | undefined = 0): void {
    this._sequence.start(time, startTime);
  }

  stopSequence(stopTime: number | string = 0): void {
    this._sequence.stop(stopTime);
    this._sequence.cancel(stopTime);
  }

  resetSequence() {
    this._sequence.clear();
    this._sequence.dispose();
    this._sequence = this.createSequence(this.notes);
  }

  dispose(): void {
    this._sequence?.dispose();
    this._instrument?.dispose();
  }

  private createInstrument(instrumentType: string): InstrumentType {
    switch (instrumentType) {
      case "synth":
        return new Tone.Synth().toDestination();
      case "sampler":
        console.log(this._sampleUrl);
        if (this._sampleUrl) {
          console.log(this._sampleUrl);
          return new Tone.Sampler({
            urls: {
              C5: this._sampleUrl,
            },
            baseUrl: "src/assets/samples/",
          }).toDestination();
        } else {
          return null;
        }
      default:
        return null;
    }
  }

  private createSequence(notes: Notes): Tone.Sequence {
    return new Tone.Sequence(
      (time, note) => {
        this._instrument?.triggerAttackRelease(note as string, 0.1, time);
      },
      notes,
      "16n"
    );
  }

  private updateSequence(notes: Notes): void {
    this._sequence.dispose();
    this._sequence = this.createSequence(notes);
  }
}
