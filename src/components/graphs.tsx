"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { ResizeObserver } from "@juggle/resize-observer";
import {
  ArrowUpFromDotIcon,
  CircleArrowOutUpRightIcon,
  MaximizeIcon,
  RefreshCcwIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import * as React from "react";
import useMeasure from "react-use-measure";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import {
  outLinksAtom,
  particlesAtom,
  rotateAtom,
  styleAtom,
} from "@/lib/store";

const Graph2DNoSSR = dynamic(() => import("./graph-2D"), {
  ssr: false,
  loading: () => <div />,
});
const Graph3DNoSSR = dynamic(() => import("./graph-3D"), {
  ssr: false,
  loading: () => <div />,
});

interface Props {
  kanjiInfo: KanjiInfo | null;
  graphData: BothGraphData | null;
}

export const Graphs: React.FC<Props> = ({ kanjiInfo, graphData }) => {
  const [measureRef, bounds] = useMeasure({
    polyfill: ResizeObserver,
    // debounce: 50,
  });

  const [style, setStyle] = useAtom(styleAtom);
  const [rotate, setRotate] = useAtom(rotateAtom);
  const [outLinks, setOutLinks] = useAtom(outLinksAtom);
  const [particles, setParticles] = useAtom(particlesAtom);

  const handleRotateChange = (value: boolean) => {
    setRotate(value);
  };
  const handleStyleChange = (value: string) => {
    setStyle(value as "3D" | "2D");
  };
  const handleOutLinksChange = (value: boolean) => {
    setOutLinks(value);
  };
  const handleParticlesChange = (value: boolean) => {
    setParticles(value);
  };

  const [tabValue] = React.useState(0);
  const [random, setRandom] = React.useState<number>(0);

  const handleZoomToFit = () => {
    setRandom(prev => prev + 1);
  };

  const pathname = usePathname();
  const [isMounted, setIsMounted] = React.useState(false);

  // Detect if mobile
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto zoom to fit on mobile when graph is rendered
  React.useEffect(() => {
    if (!isMounted) return;

    const isMobile = window.innerWidth < 768; // md breakpoint
    if (isMobile) {
      // Longer delay to ensure graph is fully rendered with all nodes
      const timer = setTimeout(() => {
        setRandom(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isMounted, pathname, style, kanjiInfo?.id]); // Trigger when any of these change

  if (!kanjiInfo) return <></>;

  return (
    <div ref={measureRef} className="relative size-full graphs">
      {/* Tabs */}
      <div className="absolute top-4 left-4 z-50">
        <Tabs
          defaultValue={style}
          value={style}
          onValueChange={handleStyleChange}
        >
          <TabsList className="px-1">
            <TabsTrigger value="2D">2D</TabsTrigger>
            <TabsTrigger value="3D">3D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="absolute inset-0">
        {kanjiInfo && style === "3D" && (
          <Graph3DNoSSR
            key={tabValue + random + pathname}
            kanjiInfo={kanjiInfo}
            graphData={graphData}
            showOutLinks={outLinks}
            showParticles={particles}
            autoRotate={rotate}
            triggerFocus={tabValue + random}
            bounds={bounds}
          />
        )}
        {kanjiInfo && style === "2D" && (
          <Graph2DNoSSR
            kanjiInfo={kanjiInfo}
            graphData={graphData}
            showOutLinks={outLinks}
            showParticles={particles}
            triggerFocus={tabValue + random}
            bounds={bounds}
          />
        )}
      </div>
      {/* Control buttons */}
      <div className="absolute top-0 right-0 p-4 flex gap-1">
        <div style={{ display: style === "3D" ? "block" : "none" }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                className={cn("size-10", rotate ? "bg-accent" : "")}
                variant="outline"
                aria-label="Tự động xoay"
                pressed={rotate}
                onPressedChange={handleRotateChange}
              >
                <RefreshCcwIcon className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tự động xoay</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                className={cn("size-10", particles ? "bg-accent" : "")}
                variant="outline"
                aria-label="Hiển thị hạt mũi tên"
                pressed={particles}
                onPressedChange={handleParticlesChange}
              >
                <ArrowUpFromDotIcon className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hiển thị hạt mũi tên</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                className={cn("size-10", outLinks ? "bg-accent" : "")}
                variant="outline"
                aria-label="Hiển thị liên kết ra"
                pressed={outLinks}
                onPressedChange={handleOutLinksChange}
              >
                <CircleArrowOutUpRightIcon className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hiển thị liên kết ra</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Vừa với màn hình"
                onClick={handleZoomToFit}
              >
                <MaximizeIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thu phóng vừa khít</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
