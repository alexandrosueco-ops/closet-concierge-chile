import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { TruekiLogo } from "@/components/TruekiLogo";
import { formatCLP } from "@/lib/mock-data";
import {
  BarChart3, ShieldAlert, Package, Wallet, Settings2,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  ChevronRight, X, Search, Users, Zap, Tag, Globe
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Trueki" }] }),
  component: () => <AuthGuard requiredRoles={["admin"]}><AdminConsole /></AuthGuard>,
});

type Tab = "dashboard" | "ordenes" | "disputes" | "pagos" | "marcas" | "vendedores";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard",  label: "Dashboard",  icon: <BarChart3 className="h-3.5 w-3.5" /> },
  { id: "ordenes",    label: "Órdenes",    icon: <Package className="h-3.5 w-3.5" /> },
  { id: "disputes",   label: "Disputas",   icon: <ShieldAlert className="h-3.5 w-3.5" /> },
  { id: "pagos",      label: "Pagos",      icon: <Wallet className="h-3.5 w-3.5" /> },
  { id: "marcas",     label: "Marcas",     icon: <Tag className="h-3.5 w-3.5" /> },
  { id: "vendedores", label: "Vendedores", icon: <Users className="h-3.5 w-3.5" /> },
];

function AdminConsole() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="app-shell min-h-dvh pb-4" style={{ maxWidth: 480 }}>
      {/* Header admin */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur safe-top">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <TruekiLogo size="sm" variant="icon" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Admin</p>
              <p className="text-sm font-black -mt-0.5" style={{ letterSpacing: "-0.03em" }}>Console</p>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black">A</div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-t border-border scrollbar-hide">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-xs font-bold transition-colors border-b-2 ${
                tab === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pt-4">
        {tab === "dashboard"  && <DashboardTab />}
        {tab === "ordenes"    && <OrdenesTab />}
        {tab === "disputes"   && <DisputasTab />}
        {tab === "pagos"      && <PagosTab />}
        {tab === "marcas"     && <MarcasTab />}
        {tab === "vendedores" && <VendedoresTab />}
      </div>
    </div>
  );
}

