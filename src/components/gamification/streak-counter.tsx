"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface StreakCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStreak: number;
  longestStreak?: number;
  compact?: boolean;
}

export function StreakCounter({
  currentStreak,
  longestStreak,
  compact = false,
  className,
  ...props
}: StreakCounterProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 dark:bg-orange-950/20",
          className
        )}
        {...props}
      >
        <span className="text-2xl">🔥</span>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
            {currentStreak}
          </span>
          <span className="text-muted-foreground text-xs">ngày</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-card flex flex-col items-center gap-3 rounded-xl border p-6",
        className
      )}
      {...props}
    >
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-4xl shadow-lg">
          🔥
        </div>
        {currentStreak > 0 && (
          <div className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white shadow-md dark:bg-orange-500">
            {currentStreak}
          </div>
        )}
      </div>

      <div className="text-center">
        <div className="mb-1 text-2xl font-bold">{currentStreak} ngày</div>
        <div className="text-muted-foreground text-sm">Streak hiện tại</div>
      </div>

      {longestStreak !== undefined && longestStreak > currentStreak && (
        <div className="text-muted-foreground mt-2 text-center text-xs">
          Kỷ lục: {longestStreak} ngày 🏆
        </div>
      )}
    </div>
  );
}
