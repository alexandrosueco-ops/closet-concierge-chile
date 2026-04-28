import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "./legal.terms";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({ meta: [{ title: "Privacidad — VeriCloset" }] }),
  component: () => (
    <LegalLayout
      title="Política de privacidad"
      body={`Tu información se usa solo para operar el marketplace, procesar pagos y verificar identidad. No vendemos datos a terceros.`}
    />
  ),
});
