import { Sequencer } from "../classes/sequencer";
import { Track } from "../classes/track";
import { Timeline } from "../classes/timeline";
import { AMSynth, FMSynth } from "tone";

export const initDemoSong = () => {
  // Initialize demo song
  const sequencers = [
    new Sequencer("Synth-1", 8, [
      new Track("AMSynth-1", "AMSynth", [
        "F#5",
        null,
        null,
        null,
        null,
        null,
        "F#5",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      new Track("AMSynth-2", "AMSynth", [
        "A5",
        null,
        null,
        null,
        null,
        null,
        "B5",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      new Track("AMSynth-3", "AMSynth", [
        "C#5",
        null,
        null,
        null,
        null,
        null,
        "D#5",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      new Track("AMSynth-4", "AMSynth", [
        "F#5",
        null,
        null,
        null,
        null,
        null,
        "G#5",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
    ]),

    new Sequencer("Synth-2", 8, [
      new Track("AMSynth-5", "AMSynth", [
        "F#5",
        null,
        null,
        null,
        null,
        null,
        "F#5",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      new Track("AMSynth-6", "AMSynth", [
        "C#5",
        null,
        null,
        null,
        null,
        null,
        "B5",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      new Track("AMSynth-7", "AMSynth", [
        "E5",
        null,
        null,
        null,
        null,
        null,
        "D#5",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      new Track("AMSynth-8", "AMSynth", [
        "A5",
        null,
        null,
        null,
        null,
        null,
        "G#5",
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
    ]),
    new Sequencer("Bass-1", 8, [
      new Track("FMSynth-2", "FMSynth", [
        "F#2",
        null,
        "C#2",
        null,
        "E2",
        null,
        "F#2",
        null,
        "E2",
        null,
        "C#2",
        null,
        "B1",
        null,
        "C#2",
        null,
      ]),
    ]),

    new Sequencer("Drums-1", 8, [
      new Track(
        "Hihat",
        "sampler",
        [
          "C5",
          null,
          "C5",
          null,
          "C5",
          null,
          "C5",
          null,
          "C5",
          null,
          "C5",
          null,
          "C5",
          null,
          "C5",
          null,
        ],
        "TR-808/Hihat.mp3"
      ),
      new Track(
        "Kick",
        "sampler",
        [
          "C5",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          "C5",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        "TR-808/Kick-Long.mp3"
      ),
      new Track(
        "Snare",
        "sampler",
        [
          null,
          null,
          null,
          null,
          "C5",
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          "C5",
          null,
          null,
          null,
        ],
        "TR-808/Snare-Mid.mp3"
      ),
    ]),

    new Sequencer("Perc-1", 8, [
      new Track(
        "Maracas",
        "sampler",
        [
          null,
          "E5",
          "C5",
          "E5",
          "C5",
          null,
          null,
          "C5",
          "E5",
          "C5",
          null,
          null,

          "C5",
          null,
          null,
          null,
        ],
        "TR-808/Maracas.mp3"
      ),
      new Track(
        "Snare Bright",
        "sampler",
        [
          "C5",
          null,
          null,
          "C5",
          null,
          null,
          "C5",
          null,
          null,
          null,
          "C5",
          null,

          "C5",
          null,
          null,
          null,
        ],
        "TR-808/Snare-Bright.mp3"
      ),
      new Track(
        "Open Hat Short",
        "sampler",
        [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          "C5",
          null,
        ],
        "TR-808/Open-Hat-Short.mp3"
      ),
    ]),
  ];

  sequencers[0].tracks.forEach((track) => {
    if ("oscillator" in track.instrument) {
      (track.instrument as AMSynth).oscillator.sourceType = "fat";
      (track.instrument as AMSynth).oscillator.baseType = "sawtooth";
    }
    (track.instrument as AMSynth).volume.value = -10;
    (track.instrument as AMSynth).envelope.attack = 0.1;
    (track.instrument as AMSynth).envelope.release = 1.2;
  });

  sequencers[1].tracks.forEach((track) => {
    if ("oscillator" in track.instrument) {
      (track.instrument as AMSynth).oscillator.sourceType = "fat";
      (track.instrument as AMSynth).oscillator.baseType = "sawtooth";
    }
    (track.instrument as AMSynth).volume.value = -10;
    (track.instrument as AMSynth).envelope.attack = 0.1;
    (track.instrument as AMSynth).envelope.release = 1.2;
  });

  (
    sequencers[2].tracks[0].instrument as FMSynth
  ).modulationEnvelope.attack = 0.3;
  (
    sequencers[2].tracks[0].instrument as FMSynth
  ).modulationEnvelope.release = 0.3;
  (sequencers[2].tracks[0].instrument as FMSynth).volume.value = -5;

  sequencers[3].tracks[0].noteDuration = "8n";
  sequencers[3].tracks[0].instrument.volume.value = -5;
  sequencers[3].tracks[1].noteDuration = "8n";
  sequencers[3].tracks[0].instrument.volume.value = -8;
  sequencers[3].tracks[2].noteDuration = "8n";

  // Initialize timeline
  const TIMELINE_LENGHT = 8;
  const timeline = new Timeline(TIMELINE_LENGHT, sequencers);

  timeline.addBlock(2, 0);
  timeline.addBlock(2, 1);
  timeline.addBlock(2, 2);
  timeline.addBlock(2, 3);
  timeline.addBlock(2, 4);
  timeline.addBlock(2, 5);
  timeline.addBlock(2, 6);
  timeline.addBlock(2, 7);

  timeline.addBlock(0, 2);
  timeline.addBlock(1, 3);
  timeline.addBlock(0, 6);
  timeline.addBlock(1, 7);

  timeline.addBlock(3, 4);
  timeline.addBlock(3, 5);
  timeline.addBlock(3, 6);
  timeline.addBlock(3, 7);

  timeline.addBlock(4, 3);
  timeline.addBlock(4, 7);

  return timeline;
};
