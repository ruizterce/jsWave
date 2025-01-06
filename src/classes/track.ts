import * as Tone from "tone";
import { InstrumentType, Notes } from "../types";
import { Time } from "tone/build/esm/core/type/Units";

export class Track {
  private _name: string;
  private _instrument: InstrumentType;
  private _notes: Notes;
  private _noteDuration: number | string;
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
    this._noteDuration = "16n";
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

  get noteDuration(): string | number {
    return this._noteDuration;
  }

  set noteDuration(newNoteDuration: string | number) {
    this._noteDuration = newNoteDuration;
    this.updateSequence(this._notes);
  }

  get sequence(): Tone.Sequence {
    return this._sequence;
  }

  get volume(): number {
    return this._instrument.volume.value;
  }

  set volume(newVolume: number) {
    this._instrument.volume.value = newVolume;
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
          throw Error("Undefined Instrument");
        }
      default:
        throw Error("Undefined Instrument");
    }
  }

  private createSequence(notes: Notes): Tone.Sequence {
    return new Tone.Sequence(
      (time, note) => {
        this._instrument?.triggerAttackRelease(
          note as string,
          this._noteDuration,
          time
        );
      },
      notes,
      "16n"
    );
  }

  private updateSequence(notes: Notes): void {
    this._sequence.dispose();
    this._sequence = this.createSequence(notes);
  }

  private setVolume(volume: number): void {
    if (this._instrument) {
      this._instrument.volume.value = volume;
    }
  }
}
