"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { CirclePlayIcon } from "lucide-react";

export const Examples = ({ kanjiInfo }: { kanjiInfo: KanjiInfo | null }) => {
  const playSound = (url: string) => {
    const audio = new Audio(url);
    void audio.play();
  };

  const highlightKanji = (text: string) => {
    if (!kanjiInfo) return;
    const textArray = text?.split(kanjiInfo.id);
    return (
      <span>
        {textArray.map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {index !== textArray.length - 1 && <b>{kanjiInfo?.id}</b>}
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <div className="mb-14 grid size-full grid-rows-[36px_1fr] p-4">
      <div>
        <h3 className="text-lg font-extrabold">Từ vựng đi kèm</h3>
      </div>
      <div>
        {/* KANJIALIVE With AUDIO */}
        {kanjiInfo?.kanjialiveData?.examples && (
          <h5 className="text-foreground/50 my-2 text-sm">
            Ví dụ kèm âm thanh
          </h5>
        )}
        {kanjiInfo?.kanjialiveData?.examples?.map(
          (example: any, index: number) => {
            return (
              <div
                className="align-end odd:bg-muted flex items-center justify-between rounded-lg pl-2"
                key={index}
              >
                <p>
                  <span>
                    {highlightKanji(example?.japanese)}
                    &nbsp;&nbsp;&nbsp;
                  </span>
                  <span>
                    {example?.meaning?.vietnamese || example?.meaning?.english}
                    {"  "}
                  </span>
                </p>
                <Button
                  aria-label="Play sound"
                  variant="link"
                  size="icon"
                  onClick={() =>
                    example && example.audio && playSound(example?.audio?.mp3)
                  }
                >
                  <CirclePlayIcon className="size-5" />
                </Button>
              </div>
            );
          }
        )}
        {/* JISHO */}
        {kanjiInfo?.jishoData?.onyomiExamples &&
          kanjiInfo?.jishoData?.onyomiExamples?.length !== 0 && (
            <h5 className="text-foreground/50 my-2 text-sm">Ví dụ âm On</h5>
          )}
        {kanjiInfo?.jishoData?.onyomiExamples?.map(
          (onExample: any, index: number) => (
            <div
              key={index}
              className="align-end odd:bg-muted flex items-center justify-between rounded-lg p-2"
            >
              <p>
                {highlightKanji(onExample?.example)}
                {"  "}（{onExample?.reading}）{"  "}
                {onExample?.meaning}
              </p>
            </div>
          )
        )}
        {kanjiInfo?.jishoData?.kunyomiExamples &&
          kanjiInfo?.jishoData?.kunyomiExamples?.length !== 0 && (
            <h5 className="text-foreground/50 my-2 text-sm">Ví dụ âm Kun</h5>
          )}
        {kanjiInfo?.jishoData?.kunyomiExamples?.map(
          (kunExample: any, index: number) => (
            <div
              key={index}
              className="align-end odd:bg-muted flex items-center justify-between rounded-lg p-2"
            >
              <p>
                {highlightKanji(kunExample?.example)}
                {"  "}（{kunExample?.reading}）{"  "}
                {kunExample?.meaning}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
