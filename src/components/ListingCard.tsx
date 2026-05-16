import { Link } from "@tanstack/react-router";
import { Heart, ShieldCheck } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { conditionLabel, formatCLP, type DbListing } from "@/hooks/useListings";
import { cn } from "@/lib/utils";

export function ListingCard({ listing }: { listing: DbListing }) {
  const { toggle, isFav } = useFavorites();
  const fav = isFav(listing.id);
  const photo = listing.listing_photos[0]?.url ?? "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80";
  const brandName = listing.brands?.name ?? "Marca";

  return (
    <Link
      to="/listing/$id"
      params={{ id: listing.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-card transition-all hover:border-primary active:scale-[0.98]"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={photo}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={(e) => { e.preventDefault(); toggle(listing.id); }}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 backdrop-blur transition-transform active:scale-90"
        >
          <Heart className={cn("h-3.5 w-3.5", fav ? "fill-destructive text-destructive" : "")} />
        </button>
        <div className="absolute bottom-2 left-2">
          <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-primary-foreground">
            <ShieldCheck className="h-2.5 w-2.5" /> Verificado
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 p-2.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{brandName}</p>
        <p className="line-clamp-1 text-sm font-semibold">{listing.title}</p>
        <p className="text-[10px] text-muted-foreground">
          {listing.size ? `T. ${listing.size} · ` : ""}{conditionLabel(listing.condition)}
        </p>
        <p className="mt-1 text-sm font-black">{formatCLP(listing.price_clp)}</p>
      </div>
    </Link>
  );
}
