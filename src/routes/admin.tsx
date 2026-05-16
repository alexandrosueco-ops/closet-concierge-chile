import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { formatCLP } from "@/lib/mock-data";
import {
  BarChart3, ShieldAlert, Package, Wallet, Users, Settings,
  TrendingUp, AlertTriangle, CheckCircle2, Clock, ChevronRight, X
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — VeriCloset" }] }),
  component: AdminConsole,
});

type Tab = "dashboard" | "ordenes" | "disputes" | "payouts" | "marcas";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "ordenes", label: "Órdenes", icon: <Package className="h-4 w-4" /> },
  { id: "disputes", label: "Disputas", icon: <ShieldAlert className="h-4 w-4" /> },
  { id: "payouts", label: "Pagos", icon: <Wallet className="h-4 w-4" /> },
  { id: "marcas", label: "Marcas", icon: <Settings className="h-4 w-4" /> },
];

function AdminConsole() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="app-shell pb-4">
      <AppHeader title="Admin Console" />

      {/* Tabs horizontales */}
      <div className="flex gap-1 overflow-x-auto border-b border-border px-4 pt-2 pb-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-xs font-medium transition-colors ${tab === t.id ? "border-b-2 border-trust text-trust" : "text-muted-foreground"}`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4">
        {tab === "dashboard" && <DashboardTab />}
        {tab === "ordenes" && <OrdenesTab />}
        {tab === "disputes" && <DisputasTab />}
        {tab === "payouts" && <PayoutsTab />}
        {tab === "marcas" && <MarcasTab />}
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

function DashboardTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <KPICard label="GMV mes" value="$38.450.000" trend="+23%" up />
        <KPICard label="Órdenes mes" value="87" trend="+12%" up />
        <KPICard label="Tasa de autenticidad" value="94.2%" trend="+2.1%" up />
        <KPICard label="Tiempo verificación" value="4.2h" trend="-0.8h" up />
        <KPICard label="Tasa de disputas" value="1.8%" trend="-0.3%" up />
        <KPICard label="NPS vendedores" value="72" trend="+5" up />
      </div>

      <Section title="SLA bodega hoy">
        <div className="space-y-2">
          {[
            { label: "Inbound pendientes", value: 4, warn: false },
            { label: "En verificación", value: 2, warn: false },
            { label: "Outbound listos", value: 3, warn: false },
            { label: "Órdenes con SLA crítico (>6h)", value: 1, warn: true },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm">{r.label}</span>
              <span className={`text-sm font-semibold ${r.warn ? "text-destructive" : ""}`}>{r.value}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── ÓRDENES ─────────────────────────────────────────────────────────────────

function OrdenesTab() {
  const orders = [
    { id: "ORD-A1B2C3", brand: "Gucci", amount: 630000, status: "in_verification", mp: "MP-123456", buyer: "c***@gmail.com" },
    { id: "ORD-X9Y8Z7", brand: "Louis Vuitton", amount: 934500, status: "awaiting_seller_shipment", mp: "MP-789012", buyer: "v***@gmail.com" },
    { id: "ORD-D4E5F6", brand: "Jordan", amount: 157500, status: "in_transit_to_buyer", mp: "MP-345678", buyer: "d***@gmail.com" },
    { id: "ORD-G7H8I9", brand: "Gucci", amount: 661500, status: "completed", mp: "MP-901234", buyer: "m***@gmail.com" },
  ];

  const statusLabel: Record<string, string> = {
    awaiting_seller_shipment: "Esperando despacho",
    in_verification: "En verificación",
    in_transit_to_buyer: "En tránsito",
    completed: "Completado",
  };

  const statusColor: Record<string, string> = {
    awaiting_seller_shipment: "text-warning",
    in_verification: "text-trust",
    in_transit_to_buyer: "text-trust",
    completed: "text-success",
  };

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{o.id}</p>
                <p className="text-sm font-medium">{o.brand} · {formatCLP(o.amount)}</p>
                <p className="text-xs text-muted-foreground">{o.buyer}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="border-t border-border flex items-center justify-between bg-muted/30 px-3 py-2">
            <span className={`text-xs font-medium ${statusColor[o.status]}`}>{statusLabel[o.status]}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{o.mp}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── DISPUTAS ─────────────────────────────────────────────────────────────────

function DisputasTab() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <p className="text-sm font-semibold text-destructive">1 disputa activa</p>
        </div>
        <p className="text-sm font-medium">ORD-M3N4O5 · Nike Air Max 90</p>
        <p className="text-xs text-muted-foreground mt-0.5">Razón: Condición diferente a lo declarado · Abierta hace 3h</p>
        <div className="mt-3 flex gap-2">
          <button className="rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-white">Aprobar reembolso</button>
          <button className="rounded-full border border-border px-4 py-2 text-xs font-medium">Denegar</button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center py-4">Sin más disputas activas</p>
    </div>
  );
}

// ─── PAYOUTS ─────────────────────────────────────────────────────────────────

function PayoutsTab() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <KPICard label="Por liberar MP" value="$2.840.000" />
        <KPICard label="Pendiente pago vendedores" value="$1.150.000" />
      </div>
      <Section title="Solicitudes de pago">
        <div className="space-y-2">
          {[
            { seller: "Valentina M.", rut: "12.456.789-0", banco: "BancoEstado", amount: 840000 },
            { seller: "Diego R.", rut: "15.234.567-1", banco: "Santander", amount: 310000 },
          ].map((p) => (
            <div key={p.seller} className="rounded-2xl border border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">{p.seller}</p>
                  <p className="text-xs text-muted-foreground">RUT: {p.rut} · {p.banco}</p>
                </div>
                <p className="text-sm font-semibold">{formatCLP(p.amount)}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground">Transferir vía Fintoc</button>
                <button className="rounded-full border border-border px-3 py-2 text-xs">Rechazar</button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── MARCAS ───────────────────────────────────────────────────────────────────

function MarcasTab() {
  const brands = [
    { name: "Louis Vuitton", risk: "alta", active: true, minPrice: 150000, photos: 6 },
    { name: "Gucci", risk: "alta", active: true, minPrice: 120000, photos: 6 },
    { name: "Jordan", risk: "media", active: true, minPrice: 60000, photos: 4 },
    { name: "Nike", risk: "baja", active: true, minPrice: 25000, photos: 2 },
    { name: "Balenciaga", risk: "media", active: true, minPrice: 80000, photos: 4 },
  ];

  return (
    <div className="space-y-3">
      <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">
        + Agregar marca
      </button>
      {brands.map((b) => (
        <div key={b.name} className="rounded-2xl border border-border p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{b.name}</p>
              <p className="text-xs text-muted-foreground">
                Riesgo: <span className={b.risk === "alta" ? "text-destructive font-medium" : b.risk === "media" ? "text-warning font-medium" : "text-success font-medium"}>{b.risk}</span>
                {" "}· Precio mín: {formatCLP(b.minPrice)}
                {" "}· {b.photos} fotos requeridas
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function KPICard({ label, value, trend, up }: { label: string; value: string; trend?: string; up?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-lg font-semibold mt-0.5">{value}</p>
      {trend && (
        <p className={`text-xs font-medium mt-0.5 ${up ? "text-success" : "text-destructive"}`}>
          {trend} vs mes anterior
        </p>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      {children}
    </section>
  );
}
