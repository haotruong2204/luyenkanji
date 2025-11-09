import { DrawInput } from "@/components/draw-input";
import { Header } from "@/components/header";
import { SearchInput } from "@/components/search-input";

export default function Home() {
  return (
    <div className="size-full flex flex-col">
      <Header className="w-full" />
      
      {/* MOBILE */}
      <div className="w-full grow md:hidden">
        <div className="relative mt-8 p-4 flex flex-col items-center gap-8">
          <div className="text-center space-y-4">
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
            <p className="text-sm text-muted-foreground">
              Nền tảng học <span className="font-semibold text-primary underline">từ vựng</span>, <span className="font-semibold text-primary underline">kanji</span> hiệu quả với sơ đồ chiết tự trực quan, kết hợp <span className="font-semibold text-primary underline">luyện viết tay</span>
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
      <div className="w-full grow hidden md:flex flex-col items-center justify-center gap-8 p-8">
        <div className="max-w-2xl w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
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
            <p className="text-muted-foreground" 
               style={{
                  fontSize: "15px",
               }}
            >
              Nền tảng học <span className="font-semibold text-primary underline">từ vựng</span>, <span className="font-semibold text-primary underline">kanji</span> hiệu quả với sơ đồ chiết tự trực quan, kết hợp <span className="font-semibold text-primary underline">luyện viết tay</span>
            </p>
          </div>

          <div className="space-y-6 pt-4 max-w-4xl mx-auto w-full">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Tìm kiếm Kanji</h2>
              <SearchInput searchPlaceholder="Nhập kanji hoặc nghĩa..." />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Hoặc vẽ Kanji</h2>
              <DrawInput fullWidth height={300} />
            </div>
          </div>

          <div className="pt-8 grid grid-cols-4 gap-4 text-sm">
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-2xl font-bold text-primary">2500+</div>
              <div className="text-muted-foreground">Kanji</div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-2xl font-bold text-primary">Sơ đồ</div>
              <div className="text-muted-foreground">Chiết tự trực quan</div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-2xl font-bold text-primary">Hệ thống</div>
              <div className="text-muted-foreground">Từ vựng đi kèm</div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-2xl font-bold text-primary">Nhai từ vựng</div>
              <div className="text-muted-foreground">JLPT N5 - N1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
