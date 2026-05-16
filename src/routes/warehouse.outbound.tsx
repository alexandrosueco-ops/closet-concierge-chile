import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout/AppHeader";
import { WarehouseTabs } from "@/components/layout/WarehouseTabs";
import { formatCLP } from "@/lib/mock-data";
import { Printer, CheckCircle2, Package, ChevronRight, Truck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/warehouse/outbound")({
  head: () => ({ meta: [{ title: "Outbound — VeriCloset Bodega" }] }),
  component: WarehouseOutbound,
});

interface OutboundItem {
  orderId: string;
  brand: string;
  title: string;
  buyerName: string;
  buyerComuna: string;
  carrier: string;
  tracking: string;
  labelUrl: string;
  packed: boolean;
}

const OUTBOUND_QUEUE: OutboundItem[] = [
  {
    orderId: "ORD-G7H8I9", brand: "Gucci", title: "GG Marmont matelassé",
    buyerName: "M. López", buyerComuna: "Las Condes",
    carrier: "Chilexpress", tracking: "9999-7777-8888",
    labelUrl: "#", packed: false,
  },
  {
    orderId: "ORD-D4E5F6", brand: "Jordan", title: "Air Jordan 1 Retro High OG",
    buyerName: "D. Rodríguez", buyerComuna: "Providencia",
    carrier: "Starken", tracking: "STK-9988776",
    labelUrl: "#", packed: true,
  },
];

function WarehouseOutbound() {
  const [items, setItems] = useState(OUTBOUND_QUEUE);

  const togglePacked = (orderId: string) => {
    setItems((prev) => prev.map((i) => i.orderId === orderId ? { ...i, packed: !i.packed } : i));
  };

  return (
    <div className="app-shell pb-24">
      <AppHeader title="Despacho outbound" />

      <div className="px-4 pt-3 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-3 text-center">
            <p className="font-display text-lg font-semibold">{items.filter((i) => !i.packed).length}</p>
            <p className="text-xs text-muted-foreground">Por despachar</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3 text-center">
            <p className="font-display text-lg font-semibold text-success">{items.filter((i) => i.packed).length}</p>
            <p className="text-xs text-muted-foreground">Empacados</p>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <OutboundCard key={item.orderId} item={item} onTogglePacked={() => togglePacked(item.orderId)} />
          ))}
        </div>
      </div>

      <WarehouseTabs />
    </div>
  );
}

function OutboundCard({ item, onTogglePacked }: { item: OutboundItem; onTogglePacked: () => void }) {
  return (
    <div className={`rounded-2xl border bg-card overflow-hidden ${item.packed ? "border-success/40" : "border-border"}`}>
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">{item.brand}</p>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Para: {item.buyerName} · {item.buyerComuna}
            </p>
          </div>
          {item.packed && <CheckCircle2 className="h-5 w-5 text-success shrink-0" />}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Truck className="h-3.5 w-3.5" />
          <span>{item.carrier} · {item.tracking}</span>
        </div>

        <div className="flex gap-2">
          <a
            href={item.labelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border py-2 text-xs font-medium"
          >
            <Printer className="h-3.5 w-3.5" /> Imprimir etiqueta
          </a>
          <button
            onClick={onTogglePacked}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold ${item.packed ? "border border-success text-success" : "bg-primary text-primary-foreground"}`}
          >
            <Package className="h-3.5 w-3.5" />
            {item.packed ? "Empacado ✓" : "Marcar como empacado"}
          </button>
        </div>
      </div>

      {item.packed && (
        <div className="border-t border-success/30 bg-success/5 px-3 py-2">
          <button className="w-full text-center text-xs font-semibold text-success">
            Confirmar despacho al carrier →
          </button>
        </div>
      )}
    </div>
  );
}
