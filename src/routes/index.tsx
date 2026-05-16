import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShieldCheck, Truck, RotateCcw, ChevronRight, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { ListingCard } from "@/components/ListingCard";
import { SkeletonList } from "@/components/SkeletonCard";
import { BRANDS, CATEGORIES, LISTINGS } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "VeriCloset — Reventa premium verificada en Chile" }] }),
  component: HomePage,
});

const PASOS = [
  { icon: <ShieldCheck className="h-5 w-5 text-trust" />, titulo: "Compras seguro", sub: "Tu pago queda retenido hasta que verificamos." },
  { icon: <Truck className="h-5 w-5 text-trust" />, titulo: "Verificamos", sub: "Centro de autenticación en Santiago." },
  { icon: <RotateCcw className="h-5 w-5 text-trust" />, titulo: "O devolvemos", sub: "Si hay algo mal, reembolso total al instante." },
];

function HomePage() {
  const { user } = useAuth();
  const loading = false; // Reemplazar con usePublishedListings cuando tengas datos reales

  return (
    <div className="app-shell pb-24">
      <AppHeader showLogo />

      {/* Barra de búsqueda */}
      <div className="px-4 pt-3">
        <Link to="/search" className="flex items-center gap-3 rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground active:bg-muted">
          <Search className="h-4 w-4 shrink-0" />
          <span>Buscar por marca, artículo...</span>
        </Link>
      </div>

      {/* Hero banner */}
      <section className="mx-4 mt-4 overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-70">
          <Sparkles className="h-3.5 w-3.5" /> Marketplace verificado · Chile
        </div>
        <h2 className="mt-2 font-display text-xl font-semibold leading-tight">
          Moda premium de segunda mano. Sin riesgos.
        </h2>
        <p className="mt-1 text-sm opacity-75">Cada artículo pasa por autenticación antes de llegar a ti.</p>
        <Link to="/search" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/25 transition-colors">
          Explorar ahora <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      {/* Cómo funciona */}
      <section className="mt-5 px-4">
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cómo funciona</h3>
        <div className="grid grid-cols-3 gap-2">
          {PASOS.map((p, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-3 text-center">
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-trust/10">{p.icon}</div>
              <p className="text-xs font-semibold">{p.titulo}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">{p.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="mt-5 px-4">
        <h3 className="mb-2 font-display text-base font-semibold">Categorías</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to="/search" search={{ cat: c.id } as Record<string, string>}
              className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium active:bg-muted">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Marcas destacadas */}
      <section className="mt-5 px-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Marcas</h3>
          <Link to="/search" className="text-xs font-medium text-trust">Ver todas →</Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          {BRANDS.slice(0, 10).map((b) => (
            <div key={b.id} className="shrink-0 rounded-2xl border border-border bg-card px-4 py-2.5 text-xs font-semibold">{b.name}</div>
          ))}
        </div>
      </section>

      {/* Feed */}
      <section className="mt-5 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Recién publicado</h3>
          <Link to="/search" className="text-xs font-medium text-trust">Ver todo →</Link>
        </div>
        {loading ? <SkeletonList count={6} /> : (
          <div className="grid grid-cols-2 gap-3">
            {LISTINGS.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      {/* Banner vender */}
      {!user && (
        <section className="mx-4 mt-6 rounded-2xl border border-border bg-muted/40 p-4">
          <p className="text-sm font-semibold">¿Tienes artículos premium?</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Vende con nosotros — verificamos y enviamos por ti.</p>
          <Link to="/sell" className="mt-3 flex items-center justify-between rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">
            Publicar artículo <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      <div className="h-6" />
      <BottomTabs />
    </div>
  );
}
