import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

function makeLegal(slug: "terms" | "privacy" | "refunds" | "authenticity", title: string, body: string) {
  return createFileRoute(`/legal/${slug}`)({
    head: () => ({ meta: [{ title: `${title} — VeriCloset` }] }),
    component: () => <LegalLayout title={title} body={body} />,
  });
}

export function LegalLayout({ title, body }: { title: string; body: string }) {
  return (
    <div className="app-shell pb-12">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-3 safe-top">
        <Link to="/settings" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-base font-semibold">{title}</h1>
      </header>
      <article className="prose prose-sm max-w-none px-5 py-6 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
        {body}
      </article>
    </div>
  );
}

export const TERMS_BODY = `Bienvenido a VeriCloset. Al usar nuestra plataforma aceptas estos términos.\n\n1. Solo se permiten artículos auténticos de marcas premium aprobadas.\n2. Toda venta pasa por verificación en bodega antes de ser entregada.\n3. Los pagos quedan en garantía y se liberan tras la entrega + 48h sin disputa.\n4. Falsificaciones resultan en baneo permanente.`;
