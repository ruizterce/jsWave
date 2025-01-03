import * as Tone from "tone";

type InstrumentType = Tone.Synth | null;
type Note = string | string[] | null;
type SequenceNotes = Note[];

export class Track {
  name: string;
  instrument: InstrumentType;
  sequenceNotes: SequenceNotes;
  sequence: Tone.Sequence;

  constructor(name: string, instrument: string, sequenceNotes: SequenceNotes) {
    this.name = name;
    this.instrument =
      instrument === "synth" ? new Tone.Synth().toDestination() : null;
    this.sequenceNotes = sequenceNotes;
    this.sequence = new Tone.Sequence(
      (time, note) => {
        if (this.instrument) {
          this.instrument.triggerAttackRelease(note as string, 0.1, time);
        }
      },
      sequenceNotes,
      "8n"
    );
  }

  startSequence(startTime: number | string = 0): void {
    this.sequence.start(startTime);
  }

  stopSequence(): void {
    this.sequence.stop();
  }
}
