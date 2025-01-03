import { Sequencer } from "./sequencer";

interface SequencerUIProps {
  sequencer: Sequencer;
}

const SequencerUI: React.FC<SequencerUIProps> = ({ sequencer }) => {
  const handleNoteClick = (trackIndex, noteIndex) => {};
  return (
    <div>
      <div>{sequencer.name}</div>
      {sequencer.tracks.map((track) => {
        return (
          <div>
            <div>{track.name}</div>
            <div className="flex gap-2">
              {track.notes.map((note, index) => (
                <div
                  key={index}
                  className={`h-8 w-8 rounded text-center cursor-pointer ${
                    index % 4 === 0 ? "brightness-125" : ""
                  } ${
                    note
                      ? "bg-primary text-primaryContrast"
                      : "bg-primaryContrast text-primary"
                  }`}
                  onClick={() => {}}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SequencerUI;
