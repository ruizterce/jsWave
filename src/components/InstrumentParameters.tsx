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
    <div className="flex gap-2 p-1">
      {/*Envelope*/}
      {(track.instrument instanceof Tone.AMSynth ||
        track.instrument instanceof Tone.FMSynth ||
        track.instrument instanceof Tone.MembraneSynth ||
        track.instrument instanceof Tone.MetalSynth ||
        track.instrument instanceof Tone.MonoSynth ||
        track.instrument instanceof Tone.NoiseSynth) && (
        <div className="flex border-2 border-medium p-1  rounded-xl">
          <div className="flex flex-col items-center text-dark w-16">
            <label htmlFor="sustain">Attack</label>
            <div className="relative w-8 h-36">
              <input
                type="range"
                min={0.0001}
                max={0.5}
                step={0.0005}
                value={Number(track.instrument.envelope.attack)}
                onChange={(e) => {
                  (track.instrument as Tone.Synth).envelope.attack =
                    e.target.value;
                  forceUpdate({});
                }}
                className="w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
              />
            </div>
            <span>{Number(track.instrument.envelope.attack)}</span>
          </div>

          <div className="flex flex-col items-center text-dark w-16">
            <label htmlFor="decay">Decay</label>
            <div className="relative w-8 h-36">
              <input
                type="range"
                min={0.001}
                max={1}
                step={0.005}
                value={Number(track.instrument.envelope.decay)}
                onChange={(e) => {
                  (track.instrument as Tone.Synth).envelope.decay =
                    e.target.value;
                  forceUpdate({});
                }}
                className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
              />
            </div>
            <span>{Number(track.instrument.envelope.decay)}</span>
          </div>
          <div className="flex flex-col items-center text-dark w-16">
            <label htmlFor="sustain">Sustain</label>
            <div className="relative w-8 h-36">
              <input
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
                className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
              />
            </div>
            <span>{Number(track.instrument.envelope.sustain)}</span>
          </div>
          <div className="flex flex-col items-center text-dark w-16">
            <label htmlFor="release">Release</label>
            <div className="relative w-8 h-36">
              <input
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
                className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
              />
            </div>
            <span>{Number(track.instrument.envelope.release)}</span>
          </div>
        </div>
      )}

      {/*Portamento*/}
      {(track.instrument instanceof Tone.AMSynth ||
        track.instrument instanceof Tone.FMSynth ||
        track.instrument instanceof Tone.DuoSynth ||
        track.instrument instanceof Tone.MembraneSynth ||
        track.instrument instanceof Tone.MetalSynth ||
        track.instrument instanceof Tone.MonoSynth) && (
        <div className="flex border-2 border-medium p-1 rounded-xl">
          <div className="flex flex-col items-center text-dark w-16">
            <label htmlFor="portamento">Slide</label>
            <div className="relative w-8 h-36">
              <input
                type="range"
                min={0}
                max={1}
                step={0.005}
                value={Number(track.instrument.portamento)}
                onChange={(e) => {
                  (track.instrument as Tone.FMSynth).portamento = Number(
                    e.target.value
                  );
                  forceUpdate({});
                }}
                className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
              />
            </div>
            <span>{Number(track.instrument.portamento)}</span>
          </div>
        </div>
      )}

      {/*Harmonicity*/}
      {(track.instrument instanceof Tone.AMSynth ||
        track.instrument instanceof Tone.FMSynth ||
        track.instrument instanceof Tone.DuoSynth) && (
        <div className="flex gap-4 border-2 border-medium p-1 rounded-xl">
          <div className="flex flex-col items-center text-dark w-16">
            <label htmlFor="harmonicity">Harmony</label>
            <div className="relative w-8 h-36">
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={Number(track.instrument.harmonicity.value)}
                onChange={(e) => {
                  (track.instrument as Tone.FMSynth).harmonicity.value = Number(
                    e.target.value
                  );
                  forceUpdate({});
                }}
                className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
              />
            </div>
            <span>{Number(track.instrument.harmonicity.value)}</span>
          </div>
        </div>
      )}

      {/*Detune*/}
      {(track.instrument instanceof Tone.AMSynth ||
        track.instrument instanceof Tone.FMSynth ||
        track.instrument instanceof Tone.DuoSynth ||
        track.instrument instanceof Tone.MembraneSynth ||
        track.instrument instanceof Tone.MetalSynth ||
        track.instrument instanceof Tone.MonoSynth) && (
        <div className="flex gap-4 border-2 border-medium p-1 rounded-xl">
          <div className="flex flex-col items-center text-dark w-16">
            <label htmlFor="detune">Detune</label>
            <div className="relative w-8 h-36">
              <input
                type="range"
                min={-100}
                max={100}
                step={1}
                value={Number(track.instrument.detune.value)}
                onChange={(e) => {
                  (track.instrument as Tone.FMSynth).detune.value = Number(
                    e.target.value
                  );
                  forceUpdate({});
                }}
                className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
              />
            </div>
            <span>{Number(track.instrument.detune.value)}</span>
          </div>
        </div>
      )}

      {/*Oscillator*/}
      {(track.instrument instanceof Tone.AMSynth ||
        track.instrument instanceof Tone.FMSynth) && (
        <div className="flex gap-4 border-2 border-medium p-1 rounded-xl">
          <div className="flex flex-col gap-4 items-center text-dark ml-3">
            <div className="flex flex-col items-center">
              <label htmlFor="sourcetype">SourceType</label>
              <select
                className="text-black rounded-full w-24 text-center"
                value={track.instrument.oscillator.sourceType}
                onChange={(e) => {
                  (track.instrument as Tone.AMSynth).oscillator.sourceType = e
                    .target.value as Tone.OmniOscSourceType;
                  forceUpdate({});
                }}
              >
                <option value="fm">fm</option>
                <option value="am">am</option>
                <option value="fat">fat</option>
                <option value="pulse">pulse</option>
                <option value="pwm">pwm</option>
              </select>
            </div>

            {!["pulse", "pwm"].includes(
              track.instrument.oscillator.sourceType
            ) && (
              <div className="flex flex-col items-center">
                <label htmlFor="basetype">BaseType</label>
                <select
                  className="text-black rounded-full w-24 text-center"
                  value={track.instrument.oscillator.baseType}
                  onChange={(e) => {
                    (track.instrument as Tone.AMSynth).oscillator.baseType = e
                      .target.value as OscillatorType;
                    forceUpdate({});
                  }}
                >
                  <option value="sine">sine</option>
                  <option value="square">square</option>
                  <option value="triangle">triangle</option>
                  <option value="sawtooth">sawtooth</option>
                </select>
              </div>
            )}
          </div>

          {/* Modulation Envelope */}
          <div className="flex flex-col items-center text-dark w-16">
            <label htmlFor="sustain">ModA</label>
            <div className="relative w-8 h-36">
              <input
                type="range"
                min={0.001}
                max={1.5}
                step={0.05}
                value={Number(track.instrument.modulationEnvelope.attack)}
                onChange={(e) => {
                  (track.instrument as Tone.AMSynth).modulationEnvelope.attack =
                    e.target.value;
                  forceUpdate({});
                }}
                className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
              />
            </div>
            <span>{Number(track.instrument.modulationEnvelope.attack)}</span>
          </div>

          <div className="flex flex-col items-center text-dark w-16">
            <label htmlFor="sustain">ModD</label>
            <div className="relative w-8 h-36">
              <input
                type="range"
                min={0.001}
                max={1.5}
                step={0.05}
                value={Number(track.instrument.modulationEnvelope.decay)}
                onChange={(e) => {
                  (track.instrument as Tone.AMSynth).modulationEnvelope.decay =
                    e.target.value;
                  forceUpdate({});
                }}
                className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
              />
            </div>
            <span>{Number(track.instrument.modulationEnvelope.decay)}</span>
          </div>

          <div className="flex flex-col items-center text-dark w-16">
            <label htmlFor="sustain">ModS</label>
            <div className="relative w-8 h-36">
              <input
                type="range"
                min={0.001}
                max={1}
                step={0.05}
                value={Number(track.instrument.modulationEnvelope.sustain)}
                onChange={(e) => {
                  (
                    track.instrument as Tone.AMSynth
                  ).modulationEnvelope.sustain = Number(e.target.value);
                  forceUpdate({});
                }}
                className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
              />
            </div>
            <span>{Number(track.instrument.modulationEnvelope.sustain)}</span>
          </div>

          <div className="flex flex-col items-center text-dark w-16">
            <label htmlFor="sustain">ModR</label>
            <div className="relative w-8 h-36">
              <input
                type="range"
                min={0.001}
                max={1.5}
                step={0.05}
                value={Number(track.instrument.modulationEnvelope.release)}
                onChange={(e) => {
                  (
                    track.instrument as Tone.AMSynth
                  ).modulationEnvelope.release = e.target.value;
                  forceUpdate({});
                }}
                className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
              />
            </div>
            <span>{Number(track.instrument.modulationEnvelope.release)}</span>
          </div>

          {track.instrument.oscillator.sourceType === "pulse" && (
            <div className="flex flex-col items-center text-dark w-16">
              <label htmlFor="release">ModWdth</label>
              <div className="relative w-8 h-36">
                <input
                  id="release"
                  type="range"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={Number(track.instrument.oscillator.width?.value)}
                  onChange={(e) => {
                    const widthSignal = (track.instrument as Tone.AMSynth)
                      .oscillator.width;
                    if (widthSignal) {
                      widthSignal.value = Number(e.target.value);
                      forceUpdate({});
                    }
                  }}
                  className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
                />
              </div>
              <span>{Number(track.instrument.oscillator.width?.value)}</span>
            </div>
          )}

          {track.instrument.oscillator.sourceType === "pwm" && (
            <div className="flex flex-col items-center text-dark w-16">
              <label htmlFor="release">ModFreq</label>
              <div className="relative w-8 h-36">
                <input
                  id="release"
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={Number(
                    track.instrument.oscillator.modulationFrequency?.value
                  )}
                  onChange={(e) => {
                    const modulationFrequency = (
                      track.instrument as Tone.AMSynth
                    ).oscillator.modulationFrequency;
                    if (modulationFrequency) {
                      modulationFrequency.value = Number(e.target.value);
                      forceUpdate({});
                    }
                  }}
                  className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
                />
              </div>
              <span>
                {Number(track.instrument.oscillator.modulationFrequency?.value)}
              </span>
            </div>
          )}

          {track.instrument.oscillator.sourceType === "fat" && (
            <>
              <div className="flex flex-col items-center text-dark w-16">
                <label htmlFor="release">Count</label>
                <div className="relative w-8 h-36">
                  <input
                    id="release"
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={Number(track.instrument.oscillator.count)}
                    onChange={(e) => {
                      (track.instrument as Tone.AMSynth).oscillator.count =
                        Number(e.target.value);
                      forceUpdate({});
                    }}
                    className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
                  />
                </div>
                <span>{Number(track.instrument.oscillator.count)}</span>
              </div>

              <div className="flex flex-col items-center text-dark w-16">
                <label htmlFor="release">Spread</label>
                <div className="relative w-8 h-36">
                  <input
                    id="release"
                    type="range"
                    min={0}
                    max={1320}
                    step={44}
                    value={Number(track.instrument.oscillator.spread)}
                    onChange={(e) => {
                      (track.instrument as Tone.AMSynth).oscillator.spread =
                        Number(e.target.value);
                      forceUpdate({});
                    }}
                    className="absolute w-30 h-30 -translate-x-12 translate-y-16 -rotate-90 accent-secondary"
                  />
                </div>
                <span>{Number(track.instrument.oscillator.spread)}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InstrumentParameters;

/* track.instrument instanceof Tone.AMSynth ||
  track.instrument instanceof Tone.FMSynth ||
  track.instrument instanceof Tone.DuoSynth ||
  track.instrument instanceof Tone.MembraneSynth ||
  track.instrument instanceof Tone.MetalSynth ||
  track.instrument instanceof Tone.MonoSynth ||
  track.instrument instanceof Tone.NoiseSynth ||
  track.instrument instanceof Tone.PluckSynth ||
  track.instrument instanceof Tone.PolySynth */