/* ─── DASHBOARD ─── */
function DashboardTab() {
  const kpis = [
    { label: "GMV este mes",       value: "$38.4M",  sub: "+23% vs anterior", up: true },
    { label: "Órdenes",            value: "87",       sub: "+12 esta semana",  up: true },
    { label: "Tasa autenticidad",  value: "94.2%",   sub: "+2.1% vs anterior",up: true },
    { label: "Tiempo verificación",value: "4.2h",    sub: "-0.8h vs anterior", up: true },
    { label: "Tasa disputas",      value: "1.8%",    sub: "-0.3% vs anterior", up: true },
    { label: "NPS vendedores",     value: "72",       sub: "+5 pts este mes",  up: true },
  ];

  const sla = [
    { label: "Inbound pendientes",          val: 4,  warn: false },
    { label: "En verificación",             val: 2,  warn: false },
    { label: "Outbound listos para despacho", val: 3, warn: false },
    { label: "SLA crítico > 6h",            val: 1,  warn: true  },
    { label: "Órdenes con pago retenido",   val: 12, warn: false },
  ];

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl border-2 border-border bg-card p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-xl font-black" style={{ letterSpacing: "-0.04em" }}>{k.value}</p>
            <div className={`mt-0.5 flex items-center gap-1 text-[10px] font-bold ${k.up ? "text-green-600" : "text-destructive"}`}>
              {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div>
        <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Acciones rápidas</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: <Zap className="h-4 w-4" />, label: "Capturar pagos elegibles" },
            { icon: <Globe className="h-4 w-4" />, label: "Ver bodega en vivo" },
            { icon: <ShieldAlert className="h-4 w-4" />, label: "Revisar fraudes" },
            { icon: <Settings2 className="h-4 w-4" />, label: "Ajustar comisiones" },
          ].map((a, i) => (
            <button key={i} className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card p-3 text-left hover:bg-muted active:scale-[0.98] transition-all">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-primary-foreground">{a.icon}</span>
              <span className="text-xs font-bold leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SLA bodega */}
      <div>
        <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">SLA bodega hoy</p>
        <div className="rounded-2xl border-2 border-border overflow-hidden">
          {sla.map((r, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < sla.length - 1 ? "border-b border-border" : ""} ${r.warn ? "bg-destructive/5" : ""}`}>
              <span className={`text-sm ${r.warn ? "font-bold text-destructive" : "text-foreground"}`}>{r.label}</span>
              <span className={`text-sm font-black ${r.warn ? "text-destructive" : "text-foreground"}`}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── ÓRDENES ─── */
function OrdenesTab() {
  const orders = [
    { id: "ORD-A1B2C3", brand: "Gucci",        amount: 630000, status: "En verificación",    mp: "MP-123456", color: "text-amber-600" },
    { id: "ORD-X9Y8Z7", brand: "Louis Vuitton", amount: 934500, status: "Esperando despacho", mp: "MP-789012", color: "text-muted-foreground" },
    { id: "ORD-D4E5F6", brand: "Jordan",         amount: 157500, status: "En tránsito",        mp: "MP-345678", color: "text-green-600" },
    { id: "ORD-G7H8I9", brand: "Gucci",          amount: 661500, status: "Completado",         mp: "MP-901234", color: "text-green-600" },
    { id: "ORD-M3N4O5", brand: "Nike",           amount: 95000,  status: "Disputa abierta",   mp: "MP-567890", color: "text-destructive" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-muted/50 px-3 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder="Buscar orden o vendedor..." className="flex-1 bg-transparent text-sm outline-none" />
      </div>
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border-2 border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between p-3">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground">{o.id}</p>
              <p className="text-sm font-bold">{o.brand} · {formatCLP(o.amount)}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-3 py-2">
            <span className={`text-xs font-bold ${o.color}`}>{o.status}</span>
            <span className="font-mono text-[10px] text-muted-foreground">{o.mp}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── DISPUTAS ─── */
function DisputasTab() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <p className="text-sm font-black text-destructive">1 disputa activa</p>
        </div>
        <p className="text-sm font-bold">ORD-M3N4O5 · Nike Air Max 90</p>
        <p className="text-xs text-muted-foreground mt-0.5">Condición diferente a lo declarado · Abierta hace 3h</p>
        <p className="text-xs text-muted-foreground">Comprador: d***@gmail.com · Vendedor verificado</p>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 rounded-full bg-destructive py-2 text-xs font-bold text-white">Aprobar reembolso</button>
          <button className="flex-1 rounded-full border-2 border-border py-2 text-xs font-bold">Denegar con evidencia</button>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-border p-4 text-center">
        <CheckCircle2 className="mx-auto h-6 w-6 text-green-500 mb-2" />
        <p className="text-sm font-bold">Sin más disputas activas</p>
        <p className="text-xs text-muted-foreground mt-0.5">Última resuelta hace 2 días</p>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Historial reciente</p>
        <div className="rounded-2xl border-2 border-border overflow-hidden">
          {[
            { id: "ORD-P6Q7", brand: "Balenciaga", res: "Reembolso aprobado", days: "hace 2 días", ok: true },
            { id: "ORD-R8S9", brand: "Coach",      res: "Denegada",           days: "hace 5 días", ok: false },
          ].map((d, i) => (
            <div key={i} className={`flex items-center justify-between p-3 ${i === 0 ? "border-b border-border" : ""}`}>
              <div>
                <p className="text-xs font-bold">{d.id} · {d.brand}</p>
                <p className={`text-[10px] font-bold ${d.ok ? "text-green-600" : "text-muted-foreground"}`}>{d.res}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{d.days}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PAGOS ─── */
function PagosTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-border bg-card p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Retenido MP</p>
          <p className="mt-1 text-lg font-black" style={{ letterSpacing: "-0.04em" }}>$2.840.000</p>
        </div>
        <div className="rounded-2xl border-2 border-border bg-card p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pendiente vendedores</p>
          <p className="mt-1 text-lg font-black" style={{ letterSpacing: "-0.04em" }}>$1.150.000</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Solicitudes de transferencia</p>
        {[
          { seller: "Valentina M.", rut: "12.456.789-0", banco: "BancoEstado", amount: 840000 },
          { seller: "Diego R.",     rut: "15.234.567-1", banco: "Santander",   amount: 310000 },
        ].map((p, i) => (
          <div key={i} className="mb-2 rounded-2xl border-2 border-border bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold">{p.seller}</p>
                <p className="text-[10px] text-muted-foreground">RUT: {p.rut} · {p.banco}</p>
              </div>
              <p className="text-sm font-black">{formatCLP(p.amount)}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 rounded-full bg-primary py-2 text-xs font-black">Transferir vía Fintoc</button>
              <button className="rounded-full border-2 border-border px-3 py-2 text-xs font-bold">Rechazar</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Captura automática</p>
        <div className="rounded-2xl border-2 border-primary/40 bg-primary/10 p-4">
          <p className="text-sm font-bold">3 órdenes elegibles para captura</p>
          <p className="text-xs text-muted-foreground mt-0.5">Entregadas hace más de 48h sin disputa abierta</p>
          <button className="mt-3 w-full rounded-full bg-foreground py-2.5 text-xs font-black text-background">
            Capturar todos ($2.187.000)
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MARCAS ─── */
function MarcasTab() {
  const [search, setSearch] = useState("");
  const brands = [
    { name: "Louis Vuitton", risk: "alta",  active: true,  minPrice: 150000, photos: 6 },
    { name: "Gucci",         risk: "alta",  active: true,  minPrice: 120000, photos: 6 },
    { name: "Chanel",        risk: "alta",  active: true,  minPrice: 200000, photos: 6 },
    { name: "Jordan",        risk: "media", active: true,  minPrice: 60000,  photos: 4 },
    { name: "Nike",          risk: "baja",  active: true,  minPrice: 25000,  photos: 2 },
    { name: "Adidas",        risk: "baja",  active: true,  minPrice: 20000,  photos: 2 },
    { name: "Balenciaga",    risk: "media", active: false, minPrice: 80000,  photos: 4 },
  ].filter((b) => !search || b.name.toLowerCase().includes(search.toLowerCase()));

  const riskColor: Record<string, string> = {
    alta: "text-destructive bg-destructive/10",
    media: "text-amber-700 bg-amber-50",
    baja: "text-green-700 bg-green-50",
  };

  return (
    <div className="space-y-3">
      <button className="w-full rounded-full bg-primary py-3 text-sm font-black">+ Agregar marca</button>
      <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-muted/50 px-3 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filtrar marca..." className="flex-1 bg-transparent text-sm outline-none" />
        {search && <button onClick={() => setSearch("")}><X className="h-4 w-4 text-muted-foreground" /></button>}
      </div>
      {brands.map((b) => (
        <div key={b.name} className={`rounded-2xl border-2 bg-card p-3 ${b.active ? "border-border" : "border-border/50 opacity-60"}`}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-black">{b.name}</p>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${riskColor[b.risk]}`}>{b.risk}</span>
              <span className={`h-2 w-2 rounded-full ${b.active ? "bg-green-400" : "bg-muted-foreground"}`} />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">Precio mín: {formatCLP(b.minPrice)} · {b.photos} fotos requeridas</p>
        </div>
      ))}
    </div>
  );
}

