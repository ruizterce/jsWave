import * as Tone from "tone";

export type InstrumentType = Tone.Synth | Tone.Sampler;
export type Note = string | string[] | null;
export type Notes = Note[];
