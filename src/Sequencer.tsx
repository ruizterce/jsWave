import { useEffect, useState, useRef } from "react";
import Instrument from "./Instrument";
import * as Tone from "tone";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Track } from "./types";

const Sequencer = () => {
  const isPlaying = useSelector((state: RootState) => state.isPlaying.value);
  const [stepLength, setStepLength] = useState<number>(16);
  const [stepArray, setStepArray] = useState<boolean[]>(Array(16).fill(false));
  const [tempo, setTempo] = useState<number>(120);

  // Initialize Instruments
  const [trackArray, setTrackArray] = useState<Track[]>([
    {
      type: "synth",
      options: { note: "C4" },
      synth: new Tone.Synth().toDestination(),
      noteArray: Array(16).fill(false),
    },
    {
      type: "sampler",
      options: { sample: "src/assets/samples/TR-808/Kick-Mid.mp3" },
      sampler: new Tone.Sampler({
        urls: { C5: "Kick-Mid.mp3" },
        baseUrl: "src/assets/samples/TR-808/",
      }).toDestination(),
      noteArray: Array(16).fill(false),
    },
  ]);

  // Load Samples
  useEffect(() => {
    const loadSamples = async () => {
      await Tone.loaded(); // Wait for all Tone.js samples to load
      console.log("Samples loaded and ready.");
    };

    loadSamples().catch((error) => {
      console.error("Error loading samples:", error);
    });
  }, []);

  // Handle tempo changes
  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
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

    const loop = Tone.Transport.scheduleRepeat((time) => {
      console.log("Current Step:", currentStep); // Debugging step index

      // Update stepArray for visual feedback
      const newStepArray = Array(16).fill(false);
      newStepArray[currentStep] = true;
      setStepArray(newStepArray);

      // Trigger track notes
      trackArrayRef.current.forEach((track, trackIndex) => {
        console.log(`Track ${trackIndex}:`, track); // Debugging track
        if (track.noteArray && track.noteArray[currentStep]) {
          console.log(
            `Triggering ${track.type} at step ${currentStep}, track ${trackIndex}`
          );
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
    }, "16n");

    return () => {
      Tone.Transport.stop();
      Tone.Transport.clear(loop);
    };
  }, []);

  // Listen to isPlaying
  useEffect(() => {
    if (isPlaying) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
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
        {stepArray.map((_step, index) => (
          <div
            key={`step-${index}`}
            className={`h-2 w-2 m-2 rounded ${
              stepArray[index]
                ? "bg-primary text-primaryContrast"
                : "bg-primaryContrast text-primary"
            }`}
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
