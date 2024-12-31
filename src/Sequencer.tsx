import { useEffect, useState, useMemo } from "react";
import Synth from "./Synth";
import * as Tone from "tone";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store";
import { increment, setValue } from "./store/stepCounterSlice";

const Sequencer = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const stepCounter = useSelector((state: RootState) => state.stepCounter);
  const [stepArray, setStepArray] = useState<boolean[]>([]);
  const dispatch = useDispatch();

  const Transport = Tone.getTransport();
  Transport.bpm.value = 80;

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

  // Initialize stepArray
  useEffect(() => {
    setStepArray(Array(stepCounter.length).fill(false));
  }, [stepCounter.length]);

  // Set stepArray active step
  useEffect(() => {
    setStepArray((prevArray) =>
      prevArray.map((_step, i) => (i === stepCounter.value - 1 ? true : false))
    );
  }, [stepCounter.value]);

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
    <div className="flex flex-col gap-2">
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
      <Synth />
    </div>
  );
};

export default Sequencer;
