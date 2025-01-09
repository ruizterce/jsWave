import TimelineUI from "./components/TimelineUI";
import { initDemoSong } from "./utils/initDemoSong";

// Init timeline with a demo song
const timeline = initDemoSong();

const App = () => {
  return (
    <div className="p-2 flex flex-col gap-4 items-center h-screen min-h-[400px] w-full overflow-auto dark-mode">
      {timeline ? <TimelineUI timeline={timeline} /> : "No timeline"}
    </div>
  );
};

export default App;
