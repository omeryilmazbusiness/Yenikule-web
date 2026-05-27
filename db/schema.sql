-- Yeni Kule — PostgreSQL schema (v1)
-- Uygulama tipleriyle uyumlu; JSONB ile features/images/media dizileri.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('planlama', 'insaat', 'tamamlandi', 'satista')),
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  neighborhood TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  total_units INTEGER NOT NULL DEFAULT 0,
  available_units INTEGER NOT NULL DEFAULT 0,
  start_year INTEGER NOT NULL,
  delivery_year INTEGER,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  cover_image TEXT NOT NULL DEFAULT '',
  brochure_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_city ON projects (city);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at DESC);

-- ---------------------------------------------------------------------------
-- Listings (konut / gayrimenkul)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('konut', 'isyeri', 'arsa', 'villa', 'proje')),
  type TEXT NOT NULL CHECK (type IN ('satilik', 'kiralik', 'devren')),
  status TEXT NOT NULL CHECK (status IN ('aktif', 'rezerve', 'satildi', 'kiralandi', 'pasif')),
  price NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY',
  area NUMERIC(12, 2) NOT NULL,
  rooms TEXT,
  floor INTEGER,
  total_floors INTEGER,
  building_age INTEGER,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  neighborhood TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  media JSONB,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  project_id TEXT REFERENCES projects (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings (slug);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings (category);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings (type);
CREATE INDEX IF NOT EXISTS idx_listings_city_district ON listings (city, district);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings (price);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings (created_at DESC);

-- ---------------------------------------------------------------------------
-- Vehicles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('otomobil', 'suv', 'ticari', 'motosiklet')),
  status TEXT NOT NULL CHECK (status IN ('aktif', 'rezerve', 'satildi', 'pasif')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  condition JSONB,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('benzin', 'dizel', 'lpg', 'hibrit', 'elektrik')),
  transmission TEXT NOT NULL CHECK (transmission IN ('manuel', 'otomatik')),
  engine_size TEXT,
  color TEXT NOT NULL,
  price NUMERIC(14, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY',
  city TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_slug ON vehicles (slug);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles (status);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles (brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles (category);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON vehicles (year);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles (price);
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON vehicles (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles (created_at DESC);

-- ---------------------------------------------------------------------------
-- Contact messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'yeni' CHECK (status IN ('yeni', 'okundu', 'yanitlandi', 'arsiv')),
  listing_id TEXT REFERENCES listings (id) ON DELETE SET NULL,
  project_id TEXT REFERENCES projects (id) ON DELETE SET NULL,
  vehicle_id TEXT REFERENCES vehicles (id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);

-- ---------------------------------------------------------------------------
-- Site settings (tek satır)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Search analytics
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS search_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_analytics_searched_at ON search_analytics_events (searched_at DESC);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['projects', 'listings', 'vehicles', 'contact_messages', 'site_settings']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t,
      t
    );
  END LOOP;
END;
$$;
