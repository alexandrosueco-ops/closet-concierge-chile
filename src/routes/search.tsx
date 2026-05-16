import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search as SearchIcon, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { ListingCard } from "@/components/ListingCard";
import { SkeletonList } from "@/components/SkeletonCard";
import { BRANDS, CATEGORIES, LISTINGS } from "@/lib/mock-data";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Buscar — Trueki" }] }),
  component: SearchPage,
});

const SORT_OPTIONS = [
  { value: "reciente", label: "Más reciente" },
  { value: "precio_asc", label: "Precio: menor a mayor" },
  { value: "precio_desc", label: "Precio: mayor a menor" },
  { value: "descuento", label: "Mayor descuento" },
];

const CONDITIONS = [
  { value: "nuevo", label: "Nuevo con etiqueta" },
  { value: "como_nuevo", label: "Como nuevo" },
  { value: "muy_bueno", label: "Muy buen estado" },
  { value: "bueno", label: "Buen estado" },
];

function SearchPage() {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [cat, setCat] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sort, setSort] = useState("reciente");
  const [showFilters, setShowFilters] = useState(false);

  const hasFilters = !!(brand || cat || condition || maxPrice > 0);

  const results = useMemo(() => {
    let list = LISTINGS.filter((l) => {
      if (brand && l.brand !== brand) return false;
      if (cat && l.category !== cat) return false;
      if (condition && l.condition !== condition) return false;
      if (maxPrice > 0 && l.priceCLP > maxPrice) return false;
      if (q && !`${l.title} ${l.brand} ${l.description}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });

    if (sort === "precio_asc") list = [...list].sort((a, b) => a.priceCLP - b.priceCLP);
    else if (sort === "precio_desc") list = [...list].sort((a, b) => b.priceCLP - a.priceCLP);
    else if (sort === "descuento") list = [...list].sort((a, b) => {
      const da = a.originalPriceCLP ? (1 - a.priceCLP / a.originalPriceCLP) : 0;
      const db = b.originalPriceCLP ? (1 - b.priceCLP / b.originalPriceCLP) : 0;
      return db - da;
    });

    return list;
  }, [q, brand, cat, condition, maxPrice, sort]);

  const clearAll = () => { setBrand(null); setCat(null); setCondition(null); setMaxPrice(0); };

  return (
    <div className="app-shell pb-24">
      {/* Barra búsqueda sticky */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur px-4 py-2.5 safe-top">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-muted/60 px-4 py-2.5">
            <SearchIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar marca, artículo, talla..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            {q && (
              <button onClick={() => setQ("")} className="text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilters((v) => !v)}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-colors ${showFilters || hasFilters ? "border-trust bg-trust/10 text-trust" : "border-border bg-card"}`}>
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Chips activos */}
        {hasFilters && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5">
            {brand && <Chip label={brand} onClear={() => setBrand(null)} />}
            {cat && <Chip label={CATEGORIES.find((c) => c.id === cat)?.name ?? cat} onClear={() => setCat(null)} />}
            {condition && <Chip label={CONDITIONS.find((c) => c.value === condition)?.label ?? condition} onClear={() => setCondition(null)} />}
            {maxPrice > 0 && <Chip label={`Hasta $${(maxPrice / 1000).toFixed(0)}K`} onClear={() => setMaxPrice(0)} />}
            <button onClick={clearAll} className="shrink-0 text-xs text-muted-foreground underline">Limpiar todo</button>
          </div>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="border-b border-border bg-muted/30 px-4 py-4 space-y-4">
          {/* Categoría */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Categoría</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setCat(cat === c.id ? null : c.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${cat === c.id ? "border-trust bg-trust/10 text-trust" : "border-border bg-card"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Marca */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Marca</p>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map((b) => (
                <button key={b.id} onClick={() => setBrand(brand === b.name ? null : b.name)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${brand === b.name ? "border-trust bg-trust/10 text-trust" : "border-border bg-card"}`}>
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Condición */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Condición</p>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <button key={c.value} onClick={() => setCondition(condition === c.value ? null : c.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${condition === c.value ? "border-trust bg-trust/10 text-trust" : "border-border bg-card"}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Precio máximo */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Precio máximo {maxPrice > 0 ? `· $${(maxPrice / 1000).toFixed(0)}K` : ""}
            </p>
            <input type="range" min={0} max={2000000} step={50000} value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-[var(--trust)]" />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>Gratis</span><span>$2.000.000</span>
            </div>
          </div>

          <button onClick={() => setShowFilters(false)}
            className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
            Ver {results.length} resultado{results.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}

      {/* Resultados */}
      <div className="px-4 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{results.length} resultado{results.length !== 1 ? "s" : ""}</p>
          <div className="relative">
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="appearance-none rounded-xl border border-border bg-card pr-7 pl-3 py-1.5 text-xs font-medium outline-none">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <SearchIcon className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Sin resultados</p>
            <p className="mt-1 text-xs text-muted-foreground">Prueba con otra marca o quita algún filtro.</p>
            {hasFilters && <button onClick={clearAll} className="mt-3 text-xs font-medium text-trust">Limpiar filtros</button>}
          </div>
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
    <button onClick={onClear} className="shrink-0 flex items-center gap-1 rounded-full bg-trust/10 border border-trust/20 px-3 py-1 text-xs font-medium text-trust">
      {label} <X className="h-3 w-3" />
    </button>
  );
}
