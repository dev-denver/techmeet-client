import { TopBar } from "@/components/layout/TopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto max-w-[430px] min-h-screen bg-white">
      <TopBar />
      <main className="overflow-y-auto h-screen pt-14 pb-16">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
