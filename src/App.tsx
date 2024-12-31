import { useEffect, useMemo } from "react";
import PlayMenu from "./PlayMenu";
import Synth from "./Synth";
import * as Tone from "tone";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store";
import {
  increment,
  decrement,
  reset,
  setValue,
} from "./store/stepCounterSlice";

const App = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const stepCounter = useSelector(
    (state: RootState) => state.stepCounter.value
  );

  const dispatch = useDispatch();

  const Transport = Tone.getTransport();
  Transport.bpm.value = 80;

  const loop = useMemo(() => {
    return new Tone.Loop((time) => {
      console.log(time);
      dispatch(increment());
    }, "8n");
  }, [dispatch]);

  useEffect(() => {
    loop.start(0);
  }, [loop]);

  useEffect(() => {
    console.log(isPlaying);
    if (isPlaying) {
      Transport.start();
    } else {
      Transport.stop();
      dispatch(setValue(0));
    }
  }, [Transport, dispatch, isPlaying, loop]);

  return (
    <div className="max-w-lg m-auto p-2 flex flex-col gap-4 items-center">
      <PlayMenu />
      <Synth />
    </div>
  );
};

export default App;
