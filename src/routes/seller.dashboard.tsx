import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Package, AlertTriangle, Wallet } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SellerTabs } from "@/components/layout/SellerTabs";
import { LISTINGS, formatCLP } from "@/lib/mock-data";

export const Route = createFileRoute("/seller/dashboard")({
  head: () => ({ meta: [{ title: "Panel vendedor — VeriCloset" }] }),
  component: SellerDashboard,
});

function SellerDashboard() {
  return (
    <div className="app-shell pb-24">
      <AppHeader title="Panel vendedor" />
      <div className="space-y-4 px-4 pt-3">
        <div className="grid grid-cols-2 gap-3">
          <Stat icon={<Wallet className="h-4 w-4" />} label="Por cobrar" value="$1.150.000" tone="trust" />
          <Stat icon={<TrendingUp className="h-4 w-4" />} label="Ventas mes" value="7" />
          <Stat icon={<Package className="h-4 w-4" />} label="Activos" value="4" />
          <Stat icon={<AlertTriangle className="h-4 w-4" />} label="Strikes" value="0" tone="success" />
        </div>

        <Section title="Mis publicaciones activas" action={{ label: "Publicar", to: "/sell" }}>
          <div className="space-y-2">
            {LISTINGS.slice(0, 3).map((l) => (
              <Link key={l.id} to="/listing/$id" params={{ id: l.id }} className="flex items-center gap-3 rounded-xl border border-border p-2.5">
                <img src={l.photos[0]} className="h-14 w-14 rounded-lg object-cover" alt="" />
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-medium">{l.title}</p>
                  <p className="text-[11px] text-muted-foreground">{l.brand} · 24 vistas</p>
                </div>
                <p className="text-sm font-semibold">{formatCLP(l.priceCLP)}</p>
              </Link>
            ))}
          </div>
        </Section>

        <Section title="Payouts recientes">
          <div className="rounded-xl border border-border">
            {[
              { d: "26 abr", a: 280000, s: "Pagado" },
              { d: "18 abr", a: 540000, s: "Pagado" },
              { d: "12 abr", a: 95000, s: "Pendiente" },
            ].map((r, i, arr) => (
              <div key={i} className={`flex items-center justify-between p-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                <div>
                  <p className="text-sm font-medium">{formatCLP(r.a)}</p>
                  <p className="text-[11px] text-muted-foreground">{r.d}</p>
                </div>
                <span className={`text-xs ${r.s === "Pagado" ? "text-success" : "text-warning"}`}>{r.s}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
      <SellerTabs />
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone?: "trust" | "success" }) {
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
