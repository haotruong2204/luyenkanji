import { cn } from "@/lib/utils";
import { ThemeSwitcherButton } from "./theme-switcher";
import LogoSVG from "./logo";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Header = ({
  route,
  className,
  showLogo = false,
}: {
  route?: string;
  className?: string;
  showLogo?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex h-12 items-center border-b",
        showLogo ? "justify-between" : "justify-end",
        className
      )}
    >
      {showLogo && (
        <div className="flex h-12 items-center px-4">
          <Link href="/">
            <LogoSVG className="inline-block h-full w-14 px-4 py-2" />
          </Link>
        </div>
      )}
      <div className="flex gap-2 px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <ThemeSwitcherButton />
          </TooltipTrigger>
          <TooltipContent>
            <p>Thay đổi giao diện</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
