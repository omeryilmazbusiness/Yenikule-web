import { contactPostgresRepository } from "../src/features/contact/repositories/contact.postgres.repository";
import { listingPostgresRepository } from "../src/features/listings/repositories/listing.postgres.repository";
import { projectPostgresRepository } from "../src/features/projects/repositories/project.postgres.repository";
import { vehiclePostgresRepository } from "../src/features/vehicles/repositories/vehicle.postgres.repository";
import { checkDatabaseHealth } from "../src/lib/db";
import { isMockMode } from "../src/lib/env";
import { getSql, pingDatabase, tableExists } from "../src/lib/sql";

async function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

async function main() {
  console.log("==> DB prod-ready test\n");

  assert(!isMockMode(), "USE_MOCK_DATA=false ve DATABASE_URL tanımlı olmalı");
  console.log("✓ Mock modu kapalı");

  const health = await checkDatabaseHealth();
  assert(health.connected, `DB bağlantısı başarısız: ${health.error ?? "bilinmiyor"}`);
  console.log("✓ PostgreSQL bağlantısı");

  await pingDatabase();

  for (const table of ["projects", "listings", "vehicles", "contact_messages"] as const) {
    assert(await tableExists(table), `Tablo eksik: ${table}`);
  }
  console.log("✓ Şema tabloları mevcut");

  const sql = getSql();
  const counts = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM listings) AS listings,
      (SELECT COUNT(*)::int FROM projects) AS projects,
      (SELECT COUNT(*)::int FROM vehicles) AS vehicles,
      (SELECT COUNT(*)::int FROM contact_messages) AS messages
  `;
  const row = counts[0] as {
    listings: number;
    projects: number;
    vehicles: number;
    messages: number;
  };

  console.log(
    `✓ Kayıt sayıları: ilan=${row.listings}, proje=${row.projects}, araç=${row.vehicles}, mesaj=${row.messages}`,
  );

  assert(row.listings > 0, "İlan verisi yok — npm run db:seed çalıştırın");
  assert(row.projects > 0, "Proje verisi yok — npm run db:seed çalıştırın");

  const listing = await listingPostgresRepository.findBySlug("bagcilar-3-plus-1-satilik-daire");
  assert(listing !== null, "Örnek ilan slug ile bulunamadı");
  assert(listing.title.length > 0, "İlan title boş");
  console.log(`✓ findBySlug: ${listing.slug}`);

  const vehicle = await vehiclePostgresRepository.findFeatured(1);
  assert(vehicle.length > 0, "Öne çıkan araç bulunamadı");
  console.log(`✓ findFeatured (araç): ${vehicle[0]?.slug}`);

  const project = await projectPostgresRepository.findBySlug(
    (await projectPostgresRepository.findAll({ pageSize: 1 })).items[0]?.slug ?? "",
  );
  assert(project !== null, "Proje okunamadı");
  console.log(`✓ findBySlug (proje): ${project.slug}`);

  const paginated = await listingPostgresRepository.findAll({
    status: "aktif",
    page: 1,
    pageSize: 5,
  });
  assert(paginated.items.length > 0, "Filtreli ilan listesi boş");
  assert(paginated.total >= paginated.items.length, "Pagination total hatalı");
  console.log(`✓ findAll + pagination: ${paginated.items.length}/${paginated.total}`);

  const unread = await contactPostgresRepository.countUnread();
  assert(typeof unread === "number", "countUnread sayı döndürmeli");
  console.log(`✓ countUnread: ${unread}`);

  console.log("\nTüm testler geçti — veritabanı prod-ready.");
}

main().catch((error) => {
  console.error("\nTest başarısız:", error instanceof Error ? error.message : error);
  process.exit(1);
});
