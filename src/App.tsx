import { useEffect } from "react";
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

  const dispatch = useDispatch();

  const Transport = Tone.getTransport();
  Transport.bpm.value = 80;

  const loop = new Tone.Loop((time) => {
    console.log(time);
    dispatch(increment());
  }, "8n");

  useEffect(() => {
    loop.start(0);
  }, []);

  useEffect(() => {
    console.log(isPlaying);
    if (isPlaying) {
      Transport.start();
    } else {
      Transport.stop();
      dispatch(setValue(0));
    }
  }, [isPlaying, loop]);

  return (
    <>
      <PlayMenu />
      <Synth />
    </>
  );
};

export default App;
