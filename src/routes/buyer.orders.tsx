import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { formatCLP } from "@/lib/mock-data";
import { ShieldCheck, Package, Truck, CheckCircle2, Clock, AlertCircle, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/buyer/orders")({
  head: () => ({ meta: [{ title: "Mis compras — VeriCloset" }] }),
  component: BuyerOrders,
});

type OrderStatus =
  | "payment_authorized" | "awaiting_seller_shipment" | "in_transit_to_warehouse"
  | "received_at_warehouse" | "in_verification" | "verification_approved"
  | "in_transit_to_buyer" | "delivered" | "completed"
  | "cancelled_refunded" | "dispute_open";

interface MockOrder {
  id: string;
  listingTitle: string;
  brand: string;
  photo: string;
  totalCLP: number;
  status: OrderStatus;
  updatedAt: string;
  trackingNumber?: string;
  carrier?: string;
  events: { at: string; label: string; done: boolean }[];
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: "ORD-A1B2C3",
    listingTitle: "Bolso Speedy 30 monogram",
    brand: "Louis Vuitton",
    photo: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80",
    totalCLP: 934500,
    status: "in_verification",
    updatedAt: "Hoy 14:32",
    events: [
      { at: "15 may", label: "Pago autorizado", done: true },
      { at: "16 may", label: "Vendedor despachó", done: true },
      { at: "17 may", label: "En bodega VeriCloset", done: true },
      { at: "Hoy", label: "Verificando autenticidad", done: false },
      { at: "", label: "Enviado a ti", done: false },
      { at: "", label: "Entregado", done: false },
    ],
  },
  {
    id: "ORD-D4E5F6",
    listingTitle: "Air Jordan 1 Retro High OG",
    brand: "Jordan",
    photo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
    totalCLP: 157500,
    status: "in_transit_to_buyer",
    updatedAt: "Ayer 09:15",
    trackingNumber: "9999123456789",
    carrier: "Chilexpress",
    events: [
      { at: "12 may", label: "Pago autorizado", done: true },
      { at: "13 may", label: "Vendedor despachó", done: true },
      { at: "14 may", label: "En bodega VeriCloset", done: true },
      { at: "14 may", label: "Verificación aprobada ✓", done: true },
      { at: "15 may", label: "Enviado a ti (Chilexpress)", done: true },
      { at: "", label: "Entregado", done: false },
    ],
  },
  {
    id: "ORD-G7H8I9",
    listingTitle: "Bolso GG Marmont matelassé",
    brand: "Gucci",
    photo: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=80",
    totalCLP: 630000,
    status: "completed",
    updatedAt: "10 may",
    events: [
      { at: "5 may", label: "Pago autorizado", done: true },
      { at: "6 may", label: "Vendedor despachó", done: true },
      { at: "7 may", label: "En bodega VeriCloset", done: true },
      { at: "7 may", label: "Verificación aprobada ✓", done: true },
      { at: "8 may", label: "Enviado a ti", done: true },
      { at: "10 may", label: "Entregado", done: true },
    ],
  },
];

