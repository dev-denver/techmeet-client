import { Card, CardContent } from "@/components/ui/card";
import { ProfileTabsClient } from "@/components/features/profile/ProfileTabsClient";
import { getProfile } from "@/lib/supabase/queries/profile";

export default async function ProfilePage() {
  const result = await getProfile();
  const profile = result?.data;

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

  return <ProfileTabsClient profile={profile} />;
}
