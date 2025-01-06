import { useState, useEffect } from "react";
import { Timeline } from "../classes/timeline";
import useContextMenu from "../hooks/useContextMenu";
import ContextMenu from "../components/ContextMenu";
import { KEYS } from "../models/keys";

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
  const { contextMenu, openMenu, closeMenu, menuRef } = useContextMenu();

  // Update progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(
        timeline.sequencers[sequencerIndex].tracks[0].sequence.progress
      );
    }, 50);

    return () => clearInterval(interval);
  }, [sequencerIndex, timeline.sequencers]);

  // Handle note click
  const handleNoteClick = (trackIndex: number, noteIndex: number) => {
    const notes = sequencer.tracks[trackIndex].notes;
    const newNote = notes[noteIndex] ? null : "C5";
    notes[noteIndex] = newNote;
    sequencer.setTrackNotes(trackIndex, notes);
    timeline.rescheduleSequencer(sequencerIndex);
    forceUpdate({});
  };

  // Handle note context menu
  const handleNoteChange = (newNote: string) => {
    if (
      contextMenu.data &&
      "trackIndex" in contextMenu.data &&
      "noteIndex" in contextMenu.data
    ) {
      const { trackIndex, noteIndex } = contextMenu.data;
      const notes = sequencer.tracks[trackIndex].notes;
      notes[noteIndex] = newNote;
      sequencer.setTrackNotes(trackIndex, notes);
      timeline.rescheduleSequencer(sequencerIndex);
      closeMenu();
      forceUpdate({});
    } else {
      alert("Error: Invalid context menu data.");
      closeMenu();
    }
  };

  // Handle sampler context menu
  const handleAddSamplerClick = (samplePath: string) => {
    sequencer.addTrack(
      `${samplePath.split("/")[1].split("-")[0]}-${
        sequencer.tracks.length + 1
      }`,
      "sampler",
      samplePath
    );
    forceUpdate({});
    closeMenu();
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
                    onClick={() => handleNoteClick(trackIndex, noteIndex)}
                    onContextMenu={(e) =>
                      openMenu(e, { type: "note", trackIndex, noteIndex })
                    }
                  >
                    {note || noteIndex + 1}
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

      {/* Context Menu for Notes */}
      {contextMenu.open && contextMenu.data?.type === "note" && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          menuRef={menuRef}
          items={KEYS.map((note) => ({
            label: note,
            onClick: () => handleNoteChange(note),
          }))}
        />
      )}

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
        {/* Context Menu for Add Sampler  */}
        <div
          className="relative inline-block text-left"
          onClick={(e) => {
            openMenu(e, {
              type: "sampler",
              trackIndex: 0,
            });
          }}
        >
          <button
            type="button"
            className="m-2 p-2 bg-secondary rounded hover:bg-gray-50"
          >
            Add Sampler
          </button>
        </div>

        {contextMenu.open && contextMenu.data?.type === "sampler" && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            menuRef={menuRef}
            items={[
              {
                label: "Kick",
                onClick: () => handleAddSamplerClick("TR-808/Kick-Long.mp3"),
              },
              {
                label: "Snare",
                onClick: () => handleAddSamplerClick("TR-808/Snare-Mid.mp3"),
              },
              {
                label: "Hihat",
                onClick: () => handleAddSamplerClick("TR-808/Hihat.mp3"),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default SequencerUI;
