import { useState, useEffect } from "react";
import * as Tone from "tone";
import { Timeline } from "./timeline";

interface TimelineUIProps {
  timeline: Timeline;
}
const TimelineUI: React.FC<TimelineUIProps> = ({ timeline }) => {
  const [progress, setProgress] = useState(0);
  const [, forceUpdate] = useState({}); // Dummy state to trigger re-render

  // Update progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(Tone.getTransport().progress);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleBlockClick = (sequencerIndex: number, barIndex: number) => {
    if (timeline.events[sequencerIndex][barIndex]) {
      timeline.removeBlock(sequencerIndex, barIndex);
    } else {
      timeline.addBlock(sequencerIndex, barIndex);
    }

    forceUpdate({});
  };

  const activeBlock = Math.floor(progress * timeline.length);

  return (
    <div>
      {/* Progress Tracker */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: timeline.length }, (_, index) => (
          <div
            key={`progress-square-${index}`}
            className={`w-4 h-4 rounded-full ${
              index === activeBlock
                ? "bg-primary text-primaryContrast"
                : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>

      {/* Timeline Blocks */}
      <div className="flex flex-col gap-2">
        {timeline.events.map((sequencer, sequencerIndex) => {
          return (
            <div
              key={`timeline-sequencer-${sequencerIndex}`}
              className="flex gap-2"
            >
              {sequencer.map((_e, barIndex) => {
                return (
                  <div
                    key={`timeline-bar-${barIndex}`}
                    className={`w-4 h-4 ${
                      timeline.events[sequencerIndex][barIndex]
                        ? "bg-primary text-primaryContrast"
                        : "bg-primaryContrast text-primary"
                    }`}
                    onClick={() => {
                      handleBlockClick(sequencerIndex, barIndex);
                    }}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TimelineUI;
