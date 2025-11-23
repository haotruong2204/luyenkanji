import * as React from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin",
};

const About = () => {
  return (
    <>
      <Sidebar />
      <div className="relative grid h-screen grid-rows-[50px_1fr]">
        <Header route="about" showLogo />
        <ScrollArea className="w-full">
          <div className="mx-auto mb-8 max-w-2xl p-4">
            <h1 className="mt-4 mb-4 text-3xl font-extrabold tracking-tight">
              Thông tin
            </h1>
            <p>
              nhaikanji.com là nền tảng website học tiếng Nhật hiển thị thông
              tin và cách phân tích (chiết tự) của chữ Kanji dưới dạng sơ đồ
              (biểu đồ kết nối)
            </p>

            <h1 className="mt-8 mb-4 text-3xl font-extrabold tracking-tight">
              Hướng dẫn sử dụng
            </h1>

            <h2 className="mt-6 mb-3 text-2xl font-bold tracking-tight">
              Tìm kiếm Kanji
            </h2>
            <p className="mb-2">Bạn có thể tìm kiếm Kanji theo nhiều cách:</p>
            <ul className="ml-4 list-inside list-disc space-y-1">
              <li>Tìm theo chữ Kanji trực tiếp</li>
              <li>Tìm theo âm đọc Kunyomi (ひらがな)</li>
              <li>Tìm theo âm Hán Việt (VD: NHẤT, SƠN, TAM...)</li>
              <li>Tìm theo nghĩa tiếng Việt</li>
            </ul>

            <h2 className="mt-6 mb-3 text-2xl font-bold tracking-tight">
              Ý nghĩa màu sắc trong biểu đồ
            </h2>
            <p className="mb-3">
              Màu sắc của các node (chấm tròn) trong biểu đồ 2D/3D thể hiện mức
              độ phổ biến của Kanji:
            </p>
            <div className="ml-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full border-2 border-black bg-[#0094FF]" />
                <div>
                  <strong className="text-[#0094FF]">Xanh đậm:</strong> Kanji
                  chính đang xem
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full border-2 border-black bg-[#FF6C00]" />
                <div>
                  <strong className="text-[#FF6C00]">Cam:</strong> Kanji thông
                  dụng (常用漢字 - Jōyō Kanji) - Khoảng 2,136 chữ
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full border-2 border-black bg-[#FFB700]" />
                <div>
                  <strong className="text-[#FFB700]">Vàng:</strong> Kanji dùng
                  cho tên riêng (人名用漢字 - Jinmeiyō Kanji)
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full border-2 border-black bg-white" />
                <div>
                  <strong>Trắng:</strong> Kanji khác (hiếm gặp, cổ, hoặc chỉ
                  dùng trong văn bản cổ)
                </div>
              </div>
            </div>

            <h2 className="mt-6 mb-3 text-2xl font-bold tracking-tight">
              Tính năng biểu đồ
            </h2>
            <ul className="ml-4 list-inside list-disc space-y-1">
              <li>
                <strong>2D/3D:</strong> Chuyển đổi giữa biểu đồ 2 chiều và 3
                chiều
              </li>
              <li>
                <strong>Hiện liên kết ra (Outbound Links):</strong> Hiển thị các
                Kanji khác có chứa Kanji hiện tại làm thành phần
              </li>
              <li>
                <strong>Particles:</strong> Hiển thị hạt di chuyển dọc theo các
                mũi tên để dễ theo dõi hướng phân tích
              </li>
              <li>
                <strong>Tự động xoay (3D):</strong> Biểu đồ 3D tự động quay để
                xem từ nhiều góc độ
              </li>
            </ul>

            <h2 className="mt-6 mb-3 text-2xl font-bold tracking-tight">
              Thông tin Kanji
            </h2>
            <p className="mb-2">Mỗi trang Kanji hiển thị đầy đủ thông tin:</p>
            <ul className="ml-4 list-inside list-disc space-y-1">
              <li>
                <strong>Âm đọc:</strong> Kunyomi (âm Kun), Onyomi (âm On), và âm
                Hán Việt
              </li>
              <li>
                <strong>Nghĩa:</strong> Nghĩa tiếng Việt và tiếng Anh
              </li>
              <li>
                <strong>Bộ thủ (Radical):</strong> Thông tin về bộ thủ với hình
                ảnh minh họa
              </li>
              <li>
                <strong>Nét viết:</strong> Hoạt hình thứ tự nét viết theo chuẩn
                Nhật Bản
              </li>
              <li>
                <strong>Từ vựng:</strong> Các từ vựng phổ biến có chứa Kanji này
                kèm âm thanh phát âm
              </li>
              <li>
                <strong>Biểu đồ phân tích:</strong> Sơ đồ kết nối các thành phần
                cấu tạo nên Kanji
              </li>
            </ul>

            <h1 className="mt-8 mb-4 text-3xl font-extrabold tracking-tight">
              Đóng góp
            </h1>
            <a
              href="https://web.facebook.com/thocodehoctiengnhat"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                alt="Donate"
                width={74}
                height={21}
                src={"/btn_donate_SM.gif"}
              />
            </a>
            <p className="mt-4">
              Phiên bản được phát triển ©{new Date().getFullYear()} bởi{" "}
              <a
                target="_blank"
                href="https://web.facebook.com/thocodehoctiengnhat"
                rel="noreferrer"
                className="text-primary inline-block hover:underline"
              >
                thocodehoctiengnhat
              </a>
            </p>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default About;
