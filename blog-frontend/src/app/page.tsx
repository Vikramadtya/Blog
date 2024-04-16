import Image from "next/image";
import InDevelopment from "@/components/molecules/inDevelopment";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <InDevelopment />
    </main>
  );
}
