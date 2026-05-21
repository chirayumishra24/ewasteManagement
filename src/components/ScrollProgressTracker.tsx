interface ScrollProgressTrackerProps {
  progress: number; // 0 to 1
  biomeColor: string;
}

export default function ScrollProgressTracker({
  progress,
  biomeColor,
}: ScrollProgressTrackerProps) {
  return (
    <div
      className="scroll-progress-bar"
      style={{
        transform: `scaleX(${progress})`,
        '--biome-active': biomeColor,
      } as React.CSSProperties}
    />
  );
}
