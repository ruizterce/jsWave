import { useState } from "react";
import { Sequencer } from "./sequencer";

interface SequencerUIProps {
  sequencer: Sequencer;
}

const SequencerUI: React.FC<SequencerUIProps> = ({ sequencer }) => {
  const [, forceUpdate] = useState({}); // Dummy state to trigger re-render

  const handleNoteClick = (trackIndex: number, noteIndex: number) => {
    const notes = sequencer.tracks[trackIndex].notes;
    const newNote = notes[noteIndex] ? null : "C5";
    notes[noteIndex] = newNote;
    // Update sequencer's track's notes
    sequencer.setTrackNotes(trackIndex, notes);
    // Force a re-render by updating dummy state
    forceUpdate({});
  };

  return (
    <div>
      <div>{sequencer.name}</div>
      {sequencer.tracks.map((track, trackIndex) => {
        return (
          <div key={track.name}>
            <div>{track.name}</div>
            <div className="flex gap-2">
              {track.notes.map((note, noteIndex) => (
                <div
                  key={noteIndex}
                  className={`h-8 w-8 rounded text-center cursor-pointer ${
                    noteIndex % 4 === 0 ? "brightness-125" : ""
                  } ${
                    note
                      ? "bg-primary text-primaryContrast"
                      : "bg-primaryContrast text-primary"
                  }`}
                  onClick={() => {
                    handleNoteClick(trackIndex, noteIndex);
                  }}
                >
                  {noteIndex + 1}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SequencerUI;
