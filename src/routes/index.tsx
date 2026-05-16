import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ShieldCheck, Sparkles, Truck, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { ListingCard } from "@/components/ListingCard";
import { BRANDS, CATEGORIES, LISTINGS } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VeriCloset — Reventa premium verificada en Chile" },
      { name: "description", content: "Compra y vende ropa, bolsos y zapatillas premium de segunda mano. Verificación de autenticidad antes de cada entrega." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="app-shell pb-24">
      <AppHeader showLogo />

      {/* Barra de búsqueda */}
      <section className="px-4 pt-2">
        <Link
          to="/search"
          className="flex items-center gap-3 rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          Bolsos, zapatillas, marcas…
        </Link>
      </section>

      {/* Hero banner */}
      <section className="mx-4 mt-4 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-[oklch(0.32_0.08_245)] p-5 text-primary-foreground">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
          <ShieldCheck className="h-4 w-4" /> Verificado antes de entregar
        </div>
        <h2 className="mt-2 font-display text-2xl font-semibold leading-tight">
          Cada pieza pasa por nuestro centro de autenticación.
        </h2>
        <p className="mt-1 text-sm opacity-80">Pagas, verificamos, recibes. Sin sorpresas.</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
          <Pill icon={<Sparkles className="h-3.5 w-3.5" />} text="Autenticidad" />
          <Pill icon={<ShieldCheck className="h-3.5 w-3.5" />} text="Pago seguro" />
          <Pill icon={<Truck className="h-3.5 w-3.5" />} text="Envío verificado" />
        </div>
      </section>

      {/* Cómo funciona — 3 pasos */}
      <section className="mt-6 px-4">
        <h3 className="mb-3 font-display text-base font-semibold">¿Cómo funciona?</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { n: "1", label: "Compras", sub: "Pago retenido en escrow" },
            { n: "2", label: "Verificamos", sub: "Autenticidad garantizada" },
            { n: "3", label: "Recibes", sub: "O reembolso total" },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-card p-3 text-center">
              <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-trust/10 text-xs font-bold text-trust">{s.n}</div>
              <p className="text-xs font-semibold">{s.label}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="mt-6 px-4">
        <h3 className="mb-2 font-display text-base font-semibold">Categorías</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/search"
              className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Marcas destacadas */}
      <section className="mt-6 px-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Marcas</h3>
          <Link to="/search" className="text-xs font-medium text-trust">Ver todas</Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {BRANDS.slice(0, 8).map((b) => (
            <div key={b.id} className="shrink-0 rounded-2xl border border-border bg-card px-4 py-3 text-xs font-semibold">
              {b.name}
            </div>
          ))}
        </div>
      </section>

      {/* Feed de publicaciones */}
      <section className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Recién publicado</h3>
          <Link to="/search" className="text-xs font-medium text-trust">Ver todo</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {LISTINGS.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      {/* Banner vendedor */}
      <section className="mx-4 mt-6 rounded-2xl border border-border p-4">
        <p className="text-sm font-semibold">¿Tienes artículos premium?</p>
        <p className="mt-1 text-xs text-muted-foreground">Vende con nosotros. Nosotros verificamos, empacamos y enviamos.</p>
        <Link to="/sell" className="mt-3 flex items-center justify-between rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">
          Publicar artículo <ChevronRight className="h-4 w-4" />
        </Link>
      </section>

      <BottomTabs />
    </div>
  );
}

function Pill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center justify-center gap-1 rounded-full bg-white/10 px-2 py-1.5 backdrop-blur">
      {icon}<span>{text}</span>
    </div>
  );
}
