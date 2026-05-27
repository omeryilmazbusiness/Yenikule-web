import { mockContactMessages } from "../src/features/contact/data/contact.mock";
import { contactPostgresRepository } from "../src/features/contact/repositories/contact.postgres.repository";
import { mockListings } from "../src/features/listings/data/listings.mock";
import { listingPostgresRepository } from "../src/features/listings/repositories/listing.postgres.repository";
import { mockProjects } from "../src/features/projects/data/projects.mock";
import { projectPostgresRepository } from "../src/features/projects/repositories/project.postgres.repository";
import { mockVehicles } from "../src/features/vehicles/data/vehicles.mock";
import { vehiclePostgresRepository } from "../src/features/vehicles/repositories/vehicle.postgres.repository";
import { pingDatabase } from "../src/lib/sql";

async function main() {
  console.log("==> Veritabanı bağlantısı test ediliyor...");
  await pingDatabase();
  console.log("✓ Bağlantı OK\n");

  console.log("==> Mock veriler yazılıyor...");

  for (const project of mockProjects) {
    await projectPostgresRepository.upsert(project);
  }
  console.log(`✓ ${mockProjects.length} proje`);

  for (const listing of mockListings) {
    await listingPostgresRepository.upsert(listing);
  }
  console.log(`✓ ${mockListings.length} ilan`);

  for (const vehicle of mockVehicles) {
    await vehiclePostgresRepository.upsert(vehicle);
  }
  console.log(`✓ ${mockVehicles.length} araç`);

  for (const message of mockContactMessages) {
    await contactPostgresRepository.upsert(message);
  }
  console.log(`✓ ${mockContactMessages.length} mesaj`);

  console.log("\nSeed tamamlandı.");
}

main().catch((error) => {
  console.error("Seed hatası:", error);
  process.exit(1);
});
