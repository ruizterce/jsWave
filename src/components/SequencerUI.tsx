import { useState, useEffect } from "react";
import * as Tone from "tone";
import { Timeline } from "../classes/timeline";
import useContextMenu from "../hooks/useContextMenu";
import ContextMenu from "../components/ContextMenu";
import TrackUI from "./TrackUI";
import { getSampleItems } from "../utils/getSampleItems";

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

  // Handle synth context menu
  const handleAddSynthClick = (synthType: string) => {
    sequencer.addTrack(
      `${synthType}-${sequencer.tracks.length + 1}`,
      synthType
    );
    forceUpdate({});
    closeMenu();
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
    <div className="p-4 bg-lightMedium rounded-2xl flex flex-col gap-1 max-h-full overflow-auto">
      <div className="flex">
        <div className="w-[250px]">
          {" "}
          <input
            className="ml-8 max-w-36 px-2 rounded-full bg-lightMild border-2 border-light text-dark font-semibold"
            id={"sequencer-" + sequencerIndex + "-name"}
            value={sequencer.name}
            onChange={(e) => {
              sequencer.name = e.target.value;
              forceUpdateParent();
            }}
            maxLength={12}
          />
        </div>
        {/* Progress Tracker */}
        <div className="flex items-center gap-6 bg-lightMild rounded-t-2xl rounded-b px-4">
          {Array.from(
            {
              length: notesLength,
            },
            (_, index) => (
              <div
                key={`progress-square-${index}`}
                className={`w-4 h-4 mx-2 my-1  rounded-full cursor-pointer  ${
                  index === activeBlock
                    ? "bg-accent text-primaryContrast"
                    : "bg-gray-200 hover:bg-accent hover:brightness-150"
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
      {sequencer.tracks.map((_track, trackIndex) => (
        <TrackUI
          key={`sequencer-${sequencerIndex}-track-${trackIndex}`}
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
      {/* Context Menu for Add Synth  */}
      <div className="self-start my-2 flex gap-2">
        <button
          className=" p-2  rounded text-sm bg-secondary hover:bg-darkMedium active:bg-dark"
          onClick={(e) => {
            openMenu(e, {
              type: "synth",
              trackIndex: 0,
            });
          }}
        >
          + Synth
        </button>

        {contextMenu.open && contextMenu.data?.type === "synth" && (
          <ContextMenu
            menuRef={menuRef}
            items={[
              {
                label: "AMSynth",
                onClick: () => handleAddSynthClick("AMSynth"),
              },
              {
                label: "FMSynth",
                onClick: () => handleAddSynthClick("FMSynth"),
              },
              {
                label: "DuoSynth",
                onClick: () => handleAddSynthClick("DuoSynth"),
              },
              {
                label: "MembraneSynth",
                onClick: () => handleAddSynthClick("MembraneSynth"),
              },
              {
                label: "MetalSynth",
                onClick: () => handleAddSynthClick("MetalSynth"),
              },
              {
                label: "MonoSynth",
                onClick: () => handleAddSynthClick("MonoSynth"),
              },
              {
                label: "NoiseSynth",
                onClick: () => handleAddSynthClick("NoiseSynth"),
              },
              {
                label: "PluckSynth",
                onClick: () => handleAddSynthClick("PluckSynth"),
              },
              {
                label: "PolySynth",
                onClick: () => handleAddSynthClick("PolySynth"),
              },
            ]}
          />
        )}

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
              className="p-2 rounded text-sm bg-secondary hover:bg-darkMedium active:bg-dark"
            >
              + Sampler
            </button>
          </div>

          {contextMenu.open && contextMenu.data?.type === "sampler" && (
            <ContextMenu
              menuRef={menuRef}
              items={getSampleItems(handleAddSamplerClick)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SequencerUI;
