import * as React from "react";
import { Header } from "@/components/header";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin",
};

const About = () => {
  return (
    <>
      <div className="relative grid h-screen grid-rows-[50px_1fr]">
        <Header route="about" />
        <ScrollArea className="w-full">
          <div className="mx-auto mb-8 max-w-2xl p-4">
            <h1 className="mt-4 mb-4 text-3xl font-extrabold tracking-tight">
              Thông tin
            </h1>
            <p>
              nhaituvung.com là nền tảng website học tiếng Nhật hiển thị thông
              tin và cách phân tích (chiết tự) của chữ Kanji dưới dạng sơ đồ
              (biểu đồ kết nối)
            </p>
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
              Phiên bản được phát triển bởi ©{new Date().getFullYear()} bởi{" "}
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
