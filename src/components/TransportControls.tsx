import { useState } from "react";
import * as Tone from "tone";

Tone.getTransport().bpm.value = 120;
Tone.getTransport().loop = true;
Tone.getTransport().loopStart = "0:0:0";
Tone.getTransport().loopEnd = "4:0:0";

const TransportControls = () => {
  const [, forceUpdate] = useState({});

  const handlePlay = () => {
    Tone.getTransport().start();
  };

  const handlePause = () => {
    Tone.getTransport().pause();
  };

  const handleStop = () => {
    Tone.getTransport().stop();
  };
  return (
    <>
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
    </>
  );
};

export default TransportControls;
