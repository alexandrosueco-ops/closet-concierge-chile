import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "./legal.terms";

export const Route = createFileRoute("/legal/authenticity")({
  head: () => ({ meta: [{ title: "Autenticidad — VeriCloset" }] }),
  component: () => (
    <LegalLayout
      title="Política de autenticidad"
      body={`Cada artículo es revisado por nuestro equipo en bodega: materiales, costuras, herrajes, códigos y procedencia. Solo se entregan piezas auténticas.`}
    />
  ),
});
