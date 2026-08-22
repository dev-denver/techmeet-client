import { TopBar } from "@/components/layout/TopBar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { PullToRefresh } from "@/components/layout/PullToRefresh";
import { ToastProvider } from "@/components/ui/toast";
import { PushRegistration } from "@/components/native/PushRegistration";

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
        <PushRegistration />
        <main className="overflow-y-auto h-screen pt-[calc(3.5rem+env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
          {children}
        </main>
        <BottomNavigation />
      </ToastProvider>
    </div>
  );
}
