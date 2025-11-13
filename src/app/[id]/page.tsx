import composition from "@/../data/composition.json";
import { getGraphData, getKanjiDataLocal } from "@/lib";
import { Metadata } from "next";
import { KanjiPageContent } from "./inner";
import { Header } from "@/components/header";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: urlEncodedId } = await params;
  const id = decodeURIComponent(urlEncodedId);
  return {
    title: id,
  };
}

export async function generateStaticParams() {
  const kanjis = Object.keys(composition);
  return kanjis.map((kanji) => ({
    id: kanji,
  }));
}

// Disable dynamic params - only allow pre-generated static pages
export const dynamicParams = false;

export default async function KanjiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: urlEncodedId } = await params;
  const id = decodeURIComponent(urlEncodedId);

  // Check if Kanji exists in composition
  if (!(id in composition)) {
    notFound();
  }

  const kanjiInfo = await getKanjiDataLocal(id);
  const graphData = await getGraphData(id);

  return (
    <div className="size-full">
      <Header className="w-full" showLogo />
      {kanjiInfo && (
        <KanjiPageContent
          kanji={id}
          kanjiInfo={kanjiInfo}
          graphData={graphData}
        />
      )}
    </div>
  );
}
