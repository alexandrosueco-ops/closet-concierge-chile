import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Listing } from "@/lib/mock-data";
import { conditionLabel, formatCLP } from "@/lib/mock-data";

export function ListingCard({ listing }: { listing: Listing }) {
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
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur"
        >
          <Heart className="h-4 w-4" />
        </button>
        <div className="absolute bottom-2 left-2">
          <span className="trust-chip">✓ Verificado</span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 p-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{listing.brand}</p>
        <p className="line-clamp-1 text-sm font-medium text-foreground">{listing.title}</p>
        <p className="text-[11px] text-muted-foreground">Talla {listing.size} · {conditionLabel(listing.condition)}</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{formatCLP(listing.priceCLP)}</p>
      </div>
    </Link>
  );
}
