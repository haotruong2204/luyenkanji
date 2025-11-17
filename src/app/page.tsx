import { DrawInput } from "@/components/draw-input";
import { Header } from "@/components/header";
import { SearchInput } from "@/components/search-input";
import { Sidebar } from "@/components/sidebar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Sidebar />
      <div className="flex size-full flex-col md:ml-20">
        <Header className="w-full" />

        {/* MOBILE */}
        <div className="w-full grow md:hidden">
          <div className="relative mt-8 flex flex-col items-center gap-8 p-4">
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-bold">
                by{" "}
                <a
                  href="https://www.tiktok.com/@thocodehoctiengnhat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  @thocodehoctiengnhat
                </a>
              </h1>
              <p className="text-muted-foreground text-sm">
                Nền tảng học{" "}
                <span className="text-primary font-semibold underline">
                  từ vựng
                </span>
                ,{" "}
                <span className="text-primary font-semibold underline">
                  kanji
                </span>{" "}
                hiệu quả với sơ đồ chiết tự trực quan, kết hợp{" "}
                <span className="text-primary font-semibold underline">
                  luyện viết tay
                </span>
              </p>
            </div>

            <div className="w-full space-y-6">
              <div className="space-y-2">
                <h2 className="text-base font-semibold">Tìm kiếm Kanji</h2>
                <SearchInput searchPlaceholder="Nhập kanji hoặc nghĩa..." />
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-semibold">Hoặc vẽ Kanji</h2>
                <DrawInput fullWidth height={280} />
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden w-full grow flex-col gap-8 p-8 md:flex">
          <div className="w-full max-w-2xl space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight">
                "Nhai" kanji
              </h1>
              <p
                className="text-muted-foreground"
                style={{
                  fontSize: "15px",
                }}
              >
                Nền tảng học{" "}
                <span className="text-primary font-semibold underline">
                  từ vựng
                </span>
                ,{" "}
                <span className="text-primary font-semibold underline">
                  kanji
                </span>{" "}
                hiệu quả với sơ đồ chiết tự trực quan, kết hợp{" "}
                <span className="text-primary font-semibold underline">
                  luyện viết tay
                </span>
              </p>
            </div>

            <div className="w-full max-w-4xl space-y-6 pt-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Tìm kiếm Kanji</h2>
                <SearchInput searchPlaceholder="Nhập kanji hoặc nghĩa..." />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Hoặc vẽ Kanji</h2>
                <DrawInput fullWidth height={300} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-8 text-sm">
              <div className="bg-card rounded-lg border p-4">
                <div className="text-primary text-2xl font-bold">2500+</div>
                <div className="text-muted-foreground">Kanji</div>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <div className="text-primary text-2xl font-bold">Sơ đồ</div>
                <div className="text-muted-foreground">Chiết tự trực quan</div>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <div className="text-primary text-2xl font-bold">Hệ thống</div>
                <div className="text-muted-foreground">Từ vựng đi kèm</div>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <div className="text-primary text-2xl font-bold">Nhai</div>
                <div className="text-muted-foreground">Từ vựng JLPT</div>
              </div>
            </div>

            {/* Banner */}
            <div className="mt-8 w-full max-w-4xl">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-8">
                <div className="relative z-10 space-y-4 text-white">
                  <h2 className="text-3xl font-bold">
                    Bắt đầu học Kanji hiệu quả ngay hôm nay
                  </h2>
                  <p className="text-lg text-white/90">
                    Hệ thống học thông minh với sơ đồ trực quan, hoàn toàn miễn
                    phí
                  </p>
                </div>
                {/* Placeholder for image */}
                <div className="absolute top-0 right-0 h-full w-1/3 opacity-20">
                  <div className="flex h-full items-center justify-center text-8xl">
                    🗾
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
