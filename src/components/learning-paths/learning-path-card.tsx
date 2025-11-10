"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LearningPathCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  kanjiCount: number;
  duration: string;
  progress?: number;
  learners?: number;
  thumbnail?: string;
  color?: string;
}

const levelColors = {
  N5: "from-green-500 to-emerald-600",
  N4: "from-blue-500 to-cyan-600",
  N3: "from-yellow-500 to-orange-600",
  N2: "from-orange-500 to-red-600",
  N1: "from-purple-500 to-pink-600",
};

const levelBadgeColors = {
  N5: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  N4: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  N3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  N2: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  N1: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
};

export function LearningPathCard({
  title,
  description,
  level,
  kanjiCount,
  duration,
  progress,
  learners = 0,
  thumbnail,
  color,
  className,
  ...props
}: LearningPathCardProps) {
  const gradientColor = levelColors[level];
  const badgeColor = levelBadgeColors[level];
  const isStarted = progress !== undefined && progress > 0;

  return (
    <div
      className={cn(
        "group bg-card hover:border-primary/20 relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {/* Gradient Header */}
      <div className={cn("relative h-32 bg-gradient-to-br p-6", gradientColor)}>
        <div className="flex items-start justify-between">
          <Badge className={cn("border-0", badgeColor)}>JLPT {level}</Badge>
          {learners > 0 && (
            <div className="flex items-center gap-1 text-xs text-white/90">
              <span>👥</span>
              <span>{learners.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        <div>
          <h3 className="group-hover:text-primary mb-2 text-xl font-bold transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        </div>

        {/* Stats */}
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span>📝</span>
            <span>{kanjiCount} kanji</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Progress (if started) */}
        {isStarted && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tiến độ</span>
              <span className="text-primary font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* CTA Button */}
        <Button
          className={cn(
            "w-full",
            isStarted
              ? "bg-primary hover:bg-primary/90"
              : "bg-secondary hover:bg-secondary/80"
          )}
        >
          {isStarted ? "Tiếp tục học" : "Bắt đầu học"}
        </Button>
      </div>
    </div>
  );
}
