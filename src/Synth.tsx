import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import * as Tone from "tone";

const Synth = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const stepCounter = useSelector((state: RootState) => state.stepCounter);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [noteArray, setNoteArray] = useState([
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
  ]);

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
        if (noteArray[stepCounter.value - 1] === true) {
          synth.triggerAttackRelease("C4", "8n");
        }
      } else {
        synth.triggerRelease();
      }
    }
  }, [isPlaying, noteArray, stepCounter, synth]);

  return (
    <div className="flex gap-2">
      {noteArray.map((_note, index) => (
        <div
          key={`note-${index}`}
          className={`h-6 w-6 rounded text-center cursor-pointer ${
            noteArray[index]
              ? "bg-primary text-primaryContrast"
              : "bg-primaryContrast text-primary"
          }`}
          onClick={() => {
            setNoteArray((prevArray) =>
              prevArray.map((note, i) => (i === index ? !note : note))
            );
          }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default Synth;
