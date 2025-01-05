import { useState, useEffect } from "react";
import { Timeline } from "./timeline";

interface SequencerUIProps {
  timeline: Timeline;
  sequencerIndex: number;
}

const SequencerUI: React.FC<SequencerUIProps> = ({
  timeline,
  sequencerIndex,
}) => {
  const sequencer = timeline.sequencers[sequencerIndex];
  const [progress, setProgress] = useState(0);
  const [, forceUpdate] = useState({}); // Dummy state to trigger re-render

  // Update progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(
        timeline.sequencers[sequencerIndex].tracks[0].sequence.progress
      );
      console.log();
    }, 50);

    return () => clearInterval(interval);
  }, [sequencerIndex, timeline.sequencers]);

  const handleNoteClick = (trackIndex: number, noteIndex: number) => {
    const notes = sequencer.tracks[trackIndex].notes;
    const newNote = notes[noteIndex] ? null : "C5";
    notes[noteIndex] = newNote;
    // Update sequencer's track's notes
    sequencer.setTrackNotes(trackIndex, notes);
    // Reschedule timeline sequences
    timeline.rescheduleSequencer(sequencerIndex);
    // Force a re-render by updating dummy state
    forceUpdate({});
  };

  const notesLength =
    timeline.sequencers[sequencerIndex].tracks[0].notes.length;
  const activeBlock = Math.floor(progress * notesLength);

  return (
    <div>
      {/* Progress Tracker */}
      <div className="flex gap-2 mb-4">
        {Array.from(
          {
            length: notesLength,
          },
          (_, index) => (
            <div
              key={`progress-square-${index}`}
              className={`w-4 h-4 m-2 rounded-full ${
                index === activeBlock
                  ? "bg-primary text-primaryContrast"
                  : "bg-gray-200"
              }`}
            ></div>
          )
        )}
      </div>

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
