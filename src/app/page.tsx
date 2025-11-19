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
                <SearchInput
                  fullWidth
                  searchPlaceholder="Nhập kanji hoặc nghĩa..."
                />
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
          </div>

          {/* banner */}
          <div className="absolute top-0 right-0 h-full w-2/5">
            <Image
              src="/banner.png"
              alt="Kanji learning"
              width={600}
              height={700}
            />
          </div>
        </div>
        <footer className="bg-card/50 mt-auto w-full">
          <div
            className="h-10 w-full"
            style={{
              backgroundImage: "url(/ft.jpg)",
              backgroundRepeat: "repeat-x",
              backgroundSize: "80px auto",
              backgroundPosition: "center",
            }}
          />
        </footer>
      </div>
    </>
  );
}
