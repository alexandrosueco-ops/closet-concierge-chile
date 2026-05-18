import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { AuthGuard } from "@/components/AuthGuard";
import { formatCLP } from "@/hooks/useListings";
import { ShieldCheck, Package, Truck, CheckCircle2, Clock, AlertCircle, ChevronRight, ArrowLeft, MessageCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/buyer/orders")({
  head: () => ({ meta: [{ title: "Mis compras — Trueki" }] }),
  component: () => <AuthGuard><BuyerOrdersContent /></AuthGuard>,
});

type OrderStatus = "payment_authorized" | "awaiting_seller_shipment" | "in_transit_to_warehouse"
  | "received_at_warehouse" | "in_verification" | "verification_approved"
  | "in_transit_to_buyer" | "delivered" | "completed" | "cancelled_refunded" | "dispute_open";

interface MockOrder {
  id: string; listingTitle: string; brand: string; photo: string;
  totalCLP: number; status: OrderStatus; updatedAt: string;
  trackingNumber?: string; carrier?: string;
  events: { at: string; label: string; done: boolean }[];
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: "ORD-A1B2C3", listingTitle: "Bolso Speedy 30 monogram", brand: "Louis Vuitton",
    photo: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80",
    totalCLP: 934500, status: "in_verification", updatedAt: "Hoy 14:32",
    events: [
      { at: "15 may", label: "Pago confirmado", done: true },
      { at: "16 may", label: "Vendedor despachó a Trueki", done: true },
      { at: "17 may", label: "Recibido en centro Trueki", done: true },
      { at: "Hoy", label: "Verificando autenticidad...", done: false },
      { at: "", label: "Enviado a ti", done: false },
      { at: "", label: "Entregado — 2h para confirmar", done: false },
    ],
  },
  {
    id: "ORD-D4E5F6", listingTitle: "Air Jordan 1 Retro High OG", brand: "Jordan",
    photo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
    totalCLP: 157500, status: "in_transit_to_buyer", updatedAt: "Ayer",
    trackingNumber: "999901234567", carrier: "Chilexpress",
    events: [
      { at: "12 may", label: "Pago confirmado", done: true },
      { at: "13 may", label: "Artículo enviado a Trueki", done: true },
      { at: "14 may", label: "Recibido en centro Trueki", done: true },
      { at: "14 may", label: "✓ Autenticidad verificada", done: true },
      { at: "15 may", label: "Enviado vía Chilexpress", done: true },
      { at: "", label: "Entregado — 2h para confirmar", done: false },
    ],
  },
];

