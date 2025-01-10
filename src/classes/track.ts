import * as Tone from "tone";
import { Time } from "tone/build/esm/core/type/Units";
import { Notes } from "../types";

type InstrumentType =
  | Tone.Synth
  | Tone.Sampler
  | Tone.AMSynth
  | Tone.DuoSynth
  | Tone.FMSynth
  | Tone.MembraneSynth
  | Tone.MetalSynth
  | Tone.MonoSynth
  | Tone.NoiseSynth
  | Tone.PluckSynth
  | Tone.PolySynth;

export class Track {
  private _name: string;
  instrument: InstrumentType;
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
    this.instrument = this.createInstrument(instrumentType);
    this._notes = notes;
    this._noteDuration = "16n";
    this._sequence = this.createSequence(notes);
  }

  get name(): string {
    return this._name;
  }

  set name(newName: string) {
    this._name = newName;
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
    return this.instrument.volume.value;
  }

  set volume(newVolume: number) {
    this.instrument.volume.value = newVolume;
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
    this.instrument?.dispose();
  }

  private createInstrument(instrumentType: string): InstrumentType {
    switch (instrumentType) {
      case "synth":
        return new Tone.Synth().toDestination();
      case "AMSynth":
        return new Tone.AMSynth().toDestination();
      case "FMSynth": {
        const inst = new Tone.FMSynth().toDestination();
        inst.oscillator.sourceType = "fm";
        return inst;
      }
      case "DuoSynth":
        return new Tone.DuoSynth().toDestination();
      case "MembraneSynth":
        return new Tone.MembraneSynth().toDestination();
      case "MetalSynth":
        return new Tone.MetalSynth().toDestination();
      case "MonoSynth":
        return new Tone.MonoSynth().toDestination();
      case "NoiseSynth":
        return new Tone.NoiseSynth().toDestination();
      case "PluckSynth":
        return new Tone.PluckSynth().toDestination();
      case "PolySynth":
        return new Tone.PolySynth().toDestination();
      case "sampler":
        if (this._sampleUrl) {
          return new Tone.Sampler({
            urls: {
              C5: this._sampleUrl,
            },
            baseUrl: "/assets/samples/",
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
        this.instrument?.triggerAttackRelease(
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
}
