import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
export const Route = createFileRoute("/legal/terms")({ head: () => ({ meta: [{ title: "Términos — VeriCloset" }] }), component: TermsPage });
function TermsPage() { return <LegalPage title="Términos y condiciones" updated="16 de mayo 2026"><p>VeriCloset opera como intermediario verificado de reventa premium en Chile. Al usar la plataforma aceptas las siguientes condiciones.</p><h2>1. Sobre la verificación</h2><p>Todo artículo vendido en VeriCloset pasa por nuestro centro de autenticación en Santiago antes de ser entregado al comprador. VeriCloset se reserva el derecho de rechazar artículos que no cumplan los estándares de autenticidad.</p><h2>2. Pagos y escrow</h2><p>El pago del comprador queda retenido hasta que el artículo pase verificación y sea entregado. Solo entonces se libera el pago al vendedor. En caso de artículo falso o no conforme, se reembolsa al comprador.</p><h2>3. Comisiones</h2><p>VeriCloset cobra un 12% de comisión al vendedor y un 5% de protección al comprador sobre el precio del artículo. El envío inbound es responsabilidad del vendedor. El envío outbound está incluido.</p><h2>4. Strikes y bans</h2><p>Vender artículos falsos resulta en strike inmediato. Tres strikes equivalen a ban permanente de la plataforma. VeriCloset puede denunciar actividad fraudulenta a las autoridades.</p><h2>5. Ley aplicable</h2><p>Este acuerdo se rige por las leyes de la República de Chile. Los conflictos se resolverán en los tribunales de Santiago.</p></LegalPage>; }
function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-3 safe-top">
        <Link to="/settings" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="font-display text-base font-semibold">{title}</h1>
      </header>
      <div className="px-4 py-6 prose prose-sm max-w-none">
        <p className="text-xs text-muted-foreground mb-4">Última actualización: {updated}</p>
        <div className="space-y-4 text-sm text-muted-foreground [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:text-base [&_h2]:mt-6 [&_h2]:mb-2">{children}</div>
      </div>
    </div>
  );
}
