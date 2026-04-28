import { createFileRoute } from "@tanstack/react-router";
import { Search, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { ListingCard } from "@/components/ListingCard";
import { BRANDS, CATEGORIES, LISTINGS } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VeriCloset — Reventa premium verificada en Chile" },
      { name: "description", content: "Compra y vende ropa, bolsos y zapatillas premium de segunda mano. Verificación de autenticidad antes de cada entrega." },
      { property: "og:title", content: "VeriCloset — Reventa premium verificada" },
      { property: "og:description", content: "Marketplace chileno con verificación de autenticidad en bodega antes de entregar." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="app-shell pb-24">
      <AppHeader showLogo />

      <section className="px-4 pt-2">
        <Link
          to="/search"
          className="flex items-center gap-3 rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          Bolsos, zapatillas, marcas...
        </Link>
      </section>

      {/* Trust banner */}
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
          <Pill icon={<ShieldCheck className="h-3.5 w-3.5" />} text="Pago en garantía" />
          <Pill icon={<Truck className="h-3.5 w-3.5" />} text="Envío seguro" />
        </div>
      </section>

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

      <section className="mt-6 px-4">
        <h3 className="mb-2 font-display text-base font-semibold">Marcas destacadas</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {BRANDS.slice(0, 8).map((b) => (
            <div key={b.id} className="shrink-0 rounded-2xl border border-border bg-card px-4 py-3 text-xs font-semibold">
              {b.name}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Recién publicado</h3>
          <Link to="/search" className="text-xs font-medium text-trust">Ver todo</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {LISTINGS.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
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