const STATUS_MAP: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  payment_authorized:      { label: "Pago confirmado",          color: "text-muted-foreground", bg: "bg-muted/30",   icon: <Clock className="h-3.5 w-3.5" /> },
  awaiting_seller_shipment:{ label: "Preparando envío",         color: "text-yellow-700",       bg: "bg-yellow-50", icon: <Clock className="h-3.5 w-3.5" /> },
  in_transit_to_warehouse: { label: "En camino a Trueki",       color: "text-blue-700",         bg: "bg-blue-50",   icon: <Truck className="h-3.5 w-3.5" /> },
  received_at_warehouse:   { label: "Recibido en Trueki",       color: "text-blue-700",         bg: "bg-blue-50",   icon: <Package className="h-3.5 w-3.5" /> },
  in_verification:         { label: "Verificando autenticidad", color: "text-foreground",       bg: "bg-primary/10",icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  verification_approved:   { label: "✓ Verificación aprobada",  color: "text-green-700",        bg: "bg-green-50",  icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  in_transit_to_buyer:     { label: "En camino a ti",           color: "text-blue-700",         bg: "bg-blue-50",   icon: <Truck className="h-3.5 w-3.5" /> },
  delivered:               { label: "Entregado — 2h para confirmar", color: "text-foreground",  bg: "bg-primary/10",icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  completed:               { label: "Completado ✓",             color: "text-green-700",        bg: "bg-green-50",  icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  cancelled_refunded:      { label: "Reembolsado",              color: "text-destructive",      bg: "bg-red-50",    icon: <AlertCircle className="h-3.5 w-3.5" /> },
  dispute_open:            { label: "Disputa abierta",          color: "text-destructive",      bg: "bg-red-50",    icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

function BuyerOrdersContent() {
  const { displayName } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const order = MOCK_ORDERS.find(o => o.id === selected);

  if (order) return <OrderDetail order={order} onBack={() => setSelected(null)} />;

  return (
    <div className="app-shell pb-24">
      <AppHeader title="Mis compras" showLogo />

      <div className="px-4 pt-4 space-y-3">
        {MOCK_ORDERS.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center mt-4">
            <Package className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-black text-base mb-1">Sin compras aún</p>
            <p className="text-sm text-muted-foreground mb-5">Cuando compres algo, lo verás aquí con seguimiento en tiempo real.</p>
            <Link to="/search" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-black">
              Explorar artículos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          MOCK_ORDERS.map(o => {
            const info = STATUS_MAP[o.status];
            return (
              <button key={o.id} onClick={() => setSelected(o.id)}
                className="w-full text-left rounded-2xl border-2 border-border bg-card overflow-hidden active:scale-[0.98] transition-all">
                <div className="flex gap-3 p-3">
                  <img src={o.photo} className="h-16 w-16 rounded-xl object-cover shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{o.brand}</p>
                    <p className="line-clamp-1 text-sm font-bold">{o.listingTitle}</p>
                    <p className="mt-0.5 text-sm font-black">{formatCLP(o.totalCLP)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold ${info.color} ${info.bg}`}>
                  {info.icon}<span>{info.label}</span>
                  <span className="ml-auto text-muted-foreground font-normal">{o.updatedAt}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
      <BottomTabs />
    </div>
  );
}

function OrderDetail({ order, onBack }: { order: MockOrder; onBack: () => void }) {
  const info = STATUS_MAP[order.status];
  const [dispute, setDispute] = useState(false);

  return (
    <div className="app-shell pb-24">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b-2 border-border bg-background px-3 safe-top">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-black text-base">#{order.id}</h1>
          <p className="text-[11px] text-muted-foreground">{order.updatedAt}</p>
        </div>
      </header>

      <div className="space-y-4 px-4 pt-4">
        {/* Artículo */}
        <div className="flex gap-3 rounded-2xl border-2 border-border p-3">
          <img src={order.photo} className="h-16 w-16 rounded-xl object-cover shrink-0" alt="" />
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{order.brand}</p>
            <p className="line-clamp-1 text-sm font-bold">{order.listingTitle}</p>
            <p className="mt-1 text-sm font-black">{formatCLP(order.totalCLP)}</p>
          </div>
        </div>

        {/* Estado actual */}
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${info.color} ${info.bg}`}>
          {info.icon}<span>{info.label}</span>
        </div>

        {/* Tracking */}
        {order.trackingNumber && (
          <div className="rounded-2xl border-2 border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">Número de seguimiento</p>
            <p className="font-mono text-sm font-black">{order.trackingNumber}</p>
            <p className="text-xs text-muted-foreground">{order.carrier}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="rounded-2xl border-2 border-border p-4">
          <p className="text-sm font-black mb-4">Seguimiento del pedido</p>
          {order.events.map((e, i) => (
            <div key={i} className="flex gap-3 pb-4 last:pb-0">
              <div className="flex flex-col items-center">
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${e.done ? "border-primary bg-primary" : "border-border bg-background"}`}>
                  {e.done && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                </div>
                {i < order.events.length - 1 && (
                  <div className={`mt-1 w-0.5 flex-1 min-h-[20px] ${e.done ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
              <div className="pb-1 pt-0.5">
                <p className={`text-sm ${e.done ? "font-bold" : "text-muted-foreground"}`}>{e.label}</p>
                {e.at && <p className="text-xs text-muted-foreground">{e.at}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Protección */}
        <div className="rounded-2xl bg-primary/10 border-2 border-primary/30 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="h-4 w-4" /><p className="text-sm font-black">Protección Trueki activa</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tu pago está retenido. Una vez entregado, tienes <strong>2 horas</strong> para confirmar o reportar un problema. Si no hay reclamos, el pago se libera automáticamente.
          </p>
        </div>

        {/* Soporte */}
        <button className="flex w-full items-center gap-3 rounded-2xl border-2 border-border p-4 text-left hover:bg-muted transition-colors">
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium flex-1">Contactar soporte</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Disputa */}
        {order.status === "delivered" && !dispute && (
          <button onClick={() => setDispute(true)}
            className="w-full rounded-2xl border-2 border-destructive/30 py-3 text-sm font-black text-destructive hover:bg-destructive/5 transition-colors">
            Reportar un problema (2h disponibles)
          </button>
        )}
        {dispute && (
          <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4 space-y-2">
            <p className="text-sm font-black text-destructive">¿Cuál es el problema?</p>
            {["No es como se describe", "Artículo sospechoso / podría ser falso", "Llegó dañado en el envío", "Otro"].map(r => (
              <button key={r} className="w-full rounded-xl border-2 border-destructive/20 bg-background px-4 py-3 text-left text-sm font-bold text-destructive hover:bg-destructive/5 transition-colors">
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
