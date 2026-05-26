import Link from "next/link";
import {
  Building2,
  Car,
  MessageSquare,
  Plus,
  Settings,
  Tag,
} from "lucide-react";

import { AdminMetricCard } from "@/components/admin/AdminMetricCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { contactService } from "@/features/contact/services/contact.service";
import { listingService } from "@/features/listings/services/listing.service";
import { projectService } from "@/features/projects/services/project.service";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";
import { formatDateTime } from "@/lib/format";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Yönetim Paneli",
  path: routes.admin.dashboard,
  noIndex: true,
});

const quickActions = [
  { href: routes.listings.create, label: "Yeni İlan", icon: Tag },
  { href: routes.projects.create, label: "Yeni Proje", icon: Building2 },
  { href: routes.vehicles.create, label: "Yeni Araç", icon: Car },
  { href: routes.admin.settings, label: "Ayarlar", icon: Settings },
] as const;

export default async function AdminDashboardPage() {
  const [listings, projects, vehicles, unreadMessages, recentMessages, recentListings] =
    await Promise.all([
      listingService.getAll({ pageSize: 1, includeAllStatuses: true }),
      projectService.getAll({ pageSize: 1 }),
      vehicleService.getAll({ pageSize: 1 }),
      contactService.getUnreadCount(),
      contactService.getAll({ pageSize: 5 }),
      listingService.getAll({ pageSize: 5, sort: "newest", includeAllStatuses: true }),
    ]);

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Panel"
        description="Portföy özeti ve hızlı işlemler"
      />

      <div className="admin-metrics-grid">
        <AdminMetricCard title="İlanlar" value={listings.total} icon={Tag} />
        <AdminMetricCard title="Projeler" value={projects.total} icon={Building2} />
        <AdminMetricCard title="Araçlar" value={vehicles.total} icon={Car} />
        <AdminMetricCard
          title="Okunmamış"
          value={unreadMessages}
          icon={MessageSquare}
        />
      </div>

      <section className="admin-quick-actions" aria-label="Hızlı işlemler">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="admin-quick-action">
            <action.icon className="size-4" aria-hidden />
            {action.label}
          </Link>
        ))}
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel-card">
          <div className="admin-panel-card-head">
            <h2 className="admin-panel-card-title">Son Mesajlar</h2>
            <Link href={routes.admin.messages} className="admin-panel-card-link">
              Tümü
            </Link>
          </div>
          <ul className="admin-activity-list">
            {recentMessages.items.length === 0 ? (
              <li className="admin-activity-empty">Henüz mesaj yok.</li>
            ) : (
              recentMessages.items.map((message) => (
                <li key={message.id} className="admin-activity-item">
                  <div className="min-w-0">
                    <p className="admin-activity-title">{message.name}</p>
                    <p className="admin-activity-meta">{message.subject}</p>
                  </div>
                  <span className="admin-activity-badge">{message.status}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="admin-panel-card">
          <div className="admin-panel-card-head">
            <h2 className="admin-panel-card-title">Son İlanlar</h2>
            <Link href={routes.admin.listings} className="admin-panel-card-link">
              Tümü
            </Link>
          </div>
          <ul className="admin-activity-list">
            {recentListings.items.map((listing) => (
              <li key={listing.id} className="admin-activity-item">
                <div className="min-w-0">
                  <Link
                    href={routes.listings.edit(listing.id)}
                    className="admin-activity-title hover:text-bronze"
                  >
                    {listing.title}
                  </Link>
                  <p className="admin-activity-meta">
                    {formatDateTime(listing.updatedAt)}
                  </p>
                </div>
                <span className="admin-activity-badge">{listing.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
