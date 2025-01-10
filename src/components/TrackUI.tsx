import { useState } from "react";
import * as Tone from "tone";
import { Timeline } from "../classes/timeline";
import useContextMenu from "../hooks/useContextMenu";
import ContextMenu from "./ContextMenu";
import { KEYS } from "../models/keys";
import { SUBDIVISIONS } from "../models/subdivisions";
import InstrumentParameters from "./InstrumentParameters";

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
  const [isParamsOpen, setIsParamsOpen] = useState(false);
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
    <div className="p-2 rounded flex flex-col gap-2 bg-lightMild">
      <div className="flex gap-2">
        <div className="flex gap-2 w-60">
          {/* Track Management*/}
          <div className="flex flex-col items-center">
            <button
              className="w-4 h-4 rounded-t-full text-xs bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
              onClick={() => {
                moveTrackUp(trackIndex);
              }}
            >
              <img
                src="/assets/icons/arrow_upward.svg"
                alt="Up"
                className="brightness-0 invert"
              />
            </button>
            <button
              className="w-4 h-4 text-xs bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
              onClick={() => {
                const confirmed = window.confirm(
                  "Are you sure you want to remove this track?"
                );
                if (confirmed) {
                  removeTrack(trackIndex);
                }
              }}
            >
              <img
                src="/assets/icons/close.svg"
                alt="Delete"
                className="brightness-0 invert"
              />
            </button>
            <button
              className="w-4 h-4 rounded-b-full text-xs bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
              onClick={() => {
                moveTrackDown(trackIndex);
              }}
            >
              <img
                src="/assets/icons/arrow_downward.svg"
                alt="Down"
                className="brightness-0 invert"
              />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <input
              className="px-2 w-36 rounded-full bg-light text-dark font-semibold"
              id={"track-" + trackIndex + "-name"}
              value={track.name}
              disabled={Tone.getTransport().state === "started"}
              onChange={(e) => {
                track.name = e.target.value;
                forceUpdate({});
              }}
            />
            {/* Instrument Parameters */}
            <input
              type="range"
              className="appearance-none rounded-full accent-secondary bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-lightMedium"
              min="-60"
              max="0"
              value={track.volume}
              onChange={(e) => {
                handleVolumeChange(parseInt(e.target.value));
              }}
            />
          </div>
          <div className="flex flex-col gap-1 items-center w-full">
            <button
              onClick={(e) => {
                openMenu(e, { type: "subdivision", trackIndex });
              }}
              className="px-2 w-10 h-5 text-sm font-semibold  rounded-full flex items-center justify-center bg-secondary hover:bg-darkMedium active:bg-dark"
            >
              {track.noteDuration}
            </button>
            <button
              className={`w-10 h-5 flex items-center justify-center ${
                isParamsOpen
                  ? "bg-medium rotate-180 rounded-b-xl rounded-t"
                  : "bg-accent  rounded-full "
              }`}
              onClick={() => {
                setIsParamsOpen(!isParamsOpen);
              }}
            >
              <img
                src="/assets/icons/keyboard_arrow_down.svg"
                alt="Parameters"
                className="brightness-0 invert"
              />
            </button>
          </div>
          {/* Context Menu for Subdivisions */}
          {contextMenu.open && contextMenu.data?.type === "subdivision" && (
            <ContextMenu
              menuRef={menuRef}
              items={SUBDIVISIONS.map((subdivision) => ({
                label: subdivision,
                onClick: () => handleNoteDurationChange(subdivision),
              }))}
            />
          )}
        </div>
        {/* Notes */}
        <div className="flex gap-2">
          {track.notes.map(
            (note: string | string[] | null, noteIndex: number) => (
              <div
                key={noteIndex}
                className={`h-12 w-12 rounded text-center font-semibold cursor-pointer ${
                  noteIndex % 4 === 0 ? "saturate-200" : "saturate-50"
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
            )
          )}

          {/* Context Menu for Notes */}
          {contextMenu.open && contextMenu.data?.type === "note" && (
            <ContextMenu
              menuRef={menuRef}
              items={KEYS.map((note) => ({
                label: note,
                onClick: () => handleNoteChange(note),
              }))}
            />
          )}
        </div>
      </div>
      {/* Instrument Extended Parameters */}
      {isParamsOpen && <InstrumentParameters track={track} />}
    </div>
  );
};

export default TrackUI;
