import * as Tone from "tone";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import PlayMenu from "./PlayMenu";
import { Sequencer } from "./sequencer";
import { Track } from "./track";
import SequencerUI from "./SequencerUI";
import { Timeline } from "./timeline";

// Debugging transport position
setInterval(() => {
  console.log(Tone.getTransport().position);
  console.log(Tone.getTransport().progress);
}, 1000);

const TIMELINE_LENGHT = 4;

const App = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const sequencers = useRef<Sequencer[]>([]);
  const timeline = useRef<Timeline>();

  // Initialize sequencers
  useEffect(() => {
    sequencers.current = [
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
    return () => {
      sequencers.current.forEach((sequencer: Sequencer) => {
        sequencer.dispose();
      });
    };
  }, []);

  // Initialize timeline
  useEffect(() => {
    timeline.current = new Timeline(TIMELINE_LENGHT, sequencers.current);
  }, []);

  // Initialize transport
  useEffect(() => {
    Tone.getTransport().bpm.value = 90;
    Tone.getTransport().loop = true;
    Tone.getTransport().loopStart = "0:0:0";
    Tone.getTransport().loopEnd = "2:0:0";
  }, []);

  // Control sequencers
  useEffect(() => {
    if (sequencers.current) {
      timeline.current?.addBlock(0, 0);
      timeline.current?.addBlock(1, 1);
    }
  }, []);

  // Control transport
  useEffect(() => {
    if (isPlaying) {
      Tone.getTransport().start();
    } else {
      Tone.getTransport().stop();
    }
  }, [isPlaying]);

  return (
    <div className="max-w-lg m-auto p-2 flex flex-col gap-4 items-center">
      <PlayMenu />
      {sequencers.current.map((sequencer: Sequencer) => {
        if (sequencer) {
          return <SequencerUI key={sequencer.name} sequencer={sequencer} />;
        }
      })}
    </div>
  );
};

export default App;
