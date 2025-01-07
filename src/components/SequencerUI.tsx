import { useState, useEffect } from "react";
import * as Tone from "tone";
import { Timeline } from "../classes/timeline";
import useContextMenu from "../hooks/useContextMenu";
import ContextMenu from "../components/ContextMenu";
import TrackUI from "./TrackUI";

interface SequencerUIProps {
  timeline: Timeline;
  sequencerIndex: number;
  forceUpdateParent: () => void;
}

const SequencerUI: React.FC<SequencerUIProps> = ({
  timeline,
  sequencerIndex,
  forceUpdateParent,
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

  const handleProgressClick = (index: number) => {
    const position = Tone.getTransport().position as string;
    const parts = position.split(":");
    const bar = parts[0];
    const quarter = Math.floor(index / 4);
    const sixteenth = index % 4;
    Tone.getTransport().position = bar + ":" + quarter + ":" + sixteenth;
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
  const activeBlock = progress ? Math.floor(progress * notesLength) : null;

  return (
    <div className="p-4 bg-stone-300 rounded flex flex-col gap-1 max-h-full overflow-auto">
      <input
        className="max-w-36 px-2 text-center rounded-full"
        id={"sequencer-" + sequencerIndex + "-name"}
        value={sequencer.name}
        onChange={(e) => {
          sequencer.name = e.target.value;
          forceUpdateParent();
        }}
        maxLength={12}
      />

      <div className="flex">
        <div className="w-[250px]"></div>
        {/* Progress Tracker */}
        <div className="flex gap-6 bg-stone-100 rounded-t-2xl rounded-b px-4">
          {Array.from(
            {
              length: notesLength,
            },
            (_, index) => (
              <div
                key={`progress-square-${index}`}
                className={`w-4 h-4 mx-2 my-1  rounded-full cursor-pointer  ${
                  index === activeBlock
                    ? "bg-primary text-primaryContrast"
                    : "bg-gray-200 hover:bg-primary hover:brightness-150"
                }`}
                onClick={() => {
                  handleProgressClick(index);
                }}
              ></div>
            )
          )}
        </div>
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
      <div className="self-start my-2 flex gap-2">
        <button
          className=" p-2 bg-secondary rounded text-sm hover:bg-gray-50"
          onClick={() => {
            sequencer.addTrack(`Synth-${sequencer.tracks.length + 1}`, "synth");
            forceUpdate({});
          }}
        >
          + Synth
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
              className="p-2 bg-secondary rounded text-sm hover:bg-gray-50"
            >
              + Sampler
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
    </div>
  );
};

export default SequencerUI;
