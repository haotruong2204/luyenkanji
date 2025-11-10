"use client";

import { getKanjiVGForAnimation } from "@/lib/kanjivg";
import { useEffect, useRef, useState } from "react";
import { ClipboardPenLine } from "lucide-react";
import KanjivgAnimate from "kanjivganimate";

interface KanjiStrokeAnimationProps {
  kanji: string;
  animationSpeed?: number; // milliseconds per stroke (default 500ms)
  autoPlay?: boolean; // auto play animation on mount
  showButton?: boolean; // show animation button
  size?: number; // SVG size in pixels
  className?: string;
}

/**
 * KanjiVG Stroke Animation Component
 * Uses kanjivganimate library to animate KanjiVG SVG stroke order
 */
export function KanjiStrokeAnimation({
  kanji,
  animationSpeed = 500,
  autoPlay = false,
  showButton = true,
  size = 300,
  className = "",
}: KanjiStrokeAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure client-side only rendering to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load KanjiVG SVG (only on client)
  useEffect(() => {
    if (!isMounted) return;

    let mounted = true;

    async function loadSvg() {
      setIsLoading(true);
      setError(null);

      try {
        const svg = await getKanjiVGForAnimation(kanji, 200);

        if (!mounted) return;

        if (svg) {
          setSvgContent(svg);
        } else {
          setError("Không tìm thấy stroke animation cho kanji này");
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to load KanjiVG:", err);
        setError("Lỗi khi tải stroke animation");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadSvg();

    return () => {
      mounted = false;
    };
  }, [kanji, isMounted]);

  // Initialize kanjivganimate when SVG is loaded
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    let timeoutId: NodeJS.Timeout;
    let mounted = true;

    try {
      // Initialize animation with imported module
      new KanjivgAnimate(".kanjiVG", animationSpeed);

      // Auto play if enabled
      if (autoPlay && containerRef.current) {
        timeoutId = setTimeout(() => {
          if (mounted && containerRef.current) {
            containerRef.current
              .querySelector(".kanjiVG")
              ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          }
        }, 100);
      }
    } catch (err) {
      console.error("Failed to initialize kanjivganimate:", err);
    }

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [svgContent, animationSpeed, autoPlay]);

  // Play animation handler
  const playAnimation = () => {
    if (!containerRef.current || !svgContent) return;

    // Force complete reset by reloading the SVG content
    containerRef.current.innerHTML = svgContent;

    // Reinitialize animation after DOM update
    setTimeout(() => {
      if (containerRef.current) {
        // Create new animation instance with fresh SVG
        new KanjivgAnimate(".kanjiVG", animationSpeed);

        // Trigger animation immediately
        const svg = containerRef.current.querySelector(".kanjiVG");
        if (svg) {
          svg.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }
      }
    }, 50);
  };

  // Prevent hydration mismatch - don't render until mounted on client
  if (!isMounted) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-sm text-muted-foreground">{error}</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} suppressHydrationWarning style={{ width: size, height: size }}>
      <div
        ref={containerRef}
        className="cursor-pointer rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md w-full h-full flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        onClick={!showButton ? playAnimation : undefined}
        title={!showButton ? "Click để xem thứ tự nét" : undefined}
        suppressHydrationWarning
        style={{
          // Make SVG inside scale to fit container
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />

      {showButton && (
        <button
          onClick={playAnimation}
          className="absolute bottom-2 right-2 rounded-full bg-primary p-2 text-primary-foreground transition-all hover:bg-primary/90 hover:scale-110 shadow-lg"
          title="Xem thứ tự nét"
        >
          <ClipboardPenLine className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
