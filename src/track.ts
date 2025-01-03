import * as Tone from "tone";

type InstrumentType = Tone.Synth | null;
type Note = string | string[] | null;
type Notes = Note[];

export class Track {
  private _name: string;
  private instrument: InstrumentType;
  private _notes: Notes;
  private sequence: Tone.Sequence;

  constructor(name: string, instrument: string, notes: Notes) {
    this._name = name;
    this.instrument =
      instrument === "synth" ? new Tone.Synth().toDestination() : null;
    this._notes = notes;
    this.sequence = new Tone.Sequence(
      (time, note) => {
        if (this.instrument) {
          this.instrument.triggerAttackRelease(note as string, 0.1, time);
        }
      },
      notes,
      "8n"
    );
    console.log(`Track ${name} created`);
  }

  get name(): string {
    return this._name;
  }

  get notes(): Notes {
    return this._notes;
  }

  set notes(newNotes) {
    this._notes = newNotes;
  }

  startSequence(startTime: number | string = 0): void {
    this.sequence.start(startTime);
  }

  stopSequence(): void {
    this.sequence.stop(0);
    this.sequence.cancel();
  }

  dispose(): void {
    this.sequence.dispose();
    if (this.instrument) {
      this.instrument.dispose();
    }
  }
}
