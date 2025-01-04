import { useState } from "react";
import { Timeline } from "./timeline";

interface TimelineUIProps {
  timeline: Timeline;
}
const TimelineUI: React.FC<TimelineUIProps> = ({ timeline }) => {
  const [, forceUpdate] = useState({}); // Dummy state to trigger re-render

  const handleBlockClick = (sequencerIndex: number, barIndex: number) => {
    if (timeline.events[sequencerIndex][barIndex]) {
      timeline.removeBlock(sequencerIndex, barIndex);
    } else {
      timeline.addBlock(sequencerIndex, barIndex);
    }

    forceUpdate({});
  };

  return (
    <div>
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
