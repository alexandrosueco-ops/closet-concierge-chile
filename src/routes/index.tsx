import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShieldCheck, Truck, RotateCcw, ChevronRight, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { ListingCard } from "@/components/ListingCard";
import { SkeletonList } from "@/components/SkeletonCard";
import { BRANDS, CATEGORIES, LISTINGS } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Trueki — Moda premium verificada en Chile" }] }),
  component: HomePage,
});

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="app-shell pb-24">
      <AppHeader showLogo />

      {/* Búsqueda */}
      <div className="px-4 pt-3">
        <Link to="/search" className="flex items-center gap-3 rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground active:bg-muted transition-colors">
          <Search className="h-4 w-4 shrink-0" />
          <span>Buscar marca, artículo, talla...</span>
        </Link>
      </div>

      {/* Hero sage */}
      <section className="mx-4 mt-4 overflow-hidden rounded-3xl bg-primary p-5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground/60 mb-2">
          <Sparkles className="h-3 w-3" /> autenticado · chile
        </div>
        <h2 className="font-black text-xl leading-tight text-foreground" style={{ letterSpacing: "-0.04em" }}>
          Moda premium.<br />Sin riesgos.
        </h2>
        <p className="mt-1 text-sm text-foreground/60">Cada pieza pasa autenticación antes de llegar a ti.</p>
        <Link to="/search" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background transition-all active:scale-95">
          Explorar ahora <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      {/* Pasos */}
      <section className="mt-5 px-4">
        <h3 className="mb-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Cómo funciona</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <ShieldCheck className="h-4 w-4" />, t: "Compras", s: "Pago retenido" },
            { icon: <Truck className="h-4 w-4" />, t: "Verificamos", s: "Centro Santiago" },
            { icon: <RotateCcw className="h-4 w-4" />, t: "O devolvemos", s: "Reembolso total" },
          ].map((p, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-3 text-center">
              <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">{p.icon}</div>
              <p className="text-[11px] font-black">{p.t}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">{p.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="mt-5 px-4">
        <h3 className="mb-2 text-base font-black" style={{ letterSpacing: "-0.03em" }}>Categorías</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to="/search"
              className="shrink-0 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-semibold active:bg-muted transition-colors">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Marcas */}
      <section className="mt-5 px-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-black" style={{ letterSpacing: "-0.03em" }}>Marcas</h3>
          <Link to="/search" className="text-xs font-bold text-muted-foreground">Ver todas →</Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {BRANDS.slice(0, 10).map((b) => (
            <div key={b.id} className="shrink-0 rounded-2xl border-2 border-border bg-card px-4 py-2.5 text-xs font-bold">{b.name}</div>
          ))}
        </div>
      </section>

      {/* Feed */}
      <section className="mt-5 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-black" style={{ letterSpacing: "-0.03em" }}>Recién publicado</h3>
          <Link to="/search" className="text-xs font-bold text-muted-foreground">Ver todo →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {LISTINGS.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      {!user && (
        <section className="mx-4 mt-6 rounded-2xl border-2 border-primary/40 bg-primary/10 p-4">
          <p className="font-black text-sm" style={{ letterSpacing: "-0.02em" }}>¿Tienes artículos premium?</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Vende con Trueki — verificamos y enviamos por ti.</p>
          <Link to="/sell" className="mt-3 flex items-center justify-between rounded-full bg-primary px-4 py-2.5 text-xs font-black">
            Publicar artículo <ChevronRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      <div className="h-6" />
      <BottomTabs />
    </div>
  );
}
