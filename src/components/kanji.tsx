"use client";

import * as React from "react";
import { joyoList } from "@/../data/joyo";
import { jinmeiyoList } from "@/../data/jinmeiyo";
import { KanjiStrokeAnimationDynamic } from "./kanji-stroke-animation-dynamic";

interface Props {
  kanji: string; // The kanji character to display
  kanjiInfo: KanjiInfo | null;
  graphData: BothGraphData | null;
  screen?: "mobile" | "desktop";
}

export const Kanji = ({ kanji, kanjiInfo, graphData, screen }: Props) => {
  return (
    <div className="relative flex size-full min-h-[330px] flex-col overflow-hidden md:grid md:grid-cols-[30%_70%]">
      {/* Animation Section */}
      <div className="flex w-full items-center justify-center p-4 md:p-12">
        <div className={screen === "mobile" ? "w-full max-w-[320px]" : ""}>
          <KanjiStrokeAnimationDynamic
            key={kanji}
            kanji={kanji}
            animationSpeed={600}
            showButton={true}
            size={screen === "mobile" ? 300 : 220}
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col space-y-2 p-4">
        <h1
          className="text-4xl leading-tight sm:text-4xl"
          style={{
            fontFamily: '"Zen Maru Gothic", sans-serif',
            fontWeight: 400,
            fontStyle: "normal",
          }}
        >
          {kanjiInfo?.id} - {kanjiInfo?.hanzi}
        </h1>

        <div className="text-sm leading-6">
          {kanjiInfo?.jishoData?.meaning && (
            <p>
              Ý nghĩa: <strong>{kanjiInfo?.jishoData?.meaning}</strong>
            </p>
          )}

          {kanjiInfo?.jishoData?.jlptLevel && (
            <p>
              Trình độ JLPT: <strong>{kanjiInfo?.jishoData?.jlptLevel}</strong>
            </p>
          )}

          {kanjiInfo?.jishoData?.newspaperFrequencyRank && (
            <p>
              <strong>{kanjiInfo?.jishoData?.newspaperFrequencyRank}</strong>{" "}
              trong 2500 kanji thông dụng nhất
            </p>
          )}

          {kanjiInfo?.jishoData?.strokeCount && (
            <p>
              Số nét: <strong>{kanjiInfo?.jishoData?.strokeCount}</strong>
            </p>
          )}

          {kanjiInfo?.jishoData?.kunyomi && (
            <p>
              Âm Kun: <strong>{kanjiInfo.jishoData.kunyomi.join(", ")}</strong>
            </p>
          )}

          {kanjiInfo?.jishoData?.onyomi && (
            <p>
              Âm On: <strong>{kanjiInfo.jishoData.onyomi.join(", ")}</strong>
            </p>
          )}

          {graphData?.noOutLinks?.links && (
            <p>
              {graphData.noOutLinks.links.filter(
                (link: any) => link.target === kanjiInfo?.id
              ).length > 0 && "Cấu tạo từ các bộ thủ: "}
              {graphData.noOutLinks.links
                .filter((link: any) => link.target === kanjiInfo?.id)
                .map((link: any) => link.source)
                .map((comp: any, index: number) => (
                  <span key={index}>{comp} </span>
                ))}
            </p>
          )}
          {kanjiInfo?.story && <p>Gợi ý cách nhớ: {kanjiInfo.story}</p>}
        </div>
      </div>
    </div>
  );
};
