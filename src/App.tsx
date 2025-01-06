import * as Tone from "tone";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import PlayMenu from "./components/PlayMenu";
import { Sequencer } from "./classes/sequencer";
import { Track } from "./classes/track";
import { Timeline } from "./classes/timeline";
import TimelineUI from "./components/TimelineUI";

Tone.getTransport().bpm.value = 120;
Tone.getTransport().loop = true;
Tone.getTransport().loopStart = "0:0:0";
Tone.getTransport().loopEnd = "4:0:0";

// Initialize sequencers

const sequencers = [
  new Sequencer("Sequencer 1", 4, [
    new Track("synth1", "synth", [
      "C4",
      null,
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

  new Sequencer("Sequencer 2", 4, [
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
    </div>
  );
};

export default App;
