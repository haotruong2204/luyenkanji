"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({
  value,
  duration = 2000,
  suffix = "",
  prefix = "",
  className,
  ...props
}: AnimatedCounterProps) {
  const [count, setCount] = React.useState(0);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, isMounted]);

  if (!isMounted) {
    return (
      <span className={className} {...props}>
        {prefix}0{suffix}
      </span>
    );
  }

  return (
    <span className={cn("tabular-nums", className)} {...props}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
