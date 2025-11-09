"use client";
import * as React from "react";
import searchlist from "@/../data/searchlist.json";
import { cn } from "@/lib/utils";
import { CircleXIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import Handwriting from "@/lib/handwriting";
import { TouchIsolator } from "./touch-isolator";
import { Button, buttonVariants } from "./ui/button";
import { useTheme } from "next-themes";

interface DrawInputProps {
  className?: string;
  height?: number;
  width?: number;
  fullWidth?: boolean;
}

export const DrawInput: React.FC<DrawInputProps> = ({ 
  className = "",
  height = 220,
  width = 220,
  fullWidth = false
}) => {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = React.useState<InstanceType<
    typeof Handwriting.Canvas
  > | null>(null);
  const [inputSuggestions, setInputSuggestions] = React.useState<string[]>([]);
  const recognizeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [dimensions, setDimensions] = React.useState({ width, height });

  const { resolvedTheme } = useTheme();

  // Handle responsive sizing when fullWidth is true
  React.useEffect(() => {
    if (!fullWidth || !containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Maintain aspect ratio (use height prop or default)
        const newHeight = height || containerWidth;
        setDimensions({ width: containerWidth, height: newHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [fullWidth, height]);

  const inputOptions = {
    width: fullWidth ? dimensions.width : width,
    height: fullWidth ? dimensions.height : height,
    language: "ja",
    numOfWords: 1,
    numOfReturn: 64,
  };

  const inputCallback = (result: string[], err: string) => {
    if (err) {
      return;
    } else {
      const kanjiList = searchlist.map((entry) => entry.k);
      const filtered = result
        .filter((entry) => kanjiList.includes(entry))
        .slice(0, 4);
      setInputSuggestions(filtered);
    }
  };

  // init
  React.useEffect(() => {
    eraseKanji();
    if (canvasRef.current && resolvedTheme) {
      const can = new Handwriting.Canvas(
        canvasRef.current,
        // document.getElementById("handInput"),
        resolvedTheme as "dark" | "light"
      );
      setCanvas(can);
    }
  }, [resolvedTheme]);

  // Auto-recognize after drawing stops
  React.useEffect(() => {
    if (!canvas) return;

    const handleMouseUp = () => {
      // Clear previous timeout
      if (recognizeTimeoutRef.current) {
        clearTimeout(recognizeTimeoutRef.current);
      }
      
      // Recognize after a short delay (300ms after user stops drawing)
      recognizeTimeoutRef.current = setTimeout(() => {
        const trace = canvas.getTrace();
        if (trace.length > 0) {
          canvas.recognize(trace, inputOptions, inputCallback);
        }
      }, 300);
    };

    const handleTouchEnd = handleMouseUp;

    const canvasElement = canvasRef.current as HTMLCanvasElement | null;
    if (canvasElement) {
      canvasElement.addEventListener("mouseup", handleMouseUp);
      canvasElement.addEventListener("touchend", handleTouchEnd);

      return () => {
        canvasElement.removeEventListener("mouseup", handleMouseUp);
        canvasElement.removeEventListener("touchend", handleTouchEnd);
        if (recognizeTimeoutRef.current) {
          clearTimeout(recognizeTimeoutRef.current);
        }
      };
    }
  }, [canvas]);

  const recognizeKanji = () => {
    canvas && canvas.recognize(canvas.getTrace(), inputOptions, inputCallback);
  };

  const eraseKanji = () => {
    canvas && canvas.erase();
    setInputSuggestions([]);
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative bg-background", fullWidth ? "w-full" : "mx-auto", className)} 
      style={fullWidth ? { height: dimensions.height } : { width: width, height: height }}
    >
      <div 
        className="absolute border-l border-dashed border-slate-600/20 dark:border-slate-600/60 pointer-events-none z-10" 
        style={{ 
          left: fullWidth ? `${dimensions.width / 2}px` : '50%',
          height: fullWidth ? `${dimensions.height}px` : '100%'
        }}
      />
      <div 
        className="absolute border-t border-dashed border-slate-600/20 dark:border-slate-600/60 pointer-events-none z-10" 
        style={{ 
          top: fullWidth ? `${dimensions.height / 2}px` : '50%',
          width: fullWidth ? `${dimensions.width}px` : '100%'
        }}
      />
      <TouchIsolator>
        <canvas
          width={fullWidth ? dimensions.width : width}
          height={fullWidth ? dimensions.height : height}
          ref={canvasRef}
          id="handInput"
          className="relative border border-light rounded-lg cursor-crosshair bg-muted w-full"
          style={fullWidth ? { height: dimensions.height } : { width: width, height: height }}
        />
      </TouchIsolator>
      <div className="h-10 w-full pt-2 flex items-center justify-start gap-2">
        <Button
          aria-label="Clear canvas"
          variant="destructive"
          size="icon"
          className="w-8 h-8 shrink-0"
          onClick={eraseKanji}
        >
          <CircleXIcon className="w-4 h-4" />
        </Button>
        {inputSuggestions.map((suggestion, index) => (
          <Link
            key={index}
            href={`/${suggestion}`}
            className={cn(buttonVariants({ variant: "ghost" }), "w-8 h-8")}
            onClick={eraseKanji}
          >
            {suggestion}
          </Link>
        ))}
      </div>
    </div>
  );
};
