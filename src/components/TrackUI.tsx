import { useState } from "react";
import { Note } from "../types";
import { Timeline } from "../classes/timeline";
import useContextMenu from "../hooks/useContextMenu";
import ContextMenu from "./ContextMenu";
import { KEYS } from "../models/keys";
import { SUBDIVISIONS } from "../models/subdivisions";

interface TrackUIProps {
  timeline: Timeline;
  sequencerIndex: number;
  trackIndex: number;
  removeTrack: (trackIndex: number) => void;
}

const TrackUI: React.FC<TrackUIProps> = ({
  timeline,
  sequencerIndex,
  trackIndex,
  removeTrack,
}) => {
  const sequencer = timeline.sequencers[sequencerIndex];
  const track = sequencer.tracks[trackIndex];
  const [, forceUpdate] = useState({}); // Dummy state to trigger re-render
  const { contextMenu, openMenu, closeMenu, menuRef } = useContextMenu();

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

  const handleVolumeChange = (newVolume: number) => {
    track.volume = newVolume;
    forceUpdate({});
  };

  const handleNoteDurationChange = (newNoteDuration: string | number) => {
    track.noteDuration = newNoteDuration;
    timeline.rescheduleSequencer(sequencerIndex);
    closeMenu();
    forceUpdate({});
  };

  return (
    <div className="p-2 bg-stone-100 rounded">
      <div>{track.name}</div>
      <div className="flex gap-2">
        {track.notes.map((note: Note, noteIndex: number) => (
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

      {/* Track Parameters */}
      <div className="flex gap-4 w-full justify-between">
        <input
          type="range"
          min="-60"
          max="0"
          value={track.volume}
          onChange={(e) => {
            handleVolumeChange(parseInt(e.target.value));
          }}
        />

        <button
          onClick={(e) => {
            openMenu(e, { type: "subdivision", trackIndex });
          }}
          className="px-2 bg-secondary rounded"
        >
          {track.noteDuration}
        </button>

        {/* Context Menu for Subdivisions */}
        {contextMenu.open && contextMenu.data?.type === "subdivision" && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            menuRef={menuRef}
            items={SUBDIVISIONS.map((subdivision) => ({
              label: subdivision,
              onClick: () => handleNoteDurationChange(subdivision),
            }))}
          />
        )}

        <button
          className="p-1 bg-red-400 rounded-full text-xs justify-self-end"
          onClick={() => removeTrack(trackIndex)}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default TrackUI;
