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
  return (
    <div
      className={cn(
        "group bg-card hover:border-primary/20 relative rounded-xl border p-8 transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="space-y-4">
        {icon && (
          <div className="bg-primary/10 text-primary inline-flex h-12 w-12 items-center justify-center rounded-lg text-2xl">
            {icon}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
