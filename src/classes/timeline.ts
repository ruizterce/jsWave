import { Sequencer } from "./sequencer";
import { Track } from "./track";
import { Notes } from "../types";

export class Timeline {
  private _length: number;
  private _sequencers: Sequencer[];

  constructor(length: number, sequencers: Sequencer[]) {
    this._length = length;
    this._sequencers = sequencers;
  }

  get length(): number {
    return this._length;
  }

  get sequencers(): Sequencer[] {
    return this._sequencers;
  }

  addBlock(sequencerIndex: number, barIndex: number): void {
    console.log("Adding block " + sequencerIndex + " " + barIndex);

    const sequencer = this._sequencers[sequencerIndex];
    sequencer.events[barIndex] = true;

    const futureActiveBlocks = sequencer.events
      .map((isActive, index) => (isActive ? index : -1))
      .filter((index) => index >= barIndex + 1);

    if (futureActiveBlocks.length > 0) {
      // Check for other active blocks in the same sequencer
      const activeBars = sequencer.events
        .map((isActive, index) => (isActive ? index : -1))
        .filter((index) => index !== -1);

      // Reset all scheduled sequences
      sequencer.resetSequences();

      // Reschedule all active blocks
      for (const activeBar of activeBars) {
        const start = `${activeBar}:0:0`;
        const end = `${activeBar + 1}:0:0`;

        sequencer.start(start, 0);
        sequencer.stop(end);
      }
    } else {
      // No future active blocks, simply schedule the new block
      const start = `${barIndex}:0:0`;
      const end = `${barIndex + 1}:0:0`;

      sequencer.start(start, 0);
      sequencer.stop(end);

      sequencer.events[barIndex] = true;
    }
    console.log(sequencer.events);
  }

  removeBlock(sequencerIndex: number, barIndex: number): void {
    const sequencer = this._sequencers[sequencerIndex];

    if (sequencer) {
      const otherActiveBars = sequencer.events
        .map((isActive, index) => (isActive ? index : -1))
        .filter((index) => index !== -1 && index !== barIndex);

      sequencer.resetSequences();

      for (const activeBar of otherActiveBars) {
        const start = `${activeBar}:0:0`;
        const end = `${activeBar + 1}:0:0`;

        sequencer.start(start, 0);
        sequencer.stop(end);
      }
      sequencer.events[barIndex] = false;
    }
    console.log(sequencer.events);
  }

  rescheduleSequencer(sequencerIndex: number): void {
    const sequencer = this._sequencers[sequencerIndex];
    sequencer.events.forEach((bar, index) => {
      if (bar) {
        const start = `${index}:0:0`;
        const end = `${index + 1}:0:0`;

        sequencer.start(start, 0);
        sequencer.stop(end);
      }
    });
  }

  addSequencer(name: string): void {
    this._sequencers.push(
      new Sequencer(name, this._length, [
        new Track("synth1", "synth", Array(16).fill(null) as Notes),
      ])
    );
    console.log("Sequencer added.");
  }

  removeSequencer(sequencerIndex: number): void {
    this._sequencers[sequencerIndex].dispose();
    this._sequencers.splice(sequencerIndex, 1);
  }

  moveSequencerUp(sequencerIndex: number): void {
    if (sequencerIndex > 0) {
      const temp = this._sequencers[sequencerIndex];
      this._sequencers[sequencerIndex] = this._sequencers[sequencerIndex - 1];
      this._sequencers[sequencerIndex - 1] = temp;
    }
  }

  moveSequencerDown(sequencerIndex: number): void {
    if (sequencerIndex < this.sequencers.length - 1) {
      const temp = this._sequencers[sequencerIndex];
      this._sequencers[sequencerIndex] = this._sequencers[sequencerIndex + 1];
      this._sequencers[sequencerIndex + 1] = temp;
    }
  }
}
