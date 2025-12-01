import composition from "@/../data/composition.json";
import { getGraphData, getKanjiDataFromAPI } from "@/lib";
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

// Enable dynamic rendering for SSR
export const dynamic = 'force-dynamic';

// Optional: Enable ISR with revalidation (comment out if you want pure SSR)
// export const revalidate = 3600; // Revalidate every 1 hour

export async function generateStaticParams() {
  const kanjis = Object.keys(composition);
  return kanjis.map((kanji) => ({
    id: kanji,
  }));
}

// Allow dynamic params for SSR
export const dynamicParams = true;

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

  const kanjiInfo = await getKanjiDataFromAPI(id);
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
