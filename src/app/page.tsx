import { DrawInput } from "@/components/draw-input";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 px-8 py-16">
        <div className="max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left - Content */}
            <div className="space-y-6 text-white">
              <div className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                🎓 Nền tảng học Kanji miễn phí
              </div>
              <h1 className="text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                Học Kanji hiệu quả
                <br />
                với sơ đồ trực quan
              </h1>
              <p className="text-lg text-white/90 md:text-xl">
                Hệ thống học Kanji thông minh với sơ đồ chiết tự, luyện viết tay
                và từ vựng JLPT đầy đủ. Hoàn toàn miễn phí!
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  className="h-12 bg-white px-8 text-base font-semibold text-orange-600 hover:bg-gray-100"
                >
                  Bắt đầu học ngay →
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-2 border-white bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10"
                >
                  Xem demo
                </Button>
              </div>
              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-6">
                <div>
                  <div className="text-3xl font-bold">2,500+</div>
                  <div className="text-sm text-white/80">Kanji</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-white/80">Miễn phí</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm text-white/80">Truy cập</div>
                </div>
              </div>
            </div>

            {/* Right - Image/Illustration placeholder */}
            <div className="hidden lg:block">
              <div className="relative h-96 rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
                <div className="flex h-full items-center justify-center text-8xl">
                  🗾
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl px-8 py-12">
        {/* Search & Draw Section */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          {/* Search Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#1e1e1e]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-xl dark:bg-orange-900/20">
                🔍
              </div>
              <h3 className="text-lg font-semibold">Tìm kiếm Kanji</h3>
            </div>
            <SearchInput searchPlaceholder="Nhập kanji hoặc nghĩa tiếng Việt..." />
          </div>

          {/* Draw Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#1e1e1e]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-xl dark:bg-orange-900/20">
                ✍️
              </div>
              <h3 className="text-lg font-semibold">Vẽ Kanji</h3>
            </div>
            <DrawInput fullWidth height={200} />
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold">
            Tại sao chọn <span className="text-orange-500">The Kanji Map</span>?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="🗺️"
              title="Sơ đồ chiết tự"
              description="Hiển thị cấu trúc kanji dưới dạng sơ đồ trực quan, dễ hiểu"
            />
            <FeatureCard
              icon="✍️"
              title="Luyện viết tay"
              description="Nhận diện chữ viết tay thông minh, tra cứu nhanh chóng"
            />
            <FeatureCard
              icon="📚"
              title="Từ vựng JLPT"
              description="Từ vựng đầy đủ từ N5 đến N1, kèm ví dụ minh họa"
            />
            <FeatureCard
              icon="🎯"
              title="Thông tin đầy đủ"
              description="Âm On-Kun, nghĩa, stroke order và ví dụ sử dụng"
            />
            <FeatureCard
              icon="⚡"
              title="Tốc độ cao"
              description="Static generation đảm bảo tốc độ tải cực nhanh"
            />
            <FeatureCard
              icon="🌙"
              title="Dark Mode"
              description="Giao diện tối bảo vệ mắt, học tập thoải mái"
            />
          </div>
        </section>

        {/* Learning Paths */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Lộ trình học tập</h2>
            <Link
              href="/learning-paths"
              className="text-orange-500 hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <PathCard
              level="N5"
              title="Kanji Sơ Cấp"
              kanjiCount={103}
              duration="2-3 tháng"
              color="from-green-500 to-emerald-600"
            />
            <PathCard
              level="N4"
              title="Kanji Sơ Trung Cấp"
              kanjiCount={320}
              duration="3-4 tháng"
              color="from-blue-500 to-cyan-600"
            />
            <PathCard
              level="N3"
              title="Kanji Trung Cấp"
              kanjiCount={650}
              duration="4-6 tháng"
              color="from-yellow-500 to-orange-600"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-12 text-white">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Sẵn sàng chinh phục Kanji?
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Bắt đầu hành trình học Kanji của bạn ngay hôm nay
          </p>
          <Button
            size="lg"
            className="h-12 bg-white px-8 text-base font-semibold text-orange-600 hover:bg-gray-100"
          >
            Bắt đầu ngay - Miễn phí
          </Button>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t pt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} The Kanji Map · by{" "}
            <a
              href="https://www.tiktok.com/@thocodehoctiengnhat"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-orange-500 hover:underline"
            >
              @thocodehoctiengnhat
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-[#1e1e1e]">
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

// Path Card Component
function PathCard({
  level,
  title,
  kanjiCount,
  duration,
  color,
}: {
  level: string;
  title: string;
  kanjiCount: number;
  duration: string;
  color: string;
}) {
  return (
    <Link
      href={`/learning-paths/${level.toLowerCase()}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-[#1e1e1e]"
    >
      <div className={`bg-gradient-to-r ${color} p-6`}>
        <div className="text-sm font-semibold text-white/90">JLPT {level}</div>
        <div className="mt-1 text-2xl font-bold text-white">{title}</div>
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span>📝</span>
            <span>{kanjiCount} kanji</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{duration}</span>
          </div>
        </div>
        <Button className="w-full bg-orange-500 hover:bg-orange-600">
          Bắt đầu học
        </Button>
      </div>
    </Link>
  );
}
