import * as Tone from "tone";

export interface Track {
  type: "synth" | "sampler";
  options?: {
    note?: string;
    sample?: string;
  };
  synth?: Tone.Synth;
  sampler?: Tone.Sampler;
  noteArray?: boolean[];
}
