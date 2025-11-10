"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AchievementBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: string;
  title: string;
  description?: string;
  unlocked?: boolean;
  progress?: number; // 0-100 for locked badges
  compact?: boolean;
}

export function AchievementBadge({
  icon,
  title,
  description,
  unlocked = false,
  progress,
  compact = false,
  className,
  ...props
}: AchievementBadgeProps) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2",
          unlocked
            ? "border-primary/20 bg-primary/5"
            : "border-border bg-muted/50",
          className
        )}
        {...props}
      >
        <span
          className={cn("text-2xl", !unlocked && "opacity-40 grayscale filter")}
        >
          {icon}
        </span>
        <span
          className={cn(
            "text-sm font-medium",
            unlocked ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {title}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all",
        unlocked
          ? "border-primary/20 bg-primary/5 hover:border-primary/40 hover:shadow-md"
          : "border-border bg-muted/30",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-full text-4xl",
          unlocked
            ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg"
            : "bg-muted"
        )}
      >
        <span className={cn(!unlocked && "opacity-40 grayscale filter")}>
          {icon}
        </span>
      </div>

      <div className="space-y-1">
        <h4
          className={cn(
            "font-semibold",
            unlocked ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {title}
        </h4>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>

      {!unlocked && progress !== undefined && (
        <div className="w-full">
          <div className="bg-muted mb-1 h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-muted-foreground text-xs">{progress}%</p>
        </div>
      )}

      {unlocked && (
        <div className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
          <span>✓</span>
          <span>Đã mở khóa</span>
        </div>
      )}
    </div>
  );
}
