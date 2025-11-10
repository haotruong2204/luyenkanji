"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface DailyProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number;
  goal: number;
  label?: string;
  showPercentage?: boolean;
}

export function DailyProgress({
  current,
  goal,
  label = "Mục tiêu hôm nay",
  showPercentage = true,
  className,
  ...props
}: DailyProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const isCompleted = current >= goal;

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{isCompleted ? "✅" : "🎯"}</span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-primary text-sm font-bold">
          {current}/{goal}
          {showPercentage && (
            <span className="text-muted-foreground ml-1 text-xs">
              ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      </div>

      <Progress value={percentage} className="h-2" />

      {isCompleted && (
        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <span>🎉</span>
          <span>Xuất sắc! Mục tiêu hoàn thành</span>
        </div>
      )}
    </div>
  );
}
