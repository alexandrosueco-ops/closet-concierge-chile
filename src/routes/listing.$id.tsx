import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Heart, Share2, ShieldCheck, Truck, RotateCcw,
  CreditCard, Star, ChevronRight, CheckCircle2,
} from "lucide-react";
import { LISTINGS, conditionLabel, formatCLP } from "@/lib/mock-data";
import { calculateFees } from "@/lib/mercadopago";

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
  component: ListingPage,
});

function ListingPage() {
  const { listing } = Route.useLoaderData();
  const [activePhoto, setActivePhoto] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const fees = calculateFees(listing.priceCLP);

  if (showCheckout) return <CheckoutSheet listing={listing} fees={fees} onBack={() => setShowCheckout(false)} />;

  return (
    <div className="app-shell pb-32">
      <div className="relative">
        <img src={listing.photos[activePhoto]} alt={listing.title} className="aspect-square w-full object-cover" />
        <div className="absolute left-3 top-3 flex gap-2 safe-top">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-background/85 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
        <div className="absolute right-3 top-3 flex gap-2 safe-top">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-background/85 backdrop-blur"><Share2 className="h-5 w-5" /></button>
          <button onClick={() => setLiked(!liked)} className="flex h-10 w-10 items-center justify-center rounded-full bg-background/85 backdrop-blur">
            <Heart className={`h-5 w-5 ${liked ? "fill-destructive text-destructive" : ""}`} />
          </button>
        </div>
        {listing.photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {listing.photos.map((_, i) => (
              <button key={i} onClick={() => setActivePhoto(i)} className={`h-1.5 rounded-full transition-all ${i === activePhoto ? "w-4 bg-white" : "w-1.5 bg-white/50"}`} />
            ))}
          </div>
        )}
      </div>

      {listing.photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-2">
          {listing.photos.map((p, i) => (
            <button key={i} onClick={() => setActivePhoto(i)} className={`shrink-0 h-14 w-14 overflow-hidden rounded-lg border-2 ${i === activePhoto ? "border-trust" : "border-transparent"}`}>
              <img src={p} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="px-4 pt-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{listing.brand}</p>
        <h1 className="mt-1 font-display text-xl font-semibold leading-tight">{listing.title}</h1>

        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-2xl font-semibold">{formatCLP(listing.priceCLP)}</p>
          {listing.originalPriceCLP && (
            <>
              <p className="text-sm text-muted-foreground line-through">{formatCLP(listing.originalPriceCLP)}</p>
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                -{Math.round((1 - listing.priceCLP / listing.originalPriceCLP) * 100)}%
              </span>
            </>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="trust-chip"><ShieldCheck className="h-3.5 w-3.5" /> Verificado antes de entregar</span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">Talla {listing.size}</span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">{conditionLabel(listing.condition)}</span>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-muted/40 p-4">
          <p className="text-sm font-semibold">¿Cómo funciona?</p>
          <ul className="mt-3 space-y-2.5">
            {[
              { icon: <CreditCard className="h-4 w-4 shrink-0 text-trust" />, text: "Tu pago queda retenido hasta verificación." },
              { icon: <Truck className="h-4 w-4 shrink-0 text-trust" />, text: "Vendedor envía a nuestro centro en Santiago." },
              { icon: <ShieldCheck className="h-4 w-4 shrink-0 text-trust" />, text: "Revisamos autenticidad con evidencia fotográfica." },
              { icon: <RotateCcw className="h-4 w-4 shrink-0 text-trust" />, text: "Si es falso, reembolso del 100%. Sin discusión." },
            ].map(({ icon, text }, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">{icon}<span>{text}</span></li>
            ))}
          </ul>
        </div>

        <div className="mt-5 rounded-2xl border border-border p-4">
          <p className="mb-3 text-sm font-semibold">Desglose del precio</p>
          <div className="space-y-2 text-sm">
            <PriceRow label="Precio del artículo" value={formatCLP(listing.priceCLP)} />
            <PriceRow label="Protección comprador (5%)" value={`+${formatCLP(fees.buyerProtectionClp)}`} muted />
            <div className="border-t border-border pt-2 font-semibold">
              <PriceRow label="Total" value={formatCLP(fees.buyerPaysClp)} />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold">Descripción</p>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
        </div>

        <div className="mt-5 mb-6">
          <p className="mb-2 text-sm font-semibold">Vendedor</p>
          <div className="flex items-center gap-3 rounded-2xl border border-border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              {listing.sellerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{listing.sellerName}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>4.8 · Verificado · RUT validado</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background safe-bottom">
        <div className="mx-auto max-w-[480px] p-3">
          <button onClick={() => setShowCheckout(true)} className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2">
            Comprar ahora · {formatCLP(fees.buyerPaysClp)}
          </button>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground">MercadoPago · Webpay · Transferencia</p>
        </div>
      </div>
    </div>
  );
}

function CheckoutSheet({ listing, fees, onBack }: { listing: (typeof LISTINGS)[number]; fees: ReturnType<typeof calculateFees>; onBack: () => void }) {
  const [loading, setLoading] = useState(false);

  const handlePagar = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  };

  return (
    <div className="app-shell pb-32">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-3 safe-top">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-base font-semibold">Finalizar compra</h1>
      </header>

      <div className="space-y-4 px-4 pt-4">
        <div className="flex gap-3 rounded-2xl border border-border p-3">
          <img src={listing.photos[0]} className="h-16 w-16 rounded-xl object-cover" alt="" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{listing.brand}</p>
            <p className="line-clamp-1 text-sm font-medium">{listing.title}</p>
            <p className="mt-1 text-sm font-semibold">{formatCLP(listing.priceCLP)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-muted-foreground">Dirección de entrega</p>
              <p className="mt-0.5 text-sm font-medium">Agregar dirección</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="rounded-2xl border border-border p-4">
          <p className="mb-3 text-xs text-muted-foreground">Paga con</p>
          <div className="space-y-2">
            {[
              { id: "mp", label: "MercadoPago", sub: "Webpay, tarjeta débito/crédito, saldo MP" },
              { id: "transferencia", label: "Transferencia bancaria", sub: "Te enviamos los datos por WhatsApp" },
            ].map((m) => (
              <label key={m.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 has-[:checked]:border-trust has-[:checked]:bg-trust/5">
                <input type="radio" name="payment" value={m.id} defaultChecked={m.id === "mp"} className="accent-[var(--trust)]" />
                <div>
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border p-4">
          <p className="mb-3 text-sm font-semibold">Resumen</p>
          <div className="space-y-2 text-sm">
            <PriceRow label="Artículo" value={formatCLP(listing.priceCLP)} />
            <PriceRow label="Protección comprador" value={`+${formatCLP(fees.buyerProtectionClp)}`} muted />
            <PriceRow label="Envío" value="Gratis" muted />
            <div className="border-t border-border pt-2 font-semibold">
              <PriceRow label="Total" value={formatCLP(fees.buyerPaysClp)} />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-trust/5 p-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-trust mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Tu pago queda retenido. Lo liberamos al vendedor solo tras verificación y entrega exitosa.
          </p>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background safe-bottom">
        <div className="mx-auto max-w-[480px] p-3">
          <button onClick={handlePagar} disabled={loading} className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? "Redirigiendo a MercadoPago..." : `Pagar ${formatCLP(fees.buyerPaysClp)}`}
          </button>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground">🔒 Pago seguro con MercadoPago</p>
        </div>
      </div>
    </div>
  );
}

function PriceRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span className={muted ? "text-muted-foreground" : "font-medium"}>{value}</span>
    </div>
  );
}
