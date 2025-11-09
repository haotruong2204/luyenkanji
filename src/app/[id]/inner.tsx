"use client";

import { useMediaQuery } from "react-responsive";
import { Kanji } from "@/components/kanji";
import { MobileLayout } from "@/components/mobile-layout";
import { Radical } from "@/components/radical";
import { Examples } from "@/components/examples";
import { Graphs } from "@/components/graphs";
import { SearchInput } from "@/components/search-input";
import { DrawInput } from "@/components/draw-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchIcon } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

interface KanjiPageContentProps {
  kanji: string;
  kanjiInfo: KanjiInfo;
  graphData: BothGraphData;
}

export function KanjiPageContent({
  kanji,
  kanjiInfo,
  graphData,
}: KanjiPageContentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize tabs config to prevent recreation on every render
  const mobileTabsConfig = useMemo(
    () => [
      {
        id: 0,
        label: "漢字",
        content: (
          <div className="p-4">
            <Kanji
              kanji={kanji}
              kanjiInfo={kanjiInfo}
              graphData={graphData}
              screen="mobile"
            />
          </div>
        ),
      },
      {
        id: 1,
        label: "例",
        content: (
          <div className="p-4">
            <Radical kanjiInfo={kanjiInfo} />
          </div>
        ),
      },
      {
        id: 2,
        label: "部首",
        content: (
          <ScrollArea className="size-full">
            <Examples kanjiInfo={kanjiInfo} />
          </ScrollArea>
        ),
      },
      {
        id: 3,
        label: "図",
        content: <Graphs kanjiInfo={kanjiInfo} graphData={graphData} />,
      },
      {
        id: 4,
        label: (
          <SearchIcon className="w-4 h-4 inline-block -translate-y-0.5" />
        ),
        content: (
          <div className="relative mt-8 p-4 flex flex-col items-center gap-12">
            <SearchInput searchPlaceholder="Search kanji..." />
            <DrawInput />
          </div>
        ),
      },
    ],
    [kanji, kanjiInfo, graphData]
  );

  // Loading state - prevent hydration mismatch
  if (!isMounted) {
    return (
      <div
        className="flex h-screen w-full items-center justify-center"
        suppressHydrationWarning
      >
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div
        className="w-full grow md:hidden overflow-hidden"
        suppressHydrationWarning
      >
        <MobileLayout tabs={mobileTabsConfig} initialActiveTab={0} />
      </div>
    );
  }

  // Desktop layout
  return (
    <div
      className="size-full grow hidden md:grid md:grid-cols-[60%_40%] overflow-hidden"
      suppressHydrationWarning
    >
      <div className="grid grid-rows-[330px_1fr] overflow-hidden">
        <div className="grid grid-cols-[252px_1.5fr] border-b border-lighter overflow-hidden">
          <div className="flex flex-col items-center gap-2 mt-3">
            <SearchInput searchPlaceholder="Tìm kiếm..." />
            <DrawInput />
          </div>

          <ScrollArea className="w-full h-full">
            <div className="p-4 border-l">
              <Kanji
                kanji={kanji}
                screen="desktop"
                kanjiInfo={kanjiInfo}
                graphData={graphData}
              />
            </div>
          </ScrollArea>
        </div>

        <div className="border-l overflow-hidden">
          <Graphs kanjiInfo={kanjiInfo} graphData={graphData} />
        </div>
      </div>

      <ScrollArea className="w-full h-full border-l">
        <div className="p-4">
          <Examples kanjiInfo={kanjiInfo} />
        </div>
      </ScrollArea>
    </div>
  );
}
