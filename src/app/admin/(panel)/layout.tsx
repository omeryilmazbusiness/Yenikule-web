import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/layout/AdminShell";
import { getAuthToken } from "@/features/auth/auth-cookies";
import { AuthError, requireAdmin } from "@/features/auth/auth-guards";
import { routes } from "@/lib/routes";

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = await getAuthToken();

  const user = await requireAdmin(token).catch((error) => {
    if (error instanceof AuthError) {
      redirect(routes.auth.login);
    }
    throw error;
  });

  return (
    <AdminShell title="Yönetim Paneli" userName={user.name} userEmail={user.email}>
      {children}
    </AdminShell>
  );
}
