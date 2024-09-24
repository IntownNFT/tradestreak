import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { TradeStreak } from "@/components/trade-streak";

export default async function Home() {
  const session = await getServerSession();
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white py-8">
      <TradeStreak />
    </main>
  );
}