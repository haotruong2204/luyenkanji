import { Header } from "@/components/header";

export default function Loading() {
  return (
    <div className="size-full">
      <Header className="w-full" showLogo />

      <div className="flex h-[calc(100vh-3rem)] w-full flex-col gap-4 p-4 lg:flex-row">
        {/* Left section skeleton */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Kanji display skeleton */}
          <div className="flex animate-pulse flex-col gap-4 rounded-lg border p-6">
            <div className="mx-auto h-32 w-32 rounded-lg bg-muted" />
            <div className="h-6 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
          </div>

          {/* Stroke animation skeleton */}
          <div className="flex animate-pulse flex-col gap-2 rounded-lg border p-4">
            <div className="h-6 w-32 rounded bg-muted" />
            <div className="mx-auto h-48 w-48 rounded-lg bg-muted" />
          </div>

          {/* Radical skeleton */}
          <div className="flex animate-pulse flex-col gap-2 rounded-lg border p-4">
            <div className="h-6 w-24 rounded bg-muted" />
            <div className="h-16 w-full rounded bg-muted" />
          </div>
        </div>

        {/* Right section skeleton */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Examples skeleton */}
          <div className="flex animate-pulse flex-col gap-4 rounded-lg border p-4">
            <div className="h-6 w-32 rounded bg-muted" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-4/5 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Graph skeleton */}
          <div className="flex flex-1 animate-pulse flex-col gap-2 rounded-lg border p-4">
            <div className="h-6 w-40 rounded bg-muted" />
            <div className="flex-1 rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
