import { Link } from "@tanstack/react-router";
import { Heart, ShieldCheck } from "lucide-react";
import type { Listing } from "@/lib/mock-data";
import { conditionLabel, formatCLP } from "@/lib/mock-data";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export function ListingCard({ listing }: { listing: Listing }) {
  const { toggle, isFav } = useFavorites();
  const fav = isFav(listing.id);
  const discount = listing.originalPriceCLP
    ? Math.round((1 - listing.priceCLP / listing.originalPriceCLP) * 100)
    : null;

  return (
    <Link
      to="/listing/$id"
      params={{ id: listing.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-card"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={listing.photos[0]}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Botón favorito */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(listing.id); }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur transition-transform active:scale-90"
        >
          <Heart className={cn("h-4 w-4 transition-colors", fav ? "fill-destructive text-destructive" : "text-foreground")} />
        </button>
        {/* Badge verificado */}
        <div className="absolute bottom-2 left-2">
          <span className="flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-trust">
            <ShieldCheck className="h-3 w-3" /> Verificado
          </span>
        </div>
        {/* Descuento */}
        {discount && discount > 0 && (
          <div className="absolute left-2 top-2 rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{listing.brand}</p>
        <p className="line-clamp-1 text-sm font-medium">{listing.title}</p>
        <p className="text-[10px] text-muted-foreground">T. {listing.size} · {conditionLabel(listing.condition)}</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <p className="text-sm font-semibold">{formatCLP(listing.priceCLP)}</p>
          {listing.originalPriceCLP && (
            <p className="text-[10px] text-muted-foreground line-through">{formatCLP(listing.originalPriceCLP)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
