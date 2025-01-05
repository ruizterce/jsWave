import { Sequencer } from "./sequencer";

export class Timeline {
  private _length: number;
  private _sequencers: Sequencer[];
  private _events: boolean[][];

  constructor(length: number, sequencers: Sequencer[]) {
    this._length = length;
    this._sequencers = sequencers;
    this._events = Array.from({ length: sequencers.length }, () =>
      Array.from({ length }, () => false)
    );
  }

  get length(): number {
    return this._length;
  }

  get sequencers(): Sequencer[] {
    return this._sequencers;
  }

  get events(): boolean[][] {
    return this._events;
  }

  set events(newEvents) {
    this._events = newEvents;
  }

  addBlock(sequencerIndex: number, barIndex: number): void {
    console.log("Adding block " + sequencerIndex + " " + barIndex);

    const sequencer = this._sequencers[sequencerIndex];

    // Check for future active blocks in the same sequencer
    const futureActiveBlocks = this._events[sequencerIndex]
      .map((isActive, index) => (isActive ? index : -1))
      .filter((index) => index >= barIndex + 1);

    if (futureActiveBlocks.length > 0) {
      // Reset the sequencer if there are active blocks in the future
      sequencer.resetSequences();

      // Collect all active blocks (including the new one)
      const activeBars = [...futureActiveBlocks, barIndex].sort(
        (a, b) => a - b
      );
      console.log(activeBars);
      // Reschedule all active blocks
      for (const activeBar of activeBars) {
        const start = `${activeBar}:0:0`;
        const end = `${activeBar + 1}:0:0`;

        sequencer.start(start, 0);
        sequencer.stop(end);

        this._events[sequencerIndex][activeBar] = true;
      }
    } else {
      // No future active blocks, simply schedule the new block
      const start = `${barIndex}:0:0`;
      const end = `${barIndex + 1}:0:0`;

      sequencer.start(start, 0);
      sequencer.stop(end);

      this._events[sequencerIndex][barIndex] = true;
    }
    console.log(this._events);
  }

  removeBlock(sequencerIndex: number, barIndex: number): void {
    const sequencer = this._sequencers[sequencerIndex];

    if (sequencer) {
      // Check for other active blocks in the same sequencer
      const otherActiveBars = this._events[sequencerIndex]
        .map((isActive, index) => (isActive ? index : -1))
        .filter((index) => index !== -1 && index !== barIndex);

      // Reset all scheduled sequences
      sequencer.resetSequences();

      // Reschedule all other active blocks
      for (const activeBar of otherActiveBars) {
        const start = `${activeBar}:0:0`;
        const end = `${activeBar + 1}:0:0`;

        sequencer.start(start, 0);
        sequencer.stop(end);
      }
      this._events[sequencerIndex][barIndex] = false;
    }
    console.log(this._events);
  }

  rescheduleSequencer(sequencerIndex: number): void {
    const sequencer = this._sequencers[sequencerIndex];
    this._events[sequencerIndex].forEach((bar, index) => {
      if (bar) {
        const start = `${index}:0:0`;
        const end = `${index + 1}:0:0`;

        sequencer.start(start, 0);
        sequencer.stop(end);
      }
    });
  }
}
