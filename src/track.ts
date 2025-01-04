import * as Tone from "tone";
import { InstrumentType, Notes } from "./types";
import { Time } from "tone/build/esm/core/type/Units";

export class Track {
  private _name: string;
  private instrument: InstrumentType;
  private _notes: Notes;
  private sequence: Tone.Sequence;

  constructor(name: string, instrument: string, notes: Notes) {
    this._name = name;
    this.instrument = this.createInstrument(instrument);
    this._notes = notes;
    this.sequence = this.createSequence(notes);
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

  startSequence(time: Time, startTime: number | undefined = 0): void {
    this.sequence.start(time, startTime);
  }

  stopSequence(stopTime: number | string = 0): void {
    this.sequence.stop(stopTime);
    this.sequence.cancel(stopTime);
  }

  resetSequence() {
    this.sequence.clear();
    this.sequence.dispose();
    this.sequence = this.createSequence(this.notes);
  }

  dispose(): void {
    this.sequence.dispose();
    this.instrument?.dispose();
  }

  private createInstrument(instrumentType: string): InstrumentType {
    return instrumentType === "synth" ? new Tone.Synth().toDestination() : null;
  }

  private createSequence(notes: Notes): Tone.Sequence {
    return new Tone.Sequence(
      (time, note) => {
        this.instrument?.triggerAttackRelease(note as string, 0.1, time);
      },
      notes,
      "8n"
    );
  }

  private updateSequence(notes: Notes): void {
    this.sequence.dispose();
    this.sequence = this.createSequence(notes).start(0);
  }
}
