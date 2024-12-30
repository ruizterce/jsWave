import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store";
import { play, stop } from "./store/isPlayingSlice";
import * as Tone from "tone";

const AudioPlayer = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const dispatch = useDispatch();
  const [synth, setSynth] = useState<Tone.Synth | null>(null);

  useEffect(() => {
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);

    return () => {
      newSynth.dispose();
    };
  }, []);

  const handlePlay = () => {
    if (synth) {
      synth.triggerAttackRelease("C4", "8n");
      dispatch(play());
    }
  };

  const handleStop = () => {
    if (synth) {
      dispatch(stop());
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
