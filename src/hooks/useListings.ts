import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DbListing {
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
  brands: { id: string; name: string; risk_level: string; slug: string } | null;
  categories: { id: string; name: string; slug: string } | null;
  listing_photos: { url: string; position: number }[];
  profiles: { display_name: string | null } | null;
}

export function usePublishedListings(filters?: {
  brandId?: string;
  categoryId?: string;
  search?: string;
  limit?: number;
}) {
  const [listings, setListings] = useState<DbListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    let q = supabase
      .from("listings")
      .select(`
        id, title, description, size, condition, price_clp, status, seller_id,
        brands(id, name, risk_level, slug),
        categories(id, name, slug),
        listing_photos(url, position),
        profiles!seller_id(display_name)
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(filters?.limit ?? 40);

    if (filters?.brandId)    q = q.eq("brand_id", filters.brandId);
    if (filters?.categoryId) q = q.eq("category_id", filters.categoryId);
    if (filters?.search)     q = q.ilike("title", `%${filters.search}%`);

    q.then(({ data, error: err }) => {
      setLoading(false);
      if (err) { setError(err.message); return; }
      const sorted = (data ?? []).map((l: any) => ({
        ...l,
        listing_photos: (l.listing_photos ?? []).sort((a: any, b: any) => a.position - b.position),
      }));
      setListings(sorted as DbListing[]);
    });
  }, [filters?.brandId, filters?.categoryId, filters?.search, filters?.limit]);

  return { listings, loading, error };
}

export function useListing(id: string) {
  const [listing, setListing] = useState<DbListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("listings")
      .select(`
        id, title, description, size, condition, price_clp, status, seller_id,
        brands(id, name, risk_level, slug),
        categories(id, name, slug),
        listing_photos(url, position),
        profiles!seller_id(display_name)
      `)
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        setLoading(false);
        if (err) { setError(err.message); return; }
        if (data) {
          const sorted = {
            ...data,
            listing_photos: ((data as any).listing_photos ?? []).sort((a: any, b: any) => a.position - b.position),
          };
          setListing(sorted as unknown as DbListing);
        }
      });
  }, [id]);

  return { listing, loading, error };
}

export function useBrands() {
  const [brands, setBrands] = useState<{ id: string; slug: string; name: string; risk_level: string; whitelisted: boolean }[]>([]);

  useEffect(() => {
    supabase
      .from("brands")
      .select("id, slug, name, risk_level, whitelisted")
      .eq("whitelisted", true)
      .order("name")
      .then(({ data }) => setBrands((data as any[]) ?? []));
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
      .then(({ data }) => setCats((data as any[]) ?? []));
  }, []);

  return cats;
}

// Helpers
export function conditionLabel(c: string): string {
  const map: Record<string, string> = {
    new_with_tags: "Nuevo con etiqueta",
    like_new: "Como nuevo",
    very_good: "Muy buen estado",
    good: "Buen estado",
    fair: "Aceptable",
  };
  return map[c] ?? c;
}

export function formatCLP(n: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency", currency: "CLP", minimumFractionDigits: 0,
  }).format(n);
}
