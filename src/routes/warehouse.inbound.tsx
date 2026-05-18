import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Package, CheckCircle2, Clock, Search, ArrowRight, RefreshCw } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { AuthGuard } from "@/components/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { formatCLP } from "@/hooks/useListings";

export const Route = createFileRoute("/warehouse/inbound")({
  head: () => ({ meta: [{ title: "Inbound — Bodega Trueki" }] }),
  component: () => <AuthGuard requiredRoles={["warehouse","admin"]}><InboundPage /></AuthGuard>,
});

interface DraftListing {
  id: string; title: string; status: string; condition: string;
  price_clp: number; created_at: string;
  brands: { name: string; risk_level: string } | null;
  categories: { name: string } | null;
  profiles: { display_name: string | null } | null;
  listing_photos: { url: string }[];
  warehouse_received_at: string | null;
}

function InboundPage() {
  const [listings, setListings] = useState<DraftListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"|"draft"|"received">("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("listings")
      .select(`id,title,status,condition,price_clp,created_at,warehouse_received_at,
        brands(name,risk_level),categories(name),
        profiles!seller_id(display_name),
        listing_photos(url)`)
      .in("status", ["draft","received","published"])
      .order("created_at", { ascending: false });
    setListings((data ?? []) as DraftListing[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = listings.filter(l => {
    if (filter === "draft" && l.status !== "draft") return false;
    if (filter === "received" && l.status !== "received") return false;
    if (search && !`${l.title} ${l.brands?.name ?? ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    draft: listings.filter(l => l.status === "draft").length,
    received: listings.filter(l => l.status === "received").length,
    published: listings.filter(l => l.status === "published").length,
  };

  const riskColor: Record<string, string> = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-green-100 text-green-700",
  };

  return (
    <div className="app-shell pb-24">
      <AppHeader title="Bodega — Inbound" />

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2 px-4 pt-4">
        {[
          { label: "Esperando", val: stats.draft, color: "text-amber-600" },
          { label: "Recibidos", val: stats.received, color: "text-blue-600" },
          { label: "Publicados", val: stats.published, color: "text-green-600" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border-2 border-border bg-card p-3 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Búsqueda + filtro */}
      <div className="px-4 pt-3 space-y-2">
        <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-muted/50 px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar artículo o marca..." className="flex-1 bg-transparent text-sm outline-none" />
        </div>
        <div className="flex gap-2">
          {(["all","draft","received"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full border-2 px-3 py-1.5 text-xs font-black transition-all ${filter === f ? "border-primary bg-primary" : "border-border"}`}>
              {f === "all" ? "Todos" : f === "draft" ? "Por recibir" : "Recibidos"}
            </button>
          ))}
          <button onClick={load} className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-border hover:bg-muted transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 pt-3 space-y-2">
        {loading ? (
          Array.from({length:3}).map((_,i) => <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center">
            <Package className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-black">Sin artículos pendientes</p>
          </div>
        ) : filtered.map(l => {
          const photo = l.listing_photos[0]?.url;
          const risk = l.brands?.risk_level ?? "low";
          const statusInfo = {
            draft:     { label: "Esperando envío", color: "text-amber-600 bg-amber-50" },
            received:  { label: "Recibido — por verificar", color: "text-blue-600 bg-blue-50" },
            published: { label: "Publicado ✓", color: "text-green-600 bg-green-50" },
          }[l.status] ?? { label: l.status, color: "text-muted-foreground bg-muted" };

          return (
            <Link key={l.id} to="/warehouse/verify/$orderId" params={{ orderId: l.id }}
              className="block rounded-2xl border-2 border-border bg-card overflow-hidden active:scale-[0.98] transition-all">
              <div className="flex gap-3 p-3">
                {photo ? (
                  <img src={photo} className="h-14 w-14 rounded-xl object-cover shrink-0" alt="" />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-muted shrink-0 flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{l.brands?.name}</p>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${riskColor[risk]}`}>
                      {risk === "high" ? "ALTO" : risk === "medium" ? "MEDIO" : "BAJO"}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm font-bold">{l.title}</p>
                  <p className="text-xs text-muted-foreground">{l.profiles?.display_name ?? "—"} · {formatCLP(l.price_clp)}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              </div>
              <div className={`px-3 py-1.5 text-[11px] font-bold ${statusInfo.color}`}>
                {statusInfo.label}
              </div>
            </Link>
          );
        })}
      </div>
      <BottomTabs />
    </div>
  );
}
