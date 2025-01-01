import { useState } from "react";
import { Track } from "./types";

const Instrument: React.FC<{
  track: Track;
  onUpdate: (noteArray: boolean[]) => void;
}> = ({ track, onUpdate }) => {
  const [noteArray, setNoteArray] = useState<boolean[]>(
    track.noteArray || Array(16).fill(false)
  );

  const toggleNote = (index: number) => {
    const newNoteArray = [...noteArray];
    newNoteArray[index] = !newNoteArray[index];
    setNoteArray(newNoteArray);
    onUpdate(newNoteArray);
  };

  return (
    <div>
      <div className="absolute w-20 -translate-x-20 ">{track.name}</div>
      <div className="flex gap-2">
        {noteArray.map((note, index) => (
          <div
            key={index}
            className={`h-6 w-6 rounded text-center cursor-pointer ${
              note
                ? "bg-primary text-primaryContrast"
                : "bg-primaryContrast text-primary"
            }`}
            onClick={() => toggleNote(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instrument;
