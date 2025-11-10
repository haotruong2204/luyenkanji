"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import * as React from "react";

type Tab = {
  id: number;
  label: string | React.ReactNode;
  content: React.ReactNode;
};

export const MobileLayout = ({
  tabs,
  initialActiveTab = 0,
  disabled = false,
}: {
  tabs: Tab[];
  initialActiveTab?: number;
  disabled?: boolean;
}) => {
  const [api, setApi] = React.useState<CarouselApi>();

  const [activeTab, setActiveTab] = React.useState(initialActiveTab);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setActiveTab(initialActiveTab);
    api.on("select", () => {
      setActiveTab(api.selectedScrollSnap());
    });
  }, [api]);

  const handleTabClick = (newIdx: number) => {
    if (newIdx !== activeTab && !disabled) {
      if (newIdx !== activeTab) {
        setActiveTab(newIdx);
        api?.scrollTo(newIdx);
      }
    }
  };

  return (
    <div className="size-full overflow-hidden">
      <Carousel
        setApi={setApi}
        className="size-full pb-10"
        opts={{ watchDrag: false }}
      >
        <CarouselContent className="relative size-full">
          {tabs.map((tab, idx) => (
            <CarouselItem key={tab.id} className="min-h-full">
              {tab.content}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div
        className={cn(
          "bg-background shadow-inner-shadow absolute bottom-0 grid w-full shrink-0 cursor-pointer grid-cols-4 gap-1 border-t px-[3px] py-[3.2px]"
        )}
      >
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => handleTabClick(idx)}
            disabled={activeTab === idx ? false : disabled}
            className={cn(
              "relative flex items-center justify-center px-3.5 py-1.5 text-sm font-medium transition focus-visible:ring-1 focus-visible:outline-hidden focus-visible:outline-1",
              activeTab === idx ? "text-foreground!" : "text-foreground/50"
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {activeTab === idx && (
              <motion.span
                layoutId="bubble"
                className="bg-muted/50 shadow-inner-shadow absolute inset-0 z-10 rounded-md border mix-blend-screen"
                transition={{ type: "spring", bounce: 0.19, duration: 0.4 }}
              />
            )}
            <span className="relative size-full text-center">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
