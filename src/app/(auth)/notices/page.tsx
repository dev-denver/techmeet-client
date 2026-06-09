import { NoticeListClient } from "@/components/features/notices/NoticeListClient";
import { getNotices } from "@/lib/supabase/queries/notices";

const PAGE_SIZE = 10;

export default async function NoticesPage() {
  const { data: notices, total } = await getNotices({ page: 1, pageSize: PAGE_SIZE });

  return <NoticeListClient initialNotices={notices} initialTotal={total} />;
}
