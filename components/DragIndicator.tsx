"use client";

interface DragIndicatorProps {
  visible: boolean;
}

export default function DragIndicator({ visible }: DragIndicatorProps) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-5 z-40 md:bottom-6 md:left-6"
      aria-hidden="true"
    >
      <p className="font-sans text-[9px] tracking-[0.3em] text-ink/35">
        DRAG TO EXPLORE
      </p>
      <p className="mt-0.5 font-sans text-[10px] text-ink/45">拖动探索</p>
    </div>
  );
}
