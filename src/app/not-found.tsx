import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <>
      <Header className="w-full" />
      <div className="grid size-full place-items-center">
        <h1 className="text-xl font-bold">404 - Not Found</h1>
      </div>
    </>
  );
}
