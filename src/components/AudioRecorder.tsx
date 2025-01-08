import React, { useState, useRef } from "react";
import * as Tone from "tone";

interface AudioRecorderProps {
  handlePlay: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ handlePlay }) => {
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
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-2 rounded ${
          isRecording ? "bg-red-500" : "bg-accent"
        } text-white rounded`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && (
        <div className="flex gap-2  items-center">
          <a
            href={audioURL}
            download="recording.webm"
            className="px-2 rounded bg-secondary"
          >
            Download Recording
          </a>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
