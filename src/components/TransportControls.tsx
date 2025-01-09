import { useState } from "react";
import * as Tone from "tone";
import { Timeline } from "../classes/timeline";
import AudioRecorder from "./AudioRecorder";

interface TransportControlsProps {
  timeline: Timeline;
  selectedSequencerIndex: number;
  isSequencerLoop: boolean;
  setIsSequencerLoop: (isSequencerLoop: boolean) => void;
}
Tone.getTransport().bpm.value = 120;
Tone.getTransport().loop = true;
Tone.getTransport().loopStart = "0:0:0";
Tone.getTransport().loopEnd = "4:0:0";

const TransportControls: React.FC<TransportControlsProps> = ({
  timeline,
  selectedSequencerIndex,
  isSequencerLoop,
  setIsSequencerLoop,
}) => {
  const [, forceUpdate] = useState({});

  const handlePlay = () => {
    if (isSequencerLoop) {
      Tone.getTransport().position = Tone.getTransport().loopStart;
      Tone.getTransport().start();
    } else {
      Tone.getTransport().start();
    }
  };

  const handlePause = () => {
    Tone.getTransport().pause();
  };

  const handleStop = () => {
    Tone.getTransport().stop();
  };

  const toggleSequencerLoop = () => {
    handleStop();
    if (isSequencerLoop) {
      // Remove phantom block and reset transport
      setTimeout(() => {
        timeline.isSequencerLoop = false;
        Tone.getTransport().cancel(Tone.getTransport().loopStart);
        Tone.getTransport().loopStart = "0:0:0";
        Tone.getTransport().loopEnd = timeline.length + ":0:0";
        timeline.removeBlock(selectedSequencerIndex, timeline.length);
        timeline.sequencers[selectedSequencerIndex].events.pop();
        setIsSequencerLoop(false);
      }, 100);
    } else {
      // Create a phantom block loop after the last timeline block
      timeline.isSequencerLoop = true;
      Tone.getTransport().loopStart = timeline.length + ":0:0";
      Tone.getTransport().loopEnd = Number(timeline.length + 1) + ":0:0";
      Tone.getTransport().cancel(Tone.getTransport().loopStart);
      timeline.addBlock(selectedSequencerIndex, timeline.length);
      timeline.sequencers[selectedSequencerIndex].events.pop();
      setIsSequencerLoop(true);
    }
  };
  return (
    <div className="relative flex gap-2 w-full justify-center items-center bg-lightMedium  rounded-2xl p-2">
      <div className="absolute left-2 flex gap-1 items-center px-4 py-1  rounded-full text-dark">
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
          <img
            src="/assets/icons/keyboard_double_arrow_left.svg"
            alt="<<"
            className="invert brightness-0"
          />
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
          <img
            src="/assets/icons/keyboard_arrow_left.svg"
            alt="<"
            className="invert brightness-0"
          />
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
          <img
            src="/assets/icons/keyboard_arrow_right.svg"
            alt=">"
            className="invert brightness-0"
          />
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
          <img
            src="/assets/icons/keyboard_double_arrow_right.svg"
            alt=">>"
            className="invert brightness-0"
          />
        </button>
      </div>

      <button
        onClick={handlePlay}
        disabled={Tone.getTransport().state === "started"}
        className={`px-2 rounded h ${
          Tone.getTransport().state !== "started"
            ? "bg-primary text-primaryContrast hover:bg-darkMedium hover:invert"
            : "bg-primaryContrast text-primary shadow-xl"
        }`}
      >
        <img
          src="/assets/icons/play_arrow.svg"
          alt="Play"
          className={`brightness-0 ${
            Tone.getTransport().state !== "started" ? "" : "invert"
          }`}
        />
      </button>
      <button
        onClick={handlePause}
        disabled={Tone.getTransport().state !== "started"}
        className={`px-2 rounded ${
          Tone.getTransport().state !== "started"
            ? "bg-primaryContrast text-primary"
            : "bg-primary text-primaryContrast hover:bg-darkMedium hover:invert"
        }`}
      >
        <img
          src="/assets/icons/pause.svg"
          alt="Pause"
          className={`brightness-0 ${
            Tone.getTransport().state !== "started" ? "invert" : ""
          }`}
        />
      </button>
      <button
        onClick={handleStop}
        disabled={Tone.getTransport().state === "stopped"}
        className={`px-2 rounded ${
          Tone.getTransport().state === "stopped"
            ? "bg-primaryContrast text-primary"
            : "bg-primary text-primaryContrast hover:bg-darkMedium hover:invert"
        }`}
      >
        <img
          src="/assets/icons/stop.svg"
          alt="Stop"
          className={`brightness-0 ${
            Tone.getTransport().state === "stopped" ? "invert" : ""
          }`}
        />
      </button>
      <button
        onClick={toggleSequencerLoop}
        className={`px-2 rounded ${
          isSequencerLoop
            ? "bg-red-200 text-medium"
            : "bg-primary text-primaryContrast hover:bg-darkMedium hover:invert"
        }`}
      >
        Sequencer Loop
      </button>
      <AudioRecorder handlePlay={handlePlay} handleStop={handleStop} />
    </div>
  );
};

export default TransportControls;
