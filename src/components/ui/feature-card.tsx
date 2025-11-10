"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  gradient?: boolean;
}

export function FeatureCard({
  icon,
  title,
  description,
  gradient = false,
  className,
  ...props
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={cn(
        "group bg-card relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg",
        gradient &&
          "hover:shadow-primary/20 hover:border-transparent hover:shadow-2xl",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Gradient overlay on hover */}
      {gradient && (
        <div
          className={cn(
            "gradient-primary absolute inset-0 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-5"
          )}
        />
      )}

      <div className="relative z-10">
        {icon && (
          <div
            className={cn(
              "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
              gradient
                ? "from-primary/10 text-primary bg-gradient-to-br to-purple-500/10 group-hover:scale-110"
                : "bg-muted text-muted-foreground"
            )}
          >
            {icon}
          </div>
        )}

        <h3 className="group-hover:text-primary mb-2 text-lg font-semibold transition-colors duration-300">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
