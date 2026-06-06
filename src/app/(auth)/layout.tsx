import { TopBar } from "@/components/layout/TopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PullToRefresh } from "@/components/layout/PullToRefresh";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto max-w-[600px] min-h-screen bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.06)] md:shadow-xl">
      <TopBar />
      <PullToRefresh />
      <main className="overflow-y-auto h-screen pt-14 pb-16">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
