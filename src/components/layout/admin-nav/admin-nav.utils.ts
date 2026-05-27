import { routes } from "@/lib/routes";

export function isAdminNavLinkActive(pathname: string, href: string): boolean {
  if (href === routes.admin.dashboard) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
