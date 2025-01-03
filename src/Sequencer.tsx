import { useState, useEffect } from "react";
import * as Tone from "tone";
import { Track } from "./track";

const Sequencer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks] = useState(() => [
    new Track("synth1", "synth", [
      "C4",
      ["E4", "D4", "E4"],
      "G4",
      ["A4", "G4"],
    ]),
    new Track("synth1", "synth", ["C3", null, "C3", null]),
  ]);

  useEffect(() => {
    if (isPlaying) {
      tracks.forEach((track) => track.startSequence());
      Tone.getTransport().start();
    } else {
      tracks.forEach((track) => track.stopSequence());
      Tone.getTransport().stop();
      Tone.getTransport().cancel();
    }

    return () => {
      Tone.getTransport().stop();
      Tone.getTransport().cancel();
    };
  }, [isPlaying, tracks]);

  const handlePlayButton = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <button onClick={handlePlayButton}>{isPlaying ? "Stop" : "Play"}</button>
    </div>
  );
};

export default Sequencer;
