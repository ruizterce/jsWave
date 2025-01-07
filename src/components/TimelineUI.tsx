import { useState, useEffect } from "react";
import * as Tone from "tone";
import { Timeline } from "../classes/timeline";
import { Sequencer } from "../classes/sequencer";
import SequencerUI from "./SequencerUI";
import React from "react";

interface TimelineUIProps {
  timeline: Timeline;
}
const TimelineUI: React.FC<TimelineUIProps> = ({ timeline }) => {
  const [progress, setProgress] = useState(0);
  const [, forceUpdate] = useState({}); // Dummy state to trigger re-render

  // Update progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(Tone.getTransport().progress);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handlePlay = () => {
    Tone.getTransport().start();
  };

  const handlePause = () => {
    Tone.getTransport().pause();
  };

  const handleStop = () => {
    Tone.getTransport().stop();
  };

  const handleBlockClick = (sequencerIndex: number, barIndex: number) => {
    if (timeline.sequencers[sequencerIndex].events[barIndex]) {
      timeline.removeBlock(sequencerIndex, barIndex);
    } else {
      timeline.addBlock(sequencerIndex, barIndex);
    }
    forceUpdate({});
  };

  const activeBlock = Math.floor(progress * timeline.length);

  return (
    <div className="flex flex-col gap-2 items-center">
      {/* Timeline Controls */}
      <div className="flex gap-2">
        <button
          onClick={handlePlay}
          disabled={Tone.getTransport().state === "started"}
          className={`p-2 rounded ${
            Tone.getTransport().state !== "started"
              ? "bg-primary text-primaryContrast"
              : "bg-primaryContrast text-primary shadow-xl"
          }`}
        >
          Play
        </button>
        <button
          onClick={handlePause}
          disabled={Tone.getTransport().state !== "started"}
          className={`p-2 rounded ${
            Tone.getTransport().state !== "started"
              ? "bg-primaryContrast text-primary "
              : "bg-primary text-primaryContrast"
          }`}
        >
          Pause
        </button>
        <button
          onClick={handleStop}
          disabled={Tone.getTransport().state === "stopped"}
          className={`p-2 rounded ${
            Tone.getTransport().state === "stopped"
              ? "bg-primaryContrast text-primary "
              : "bg-primary text-primaryContrast"
          }`}
        >
          Stop
        </button>
      </div>
      <div
        className="flex gap-2
      "
      >
        <label htmlFor="timeline-length">BPM: </label>
        <input
          type="number"
          id="timeline-length"
          className="w-12"
          value={Tone.getTransport().bpm.value}
          onChange={(e) => {
            Tone.getTransport().bpm.value = parseInt(e.target.value);
            forceUpdate({});
          }}
        />
        <label htmlFor="timeline-length">Timeline Length: </label>
        <input
          type="number"
          id="timeline-length"
          className="w-12"
          value={timeline.length}
          onChange={(e) => {
            timeline.length = parseInt(e.target.value);
            forceUpdate({});
          }}
        />
      </div>
      <div className="grid grid-cols-[max-content,1fr] gap-x-4 items-center self-start">
        {/* Progress Tracker */}
        <div></div>
        <div className="flex gap-2 mb-1 justify-center">
          {Array.from({ length: timeline.length }, (_, index) => (
            <div
              key={`progress-square-${index}`}
              className={`w-4 h-4 rounded-full cursor-pointer ${
                index === activeBlock
                  ? "bg-primary text-primaryContrast"
                  : "bg-gray-200 hover:bg-primary hover:brightness-150"
              }`}
              onClick={() => {
                Tone.getTransport().position = index + ":0:0";
              }}
            ></div>
          ))}
        </div>

        {/* Timeline Sequencers*/}
        {timeline.sequencers.map((sequencer, sequencerIndex) => {
          return (
            <React.Fragment key={`sequencer-${sequencerIndex}`}>
              {/* Sequencer Name */}
              <div className="flex gap-2 items-center">
                <button className="w-36">{sequencer.name}</button>
                <button
                  className="px-1 bg-blue-400 rounded-full text-xs"
                  onClick={() => {
                    timeline.moveSequencerUp(sequencerIndex);
                    forceUpdate({});
                  }}
                >
                  ^
                </button>
                <button
                  className="px-1 bg-blue-400  rounded-full text-xs rotate-180"
                  onClick={() => {
                    timeline.moveSequencerDown(sequencerIndex);
                    forceUpdate({});
                  }}
                >
                  ^
                </button>
                <button
                  className="px-1 bg-red-400 rounded-full text-xs"
                  onClick={() => {
                    timeline.removeSequencer(sequencerIndex);
                    forceUpdate({});
                  }}
                >
                  X
                </button>
              </div>

              {/* Sequencer Blocks */}
              <div className="flex gap-1 justify-center">
                {sequencer.events.map((_e, barIndex) => {
                  return (
                    <div
                      key={`bar-${barIndex}`}
                      className={`w-5 h-5 cursor-pointer rounded ${
                        timeline.sequencers[sequencerIndex].events[barIndex]
                          ? "bg-primary text-primaryContrast hover:bg-gray-500"
                          : "bg-primaryContrast text-primary hover:bg-primary hover:opacity-50"
                      }`}
                      onClick={() => {
                        handleBlockClick(sequencerIndex, barIndex);
                      }}
                    ></div>
                  );
                })}
              </div>

              {/* Sequencer Controls */}
            </React.Fragment>
          );
        })}

        <button
          className="max-w-36 bg-secondary rounded"
          onClick={() => {
            timeline.addSequencer(
              `Sequencer-${timeline.sequencers.length + 1}`
            );
            forceUpdate({});
          }}
        >
          +
        </button>
      </div>

      {/* Sequencer UI*/}
      {timeline.sequencers.map((sequencer: Sequencer, sequencerIndex) => {
        if (sequencer) {
          return (
            <div key={`SequencerUI-${sequencerIndex}`}>
              <SequencerUI
                timeline={timeline}
                sequencerIndex={sequencerIndex}
                forceUpdateParent={() => {
                  forceUpdate({});
                }}
              />
            </div>
          );
        }
      })}
    </div>
  );
};
export default TimelineUI;
