/**
 * WhatsApp Business API — Notificaciones VeriCloset
 *
 * Chile tiene 90%+ de penetración de WhatsApp.
 * Usamos Meta Cloud API para mensajes transaccionales.
 *
 * Templates aprobados por Meta:
 *   - order_created       → "Tu compra está en camino a verificación"
 *   - verification_pass   → "¡Tu artículo pasó verificación! Llega en 2-3 días"
 *   - verification_fail   → "Artículo falso detectado — te reembolsamos"
 *   - delivered           → "¡Llegó! Tienes 48h para reportar problemas"
 *   - payout_sent         → "Tu pago de $X está en tu cuenta"
 *   - seller_ship_reminder → "Recuerda enviar tu artículo a VeriCloset"
 */

const WA_PHONE_ID = import.meta.env.VITE_WA_PHONE_ID ?? "";
const WA_TOKEN = import.meta.env.VITE_WA_TOKEN ?? "";
const WA_BASE = `https://graph.facebook.com/v19.0/${WA_PHONE_ID}/messages`;

// ─── Types ───────────────────────────────────────────────────────────────────

export type WaTemplate =
  | "order_created"
  | "verification_pass"
  | "verification_fail"
  | "verification_mismatch"
  | "delivered"
  | "dispute_opened"
  | "payout_sent"
  | "seller_ship_reminder"
  | "seller_sold"
  | "strike_issued";

interface WaTemplateConfig {
  name: string;
  language: "es";
  components: WaComponent[];
}

interface WaComponent {
  type: "body" | "header" | "button";
  parameters: WaParameter[];
}

interface WaParameter {
  type: "text" | "currency" | "date_time";
  text?: string;
  currency?: { fallback_value: string; code: "CLP"; amount_1000: number };
}

// ─── Helper ──────────────────────────────────────────────────────────────────

async function sendWa(phone: string, template: WaTemplateConfig): Promise<void> {
  // Formatear número chileno: 9XXXXXXXX → +569XXXXXXXX
  const formatted = formatChileanPhone(phone);

  const body = {
    messaging_product: "whatsapp",
    to: formatted,
    type: "template",
    template,
  };

  const res = await fetch(WA_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`WhatsApp error para ${formatted}:`, err);
    // No lanzamos error — notificación fallida no debe romper el flujo
  }
}

function formatChileanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("56")) return `+${digits}`;
  if (digits.startsWith("9") && digits.length === 9) return `+56${digits}`;
  if (digits.length === 8) return `+569${digits}`;
  return `+56${digits}`;
}

// ─── Notificaciones específicas ───────────────────────────────────────────────

/** Comprador: orden creada, pago autorizado */
export async function notifyOrderCreated(params: {
  buyerPhone: string;
  buyerName: string;
  orderId: string;
  productTitle: string;
  totalClp: number;
}): Promise<void> {
  await sendWa(params.buyerPhone, {
    name: "vericloset_order_created",
    language: "es",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: params.buyerName },
        { type: "text", text: params.productTitle },
        { type: "text", text: `#${params.orderId.slice(0, 8).toUpperCase()}` },
        {
          type: "currency",
          currency: {
            fallback_value: `$${params.totalClp.toLocaleString("es-CL")}`,
            code: "CLP",
            amount_1000: params.totalClp * 1000,
          },
        },
      ],
    }],
  });
}

/** Vendedor: su artículo fue vendido */
export async function notifySellerSold(params: {
  sellerPhone: string;
  sellerName: string;
  productTitle: string;
  orderId: string;
}): Promise<void> {
  await sendWa(params.sellerPhone, {
    name: "vericloset_seller_sold",
    language: "es",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: params.sellerName },
        { type: "text", text: params.productTitle },
        { type: "text", text: "48 horas" },
      ],
    }],
  });
}

/** Vendedor: recordatorio de envío */
export async function notifySellerShipReminder(params: {
  sellerPhone: string;
  sellerName: string;
  orderId: string;
  hoursLeft: number;
}): Promise<void> {
  await sendWa(params.sellerPhone, {
    name: "vericloset_ship_reminder",
    language: "es",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: params.sellerName },
        { type: "text", text: String(params.hoursLeft) },
        { type: "text", text: `#${params.orderId.slice(0, 8).toUpperCase()}` },
      ],
    }],
  });
}

/** Comprador: verificación aprobada, artículo en camino */
export async function notifyVerificationPass(params: {
  buyerPhone: string;
  buyerName: string;
  productTitle: string;
  trackingNumber: string;
  carrier: string;
}): Promise<void> {
  await sendWa(params.buyerPhone, {
    name: "vericloset_verification_pass",
    language: "es",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: params.buyerName },
        { type: "text", text: params.productTitle },
        { type: "text", text: params.carrier },
        { type: "text", text: params.trackingNumber },
      ],
    }],
  });
}

/** Comprador: artículo falso — reembolso iniciado */
export async function notifyVerificationFail(params: {
  buyerPhone: string;
  buyerName: string;
  productTitle: string;
  totalClp: number;
}): Promise<void> {
  await sendWa(params.buyerPhone, {
    name: "vericloset_verification_fail",
    language: "es",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: params.buyerName },
        { type: "text", text: params.productTitle },
        {
          type: "currency",
          currency: {
            fallback_value: `$${params.totalClp.toLocaleString("es-CL")}`,
            code: "CLP",
            amount_1000: params.totalClp * 1000,
          },
        },
      ],
    }],
  });
}

/** Comprador: artículo entregado — ventana de 48h */
export async function notifyDelivered(params: {
  buyerPhone: string;
  buyerName: string;
  productTitle: string;
  disputeDeadline: string; // "26 de mayo, 15:30"
}): Promise<void> {
  await sendWa(params.buyerPhone, {
    name: "vericloset_delivered",
    language: "es",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: params.buyerName },
        { type: "text", text: params.productTitle },
        { type: "text", text: params.disputeDeadline },
      ],
    }],
  });
}

/** Vendedor: pago liberado */
export async function notifyPayoutSent(params: {
  sellerPhone: string;
  sellerName: string;
  amountClp: number;
  productTitle: string;
}): Promise<void> {
  await sendWa(params.sellerPhone, {
    name: "vericloset_payout_sent",
    language: "es",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: params.sellerName },
        { type: "text", text: params.productTitle },
        {
          type: "currency",
          currency: {
            fallback_value: `$${params.amountClp.toLocaleString("es-CL")}`,
            code: "CLP",
            amount_1000: params.amountClp * 1000,
          },
        },
      ],
    }],
  });
}

/** Vendedor: strike recibido */
export async function notifyStrikeIssued(params: {
  sellerPhone: string;
  sellerName: string;
  reason: string;
  strikeCount: number;
}): Promise<void> {
  await sendWa(params.sellerPhone, {
    name: "vericloset_strike_issued",
    language: "es",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: params.sellerName },
        { type: "text", text: params.reason },
        { type: "text", text: String(params.strikeCount) },
      ],
    }],
  });
}
