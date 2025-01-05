import * as Tone from "tone";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import PlayMenu from "./PlayMenu";
import { Sequencer } from "./sequencer";
import { Track } from "./track";
import SequencerUI from "./SequencerUI";
import { Timeline } from "./timeline";
import TimelineUI from "./TimelineUI";

// Debugging transport position
/* setInterval(() => {
  console.log(Tone.getTransport().position);
}, 1000); */

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
      ["A4", "G4"],
    ]),
    new Track("synth2", "synth", ["C3", null, "C3", null]),
  ]),

  new Sequencer("Sequencer 2", [
    new Track("synth1", "synth", [["C6", "C6"], "C6", "C6", "C6"]),
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

      {timeline.sequencers.map((sequencer: Sequencer, index) => {
        if (sequencer) {
          return (
            <SequencerUI
              key={`SequencerUI-${index}`}
              timeline={timeline}
              sequencerIndex={index}
            />
          );
        }
      })}
    </div>
  );
};

export default App;
