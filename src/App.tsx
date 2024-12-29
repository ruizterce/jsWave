import { useState, useEffect } from "react";
import * as Tone from "tone";

const AudioPlayer = () => {
  // Define the state with the proper type
  const [isPlaying, setIsPlaying] = useState(false);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);

  useEffect(() => {
    // Initialize Tone.js components
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);

    return () => {
      // Clean up Tone.js components
      newSynth.dispose();
    };
  }, []);

  const handlePlay = () => {
    if (synth) {
      synth.triggerAttackRelease("C4", "8n");
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (synth) {
      synth.triggerRelease();
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <button onClick={handlePlay} disabled={isPlaying}>
        Play
      </button>
      <button onClick={handleStop} disabled={!isPlaying}>
        Stop
      </button>
    </div>
  );
};

export default AudioPlayer;
