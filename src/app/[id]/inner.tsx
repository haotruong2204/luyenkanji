"use client";

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize tabs config to prevent recreation on every render
  const mobileTabsConfig = useMemo(
    () => [
      {
        id: 0,
        label: "Kanji",
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
        label: "Từ vựng",
        content: (
          <ScrollArea className="size-full">
            <Examples kanjiInfo={kanjiInfo} />
          </ScrollArea>
        ),
      },
      {
        id: 2,
        label: "Sơ đồ",
        content: (
          <div className="size-full">
            <Graphs kanjiInfo={kanjiInfo} graphData={graphData} />
          </div>
        ),
      },
      {
        id: 3,
        label: <SearchIcon className="inline-block h-3.5 w-3.5" />,
        content: (
          <div className="relative mt-8 flex flex-col items-center gap-12 p-4">
            <SearchInput searchPlaceholder="Search kanji..." />
            <DrawInput fullWidth height={280} />
          </div>
        ),
      },
    ],
    [kanji, kanjiInfo, graphData]
  );

  return (
    <>
      {/* Mobile layout - show only on mobile */}
      <div className="w-full grow overflow-hidden md:hidden">
        <MobileLayout tabs={mobileTabsConfig} initialActiveTab={0} />
      </div>

      {/* Desktop layout - show only on desktop */}
      <div className="hidden size-full grow overflow-hidden md:grid md:grid-cols-[60%_40%]">
        <div className="grid grid-rows-[330px_1fr] overflow-hidden">
          <div className="border-lighter grid grid-cols-[252px_1.5fr] overflow-hidden border-b">
            <div className="mt-3 flex flex-col items-center gap-2">
              <SearchInput
                className="max-w-80 md:w-[220px]"
                searchPlaceholder="Tìm kiếm..."
              />
              <DrawInput />
            </div>

            <ScrollArea className="h-full w-full">
              <div className="border-l p-4">
                <Kanji
                  kanji={kanji}
                  screen="desktop"
                  kanjiInfo={kanjiInfo}
                  graphData={graphData}
                />
              </div>
            </ScrollArea>
          </div>

          <div className="overflow-hidden border-l">
            <Graphs kanjiInfo={kanjiInfo} graphData={graphData} />
          </div>
        </div>

        <ScrollArea className="h-full w-full border-l">
          <div className="p-4">
            <Examples kanjiInfo={kanjiInfo} />
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
