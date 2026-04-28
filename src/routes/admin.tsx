import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingUp, ShieldCheck, AlertTriangle, Users, DollarSign, Package } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BRANDS } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — VeriCloset" }] }),
  component: AdminConsole,
});

const TABS = ["Resumen", "Marcas", "Disputas", "Pagos", "Equipo"] as const;

function AdminConsole() {
  const [tab, setTab] = useState<typeof TABS[number]>("Resumen");
  return (
    <div className="app-shell pb-12">
      <AppHeader title="Admin" />
      <div className="sticky top-14 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex gap-1 overflow-x-auto px-3 py-2">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        {tab === "Resumen" && <Resumen />}
        {tab === "Marcas" && <Marcas />}
        {tab === "Disputas" && <Disputas />}
        {tab === "Pagos" && <Pagos />}
        {tab === "Equipo" && <Equipo />}
      </div>
    </div>
  );
}

function Resumen() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <KPI icon={<DollarSign className="h-4 w-4" />} label="GMV mes" value="$48.2M" delta="+12%" />
      <KPI icon={<Package className="h-4 w-4" />} label="Órdenes" value="284" delta="+8%" />
      <KPI icon={<ShieldCheck className="h-4 w-4" />} label="Tasa fake" value="1.4%" tone="success" />
      <KPI icon={<TrendingUp className="h-4 w-4" />} label="Conversión" value="3.8%" />
      <KPI icon={<AlertTriangle className="h-4 w-4" />} label="Disputas" value="6" tone="warning" />
      <KPI icon={<Users className="h-4 w-4" />} label="SLA verif." value="22h" />
    </div>
  );
}

function Marcas() {
  return (
    <div className="space-y-2">
      {BRANDS.map((b) => (
        <div key={b.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
          <div>
            <p className="text-sm font-medium">{b.name}</p>
            <p className="text-[11px] text-muted-foreground">Riesgo: {b.risk}</p>
          </div>
          <button className={`rounded-full px-3 py-1 text-xs font-semibold ${b.risk === "high" ? "bg-destructive/10 text-destructive" : b.risk === "medium" ? "bg-warning/15 text-warning-foreground" : "bg-success/10 text-success"}`}>
            {b.risk === "high" ? "Alto" : b.risk === "medium" ? "Medio" : "Bajo"}
          </button>
        </div>
      ))}
    </div>
  );
}

function Disputas() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-3">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Disputa #DSP-{1000 + i}</p>
            <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground">Abierta</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Comprador reporta condición distinta.</p>
          <button className="mt-2 text-xs font-semibold text-trust">Revisar →</button>
        </div>
      ))}
    </div>
  );
}

function Pagos() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KPI label="Autorizados" value="$8.4M" />
        <KPI label="Capturados" value="$32.1M" />
        <KPI label="Reembolsos" value="$1.2M" />
      </div>
      <div className="rounded-xl border border-border">
        {[
          { id: "PI_001", a: 890000, s: "Capturado" },
          { id: "PI_002", a: 320000, s: "Autorizado" },
          { id: "PI_003", a: 95000, s: "Reembolsado" },
        ].map((p, i, a) => (
          <div key={p.id} className={`flex items-center justify-between p-3 ${i < a.length - 1 ? "border-b border-border" : ""}`}>
            <div>
              <p className="text-sm font-mono">{p.id}</p>
              <p className="text-[11px] text-muted-foreground">${p.a.toLocaleString("es-CL")}</p>
            </div>
            <span className="text-xs">{p.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Equipo() {
  return (
    <div className="space-y-2">
      {["Sofía A.", "Pedro G.", "Lucas M."].map((n) => (
        <div key={n} className="flex items-center gap-3 rounded-xl border border-border p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">{n[0]}</div>
          <div className="flex-1">
            <p className="text-sm font-medium">{n}</p>
            <p className="text-[11px] text-muted-foreground">Bodega · Santiago</p>
          </div>
          <span className="text-xs text-success">Activo</span>
        </div>
      ))}
    </div>
  );
}

function KPI({ icon, label, value, delta, tone }: { icon?: React.ReactNode; label: string; value: string; delta?: string; tone?: "success" | "warning" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      {icon && <div className={`flex h-7 w-7 items-center justify-center rounded-full ${tone === "success" ? "bg-success/10 text-success" : tone === "warning" ? "bg-warning/15 text-warning-foreground" : "bg-trust/10 text-trust"}`}>{icon}</div>}
      <p className="mt-2 text-[11px] text-muted-foreground">{label}</p>
      <p className="font-display text-lg font-semibold">{value}</p>
      {delta && <p className="text-[10px] font-medium text-success">{delta}</p>}
    </div>
  );
}
