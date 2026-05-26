import type { ReactNode } from "react";

import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Yönetim Girişi",
  description: "Yeni Kule İnşaat yönetim paneli giriş sayfası.",
  path: routes.auth.login,
  noIndex: true,
});

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {children}
    </div>
  );
}
