import { useState, useEffect } from "react";
import * as Tone from "tone";
import { Timeline } from "../classes/timeline";
import SequencerUI from "./SequencerUI";
import React from "react";

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
    <div className="relative flex flex-col gap-2 items-center h-full bg-light rounded-3xl p-8 shadow-xl">
      {/* Timeline Controls */}
      <div className="absolute left-12 top-9 flex gap-1 items-center px-4 py-1  rounded-full text-dark">
        <span className="h-5 rounded-full text-center ">
          BPM
          <b className="bg-light rounded-full ml-1 px-3">
            {Math.round(Tone.getTransport().bpm.value)}{" "}
          </b>
        </span>
        <button
          onClick={() => {
            Tone.getTransport().bpm.value = Math.round(
              Tone.getTransport().bpm.value - 10
            );
            forceUpdate({});
          }}
          className="w-5 h-5 rounded-full leading-4 bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
        >
          --
        </button>
        <button
          onClick={() => {
            Tone.getTransport().bpm.value = Math.round(
              Tone.getTransport().bpm.value - 1
            );
            forceUpdate({});
          }}
          className="w-4 h-4 rounded-full leading-4 bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
        >
          -
        </button>
        <button
          onClick={() => {
            Tone.getTransport().bpm.value = Math.round(
              Tone.getTransport().bpm.value + 1
            );
            forceUpdate({});
          }}
          className="w-4 h-4 rounded-full leading-4 bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
        >
          +
        </button>
        <button
          onClick={() => {
            Tone.getTransport().bpm.value = Math.round(
              Tone.getTransport().bpm.value + 10
            );
            forceUpdate({});
          }}
          className="w-5 h-5 rounded-full leading-4 bg-light text-dark hover:bg-darkMedium hover:text-light active:bg-dark"
        >
          ++
        </button>
      </div>
      <div className="flex gap-2 w-full justify-center items-center bg-lightMedium rounded-2xl p-2">
        <button
          onClick={handlePlay}
          disabled={Tone.getTransport().state === "started"}
          className={`px-2 rounded ${
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
          className={`px-2 rounded ${
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
          className={`px-2 rounded ${
            Tone.getTransport().state === "stopped"
              ? "bg-primaryContrast text-primary "
              : "bg-primary text-primaryContrast"
          }`}
        >
          Stop
        </button>
      </div>

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
