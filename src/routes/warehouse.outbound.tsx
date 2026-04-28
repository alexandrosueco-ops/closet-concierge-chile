import { createFileRoute } from "@tanstack/react-router";
import { Printer, Truck, Check } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { WarehouseTabs } from "@/components/layout/WarehouseTabs";
import { OUTBOUND_QUEUE } from "@/lib/mock-data";

export const Route = createFileRoute("/warehouse/outbound")({
  head: () => ({ meta: [{ title: "Bodega · Salidas — VeriCloset" }] }),
  component: OutboundPage,
});

function OutboundPage() {
  return (
    <div className="app-shell pb-24">
      <AppHeader title="Bodega · Salidas" />
      <div className="space-y-3 px-4 pt-3">
        {OUTBOUND_QUEUE.map((o) => (
          <div key={o.orderId} className="rounded-2xl border border-border bg-card p-3">
            <div className="flex justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">#{o.orderId}</p>
                <p className="text-sm font-medium">{o.title}</p>
                <p className="text-xs text-muted-foreground">{o.brand} → {o.buyer} ({o.city})</p>
              </div>
              <span className="trust-chip">✓ Verificado</span>
            </div>

            <div className="mt-3 rounded-xl bg-muted p-3">
              <p className="text-xs font-semibold">Checklist de empaque</p>
              <ul className="mt-2 space-y-1.5 text-xs">
                {["Foto antes de empacar", "Tarjeta VeriCloset incluida", "Sello de seguridad", "Etiqueta pegada"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <input type="checkbox" className="h-3.5 w-3.5 accent-[var(--trust)]" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border py-2.5 text-xs font-semibold">
                <Printer className="h-3.5 w-3.5" /> Imprimir
              </button>
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground">
                <Truck className="h-3.5 w-3.5" /> Marcar enviado
              </button>
            </div>
          </div>
        ))}
        {OUTBOUND_QUEUE.length === 0 && (
          <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            <Check className="mx-auto mb-2 h-6 w-6 text-success" />
            Todo despachado.
          </div>
        )}
      </div>
      <WarehouseTabs />
    </div>
  );
}
