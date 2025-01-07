import { useState } from "react";
import * as Tone from "tone";
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
  moveTrackUp: (trackIndex: number) => void;
  moveTrackDown: (trackIndex: number) => void;
  removeTrack: (trackIndex: number) => void;
}

const TrackUI: React.FC<TrackUIProps> = ({
  timeline,
  sequencerIndex,
  trackIndex,
  moveTrackUp,
  moveTrackDown,
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
    <div className="p-2 bg-stone-100 rounded flex flex-col gap-1 ">
      <input
        className="px-2 w-36 rounded-full"
        value={track.name}
        disabled={Tone.getTransport().state === "started"}
        onChange={(e) => {
          track.name = e.target.value;
          forceUpdate({});
        }}
      />
      <div className="flex gap-2">
        {track.notes.map((note: Note, noteIndex: number) => (
          <div
            key={noteIndex}
            className={`h-8 w-8 rounded text-center cursor-pointer ${
              noteIndex % 4 === 0 ? "brightness-125" : ""
            } ${
              note
                ? "bg-primary text-primaryContrast hover:bg-gray-500"
                : "bg-primaryContrast text-primary hover:bg-primary hover:text-primaryContrast hover:opacity-50"
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

      {/* Track Controls */}
      <div className="flex gap-4 w-full justify-between items-center ">
        <div className="flex gap-4">
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
            className="px-2 bg-secondary text-sm rounded"
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
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-1 bg-blue-400 rounded-full text-xs"
            onClick={() => {
              moveTrackUp(trackIndex);
            }}
          >
            ^
          </button>
          <button
            className="px-1 bg-blue-400 rounded-full text-xs rotate-180"
            onClick={() => {
              moveTrackDown(trackIndex);
            }}
          >
            ^
          </button>

          <button
            className="px-1 bg-red-400 rounded-full text-xs"
            onClick={() => removeTrack(trackIndex)}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackUI;
