import { useState, useEffect } from "react";
import * as Tone from "tone";
import { Timeline } from "../classes/timeline";
import SequencerUI from "./SequencerUI";
import React from "react";
import TransportControls from "./TransportControls";

interface TimelineUIProps {
  timeline: Timeline;
}
const TimelineUI: React.FC<TimelineUIProps> = ({ timeline }) => {
  const [progress, setProgress] = useState(0);
  const [selectedSequencerIndex, setselectedSequencerIndex] = useState(0);
  const [, forceUpdate] = useState({}); // Dummy state to trigger re-render

  // Update progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(Tone.getTransport().progress);
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
    <div className="relative flex flex-col gap-2 items-center h-full bg-light rounded-3xl p-8 shadow-xl">
      <TransportControls />
      {/* Progress Tracker */}
      <div className="items-center self-start bg-lightMedium rounded-2xl p-4 w-full">
        <div className="flex">
          <div className="w-60 flex justify-end gap-1">
            <button
              onClick={() => {
                timeline.length -= 1;
                forceUpdate({});
              }}
              className="w-5 h-5 rounded-full leading-4 bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
            >
              -
            </button>
            <button
              onClick={() => {
                timeline.length += 1;
                forceUpdate({});
              }}
              className="w-5 h-5 rounded-full leading-4 bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
            >
              +
            </button>
          </div>
          <div className="flex px-2 gap-1 mb-1 justify-center">
            {Array.from({ length: timeline.length }, (_, index) => (
              <div
                key={`progress-square-${index}`}
                className={`w-5 h-5 rounded-full cursor-pointer ${
                  index === activeBlock
                    ? "bg-accent text-primaryContrast"
                    : "bg-gray-200 hover:bg-accent hover:brightness-150"
                }`}
                onClick={() => {
                  Tone.getTransport().position = index + ":0:0";
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="max-h-[40px] md:max-h-[130px] lg:max-h-[190px] overflow-y-auto">
          {/* Timeline Sequencers*/}
          {timeline.sequencers.map((sequencer, sequencerIndex) => {
            return (
              <div
                className="flex items-center"
                key={`sequencer-${sequencerIndex}`}
              >
                {/* Sequencer Controls */}
                <div
                  className={`w-60 flex gap-2 items-center rounded px-2 ${
                    selectedSequencerIndex === sequencerIndex ? "bg-medium" : ""
                  }`}
                >
                  <button
                    className="px-1 rounded-full text-xs bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
                    onClick={() => {
                      timeline.moveSequencerUp(sequencerIndex);
                      if (selectedSequencerIndex > 0) {
                        setselectedSequencerIndex(selectedSequencerIndex - 1);
                      }
                      forceUpdate({});
                    }}
                  >
                    ^
                  </button>
                  <button
                    className="px-1 rounded-full text-xs rotate-180 bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
                    onClick={() => {
                      timeline.moveSequencerDown(sequencerIndex);
                      if (
                        selectedSequencerIndex <
                        timeline.sequencers.length - 1
                      ) {
                        setselectedSequencerIndex(selectedSequencerIndex + 1);
                      }
                      forceUpdate({});
                    }}
                  >
                    ^
                  </button>
                  <button
                    className="px-1  rounded-full text-xs bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
                    onClick={() => {
                      timeline.removeSequencer(sequencerIndex);
                      forceUpdate({});
                    }}
                  >
                    X
                  </button>

                  <button
                    className={`w-36 text-dark ${
                      sequencerIndex === selectedSequencerIndex
                        ? "font-bold"
                        : ""
                    }`}
                    onClick={() => {
                      setselectedSequencerIndex(sequencerIndex);
                    }}
                  >
                    {sequencer.name}
                  </button>
                </div>

                {/* Sequencer Blocks */}
                <div className="flex px-2 gap-1 justify-center">
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
              </div>
            );
          })}

          <button
            className="ml-[138px] mt-2 w-6 rounded-full bg-secondary hover:bg-darkMedium active:bg-dark"
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
      </div>

      {/* Sequencer UI*/}

      <SequencerUI
        timeline={timeline}
        sequencerIndex={selectedSequencerIndex}
        forceUpdateParent={() => {
          forceUpdate({});
        }}
      />
    </div>
  );
};
export default TimelineUI;
