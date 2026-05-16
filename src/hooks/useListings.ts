/**
 * Hooks para listings — conecta con Supabase real
 * Fallback a mock-data si no hay conexión
 */
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LISTINGS, type Listing } from "@/lib/mock-data";

export interface SupabaseListing {
  id: string;
  title: string;
  description: string | null;
  size: string | null;
  condition: string;
  price_clp: number;
  status: string;
  brand_id: string | null;
  category_id: string | null;
  seller_id: string;
  brands?: { name: string; risk_level: string } | null;
  categories?: { name: string } | null;
  listing_photos?: { url: string; position: number }[];
  profiles?: { display_name: string | null } | null;
}

export function usePublishedListings(filters?: {
  brandId?: string;
  categoryId?: string;
  search?: string;
  limit?: number;
}) {
  const [listings, setListings] = useState<SupabaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q = supabase
      .from("listings")
      .select(`
        id, title, description, size, condition, price_clp, status, seller_id,
        brands(name, risk_level),
        categories(name),
        listing_photos(url, position),
        profiles!seller_id(display_name)
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(filters?.limit ?? 40);

    if (filters?.brandId) q = q.eq("brand_id", filters.brandId);
    if (filters?.categoryId) q = q.eq("category_id", filters.categoryId);
    if (filters?.search) q = q.ilike("title", `%${filters.search}%`);

    q.then(({ data, error: err }) => {
      setLoading(false);
      if (err) { setError(err.message); return; }
      setListings((data as unknown as SupabaseListing[]) ?? []);
    });
  }, [filters?.brandId, filters?.categoryId, filters?.search]);

  return { listings, loading, error };
}

export function useBrands() {
  const [brands, setBrands] = useState<{ id: string; slug: string; name: string; risk_level: string }[]>([]);

  useEffect(() => {
    supabase
      .from("brands")
      .select("id, slug, name, risk_level")
      .eq("whitelisted", true)
      .order("name")
      .then(({ data }) => setBrands(data ?? []));
  }, []);

  return brands;
}

export function useCategories() {
  const [cats, setCats] = useState<{ id: string; slug: string; name: string }[]>([]);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, slug, name")
      .order("name")
      .then(({ data }) => setCats(data ?? []));
  }, []);

  return cats;
}
