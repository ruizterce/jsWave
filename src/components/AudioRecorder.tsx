import React, { useState, useRef } from "react";
import * as Tone from "tone";

interface AudioRecorderProps {
  handlePlay: () => void;
  handleStop: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  handlePlay,
  handleStop,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      if (Tone.getContext().state !== "running") {
        await Tone.getContext().resume(); // Ensure Tone.js context is active
      }

      const dest = Tone.getContext().createMediaStreamDestination();
      Tone.getDestination().connect(dest); // Route Tone.js output to the recorder

      const mediaRecorder = new MediaRecorder(dest.stream);
      handlePlay();
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        audioChunks.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to resume Tone.js context:", error);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      handleStop();
      setTimeout(() => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
      }, 500);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-2 rounded ${
          isRecording
            ? "bg-white hover:bg-darkMedium"
            : "bg-red-500 hover:bg-darkMedium hover:invert"
        } rounded`}
      >
        <img
          src={`/assets/icons/${
            isRecording ? "radio_button_checked" : "radio_button_unchecked"
          }.svg`}
          alt={`${isRecording ? "Stop Recording" : "Start Recording"}`}
          className={`${
            isRecording
              ? "invert-50 sepia-100 saturate-[100] hue-rotate-180 brightness-100 contrast-100"
              : "brightness-0 "
          }`}
        />
      </button>
      {audioURL && (
        <div className="relative flex gap-2  items-center">
          {isRecording ? (
            <span className="absolute text-red-500">Recording...</span>
          ) : (
            <a
              href={audioURL}
              download="recording.webm"
              className="absolute w-10 px-2 rounded bg-secondary hover:bg-medium hover:invert"
            >
              <img
                src="/assets/icons/download.svg"
                alt="Download"
                className="brightness-0 "
              />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