/* ─── VENDEDORES ─── */
function VendedoresTab() {
  const sellers = [
    { name: "Valentina M.", rut: "12.456.789-0", sales: 14, strikes: 0, status: "activo" },
    { name: "Diego R.",     rut: "15.234.567-1", sales: 7,  strikes: 1, status: "activo" },
    { name: "Camila F.",    rut: "11.222.333-4", sales: 3,  strikes: 2, status: "vigilado" },
    { name: "Matías L.",    rut: "16.789.012-5", sales: 21, strikes: 0, status: "activo" },
  ];

  const statusStyle: Record<string, string> = {
    activo:   "bg-green-50 text-green-700",
    vigilado: "bg-amber-50 text-amber-700",
    baneado:  "bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-muted/50 px-3 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder="Buscar vendedor o RUT..." className="flex-1 bg-transparent text-sm outline-none" />
      </div>
      {sellers.map((s) => (
        <div key={s.name} className="rounded-2xl border-2 border-border bg-card p-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-black">{s.name}</p>
              <p className="text-[10px] text-muted-foreground">RUT: {s.rut}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${statusStyle[s.status]}`}>{s.status}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span><span className="font-black">{s.sales}</span> ventas</span>
            <span className={s.strikes > 0 ? "text-destructive font-black" : "text-muted-foreground"}>
              {s.strikes} strikes
            </span>
          </div>
          {s.strikes > 0 && (
            <button className="mt-2 w-full rounded-full border-2 border-destructive/30 py-1.5 text-[11px] font-bold text-destructive">
              Emitir advertencia
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
