import { DrawInput } from "@/components/draw-input";
import { Header } from "@/components/header";
import { SearchInput } from "@/components/search-input";
import { FeatureCard } from "@/components/ui/feature-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StreakCounter } from "@/components/gamification/streak-counter";
import { DailyProgress } from "@/components/gamification/daily-progress";
import { AchievementBadge } from "@/components/gamification/achievement-badge";
import { ProgressRing } from "@/components/gamification/progress-ring";

export default function Home() {
  return (
    <div className="flex size-full flex-col overflow-y-auto">
      <Header className="w-full" />

      {/* HERO SECTION - Brilliant Style */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-[#0D1117] dark:to-[#161B22]">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          {/* Hero Content */}
          <div className="animate-fade-in mx-auto max-w-4xl space-y-8 text-center">
            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Chinh phục Kanji
                <br />
                <span className="text-primary">bằng sơ đồ trực quan</span>
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl font-light md:text-2xl">
                Học kanji một cách khoa học với sơ đồ chiết tự, luyện viết tay
                và hệ thống từ vựng JLPT
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 h-12 w-full px-8 text-base font-semibold sm:w-auto"
              >
                Bắt đầu học ngay
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-primary hover:bg-primary/10 h-12 w-full px-8 text-base font-semibold sm:w-auto"
              >
                Xem demo →
              </Button>
            </div>

            {/* Author Credit */}
            <div className="text-muted-foreground pt-4 text-sm">
              by{" "}
              <a
                href="https://www.tiktok.com/@thocodehoctiengnhat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                @thocodehoctiengnhat
              </a>
            </div>
          </div>

          {/* Search & Draw Section - Clean Cards */}
          <div className="animate-slide-up mx-auto mt-20 max-w-5xl space-y-8">
            {/* Search Input */}
            <div className="bg-card space-y-4 rounded-xl border p-8 shadow-sm transition-shadow hover:shadow-md md:p-10">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg text-xl">
                  🔍
                </div>
                <h2 className="text-xl font-semibold">Tìm kiếm Kanji</h2>
              </div>
              <SearchInput searchPlaceholder="Nhập kanji hoặc nghĩa tiếng Việt..." />
            </div>

            {/* Draw Input */}
            <div className="bg-card space-y-4 rounded-xl border p-8 shadow-sm transition-shadow hover:shadow-md md:p-10">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg text-xl">
                  ✍️
                </div>
                <h2 className="text-xl font-semibold">Vẽ Kanji</h2>
              </div>
              <DrawInput fullWidth height={280} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - Clean & Minimal */}
      <section className="w-full border-y bg-gray-50/50 py-16 dark:bg-[#161B22]">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-12 md:grid-cols-4">
            <div className="text-center">
              <div className="text-primary mb-2 text-5xl font-bold tracking-tight">
                <AnimatedCounter value={2500} suffix="+" />
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Kanji
              </div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-2 text-5xl font-bold tracking-tight">
                <AnimatedCounter value={5} />
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Cấp độ JLPT
              </div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-2 text-5xl font-bold tracking-tight">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Miễn phí
              </div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-2 text-5xl font-bold tracking-tight">
                <AnimatedCounter value={24} suffix="/7" />
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Truy cập
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Brilliant Style */}
      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Tại sao chọn <span className="text-primary">The Kanji Map</span>?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg font-light">
              Phương pháp học hiện đại, khoa học và hiệu quả
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="🗺️"
              title="Sơ đồ chiết tự trực quan"
              description="Hiển thị cấu trúc kanji dưới dạng sơ đồ, giúp bạn hiểu rõ cách kanji được tạo thành"
            />
            <FeatureCard
              icon="✍️"
              title="Luyện viết tay"
              description="Nhận diện chữ viết tay thông minh, tra cứu kanji nhanh chóng"
            />
            <FeatureCard
              icon="📚"
              title="Từ vựng JLPT N5-N1"
              description="Từ vựng được phân loại theo cấp độ, kèm ví dụ minh họa"
            />
            <FeatureCard
              icon="🎯"
              title="Thông tin đầy đủ"
              description="Âm On-Kun, nghĩa tiếng Việt, stroke order, và ví dụ sử dụng"
            />
            <FeatureCard
              icon="⚡"
              title="Tốc độ cao"
              description="Static generation đảm bảo tốc độ tải trang cực nhanh"
            />
            <FeatureCard
              icon="🌙"
              title="Dark Mode"
              description="Giao diện tối bảo vệ mắt, phù hợp học ban đêm"
            />
          </div>
        </div>
      </section>

      {/* GAMIFICATION SECTION - Make Learning Fun */}
      <section className="from-primary/5 w-full border-y bg-gradient-to-b to-transparent py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="gradient" className="mb-4">
              🎮 Gamification
            </Badge>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Học tập trở nên <span className="text-primary">thú vị hơn</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg font-light">
              Theo dõi tiến trình, duy trì streak, và mở khóa thành tích khi học
              Kanji
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {/* Left Column - Streak & Progress */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold">
                  🔥 Streak & Tiến độ
                </h3>
                <div className="space-y-4">
                  <StreakCounter currentStreak={7} longestStreak={15} />

                  <div className="bg-card rounded-xl border p-6">
                    <DailyProgress current={12} goal={20} />
                  </div>

                  <div className="bg-card rounded-xl border p-6">
                    <DailyProgress
                      current={45}
                      goal={50}
                      label="Kanji tuần này"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Progress Ring */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div>
                <h3 className="mb-6 text-center text-xl font-semibold">
                  📊 Tổng quan học tập
                </h3>
                <div className="flex flex-col items-center gap-6">
                  <ProgressRing
                    progress={68}
                    size={180}
                    strokeWidth={12}
                    label="Hoàn thành khóa học"
                  />

                  <div className="grid w-full grid-cols-2 gap-4">
                    <div className="bg-card rounded-lg border p-4 text-center">
                      <div className="text-primary mb-1 text-2xl font-bold">
                        156
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Kanji đã học
                      </div>
                    </div>
                    <div className="bg-card rounded-lg border p-4 text-center">
                      <div className="text-primary mb-1 text-2xl font-bold">
                        89%
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Độ chính xác
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Achievements */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">🏆 Thành tích</h3>
              <div className="space-y-4">
                <AchievementBadge
                  icon="🌟"
                  title="Người mới"
                  description="Hoàn thành bài học đầu tiên"
                  unlocked={true}
                />
                <AchievementBadge
                  icon="🔥"
                  title="Streak Master"
                  description="Học 7 ngày liên tục"
                  unlocked={true}
                />
                <AchievementBadge
                  icon="📚"
                  title="Nhà sưu tập"
                  description="Học 100 kanji"
                  unlocked={false}
                  progress={65}
                />
              </div>
            </div>
          </div>

          {/* CTA for Gamification */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6 text-sm">
              Đăng nhập để lưu tiến trình và mở khóa tất cả tính năng
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Bắt đầu ngay - Miễn phí
            </Button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION - Simplified */}
      <section className="w-full border-t bg-gray-50/50 py-20 md:py-32 dark:bg-[#161B22]">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Học Kanji trong <span className="text-primary">3 bước</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold">
                1
              </div>
              <h3 className="mb-3 text-xl font-semibold">Tìm kiếm</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nhập trực tiếp, vẽ tay, hoặc tìm theo nghĩa
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold">
                2
              </div>
              <h3 className="mb-3 text-xl font-semibold">Khám phá</h3>
              <p className="text-muted-foreground leading-relaxed">
                Xem sơ đồ, stroke order, từ vựng liên quan
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 text-primary mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold">
                3
              </div>
              <h3 className="mb-3 text-xl font-semibold">Luyện tập</h3>
              <p className="text-muted-foreground leading-relaxed">
                Luyện viết, ghi chú, theo dõi tiến trình
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Clean */}
      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Sẵn sàng chinh phục Kanji?
          </h2>
          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl font-light">
            Bắt đầu ngay hôm nay với 2500+ kanji miễn phí
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 h-12 w-full px-8 text-base font-semibold sm:w-auto"
            >
              Bắt đầu ngay - Miễn phí
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full px-8 text-base font-semibold sm:w-auto"
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

      {/* FOOTER - Minimal */}
      <footer className="w-full border-t bg-gray-50/50 py-12 dark:bg-[#161B22]">
        <div className="container mx-auto px-4">
          <div className="text-muted-foreground flex flex-col items-center justify-between gap-6 text-center text-sm md:flex-row">
            <div>
              © {new Date().getFullYear()} The Kanji Map · by{" "}
              <a
                href="https://www.tiktok.com/@thocodehoctiengnhat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                @thocodehoctiengnhat
              </a>
            </div>
            <div className="flex gap-8">
              <Link
                href="/about"
                className="hover:text-foreground font-medium transition-colors"
              >
                Về chúng tôi
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground font-medium transition-colors"
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
