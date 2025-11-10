import { InfoIcon } from "lucide-react";
import Link from "next/link";
import LogoSVG from "./logo";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { ThemeSwitcherButton } from "./theme-switcher";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Header = ({
  route,
  className,
}: {
  route?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex h-12 items-center justify-between border-b",
        className
      )}
    >
      <div className="h-ful flex items-center">
        <Link href={`/`} className="flex h-full items-center p-4">
          <LogoSVG className="inline-block h-full w-14 px-4 py-2" />
        </Link>
      </div>
      <div className="flex gap-2 px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={route === "about" ? "/ " : "about"}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                route === "about" ? "bg-accent! text-accent-foreground!" : ""
              )}
            >
              <InfoIcon className={cn("size-5")} />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>About this website</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <ThemeSwitcherButton />
          </TooltipTrigger>
          <TooltipContent>
            <p>Change theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
