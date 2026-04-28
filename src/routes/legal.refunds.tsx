import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "./legal.terms";

export const Route = createFileRoute("/legal/refunds")({
  head: () => ({ meta: [{ title: "Reembolsos — VeriCloset" }] }),
  component: () => (
    <LegalLayout
      title="Política de reembolsos"
      body={`Si un artículo no pasa la verificación de autenticidad o no coincide con la descripción, te reembolsamos el 100% del pago al método original en 5-10 días hábiles.`}
    />
  ),
});
