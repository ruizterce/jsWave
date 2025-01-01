import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import * as Tone from "tone";
import { Track } from "./types";

const Sampler: React.FC<{ options?: Track["options"] }> = ({ options }) => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const stepCounter = useSelector((state: RootState) => state.stepCounter);
  const [sampler, setSampler] = useState<Tone.Sampler | null>(null);
  const [noteArray, setNoteArray] = useState<boolean[]>([]);

  useEffect(() => {
    console.log(options);
    // Initialize the sampler
    const newSampler = new Tone.Sampler({
      urls: {
        C5: options?.sample,
      },
    }).toDestination();
    setSampler(newSampler);

    return () => {
      // Clean up the sampler
      newSampler.dispose();
    };
  }, []);

  // Handle changes on stepLength
  useEffect(() => {
    setNoteArray(Array(stepCounter.length).fill(false));
  }, [stepCounter.length]);

  useEffect(() => {
    // Play or stop the sampler based on isPlaying
    if (sampler) {
      if (isPlaying) {
        if (noteArray[stepCounter.value - 1] === true) {
          const note = options?.note || "C5";
          sampler.triggerAttackRelease(note, "8n");
        }
      }
    }
  }, [isPlaying, noteArray, options, stepCounter, sampler]);

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

export default Sampler;
