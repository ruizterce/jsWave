import { useState, useEffect } from "react";
import * as Tone from "tone";
import { Timeline } from "../classes/timeline";
import SequencerUI from "./SequencerUI";
import React from "react";
import TransportControls from "./TransportControls";
import { Time } from "tone/build/esm/core/type/Units";

interface TimelineUIProps {
  timeline: Timeline;
}
const TimelineUI: React.FC<TimelineUIProps> = ({ timeline }) => {
  const [position, setPosition] = useState<Time>();
  const [selectedSequencerIndex, setselectedSequencerIndex] = useState(0);
  const [isSequencerLoop, setIsSequencerLoop] = useState(false);

  const [, forceUpdate] = useState({}); // Dummy state to trigger re-render

  // Update position
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(Tone.getTransport().position);
    }, 200);

    return () => clearInterval(interval);
  }, [position]);

  const handleBlockClick = (sequencerIndex: number, barIndex: number) => {
    if (timeline.sequencers[sequencerIndex].events[barIndex]) {
      timeline.removeBlock(sequencerIndex, barIndex);
    } else {
      timeline.addBlock(sequencerIndex, barIndex);
    }
    forceUpdate({});
  };

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const activeBlock = position ? Number(position.toString().split(":")[0]) : 0;

  return (
    <div className="relative flex flex-col gap-2 items-center h-full bg-light rounded-3xl p-8 pb-14 shadow-xl">
      {/* Transport Controls */}
      <TransportControls
        timeline={timeline}
        selectedSequencerIndex={selectedSequencerIndex}
        isSequencerLoop={isSequencerLoop}
        setIsSequencerLoop={setIsSequencerLoop}
      />
      {/* Progress Tracker */}
      <div className="relative items-center self-start bg-lightMedium rounded-2xl p-4 w-full">
        {isSequencerLoop && (
          <div className="absolute z-10 w-full h-full bg-red-500 opacity-10 rounded-2xl -translate-x-4 -translate-y-4 bg-[repeating-linear-gradient(45deg,#f06c6c_0px,#f06c6c_10px,transparent_0%,transparent_50%)] bg-[length:64px_64px]"></div>
        )}
        <div className="flex">
          <div className="w-60 flex justify-end gap-1">
            <button
              onClick={() => {
                timeline.length -= 1;
                forceUpdate({});
              }}
              className="w-5 h-5 rounded-full leading-4 bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
            >
              <img
                src="src/assets/icons/remove.svg"
                alt="-"
                className="brightness-0 invert"
              />
            </button>
            <button
              onClick={() => {
                timeline.length += 1;
                forceUpdate({});
              }}
              className="w-5 h-5 rounded-full leading-4 bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
            >
              <img
                src="src/assets/icons/add.svg"
                alt="+"
                className="brightness-0 invert"
              />
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
                    className="w-4 h-4 rounded-full text-xs bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
                    onClick={() => {
                      timeline.moveSequencerUp(sequencerIndex);
                      if (selectedSequencerIndex > 0) {
                        setselectedSequencerIndex(selectedSequencerIndex - 1);
                      }
                      forceUpdate({});
                    }}
                  >
                    <img
                      src="src/assets/icons/arrow_upward.svg"
                      alt="Up"
                      className="brightness-0 invert"
                    />
                  </button>
                  <button
                    className="w-4 h-4 rounded-full text-xs bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
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
                    <img
                      src="src/assets/icons/arrow_downward.svg"
                      alt="Up"
                      className="brightness-0 invert"
                    />
                  </button>
                  <button
                    className="w-4 h-4 rounded-full text-xs bg-light text-dark hover:bg-teal-800 hover:invert hover:text-light active:bg-dark"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to remove this sequencer?"
                      );
                      if (confirmed) {
                        timeline.removeSequencer(sequencerIndex);
                      }

                      forceUpdate({});
                    }}
                  >
                    <img
                      src="src/assets/icons/close.svg"
                      alt="Up"
                      className="brightness-0 invert"
                    />
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

      <div className="absolute w-full px-8 bottom-4 flex items-end justify-between">
        {/* Logo */}
        <div className="w-32">
          <img src="src/assets/img/jsWave.svg" alt="" />
        </div>
        {/* Credits */}
        <div className="text-darkMedium flex items-center gap-2">
          <span>Crafted with love by</span>
          <a
            href="https://github.com/ruizterce/react-beats"
            className="flex items-end gap-2 hover:text-accent"
          >
            <span>ruizterce</span>
            <img
              src="src/assets/icons/github-original.svg"
              alt="github icon"
              className="invert h-5 -translate-y-[1px]"
            />
          </a>
          <span>|</span>
          <span>Powered by </span>
          <a
            href="https://github.com/Tonejs/Tone.js"
            className="flex items-center gap-2 hover:text-accent"
          >
            <span>Tone.js</span>
            <img
              src="src/assets/icons/github-original.svg"
              alt="github icon"
              className="invert h-5 -translate-y-[1px]"
            />
          </a>
        </div>
      </div>
    </div>
  );
};
export default TimelineUI;
