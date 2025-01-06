import * as Tone from "tone";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import PlayMenu from "./components/PlayMenu";
import { Sequencer } from "./classes/sequencer";
import { Track } from "./classes/track";
import SequencerUI from "./components/SequencerUI";
import { Timeline } from "./classes/timeline";
import TimelineUI from "./components/TimelineUI";

Tone.getTransport().bpm.value = 120;
Tone.getTransport().loop = true;
Tone.getTransport().loopStart = "0:0:0";
Tone.getTransport().loopEnd = "4:0:0";

// Initialize sequencers

const sequencers = [
  new Sequencer("Sequencer 1", [
    new Track("synth1", "synth", [
      "C4",
      ["E4", "D4", "E4"],
      "G4",
      "A4",
      null,
      null,
      null,
      "E4",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "E4",
    ]),
    new Track("synth2", "synth", [
      "C3",
      null,
      "C3",
      null,
      "C3",
      null,
      "C3",
      null,
      "C3",
      null,
      "C3",
      null,
      "C3",
      null,
      "C3",
      null,
    ]),
  ]),

  new Sequencer("Sequencer 2", [
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
        "C5",
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
];

// Initialize timeline
const TIMELINE_LENGHT = 4;
const timeline = new Timeline(TIMELINE_LENGHT, sequencers);

timeline.addBlock(0, 0);

const App = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const [, forceUpdate] = useState({}); // Dummy state to trigger re-render

  // Control transport
  useEffect(() => {
    if (isPlaying) {
      Tone.getTransport().start();
    } else {
      console.log("cancel");
      Tone.getTransport().stop();
    }
    return () => {
      Tone.getTransport().stop();
    };
  }, [isPlaying]);

  return (
    <div className="max-w-lg m-auto p-2 flex flex-col gap-4 items-center">
      <PlayMenu />
      {timeline ? <TimelineUI timeline={timeline} /> : "No timeline"}

      <button
        className="m-2 p-2 bg-secondary rounded"
        onClick={() => {
          timeline.addSequencer(`Sequencer-${timeline.sequencers.length + 1}`);
          forceUpdate({});
        }}
      >
        Add Sequencer
      </button>

      {timeline.sequencers.map((sequencer: Sequencer, sequencerIndex) => {
        if (sequencer) {
          return (
            <div key={`SequencerUI-${sequencerIndex}`}>
              <SequencerUI
                timeline={timeline}
                sequencerIndex={sequencerIndex}
              />
              <button
                className="p-1 bg-red-400 rounded-full text-xs"
                onClick={() => {
                  timeline.removeSequencer(sequencerIndex);
                  forceUpdate({});
                }}
              >
                X
              </button>
            </div>
          );
        }
      })}
    </div>
  );
};

export default App;
