import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
export const Route = createFileRoute("/legal/authenticity")({ head: () => ({ meta: [{ title: "Autenticidad — Trueki" }] }), component: AuthenticityPage });
function AuthenticityPage() {
  return (
    <div className="app-shell">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-3 safe-top">
        <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="font-display text-base font-semibold">Política de autenticidad</h1>
      </header>
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center gap-3 rounded-2xl bg-trust/5 border border-trust/20 p-4">
          <ShieldCheck className="h-8 w-8 text-trust shrink-0" />
          <div>
            <p className="font-semibold text-trust">Garantía de autenticidad Trueki</p>
            <p className="text-xs text-muted-foreground mt-0.5">Si es falso, reembolso del 100%. Sin excepciones.</p>
          </div>
        </div>
        {[
          { title: "¿Qué verificamos?", body: "Cada artículo es revisado por nuestro equipo en Santiago: autenticidad de materiales, costuras, herrajes, etiquetas, seriales, y todo elemento específico de cada marca." },
          { title: "Evidencia fotográfica", body: "Guardamos mínimo 4-8 fotos de evidencia por artículo verificado. Las marcas de alto riesgo (LV, Gucci, Chanel, Hermès) requieren hasta 8 fotos incluyendo seriales y fecha codes." },
          { title: "¿Qué pasa si es falso?", body: "La orden se cancela automáticamente. El comprador recibe reembolso total en 1-3 días hábiles. El vendedor recibe un strike. A los 3 strikes, ban permanente. El artículo queda retenido." },
          { title: "¿Qué pasa si hay discrepancias?", body: "Si el artículo es auténtico pero no corresponde exactamente a la descripción, el comprador puede: aceptar como está, aceptar con descuento negociado, o cancelar con reembolso." },
          { title: "Marcas aceptadas", body: "Solo aceptamos marcas de la lista blanca aprobada. Incluye Louis Vuitton, Gucci, Chanel, Prada, Hermès, Dior, Balenciaga, Jordan, Nike, Adidas, New Balance, entre otras." },
        ].map((s) => (
          <div key={s.title}>
            <p className="font-semibold mb-1">{s.title}</p>
            <p className="text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
