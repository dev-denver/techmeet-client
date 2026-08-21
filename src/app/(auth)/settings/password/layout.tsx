import type { Metadata } from "next";
import { PAGE_TITLES } from "@/lib/constants";

export const metadata: Metadata = { title: PAGE_TITLES["/settings/password"] };

export default function PasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
