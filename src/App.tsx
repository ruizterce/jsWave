import * as Tone from "tone";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import PlayMenu from "./PlayMenu";
import { Sequencer } from "./sequencer";
import { Track } from "./track";
import SequencerUI from "./SequencerUI";

// Debugging transport position
setInterval(() => {
  console.log(Tone.getTransport().position);
}, 1000);

const App = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const sequencers = useRef<Sequencer[]>([]);

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

  // Control transport and sequencers
  useEffect(() => {
    if (sequencers.current) {
      if (isPlaying) {
        Tone.getTransport().start();
        sequencers.current[0].start(0);
        sequencers.current[1].start("1n");
      } else {
        sequencers.current.forEach((sequencer) => {
          sequencer.stop();
        });
        Tone.getTransport().stop();
        Tone.getTransport().cancel();
      }
    }
  }, [isPlaying]);

  return (
    <div className="max-w-lg m-auto p-2 flex flex-col gap-4 items-center">
      <PlayMenu />
      {sequencers.current.map((sequencer: Sequencer) => {
        if (sequencer) {
          return <SequencerUI sequencer={sequencer} />;
        }
      })}
    </div>
  );
};

export default App;
