import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search as SearchIcon, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { ListingCard } from "@/components/ListingCard";
import { SkeletonList } from "@/components/SkeletonCard";
import { usePublishedListings, useBrands, useCategories, conditionLabel } from "@/hooks/useListings";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Buscar — Trueki" }] }),
  component: SearchPage,
});

const CONDITIONS = [
  { value: "new_with_tags", label: "Nuevo con etiqueta" },
  { value: "like_new",      label: "Como nuevo" },
  { value: "very_good",     label: "Muy buen estado" },
  { value: "good",          label: "Buen estado" },
];

const SORT_OPTIONS = [
  { value: "reciente",     label: "Más reciente" },
  { value: "precio_asc",   label: "Precio: menor a mayor" },
  { value: "precio_desc",  label: "Precio: mayor a menor" },
];

function SearchPage() {
  const [q, setQ] = useState("");
  const [brandId, setBrandId] = useState<string | null>(null);
  const [catId, setCatId] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sort, setSort] = useState("reciente");
  const [showFilters, setShowFilters] = useState(false);

  const brands = useBrands();
  const categories = useCategories();
  const { listings, loading } = usePublishedListings({ limit: 60 });

  const hasFilters = !!(brandId || catId || condition || maxPrice > 0);

  const results = useMemo(() => {
    let list = listings.filter((l) => {
      if (brandId && l.brand_id !== brandId) return false;
      if (catId && l.category_id !== catId) return false;
      if (condition && l.condition !== condition) return false;
      if (maxPrice > 0 && l.price_clp > maxPrice) return false;
      if (q && !`${l.title} ${l.brands?.name ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "precio_asc")  list = [...list].sort((a, b) => a.price_clp - b.price_clp);
    if (sort === "precio_desc") list = [...list].sort((a, b) => b.price_clp - a.price_clp);
    return list;
  }, [listings, q, brandId, catId, condition, maxPrice, sort]);

  const clearAll = () => { setBrandId(null); setCatId(null); setCondition(null); setMaxPrice(0); };

  return (
    <div className="app-shell pb-24">
      {/* Search bar sticky */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur px-4 py-2.5 safe-top">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-muted/60 px-4 py-2.5">
            <SearchIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar marca, artículo, talla..."
              className="flex-1 bg-transparent text-sm outline-none"
              autoFocus
            />
            {q && <button onClick={() => setQ("")}><X className="h-4 w-4 text-muted-foreground" /></button>}
          </div>
          <button onClick={() => setShowFilters((v) => !v)}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 transition-colors ${showFilters || hasFilters ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card"}`}>
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {hasFilters && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5">
            {brandId && <Chip label={brands.find(b => b.id === brandId)?.name ?? ""} onClear={() => setBrandId(null)} />}
            {catId && <Chip label={categories.find(c => c.id === catId)?.name ?? ""} onClear={() => setCatId(null)} />}
            {condition && <Chip label={conditionLabel(condition)} onClear={() => setCondition(null)} />}
            {maxPrice > 0 && <Chip label={`Hasta $${(maxPrice / 1000).toFixed(0)}K`} onClear={() => setMaxPrice(0)} />}
            <button onClick={clearAll} className="shrink-0 text-xs text-muted-foreground underline">Limpiar todo</button>
          </div>
        )}
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="border-b border-border bg-muted/30 px-4 py-4 space-y-4">
          <FilterSection title="Categoría">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <FilterPill key={c.id} label={c.name} active={catId === c.id} onClick={() => setCatId(catId === c.id ? null : c.id)} />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Marca">
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <FilterPill key={b.id} label={b.name} active={brandId === b.id} onClick={() => setBrandId(brandId === b.id ? null : b.id)} />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Condición">
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <FilterPill key={c.value} label={c.label} active={condition === c.value} onClick={() => setCondition(condition === c.value ? null : c.value)} />
              ))}
            </div>
          </FilterSection>

          <FilterSection title={`Precio máximo${maxPrice > 0 ? ` · $${(maxPrice / 1000).toFixed(0)}K` : ""}`}>
            <input type="range" min={0} max={2000000} step={50000} value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-[#c5c83f]" />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Cualquier precio</span><span>$2.000.000</span>
            </div>
          </FilterSection>

          <button onClick={() => setShowFilters(false)}
            className="w-full rounded-2xl bg-foreground py-3 text-sm font-black text-background">
            Ver {results.length} resultado{results.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}

      {/* Resultados */}
      <div className="px-4 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">
            {loading ? "Buscando..." : `${results.length} resultado${results.length !== 1 ? "s" : ""}`}
          </p>
          <div className="relative">
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="appearance-none rounded-xl border border-border bg-card pr-7 pl-3 py-1.5 text-xs font-bold outline-none">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {loading ? (
          <SkeletonList count={6} />
        ) : results.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
            <SearchIcon className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-black">Sin resultados</p>
            <p className="mt-1 text-xs text-muted-foreground">Prueba con otra marca o quita algún filtro.</p>
            {hasFilters && <button onClick={clearAll} className="mt-3 text-xs font-bold text-foreground underline">Limpiar filtros</button>}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 listings-grid">
            {results.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>

      <BottomTabs />
    </div>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button onClick={onClear} className="shrink-0 flex items-center gap-1 rounded-full bg-primary border-2 border-primary/30 px-3 py-1 text-xs font-bold text-primary-foreground">
      {label} <X className="h-3 w-3" />
    </button>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
      {label}
    </button>
  );
}
