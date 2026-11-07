"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const reduce = useReducedMotion();
  const [currentSpeed, setCurrentSpeed] = React.useState(speed);
  const translation = useMotionValue(0);
  const firstRef = React.useRef<HTMLDivElement>(null);
  const speedRef = React.useRef(speed);
  const vertical = direction === "vertical";
  speedRef.current = currentSpeed;

  React.useEffect(() => {
    if (reduce) {
      translation.set(0);
      return;
    }
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const node = firstRef.current;
      const span = node ? (vertical ? node.offsetHeight : node.offsetWidth) + gap : 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (span > gap) {
        let y = translation.get() + (reverse ? 1 : -1) * speedRef.current * dt;
        while (y <= -span) y += span;
        while (y > 0) y -= span;
        translation.set(y);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [gap, reverse, reduce, translation, vertical]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => setCurrentSpeed(speedOnHover),
        onHoverEnd: () => setCurrentSpeed(speed),
      }
    : {};

  const track = {
    display: "flex",
    flexDirection: vertical ? ("column" as const) : ("row" as const),
    gap,
  };

  return (
    <div className={cn("overflow-hidden", vertical ? "box-border min-w-0 w-full flex-1 basis-0 px-2" : "w-full", className)}>
      <motion.div
        className={cn("flex w-max", vertical && "w-full")}
        style={{
          ...(vertical ? { y: translation } : { x: translation }),
          ...track,
        }}
        {...hoverProps}
      >
        <div ref={firstRef} style={track} className={vertical ? "w-full" : undefined}>
          {children}
        </div>
        <div
          aria-hidden
          ref={(node) => {
            if (node) node.inert = true;
          }}
          style={track}
          className={vertical ? "w-full" : undefined}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
