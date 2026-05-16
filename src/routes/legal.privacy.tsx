import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
export const Route = createFileRoute("/legal/privacy")({ head: () => ({ meta: [{ title: "Privacidad — Trueki" }] }), component: PrivacyPage });
function PrivacyPage() { return <LegalPage title="Política de privacidad" updated="16 de mayo 2026"><p>Trueki recopila y trata tus datos personales de acuerdo a la Ley 19.628 de Chile y el Reglamento General de Protección de Datos (GDPR).</p><h2>Datos que recopilamos</h2><p>Nombre, email, teléfono (WhatsApp), RUT (para vendedores), dirección de entrega, datos bancarios (para pagos a vendedores), fotos de artículos y evidencias de verificación.</p><h2>Cómo usamos tus datos</h2><p>Para procesar órdenes, verificar autenticidad, enviar notificaciones por WhatsApp y email, procesar pagos, y cumplir con obligaciones legales.</p><h2>WhatsApp</h2><p>Al registrarte autorizas recibir notificaciones transaccionales vía WhatsApp. Puedes desactivarlo en Configuración en cualquier momento.</p><h2>Terceros</h2><p>Compartimos datos con MercadoPago (pagos), Shipit.cl (envíos), Fintoc (transferencias bancarias) y AWS/Supabase (infraestructura). Nunca vendemos tus datos a terceros.</p><h2>Contacto</h2><p>Para ejercer derechos de acceso, rectificación o eliminación: privacidad@vericloset.cl</p></LegalPage>; }
function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-3 safe-top">
        <Link to="/settings" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="font-display text-base font-semibold">{title}</h1>
      </header>
      <div className="px-4 py-6">
        <p className="text-xs text-muted-foreground mb-4">Última actualización: {updated}</p>
        <div className="space-y-4 text-sm text-muted-foreground [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:text-base [&_h2]:mt-6 [&_h2]:mb-2">{children}</div>
      </div>
    </div>
  );
}
