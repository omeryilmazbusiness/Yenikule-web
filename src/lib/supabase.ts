import { env } from "@/lib/env";

export type SupabaseClientConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
};

export type SupabaseClient = {
  from: (table: string) => unknown;
  auth: {
    signInWithPassword: (credentials: {
      email: string;
      password: string;
    }) => Promise<{ data: unknown; error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
  };
};

/**
 * Supabase istemcisi için fabrika.
 * Ortam değişkenleri tanımlı değilse null döner (mock mod).
 */
export function createSupabaseClient(): SupabaseClient | null {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = env;

  if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  return {
    from: () => {
      throw new Error(
        "Supabase istemcisi henüz yapılandırılmadı. @supabase/supabase-js paketini ekleyin.",
      );
    },
    auth: {
      signInWithPassword: async () => ({
        data: null,
        error: new Error("Supabase auth henüz yapılandırılmadı."),
      }),
      signOut: async () => ({
        error: new Error("Supabase auth henüz yapılandırılmadı."),
      }),
    },
  };
}

export function getSupabaseConfig(): SupabaseClientConfig | null {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } =
    env;

  if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  return {
    url: NEXT_PUBLIC_SUPABASE_URL,
    anonKey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
  };
}
