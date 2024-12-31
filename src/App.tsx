import PlayMenu from "./PlayMenu";
import Sequencer from "./Sequencer";

const App = () => {
  return (
    <div className="max-w-lg m-auto p-2 flex flex-col gap-4 items-center">
      <PlayMenu />
      <Sequencer />
    </div>
  );
};

export default App;
