import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store";
import { play, stop } from "./store/isPlayingSlice";

const PlayMenu = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const dispatch = useDispatch();

  const handlePlay = () => {
    dispatch(play());
  };

  const handleStop = () => {
    dispatch(stop());
  };

  return (
    <div>
      <button onClick={handlePlay} disabled={isPlaying}>
        Play
      </button>
      <button onClick={handleStop} disabled={!isPlaying}>
        Stop
      </button>
    </div>
  );
};

export default PlayMenu;
