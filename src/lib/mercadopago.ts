/**
 * MercadoPago Marketplace API — VeriCloset Chile
 *
 * Flujo escrow:
 * 1. Comprador paga → dinero queda retenido en cuenta de VeriCloset
 * 2. Verificación aprobada + entrega + 48h → release al vendedor
 * 3. Fallo → reembolso al comprador
 *
 * Docs: https://www.mercadopago.cl/developers/es/docs/marketplace
 */

const MP_BASE = "https://api.mercadopago.com";
const MP_ACCESS_TOKEN = import.meta.env.VITE_MP_ACCESS_TOKEN ?? "";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MPPreferenceItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  currency_id: "CLP";
  unit_price: number;
}

export interface MPPreferenceResult {
  id: string;
  init_point: string;     // URL checkout producción
  sandbox_init_point: string;
  date_created: string;
  external_reference: string;
}

export interface MPPayment {
  id: number;
  status: "approved" | "pending" | "rejected" | "cancelled" | "refunded" | "in_process";
  status_detail: string;
  operation_type: string;
  transaction_amount: number;
  marketplace_fee: number;
  net_amount: number;
  external_reference: string;
  payer: {
    id?: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  date_approved?: string;
  money_release_date?: string;
}

export interface MPRefundResult {
  id: number;
  payment_id: number;
  amount: number;
  status: string;
  date_created: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function mpFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${MP_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": crypto.randomUUID(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MercadoPago error ${res.status}: ${err}`);
  }

  return res.json() as Promise<T>;
}

// ─── Crear preferencia de pago (checkout) ───────────────────────────────────
//
// El dinero llega a VeriCloset. marketplace_fee = nuestra comisión.
// El resto queda retenido hasta que liberamos con releasePayment().

export async function createPaymentPreference(params: {
  orderId: string;
  item: MPPreferenceItem;
  buyerEmail: string;
  sellerMpId: string;        // MP account ID del vendedor
  platformFeeClp: number;    // Nuestra comisión en CLP
  backUrls: {
    success: string;
    failure: string;
    pending: string;
  };
}): Promise<MPPreferenceResult> {
  const body = {
    items: [params.item],
    payer: { email: params.buyerEmail },
    marketplace_fee: params.platformFeeClp,
    external_reference: params.orderId,
    back_urls: params.backUrls,
    auto_return: "approved",
    binary_mode: true,   // Solo aprobado o rechazado (sin pendiente)
    expires: true,
    expiration_date_to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    statement_descriptor: "VERICLOSET",
    notification_url: `${import.meta.env.VITE_APP_URL}/api/mp-webhook`,
    metadata: {
      order_id: params.orderId,
      seller_mp_id: params.sellerMpId,
    },
  };

  return mpFetch<MPPreferenceResult>("/checkout/preferences", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ─── Consultar estado de pago ────────────────────────────────────────────────

export async function getPayment(mpPaymentId: string): Promise<MPPayment> {
  return mpFetch<MPPayment>(`/v1/payments/${mpPaymentId}`);
}

// ─── Liberar pago al vendedor (escrow release) ───────────────────────────────
//
// Solo se llama cuando:
//   - Verificación PASS
//   - Entregado al comprador
//   - 48h sin disputa

export async function releasePayment(mpPaymentId: string): Promise<{ status: string }> {
  return mpFetch<{ status: string }>(
    `/v1/payments/${mpPaymentId}`,
    {
      method: "PUT",
      body: JSON.stringify({ money_release_date: new Date().toISOString() }),
    }
  );
}

// ─── Reembolso (verificación fallida o disputa) ──────────────────────────────

export async function refundPayment(
  mpPaymentId: string,
  amountClp?: number  // Undefined = reembolso total
): Promise<MPRefundResult> {
  const body = amountClp ? { amount: amountClp } : {};
  return mpFetch<MPRefundResult>(`/v1/payments/${mpPaymentId}/refunds`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ─── Buscar pago por referencia de orden ────────────────────────────────────

export async function findPaymentByOrder(orderId: string): Promise<MPPayment | null> {
  const res = await mpFetch<{ results: MPPayment[] }>(
    `/v1/payments/search?external_reference=${orderId}&sort=date_created&criteria=desc&range=date_created`
  );
  return res.results?.[0] ?? null;
}

// ─── Formato CLP ────────────────────────────────────────────────────────────

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─── Calcular desglose de fees ───────────────────────────────────────────────

export function calculateFees(priceCLP: number): {
  sellerFeeClp: number;       // 12% comisión vendedor
  buyerProtectionClp: number; // 5% cargo comprador
  platformTotalClp: number;   // Lo que recibe VeriCloset
  sellerReceivesClp: number;  // Lo que recibe el vendedor
  buyerPaysClp: number;       // Total que paga comprador
} {
  const sellerFeeClp = Math.round(priceCLP * 0.12);
  const buyerProtectionClp = Math.round(priceCLP * 0.05);
  const buyerPaysClp = priceCLP + buyerProtectionClp;
  const sellerReceivesClp = priceCLP - sellerFeeClp;
  const platformTotalClp = sellerFeeClp + buyerProtectionClp;

  return {
    sellerFeeClp,
    buyerProtectionClp,
    platformTotalClp,
    sellerReceivesClp,
    buyerPaysClp,
  };
}
