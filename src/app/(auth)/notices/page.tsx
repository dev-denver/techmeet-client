import type { Metadata } from "next";
import { NoticeListClient } from "@/components/features/notices/NoticeListClient";
import { getNotices } from "@/lib/supabase/queries/notices";
import { PAGE_TITLES } from "@/lib/constants";

const PAGE_SIZE = 10;

export const metadata: Metadata = { title: PAGE_TITLES["/notices"] };

export default async function NoticesPage() {
  const { data: notices, total } = await getNotices({ page: 1, pageSize: PAGE_SIZE });

  return <NoticeListClient initialNotices={notices} initialTotal={total} />;
}
