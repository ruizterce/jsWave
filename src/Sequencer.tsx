import { useEffect, useState, useMemo } from "react";
import Synth from "./Synth";
import * as Tone from "tone";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store";
import { increment, setValue, setLength } from "./store/stepCounterSlice";
import { Track } from "./types";
import Sampler from "./Sampler";

const Sequencer = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const stepCounter = useSelector((state: RootState) => state.stepCounter);
  const [stepLength, setStepLength] = useState<number>(16);
  const [stepArray, setStepArray] = useState<boolean[]>([]);
  const [tempo, setTempo] = useState<number>(120);
  const [trackArray, setTrackArray] = useState<Track[]>([
    { type: "synth", options: { note: "C4" } },
    {
      type: "sampler",
      options: { sample: "src/assets/samples/TR-808/Kick-Mid.mp3" },
    },
    {
      type: "sampler",
      options: { sample: "src/assets/samples/TR-808/Snare-Mid.mp3" },
    },
    {
      type: "sampler",
      options: { sample: "src/assets/samples/TR-808/Clap.mp3" },
    },
    {
      type: "sampler",
      options: { sample: "src/assets/samples/TR-808/Hihat.mp3" },
    },
  ]);
  const dispatch = useDispatch();
  const Transport = Tone.getTransport();

  const mountTrack = (track: Track) => {
    switch (track.type) {
      case "synth":
        return <Synth options={track.options} />;
      case "sampler":
        return <Sampler options={track.options} />;
    }
  };

  // Handle tempo changes
  useEffect(() => {
    Transport.bpm.value = tempo;
  }, [Transport.bpm, tempo]);

  // Initialize Loop
  const loop = useMemo(() => {
    return new Tone.Loop((time) => {
      console.log(time);
      dispatch(increment());
    }, "8n");
  }, [dispatch]);

  useEffect(() => {
    loop.start(0);
  }, [loop]);

  // Initialize stepLength
  useEffect(() => {
    setStepLength(stepCounter.length);
  }, [stepCounter.length]);

  // Handle changes on stepLength
  useEffect(() => {
    dispatch(setLength(stepLength));
    setStepArray(Array(stepLength).fill(false));
  }, [dispatch, stepLength]);

  // Set stepArray active step
  useEffect(() => {
    setStepArray((prevArray) =>
      prevArray.map((_step, i) => (i === stepCounter.value - 1 ? true : false))
    );
  }, [stepCounter.value]);

  // Handle trackArray
  useEffect(() => {
    // TODO
  }, []);

  // Listen to isPlaying
  useEffect(() => {
    if (isPlaying) {
      Transport.start();
    } else {
      Transport.stop();
      dispatch(setValue(0));
    }
  }, [Transport, dispatch, isPlaying, loop]);

  return (
    <div className="flex flex-col gap-2 ">
      {/* Controllers */}
      <div className="p-2 flex gap-2 rounded bg-light">
        <label htmlFor="tempo">Tempo: </label>
        <input
          id="tempo"
          name="tempo"
          type="number"
          value={tempo}
          onChange={(e) => {
            setTempo(parseInt(e.target.value));
          }}
          className="w-10"
        />
        <label htmlFor="steps">Steps: </label>
        <input
          id="steps"
          name="steps"
          type="number"
          value={stepLength}
          onChange={(e) => {
            setStepLength(parseInt(e.target.value));
          }}
          className="w-10"
        />
      </div>
      <div className="flex gap-2">
        {stepArray.map((_step, index) => (
          <div
            key={`step-${index}`}
            className={`h-2 w-2 m-2 rounded ${
              stepArray[index]
                ? "bg-primary text-primaryContrast"
                : "bg-primaryContrast text-primary"
            }`}
          ></div>
        ))}
      </div>
      {/* Tracks */}
      {trackArray.map((track: Track) => {
        return mountTrack(track);
      })}
    </div>
  );
};

export default Sequencer;
