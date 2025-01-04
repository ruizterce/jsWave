import * as Tone from "tone";
import { Sequencer } from "./sequencer";

export class Timeline {
  private _length: number;
  private sequencers: Sequencer[];
  private _events: (number | null)[][];

  constructor(length: number, sequencers: Sequencer[]) {
    this._length = length;
    this.sequencers = sequencers;
    this._events = Array.from({ length: sequencers.length }, () =>
      new Array<number | null>(length).fill(null)
    );
  }

  get length(): number {
    return this._length;
  }

  get events(): (number | null)[][] {
    return this._events;
  }

  addBlock(sequencerIndex: number, barIndex: number): void {
    const endBar = barIndex + 1;

    // Schedule events in transport
    const eventId = Tone.getTransport().schedule((time) => {
      this.sequencers[sequencerIndex].start(time, 0);
    }, barIndex + ":0:0");

    Tone.getTransport().schedule((time) => {
      this.sequencers[sequencerIndex].stop(time);
    }, endBar + ":0:0");

    // Store eventId
    this.events[sequencerIndex][barIndex] = eventId;
  }

  removeBlock(sequencerIndex: number, barIndex: number): void {
    const eventId = this.events[sequencerIndex][barIndex];
    if (eventId) {
      Tone.getTransport().clear(eventId);
    }
  }
}
