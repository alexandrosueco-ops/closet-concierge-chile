/**
 * Shipit.cl — Agregador de envíos para Chile
 *
 * UNA sola API que maneja: Chilexpress, Starken, CorreosChile, BlueExpress
 * Docs: https://api.shipit.cl/docs
 *
 * Ventaja clave: No necesitamos integrar 3 carriers por separado.
 * Shipit cotiza, crea, rastrea y genera etiquetas por todos.
 */

const SHIPIT_BASE = "https://api.shipit.cl/v1";
const SHIPIT_TOKEN = import.meta.env.VITE_SHIPIT_TOKEN ?? "";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ShipitCarrier = "chilexpress" | "starken" | "correos" | "bluexpress";
export type ShipitSize = "XS" | "S" | "M" | "L" | "XL";

export interface ShipitAddress {
  full_name: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  apartment?: string;
  district: string;    // Comuna
  city: string;
  region: string;
  zip_code?: string;
}

export interface ShipitQuote {
  carrier: ShipitCarrier;
  carrier_name: string;
  service_type: string;
  price: number;       // CLP
  delivery_days: number;
  logo_url: string;
}

export interface ShipitPackage {
  id: string;
  tracking_number: string;
  carrier: ShipitCarrier;
  status: ShipitPackageStatus;
  label_url: string;     // PDF para imprimir
  label_zpl?: string;    // ZPL para Zebra
  estimated_delivery: string;
  created_at: string;
}

export type ShipitPackageStatus =
  | "created"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed_attempt"
  | "returned"
  | "cancelled";

export interface ShipitTracking {
  package_id: string;
  tracking_number: string;
  carrier: ShipitCarrier;
  status: ShipitPackageStatus;
  status_label: string;    // Texto en español
  events: ShipitTrackingEvent[];
  estimated_delivery: string;
}

export interface ShipitTrackingEvent {
  timestamp: string;
  description: string;
  location?: string;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

async function shipitFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${SHIPIT_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Token token=${SHIPIT_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Shipit error ${res.status}: ${err}`);
  }

  return res.json() as Promise<T>;
}

// ─── Dirección del centro de distribución VeriCloset ─────────────────────────

export const WAREHOUSE_ADDRESS: ShipitAddress = {
  full_name: "VeriCloset Centro de Verificación",
  phone: "+56912345678",
  email: "bodega@vericloset.cl",
  street: "Av. El Salto",
  number: "4447",
  district: "Huechuraba",
  city: "Santiago",
  region: "Metropolitana",
  zip_code: "8580000",
};

// ─── Cotizar envío (compara todos los carriers) ───────────────────────────────

export async function quoteShipment(params: {
  origin: ShipitAddress;
  destination: ShipitAddress;
  weight_kg: number;
  size?: ShipitSize;
}): Promise<ShipitQuote[]> {
  const body = {
    origin: {
      district: params.origin.district,
      region: params.origin.region,
    },
    destination: {
      district: params.destination.district,
      region: params.destination.region,
    },
    package: {
      weight: params.weight_kg,
      size: params.size ?? "S",
    },
  };

  const result = await shipitFetch<{ quotes: ShipitQuote[] }>("/quotes", {
    method: "POST",
    body: JSON.stringify(body),
  });

  // Ordenar por precio ascendente
  return result.quotes.sort((a, b) => a.price - b.price);
}

// ─── Crear etiqueta de envío inbound (vendedor → bodega) ─────────────────────

export async function createInboundShipment(params: {
  orderId: string;
  sellerAddress: ShipitAddress;
  weightKg?: number;
  carrier?: ShipitCarrier;
}): Promise<ShipitPackage> {
  const body = {
    external_reference: `INB-${params.orderId}`,
    carrier: params.carrier ?? "chilexpress",   // Default inbound: Chilexpress
    origin: params.sellerAddress,
    destination: WAREHOUSE_ADDRESS,
    package: {
      weight: params.weightKg ?? 0.5,
      size: "S" as ShipitSize,
      description: `Orden ${params.orderId} — VeriCloset`,
    },
    options: {
      generate_pdf: true,
      generate_zpl: true,
      insurance: false,
    },
    metadata: {
      order_id: params.orderId,
      direction: "inbound",
    },
  };

  return shipitFetch<ShipitPackage>("/packages", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ─── Crear etiqueta outbound (bodega → comprador) ─────────────────────────────

export async function createOutboundShipment(params: {
  orderId: string;
  buyerAddress: ShipitAddress;
  weightKg?: number;
  preferCheapest?: boolean;
}): Promise<ShipitPackage> {
  // Cotizar primero si se prefiere el más barato
  let carrier: ShipitCarrier = "chilexpress";

  if (params.preferCheapest) {
    const quotes = await quoteShipment({
      origin: WAREHOUSE_ADDRESS,
      destination: params.buyerAddress,
      weight_kg: params.weightKg ?? 0.5,
    });
    if (quotes.length > 0) {
      carrier = quotes[0].carrier;
    }
  }

  const body = {
    external_reference: `OUT-${params.orderId}`,
    carrier,
    origin: WAREHOUSE_ADDRESS,
    destination: params.buyerAddress,
    package: {
      weight: params.weightKg ?? 0.5,
      size: "S" as ShipitSize,
      description: `VeriCloset — Orden ${params.orderId} — Verificado ✓`,
    },
    options: {
      generate_pdf: true,
      generate_zpl: true,
      insurance: true,     // Outbound siempre con seguro
    },
    metadata: {
      order_id: params.orderId,
      direction: "outbound",
      verified: true,
    },
  };

  return shipitFetch<ShipitPackage>("/packages", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ─── Seguimiento ─────────────────────────────────────────────────────────────

export async function trackShipment(packageId: string): Promise<ShipitTracking> {
  return shipitFetch<ShipitTracking>(`/packages/${packageId}/tracking`);
}

// ─── Obtener estado en español ────────────────────────────────────────────────

export function statusLabel(status: ShipitPackageStatus): string {
  const labels: Record<ShipitPackageStatus, string> = {
    created: "Etiqueta generada",
    picked_up: "Retirado por carrier",
    in_transit: "En tránsito",
    out_for_delivery: "En reparto",
    delivered: "Entregado",
    failed_attempt: "Intento fallido",
    returned: "Devuelto",
    cancelled: "Cancelado",
  };
  return labels[status] ?? status;
}

// ─── Carrier display info ──────────────────────────────────────────────────────

export function carrierInfo(carrier: ShipitCarrier): { name: string; color: string } {
  const info: Record<ShipitCarrier, { name: string; color: string }> = {
    chilexpress: { name: "Chilexpress", color: "#E31E24" },
    starken: { name: "Starken", color: "#FF6B00" },
    correos: { name: "Correos Chile", color: "#E8B800" },
    bluexpress: { name: "Blue Express", color: "#003DA5" },
  };
  return info[carrier];
}
