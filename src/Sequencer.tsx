import { useEffect, useState, useRef } from "react";
import Instrument from "./Instrument";
import * as Tone from "tone";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Track } from "./types";

const Sequencer = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const [stepLength, setStepLength] = useState<number>(16);
  const [tempo, setTempo] = useState<number>(120);
  const stepRefs = useRef<HTMLDivElement[]>([]); // References to visual step elements

  // Initialize Instruments
  const [trackArray, setTrackArray] = useState<Track[]>([
    {
      name: "Synth",
      type: "synth",
      options: { note: "C4" },
      synth: new Tone.Synth().toDestination(),
      noteArray: Array(16).fill(false),
    },
    {
      name: "Kick-Mid",
      type: "sampler",
      sampler: undefined,
      noteArray: Array(16).fill(false),
    },
    {
      name: "Snare-Mid",
      type: "sampler",
      sampler: undefined,
      noteArray: Array(16).fill(false),
    },
    {
      name: "Clap",
      type: "sampler",
      sampler: undefined,
      noteArray: Array(16).fill(false),
    },
    {
      name: "Hihat",
      type: "sampler",
      sampler: undefined,
      noteArray: Array(16).fill(false),
    },
  ]);

  // Load Samples only once when the component mounts
  useEffect(() => {
    const loadSamples = async () => {
      try {
        const samplerTracks = trackArray.map((track) => {
          if (track.type === "sampler" && track.sampler === undefined) {
            console.log("creating sampler");
            const sampler = new Tone.Sampler(
              {
                C5: `${track.name}.mp3`,
              },
              {
                baseUrl: `src/assets/samples/TR-808/`,
              }
            ).toDestination();

            return {
              ...track,
              sampler,
            };
          }
          return track;
        });

        setTrackArray(samplerTracks); // Update trackArray with initialized samplers
        await Tone.loaded(); // Wait for all samples to load
        console.log("Samples loaded and ready.");
      } catch (error) {
        console.error("Error loading samples:", error);
      }
    };

    loadSamples().catch((err) => {
      console.log("Error loading samples: " + err);
    });
  }, []);

  // Handle tempo changes
  useEffect(() => {
    Tone.getTransport().bpm.value = tempo;
  }, [tempo]);

  // Store and update trackArray
  const trackArrayRef = useRef(trackArray);

  useEffect(() => {
    trackArrayRef.current = trackArray;
  }, [trackArray]);
  // main scheduleRepeat Loop
  useEffect(() => {
    const stepLength = trackArrayRef.current[0]?.noteArray?.length || 16;
    let currentStep = 0;

    const loop = Tone.getTransport().scheduleRepeat((time) => {
      // Trigger track notes
      trackArrayRef.current.forEach((track) => {
        if (track.noteArray && track.noteArray[currentStep]) {
          switch (track.type) {
            case "synth":
              track.synth?.triggerAttackRelease(
                track.options?.note || "C4",
                "8n",
                time
              );
              break;
            case "sampler":
              track.sampler?.triggerAttackRelease("C5", "8n", time);
              break;
          }
        }
      });
      currentStep = (currentStep + 1) % stepLength;

      // currentStep visual feedback - Manipulating DOM directly to optimize performance
      Tone.getDraw().schedule(function () {
        if (stepRefs.current.length) {
          // Reset previous step
          const prevStepRefIndex =
            (currentStep - 2 + stepRefs.current.length) %
            stepRefs.current.length;

          const prevStepRef = stepRefs.current[prevStepRefIndex];
          if (prevStepRef) {
            prevStepRef.classList.remove("bg-primary", "text-primaryContrast");
            prevStepRef.classList.add("bg-primaryContrast", "text-primary");
          }

          // Draw current step
          const currentStepRefIndex =
            currentStep > 0 ? currentStep - 1 : stepLength - 1;
          const currentStepRef = stepRefs.current[currentStepRefIndex];

          if (currentStepRef) {
            currentStepRef.classList.add("bg-primary", "text-primaryContrast");
            currentStepRef.classList.remove(
              "bg-primaryContrast",
              "text-primary"
            );
          }
        }
      }, time);
    }, "16n");

    return () => {
      Tone.getTransport().stop();
      Tone.getTransport().clear(loop);
    };
  }, []);

  // Listen to isPlaying
  useEffect(() => {
    if (isPlaying) {
      Tone.getTransport().start();
    } else {
      Tone.getTransport().stop();
    }
  }, [isPlaying]);

  // Update track notes
  const updateTrackNoteArray = (index: number, newNoteArray: boolean[]) => {
    setTrackArray((prev) => {
      const updatedTracks = [...prev];
      updatedTracks[index] = {
        ...updatedTracks[index],
        noteArray: newNoteArray,
      };
      return updatedTracks;
    });
  };

  return (
    <div className="flex flex-col gap-2 ">
      {/* Controllers */}
      <div className="p-2 flex gap-2 rounded bg-light">
        <label htmlFor="tempo">Tempo: </label>
        <input
          id="tempo"
          name="tempo"
          type="number"
          value={tempo}
          onChange={(e) => {
            setTempo(parseInt(e.target.value));
          }}
          className="w-10"
        />
        <label htmlFor="steps">Steps: </label>
        <input
          id="steps"
          name="steps"
          type="number"
          value={stepLength}
          onChange={(e) => {
            setStepLength(parseInt(e.target.value));
          }}
          className="w-10"
        />
      </div>
      {/* Step Visual Feedback */}
      <div className="flex gap-2">
        {Array.from({ length: stepLength }).map((_step, index) => (
          <div
            key={`step-${index}`}
            ref={(el) => (stepRefs.current[index] = el!)} // Assign ref dynamically
            className={`h-2 w-2 m-2 rounded bg-primaryContrast text-primary`}
          ></div>
        ))}
      </div>
      {/* Tracks */}
      {trackArray.map((track, index) => {
        return (
          <Instrument
            key={index}
            track={track}
            onUpdate={(newNoteArray) =>
              updateTrackNoteArray(index, newNoteArray)
            }
          />
        );
      })}
    </div>
  );
};

export default Sequencer;
