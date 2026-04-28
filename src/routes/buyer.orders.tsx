import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Truck, Package, CheckCircle2 } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { MY_ORDERS, LISTINGS, formatCLP, orderStatusLabel } from "@/lib/mock-data";
import type { OrderStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/buyer/orders")({
  head: () => ({ meta: [{ title: "Mis compras — VeriCloset" }] }),
  component: BuyerOrdersPage,
});

const TIMELINE: OrderStatus[] = [
  "payment_authorized", "awaiting_seller_shipment", "inbound_in_transit",
  "warehouse_received", "verification_in_progress", "outbound_shipped", "delivered", "completed",
];

function BuyerOrdersPage() {
  return (
    <div className="app-shell pb-24">
      <AppHeader title="Mis compras" />
      <div className="space-y-4 px-4 pt-3">
        {MY_ORDERS.map((order) => {
          const listing = LISTINGS.find((l) => l.id === order.listingId);
          const currentIdx = TIMELINE.indexOf(order.status);
          return (
            <div key={order.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex gap-3 p-3">
                {listing && <img src={listing.photos[0]} className="h-20 w-20 rounded-xl object-cover" alt="" />}
                <div className="flex-1">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Orden #{order.id}</p>
                  <p className="line-clamp-1 text-sm font-medium">{listing?.title}</p>
                  <p className="text-xs text-muted-foreground">{listing?.brand}</p>
                  <p className="mt-1 text-sm font-semibold">{formatCLP(order.totalCLP)}</p>
                </div>
              </div>

              <div className="border-t border-border px-3 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="trust-chip"><ShieldCheck className="h-3 w-3" /> {orderStatusLabel(order.status)}</span>
                  <Link to="/" className="text-xs font-medium text-trust">Detalle</Link>
                </div>
                <div className="flex items-center gap-1">
                  {[Package, Truck, ShieldCheck, CheckCircle2].map((Icon, i) => {
                    const filled = i <= Math.floor((currentIdx / TIMELINE.length) * 4);
                    return (
                      <div key={i} className="flex flex-1 items-center gap-1">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${filled ? "bg-trust text-trust-foreground" : "bg-muted text-muted-foreground"}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        {i < 3 && <div className={`h-0.5 flex-1 ${filled ? "bg-trust" : "bg-muted"}`} />}
                      </div>
                    );
                  })}
                </div>
                {order.status === "delivered" && (
                  <button className="mt-3 w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground">
                    Confirmar recepción
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <BottomTabs />
    </div>
  );
}
