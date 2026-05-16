import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout/AppHeader";
import { WarehouseTabs } from "@/components/layout/WarehouseTabs";
import { formatCLP } from "@/lib/mock-data";
import { Package, Scan, Clock, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/warehouse/inbound")({
  head: () => ({ meta: [{ title: "Inbound — VeriCloset Bodega" }] }),
  component: WarehouseInbound,
});

interface InboundItem {
  orderId: string;
  brand: string;
  title: string;
  seller: string;
  carrier: string;
  tracking: string;
  arrivedAt: string;
  priority: "alta" | "normal";
  photos: number;
  requiredPhotos: number;
}

const INBOUND_QUEUE: InboundItem[] = [
  {
    orderId: "ORD-X9Y8Z7", brand: "Louis Vuitton", title: "Speedy 30 monogram",
    seller: "Valentina M.", carrier: "Chilexpress", tracking: "9999-0001-2345",
    arrivedAt: "Hoy 09:14", priority: "alta", photos: 0, requiredPhotos: 6,
  },
  {
    orderId: "ORD-A1B2C3", brand: "Gucci", title: "GG Marmont matelassé",
    seller: "Diego R.", carrier: "Starken", tracking: "STK-7654321",
    arrivedAt: "Hoy 11:02", priority: "alta", photos: 0, requiredPhotos: 6,
  },
  {
    orderId: "ORD-M3N4O5", brand: "Nike", title: "Air Max 90 infrared",
    seller: "Camila F.", carrier: "Correos Chile", tracking: "CC-4567890",
    arrivedAt: "Ayer 16:45", priority: "normal", photos: 0, requiredPhotos: 2,
  },
  {
    orderId: "ORD-P6Q7R8", brand: "New Balance", title: "574 Core Pack grey",
    seller: "Matías L.", carrier: "BlueExpress", tracking: "BX-9988776",
    arrivedAt: "Ayer 14:30", priority: "normal", photos: 0, requiredPhotos: 2,
  },
];

function WarehouseInbound() {
  const [scanInput, setScanInput] = useState("");
  const [scanning, setScanning] = useState(false);

  const alta = INBOUND_QUEUE.filter((i) => i.priority === "alta");
  const normal = INBOUND_QUEUE.filter((i) => i.priority === "normal");

  return (
    <div className="app-shell pb-24">
      <AppHeader title="Recepción inbound" />

      <div className="px-4 pt-3 space-y-4">
        {/* Escáner QR / ingreso manual */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Scan className="h-4 w-4 text-trust" />
            <p className="text-sm font-semibold">Escanear o ingresar orden</p>
          </div>
          <div className="flex gap-2">
            <input
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value.toUpperCase())}
              placeholder="ORD-XXXXXX"
              className="input flex-1 font-mono text-sm"
            />
            <button
              className="rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              disabled={scanInput.length < 6}
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Estadísticas del día */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={<Package className="h-4 w-4" />} label="En cola" value="4" />
          <StatCard icon={<CheckCircle2 className="h-4 w-4 text-success" />} label="Hoy verificados" value="7" />
          <StatCard icon={<AlertCircle className="h-4 w-4 text-destructive" />} label="Alertas" value="1" />
        </div>

        {/* Cola prioritaria */}
        {alta.length > 0 && (
          <section>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">PRIORITARIO</span>
              <p className="text-xs text-muted-foreground">{alta.length} ítem(s) — marca de alto riesgo</p>
            </div>
            <div className="space-y-2">
              {alta.map((item) => <InboundCard key={item.orderId} item={item} />)}
            </div>
          </section>
        )}

        {/* Cola normal */}
        {normal.length > 0 && (
          <section>
            <p className="mb-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">Normal</p>
            <div className="space-y-2">
              {normal.map((item) => <InboundCard key={item.orderId} item={item} />)}
            </div>
          </section>
        )}
      </div>

      <WarehouseTabs />
    </div>
  );
}

function InboundCard({ item }: { item: InboundItem }) {
  return (
    <Link to="/warehouse/verify/$orderId" params={{ orderId: item.orderId }} className="block rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{item.brand}</p>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.seller}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.arrivedAt}</span>
          <span>{item.carrier}</span>
          <span className="font-mono">{item.tracking}</span>
        </div>
      </div>
      <div className="border-t border-border bg-muted/30 px-3 py-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Fotos requeridas: <span className="font-semibold text-foreground">{item.requiredPhotos}</span>
        </span>
        <span className="text-xs font-semibold text-trust">Iniciar verificación →</span>
      </div>
    </Link>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="font-display text-lg font-semibold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
