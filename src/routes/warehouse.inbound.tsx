import { createFileRoute, Link } from "@tanstack/react-router";
import { QrCode, Camera } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { WarehouseTabs } from "@/components/layout/WarehouseTabs";
import { INBOUND_QUEUE } from "@/lib/mock-data";

export const Route = createFileRoute("/warehouse/inbound")({
  head: () => ({ meta: [{ title: "Bodega · Entradas — VeriCloset" }] }),
  component: InboundPage,
});

function InboundPage() {
  return (
    <div className="app-shell pb-24">
      <AppHeader title="Bodega · Entradas" />
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3">
          <QrCode className="h-5 w-5 text-trust" />
          <input placeholder="Escanear o ingresar Order ID" className="flex-1 bg-transparent text-sm outline-none" />
          <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">Buscar</button>
        </div>

        <p className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pendientes ({INBOUND_QUEUE.length})</p>
        <div className="space-y-2">
          {INBOUND_QUEUE.map((i) => (
            <div key={i.orderId} className="rounded-2xl border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">#{i.orderId}</p>
                  <p className="text-sm font-medium">{i.title}</p>
                  <p className="text-xs text-muted-foreground">{i.brand}</p>
                </div>
                <Link to="/warehouse/verify/$orderId" params={{ orderId: i.orderId }}
                  className="flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
                  <Camera className="h-3.5 w-3.5" /> Recibir
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <WarehouseTabs />
    </div>
  );
}
