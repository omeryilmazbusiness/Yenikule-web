import { redirect } from "next/navigation";

import { routes } from "@/lib/routes";

/** Eski URL — ana ayarlar sayfasına yönlendir */
export default function AdminSettingsSiteRedirectPage() {
  redirect(routes.admin.settings);
}
