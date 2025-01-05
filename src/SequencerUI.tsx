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
  const [isAddSamplerMenuOpen, setIsAddSamplerMenuOpen] = useState(false);
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
    timeline.sequencers[sequencerIndex].tracks[0]?.notes.length || 16;
  const activeBlock = Math.floor(progress * notesLength);

  return (
    <div className="p-4 bg-stone-300 rounded">
      <div className="text-center">{sequencer.name}</div>
      {/* Progress Tracker */}
      <div className="flex gap-2 p-2 bg-stone-100 rounded">
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
      {/* Sequencer Tracks */}
      {sequencer.tracks.length > 0 &&
        sequencer.tracks.map((track, trackIndex) => {
          return (
            <div key={track.name} className="p-2 bg-stone-100 rounded">
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
              <button
                className="p-1 bg-red-400 rounded-full text-xs"
                onClick={() => {
                  sequencer.removeTrack(trackIndex);
                  forceUpdate({});
                }}
              >
                X
              </button>
            </div>
          );
        })}

      {/* Add Buttons*/}
      <button
        className="m-2 p-2 bg-secondary rounded hover:bg-gray-50"
        onClick={() => {
          sequencer.addTrack(`Synth-${sequencer.tracks.length + 1}`, "synth");
          forceUpdate({});
        }}
      >
        Add Synth
      </button>

      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="m-2 p-2 bg-secondary rounded hover:bg-gray-50"
            onClick={() => {
              setIsAddSamplerMenuOpen(!isAddSamplerMenuOpen);
            }}
          >
            Add Sampler
          </button>
        </div>

        {/* Add Sampler Dropdown */}
        <div
          className={`absolute left-32 bottom-2 rounded bg-secondary shadow-lg ${
            isAddSamplerMenuOpen ? "" : "hidden"
          }`}
        >
          <div>
            <button
              className="p-2 w-full rounded hover:bg-gray-50"
              onClick={() => {
                sequencer.addTrack(
                  `Kick-${sequencer.tracks.length + 1}`,
                  "sampler",
                  "TR-808/Kick-Long.mp3"
                );
                forceUpdate({});
              }}
            >
              Kick
            </button>
            <button
              className="p-2 w-full rounded hover:bg-gray-50"
              onClick={() => {
                sequencer.addTrack(
                  `Snare-${sequencer.tracks.length + 1}`,
                  "sampler",
                  "TR-808/Snare-Mid.mp3"
                );
                forceUpdate({});
              }}
            >
              Snare
            </button>
            <button
              className="p-2 w-full rounded hover:bg-gray-50"
              onClick={() => {
                sequencer.addTrack(
                  `Hihat-${sequencer.tracks.length + 1}`,
                  "sampler",
                  "TR-808/Hihat.mp3"
                );
                forceUpdate({});
              }}
            >
              Hihat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequencerUI;
