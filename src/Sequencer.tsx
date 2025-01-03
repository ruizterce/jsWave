import { useState, useEffect } from "react";
import * as Tone from "tone";
import { Track } from "./track";

const Sequencer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks] = useState([
    new Track("synth1", "synth", [
      "C4",
      ["E4", "D4", "E4"],
      "G4",
      ["A4", "G4"],
    ]),
  ]);

  useEffect(() => {
    if (isPlaying) {
      tracks[0].startSequence();
    }
  }, [isPlaying]);

  // Listen to isPlaying
  useEffect(() => {
    if (isPlaying) {
      Tone.getTransport().start();
    } else {
      Tone.getTransport().stop();
    }
  }, [isPlaying]);

  return (
    <div>
      <div
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? "Stop" : "Play"}
      </div>
    </div>
  );
};

export default Sequencer;
