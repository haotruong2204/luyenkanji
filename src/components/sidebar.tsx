"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import LogoSVG from "./logo";
import LogoMobileSVG from "./logo-mobile";
import { ThemeSwitcherButton } from "./theme-switcher";

const menuItems = [
  {
    href: "/",
    label: "Trang chủ",
    icon: Home,
  },
  {
    href: "/about",
    label: "Lộ trình",
    icon: Info,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button - Hamburger Menu */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-2 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
      )}

      {/* Mobile Close Button - Top Right */}
      {isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-2 right-4 z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X className="size-5" />
        </Button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-background fixed top-0 left-0 z-40 h-full w-20 border-r transition-transform duration-300 ease-in-out md:translate-x-0 md:border-r-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-12 items-center justify-center border-b px-4">
            <Link
              href="/"
              className="flex w-full items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-full max-w-[60px]">
                {isMobile ? (
                  <LogoMobileSVG className="h-6 w-full" />
                ) : (
                  <LogoSVG className="h-6 w-full" />
                )}
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-2 pt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg p-2 text-[10px] font-medium transition-colors",
                    isActive
                      ? "text-black"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  style={
                    isActive
                      ? { background: "#e8ebed", color: "#000" }
                      : undefined
                  }
                >
                  <Icon className="size-5" />
                  <span className="text-center leading-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer - Theme Switcher */}
          <div className="p-2">
            <div className="flex justify-center">
              <ThemeSwitcherButton />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
