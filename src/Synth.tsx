import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import * as Tone from "tone";

const Synth = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);

  useEffect(() => {
    // Initialize the synth
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);

    return () => {
      // Clean up the synth
      newSynth.dispose();
    };
  }, []);

  useEffect(() => {
    // Play or stop the synth based on isPlaying
    if (synth) {
      if (isPlaying) {
        synth.triggerAttackRelease("C4", "8n");
      } else {
        synth.triggerRelease();
      }
    }
  }, [isPlaying, synth]);

  return null;
};

export default Synth;
