/**
 * Fintoc API — Transferencias bancarias chilenas para vendedores
 *
 * En Chile, los vendedores esperan recibir su dinero por transferencia
 * bancaria a su RUT. No wallets, no PayPal — transferencia a la cuenta.
 *
 * Fintoc permite automatizar esto via API.
 * Docs: https://docs.fintoc.com/
 */

const FINTOC_BASE = "https://api.fintoc.com/v1";
const FINTOC_SECRET_KEY = import.meta.env.VITE_FINTOC_SECRET_KEY ?? "";

// ─── Bancos disponibles en Chile ─────────────────────────────────────────────

export const BANCOS_CHILE = [
  { code: "banco_de_chile", name: "Banco de Chile / Edwards" },
  { code: "banco_estado", name: "BancoEstado" },
  { code: "santander", name: "Santander" },
  { code: "bci", name: "BCI" },
  { code: "itau", name: "Itaú" },
  { code: "scotiabank", name: "Scotiabank" },
  { code: "bice", name: "BICE" },
  { code: "falabella", name: "Banco Falabella" },
  { code: "ripley", name: "Banco Ripley" },
  { code: "coopeuch", name: "Coopeuch" },
  { code: "prepago_los_heroes", name: "Los Héroes" },
  { code: "mercado_pago", name: "Mercado Pago" },
] as const;

export type BancoCode = typeof BANCOS_CHILE[number]["code"];

export const TIPOS_CUENTA = [
  { code: "cuenta_corriente", name: "Cuenta Corriente" },
  { code: "cuenta_vista", name: "Cuenta Vista / RUT" },
  { code: "cuenta_ahorro", name: "Cuenta de Ahorro" },
] as const;

export type TipoCuenta = typeof TIPOS_CUENTA[number]["code"];

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DatosBancarios {
  rut: string;                  // RUT del vendedor: "12.345.678-9"
  nombre_completo: string;
  banco: BancoCode;
  tipo_cuenta: TipoCuenta;
  numero_cuenta: string;
  email: string;
}

export interface FintocPaymentIntent {
  id: string;
  status: "created" | "pending" | "succeeded" | "failed" | "reversed";
  amount: number;               // CLP
  currency: "CLP";
  recipient_account: {
    holder_name: string;
    holder_id: string;          // RUT
    number: string;
    type: string;
    institution: { id: string; name: string };
  };
  reference_id: string;         // Nuestro ID interno
  created_at: string;
  error?: string;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

async function fintocFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers({
    Authorization: `Bearer ${FINTOC_SECRET_KEY}`,
    "Content-Type": "application/json",
    ...Object.fromEntries(new Headers(options.headers ?? {})),
  });

  const res = await fetch(`${FINTOC_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Fintoc error ${res.status}: ${err}`);
  }

  return res.json() as Promise<T>;
}

// ─── Validar RUT chileno ──────────────────────────────────────────────────────

export function validarRut(rut: string): boolean {
  const clean = rut.replace(/[.\-]/g, "").toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(clean)) return false;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  let sum = 0;
  let mult = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }

  const expected = 11 - (sum % 11);
  const dvExpected = expected === 11 ? "0" : expected === 10 ? "K" : String(expected);
  return dv === dvExpected;
}

/** Formatear RUT: 12345678-9 → 12.345.678-9 */
export function formatearRut(rut: string): string {
  const clean = rut.replace(/[.\-]/g, "");
  if (clean.length < 2) return rut;
  const dv = clean.slice(-1);
  const body = clean.slice(0, -1);
  return body.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
}

// ─── Crear transferencia bancaria ─────────────────────────────────────────────

export async function crearPago(params: {
  referenceId: string;    // payout_request ID
  amountClp: number;
  description: string;
  recipient: DatosBancarios;
}): Promise<FintocPaymentIntent> {
  const body = {
    currency: "CLP",
    amount: params.amountClp,
    reference_id: params.referenceId,
    message: params.description,
    recipient_account: {
      holder_name: params.recipient.nombre_completo,
      holder_id: params.recipient.rut.replace(/[.\-]/g, ""),
      number: params.recipient.numero_cuenta,
      type: params.recipient.tipo_cuenta,
      institution: { id: params.recipient.banco },
    },
  };

  return fintocFetch<FintocPaymentIntent>("/payment_intents", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** Consultar estado de un pago */
export async function consultarPago(fintocId: string): Promise<FintocPaymentIntent> {
  return fintocFetch<FintocPaymentIntent>(`/payment_intents/${fintocId}`);
}

/** Estado legible en español */
export function estadoPago(status: FintocPaymentIntent["status"]): {
  label: string;
  color: string;
} {
  const map: Record<FintocPaymentIntent["status"], { label: string; color: string }> = {
    created: { label: "Creado", color: "text-muted-foreground" },
    pending: { label: "Procesando", color: "text-warning" },
    succeeded: { label: "Pagado", color: "text-success" },
    failed: { label: "Fallido", color: "text-destructive" },
    reversed: { label: "Revertido", color: "text-destructive" },
  };
  return map[status];
}
