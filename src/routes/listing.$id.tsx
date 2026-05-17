import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Heart, Share2, ShieldCheck, Truck, RotateCcw, Star, ChevronRight, CheckCircle2 } from "lucide-react";
import { useListing, conditionLabel, formatCLP } from "@/hooks/useListings";
import { useFavorites } from "@/hooks/useFavorites";
import { LoadingScreen } from "@/components/AuthGuard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/listing/$id")({
  component: ListingPage,
});

function ListingPage() {
  const { id } = Route.useParams();
  const { listing, loading, error } = useListing(id);
  const { toggle, isFav } = useFavorites();
  const [activePhoto, setActivePhoto] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  if (loading) return <LoadingScreen />;
  if (error || !listing) {
    return (
      <div className="app-shell flex min-h-dvh items-center justify-center px-6 text-center">
        <div>
          <p className="font-black text-xl">Publicación no encontrada</p>
          <Link to="/" className="mt-3 inline-block text-sm font-bold text-muted-foreground underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const fav = isFav(listing.id);
  const photos = listing.listing_photos.map(p => p.url);
  const brandName = listing.brands?.name ?? "Marca";
  const sellerName = listing.profiles?.display_name ?? "Vendedor verificado";
  const buyerProtection = Math.round(listing.price_clp * 0.05);
  const total = listing.price_clp + buyerProtection;

  if (showCheckout) {
    return <CheckoutSheet listing={listing} total={total} buyerProtection={buyerProtection} onBack={() => setShowCheckout(false)} />;
  }

  return (
    <div className="app-shell pb-32">
      {/* Galería */}
      <div className="relative">
        <img
          src={photos[activePhoto] ?? "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"}
          alt={listing.title}
          className="aspect-square w-full object-cover bg-muted"
        />
        <div className="absolute left-3 top-3 safe-top">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
        <div className="absolute right-3 top-3 flex gap-2 safe-top">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur">
            <Share2 className="h-4.5 w-4.5" />
          </button>
          <button onClick={() => toggle(listing.id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur">
            <Heart className={cn("h-4.5 w-4.5", fav && "fill-destructive text-destructive")} />
          </button>
        </div>
        {/* Dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <button key={i} onClick={() => setActivePhoto(i)} className={`rounded-full transition-all ${i === activePhoto ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 py-2">
          {photos.map((p, i) => (
            <button key={i} onClick={() => setActivePhoto(i)}
              className={`shrink-0 h-14 w-14 overflow-hidden rounded-xl border-2 ${i === activePhoto ? "border-primary" : "border-transparent"}`}>
              <img src={p} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="px-4 pt-3 space-y-5">
        {/* Info */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{brandName}</p>
          <h1 className="mt-1 font-black text-xl leading-tight" style={{ letterSpacing: "-0.03em" }}>{listing.title}</h1>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-2xl font-black">{formatCLP(listing.price_clp)}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="trust-chip"><ShieldCheck className="h-3.5 w-3.5" /> Autenticado antes de entregar</span>
            {listing.size && <span className="rounded-full border-2 border-border px-3 py-1 text-xs font-bold">Talla {listing.size}</span>}
            <span className="rounded-full border-2 border-border px-3 py-1 text-xs font-bold">{conditionLabel(listing.condition)}</span>
          </div>
        </div>

        {/* Cómo funciona */}
        <div className="rounded-2xl border-2 border-border bg-muted/40 p-4">
          <p className="text-sm font-black mb-3" style={{ letterSpacing: "-0.02em" }}>¿Cómo funciona Trueki?</p>
          {[
            { icon: <ShieldCheck className="h-4 w-4 text-primary-foreground" />, t: "Tu pago queda retenido hasta que verificamos el artículo." },
            { icon: <Truck className="h-4 w-4 text-primary-foreground" />, t: "El vendedor envía a nuestro centro de verificación en Santiago." },
            { icon: <RotateCcw className="h-4 w-4 text-primary-foreground" />, t: "Si es falso o no corresponde, reembolso del 100%. Sin discusión." },
          ].map(({ icon, t }, i) => (
            <div key={i} className="flex items-start gap-3 mb-2.5 last:mb-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary">{icon}</div>
              <p className="text-sm text-muted-foreground leading-snug pt-0.5">{t}</p>
            </div>
          ))}
        </div>

        {/* Desglose */}
        <div className="rounded-2xl border-2 border-border p-4">
          <p className="text-sm font-black mb-3">Desglose del precio</p>
          <div className="space-y-2 text-sm">
            <Row label="Artículo" value={formatCLP(listing.price_clp)} />
            <Row label="Protección comprador (5%)" value={`+${formatCLP(buyerProtection)}`} muted />
            <Row label="Envío" value="Gratis" muted />
            <div className="border-t-2 border-border pt-2">
              <Row label="Total" value={formatCLP(total)} bold />
            </div>
          </div>
        </div>

        {/* Descripción */}
        {listing.description && (
          <div>
            <p className="text-sm font-black mb-1.5">Descripción</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>
        )}

        {/* Vendedor */}
        <div>
          <p className="text-sm font-black mb-2">Vendedor</p>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-black text-sm">
              {sellerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{sellerName}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>Vendedor verificado · RUT validado</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-background safe-bottom">
        <div className="mx-auto max-w-[480px] p-3">
          <button onClick={() => setShowCheckout(true)}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-black">
            Comprar ahora · {formatCLP(total)}
          </button>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground">MercadoPago · Webpay · Transferencia</p>
        </div>
      </div>
    </div>
  );
}

function CheckoutSheet({ listing, total, buyerProtection, onBack }: {
  listing: NonNullable<ReturnType<typeof useListing>["listing"]>;
  total: number; buyerProtection: number; onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const handlePagar = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    alert("En producción: redirige a MercadoPago");
  };

  return (
    <div className="app-shell pb-32">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b-2 border-border bg-background px-3 safe-top">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-black text-base">Finalizar compra</h1>
      </header>
      <div className="space-y-4 px-4 pt-4">
        <div className="flex gap-3 rounded-2xl border-2 border-border p-3">
          <img src={listing.listing_photos[0]?.url} className="h-16 w-16 rounded-xl object-cover" alt="" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{listing.brands?.name}</p>
            <p className="line-clamp-1 text-sm font-bold">{listing.title}</p>
            <p className="mt-1 text-sm font-black">{formatCLP(listing.price_clp)}</p>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-border p-4">
          <p className="text-xs text-muted-foreground mb-3 font-bold">Paga con</p>
          <div className="space-y-2">
            {[
              { id: "mp", label: "MercadoPago", sub: "Webpay, tarjeta débito/crédito, saldo MP" },
              { id: "transferencia", label: "Transferencia bancaria", sub: "Te enviamos los datos por WhatsApp" },
            ].map((m) => (
              <label key={m.id} className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input type="radio" name="payment" value={m.id} defaultChecked={m.id === "mp"} className="accent-[#dadd48]" />
                <div><p className="text-sm font-bold">{m.label}</p><p className="text-xs text-muted-foreground">{m.sub}</p></div>
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border-2 border-border p-4 space-y-2 text-sm">
          <Row label="Artículo" value={formatCLP(listing.price_clp)} />
          <Row label="Protección comprador" value={`+${formatCLP(buyerProtection)}`} muted />
          <Row label="Envío" value="Gratis" muted />
          <div className="border-t-2 border-border pt-2"><Row label="Total" value={formatCLP(total)} bold /></div>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-primary/10 p-3">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-foreground mt-0.5" />
          <p className="text-xs text-muted-foreground">Pago retenido hasta verificación y entrega exitosa. Si falla, reembolso total.</p>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-background safe-bottom">
        <div className="mx-auto max-w-[480px] p-3">
          <button onClick={handlePagar} disabled={loading} className="w-full rounded-full bg-primary py-3.5 text-sm font-black disabled:opacity-60">
            {loading ? "Redirigiendo a MercadoPago..." : `Pagar ${formatCLP(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span className={cn(muted ? "text-muted-foreground" : "", bold ? "font-black" : "font-semibold")}>{value}</span>
    </div>
  );
}
