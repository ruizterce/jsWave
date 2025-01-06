import { useState, useEffect } from "react";
import { Timeline } from "../classes/timeline";
import useContextMenu from "../hooks/useContextMenu";
import ContextMenu from "../components/ContextMenu";
import TrackUI from "./TrackUI";

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
      if (timeline.sequencers[sequencerIndex].tracks[0]) {
        setProgress(
          timeline.sequencers[sequencerIndex].tracks[0].sequence.progress
        );
      }
    }, 50);

    return () => clearInterval(interval);
  }, [sequencerIndex, timeline.sequencers]);

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
      {sequencer.tracks.map((track, trackIndex) => (
        <TrackUI
          key={track.name}
          timeline={timeline}
          sequencerIndex={sequencerIndex}
          trackIndex={trackIndex}
          moveTrackUp={(trackIndex) => {
            sequencer.moveTrackUp(trackIndex);
            forceUpdate({});
          }}
          moveTrackDown={(trackIndex) => {
            sequencer.moveTrackDown(trackIndex);
            forceUpdate({});
          }}
          removeTrack={(trackIndex) => {
            sequencer.removeTrack(trackIndex);
            forceUpdate({});
          }}
        />
      ))}

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
