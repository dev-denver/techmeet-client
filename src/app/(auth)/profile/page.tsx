import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileTabsClient } from "@/components/features/profile/ProfileTabsClient";
import { getProfile } from "@/lib/supabase/queries/profile";
import { PROFILE_TABS, PAGE_TITLES } from "@/lib/constants";

export const metadata: Metadata = { title: PAGE_TITLES["/profile"] };

interface ProfilePageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const result = await getProfile();
  const profile = result?.data;
  const { tab } = await searchParams;
  const initialTab = PROFILE_TABS.some((t) => t.key === tab) ? (tab as (typeof PROFILE_TABS)[number]["key"]) : undefined;

  if (!profile) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            프로필 정보를 불러올 수 없습니다.
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ProfileTabsClient profile={profile} initialTab={initialTab} />;
}
