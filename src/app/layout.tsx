import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider as JotaiProvider } from "jotai";
import {
  Noto_Sans_JP,
  Caveat,
  Comfortaa,
  Itim,
  Kablammo,
  VT323,
  Zen_Maru_Gothic,
} from "next/font/google";
import localFont from "next/font/local";
import "../styles/globals.css";
import { Metadata } from "next";
import { Sidebar } from "@/components/sidebar/sidebar";

export const metadata: Metadata = {
  title: {
    default: "Trang chủ",
    template: "%s | Nhaitungvung.com by @thocodehoctiengnhat",
  },
  description:
    "Nhaitungvung.com by @thocodehoctiengnhat là một công cụ học tiếng Nhật hiển thị thông tin chữ Kanji và cách phân tích dưới dạng biểu đồ.",
  openGraph: {
    title: "Nhaitungvung.com by @thocodehoctiengnhat",
    description:
      "Nhaitungvung.com by @thocodehoctiengnhat là một công cụ học tiếng Nhật hiển thị thông tin chữ Kanji và cách phân tích dưới dạng biểu đồ.",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  // themeColor: "#2b99cf",
};

const radicalsFont = localFont({
  src: "./JapaneseRadicals-Regular.woff2",
  variable: "--font-radicals",
  display: "swap",
  preload: true,
});

const notoSansJp = Noto_Sans_JP({
  weight: "variable",
  subsets: ["latin-ext"],
  display: "swap",
  preload: true,
  variable: "--font-sans",
  adjustFontFallback: false,
});

const caveat = Caveat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
});

const comfortaa = Comfortaa({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-comfortaa",
});

const itim = Itim({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-itim",
});

const kablammo = Kablammo({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-kablammo",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-vt323",
});

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-zen-maru-gothic",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${notoSansJp.variable} ${radicalsFont.variable} ${caveat.variable} ${comfortaa.variable} ${itim.variable} ${kablammo.variable} ${vt323.variable} ${zenMaruGothic.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove browser extension attributes before React hydration
              (function() {
                var observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.target.nodeType === 1) {
                      mutation.target.removeAttribute('bis_skin_checked');
                    }
                  });
                });
                observer.observe(document.documentElement, {
                  attributes: true,
                  attributeFilter: ['bis_skin_checked'],
                  subtree: true
                });
              })();
            `,
          }}
        />
      </head>
      <body
        className="bg-background text-foreground selection:bg-primary h-screen w-screen overflow-hidden"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <JotaiProvider>
              <div className="isolate size-full" suppressHydrationWarning>
                <Sidebar />
                <main className="ml-64 h-screen overflow-y-auto bg-gray-50 dark:bg-[#0D1117]">
                  {children}
                </main>
              </div>
            </JotaiProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
