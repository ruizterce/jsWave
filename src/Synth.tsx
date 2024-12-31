import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import * as Tone from "tone";
import { Track } from "./types";

const Synth: React.FC<{ options?: Track["options"] }> = ({ options }) => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const stepCounter = useSelector((state: RootState) => state.stepCounter);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);
  const [noteArray, setNoteArray] = useState<boolean[]>([]);

  useEffect(() => {
    // Initialize the synth
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);

    return () => {
      // Clean up the synth
      newSynth.dispose();
    };
  }, []);

  // Handle changes on stepLength
  useEffect(() => {
    setNoteArray(Array(stepCounter.length).fill(false));
  }, [stepCounter.length]);

  useEffect(() => {
    // Play or stop the synth based on isPlaying
    if (synth) {
      if (isPlaying) {
        if (noteArray[stepCounter.value - 1] === true) {
          const note = options?.note || "C4";
          synth.triggerAttackRelease(note, "8n");
        }
      } else {
        synth.triggerRelease();
      }
    }
  }, [isPlaying, noteArray, options, stepCounter, synth]);

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
