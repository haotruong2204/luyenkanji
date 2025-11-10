"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
}

const menuItems = [
  {
    icon: "🏠",
    label: "Trang chủ",
    href: "/",
    badge: null,
  },
  {
    icon: "🗺️",
    label: "Lộ trình học",
    href: "/learning-paths",
    badge: "Mới",
  },
  {
    icon: "📚",
    label: "Kanji",
    href: "/kanji",
    badge: "2500+",
  },
  {
    icon: "📝",
    label: "Từ vựng",
    href: "/vocabulary",
    badge: null,
  },
  {
    icon: "✍️",
    label: "Luyện viết",
    href: "/practice",
    badge: null,
  },
  {
    icon: "🎯",
    label: "Luyện tập",
    href: "/exercises",
    badge: null,
  },
  {
    icon: "📊",
    label: "Thống kê",
    href: "/stats",
    badge: null,
  },
  {
    icon: "⚙️",
    label: "Cài đặt",
    href: "/settings",
    badge: null,
  },
];

export function Sidebar({
  collapsed = false,
  className,
  ...props
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 flex h-screen flex-col border-r bg-white transition-all duration-300 dark:bg-[#1e1e1e]",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🗾</span>
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-lg font-bold text-transparent">
              The Kanji Map
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" className="mx-auto">
            <span className="text-2xl">🗾</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-orange-50 dark:hover:bg-orange-950/20",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-gray-700 dark:text-gray-200">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isCollapsed && item.badge && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        {!isCollapsed && (
          <div className="space-y-3">
            {/* User Profile */}
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-lg font-bold text-white">
                H
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Học viên
                </div>
                <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                  Free Plan
                </div>
              </div>
            </div>

            {/* Collapse Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              ← Thu gọn
            </Button>
          </div>
        )}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            →
          </Button>
        )}
      </div>
    </aside>
  );
}
