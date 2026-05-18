import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabs } from "@/components/layout/BottomTabs";
import { AuthGuard } from "@/components/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { formatCLP } from "@/hooks/useListings";
import { Truck, Package, Check, Search, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/warehouse/outbound")({
  head: () => ({ meta: [{ title: "Outbound — Bodega Trueki" }] }),
  component: () => <AuthGuard requiredRoles={["warehouse","admin"]}><OutboundPage /></AuthGuard>,
});

function OutboundPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [dispatching, setDispatching] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    // Buscar órdenes pagadas con artículo verificado
    const { data } = await (supabase as any)
      .from("orders")
      .select(`id, total_clp, status, created_at,
        listings(id, title, brands(name), listing_photos(url, position))`)
      .in("status", ["paid","verification_approved"])
      .order("created_at", { ascending: true });
    setOrders(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const dispatch = async (orderId: string) => {
    const t = tracking[orderId]?.trim();
    if (!t) return;
    setDispatching(orderId);
    await (supabase as any).from("orders").update({
      status: "in_transit_to_buyer",
      tracking_number: t,
      carrier: "Chilexpress",
    }).eq("id", orderId);
    await (supabase as any).from("order_events").insert({
      order_id: orderId, status: "in_transit_to_buyer",
      actor_id: user?.id,
      note: `Despachado vía Chilexpress. Tracking: ${t}`,
    });
    setDispatching(null);
    load();
  };

  return (
    <div className="app-shell pb-24">
      <AppHeader title="Bodega — Outbound" />
      <div className="px-4 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{orders.length} para despachar</p>
          <button onClick={load} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border hover:bg-muted">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
        {loading ? (
          Array.from({length:3}).map((_,i) => <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />)
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
            <Truck className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-black">Sin despachos pendientes</p>
          </div>
        ) : orders.map((o: any) => {
          const photo = o.listings?.listing_photos?.sort((a: any,b: any) => a.position - b.position)[0]?.url;
          return (
            <div key={o.id} className="rounded-2xl border-2 border-border bg-card overflow-hidden">
              <div className="flex gap-3 p-3">
                {photo ? <img src={photo} className="h-14 w-14 rounded-xl object-cover shrink-0" alt="" /> :
                  <div className="h-14 w-14 rounded-xl bg-muted shrink-0 flex items-center justify-center"><Package className="h-5 w-5 text-muted-foreground" /></div>}
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{o.listings?.brands?.name}</p>
                  <p className="line-clamp-1 text-sm font-bold">{o.listings?.title}</p>
                  <p className="text-xs text-muted-foreground">#{o.id.slice(0,8)} · {formatCLP(o.total_clp)}</p>
                </div>
              </div>
              <div className="border-t border-border p-3 space-y-2">
                <input
                  value={tracking[o.id] ?? ""}
                  onChange={e => setTracking(prev => ({ ...prev, [o.id]: e.target.value }))}
                  className="input w-full text-sm"
                  placeholder="Número de tracking Chilexpress..."
                />
                <button
                  onClick={() => dispatch(o.id)}
                  disabled={!tracking[o.id]?.trim() || dispatching === o.id}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-black disabled:opacity-40">
                  <Truck className="h-4 w-4" />
                  {dispatching === o.id ? "Guardando..." : "Marcar como despachado"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <BottomTabs />
    </div>
  );
}
