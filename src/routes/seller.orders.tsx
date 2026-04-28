import { createFileRoute } from "@tanstack/react-router";
import { Truck, FileDown } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SellerTabs } from "@/components/layout/SellerTabs";
import { SELLER_ORDERS, LISTINGS, formatCLP, orderStatusLabel } from "@/lib/mock-data";

export const Route = createFileRoute("/seller/orders")({
  head: () => ({ meta: [{ title: "Mis ventas — VeriCloset" }] }),
  component: SellerOrdersPage,
});

function SellerOrdersPage() {
  return (
    <div className="app-shell pb-24">
      <AppHeader title="Mis ventas" />
      <div className="space-y-3 px-4 pt-3">
        {SELLER_ORDERS.map((o) => {
          const l = LISTINGS.find((x) => x.id === o.listingId);
          return (
            <div key={o.id} className="rounded-2xl border border-border bg-card p-3">
              <div className="flex gap-3">
                {l && <img src={l.photos[0]} className="h-16 w-16 rounded-lg object-cover" alt="" />}
                <div className="flex-1">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">#{o.id}</p>
                  <p className="line-clamp-1 text-sm font-medium">{l?.title}</p>
                  <p className="text-xs text-muted-foreground">{formatCLP(o.totalCLP)}</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-warning/10 p-3">
                <p className="text-xs font-semibold text-warning-foreground">⏱ {orderStatusLabel(o.status)}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Tienes 48h para enviar al centro de verificación.</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border py-2.5 text-xs font-semibold">
                  <FileDown className="h-3.5 w-3.5" /> Etiqueta
                </button>
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground">
                  <Truck className="h-3.5 w-3.5" /> Marcar enviado
                </button>
              </div>
            </div>
          );
        })}
        {SELLER_ORDERS.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Aún no tienes ventas.
          </div>
        )}
      </div>
      <SellerTabs />
    </div>
  );
}
