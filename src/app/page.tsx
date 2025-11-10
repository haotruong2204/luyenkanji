import { DrawInput } from "@/components/draw-input";
import { Header } from "@/components/header";
import { SearchInput } from "@/components/search-input";
import { FeatureCard } from "@/components/ui/feature-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex size-full flex-col overflow-y-auto">
      <Header className="w-full" />

      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl dark:bg-blue-600/20" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl dark:bg-purple-600/20" />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero Content */}
          <div className="animate-fade-in mx-auto max-w-4xl space-y-8 text-center">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge variant="gradient" className="px-4 py-1.5 text-sm">
                ✨ Nền tảng học Kanji hiện đại nhất
              </Badge>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Chinh phục Kanji với
                <br />
                <span className="gradient-text">Sơ đồ trực quan</span>
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
                Học từ vựng, kanji hiệu quả với sơ đồ chiết tự trực quan, kết
                hợp luyện viết tay và hệ thống từ vựng JLPT N5-N1
              </p>
            </div>

            {/* Author Credit */}
            <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <span>by</span>
              <a
                href="https://www.tiktok.com/@thocodehoctiengnhat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold transition-colors hover:underline"
              >
                @thocodehoctiengnhat
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Button size="lg" className="gradient-primary w-full sm:w-auto">
                Bắt đầu học ngay
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Xem demo
              </Button>
            </div>
          </div>

          {/* Search & Draw Section */}
          <div className="animate-slide-up mx-auto mt-16 max-w-4xl space-y-6">
            {/* Search Input */}
            <div className="bg-card/50 space-y-3 rounded-2xl border p-6 backdrop-blur-sm md:p-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                <h2 className="text-lg font-semibold">Tìm kiếm Kanji</h2>
              </div>
              <SearchInput searchPlaceholder="Nhập kanji hoặc nghĩa tiếng Việt..." />
            </div>

            {/* Draw Input */}
            <div className="bg-card/50 space-y-3 rounded-2xl border p-6 backdrop-blur-sm md:p-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✍️</span>
                <h2 className="text-lg font-semibold">Hoặc vẽ Kanji</h2>
              </div>
              <DrawInput fullWidth height={280} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-muted/30 w-full border-y py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            <div className="text-center">
              <div className="text-primary mb-2 text-4xl font-bold md:text-5xl">
                <AnimatedCounter value={2500} suffix="+" />
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                Kanji
              </div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-2 text-4xl font-bold md:text-5xl">
                <AnimatedCounter value={5} />
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                Cấp độ JLPT
              </div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-2 text-4xl font-bold md:text-5xl">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                Miễn phí
              </div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-2 text-4xl font-bold md:text-5xl">
                <AnimatedCounter value={24} suffix="/7" />
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                Truy cập
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              Tính năng nổi bật
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Tại sao chọn <span className="gradient-text">The Kanji Map</span>?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Phương pháp học hiện đại, khoa học và hiệu quả giúp bạn chinh phục
              kanji một cách dễ dàng
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<span className="text-2xl">🗺️</span>}
              title="Sơ đồ chiết tự trực quan"
              description="Hiển thị cấu trúc kanji dưới dạng sơ đồ, giúp bạn hiểu rõ cách kanji được tạo thành từ các bộ thủ"
              gradient
            />
            <FeatureCard
              icon={<span className="text-2xl">✍️</span>}
              title="Luyện viết tay"
              description="Nhận diện chữ viết tay thông minh, giúp bạn tra cứu kanji nhanh chóng và cải thiện khả năng viết"
              gradient
            />
            <FeatureCard
              icon={<span className="text-2xl">📚</span>}
              title="Hệ thống từ vựng JLPT"
              description="Từ vựng được phân loại theo cấp độ N5-N1, kèm ví dụ minh họa chi tiết"
              gradient
            />
            <FeatureCard
              icon={<span className="text-2xl">🎯</span>}
              title="Thông tin đầy đủ"
              description="Bao gồm âm On-Kun, nghĩa tiếng Việt, stroke order, và ví dụ sử dụng"
              gradient
            />
            <FeatureCard
              icon={<span className="text-2xl">🌙</span>}
              title="Dark Mode"
              description="Giao diện tối bảo vệ mắt, phù hợp cho việc học ban đêm hoặc môi trường thiếu ánh sáng"
              gradient
            />
            <FeatureCard
              icon={<span className="text-2xl">⚡</span>}
              title="Tốc độ cao"
              description="Static site generation đảm bảo tốc độ tải trang cực nhanh, trải nghiệm mượt mà"
              gradient
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-muted/20 w-full border-t py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              Cách sử dụng
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Học Kanji <span className="gradient-text">3 bước đơn giản</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Tìm kiếm</h3>
              <p className="text-muted-foreground">
                Tìm kanji bằng cách nhập trực tiếp, vẽ tay, hoặc tìm theo nghĩa
                tiếng Việt
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Khám phá</h3>
              <p className="text-muted-foreground">
                Xem sơ đồ chiết tự, stroke order, từ vựng liên quan và thông tin
                chi tiết
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Luyện tập</h3>
              <p className="text-muted-foreground">
                Luyện viết tay, ghi chú và theo dõi tiến trình học tập của bạn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative w-full overflow-hidden py-16 md:py-24">
        <div className="gradient-primary absolute inset-0 opacity-5" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-5xl">
            Sẵn sàng chinh phục Kanji?
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            Bắt đầu hành trình học tiếng Nhật của bạn ngay hôm nay với 2500+
            kanji miễn phí
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gradient-primary w-full sm:w-auto">
              Bắt đầu ngay - Miễn phí
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <a
                href="https://www.tiktok.com/@thocodehoctiengnhat"
                target="_blank"
                rel="noopener noreferrer"
              >
                Theo dõi trên TikTok
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t py-8">
        <div className="container mx-auto px-4">
          <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-center text-sm md:flex-row md:text-left">
            <div>
              © {new Date().getFullYear()} The Kanji Map. Made with ❤️ by{" "}
              <a
                href="https://www.tiktok.com/@thocodehoctiengnhat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @thocodehoctiengnhat
              </a>
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-foreground">
                Về chúng tôi
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
