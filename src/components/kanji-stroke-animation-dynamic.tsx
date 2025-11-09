"use client";

import dynamic from "next/dynamic";

const KanjiStrokeAnimationDynamic = dynamic(
  () =>
    import("./kanji-stroke-animation").then(
      (mod) => mod.KanjiStrokeAnimation
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[250px] w-[250px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    ),
  }
);

export { KanjiStrokeAnimationDynamic };