function statusInfo(s: OrderStatus): { label: string; color: string; icon: React.ReactNode } {
  const map: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
    payment_authorized: { label: "Pago confirmado", color: "text-muted-foreground", icon: <Clock className="h-3.5 w-3.5" /> },
    awaiting_seller_shipment: { label: "Esperando despacho", color: "text-warning", icon: <Clock className="h-3.5 w-3.5" /> },
    in_transit_to_warehouse: { label: "En tránsito a VeriCloset", color: "text-trust", icon: <Truck className="h-3.5 w-3.5" /> },
    received_at_warehouse: { label: "Recibido en bodega", color: "text-trust", icon: <Package className="h-3.5 w-3.5" /> },
    in_verification: { label: "Verificando autenticidad", color: "text-trust", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    verification_approved: { label: "Verificación aprobada", color: "text-success", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    in_transit_to_buyer: { label: "En camino a ti", color: "text-trust", icon: <Truck className="h-3.5 w-3.5" /> },
    delivered: { label: "Entregado", color: "text-success", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    completed: { label: "Completado", color: "text-success", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    cancelled_refunded: { label: "Reembolsado", color: "text-destructive", icon: <AlertCircle className="h-3.5 w-3.5" /> },
    dispute_open: { label: "Disputa abierta", color: "text-destructive", icon: <AlertCircle className="h-3.5 w-3.5" /> },
  };
  return map[s];
}

function BuyerOrders() {
  const [selected, setSelected] = useState<string | null>(null);

  const order = selected ? MOCK_ORDERS.find((o) => o.id === selected) : null;

  if (order) return <OrderDetail order={order} onBack={() => setSelected(null)} />;

  return (
    <div className="app-shell pb-24">
      <AppHeader title="Mis compras" />
      <div className="space-y-3 px-4 pt-3">
        {MOCK_ORDERS.map((o) => {
          const info = statusInfo(o.status);
          return (
            <button key={o.id} onClick={() => setSelected(o.id)} className="w-full text-left rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex gap-3 p-3">
                <img src={o.photo} className="h-16 w-16 rounded-xl object-cover shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{o.brand}</p>
                  <p className="line-clamp-1 text-sm font-medium">{o.listingTitle}</p>
                  <p className="mt-0.5 text-sm font-semibold">{formatCLP(o.totalCLP)}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              </div>
              <div className={`flex items-center gap-1.5 border-t border-border px-3 py-2 text-xs font-medium ${info.color}`}>
                {info.icon}
                <span>{info.label}</span>
                <span className="ml-auto text-muted-foreground font-normal">{o.updatedAt}</span>
              </div>
            </button>
          );
        })}
      </div>
      <BottomTabs />
    </div>
  );
}

function OrderDetail({ order, onBack }: { order: MockOrder; onBack: () => void }) {
  const info = statusInfo(order.status);
  const [disputeOpen, setDisputeOpen] = useState(false);

  return (
    <div className="app-shell pb-24">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-3 safe-top">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-base font-semibold leading-tight">Orden #{order.id}</h1>
          <p className="text-[11px] text-muted-foreground">{order.updatedAt}</p>
        </div>
      </header>

      <div className="space-y-4 px-4 pt-4">
        <div className="flex gap-3 rounded-2xl border border-border p-3">
          <img src={order.photo} className="h-16 w-16 rounded-xl object-cover shrink-0" alt="" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{order.brand}</p>
            <p className="line-clamp-1 text-sm font-medium">{order.listingTitle}</p>
            <p className="mt-1 text-sm font-semibold">{formatCLP(order.totalCLP)}</p>
          </div>
        </div>

        {/* Estado actual */}
        <div className={`flex items-center gap-2 rounded-xl border border-border p-3 ${info.color}`}>
          {info.icon}
          <span className="text-sm font-medium">{info.label}</span>
        </div>

        {/* Tracking */}
        {order.trackingNumber && (
          <div className="rounded-2xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Número de seguimiento</p>
            <p className="mt-0.5 font-mono text-sm font-medium">{order.trackingNumber}</p>
            <p className="text-xs text-muted-foreground">{order.carrier}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="rounded-2xl border border-border p-4">
          <p className="mb-4 text-sm font-semibold">Estado del pedido</p>
          <div className="relative space-y-0">
            {order.events.map((e, i) => (
              <div key={i} className="flex gap-3 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${e.done ? "border-trust bg-trust" : "border-border bg-background"}`}>
                    {e.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                  {i < order.events.length - 1 && (
                    <div className={`mt-1 w-0.5 flex-1 min-h-[20px] ${e.done ? "bg-trust" : "bg-border"}`} />
                  )}
                </div>
                <div className="pb-1 pt-0.5">
                  <p className={`text-sm ${e.done ? "font-medium" : "text-muted-foreground"}`}>{e.label}</p>
                  {e.at && <p className="text-xs text-muted-foreground">{e.at}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protección VeriCloset */}
        <div className="rounded-2xl bg-trust/5 border border-trust/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-trust" />
            <p className="text-sm font-semibold text-trust">Protección VeriCloset activa</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Tu pago está retenido y se liberará al vendedor 48h después de que confirmes la entrega. Si hay algún problema, repórtalo aquí.
          </p>
        </div>

        {/* Botón disputa si está entregado */}
        {(order.status === "delivered" || order.status === "completed") && (
          <button onClick={() => setDisputeOpen(true)} className="w-full rounded-full border border-destructive py-3 text-sm font-semibold text-destructive">
            Reportar un problema
          </button>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
