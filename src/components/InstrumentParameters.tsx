import { useState } from "react";
import * as Tone from "tone";
import { Track } from "../classes/track";

interface InstrumentParametersProps {
  track: Track;
}

const InstrumentParameters: React.FC<InstrumentParametersProps> = ({
  track,
}) => {
  const [, forceUpdate] = useState({});

  return (
    <div>
      {track.instrument instanceof Tone.Synth && (
        <div className="flex gap-4 ">
          <div className="flex flex-col items-center text-dark">
            <label htmlFor="sustain">Attack</label>
            <input
              id="attack"
              type="range"
              min={0.001}
              max={1.5}
              step={0.05}
              value={Number(track.instrument.envelope.attack)}
              onChange={(e) => {
                (track.instrument as Tone.Synth).envelope.attack =
                  e.target.value;
                forceUpdate({});
              }}
              className="w-20 h-20 -rotate-90 accent-secondary"
            />
            <span>{Number(track.instrument.envelope.attack)}</span>
          </div>

          <div className="flex flex-col items-center text-dark">
            <label htmlFor="decay">Decay</label>
            <input
              id="decay"
              type="range"
              min={0.001}
              max={2}
              step={0.05}
              value={Number(track.instrument.envelope.decay)}
              onChange={(e) => {
                (track.instrument as Tone.Synth).envelope.decay =
                  e.target.value;
                forceUpdate({});
              }}
              className="w-20 h-20 -rotate-90 accent-secondary"
            />
            <span>{Number(track.instrument.envelope.decay)}</span>
          </div>
          <div className="flex flex-col items-center text-dark">
            <label htmlFor="sustain">Sustain</label>
            <input
              id="sustain"
              type="range"
              min={0.001}
              max={1}
              step={0.05}
              value={Number(track.instrument.envelope.sustain)}
              onChange={(e) => {
                (track.instrument as Tone.Synth).envelope.sustain = Number(
                  e.target.value
                );
                forceUpdate({});
              }}
              className="w-20 h-20 -rotate-90 accent-secondary"
            />
            <span>{Number(track.instrument.envelope.sustain)}</span>
          </div>
          <div className="flex flex-col items-center text-dark">
            <label htmlFor="release">Release</label>
            <input
              id="release"
              type="range"
              min={0.001}
              max={3}
              step={0.05}
              value={Number(track.instrument.envelope.release)}
              onChange={(e) => {
                (track.instrument as Tone.Synth).envelope.release =
                  e.target.value;
                forceUpdate({});
              }}
              className="w-20 h-20 -rotate-90 accent-secondary"
            />
            <span>{Number(track.instrument.envelope.release)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstrumentParameters;
