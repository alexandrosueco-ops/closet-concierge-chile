import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { ListingCard } from "@/components/ListingCard";
import { BRANDS, CATEGORIES, LISTINGS } from "@/lib/mock-data";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Buscar — VeriCloset" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [cat, setCat] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const results = LISTINGS.filter((l) => {
    if (brand && l.brand !== brand) return false;
    if (cat && l.category !== cat) return false;
    if (q && !`${l.title} ${l.brand}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="app-shell pb-24">
      <AppHeader title="Buscar" />
      <div className="sticky top-14 z-20 bg-background/95 px-4 pb-3 pt-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2.5">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
        {(brand || cat) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {brand && <Chip label={brand} onClear={() => setBrand(null)} />}
            {cat && <Chip label={CATEGORIES.find(c => c.id === cat)?.name ?? cat} onClear={() => setCat(null)} />}
          </div>
        )}
      </div>

      {showFilters && (
        <div className="mx-4 mb-3 rounded-2xl border border-border bg-card p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoría</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => setCat(cat === c.id ? null : c.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${cat === c.id ? "border-trust bg-trust text-trust-foreground" : "border-border"}`}>
                {c.name}
              </button>
            ))}
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Marca</p>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((b) => (
              <button key={b.id} onClick={() => setBrand(brand === b.name ? null : b.name)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${brand === b.name ? "border-trust bg-trust text-trust-foreground" : "border-border"}`}>
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4">
        <p className="mb-3 text-xs text-muted-foreground">{results.length} resultados</p>
        {results.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-3">
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
    <button onClick={onClear} className="flex items-center gap-1 rounded-full bg-trust/10 px-3 py-1 text-xs font-medium text-trust">
      {label} <X className="h-3 w-3" />
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center">
      <p className="text-sm font-medium">Sin resultados</p>
      <p className="mt-1 text-xs text-muted-foreground">Prueba con otra marca o categoría.</p>
    </div>
  );
}
