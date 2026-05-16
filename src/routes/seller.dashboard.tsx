import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout/AppHeader";
import { SellerTabs } from "@/components/layout/SellerTabs";
import { formatCLP, LISTINGS } from "@/lib/mock-data";
import { TrendingUp, Package, AlertTriangle, Wallet, ChevronRight, Truck, Clock, CheckCircle2, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/seller/dashboard")({
  head: () => ({ meta: [{ title: "Panel vendedor — Trueki" }] }),
  component: SellerDashboard,
});

const PENDING_SHIPMENT = {
  orderId: "ORD-J4K5L6",
  title: "Air Jordan 1 Retro High OG",
  buyer: "Comprador verificado",
  soldAt: "Hoy 10:23",
  deadline: "Tienes 48h para despachar",
  inboundLabel: "https://example.com/label-inbound.pdf",
};

function SellerDashboard() {
  return (
    <div className="app-shell pb-24">
      <AppHeader title="Panel vendedor" />

      <div className="space-y-4 px-4 pt-3">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <Stat icon={<Wallet className="h-4 w-4" />} label="Por cobrar" value="$1.150.000" tone="trust" />
          <Stat icon={<TrendingUp className="h-4 w-4" />} label="Ventas este mes" value="7" />
          <Stat icon={<Package className="h-4 w-4" />} label="Publicaciones activas" value="4" />
          <Stat icon={<AlertTriangle className="h-4 w-4" />} label="Strikes" value="0" tone="success" />
        </div>

        {/* Alerta: acción requerida */}
        <div className="rounded-2xl border-2 border-warning/40 bg-warning/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-warning shrink-0" />
            <p className="text-sm font-semibold text-warning">Despacho requerido</p>
          </div>
          <p className="text-sm mb-1 font-medium line-clamp-1">{PENDING_SHIPMENT.title}</p>
          <p className="text-xs text-muted-foreground mb-3">{PENDING_SHIPMENT.deadline}</p>
          <div className="flex gap-2">
            <a
              href={PENDING_SHIPMENT.inboundLabel}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              <Truck className="h-3.5 w-3.5" /> Descargar etiqueta
            </a>
            <button className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium">
              Ver instrucciones
            </button>
          </div>
        </div>

        {/* Publicaciones activas */}
        <Section title="Mis publicaciones" action={{ label: "+ Publicar", to: "/sell" }}>
          <div className="space-y-2">
            {LISTINGS.slice(0, 3).map((l) => (
              <Link key={l.id} to="/listing/$id" params={{ id: l.id }} className="flex items-center gap-3 rounded-xl border border-border p-2.5">
                <img src={l.photos[0]} className="h-14 w-14 rounded-lg object-cover shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-1 text-sm font-medium">{l.title}</p>
                  <p className="text-[11px] text-muted-foreground">{l.brand} · 24 vistas</p>
                  <span className="inline-block mt-0.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Publicado</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{formatCLP(l.priceCLP)}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* Cómo funciona el pago */}
        <div className="rounded-2xl border border-border bg-muted/40 p-4">
          <p className="text-sm font-semibold mb-3">¿Cuándo recibes tu pago?</p>
          <div className="space-y-2.5">
            {[
              { icon: <Truck className="h-4 w-4 text-trust shrink-0" />, text: "Despachas a Trueki dentro de 48h" },
              { icon: <CheckCircle2 className="h-4 w-4 text-trust shrink-0" />, text: "Verificamos autenticidad y condición" },
              { icon: <Wallet className="h-4 w-4 text-trust shrink-0" />, text: "Pago liberado 48h después de entrega al comprador" },
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">{icon}<span>{text}</span></div>
            ))}
          </div>
        </div>

        {/* Historial de pagos */}
        <Section title="Pagos recientes">
          <div className="rounded-2xl border border-border overflow-hidden">
            {[
              { d: "26 abr", a: 280000, s: "Pagado", item: "Bolso Coach Tabby" },
              { d: "18 abr", a: 540000, s: "Pagado", item: "Gucci GG Canvas tote" },
              { d: "12 abr", a: 95000, s: "En proceso", item: "Nike Air Max 90" },
            ].map((r, i, arr) => (
              <div key={i} className={`flex items-center justify-between p-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                <div>
                  <p className="text-sm font-medium">{formatCLP(r.a)}</p>
                  <p className="text-[11px] text-muted-foreground">{r.item} · {r.d}</p>
                </div>
                <span className={`text-xs font-medium ${r.s === "Pagado" ? "text-success" : "text-warning"}`}>{r.s}</span>
              </div>
            ))}
          </div>
          <button className="mt-2 w-full rounded-full border border-border py-2.5 text-sm font-medium">
            Solicitar transferencia
          </button>
        </Section>

        {/* Strikes */}
        <div className="rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Tus strikes</p>
              <p className="text-xs text-muted-foreground mt-0.5">0 de 3 — 3 strikes = ban permanente</p>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-3 w-3 rounded-full border border-border bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <SellerTabs />
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${tone === "trust" ? "bg-trust/10 text-trust" : tone === "success" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-lg font-semibold">{value}</p>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: { label: string; to: string }; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        {action && <Link to={action.to as "/"} className="text-xs font-medium text-trust">{action.label}</Link>}
      </div>
      {children}
    </section>
  );
}
