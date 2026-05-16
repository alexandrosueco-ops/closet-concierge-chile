import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
export const Route = createFileRoute("/legal/refunds")({ head: () => ({ meta: [{ title: "Reembolsos — Trueki" }] }), component: RefundsPage });
function RefundsPage() {
  return (
    <div className="app-shell">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-3 safe-top">
        <Link to="/settings" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="font-display text-base font-semibold">Reembolsos y devoluciones</h1>
      </header>
      <div className="px-4 py-6 space-y-5 text-sm text-muted-foreground">
        <p className="text-xs text-muted-foreground">Última actualización: 16 de mayo 2026</p>
        {[
          { title: "Artículo falso", body: "Reembolso del 100% en 1-3 días hábiles. El pago nunca se libera al vendedor.", auto: true },
          { title: "Artículo con discrepancias", body: "El comprador elige: aceptar, aceptar con descuento, o cancelar con reembolso total.", auto: false },
          { title: "Disputa del comprador (48h)", body: "Tienes 48h desde la entrega para reportar problemas. Abre una disputa desde tu orden.", auto: false },
          { title: "Cancelación antes de verificación", body: "Si el vendedor no despacha en 48h, la orden se cancela y se reembolsa automáticamente.", auto: true },
        ].map((r) => (
          <div key={r.title} className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-foreground">{r.title}</p>
              {r.auto && <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Automático</span>}
            </div>
            <p>{r.body}</p>
          </div>
        ))}
        <p>Para consultas: <a href="mailto:soporte@vericloset.cl" className="text-trust">soporte@vericloset.cl</a></p>
      </div>
    </div>
  );
}
