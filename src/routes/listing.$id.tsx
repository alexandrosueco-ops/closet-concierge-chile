import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Heart, Share2, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { LISTINGS, conditionLabel, formatCLP } from "@/lib/mock-data";

export const Route = createFileRoute("/listing/$id")({
  loader: ({ params }) => {
    const listing = LISTINGS.find((l) => l.id === params.id);
    if (!listing) throw notFound();
    return { listing };
  },
  notFoundComponent: () => (
    <div className="app-shell flex min-h-dvh items-center justify-center px-6">
      <div className="text-center">
        <p className="font-display text-xl">Publicación no encontrada</p>
        <Link to="/" className="mt-3 inline-block text-sm text-trust">Volver al inicio</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-6 text-sm text-destructive">{error.message}</div>,
  component: ListingPage,
});

function ListingPage() {
  const { listing } = Route.useLoaderData();
  return (
    <div className="app-shell pb-32">
      <div className="relative">
        <img src={listing.photos[0]} alt={listing.title} className="aspect-square w-full object-cover" />
        <div className="absolute left-3 top-3 flex gap-2 safe-top">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-background/85 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
        <div className="absolute right-3 top-3 flex gap-2 safe-top">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-background/85 backdrop-blur">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-background/85 backdrop-blur">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{listing.brand}</p>
        <h1 className="mt-1 font-display text-xl font-semibold leading-tight">{listing.title}</h1>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-2xl font-semibold">{formatCLP(listing.priceCLP)}</p>
          {listing.originalPriceCLP && (
            <p className="text-sm text-muted-foreground line-through">{formatCLP(listing.originalPriceCLP)}</p>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="trust-chip"><ShieldCheck className="h-3.5 w-3.5" /> Verificación incluida</span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">Talla {listing.size}</span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">{conditionLabel(listing.condition)}</span>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-muted/50 p-4">
          <p className="text-sm font-semibold">¿Cómo funciona?</p>
          <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2"><Truck className="h-4 w-4 shrink-0 text-trust" /> Vendedor envía a nuestro centro.</li>
            <li className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-trust" /> Verificamos autenticidad y condición.</li>
            <li className="flex gap-2"><RotateCcw className="h-4 w-4 shrink-0 text-trust" /> Si no pasa, te reembolsamos.</li>
          </ul>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold">Descripción</p>
          <p className="mt-1 text-sm text-muted-foreground">{listing.description}</p>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
            {listing.sellerName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{listing.sellerName}</p>
            <p className="text-xs text-muted-foreground">Vendedor verificado</p>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background safe-bottom">
        <div className="mx-auto flex max-w-[480px] gap-2 p-3">
          <button className="flex-1 rounded-full border border-border py-3 text-sm font-semibold">Hacer oferta</button>
          <Link to="/" className="flex-[1.5] rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground">
            Comprar {formatCLP(listing.priceCLP)}
          </Link>
        </div>
      </div>
    </div>
  );
}
