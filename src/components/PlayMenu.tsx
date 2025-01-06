import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { play, stop } from "../store/isPlayingSlice";

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
    <div className="flex gap-2">
      <button
        onClick={handlePlay}
        disabled={isPlaying}
        className={`p-2 rounded ${
          isPlaying
            ? "bg-primary text-primaryContrast"
            : "bg-primaryContrast text-primary shadow-xl"
        }`}
      >
        Play
      </button>
      <button
        onClick={handleStop}
        disabled={!isPlaying}
        className={`p-2 rounded ${
          isPlaying
            ? "bg-primaryContrast text-primary "
            : "bg-primary text-primaryContrast"
        }`}
      >
        Stop
      </button>
    </div>
  );
};

export default PlayMenu;
