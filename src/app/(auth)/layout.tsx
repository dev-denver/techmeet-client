import { TopBar } from "@/components/layout/TopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PullToRefresh } from "@/components/layout/PullToRefresh";
import { ToastProvider } from "@/components/ui/toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto max-w-[600px] min-h-screen bg-background border border-border">
      <ToastProvider>
        <TopBar />
        <PullToRefresh />
        <main className="overflow-y-auto h-screen pt-14 pb-16">
          {children}
        </main>
        <BottomNavigation />
      </ToastProvider>
    </div>
  );
}
